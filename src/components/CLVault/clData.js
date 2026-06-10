/**
 * Adapter that builds the CL-vault display shape consumed by the CL components
 * (ActiveRange, PositionComposition, CLDeposit/CLWithdraw, etc.).
 *
 * All token-level data comes from live sources — no per-vault mock config:
 *   - API `token`: symbols (tokenNames), icons (logoUrl), single-asset wrappers
 *     and per-token prices (wrappers[]), APY, TVL, usdPrice, pricePerFullShare,
 *     platform.
 *   - Vault contract (`chain`, via fetchCLChainData): token addresses + decimals,
 *     range ticks, weights, amounts.
 *   - Subgraph (`rebalances`): last rebalance time.
 */

const num = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export const isCLVault = token => Boolean(token && token.isCLVault)

const tickToPrice = (tick, dec0, dec1) => Number(1.0001 ** tick) * 10 ** (dec0 - dec1)

const FALLBACK_COLORS = ['#1652f0', '#627eea', '#f2a900', '#f0883e', '#26a17b', '#8247e5']
const colorFor = (symbol, index) => {
  if (!symbol) return FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  let hash = 0
  for (let i = 0; i < symbol.length; i += 1) hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
}

const lower = v => String(v || '').toLowerCase()

export const buildCLData = (token = {}, id, chain = null, rebalances = null) => {
  const address = token.vaultAddress || ''

  const names = Array.isArray(token.tokenNames) ? token.tokenNames : []
  const logos = (Array.isArray(token.logoUrl) ? token.logoUrl : []).map(u =>
    typeof u === 'string' && u.startsWith('.') ? u.slice(1) : u,
  )

  const apiWrappers = Array.isArray(token.wrappers) ? token.wrappers : []
  const wrapperByAddr = addr => apiWrappers.find(w => lower(w.tokenAddress) === lower(addr))

  const addr0 = (chain && chain.token0Address) || token.tokenAddress || apiWrappers[0]?.tokenAddress
  const otherWrapper = apiWrappers.find(w => lower(w.tokenAddress) !== lower(addr0))
  const addr1 = (chain && chain.token1Address) || otherWrapper?.tokenAddress

  const dec0 = chain && chain.dec0 != null ? chain.dec0 : num(token.decimals, 18)
  const dec1 = chain && chain.dec1 != null ? chain.dec1 : num(token.decimals, 18)

  const priceFromWrapper = addr => {
    const w = wrapperByAddr(addr)
    const p = w ? Number(w.priceUsd) : NaN
    return Number.isFinite(p) && p > 0 ? p : undefined
  }

  const token0 = {
    symbol: names[0] || 'Token 0',
    address: addr0,
    decimals: dec0,
    wrapper: wrapperByAddr(addr0)?.wrapperAddress,
    logo: logos[0],
    color: colorFor(names[0], 0),
    priceUsd: priceFromWrapper(addr0),
  }
  const token1 = {
    symbol: names[1] || 'Token 1',
    address: addr1,
    decimals: dec1,
    wrapper: wrapperByAddr(addr1)?.wrapperAddress,
    logo: logos[1],
    color: colorFor(names[1], 1),
    priceUsd: priceFromWrapper(addr1),
  }

  const platformStr = Array.isArray(token.platform) ? token.platform[0] : token.platform
  const protocol =
    typeof platformStr === 'string' && platformStr
      ? platformStr.split(/[-–]/)[0].trim()
      : 'Aerodrome'

  const liveApy = num(token.estimatedApy)
  const totalApy = liveApy > 0 ? liveApy : 0
  const livePps = num(token.pricePerFullShare)
  const sharePrice = livePps > 0 ? livePps / 1e18 : 1
  const tvlUsd = num(token.totalValueLocked)
  const underlyingUsdPrice = num(token.usdPrice)

  const hasTicks = Boolean(chain && chain.tickLower != null && chain.tickUpper != null)

  let price = null
  if (hasTicks) {
    const lowerPrice = tickToPrice(chain.tickLower, dec0, dec1)
    const upperPrice = tickToPrice(chain.tickUpper, dec0, dec1)
    let current
    if (chain.sqrtPriceX96 != null) {
      const ratio = Number(chain.sqrtPriceX96) / 2 ** 96
      current = ratio * ratio * 10 ** (dec0 - dec1)
    } else if (chain.currentTick != null) {
      current = tickToPrice(chain.currentTick, dec0, dec1)
    } else {
      current = (lowerPrice + upperPrice) / 2
    }
    price = {
      current,
      lower: lowerPrice,
      upper: upperPrice,
      unit: `${token0.symbol}/${token1.symbol}`,
    }
  }

  const inRange =
    chain && typeof chain.inRange === 'boolean'
      ? chain.inRange
      : price
        ? price.current >= price.lower && price.current <= price.upper
        : null

  const weights =
    chain && chain.weight0 != null ? { token0: chain.weight0, token1: chain.weight1 } : null

  const formatAmount = (raw, dec) => Number(raw) / 10 ** dec
  const amounts =
    chain && chain.amount0Raw != null
      ? {
          token0: formatAmount(chain.amount0Raw, dec0),
          token1: formatAmount(chain.amount1Raw, dec1),
        }
      : null

  const tickSpan = hasTicks ? chain.tickUpper - chain.tickLower : null
  const feeTier = tickSpan != null ? `${tickSpan}-tick width` : 'CL'

  return {
    protocol,
    type: 'Concentrated Liquidity',
    feeTier,
    network: 'base',
    vaultAddress: address,
    id,
    live: hasTicks,

    token0,
    token1,

    price,
    inRange,
    lastRebalance:
      rebalances && rebalances.lastRebalanceLabel ? rebalances.lastRebalanceLabel : '—',

    weights,
    amounts,
    tvlUsd,
    underlyingUsdPrice,

    sharePrice,

    apy: {
      total: Number(totalApy.toFixed(2)),
      daily: Number((totalApy / 365).toFixed(3)),
      breakdown: [
        { label: 'Trading fees', value: Number((totalApy * 0.6).toFixed(2)) },
        { label: 'AERO emissions (auto-compounded)', value: Number((totalApy * 0.4).toFixed(2)) },
      ],
      historical: {
        live: Number(totalApy.toFixed(2)),
        d7: null,
        d30: null,
        d180: null,
        d365: null,
        lifetime: null,
      },
    },

    walletBalances: { token0: 0, token1: 0 },
  }
}

export default buildCLData
