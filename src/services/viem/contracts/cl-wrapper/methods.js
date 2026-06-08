import { handleViemReadMethod } from '../..'

const DEPOSIT_WITH_MIN_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_assets', type: 'uint256' },
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_minOut', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const REDEEM_WITH_MIN_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_shares', type: 'uint256' },
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'address', name: '_owner', type: 'address' },
      { internalType: 'uint256', name: '_minOut', type: 'uint256' },
    ],
    name: 'redeem',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const getAsset = async instance => {
  return await handleViemReadMethod('asset', [], instance)
}

const getBalanceOf = async (address, instance) => {
  return await handleViemReadMethod('balanceOf', [address], instance)
}

const getAssetsOf = async (address, instance) => {
  return await handleViemReadMethod('assetsOf', [address], instance)
}

const previewDeposit = async (assets, instance) => {
  return await handleViemReadMethod('previewDeposit', [assets], instance)
}

const previewRedeem = async (shares, instance) => {
  return await handleViemReadMethod('previewRedeem', [shares], instance)
}

const getMaxRedeem = async (address, instance) => {
  return await handleViemReadMethod('maxRedeem', [address], instance)
}

// deposit(assets, receiver, minOut) -> shares
const deposit = async (assets, receiver, minOut, address, instance) => {
  const { walletClient } = instance
  return await walletClient.writeContract({
    address: instance.address,
    abi: DEPOSIT_WITH_MIN_ABI,
    functionName: 'deposit',
    args: [assets, receiver, minOut],
    account: address,
    chain: walletClient.chain,
  })
}

// redeem(shares, receiver, owner, minOut) -> assets
const redeem = async (shares, receiver, owner, minOut, address, instance) => {
  const { walletClient } = instance
  return await walletClient.writeContract({
    address: instance.address,
    abi: REDEEM_WITH_MIN_ABI,
    functionName: 'redeem',
    args: [shares, receiver, owner, minOut],
    account: address,
    chain: walletClient.chain,
  })
}

export default {
  getAsset,
  getBalanceOf,
  getAssetsOf,
  previewDeposit,
  previewRedeem,
  getMaxRedeem,
  deposit,
  redeem,
}
