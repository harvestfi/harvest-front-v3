import BigNumber from 'bignumber.js'
import { get, isUndefined } from 'lodash'
// import { forEach } from 'promised-loops'
import React, { createContext, useCallback, useContext } from 'react'
import { toast } from 'react-toastify'
import {
  ACTIONS,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  UNIV3_SLIPPAGE_TOLERANCE,
  UNIV3_TOLERANCE,
} from '../constants'
import { formatViemPluginErrorMessage, newContractInstance, getViem } from '../services/viem'
import poolMethods from '../services/viem/contracts/pool/methods'
import iporVaultData from '../services/viem/contracts/ipor-vault/contract.json'
import iporVaultMethods from '../services/viem/contracts/ipor-vault/methods'
import tokenMethods from '../services/viem/contracts/token/methods'
import univ3Methods from '../services/viem/contracts/uniswap-v3/methods'
import vaultMethods from '../services/viem/contracts/vault/methods'
import { CustomException } from '../utilities/formats'
import { useWallet } from './Wallet'

const { tokens } = require('../data')

const ActionsContext = createContext()
const useActions = () => useContext(ActionsContext)

const ActionsProvider = ({ children }) => {
  const { viem } = useWallet
  const handleApproval = useCallback(
    async (
      account,
      contracts,
      tokenSymbol,
      amountToApprove,
      vaultAddress,
      poolData,
      onSuccessApproval = () => {},
      onFailureApproval = () => {},
    ) => {
      const address = vaultAddress || tokens[tokenSymbol]?.vaultAddress
      try {
        if (poolData) {
          const poolAddress = poolData.autoStakePoolAddress || poolData.contractAddress
          await tokenMethods.approve(
            poolAddress,
            account,
            amountToApprove,
            poolData.lpTokenData.localInstance,
          )
        } else {
          const contract =
            contracts[tokenSymbol === IFARM_TOKEN_SYMBOL ? FARM_TOKEN_SYMBOL : tokenSymbol]
          const viemClient = await getViem(false, account, viem)
          if (contract.instance && typeof contract.instance.setProvider === 'function') {
            contract.instance.setProvider(viemClient)
          }
          await tokenMethods.approve(address, account, amountToApprove, contract.instance)
        }

        await onSuccessApproval()

        return false
      } catch (err) {
        const errorMessage = formatViemPluginErrorMessage(err)
        toast.error(errorMessage)
        onFailureApproval()
        return true
      }
    },
    [viem],
  )

  const handleDeposit = useCallback(
    async (
      token,
      account,
      amountsToExecute,
      vaultData,
      multipleAssets,
      zap,
      onSuccessDeposit = () => {},
      onFailureDeposit = () => {},
    ) => {
      const hasDeniedRequest = false
      let updatedLpTokenBalance, updatedLpTokenApprovedBalance
      if (!hasDeniedRequest) {
        try {
          if (multipleAssets) {
            const firstAmount =
              amountsToExecute[0] === null || amountsToExecute[0] === undefined
                ? 0
                : amountsToExecute[0]
            const secondAmount =
              amountsToExecute[1] === null || amountsToExecute[1] === undefined
                ? 0
                : amountsToExecute[1]
            const sqrtRatioX96 = await univ3Methods.getSqrtPriceX96(vaultData.instance)

            if (zap && token.zapFrontrunProtection) {
              let actualAmount0, actualAmount1

              try {
                const { 0: simulationAmount0, 1: simulationAmount1 } = await univ3Methods.deposit(
                  firstAmount,
                  secondAmount,
                  zap,
                  sqrtRatioX96,
                  UNIV3_TOLERANCE,
                  undefined,
                  undefined,
                  account,
                  vaultData.instance,
                  true,
                )
                actualAmount0 = simulationAmount0
                actualAmount1 = simulationAmount1
              } catch (err) {
                console.error(err)
                throw new CustomException(
                  `Could not simulate the transaction with inputs ${firstAmount} and ${secondAmount}. Try specifying different amounts.`,
                  'DEPOSIT_SIMULATION',
                )
              }

              await univ3Methods.deposit(
                firstAmount,
                secondAmount,
                zap,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                !isUndefined(actualAmount0)
                  ? new BigNumber(actualAmount0).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                  : undefined,
                !isUndefined(actualAmount1)
                  ? new BigNumber(actualAmount1).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                  : undefined,
                account,
                vaultData.instance,
              )
            } else {
              await univ3Methods.legacyDeposit(
                firstAmount,
                secondAmount,
                zap,
                true,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                account,
                vaultData.instance,
              )
            }
          } else {
            await vaultMethods.deposit(amountsToExecute[0], account, vaultData.instance)
          }

          // toast.success('Deposit completed')

          // if (autoStake) {
          //   const { instance: lpTokenInstance } = vaultPool.lpTokenData
          //   updatedLpTokenBalance = await tokenMethods.getBalance(account, lpTokenInstance)
          //   updatedLpTokenApprovedBalance = await tokenMethods.getApprovedAmount(
          //     account,
          //     vaultPool.contractAddress,
          //     lpTokenInstance,
          //   )
          // } else {
          //   setPendingAction(null)
          // }

          await onSuccessDeposit(updatedLpTokenBalance, updatedLpTokenApprovedBalance)
          return true
        } catch (err) {
          // setPendingAction(null)

          const errorMessage = formatViemPluginErrorMessage(err, get(err, 'message'))
          toast.error(errorMessage)
          await onFailureDeposit()
          return false
        }
      }

      return false
    },
    [],
  )

  const handleStakeApproval = useCallback(
    async (
      token,
      account,
      tokenSymbol,
      lpTokenBalance,
      lpTokenApprovedBalance,
      poolData,
      contracts,
      setPendingAction,
      multipleAssets,
      onSuccessApproval = () => {},
      onFailureStake = () => {},
      setBStakeApprovalSuccess,
    ) => {
      let hasDeniedRequest = false

      if (poolData && Number(lpTokenBalance) > 0) {
        try {
          const hasEnoughApprovedAmount = new BigNumber(lpTokenBalance).isLessThanOrEqualTo(
            new BigNumber(lpTokenApprovedBalance),
          )
          if (!hasEnoughApprovedAmount) {
            const amountToApprove = lpTokenBalance
            if (!hasEnoughApprovedAmount && !hasDeniedRequest) {
              setPendingAction(ACTIONS.APPROVE_STAKE)
              hasDeniedRequest = await handleApproval(
                account,
                contracts,
                tokenSymbol,
                amountToApprove,
                multipleAssets ? token.vaultAddress : null,
                poolData,
                onSuccessApproval,
              )
            }
          } else {
            setBStakeApprovalSuccess(true)
          }
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatViemPluginErrorMessage(err)
          toast.error(errorMessage)
          onFailureStake()
        }
      }
    },
    [handleApproval],
  )

  const handleStakeTransaction = useCallback(
    async (
      account,
      tokenSymbol,
      lpTokenBalance,
      poolData,
      contracts,
      setPendingAction,
      multipleAssets,
      onSuccessStake = () => {},
      onFailureStake = () => {},
      action = ACTIONS.STAKE,
    ) => {
      const poolInstance = poolData.autoStakeContractLocalInstance || poolData.contractLocalInstance
      const tokenDisplayName = get(tokens, `[${tokenSymbol}].tokenNames`, tokenSymbol).join(', ')

      const hasDeniedRequest = false

      if (poolData && Number(lpTokenBalance) > 0) {
        try {
          if (!hasDeniedRequest) {
            setPendingAction(action)
            await poolMethods.stake(lpTokenBalance, account, poolInstance)
            setPendingAction(null)
            toast.success(`${tokenDisplayName} stake completed`)
            await onSuccessStake()
          }
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatViemPluginErrorMessage(err)
          toast.error(errorMessage)
          onFailureStake()
        }
      }
    },
    [],
  )

  const handleIPORDeposit = useCallback(
    async (
      account,
      token,
      amount,
      onSuccessDeposit = async () => {},
      onFailureDeposit = () => {},
    ) => {
      const tokenDisplayName = token.tokenNames[0]
      const viemClient = await getViem(token.chain, account, viem)

      const iporVaultInstance = await newContractInstance(
        null,
        token.vaultAddress,
        iporVaultData.abi,
        viemClient,
      )
      try {
        await iporVaultMethods.deposit(amount, account, iporVaultInstance)
        toast.success(`${tokenDisplayName} deposit completed`)
        await onSuccessDeposit()
        return true
      } catch (err) {
        const errorMessage = formatViemPluginErrorMessage(err)
        toast.error(errorMessage)
        onFailureDeposit()
        return false
      }
    },
    [viem],
  )

  const handleIPORWithdraw = useCallback(
    async (account, token, amount, onSuccess = () => {}) => {
      const tokenDisplayName = token.tokenNames[0]
      const viemClient = await getViem(false, account, viem)

      const iporVaultInstance = await newContractInstance(
        null,
        token.vaultAddress,
        iporVaultData.abi,
        viemClient,
      )

      try {
        await iporVaultMethods.redeem(amount, account, iporVaultInstance)
        toast.success(`${tokenDisplayName} withdraw completed`)
        await onSuccess()
        return true
      } catch (err) {
        const errorMessage = formatViemPluginErrorMessage(err)
        toast.error(errorMessage)
        return false
      }
    },
    [viem],
  )

  const handleClaim = useCallback(
    async (account, poolData, setPendingAction, onSuccess = () => {}, action = ACTIONS.CLAIM) => {
      const poolInstance = poolData.autoStakeContractLocalInstance || poolData.contractLocalInstance

      if (poolData) {
        setPendingAction(action)
        try {
          if (poolData.rewardTokenSymbols.length > 1) {
            await poolMethods.claimAll(account, poolInstance)
          } else {
            await poolMethods.claim(account, poolInstance)
          }

          setPendingAction(null)
          toast.success('Claim completed')
          await onSuccess()
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatViemPluginErrorMessage(err)
          toast.error(errorMessage)
        }
      }
    },
    [],
  )

  const handleExit = useCallback(
    async (
      account,
      poolData,
      partialExit,
      amountsToExecute,
      setPendingAction,
      onSuccess = () => {},
      action = ACTIONS.EXIT,
    ) => {
      const poolInstance = poolData.autoStakeContractLocalInstance || poolData.contractLocalInstance

      if (poolData) {
        setPendingAction(action)
        try {
          if (partialExit) {
            await poolMethods.withdraw(account, amountsToExecute, poolInstance)
            toast.success('Unstake completed')
          } else {
            await poolMethods.exit(account, poolInstance)
            toast.success('Unstake & claim completed')
          }

          setPendingAction(null)

          await onSuccess()
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatViemPluginErrorMessage(err)
          toast.error(errorMessage)
        }
      }
    },
    [],
  )

  const handleWithdraw = useCallback(
    async (
      account,
      tokenSymbol,
      depositedAmount,
      vaultsData,
      setPendingAction,
      multipleAssets,
      selectedAsset,
      onSuccess = () => {},
      onFailure = () => {},
    ) => {
      // setPendingAction(action)

      try {
        if (multipleAssets) {
          const withdrawFirstAsset = selectedAsset === 0 || selectedAsset === -1
          const withdrawSecondAsset = selectedAsset === 1 || selectedAsset === -1
          const sqrtRatioX96 = await univ3Methods.getSqrtPriceX96(vaultsData[tokenSymbol].instance)

          if (vaultsData[tokenSymbol].zapFrontrunProtection) {
            let actualAmount0, actualAmount1

            try {
              const { 0: simulationAmount0, 1: simulationAmount1 } = await univ3Methods.withdraw(
                depositedAmount,
                withdrawFirstAsset,
                withdrawSecondAsset,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                undefined,
                undefined,
                account,
                vaultsData[tokenSymbol].instance,
                true,
              )
              actualAmount0 = simulationAmount0
              actualAmount1 = simulationAmount1
            } catch (err) {
              console.error(err)
              throw new CustomException(
                `Could not simulate the transaction with inputs ${withdrawFirstAsset} and ${withdrawSecondAsset}. Try specifying different amounts.`,
                'WITHDRAW_SIMULATION',
              )
            }

            await univ3Methods.withdraw(
              depositedAmount,
              withdrawFirstAsset,
              withdrawSecondAsset,
              sqrtRatioX96,
              UNIV3_TOLERANCE,
              !isUndefined(actualAmount0)
                ? new BigNumber(actualAmount0).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                : undefined,
              !isUndefined(actualAmount1)
                ? new BigNumber(actualAmount1).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                : undefined,
              account,
              vaultsData[tokenSymbol].instance,
            )
          } else {
            await univ3Methods.legacyWithdraw(
              depositedAmount,
              withdrawFirstAsset,
              withdrawSecondAsset,
              sqrtRatioX96,
              UNIV3_TOLERANCE,
              account,
              vaultsData[tokenSymbol].instance,
            )
          }
        } else {
          await vaultMethods.withdraw(depositedAmount, account, vaultsData[tokenSymbol].instance)
        }

        // setPendingAction(null)
        // toast.success('Withdraw completed')
        await onSuccess()
        return true
      } catch (err) {
        // setPendingAction(null)
        const errorMessage = formatViemPluginErrorMessage(err)
        toast.error(errorMessage)
        await onFailure()
        return false
      }
    },
    [],
  )

  return (
    <ActionsContext.Provider
      value={{
        handleApproval,
        handleDeposit,
        handleIPORDeposit,
        handleIPORWithdraw,
        handleStakeApproval,
        handleStakeTransaction,
        handleClaim,
        handleExit,
        handleWithdraw,
      }}
    >
      {children}
    </ActionsContext.Provider>
  )
}

export { ActionsProvider, useActions }
