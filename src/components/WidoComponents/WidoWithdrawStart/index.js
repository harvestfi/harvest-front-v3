import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { quote } from 'wido'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import SettingIcon from '../../../assets/images/logos/wido/setting.svg'
import Swap2Icon from '../../../assets/images/logos/wido/swap2.svg'
import { WIDO_BALANCES_DECIMALS } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, mainWeb3 } from '../../../services/web3'
import { formatNumberWido } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { Divider } from '../../GlobalStyle'
import WidoSwapToken from '../WidoSwapToken'
import { addresses } from '../../../data'
import { Buttons, CloseBtn, NewLabel, SelectTokenWido, IconArrowDown } from './style'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'

const WidoWithdrawStart = ({
  withdrawWido,
  setWithdrawWido,
  pickedToken,
  finalStep,
  setFinalStep,
  startRoutes,
  startSlippage,
  setStartSlippage,
  token,
  unstakeBalance,
  slippagePercentage,
  balanceList,
  useIFARM,
  symbol,
  tokenSymbol,
  quoteValue,
  setQuoteValue,
}) => {
  const { backColor, filterColor } = useThemeContext()
  const { account } = useWallet()

  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(unstakeBalance).isEqualTo(0) &&
      withdrawWido
    ) {
      const getQuoteResult = async () => {
        setFromInfo('')
        setToInfo('')
        setQuoteValue(null)
        const amount = unstakeBalance
        try {
          const chainId = token.chain || token.data.chain
          const fromToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
          const fromChainId = chainId
          const toToken = pickedToken.address
          const toChainId = chainId
          const user = account
          let curToken = balanceList.filter(el => el.symbol === pickedToken.symbol)
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
          setQuoteValue(quoteResult)

          curToken = curToken[0]

          const fromInfoTemp =
            formatNumberWido(
              fromWei(
                quoteResult.fromTokenAmount,
                token.decimals || token.data.lpTokenData.decimals,
              ),
              WIDO_BALANCES_DECIMALS,
            ) +
            (quoteResult.fromTokenAmountUsdValue === null
              ? ''
              : ` ($${formatNumberWido(
                  fromWei(
                    quoteResult.fromTokenAmount * quoteResult.fromTokenUsdPrice,
                    token.decimals || token.data.lpTokenData.decimals,
                  ),
                  WIDO_BALANCES_DECIMALS,
                )})`)
          const toInfoTemp =
            formatNumberWido(
              fromWei(quoteResult.toTokenAmount, curToken.decimals),
              WIDO_BALANCES_DECIMALS,
            ) +
            (quoteResult.toTokenUsdPrice === null
              ? ''
              : ` ($${formatNumberWido(
                  fromWei(
                    quoteResult.toTokenAmount * quoteResult.toTokenUsdPrice,
                    curToken.decimals,
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
  }, [
    account,
    pickedToken,
    unstakeBalance,
    withdrawWido,
    slippagePercentage,
    balanceList,
    token,
    setQuoteValue,
    useIFARM,
  ])

  return (
    <SelectTokenWido
      show={withdrawWido && !finalStep && !startRoutes && !startSlippage}
      backColor={backColor}
    >
      <NewLabel
        display="flex"
        justifyContent="space-between"
        marginBottom="10px"
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
            setWithdrawWido(false)
          }}
          filterColor={filterColor}
        />
        You are about to swap
        <CloseBtn
          src={SettingIcon}
          width={18}
          height={18}
          alt=""
          onClick={() => {
            setStartSlippage(true)
          }}
        />
      </NewLabel>

      <div>
        <WidoSwapToken
          img={Swap2Icon}
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
      </div>

      <NewLabel marginBottom="13px">
        <Divider height="1px" backColor="#EAECF0" />
      </NewLabel>

      <NewLabel weight={400} size="14px" height="18px" color="#1F2937" marginBottom="13px">
        <NewLabel display="flex" justifyContent="space-between" marginBottom="15px">
          <NewLabel>Rate</NewLabel>
          <NewLabel display="flex" items="center">
            {quoteValue ? (
              <>
                1&nbsp; =
                {quoteValue &&
                  quoteValue !== {} &&
                  formatNumberWido(quoteValue.price, WIDO_BALANCES_DECIMALS)}
                &nbsp;&nbsp;
                <img src={pickedToken.logoURI} width={20} height={20} alt="" />
              </>
            ) : (
              <AnimatedDots />
            )}
          </NewLabel>
        </NewLabel>

        <NewLabel display="flex" justifyContent="space-between" marginBottom="15px">
          <NewLabel>Expected Output</NewLabel>
          <NewLabel weight={400} size="14px" height="18px" display="flex" items="center">
            {quoteValue ? (
              <>
                <img src={pickedToken.logoURI} width={20} height={20} alt="" />
                &nbsp;~
                {quoteValue &&
                  quoteValue !== {} &&
                  formatNumberWido(
                    fromWei(quoteValue.toTokenAmount, pickedToken.decimals),
                    WIDO_BALANCES_DECIMALS,
                  )}
              </>
            ) : (
              <AnimatedDots />
            )}
          </NewLabel>
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-between" marginBottom="15px">
          <NewLabel>Minimum Recieved</NewLabel>
          <NewLabel weight={400} size="14px" height="18px" display="flex" items="center">
            {quoteValue ? (
              <>
                <img src={pickedToken.logoURI} width={20} height={20} alt="" />
                &nbsp;~
                {quoteValue && quoteValue !== {}
                  ? formatNumberWido(
                      fromWei(quoteValue.minToTokenAmount, pickedToken.decimals),
                      WIDO_BALANCES_DECIMALS,
                    )
                  : ''}
              </>
            ) : (
              <AnimatedDots />
            )}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <NewLabel
        display="flex"
        justifyContent="space-between"
        size="16px"
        height="21px"
        weight={500}
        color="#1F2937"
      >
        <Buttons
          color="continue"
          onClick={() => {
            setFinalStep(true)
          }}
        >
          Continue Withdrawal
          <img src={ChevronRightIcon} alt="" />
        </Buttons>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoWithdrawStart
