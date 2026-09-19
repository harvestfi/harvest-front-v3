import { getVaultHistories } from './apiCalls'
import { calculateApyValue } from './parsers'
import { fromWei } from '../services/viem'

export const LOOP_APY_PERIOD_DAYS = 7

const SUCCESS_TTL_MS = 10 * 60 * 1000
const FAILURE_TTL_MS = 60 * 1000
const FETCH_TIMEOUT_MS = 8000

const cache = new Map()
const inFlight = new Map()

const withTimeout = promise =>
  Promise.race([
    promise,
    new Promise(resolve => {
      setTimeout(() => resolve(null), FETCH_TIMEOUT_MS)
    }),
  ])

const computeSevenDayApy = async token => {
  const decimals = token.decimals || token.data?.watchAsset?.decimals

  if (!token.vaultAddress || !token.chain || !decimals) {
    return null
  }

  const { vaultHData } = await getVaultHistories(token.vaultAddress, token.chain)
  const histories = (vaultHData || [])
    .filter(entry => entry.sharePrice !== '0')
    .map(entry =>
      entry.sharePrice === '1' ? { ...entry, sharePrice: '1000000000000000000' } : entry,
    )

  if (histories.length === 0) {
    return null
  }

  const totalPeriodDays =
    (Number(histories[0].timestamp) - Number(histories[histories.length - 1].timestamp)) /
    (24 * 3600)

  if (totalPeriodDays < LOOP_APY_PERIOD_DAYS) {
    return null
  }

  const latestSharePrice = fromWei(histories[0].sharePrice, decimals, decimals, false)
  const apy = calculateApyValue(histories, latestSharePrice, token, LOOP_APY_PERIOD_DAYS)

  return Number.isFinite(apy) ? apy : null
}

const getSevenDayApy = token => {
  const key = `${token.chain}-${String(token.vaultAddress).toLowerCase()}`
  const cached = cache.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value)
  }

  // The provider formats vaults more than once while the app boots - one query is enough.
  if (inFlight.has(key)) {
    return inFlight.get(key)
  }

  const request = (async () => {
    let value = null

    try {
      value = await withTimeout(computeSevenDayApy(token))
    } catch (e) {
      console.error('Error fetching 7d APY of looping vault:', e)
    }

    cache.set(key, {
      value,
      expiresAt: Date.now() + (value === null ? FAILURE_TTL_MS : SUCCESS_TTL_MS),
    })
    inFlight.delete(key)

    return value
  })()

  inFlight.set(key, request)

  return request
}

export const fetchLoopingVaultSevenDayApys = async vaults => {
  const sevenDayApys = {}

  await Promise.all(
    Object.keys(vaults)
      .filter(vaultSymbol => vaults[vaultSymbol].isLoopingVault)
      .map(async vaultSymbol => {
        const value = await getSevenDayApy(vaults[vaultSymbol])

        if (value !== null) {
          sevenDayApys[vaultSymbol] = value
        }
      }),
  )

  return sevenDayApys
}
