import { handleViemReadMethod } from '../..'

const getTickLower = async instance => {
  return await handleViemReadMethod('tickLower', [], instance)
}

const getTickUpper = async instance => {
  return await handleViemReadMethod('tickUpper', [], instance)
}

const getTickSpacing = async instance => {
  return await handleViemReadMethod('tickSpacing', [], instance)
}

const getCurrentTokenWeights = async instance => {
  return await handleViemReadMethod('getCurrentTokenWeights', [], instance)
}

const getCurrentTokenAmounts = async instance => {
  return await handleViemReadMethod('getCurrentTokenAmounts', [], instance)
}

const getTargetWidth = async instance => {
  return await handleViemReadMethod('targetWidth', [], instance)
}

const getSqrtPriceX96 = async instance => {
  return await handleViemReadMethod('getSqrtPriceX96', [], instance)
}

const getToken0 = async instance => {
  return await handleViemReadMethod('token0', [], instance)
}

const getToken1 = async instance => {
  return await handleViemReadMethod('token1', [], instance)
}

const getPricePerFullShare = async instance => {
  return await handleViemReadMethod('getPricePerFullShare', [], instance)
}

const getBalanceOf = async (address, instance) => {
  return await handleViemReadMethod('balanceOf', [address], instance)
}

const getTotalSupply = async instance => {
  return await handleViemReadMethod('totalSupply', [], instance)
}

const getDecimals = async instance => {
  return await handleViemReadMethod('decimals', [], instance)
}

// deposit(amount0, amount1, amountOutMin) -> minted shares
const deposit = async (amount0, amount1, amountOutMin, address, instance) => {
  const { walletClient } = instance
  return await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'deposit',
    args: [amount0, amount1, amountOutMin],
    account: address,
    chain: walletClient.chain,
  })
}

// withdraw(shares, amount0OutMin, amount1OutMin) -> (amount0, amount1)
const withdraw = async (shares, amount0OutMin, amount1OutMin, address, instance) => {
  const { walletClient } = instance
  return await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'withdraw',
    args: [shares, amount0OutMin, amount1OutMin],
    account: address,
    chain: walletClient.chain,
  })
}

export default {
  getTickLower,
  getTickUpper,
  getTickSpacing,
  getCurrentTokenWeights,
  getCurrentTokenAmounts,
  getTargetWidth,
  getSqrtPriceX96,
  getToken0,
  getToken1,
  getPricePerFullShare,
  getBalanceOf,
  getTotalSupply,
  getDecimals,
  deposit,
  withdraw,
}
