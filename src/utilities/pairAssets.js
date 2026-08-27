/**
 * Display identity for strategies that hold two assets.
 *
 * A pair vault reaches the UI keyed on the single asset it accounts in, so an
 * uncorrelated LP pair reads as single-asset exposure: one icon and one symbol.
 * Both legs are already described by the vault data — `wrappers` carries one
 * entry per pool token and the platform label is prefixed with
 * `TOKEN0/TOKEN1` — so the pair is derived from that here instead of being
 * spelled out vault by vault.
 *
 * Only the name and icons are restated. The platform label explains what the
 * strategy does and is left exactly as authored.
 */

const lower = value => String(value || '').toLowerCase()

// Icon files spell `+` out, e.g. USD+ -> usdplus.svg
const iconUrl = symbol => `./icons/${lower(symbol).replace(/\+/g, 'plus')}.svg`

// Leading `EURC/USDC` of `EURC/USDC 0.50% - Aero Automated CL`
const PAIR_PREFIX = /^([\w+.]+)\/([\w+.]+)/

const platformLabel = token => {
  const platform = Array.isArray(token.platform) ? token.platform[0] : token.platform
  return typeof platform === 'string' ? platform.trim() : ''
}

const symbolsFromWrappers = token =>
  (Array.isArray(token.wrappers) ? token.wrappers : []).reduce((symbols, wrapper) => {
    const symbol = wrapper && wrapper.tokenName
    if (symbol && !symbols.some(existing => lower(existing) === lower(symbol))) {
      symbols.push(symbol)
    }
    return symbols
  }, [])

const symbolsFromPlatform = token => {
  const matched = PAIR_PREFIX.exec(platformLabel(token))
  return matched ? [matched[1], matched[2]] : []
}

/**
 * Both legs of a pair vault in pool order, or `[]` for single-asset vaults.
 */
const getPairSymbols = token => {
  if (!token) {
    return []
  }
  const wrapped = symbolsFromWrappers(token)
  return wrapped.length > 1 ? wrapped : symbolsFromPlatform(token)
}

/**
 * The leg the vault accounts in. Share price, deposits and underlying earnings
 * are quoted in this asset, so it stays the unit wherever a single amount is
 * shown — the pair order used for display is the pool's, not the vault's.
 */
const getUnderlyingSymbol = token => {
  const wrappers = Array.isArray(token && token.wrappers) ? token.wrappers : []
  const underlying = wrappers.find(
    wrapper => lower(wrapper.tokenAddress) === lower(token && token.tokenAddress),
  )
  return (underlying && underlying.tokenName) || (token && token.tokenNames && token.tokenNames[0])
}

/**
 * Restates a pair vault as the two assets it actually holds. Single-asset
 * vaults, and vaults already listed with both legs, are returned untouched.
 */
const withPairDisplay = token => {
  const names = Array.isArray(token.tokenNames) ? token.tokenNames : []
  if (names.length > 1) {
    return token
  }

  const symbols = getPairSymbols(token)
  if (symbols.length < 2) {
    return token
  }

  const logos = Array.isArray(token.logoUrl) ? token.logoUrl : []
  const logoFor = symbol => {
    const index = names.findIndex(name => lower(name) === lower(symbol))
    return index !== -1 && logos[index] ? logos[index] : iconUrl(symbol)
  }

  return {
    ...token,
    tokenNames: symbols,
    logoUrl: symbols.map(logoFor),
  }
}

module.exports = { getPairSymbols, getUnderlyingSymbol, withPairDisplay }
