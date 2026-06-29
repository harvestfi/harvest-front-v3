import addresses from '../../data/harvest-api-v3/data/mainnet/addresses.json'
import { stakingYieldForSupply } from './loopHelpers'

const num = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const FALLBACK_COLORS = ['#1652f0', '#627eea']
const colorFor = (symbol, index) => {
  if (!symbol) return FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  let hash = 0
  for (let i = 0; i < symbol.length; i += 1) hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
}

const LOOP_VAULT_IDS = ['aaveLoop_ETH_cbETH', 'aaveLoop_ETH_cbETH2']

export const enrichLoopToken = (token = {}, vaultId) => {
  if (token.isLoopingVault && token.loopConfig) return token
  if (!vaultId || !LOOP_VAULT_IDS.includes(vaultId)) return token
  const cfg = addresses.BASE?.V2?.[vaultId]
  if (!cfg) return token
  return {
    ...token,
    isLoopingVault: true,
    loopConfig: {
      supplyAsset: cfg.SupplyAsset,
      borrowAsset: cfg.Underlying,
      aavePool: cfg.AavePool,
    },
  }
}

export const isLoopingVault = token => Boolean(token && token.isLoopingVault)

export const buildLoopData = (token = {}, id, chain = null, extras = {}) => {
  const names = Array.isArray(token.tokenNames) ? token.tokenNames : []
  const logos = (Array.isArray(token.logoUrl) ? token.logoUrl : []).map(u =>
    typeof u === 'string' && u.startsWith('.') ? u.slice(1) : u,
  )

  const loopCfg = token.loopConfig || {}
  const collateralSymbol = names[0] || 'cbETH'
  const debtSymbol = names[1] || 'ETH'
  const debtDisplaySymbol = debtSymbol === 'ETH' ? 'WETH' : debtSymbol

  const collateral = {
    symbol: collateralSymbol,
    address: loopCfg.supplyAsset,
    decimals: 18,
    logo: logos[0],
    color: colorFor(collateralSymbol, 0),
    priceUsd: num(token.usdPrice),
  }
  const debt = {
    symbol: debtSymbol,
    address: token.tokenAddress || loopCfg.borrowAsset,
    decimals: num(token.decimals, 18),
    logo: logos[1],
    color: colorFor(debtSymbol, 1),
    priceUsd: num(token.usdPrice),
  }

  const platformStr = Array.isArray(token.platform) ? token.platform[0] : token.platform
  const protocol =
    typeof platformStr === 'string' && platformStr.includes('Aave') ? 'Aave V3' : 'Aave'

  const liveApy = num(token.estimatedApy)
  const livePps = num(token.pricePerFullShare)
  const sharePrice = livePps > 0 ? livePps / 1e18 : 1
  const tvlUsd = num(token.totalValueLocked)

  const leverage = chain?.leverage > 0 ? chain.leverage : null
  const leverageLabel = leverage ? `${leverage.toFixed(1)}×` : '—'

  const structureLine = `Leveraged ${collateralSymbol}/${debtSymbol} carry on ${protocol}, ~${leverageLabel}`

  const stakingYield = stakingYieldForSupply(loopCfg.supplyAsset)
  const borrowRate = chain?.borrowRate
  const borrowApr = borrowRate != null && borrowRate > 0 ? -borrowRate : null
  const spread =
    stakingYield > 0 && borrowRate != null ? stakingYield - borrowRate : null
  const profitFactor = chain?.profitSharePct != null ? (100 - chain.profitSharePct) / 100 : 0.9
  const calculatedLeveredApy =
    spread != null && leverage > 0 ? spread * leverage * profitFactor : null
  const leveredApy =
    liveApy > 0 ? liveApy : calculatedLeveredApy

  const interactionCosts = extras.interactionCosts || {}

  return {
    protocol,
    type: 'Leveraged Loop',
    structureLine,
    leverage,
    leverageLabel,
    network: 'base',
    vaultAddress: token.vaultAddress || '',
    strategyAddress: token.strategyAddress || '',
    id,
    live: Boolean(chain),

    collateral,
    debt,
    underlying: debt,

    position: chain
      ? (() => {
          const ethUsd = num(token.usdPrice)
          const supplyPrice = chain.supplyPrice || 1
          const collateralUsd = chain.collateral * supplyPrice * ethUsd
          const debtUsd = chain.debt * ethUsd
          const netUsd = collateralUsd - debtUsd
          return {
            collateral: chain.collateral,
            debt: chain.debt,
            collateralValue: chain.collateralValue,
            debtValue: chain.debtValue,
            netValue: chain.netValue,
            collateralUsd,
            debtUsd,
            netUsd,
            supplyPrice,
            ltv: chain.ltv,
            targetLtv: chain.targetLtv,
            liquidationLtv: chain.liquidationLtv,
            leverage: chain.leverage,
            healthFactor: chain.healthFactor,
            targetHealth: chain.targetHealth,
            rebalanceTrigger: chain.rebalanceTrigger,
            forcedDeleverage: chain.forcedDeleverage,
          }
        })()
      : null,

    lastRebalance: extras.lastRebalanceLabel || '—',
    chainId: token.chain,

    mechanics: {
      targetLtv: chain?.targetLtv != null ? `${(chain.targetLtv * 100).toFixed(1)}%` : '—',
      slippageCap: '50 bps',
      rebalanceTrigger: chain?.rebalanceTrigger != null ? chain.rebalanceTrigger.toFixed(3) : '—',
    },

    fees: {
      entryFee: '0%',
      exitFee: '0%',
      profitSharePct: chain?.profitSharePct != null ? Math.round(chain.profitSharePct) : 10,
      entryCostBps30d: interactionCosts.entryBps30d ?? null,
      exitCostBps30d: interactionCosts.exitBps30d ?? null,
    },

    apy: {
      total: Number(liveApy.toFixed(2)),
      daily: Number((liveApy / 365).toFixed(3)),
      breakdown: [
        {
          label: `${collateralSymbol} staking yield`,
          value: stakingYield > 0 ? stakingYield : null,
        },
        {
          label: `${debtDisplaySymbol} borrow APR`,
          value: borrowApr,
        },
        {
          label: `Net spread × ${leverageLabel} leverage`,
          value: leveredApy,
        },
      ],
    },

    tvlUsd,
    underlyingUsdPrice: num(token.usdPrice),
    sharePrice,

    loopConfig: loopCfg,
    walletBalance: 0,
    userPosition: { vaultShares: 0, usdValue: 0 },
  }
}

export default buildLoopData
