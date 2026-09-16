import { getViem, handleViemReadMethod } from '../..'

const getUnderlyingBalanceWithInvestment = async instance => {
  return await handleViemReadMethod('underlyingBalanceWithInvestment', [], instance)
}

const getUnderlyingBalanceWithInvestmentForHolder = async (userAddress, instance) => {
  return await handleViemReadMethod(
    'underlyingBalanceWithInvestmentForHolder',
    [userAddress],
    instance,
  )
}

const getPricePerFullShare = async instance => {
  return await handleViemReadMethod('getPricePerFullShare', [], instance)
}

const getUnderlyingToken = async instance => {
  return await handleViemReadMethod('underlying', [], instance)
}

const decimals = async instance => {
  return await handleViemReadMethod('decimals', [], instance)
}

const getStrategy = async instance => {
  return await handleViemReadMethod('strategy', [], instance)
}

const getTotalSupply = async instance => {
  return await handleViemReadMethod('totalSupply', [], instance)
}

const awaitReceipt = async (instance, hash) => {
  if (!hash) {
    return hash
  }

  const { publicClient, walletClient } = instance
  let client = publicClient

  if (typeof client?.waitForTransactionReceipt !== 'function') {
    const chainId = walletClient?.chain?.id ?? publicClient?.chain?.id
    client = await getViem(chainId ? String(chainId) : '', false)
  }

  if (typeof client?.waitForTransactionReceipt === 'function') {
    await client.waitForTransactionReceipt({ hash })
  }

  return hash
}

const withdraw = async (amount, address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'withdraw',
    args: [amount],
    account: address,
  })

  return awaitReceipt(instance, hash)
}

const deposit = async (amount, address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'deposit',
    args: [amount],
    account: address,
  })

  return awaitReceipt(instance, hash)
}

export default {
  getUnderlyingBalanceWithInvestment,
  getUnderlyingBalanceWithInvestmentForHolder,
  getPricePerFullShare,
  getUnderlyingToken,
  decimals,
  withdraw,
  getStrategy,
  getTotalSupply,
  deposit,
}
