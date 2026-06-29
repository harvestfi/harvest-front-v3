const CBETH = '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22'
const STETH = '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452'

const STAKING_APY_FALLBACK = {
  [CBETH.toLowerCase()]: 3.05,
  [STETH.toLowerCase()]: 3.2,
}

export const stakingYieldForSupply = supplyAsset => {
  if (!supplyAsset) return 0
  return STAKING_APY_FALLBACK[String(supplyAsset).toLowerCase()] || 0
}

export const median = values => {
  const nums = values.filter(v => Number.isFinite(v) && v >= 0)
  if (!nums.length) return null
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const fmtBps = bps => {
  if (bps == null || !Number.isFinite(bps)) return '—'
  return `~ ${Math.round(bps)} bps`
}

export const fmtInteractionCosts = (entryBps, exitBps) => {
  if (entryBps == null || exitBps == null) return '—'
  return `${fmtBps(entryBps)} entry / ${fmtBps(exitBps)} exit`
}

export const fmtPct = (n, d = 2) => {
  if (n == null || !Number.isFinite(n)) return '—'
  return `~ ${n.toFixed(d)}%`
}
