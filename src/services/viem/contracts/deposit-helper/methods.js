const depositAll = async (amounts, vaultAddresses, userAddress, instance) => {
  if (instance.walletClient && instance.address && instance.abi) {
    const { walletClient } = instance

    const depositAllFunction = instance.abi.find(
      item => item.name === 'depositAll' && item.type === 'function',
    )

    if (depositAllFunction) {
      const hash = await walletClient.writeContract({
        address: instance.address,
        abi: [depositAllFunction],
        functionName: 'depositAll',
        args: [amounts, vaultAddresses],
        account: userAddress,
      })

      return hash
    }
  }

  return instance.methods.depositAll(amounts, vaultAddresses).send({ from: userAddress })
}

export default {
  depositAll,
}
