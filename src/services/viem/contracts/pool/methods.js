import { handleViemReadMethod } from '../..'

const balanceOf = async (address, instance) => {
  return await handleViemReadMethod('balanceOf', [address], instance)
}

const periodFinish = async instance => {
  return await handleViemReadMethod('periodFinish', [], instance)
}

const rewardPerToken = async instance => {
  return await handleViemReadMethod('rewardPerToken', [], instance)
}

const rewardRate = async instance => {
  return await handleViemReadMethod('rewardRate', [], instance)
}

const totalSupply = async instance => {
  return await handleViemReadMethod('totalSupply', [], instance)
}

const lpToken = async instance => {
  return await handleViemReadMethod('lpToken', [], instance)
}

const earned = async (rewardAddress, address, instance) => {
  return await handleViemReadMethod('earned', [rewardAddress, address], instance)
}

const totalEarned = async (address, instance) => {
  const singleParamEarnedAbi = {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'earned',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  }

  if (instance.publicClient) {
    return await instance.publicClient.readContract({
      address: instance.address,
      abi: [singleParamEarnedAbi],
      functionName: 'earned',
      args: [address],
    })
  }

  return await handleViemReadMethod('earned', [address], instance)
}

const stake = async (amount, address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'stake',
    args: [amount],
    account: address,
  })

  return hash
}

const exit = async (address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'exit',
    account: address,
  })

  return hash
}

const claim = async (address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'getReward',
    account: address,
  })

  return hash
}

const claimAll = async (address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'getAllRewards',
    account: address,
  })

  return hash
}

const migrate = async (address, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'migrate',
    account: address,
  })

  return hash
}

const withdraw = async (address, amount, instance) => {
  const { walletClient } = instance

  const hash = await walletClient.writeContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'withdraw',
    args: [amount],
    account: address,
  })

  return hash
}

export default {
  balanceOf,
  periodFinish,
  rewardPerToken,
  rewardRate,
  totalSupply,
  lpToken,
  totalEarned,
  earned,
  stake,
  exit,
  claim,
  claimAll,
  migrate,
  withdraw,
}
