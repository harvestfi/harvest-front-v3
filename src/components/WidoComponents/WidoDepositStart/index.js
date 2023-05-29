import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { quote } from 'wido'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import { IFARM_TOKEN_SYMBOL, WIDO_BALANCES_DECIMALS } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, mainWeb3, toWei, safeWeb3 } from '../../../services/web3'
import { formatNumberWido, isSafeApp } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { Divider } from '../../GlobalStyle'
import WidoSwapToken from '../WidoSwapToken'
import { Buttons, CloseBtn, NewLabel, SelectTokenWido, IconArrowDown } from './style'
import { addresses } from '../../../data'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import IFARMIcon from '../../../assets/images/logos/wido/ifarm.svg'
import SettingIcon from '../../../assets/images/logos/wido/setting.svg'
import Swap2Icon from '../../../assets/images/logos/wido/swap2.svg'
import { useVaults } from '../../../providers/Vault'

const WidoDepositStart = ({
  pickedToken,
  depositWido,
  setDepositWido,
  finalStep,
  setFinalStep,
  startRoutes,
  startSlippage,
  setStartSlippage,
  slippagePercentage,
  inputAmount,
  token,
  balanceList,
  symbol,
  tokenSymbol,
  useIFARM,
  quoteValue,
  setQuoteValue,
}) => {
  const { backColor, borderColor, filterColor } = useThemeContext()
  const { account } = useWallet()
  const { vaultsData } = useVaults()

  const chainId = token.chain || token.data.chain

  const amount = toWei(inputAmount, pickedToken.decimals)
  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  const pricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(amount).isEqualTo(0) &&
      depositWido &&
      balanceList.length !== 0
    ) {
      const getQuoteResult = async () => {
        setFromInfo('')
        setToInfo('')
        setQuoteValue(null)
        try {
          let fromInfoTemp = '',
            toInfoTemp = ''
          if (pickedToken.default) {
            fromInfoTemp = `${formatNumberWido(inputAmount, WIDO_BALANCES_DECIMALS)} ($${
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
              WIDO_BALANCES_DECIMALS,
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
          } else {
            const fromChainId = chainId
            const fromToken = pickedToken.address
            const toToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
            const toChainId = chainId
            const user = account
            let safeWeb,
              curToken = balanceList.filter(itoken => itoken.symbol === pickedToken.symbol)
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
            setQuoteValue(quoteResult)
            curToken = curToken[0]
            fromInfoTemp =
              formatNumberWido(
                fromWei(quoteResult.fromTokenAmount, curToken.decimals),
                WIDO_BALANCES_DECIMALS,
              ) +
              (quoteResult.fromTokenAmountUsdValue === null
                ? ''
                : ` ($${formatNumberWido(
                    fromWei(quoteResult.fromTokenAmount, curToken.decimals) *
                      quoteResult.fromTokenUsdPrice,
                    WIDO_BALANCES_DECIMALS,
                  )})`)
            toInfoTemp =
              formatNumberWido(
                fromWei(
                  quoteResult.toTokenAmount,
                  token.decimals || token.data.lpTokenData.decimals,
                ),
                WIDO_BALANCES_DECIMALS,
              ) +
              (quoteResult.toTokenAmountUsdValue === null
                ? ''
                : ` ($${formatNumberWido(
                    fromWei(
                      quoteResult.toTokenAmount,
                      token.decimals || token.data.lpTokenData.decimals,
                    ) * quoteResult.toTokenUsdPrice,
                    WIDO_BALANCES_DECIMALS,
                  )})`)
          }

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
    amount,
    chainId,
    pickedToken,
    token,
    depositWido,
    slippagePercentage,
    balanceList,
    setQuoteValue,
    useIFARM,
    inputAmount,
    pricePerFullShare,
  ])

  return (
    <SelectTokenWido
      show={depositWido && !finalStep && !startRoutes && !startSlippage}
      borderColor={borderColor}
      backColor={backColor}
    >
      <NewLabel
        display="flex"
        justifyContent="space-between"
        marginBottom="15px"
        weight="700"
        size="14px"
        height="18px"
        align="center"
      >
        <CloseBtn
          src={BackIcon}
          width={18}
          height={18}
          alt=""
          onClick={() => {
            setDepositWido(false)
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

      <NewLabel marginBottom="15px">
        <WidoSwapToken img={pickedToken.logoURI} name={fromInfo} value={pickedToken.symbol} />
        <NewLabel display="flex" justifyContent="center" marginBottom="15px" marginTop="15px">
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

      <NewLabel marginBottom="15px">
        <Divider height="1px" backColor="#EAECF0" />
      </NewLabel>

      <NewLabel weight={400} size="14px" height="18px" marginBottom="20px" color="#475467">
        <NewLabel display="flex" justifyContent="space-between" marginBottom="15px">
          <NewLabel>Rate</NewLabel>
          <NewLabel display="flex" items="center">
            {
              <>
                1&nbsp;
                <img src={pickedToken.logoURI} width={20} height={20} alt="" />
                &nbsp;=&nbsp;
              </>
            }
            {pickedToken.default ? (
              formatNumberWido(
                1 / fromWei(pricePerFullShare, token.decimals || token.data.lpTokenData.decimals),
                WIDO_BALANCES_DECIMALS,
              )
            ) : quoteValue ? (
              <>{formatNumberWido(quoteValue.price, WIDO_BALANCES_DECIMALS)}</>
            ) : (
              <AnimatedDots />
            )}
          </NewLabel>
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-between" marginBottom="15px">
          <NewLabel>Expected Output</NewLabel>
          <NewLabel weight={400} size="14px" height="18px" display="flex" items="center">
            {
              <>
                <img src={useIFARM ? IFARMIcon : Swap2Icon} width={20} height={20} alt="" />~
              </>
            }
            {pickedToken.default ? (
              formatNumberWido(
                new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
                WIDO_BALANCES_DECIMALS,
              )
            ) : quoteValue ? (
              <>
                {formatNumberWido(
                  fromWei(
                    quoteValue.toTokenAmount,
                    token.decimals || token.data.lpTokenData.decimals,
                  ),
                  WIDO_BALANCES_DECIMALS,
                )}
              </>
            ) : (
              <AnimatedDots />
            )}
          </NewLabel>
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-between" marginBottom="15px">
          <NewLabel>Minimum Received</NewLabel>
          <NewLabel weight={400} size="14px" height="18px" display="flex" items="center">
            <img src={useIFARM ? IFARMIcon : Swap2Icon} width={20} height={20} alt="" />
            &nbsp;
            {pickedToken.default ? (
              formatNumberWido(
                new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
                WIDO_BALANCES_DECIMALS,
              )
            ) : quoteValue ? (
              <>
                {formatNumberWido(
                  fromWei(
                    quoteValue.minToTokenAmount,
                    token.decimals || token.data.lpTokenData.decimals,
                  ),
                  WIDO_BALANCES_DECIMALS,
                )}
              </>
            ) : (
              <AnimatedDots />
            )}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <NewLabel size="16px" height="21px" weight={500} color="#1F2937">
        <Buttons
          color="continue"
          onClick={() => {
            setFinalStep(true)
          }}
        >
          Continue Deposit
          <img src={ChevronRightIcon} alt="" />
        </Buttons>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoDepositStart
