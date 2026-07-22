const STAKING_POOL_IDS = {
  cbeth: '0f45d730-b279-4629-8e11-ccb5cc3038b4',
  steth: '747c1d2a-c668-4682-b9f9-296708a3dd90',
}

export const stakingPoolIdForSymbol = symbol =>
  symbol ? STAKING_POOL_IDS[String(symbol).toLowerCase()] || null : null

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

export const fmtPct = (n, d = 2) => {
  if (n == null || !Number.isFinite(n)) return '—'
  return `~ ${n.toFixed(d)}%`
}

export const capColorForPct = pct => {
  if (pct >= 95) return '#ef4444'
  if (pct >= 80) return '#f97316'
  return '#5dcf46'
}
