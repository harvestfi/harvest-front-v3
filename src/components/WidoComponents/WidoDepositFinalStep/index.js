import React, { useState, useEffect } from 'react'
import { quote, getTokenAllowance, approve } from 'wido'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { mainWeb3, toWei, fromWei, maxUint256 } from '../../../services/web3'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { usePools } from '../../../providers/Pools'
import { formatNumberWido } from '../../../utils'
import { WIDO_BALANCES_DECIMALS } from '../../../constants'
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
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import Swap2Icon from '../../../assets/images/logos/wido/swap2.svg'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import CheckIcon from '../../../assets/images/logos/wido/check-approve.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import DepositIcon from '../../../assets/images/logos/wido/deposit-icon.svg'
import IFARMIcon from '../../../assets/images/logos/wido/ifarm.svg'

const WidoDepositFinalStep = ({
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
  useIFARM,
  symbol,
  tokenSymbol,
  quoteValue,
  fAssetPool,
}) => {
  const [approveValue, setApproveValue] = useState(0)
  const { account } = useWallet()
  const { fetchUserPoolStats, userStats } = usePools()
  const toToken = token.vaultAddress || token.tokenAddress
  const chainId = token.chain || token.data.chain

  const [amount, setAmount] = useState('0')
  const [symbolName, setSymbolName] = useState('')

  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  useEffect(() => {
    setAmount(toWei(inputAmount, pickedToken.decimals))
    if (
      account &&
      pickedToken.address !== undefined &&
      !new BigNumber(amount).isEqualTo(0) &&
      finalStep
    ) {
      const tokenAllowance = async () => {
        const { allowance } = await getTokenAllowance({
          chainId,
          fromToken: pickedToken.address,
          toToken,
          accountAddress: account, // User
        })
        if (!new BigNumber(allowance).gte(amount)) {
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
  }, [pickedToken, inputAmount, account, chainId, amount, toToken, finalStep])

  useEffect(() => {
    if (quoteValue) {
      const getQuoteResult = async () => {
        try {
          const fromInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(quoteValue.fromTokenAmount, pickedToken.decimals),
              WIDO_BALANCES_DECIMALS,
            ) +
              (quoteValue.fromTokenAmountUsdValue === null
                ? ''
                : ` ($${quoteValue.fromTokenAmountUsdValue})`)
          const toInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(quoteValue.toTokenAmount, token.decimals || token.data.lpTokenData.decimals),
              WIDO_BALANCES_DECIMALS,
            ) +
              (quoteValue.toTokenAmountUsdValue === null
                ? ''
                : ` ($${quoteValue.toTokenAmountUsdValue})`)
          setFromInfo(fromInfoTemp)
          setToInfo(toInfoTemp)
        } catch (e) {
          toast.error('Failed to get quote!')
        }
      }

      getQuoteResult()
    }
  }, [pickedToken, token, quoteValue])

  const approveZap = async amnt => {
    const { data, to } = await approve({
      chainId,
      fromToken: pickedToken.address,
      toToken,
      amount: amnt,
    })
    const mainWeb = await mainWeb3()
    await mainWeb.eth.sendTransaction({
      from: account,
      data,
      to,
    })
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
      const { spender, allowance } = await getTokenAllowance({
        chainId,
        fromToken: pickedToken.address,
        toToken,
        accountAddress: account, // User
      })

      console.debug('Allowance Spender: ', spender)

      if (!new BigNumber(allowance).gte(amount)) {
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
    const user = account
    try {
      const fromChainId = chainId
      const fromToken = pickedToken.address
      const toChainId = chainId
      const mainWeb = await mainWeb3()

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
            filterColor={filterColor}
            src={ArrowDownIcon}
            width={25}
            height={25}
            alt=""
          />
        </NewLabel>
        <WidoSwapToken
          img={useIFARM ? IFARMIcon : Swap2Icon}
          name={toInfo}
          value={useIFARM ? symbol : `f${tokenSymbol}`}
        />
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
export default WidoDepositFinalStep
