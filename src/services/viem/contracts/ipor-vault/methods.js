import { handleViemReadMethod } from '../..'

const name = async instance => {
  return await handleViemReadMethod('name', [], instance)
}

const symbol = async instance => {
  return await handleViemReadMethod('symbol', [], instance)
}

const decimals = async instance => {
  return await handleViemReadMethod('decimals', [], instance)
}

const getBalanceOf = async (instance, account) => {
  return await handleViemReadMethod('balanceOf', [account], instance)
}

const convertToAssets = async (instance, amount) => {
  return await handleViemReadMethod('convertToAssets', [amount], instance)
}

const convertToShares = async (instance, amount) => {
  return await handleViemReadMethod('convertToShares', [amount], instance)
}

const getTotalSupply = async instance => {
  return await handleViemReadMethod('totalSupply', [], instance)
}

const getTotalAssets = async instance => {
  return await handleViemReadMethod('totalAssets', [], instance)
}

const withdraw = async (amount, address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'withdraw',
    args: [amount, address, address],
    account: address,
  })

  return hash
}

const deposit = async (amount, address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'deposit',
    args: [amount, address],
    account: address,
  })

  return hash
}

const redeem = async (amount, address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'redeem',
    args: [amount, address, address],
    account: address,
  })

  return hash
}

export default {
  name,
  symbol,
  decimals,
  getBalanceOf,
  convertToAssets,
  convertToShares,
  getTotalSupply,
  getTotalAssets,
  withdraw,
  deposit,
  redeem,
}
