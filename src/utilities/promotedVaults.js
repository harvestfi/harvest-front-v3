import { PROMOTED_VAULTS } from '../constants'

const promotedAddress = token => {
  const address = (token && token.vaultAddress) || (token && token.data && token.data.vaultAddress)

  return typeof address === 'string' ? address.toLowerCase() : ''
}

export const getPromotedRank = token => PROMOTED_VAULTS.indexOf(promotedAddress(token))

export const isPromotedVault = token => getPromotedRank(token) !== -1
