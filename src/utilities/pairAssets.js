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
 * Only the name and icons are restated, and only for pairs whose legs can
 * actually diverge — a correlated pair is one exposure however it is split, so
 * it keeps its single-asset display. The platform label explains what the
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
 * Wrapped and staked forms of one base asset — cbETH/WETH, tBTC/cbBTC. A pair
 * drawn entirely from a single base is one exposure however it is split, so it
 * stays denominated in that asset.
 *
 * Limited to crypto bases on purpose. Fiat-pegged instruments are held apart by
 * issuer and peg risk however matched their reference — jEUR/EURC and
 * EURC/USDC both show two legs — as does anything this does not recognise.
 *
 * Symbols are tested exactly as authored. Normalising first would only ever
 * widen what counts as one exposure, and this is the branch that hides a leg.
 */
const CORRELATED_BASES = [/eth$/i, /btc$/i]

const isCorrelatedPair = symbols =>
  CORRELATED_BASES.some(base => symbols.every(symbol => base.test(String(symbol || ''))))

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
  if (underlying) {
    return underlying.tokenName
  }
  // Falling back to the first name is only sound while the vault is listed with
  // one asset. A restated pair is in pool order, where the leading leg need not
  // be the one the vault accounts in — better no unit than a wrong one.
  const names = Array.isArray(token && token.tokenNames) ? token.tokenNames : []
  return names.length === 1 ? names[0] : undefined
}

/**
 * Restates a pair vault as the two assets it actually holds. Single-asset
 * vaults, correlated pairs, and vaults already listed with both legs are
 * returned untouched.
 */
const withPairDisplay = token => {
  const names = Array.isArray(token.tokenNames) ? token.tokenNames : []
  if (names.length > 1) {
    return token
  }

  const symbols = getPairSymbols(token)
  if (symbols.length < 2 || isCorrelatedPair(symbols)) {
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

module.exports = { getPairSymbols, isCorrelatedPair, getUnderlyingSymbol, withPairDisplay }
