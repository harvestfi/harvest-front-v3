import React, { useState, useEffect, useCallback } from 'react'
import { quote, getTokenAllowance, approve } from 'wido'
import { get, isEmpty } from 'lodash'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { toWei, fromWei, maxUint256, getWeb3 } from '../../../services/web3'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { useContracts } from '../../../providers/Contracts'
import { useActions } from '../../../providers/Actions'
import { usePools } from '../../../providers/Pools'
import { formatNumberWido } from '../../../utils'
import {
  WIDO_BALANCES_DECIMALS,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  WIDO_EXTEND_DECIMALS,
} from '../../../constants'
import {
  SelectTokenWido,
  CloseBtn,
  NewLabel,
  Buttons,
  CloseButton,
  ExecuteButton,
  IconArrowDown,
} from './style'
import WidoSwapToken from '../WidoSwapToken'
import { addresses } from '../../../data'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import FarmIcon from '../../../assets/images/logos/wido/farm.svg'
import IFarmIcon from '../../../assets/images/logos/wido/ifarm.svg'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import CheckIcon from '../../../assets/images/logos/wido/check-approve.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import DepositIcon from '../../../assets/images/logos/wido/deposit-icon.svg'
import { useVaults } from '../../../providers/Vault'

const { tokens } = require('../../../data')

