const getAmountsOut = async (amountsIn, path, instance) => {
  const publicClient = instance.publicClient || instance.client
  return await publicClient.readContract({
    address: instance.address,
    abi: instance.abi,
    functionName: 'getAmountsOut',
    args: [amountsIn, path],
  })
}

export default {
  getAmountsOut,
}
