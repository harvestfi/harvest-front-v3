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
  const v = Number(bps)
  if (bps == null || !Number.isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs === 0) return '~ 0 bps'
  if (abs < 0.01) return v > 0 ? '< 0.01 bps' : '> -0.01 bps'
  if (abs < 1) return `~ ${Number(v.toFixed(2))} bps`
  if (abs < 10) return `~ ${Number(v.toFixed(1))} bps`
  return `~ ${Math.round(v)} bps`
}

export const UI_MAX_DISPLAY_DECIMALS = 6

export const fmtTokenAmount = (n, d = 4) => {
  const v = Number(n)
  if (!Number.isFinite(v) || v === 0) return '0'
  const abs = Math.abs(v)
  if (abs >= 1) return v.toLocaleString(undefined, { maximumFractionDigits: d })
  const floor = 10 ** -UI_MAX_DISPLAY_DECIMALS
  if (abs < floor)
    return v > 0
      ? `< ${floor.toFixed(UI_MAX_DISPLAY_DECIMALS)}`
      : `> -${floor.toFixed(UI_MAX_DISPLAY_DECIMALS)}`
  const digits = Math.min(UI_MAX_DISPLAY_DECIMALS, Math.max(d, Math.ceil(-Math.log10(abs)) + 2))
  return v.toLocaleString(undefined, { maximumFractionDigits: digits })
}

const isBounded = text => /^[-+]?[<>]/.test(text)

export const fmtApproxToken = (n, symbol, d = 4) => {
  const text = fmtTokenAmount(n, d)
  return `${isBounded(text) ? '' : '~ '}${text}${symbol ? ` ${symbol}` : ''}`
}

export const fmtApproxUsd = n => {
  const text = fmtUsdAmount(n)
  return isBounded(text) ? text : `~ ${text}`
}

export const UI_MAX_INPUT_DECIMALS = 10

export const truncateForDisplay = (value, max = UI_MAX_INPUT_DECIMALS) => {
  if (value == null || value === '') return ''
  let str = String(value)
  const exponential = /e/i.test(str)
  if (exponential) {
    const n = Number(str)
    if (!Number.isFinite(n)) return str
    str = n.toFixed(20)
  }
  const dot = str.indexOf('.')
  if (dot === -1) return str
  if (!exponential && str.length - dot - 1 <= max) return str
  const cut = str.slice(0, dot + 1 + max).replace(/0+$/, '')
  const trimmed = cut.endsWith('.') ? cut.slice(0, -1) : cut
  if (Number(trimmed) === 0 && Number(value) !== 0) return String(value)
  return trimmed
}

export const fmtUsdAmount = n => {
  const v = Number(n)
  if (!Number.isFinite(v) || v === 0) return '$0'
  const abs = Math.abs(v)
  const sign = v < 0 ? '-' : ''
  if (abs >= 1000) return `${sign}$${Math.round(abs).toLocaleString()}`
  if (abs < 0.01) return `${sign}<$0.01`
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
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
