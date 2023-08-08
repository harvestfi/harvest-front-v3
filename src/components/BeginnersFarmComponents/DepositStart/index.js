import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { quote } from 'wido'
import ReactTooltip from 'react-tooltip'
import BackIcon from '../../../assets/images/logos/beginners/arrow-left.svg'
import HelpIcon from '../../../assets/images/logos/beginners/help-circle.svg'
import FaceSmileIcon from '../../../assets/images/logos/beginners/face-smile.svg'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import {
  IFARM_TOKEN_SYMBOL,
  WIDO_BALANCES_DECIMALS,
  WIDO_EXTEND_DECIMALS,
  BEGINNERS_BALANCES_DECIMALS,
} from '../../../constants'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, toWei, getWeb3 } from '../../../services/web3'
import { formatNumberWido } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { Buttons, ImgBtn, NewLabel, SelectTokenWido, FTokenInfo, IconCard, GotItBtn } from './style'
import { addresses } from '../../../data'
import { useVaults } from '../../../providers/Vault'

const DepositStart = ({
  pickedToken,
  depositWido,
  setDepositWido,
  finalStep,
  // setFinalStep,
  startRoutes,
  startSlippage,
  slippagePercentage,
  inputAmount,
  token,
  balanceList,
  tokenSymbol,
  useIFARM,
  quoteValue,
  setQuoteValue,
}) => {
  const { account, web3 } = useWallet()
  const { vaultsData } = useVaults()

  const chainId = token.chain || token.data.chain

  const amount = toWei(inputAmount, pickedToken.decimals)
  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')

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
        setFromInfoAmount('')
        setQuoteValue(null)
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = ''
          if (pickedToken.default) {
            fromInfoValue = `${formatNumberWido(inputAmount, WIDO_EXTEND_DECIMALS)}`
            fromInfoUsdValue =
              pickedToken.usdPrice !== '0.0'
                ? formatNumberWido(
                    new BigNumber(amount)
                      .multipliedBy(pickedToken.usdPrice)
                      .dividedBy(new BigNumber(10).exponentiatedBy(pickedToken.decimals)),
                    WIDO_BALANCES_DECIMALS,
                  )
                : ''
          } else {
            const fromChainId = chainId
            const fromToken = pickedToken.address
            const toToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
            const toChainId = chainId
            const user = account
            const mainWeb = await getWeb3(chainId, account, web3)
            let curToken = balanceList.filter(itoken => itoken.symbol === pickedToken.symbol)

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
            fromInfoValue = formatNumberWido(
              fromWei(quoteResult.fromTokenAmount, curToken.decimals),
              WIDO_EXTEND_DECIMALS,
            )
            fromInfoUsdValue =
              quoteResult.fromTokenAmountUsdValue === null
                ? ''
                : ` ${formatNumberWido(
                    fromWei(quoteResult.fromTokenAmount, curToken.decimals) *
                      quoteResult.fromTokenUsdPrice,
                    BEGINNERS_BALANCES_DECIMALS,
                  )}`
          }

          setFromInfoAmount(fromInfoValue)
          setFromInfoUsdAmount(fromInfoUsdValue)
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
    web3,
    inputAmount,
    pricePerFullShare,
  ])

  const [showDesc, setShowDesc] = useState(true)

  return (
    <SelectTokenWido show={depositWido && !finalStep && !startRoutes && !startSlippage}>
      <NewLabel
        display="flex"
        marginBottom="16px"
        padding="10px 0"
        width="fit-content"
        cursorType="pointer"
        weight="600"
        size="14px"
        height="20px"
        color="#EDAE50"
        align="center"
        onClick={() => {
          setDepositWido(false)
        }}
      >
        <ImgBtn src={BackIcon} alt="" />
        Back
      </NewLabel>

      <NewLabel color="#101828" size="18px" weight="600" height="28px" marginBottom="10px">
        Summary
      </NewLabel>

      <NewLabel size="14px" height="24px" color="#344054">
        <NewLabel display="flex" justifyContent="space-between" padding="10px 0">
          <NewLabel weight="500">Depositing</NewLabel>
          <NewLabel weight="600">
            {fromInfoAmount !== '' ? fromInfoAmount : <AnimatedDots />}&nbsp;{pickedToken.symbol}
          </NewLabel>
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-between" padding="10px 0">
          <NewLabel weight="500">Est. USD Value</NewLabel>
          <NewLabel weight="600">
            ${fromInfoUsdAmount !== '' ? fromInfoUsdAmount : <AnimatedDots />}
          </NewLabel>
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-between" padding="10px 0">
          <NewLabel className="beginners" weight="500">
            Min. Received
            <img className="help-icon" src={HelpIcon} alt="" data-tip data-for="min-help" />
            <ReactTooltip
              id="min-help"
              backgroundColor="white"
              borderColor="white"
              textColor="#344054"
              place="right"
            >
              <NewLabel size="12px" height="18px" weight="600" color="#344054">
                You will receive no less f{tokenSymbol} than the displayed amount.
              </NewLabel>
            </ReactTooltip>
          </NewLabel>
          <NewLabel weight="600">
            {pickedToken.default ? (
              formatNumberWido(
                new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
                WIDO_EXTEND_DECIMALS,
              )
            ) : quoteValue ? (
              <>
                {formatNumberWido(
                  fromWei(
                    quoteValue.minToTokenAmount,
                    token.decimals || token.data.lpTokenData.decimals,
                  ),
                  WIDO_EXTEND_DECIMALS,
                )}
              </>
            ) : (
              <AnimatedDots />
            )}
            &nbsp;{`f${tokenSymbol}`}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <FTokenInfo isShow={showDesc ? 'true' : 'false'}>
        <NewLabel marginRight="12px">
          <IconCard>
            <img src={FaceSmileIcon} alt="" />
          </IconCard>
        </NewLabel>
        <NewLabel marginRight="12px">
          <NewLabel color="#344054" size="14px" height="20px" weight="600" marginBottom="4px">
            What is fUSDC?
          </NewLabel>
          <NewLabel color="#475467" size="14px" height="20px" weight="400" marginBottom="5px">
            It is a proof-of-deposit token, which entitles you to deposit and any accrued yield.
          </NewLabel>
          <GotItBtn>Got it</GotItBtn>
        </NewLabel>
        <NewLabel>
          <ImgBtn
            src={CloseIcon}
            alt=""
            onClick={() => {
              setShowDesc(false)
            }}
          />
        </NewLabel>
      </FTokenInfo>

      <NewLabel size="16px" height="21px" weight={500} color="#1F2937" marginTop="25px">
        <Buttons
          color="continue"
          onClick={() => {
            // setFinalStep(true)
          }}
        >
          Finalize Deposit
        </Buttons>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default DepositStart
