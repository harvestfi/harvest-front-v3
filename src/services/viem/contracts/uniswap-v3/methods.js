import { handleViemReadMethod } from '../..'

const zapSqrtPriceLimitX96 = 0

const getSqrtPriceX96 = async instance => {
  return await handleViemReadMethod('getSqrtPriceX96', [], instance)
}

const deposit = async (
  firstAmount,
  secondAmount,
  zapFunds,
  sqrtRatioX96,
  tolerance,
  zapAmount0OutMin = 0,
  zapAmount1OutMin = 0,
  address,
  instance,
  simulate,
) => {
  const funcParams = [
    firstAmount,
    secondAmount,
    zapFunds,
    sqrtRatioX96,
    tolerance,
    zapAmount0OutMin,
    zapAmount1OutMin,
    zapSqrtPriceLimitX96,
  ]

  if (simulate) {
    if (instance.address && instance.abi && instance.publicClient) {
      const publicClient = instance.publicClient || instance.client

      if (publicClient && publicClient.readContract) {
        return await publicClient.readContract({
          address: instance.address,
          abi: instance.abi,
          functionName: 'deposit',
          args: funcParams,
        })
      }
    }
    return instance.methods.deposit(...funcParams).call({ from: address })
  } else {
    // For actual transactions
    if (instance.writeContract) {
      // If instance has a direct writeContract method (newer pattern)
      return await instance.writeContract({
        functionName: 'deposit',
        args: funcParams,
        account: address,
      })
    } else if (instance.walletClient) {
      // Check if the walletClient is properly structured
      if (typeof instance.walletClient.writeContract === 'function') {
        // Get the chain from the instance or walletClient
        const chain =
          instance.chain || (instance.walletClient && instance.walletClient.chain) || undefined

        return await instance.walletClient.writeContract({
          address: instance.address,
          abi: instance.abi,
          functionName: 'deposit',
          args: funcParams,
          account: address,
          // Only include chain if it exists
          ...(chain && { chain }),
        })
      }
    }

    return instance.methods.deposit(...funcParams).send({ from: address })
  }
}

const legacyDeposit = async (
  firstAmount,
  secondAmount,
  zapFunds,
  sweep,
  sqrtRatioX96,
  tolerance,
  address,
  instance,
) => {
  const funcParams = [firstAmount, secondAmount, zapFunds, sweep, sqrtRatioX96, tolerance]

  if (instance.writeContract) {
    // If instance has a direct writeContract method (newer pattern)
    return await instance.writeContract({
      functionName: 'deposit',
      args: funcParams,
      account: address,
    })
  } else if (instance.walletClient) {
    // Check if the walletClient is properly structured
    if (typeof instance.walletClient.writeContract === 'function') {
      // Get the chain from the instance or walletClient
      const chain =
        instance.chain || (instance.walletClient && instance.walletClient.chain) || undefined

      return await instance.walletClient.writeContract({
        address: instance.address,
        abi: instance.abi,
        functionName: 'deposit',
        args: funcParams,
        account: address,
        // Only include chain if it exists
        ...(chain && { chain }),
      })
    }
  }

  return instance.methods.deposit(...funcParams).send({ from: address })
}

const withdraw = async (
  amount,
  withdrawFirstAsset,
  withdrawSecondAsset,
  sqrtRatioX96,
  tolerance,
  amount0OutMinForZap = 0,
  amount1OutMinForZap = 0,
  address,
  instance,
  simulate,
) => {
  const funcParams = [
    amount,
    withdrawFirstAsset,
    withdrawSecondAsset,
    sqrtRatioX96,
    tolerance,
    amount0OutMinForZap,
    amount1OutMinForZap,
    zapSqrtPriceLimitX96,
  ]

  if (simulate) {
    if (instance.address && instance.abi && instance.publicClient) {
      const publicClient = instance.publicClient || instance.client

      if (publicClient && publicClient.readContract) {
        return await publicClient.readContract({
          address: instance.address,
          abi: instance.abi,
          functionName: 'withdraw',
          args: funcParams,
        })
      }
    }
    return instance.methods.withdraw(...funcParams).call({ from: address })
  } else {
    // For actual transactions
    if (instance.writeContract) {
      // If instance has a direct writeContract method (newer pattern)
      return await instance.writeContract({
        functionName: 'withdraw',
        args: funcParams,
        account: address,
      })
    } else if (instance.walletClient) {
      // Check if the walletClient is properly structured
      if (typeof instance.walletClient.writeContract === 'function') {
        // Get the chain from the instance or walletClient
        const chain =
          instance.chain || (instance.walletClient && instance.walletClient.chain) || undefined

        return await instance.walletClient.writeContract({
          address: instance.address,
          abi: instance.abi,
          functionName: 'withdraw',
          args: funcParams,
          account: address,
          // Only include chain if it exists
          ...(chain && { chain }),
        })
      }
    }

    return instance.methods.withdraw(...funcParams).send({ from: address })
  }
}

const legacyWithdraw = async (
  amount,
  withdrawFirstAsset,
  withdrawSecondAsset,
  sqrtRatioX96,
  tolerance,
  address,
  instance,
) => {
  const funcParams = [amount, withdrawFirstAsset, withdrawSecondAsset, sqrtRatioX96, tolerance]

  if (instance.writeContract) {
    // If instance has a direct writeContract method (newer pattern)
    return await instance.writeContract({
      functionName: 'withdraw',
      args: funcParams,
      account: address,
    })
  } else if (instance.walletClient) {
    // Check if the walletClient is properly structured
    if (typeof instance.walletClient.writeContract === 'function') {
      // Get the chain from the instance or walletClient
      const chain =
        instance.chain || (instance.walletClient && instance.walletClient.chain) || undefined

      return await instance.walletClient.writeContract({
        address: instance.address,
        abi: instance.abi,
        functionName: 'withdraw',
        args: funcParams,
        account: address,
        // Only include chain if it exists
        ...(chain && { chain }),
      })
    }
  }

  return instance.methods.withdraw(...funcParams).send({ from: address })
}

const migrateToNftFromV2 = async (
  amount,
  minAmount0,
  minAmount1,
  zapFunds,
  sqrtRatioX96,
  tolerance,
  amount0OutMinForZap = 0,
  amount1OutMinForZap = 0,
  address,
  instance,
  simulate,
) => {
  const funcParams = [
    amount,
    minAmount0,
    minAmount1,
    zapFunds,
    sqrtRatioX96,
    tolerance,
    amount0OutMinForZap,
    amount1OutMinForZap,
    zapSqrtPriceLimitX96,
  ]

  if (simulate) {
    if (instance.address && instance.abi && instance.publicClient) {
      const publicClient = instance.publicClient || instance.client

      if (publicClient && publicClient.readContract) {
        return await publicClient.readContract({
          address: instance.address,
          abi: instance.abi,
          functionName: 'migrateToNftFromV2',
          args: funcParams,
        })
      }
    }
    return instance.methods.migrateToNftFromV2(...funcParams).call({ from: address })
  } else {
    // For actual transactions
    if (instance.writeContract) {
      // If instance has a direct writeContract method (newer pattern)
      return await instance.writeContract({
        functionName: 'migrateToNftFromV2',
        args: funcParams,
        account: address,
      })
    } else if (instance.walletClient) {
      // Check if the walletClient is properly structured
      if (typeof instance.walletClient.writeContract === 'function') {
        // Get the chain from the instance or walletClient
        const chain =
          instance.chain || (instance.walletClient && instance.walletClient.chain) || undefined

        return await instance.walletClient.writeContract({
          address: instance.address,
          abi: instance.abi,
          functionName: 'migrateToNftFromV2',
          args: funcParams,
          account: address,
          // Only include chain if it exists
          ...(chain && { chain }),
        })
      }
    }

    return instance.methods.migrateToNftFromV2(...funcParams).send({ from: address })
  }
}

const migrateToNftFromV2Legacy = async (
  amount,
  minAmount0,
  minAmount1,
  zapFunds,
  sweep,
  sqrtRatioX96,
  tolerance,
  address,
  instance,
) => {
  const funcParams = [amount, minAmount0, minAmount1, zapFunds, sweep, sqrtRatioX96, tolerance]

  if (instance.writeContract) {
    // If instance has a direct writeContract method (newer pattern)
    return await instance.writeContract({
      functionName: 'migrateToNftFromV2',
      args: funcParams,
      account: address,
    })
  } else if (instance.walletClient) {
    // Check if the walletClient is properly structured
    if (typeof instance.walletClient.writeContract === 'function') {
      // Get the chain from the instance or walletClient
      const chain =
        instance.chain || (instance.walletClient && instance.walletClient.chain) || undefined

      return await instance.walletClient.writeContract({
        address: instance.address,
        abi: instance.abi,
        functionName: 'migrateToNftFromV2',
        args: funcParams,
        account: address,
        // Only include chain if it exists
        ...(chain && { chain }),
      })
    }
  }

  return instance.methods.migrateToNftFromV2(...funcParams).send({ from: address })
}

export default {
  getSqrtPriceX96,
  deposit,
  legacyDeposit,
  withdraw,
  legacyWithdraw,
  migrateToNftFromV2,
  migrateToNftFromV2Legacy,
}
