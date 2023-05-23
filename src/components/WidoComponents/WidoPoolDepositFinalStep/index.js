import React, { useState, useEffect, useCallback } from 'react'
import { quote, getTokenAllowance, approve } from 'wido'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { mainWeb3, toWei, fromWei, maxUint256, safeWeb3 } from '../../../services/web3'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { useContracts } from '../../../providers/Contracts'
import { useActions } from '../../../providers/Actions'
import { usePools } from '../../../providers/Pools'
import { formatNumberWido, isSafeApp } from '../../../utils'
import { WIDO_BALANCES_DECIMALS, FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../../constants'
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
  setClickedVaultId,
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
  setAmountsToExecute,
  setLoadingDots,
  quoteValue,
}) => {
  const [approveValue, setApproveValue] = useState(0)
  const { account, getWalletBalances } = useWallet()
  const { handleApproval, handleStake } = useActions()
  const { contracts } = useContracts()
  const { fetchUserPoolStats, userStats } = usePools()
  const toToken = addresses.iFARM
  const chainId = token.chain || token.data.chain

  const [amount, setAmount] = useState('0')
  const [symbolName, setSymbolName] = useState('')
  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

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

  useEffect(() => {
    setAmount(toWei(inputAmount, pickedToken.decimals))
    if (
      account &&
      pickedToken.address !== undefined &&
      !new BigNumber(amount).isEqualTo(0) &&
      finalStep
    ) {
      const getQuoteResultForLegacy = async () => {
        setFromInfo('')
        try {
          const price = token.data && token.data.lpTokenData && token.data.lpTokenData.price
          const fromAmount = new BigNumber(amount).multipliedBy(price)
          const fromInfoTemp = `${formatNumberWido(
            inputAmount,
            WIDO_BALANCES_DECIMALS,
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
        } else {
          const { allowance } = await getTokenAllowance({
            chainId,
            fromToken: pickedToken.address,
            toToken,
            accountAddress: account, // User
          })
          allowanceCheck = allowance
        }
        console.log(allowanceCheck)
        console.log(amount)
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
  ])

  useEffect(() => {
    if (quoteValue) {
      const getQuoteResult = async () => {
        try {
          const fromTokenInfo =
            formatNumberWido(
              fromWei(quoteValue.fromTokenAmount, pickedToken.decimals),
              WIDO_BALANCES_DECIMALS,
            ) +
            (quoteValue.fromTokenAmountUsdValue === null
              ? ''
              : ` ($${formatNumberWido(
                  quoteValue.fromTokenAmountUsdValue,
                  WIDO_BALANCES_DECIMALS,
                )})`)
          const toTokenInfo =
            formatNumberWido(
              fromWei(quoteValue.toTokenAmount, token.decimals || token.data.lpTokenData.decimals),
              WIDO_BALANCES_DECIMALS,
            ) +
            (quoteValue.toTokenAmountUsdValue === null
              ? ''
              : ` ($${formatNumberWido(quoteValue.toTokenAmountUsdValue, WIDO_BALANCES_DECIMALS)})`)
          setFromInfo(fromTokenInfo)
          setToInfo(toTokenInfo)
        } catch (e) {
          toast.error('Failed to get quote!')
        }
      }

      getQuoteResult()
    }
  }, [quoteValue, pickedToken, token])

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
          await reloadStats()
        },
      )
    } else {
      const { data, to } = await approve({
        chainId,
        fromToken: pickedToken.address,
        toToken,
        amount: amnt,
      })
      if (isSafeApp()) {
        const safeWeb = await safeWeb3()
        await safeWeb.eth.sendTransaction({
          from: account,
          data,
          to,
        })
      } else {
        await mainWeb3.eth.sendTransaction({
          from: account,
          data,
          to,
        })
      }
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
        allowanceCheck = lpTokenApprovedBalance
        spenderCheck = fAssetPool.autoStakePoolAddress
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
      setApproveValue(2)
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
          await reloadStats()
        },
        async () => {
          await reloadStats()
        },
      )
      await fetchUserPoolStats([fAssetPool], account, userStats)
      setExecuteValue(2)
    } else {
      const user = account
      try {
        const fromChainId = chainId
        const fromToken = pickedToken.address
        const toChainId = chainId
        let safeWeb
        if (isSafeApp()) {
          safeWeb = await safeWeb3()
        }
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
          isSafeApp() ? safeWeb.currentProvider : mainWeb3.currentProvider,
        )
        if (isSafeApp()) {
          await safeWeb.eth.sendTransaction({
            from: quoteResult.from,
            data: quoteResult.data,
            to: quoteResult.to,
            value: quoteResult.value,
          })
        } else {
          await mainWeb3.eth.sendTransaction({
            from: quoteResult.from,
            data: quoteResult.data,
            to: quoteResult.to,
            value: quoteResult.value,
          })
        }
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
    initState()
    setBalance(0)
    setUsdValue(0)
    setInputAmount(0)
    setClickedTokenId(-1)
    setClickedVaultId(-1)
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