const WidoPoolDepositFinalStep = ({
  finalStep,
  setFinalStep,
  setDepositWido,
  setSelectTokenWido,
  inputAmount,
  setInputAmount,
  setUsdValue,
  setBalance,
  setClickedTokenId,
  pickedToken,
  setPickedToken,
  slippagePercentage,
  token,
  tokenSymbol,
  symbol,
  legacyStaking,
  fAssetPool,
  lpTokenApprovedBalance,
  setPendingAction,
  setLoadingDots,
  quoteValue,
  multipleAssets,
}) => {
  const [approveValue, setApproveValue] = useState(0)
  const { account, getWalletBalances, approvedBalances, web3 } = useWallet()
  const { handleApproval, handleStake, handleDeposit } = useActions()
  const { contracts } = useContracts()
  const { vaultsData, farmingBalances, getFarmingBalances } = useVaults()
  const { fetchUserPoolStats, userStats } = usePools()
  const toToken = addresses.iFARM
  const chainId = token.chain || token.data.chain

  const [amount, setAmount] = useState('0')
  const [symbolName, setSymbolName] = useState('')
  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  const walletBalancesToCheck = multipleAssets || [tokenSymbol]
  const zap = !token.disableAutoSwap

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  const tokenDecimals = tokens[FARM_TOKEN_SYMBOL].decimals

  const pricePerFullShare = get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)

  const [amountsToExecute, setAmountsToExecute] = useState([])

  const amountsToExecuteInWei = amountsToExecute.map(amt => {
    if (isEmpty(amt)) {
      return null
    }

    if (multipleAssets) {
      return toWei(amt, token.decimals, 0)
    }
    return toWei(amt, isSpecialVault ? tokenDecimals : token.decimals)
  })

  const reloadStats = useCallback(
    async (depositedOrTaken, iFARM) => {
      setAmountsToExecute(['', ''])
      const tokensToReload = []

      setLoadingDots(iFARM, true)

      if (iFARM) {
        tokensToReload.push(FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL)
      } else {
        tokensToReload.push(tokenSymbol)
      }

      if ((depositedOrTaken && iFARM) || !iFARM) {
        await fetchUserPoolStats([fAssetPool], account, userStats)
      }

      await getWalletBalances(tokensToReload, false, true)

      setLoadingDots(false, false)
    },
    [
      tokenSymbol,
      fAssetPool,
      setAmountsToExecute,
      setLoadingDots,
      fetchUserPoolStats,
      getWalletBalances,
      account,
      userStats,
    ],
  )

  const [checkFlag, setCheckFlag] = useState(false)
  useEffect(() => {
    setAmount(toWei(inputAmount, pickedToken.decimals))
    setAmountsToExecute([inputAmount.toString()])
    if (
      account &&
      pickedToken.address !== undefined &&
      !new BigNumber(amount).isEqualTo(0) &&
      finalStep &&
      !checkFlag
    ) {
      const getQuoteResultForLegacy = async () => {
        setFromInfo('')
        try {
          const price = token.data && token.data.lpTokenData && token.data.lpTokenData.price
          const fromAmount = new BigNumber(amount).multipliedBy(price)
          const fromInfoTemp = `${formatNumberWido(
            inputAmount,
            WIDO_EXTEND_DECIMALS,
          )} ($${formatNumberWido(
            fromWei(fromAmount, token.decimals || token.data.lpTokenData.decimals),
            WIDO_BALANCES_DECIMALS,
          )})`
          setFromInfo(fromInfoTemp)
        } catch (e) {
          toast.error('Failed to get quote!')
        }
      }

      if (legacyStaking) {
        getQuoteResultForLegacy()
      }

      const tokenAllowance = async () => {
        let allowanceCheck
        if (legacyStaking) {
          allowanceCheck = lpTokenApprovedBalance
        } else if (pickedToken.default) {
          allowanceCheck = approvedBalances[IFARM_TOKEN_SYMBOL]
        } else {
          const { allowance } = await getTokenAllowance({
            chainId,
            fromToken: pickedToken.address,
            toToken,
            accountAddress: account, // User
          })
          allowanceCheck = allowance
        }
        if (!new BigNumber(allowanceCheck).gte(amount)) {
          setApproveValue(0)
        } else {
          setApproveValue(2)
        }
      }
      tokenAllowance()
    }

    if (pickedToken.address) {
      setSymbolName(pickedToken.symbol)
    }
  }, [
    pickedToken,
    inputAmount,
    account,
    chainId,
    amount,
    toToken,
    finalStep,
    legacyStaking,
    slippagePercentage,
    token,
    lpTokenApprovedBalance,
    tokenSymbol,
    approvedBalances,
    checkFlag,
  ])

  useEffect(() => {
    const getQuoteResult = async () => {
      try {
        let fromInfoTemp = '',
          toInfoTemp = ''
        if (pickedToken.default) {
          fromInfoTemp = `${formatNumberWido(inputAmount, WIDO_EXTEND_DECIMALS)} ($${
            pickedToken.usdPrice !== '0.0'
              ? formatNumberWido(
                  new BigNumber(amount)
                    .multipliedBy(pickedToken.usdPrice)
                    .dividedBy(new BigNumber(10).exponentiatedBy(pickedToken.decimals)),
                  WIDO_BALANCES_DECIMALS,
                )
              : ''
          })`
          toInfoTemp = `${formatNumberWido(
            new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
            WIDO_EXTEND_DECIMALS,
          )} ($${
            pickedToken.usdPrice !== '0.0'
              ? formatNumberWido(
                  new BigNumber(amount)
                    .multipliedBy(pickedToken.usdPrice)
                    .dividedBy(new BigNumber(10).exponentiatedBy(pickedToken.decimals)),
                  WIDO_BALANCES_DECIMALS,
                )
              : ''
          })`
        } else if (quoteValue) {
          fromInfoTemp =
            formatNumberWido(
              fromWei(quoteValue.fromTokenAmount, pickedToken.decimals),
              WIDO_EXTEND_DECIMALS,
            ) +
            (quoteValue.fromTokenAmountUsdValue === null
              ? ''
              : ` ($${formatNumberWido(
                  quoteValue.fromTokenAmountUsdValue,
                  WIDO_BALANCES_DECIMALS,
                )})`)
          toInfoTemp =
            formatNumberWido(
              fromWei(quoteValue.toTokenAmount, token.decimals || token.data.lpTokenData.decimals),
              WIDO_EXTEND_DECIMALS,
            ) +
            (quoteValue.toTokenAmountUsdValue === null
              ? ''
              : ` ($${formatNumberWido(quoteValue.toTokenAmountUsdValue, WIDO_BALANCES_DECIMALS)})`)
        }
        setFromInfo(fromInfoTemp)
        setToInfo(toInfoTemp)
      } catch (e) {
        toast.error('Failed to get quote!')
      }
    }

    getQuoteResult()
  }, [quoteValue, pickedToken, token, amount, inputAmount, pricePerFullShare])

  const approveZap = async amnt => {
    if (legacyStaking) {
      await handleApproval(
        account,
        contracts,
        tokenSymbol,
        null,
        fAssetPool,
        setPendingAction,
        async () => {
          setCheckFlag(true)
          await reloadStats()
          setApproveValue(2)
        },
        async () => {
          setApproveValue(0)
        },
      )
    } else if (pickedToken.default) {
      await handleApproval(
        account,
        contracts,
        tokenSymbol,
        token.vaultAddress,
        null,
        setPendingAction,
        async () => {
          await reloadStats()
          await getWalletBalances([IFARM_TOKEN_SYMBOL], false, true)
          setApproveValue(2)
        },
        async () => {
          setApproveValue(0)
        },
      )
    } else {
      const { data, to } = await approve({
        chainId,
        fromToken: pickedToken.address,
        toToken,
        amount: amnt,
      })
      const mainWeb = await getWeb3(chainId, account, web3)

      await mainWeb.eth.sendTransaction({
        from: account,
        data,
        to,
      })
      setApproveValue(2)
    }
  }

  const onClickApprove = async () => {
    if (approveValue === 2) {
      toast.error('You already approved!')
      return
    }
    setApproveValue(1)

    if (pickedToken === undefined) {
      toast.error('Please select other token!')
      return
    }

    try {
      let allowanceCheck, spenderCheck
      if (legacyStaking) {
        allowanceCheck = approvedBalances[tokenSymbol]
        spenderCheck = fAssetPool.autoStakePoolAddress
      } else if (pickedToken.default) {
        allowanceCheck = approvedBalances[IFARM_TOKEN_SYMBOL]
        spenderCheck = token.vaultAddress
      } else {
        const { spender, allowance } = await getTokenAllowance({
          chainId,
          fromToken: pickedToken.address,
          toToken,
          accountAddress: account, // User
        })
        spenderCheck = spender
        allowanceCheck = allowance
      }

      console.debug('Allowance Spender: ', spenderCheck)

      if (!new BigNumber(allowanceCheck).gte(amount)) {
        const amountToApprove = maxUint256()
        await approveZap(amountToApprove) // Approve for Zap
      }
    } catch (err) {
      toast.error('Failed to approve!')
      setApproveValue(0)
    }
  }

  const [executeValue, setExecuteValue] = useState(0)
  const onClickExecute = async () => {
    if (approveValue !== 2) {
      toast.error('Please approve first!')
      return
    }
    setExecuteValue(1)
    if (legacyStaking) {
      await handleStake(
        token,
        account,
        tokenSymbol,
        amount,
        lpTokenApprovedBalance,
        fAssetPool,
        contracts,
        setPendingAction,
        false,
        async () => {
          setCheckFlag(true)
          await reloadStats()
          await fetchUserPoolStats([fAssetPool], account, userStats)
          setExecuteValue(2)
        },
        async () => {
          setCheckFlag(true)
          await reloadStats()
        },
        async () => {
          setExecuteValue(0)
        },
      )
    } else if (pickedToken.default) {
      try {
        await handleDeposit(
          token,
          account,
          tokenSymbol,
          amountsToExecuteInWei,
          approvedBalances[IFARM_TOKEN_SYMBOL],
          contracts,
          vaultsData[IFARM_TOKEN_SYMBOL],
          setPendingAction,
          false,
          fAssetPool,
          multipleAssets,
          zap,
          async () => {
            setCheckFlag(true)
            await getWalletBalances(walletBalancesToCheck)
            const updatedStats = await fetchUserPoolStats([fAssetPool], account, userStats)
            await getFarmingBalances([tokenSymbol], farmingBalances, updatedStats)
            setAmountsToExecute(['', ''])
            await fetchUserPoolStats([fAssetPool], account, userStats)
            setExecuteValue(2)
          },
          async () => {
            setCheckFlag(true)
            await getWalletBalances(walletBalancesToCheck, false, true)
          },
          async () => {
            setExecuteValue(0)
          },
        )
      } catch (err) {
        toast.error('Failed to deposit: ', err)
        setExecuteValue(0)
      }
    } else {
      const user = account
      try {
        const fromChainId = chainId
        const fromToken = pickedToken.address
        const toChainId = chainId
        const mainWeb = await getWeb3(chainId, account, web3)

        const quoteResult = await quote(
          {
            fromChainId, // Chain Id of from token
            fromToken, // Token address of from token
            toChainId, // Chain Id of to token
            toToken, // Token address of to token
            amount, // Token amount of from token
            slippagePercentage, // Acceptable max slippage for the swap
            user, // Address of user placing the order.
          },
          mainWeb.currentProvider,
        )
        await mainWeb.eth.sendTransaction({
          from: quoteResult.from,
          data: quoteResult.data,
          to: quoteResult.to,
          value: quoteResult.value,
        })
        await fetchUserPoolStats([fAssetPool], account, userStats)
        setExecuteValue(2)
      } catch (err) {
        toast.error('Failed to execute: ', err)
        setExecuteValue(0)
      }
    }
  }

  const initState = () => {
    setExecuteValue(0)
    setApproveValue(0)
  }

  const onClickClose = () => {
    setCheckFlag(false)
    initState()
    setBalance(0)
    setUsdValue(0)
    setInputAmount(0)
    setClickedTokenId(-1)
    setPickedToken({ symbol: 'Select Token' })
    setFinalStep(false)
    setDepositWido(false)
    setSelectTokenWido(false)
  }

  const { borderColor, backColor, filterColor } = useThemeContext()

  return (
    <SelectTokenWido show={finalStep} backColor={backColor} borderColor={borderColor}>
      <NewLabel display="flex" justifyContent="space-between" marginBottom="20px">
        <CloseBtn
          src={BackIcon}
          alt=""
          onClick={() => {
            setCheckFlag(false)
            initState()
            setFinalStep(false)
          }}
          filterColor={filterColor}
        />
        <NewLabel display="flex" weight="700" size="16px" height="21px">
          Final Step
        </NewLabel>
        <div />
      </NewLabel>

      <NewLabel marginBottom="20px">
        <WidoSwapToken img={pickedToken.logoURI} name={fromInfo} value={pickedToken.symbol} />
        <NewLabel display="flex" justifyContent="center" marginTop="15px" marginBottom="15px">
          <IconArrowDown
            src={ArrowDownIcon}
            filterColor={filterColor}
            width={25}
            height={25}
            alt=""
          />
        </NewLabel>
        {legacyStaking ? (
          <WidoSwapToken img={FarmIcon} name="Profit-sharing vault" value={null} />
        ) : (
          <WidoSwapToken img={IFarmIcon} name={toInfo} value={symbol} />
        )}
      </NewLabel>

      <NewLabel size="16px" height="21px" weight={500}>
        <Buttons
          show={approveValue}
          disabled={approveValue === 2}
          onClick={() => {
            onClickApprove()
          }}
        >
          {approveValue === 2 ? (
            <>
              {symbolName} deposits are approved
              <img src={CheckIcon} alt="" />
            </>
          ) : (
            <>
              Approve {symbolName} deposits
              {approveValue === 1 ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <img src={ChevronRightIcon} alt="" />
              )}
            </>
          )}
        </Buttons>
        <ExecuteButton
          approve={approveValue}
          execute={executeValue}
          onClick={() => {
            onClickExecute()
          }}
        >
          {executeValue === 1 ? (
            <>
              Deposit
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            </>
          ) : executeValue === 2 ? (
            <>
              Conversion Complete
              <img src={CheckIcon} alt="" />
            </>
          ) : (
            <>
              Deposit
              <img src={DepositIcon} alt="" />
            </>
          )}
        </ExecuteButton>

        <CloseButton
          show={executeValue}
          onClick={() => {
            onClickClose()
          }}
        >
          Go back to finalize deposit
        </CloseButton>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoPoolDepositFinalStep
