import { handleViemReadMethod } from '../..'

const getPositionHealth = async instance => {
  return await handleViemReadMethod('positionHealth', [], instance)
}

const getTargetHealth = async instance => {
  return await handleViemReadMethod('targetHealth', [], instance)
}

const getCollateralFactorNumerator = async instance => {
  return await handleViemReadMethod('collateralFactorNumerator', [], instance)
}

const getBorrowTargetFactorNumerator = async instance => {
  return await handleViemReadMethod('borrowTargetFactorNumerator', [], instance)
}

const getProfitSharingNumerator = async instance => {
  return await handleViemReadMethod('profitSharingNumerator', [], instance)
}

const getFeeDenominator = async instance => {
  return await handleViemReadMethod('feeDenominator', [], instance)
}

const getBorrowPriceInSupply = async instance => {
  return await handleViemReadMethod('getBorrowPriceInSupply', [], instance)
}

export default {
  getPositionHealth,
  getTargetHealth,
  getCollateralFactorNumerator,
  getBorrowTargetFactorNumerator,
  getProfitSharingNumerator,
  getFeeDenominator,
  getBorrowPriceInSupply,
}
