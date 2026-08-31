const { tokens } = require('../data')

const PLACEHOLDER_LOGO = 'https://etherscan.io/images/main/empty-token.png'

const lower = value => String(value || '').toLowerCase()

const normalize = symbol => lower(symbol).replace(/\+/g, 'plus')

const iconName = url => normalize(url.replace(/^.*\//, '').replace(/\.[^.]+$/, ''))

const buildIndex = () => {
  const index = new Map()
  Object.keys(tokens).forEach(key => {
    const token = tokens[key]
    const logos = Array.isArray(token.logoUrl) ? token.logoUrl : []
    if (logos.length !== 1 || !logos[0]) {
      return
    }
    if (typeof token.tokenAddress !== 'string' || !token.chain) {
      return
    }
    const indexKey = `${token.chain}:${lower(token.tokenAddress)}`
    const candidates = index.get(indexKey) || []
    if (!candidates.includes(logos[0])) {
      candidates.push(logos[0])
      index.set(indexKey, candidates)
    }
  })
  return index
}

let iconIndex = null

const getRegistryTokenIcon = (chainId, address, symbol) => {
  if (!chainId || !address) {
    return null
  }
  if (!iconIndex) {
    iconIndex = buildIndex()
  }
  const candidates = iconIndex.get(`${String(chainId)}:${lower(address)}`)
  if (!candidates || candidates.length === 0) {
    return null
  }
  const matched = candidates.find(url => iconName(url) === normalize(symbol))
  return (matched || candidates[0]).replace(/^\./, '')
}

const getPortalsTokenImage = portalsToken => {
  if (!portalsToken) {
    return PLACEHOLDER_LOGO
  }
  if (portalsToken.image) {
    return portalsToken.image
  }
  const images = Array.isArray(portalsToken.images) ? portalsToken.images : []
  return images[0] || PLACEHOLDER_LOGO
}

const resolveTokenLogo = (chainId, portalsToken) => {
  if (!portalsToken) {
    return PLACEHOLDER_LOGO
  }
  const registryIcon = getRegistryTokenIcon(chainId, portalsToken.address, portalsToken.symbol)
  return registryIcon || getPortalsTokenImage(portalsToken)
}

module.exports = {
  PLACEHOLDER_LOGO,
  getRegistryTokenIcon,
  getPortalsTokenImage,
  resolveTokenLogo,
}
