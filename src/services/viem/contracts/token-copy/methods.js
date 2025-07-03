import { handleViemReadMethod } from '../../index'

const getBalance = async (address, instance) =>
  await handleViemReadMethod('balanceOf', [address], instance)

const getApprovedAmount = async (address, contractAddress, instance) =>
  await handleViemReadMethod('allowance', [address, contractAddress], instance)

const approve = async (address, userAddress, amount, instance) => {
  if (instance.address && instance.abi) {
    const walletClient = instance.walletClient || instance.client

    if (walletClient && walletClient.writeContract) {
      const hash = await walletClient.writeContract({
        address: instance.address,
        abi: instance.abi,
        functionName: 'approve',
        args: [address, amount],
        account: userAddress,
        chain: instance.walletClient.chain,
      })
      return hash
    }
  }

  return await instance.methods.approve(address, amount).send({ from: userAddress })
}

const getDecimals = async instance => await handleViemReadMethod('decimals', [], instance)

const getSymbol = async instance => await handleViemReadMethod('symbol', [], instance)

const getTotalSupply = async instance => await handleViemReadMethod('totalSupply', [], instance)

export default {
  getBalance,
  getApprovedAmount,
  approve,
  getDecimals,
  getSymbol,
  getTotalSupply,
}
