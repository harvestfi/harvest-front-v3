import { handleViemReadMethod } from '../..'

const getPrice = async (assetToken, quoteToken, instance) => {
  return await handleViemReadMethod('getPrice', [assetToken, quoteToken], instance)
}

export default {
  getPrice,
}
