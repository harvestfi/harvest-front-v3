import { handleViemReadMethod } from '../..'

const getPricePerFullShare = async instance => {
  return await handleViemReadMethod('getPricePerFullShare', [], instance)
}

const previewDeposit = async (assets, instance) => {
  return await handleViemReadMethod('previewDeposit', [assets], instance)
}

const getBalanceOf = async (address, instance) => {
  return await handleViemReadMethod('balanceOf', [address], instance)
}

const getAssetsOf = async (address, instance) => {
  return await handleViemReadMethod('assetsOf', [address], instance)
}

const getUnderlying = async instance => {
  return await handleViemReadMethod('underlying', [], instance)
}

const getTotalSupply = async instance => {
  return await handleViemReadMethod('totalSupply', [], instance)
}

// deposit(_assets, _receiver) -> minted shares (ERC-4626-compatible overload)
const deposit = async (assets, receiver, address, instance) => {
  const { walletClient } = instance
  return await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'deposit',
    args: [assets, receiver],
    account: address,
    chain: walletClient.chain,
  })
}

// withdraw(numberOfShares) -> assets out
const withdraw = async (shares, address, instance) => {
  const { walletClient } = instance
  return await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'withdraw',
    args: [shares],
    account: address,
    chain: walletClient.chain,
  })
}

export default {
  getPricePerFullShare,
  previewDeposit,
  getBalanceOf,
  getAssetsOf,
  getUnderlying,
  getTotalSupply,
  deposit,
  withdraw,
}
