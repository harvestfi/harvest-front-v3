import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { approve, getTokenAllowance, quote } from 'wido'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import CheckIcon from '../../../assets/images/logos/wido/check-approve.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import SettingIcon from '../../../assets/images/logos/wido/setting.svg'
import Swap1WithIcon from '../../../assets/images/logos/wido/swap2.svg'
import WithdrawIcon from '../../../assets/images/logos/wido/withdraw-icon.svg'
import { WIDO_BALANCES_DECIMALS } from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, mainWeb3 } from '../../../services/web3'
import { formatNumberWido } from '../../../utils'
import WidoSwapToken from '../WidoSwapToken'
import {
  Buttons,
  CloseBtn,
  CloseButton,
  ExecuteButton,
  NewLabel,
  SelectTokenWido,
  IconArrowDown,
} from './style'

const WidoWithdrawFinalStep = ({
  finalStep,
  setFinalStep,
  setWithdrawWido,
  setSelectTokenWith,
  symbol,
  tokenSymbol,
  useIFARM,
  setClickedTokenId,
  pickedToken,
  setPickedToken,
  token,
  unstakeBalance,
  setUnstakeBalance,
  slippagePercentage,
  fAssetPool,
  quoteValue,
}) => {
  const [approveValue, setApproveValue] = React.useState(0)
  const { account } = useWallet()
  const { fetchUserPoolStats, userStats } = usePools()
  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  const fromToken = token.vaultAddress || token.tokenAddress
  const chainId = token.chain || token.data.chain

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(unstakeBalance).isEqualTo(0) &&
      finalStep
    ) {
      const tokenAllowance = async () => {
        const { allowance } = await getTokenAllowance({
          chainId,
          fromToken,
          toToken: pickedToken.address,
          accountAddress: account, // User
        })
        if (!new BigNumber(allowance).gte(unstakeBalance)) {
          setApproveValue(0)
        } else {
          setApproveValue(2)
        }
      }

      tokenAllowance()
    }
  }, [pickedToken, account, chainId, fromToken, unstakeBalance, finalStep, token])

  useEffect(() => {
    if (quoteValue) {
      const getQuoteResult = async () => {
        try {
          const fromInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(
                quoteValue.fromTokenAmount,
                token.decimals || token.data.lpTokenData.decimals,
              ),
              WIDO_BALANCES_DECIMALS,
            ) +
              (quoteValue.fromTokenUsdPrice === null
                ? ''
                : ` ($${formatNumberWido(
                    fromWei(
                      quoteValue.fromTokenAmount * quoteValue.fromTokenUsdPrice,
                      token.decimals || token.data.lpTokenData.decimals,
                    ),
                    WIDO_BALANCES_DECIMALS,
                  )})`)
          const toInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(quoteValue.toTokenAmount, pickedToken.decimals),
              WIDO_BALANCES_DECIMALS,
            ) +
              (quoteValue.toTokenUsdPrice === null
                ? ''
                : ` ($${formatNumberWido(
                    fromWei(
                      quoteValue.toTokenAmount * quoteValue.toTokenUsdPrice,
                      pickedToken.decimals,
                    ),
                    WIDO_BALANCES_DECIMALS,
                  )})`)
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
      tokenAddress: fromToken,
      amount: amnt,
    })
    await mainWeb3.eth.sendTransaction({
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
        fromToken,
        toToken: pickedToken.address,
        accountAddress: account, // User
      })

      console.debug('Allowance Spender: ', spender)
      console.debug('Allowance Amount: ', allowance)

      if (!new BigNumber(allowance).gte(unstakeBalance)) {
        const amountToApprove = new BigNumber(unstakeBalance).minus(allowance)
        await approveZap(amountToApprove) // Approve for Zap
      }
      setApproveValue(2)
    } catch (err) {
      toast.error('Failed to approve!')
      setApproveValue(0)
    }
  }

  const [executeValue, setExecuteValue] = React.useState(0)
  const onClickExecute = async () => {
    if (approveValue !== 2) {
      toast.error('Please approve first!')
      return
    }
    setExecuteValue(1)
    const user = account
    const amount = unstakeBalance
    try {
      const fromChainId = chainId
      const toChainId = chainId
      const toToken = pickedToken.address
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
        mainWeb3.currentProvider,
      )

      await mainWeb3.eth.sendTransaction({
        from: quoteResult.from,
        data: quoteResult.data,
        to: quoteResult.to,
        value: quoteResult.value,
      })
      await fetchUserPoolStats([fAssetPool], account, userStats)
      setExecuteValue(2)
    } catch (err) {
      toast.error('Failed to execute!')
      setExecuteValue(0)
    }
  }

  const initState = () => {
    setExecuteValue(0)
    setApproveValue(0)
  }

  const onClickClose = () => {
    initState()
    setClickedTokenId(-1)
    // setClickedVaultId(-1)
    setPickedToken({ symbol: 'Destination token' })
    setFinalStep(false)
    setWithdrawWido(false)
    setSelectTokenWith(false)
    setUnstakeBalance('0')
  }

  const { borderColor, backColor, filterColor } = useThemeContext()

  return (
    <SelectTokenWido show={finalStep} backColor={backColor} borderColor={borderColor}>
      <NewLabel
        display="flex"
        justifyContent="space-between"
        marginBottom="15px"
        weight="500"
        size="14px"
        height="18px"
        color="#1F2937"
        align="center"
      >
        <CloseBtn
          src={BackIcon}
          width={18}
          height={18}
          alt=""
          onClick={() => {
            initState()
            setFinalStep(false)
          }}
          filterColor={filterColor}
        />
        You are about to swap
        <CloseBtn src={SettingIcon} width={18} height={18} alt="" onClick={() => {}} />
      </NewLabel>

      <NewLabel marginBottom="20px">
        <WidoSwapToken
          img={Swap1WithIcon}
          name={fromInfo}
          value={useIFARM ? symbol : `f${tokenSymbol}`}
        />
        <NewLabel display="flex" justifyContent="center" marginBottom="10px">
          <IconArrowDown
            filterColor={filterColor}
            src={ArrowDownIcon}
            width={25}
            height={25}
            alt=""
          />
        </NewLabel>
        <WidoSwapToken img={pickedToken.logoURI} name={toInfo} value={pickedToken.symbol} />
      </NewLabel>

      <NewLabel size="16px" height="21px" weight={600}>
        <Buttons
          show={approveValue}
          onClick={() => {
            onClickApprove()
          }}
        >
          {approveValue === 2 ? (
            <>
              {useIFARM ? symbol : tokenSymbol} withdrawal approved
              <img src={CheckIcon} alt="" />
            </>
          ) : (
            <>
              Approve {useIFARM ? symbol : tokenSymbol} withdrawal
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
              Withdraw
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            </>
          ) : (
            <>
              {executeValue === 0 ? 'Withdraw' : 'Withdraw Complete!'}
              <img src={WithdrawIcon} alt="" />
            </>
          )}
        </ExecuteButton>

        <CloseButton
          show={executeValue}
          onClick={() => {
            onClickClose()
          }}
        >
          <span>Close this Pop-up</span>
        </CloseButton>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoWithdrawFinalStep
