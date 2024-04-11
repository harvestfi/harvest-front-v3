import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { round } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { BsArrowDown, BsArrowUp } from 'react-icons/bs'
import DropDownIcon from '../../../../assets/images/logos/advancedfarm/drop-down.svg'
// import WalletIcon from '../../../../assets/images/logos/beginners/wallet-in-button.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import { BEGINNERS_BALANCES_DECIMALS } from '../../../../constants'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { useWallet } from '../../../../providers/Wallet'
import { CHAIN_IDS } from '../../../../data/constants'
import { fromWei, toWei } from '../../../../services/web3'
import { addresses } from '../../../../data'
import { formatNumberWido, isSpecialApp } from '../../../../utilities/formats'
import Button from '../../../Button'
import AnimatedDots from '../../../AnimatedDots'
import {
  BalanceInfo,
  BaseWidoDiv,
  DepoTitle,
  TokenInput,
  TokenAmount,
  TokenUSDAmount,
  TokenInfo,
  TokenSelect,
  NewLabel,
  AmountSection,
  // ThemeMode,
  InsufficientSection,
  HasErrorSection,
  FlexDiv,
  CloseBtn,
  DepositTokenSection,
  SwitchTabTag,
} from './style'
import { usePortals } from '../../../../providers/Portals'

const getChainName = chain => {
  let chainName = 'Ethereum'
  switch (chain) {
    case CHAIN_IDS.POLYGON_MAINNET:
      chainName = 'Polygon'
      break
    case CHAIN_IDS.ARBITRUM_ONE:
      chainName = 'Arbitrum'
      break
    case CHAIN_IDS.BASE:
      chainName = 'Base'
      break
    default:
      chainName = 'Ethereum'
      break
  }
  return chainName
}

const DepositBase = ({
  setSelectToken,
  deposit,
  setDeposit,
  balance,
  balanceList,
  pickedToken,
  defaultToken,
  inputAmount,
  pricePerFullShare,
  setInputAmount,
  token,
  supTokenList,
  switchMethod,
  tokenSymbol,
  useIFARM,
  useBeginnersFarm,
  setFromInfoAmount,
  setFromInfoUsdAmount,
  fromInfoUsdAmount,
  convertMonthlyYieldUSD,
  convertDailyYieldUSD,
  minReceiveAmountString,
  setMinReceiveAmountString,
  setMinReceiveUsdAmount,
  setConvertMonthlyYieldUSD,
  setConvertDailyYieldUSD,
  hasErrorOccurred,
  setHasErrorOccurred,
  failureCount,
  setFailureCount,
  supportedVault,
  setSupportedVault,
  hasPortalsError,
}) => {
  const {
    bgColor,
    fontColor,
    fontColor1,
    fontColor2,
    fontColor3,
    fontColor4,
    activeColor,
    bgColorMessage,
  } = useThemeContext()

  const { connected, connectAction, account, chainId, setChainId, web3 } = useWallet()
  const { getPortalsEstimate, getPortalsToken } = usePortals()

  const [
    {
      connectedChain, // the current chain the user's wallet is connected to
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain()

  const slippage = 0.5 // Default slippage Percent
  const tokenChain = token.chain || token.data.chain
  const curChain = isSpecialApp
    ? chainId
    : connectedChain
    ? parseInt(connectedChain.id, 16).toString()
    : ''

  const [depositName, setDepositName] = useState('Preview & Convert')
  const [showWarning, setShowWarning] = useState(false)
  // const [showDepositIcon, setShowDepositIcon] = useState(true)
  const amount = toWei(inputAmount, pickedToken.decimals, 0)

  useEffect(() => {
    if (account) {
      if (curChain !== '' && curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setDepositName(`Change Network to ${chainName}`)
        // setShowDepositIcon(false)
      } else {
        setDepositName('Preview & Convert')
      }
    } else {
      setDepositName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain])

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(amount.toString()).isEqualTo(0) &&
      curChain === tokenChain &&
      (balanceList.length !== 0 || pickedToken.balance !== '0') &&
      failureCount < 5
    ) {
      const getQuoteResult = async () => {
        setFromInfoAmount('')
        setFromInfoUsdAmount('')
        let portalsEstimate
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = '',
            minReceiveAmount = '',
            minReceiveUsd = '',
            outputAmountDefault = ''

          const fromToken = pickedToken.address
          const toToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
          const pickedTokenRawBalance = toWei(pickedToken.balance, pickedToken.decimals, 0)

          const overBalance = new BigNumber(amount.toString()).isGreaterThan(
            new BigNumber(pickedTokenRawBalance.toString()),
          )

          const pickedDefaultToken =
            pickedToken.address.toLowerCase() === defaultToken.address.toLowerCase()

          if (pickedDefaultToken) {
            const outputAmountDefaultDecimals = new BigNumber(inputAmount.toString())
              .dividedBy(new BigNumber(pricePerFullShare))
              .toString()
            outputAmountDefault = toWei(outputAmountDefaultDecimals, pickedToken.decimals, 0)
          } else if (supportedVault) {
            portalsEstimate = await getPortalsEstimate({
              chainId,
              tokenIn: fromToken,
              inputAmount: amount,
              tokenOut: toToken,
              slippage,
              sender: overBalance ? null : account,
            })

            if (portalsEstimate.res.message === 'outputToken not found') {
              setSupportedVault(false)
            } else {
              setSupportedVault(true)
            }
          }

          if (pickedDefaultToken || portalsEstimate.succeed) {
            let fromTokenUsdPrice, toTokenUsdPrice
            if (pickedDefaultToken) {
              fromTokenUsdPrice = pickedToken.usdPrice
              toTokenUsdPrice = Number(pickedToken.usdPrice) * Number(pricePerFullShare)
            } else {
              const fromTokenDetail = await getPortalsToken(chainId, fromToken)
              const toTokenDetail = await getPortalsToken(chainId, toToken)
              fromTokenUsdPrice = fromTokenDetail?.price
              toTokenUsdPrice = toTokenDetail?.price
            }

            const quoteResult = {
              fromTokenAmount: amount,
              fromTokenUsdPrice,
              minToTokenAmount: pickedDefaultToken
                ? outputAmountDefault
                : portalsEstimate.res.outputAmount,
              outputTokenDecimals: pickedDefaultToken
                ? pickedToken.decimals
                : portalsEstimate.res.outputTokenDecimals,
            }

            if (pickedToken) {
              fromInfoValue = new BigNumber(
                fromWei(
                  quoteResult.fromTokenAmount,
                  pickedToken.decimals,
                  pickedToken.decimals,
                  false,
                ),
              ).toString()

              fromInfoUsdValue =
                quoteResult.fromTokenAmount === null
                  ? '0'
                  : formatNumberWido(
                      fromWei(
                        quoteResult.fromTokenAmount,
                        pickedToken.decimals,
                        pickedToken.decimals,
                        true,
                      ) * quoteResult.fromTokenUsdPrice,
                      BEGINNERS_BALANCES_DECIMALS,
                    )
              minReceiveAmount = new BigNumber(
                fromWei(
                  quoteResult.minToTokenAmount,
                  quoteResult.outputTokenDecimals || token.data.lpTokenData.decimals,
                  quoteResult.outputTokenDecimals || token.data.lpTokenData.decimals,
                  false,
                ),
              ).toString()
              minReceiveUsd = formatNumberWido(
                parseFloat(minReceiveAmount) * toTokenUsdPrice,
                BEGINNERS_BALANCES_DECIMALS,
              )
            }
            setMinReceiveAmountString(minReceiveAmount)
            setFromInfoAmount(fromInfoValue)
            setHasErrorOccurred(0)
            setFailureCount(0)
            if (Number(fromInfoUsdValue) < 0.01) {
              setFromInfoUsdAmount('<$0.01')
            } else {
              setFromInfoUsdAmount(`$${fromInfoUsdValue}`)
            }
            if (Number(minReceiveUsd) < 0.01) {
              setMinReceiveUsdAmount('<$0.01')
            } else {
              setMinReceiveUsdAmount(`$${minReceiveUsd}`)
            }
          } else {
            setFailureCount(prevCount => prevCount + 1)

            if (failureCount === 4) {
              setConvertMonthlyYieldUSD('-')
              setConvertDailyYieldUSD('-')
              setMinReceiveAmountString('-')
              setMinReceiveUsdAmount('-')
              setFromInfoUsdAmount('-')
              if (
                portalsEstimate.res.message === 'outputToken not found' ||
                portalsEstimate.res.message === 'Unexpected error'
              ) {
                setHasErrorOccurred(2)
              } else {
                setHasErrorOccurred(1)
              }
            }
          }
        } catch (e) {
          console.error('Error content: ', e)
        }
      }

      getQuoteResult()
    }
  }, [
    account,
    amount,
    chainId,
    curChain,
    tokenChain,
    pickedToken,
    defaultToken,
    token,
    balanceList,
    useIFARM,
    web3,
    inputAmount,
    pricePerFullShare,
    setFromInfoAmount,
    setFromInfoUsdAmount,
    setMinReceiveAmountString,
    setMinReceiveUsdAmount,
    setConvertMonthlyYieldUSD,
    setConvertDailyYieldUSD,
    getPortalsEstimate,
    getPortalsToken,
    failureCount,
    setFailureCount,
    setHasErrorOccurred,
    supportedVault,
    setSupportedVault,
  ])

  const onClickDeposit = async () => {
    if (!connected) {
      connectAction()
      return
    }
    if (curChain !== tokenChain) {
      const chainHex = `0x${Number(tokenChain).toString(16)}`
      if (!isSpecialApp) {
        await setChain({ chainId: chainHex })
        setChainId(tokenChain)
      }
    } else {
      if (pickedToken.symbol === 'Select Token') {
        toast.error('Please choose your Output Token.')
        return
      }
      const supToken = supTokenList.find(el => el.symbol === pickedToken.symbol)
      if (!hasPortalsError && !supToken) {
        toast.error("Can't Deposit with Unsupported token!")
        return
      }
      if (new BigNumber(inputAmount).isGreaterThan(new BigNumber(balance))) {
        setShowWarning(true)
        return
      }
      if (new BigNumber(inputAmount).isEqualTo(0)) {
        toast.error('Cannot deposit 0!')
        return
      }
      setDeposit(true)
      setShowWarning(false)
    }
  }

  useEffect(() => {
    if (!deposit && pickedToken.usdPrice) {
      setInputAmount(new BigNumber(balance).toString())
    }
  }, [balance, setInputAmount, pickedToken, deposit])

  const onInputBalance = e => {
    const inputValue = e.currentTarget.value.replace(/,/g, '.')
    setInputAmount(inputValue)
  }

  const mainTags = [
    { name: 'Convert', img: BsArrowDown },
    { name: 'Revert', img: BsArrowUp },
  ]

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <>
      <BaseWidoDiv>
        <NewLabel
          size={isMobile ? '16px' : '16px'}
          height={isMobile ? '24px' : '24px'}
          weight="600"
          color={fontColor1}
          display="flex"
          justifyContent="center"
          padding={isMobile ? '4px 0px' : '4px 0px'}
          marginBottom="13px"
          border="1px solid #F8F8F8"
          borderRadius="8px"
        >
          {mainTags.map((tag, i) => (
            <SwitchTabTag
              key={i}
              num={i}
              onClick={() => {
                if (i === 1) {
                  switchMethod()
                }
              }}
              color={i === 0 ? fontColor4 : fontColor3}
              borderColor={i === 0 ? activeColor : ''}
              backColor={i === 0 ? activeColor : ''}
              boxShadow={
                i === 0
                  ? '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
                  : ''
              }
            >
              <tag.img />
              <p>{tag.name}</p>
            </SwitchTabTag>
          ))}
        </NewLabel>
        <DepoTitle fontColor={fontColor}>
          {useBeginnersFarm
            ? `Convert your crypto into interest-bearing f${tokenSymbol} to earn yield`
            : useIFARM
            ? `Convert your crypto into interest-bearing i${tokenSymbol}.`
            : 'Convert your crypto into interest-bearing fTokens.'}
        </DepoTitle>
        <TokenInfo>
          <AmountSection>
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="500"
              color={fontColor2}
              marginBottom="6px"
            >
              Amount to convert
            </NewLabel>
            <TokenInput>
              <TokenAmount
                type="text"
                value={inputAmount}
                onChange={onInputBalance}
                bgColor={bgColor}
                fontColor2={fontColor2}
              />
              <TokenUSDAmount fontColor3={fontColor3}>
                {inputAmount === '0' || inputAmount === '' ? (
                  '$0'
                ) : fromInfoUsdAmount === '' ? (
                  <TokenInfo>
                    <AnimatedDots />
                  </TokenInfo>
                ) : fromInfoUsdAmount === '-' ? (
                  '-'
                ) : (
                  `≈${fromInfoUsdAmount}`
                )}
              </TokenUSDAmount>
            </TokenInput>
          </AmountSection>
          <DepositTokenSection>
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="500"
              color={fontColor2}
              marginBottom="6px"
            >
              Input Token
            </NewLabel>
            <TokenSelect
              type="button"
              onClick={async () => {
                setSelectToken(true)
              }}
            >
              {pickedToken.logoURI ? (
                <img className="logo" src={pickedToken.logoURI} width={21} height={21} alt="" />
              ) : (
                <></>
              )}
              <span>{pickedToken.symbol}</span>
              <img className="dropdown-icon" src={DropDownIcon} alt="" />
            </TokenSelect>
          </DepositTokenSection>
        </TokenInfo>
        <BalanceInfo
          fontColor={fontColor}
          onClick={() => {
            if (account && pickedToken.symbol !== 'Select Token') {
              setInputAmount(new BigNumber(balance).toString())
            }
          }}
        >
          {isMobile && (pickedToken.symbol === 'Select Token' ? '' : `${pickedToken.symbol} `)}
          Balance Available:
          <span>{new BigNumber(balance).toString()}</span>
        </BalanceInfo>
        <InsufficientSection
          isShow={showWarning ? 'true' : 'false'}
          activeColor={activeColor}
          bgColorMessage={bgColorMessage}
        >
          <NewLabel display="flex" widthDiv="80%" items="center">
            <img className="info-icon" src={InfoIcon} alt="" />
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="600"
              color={fontColor2}
            >
              Insufficient {pickedToken.symbol} balance in your wallet
            </NewLabel>
          </NewLabel>
          <div>
            <CloseBtn
              src={CloseIcon}
              alt=""
              onClick={() => {
                setShowWarning(false)
              }}
            />
          </div>
        </InsufficientSection>
        <HasErrorSection
          isShow={hasErrorOccurred === 1 ? 'true' : 'false'}
          activeColor={activeColor}
        >
          <NewLabel display="flex" flexFlow="column" widthDiv="100%">
            <FlexDiv>
              <img className="info-icon" src={InfoIcon} alt="" />
              <NewLabel
                size={isMobile ? '14px' : '14px'}
                height={isMobile ? '20px' : '20px'}
                weight="600"
                color={fontColor2}
              >
                Opss, we are having small issues with getting quotes. Please try again in 2 minutes.
              </NewLabel>
            </FlexDiv>
          </NewLabel>
          <div>
            <CloseBtn
              src={CloseIcon}
              alt=""
              onClick={() => {
                setHasErrorOccurred(0)
              }}
            />
          </div>
        </HasErrorSection>
      </BaseWidoDiv>
      <BaseWidoDiv>
        <NewLabel
          size={isMobile ? '14px' : '14px'}
          height={isMobile ? '24px' : '24px'}
          color="#344054"
        >
          <NewLabel
            display="flex"
            justifyContent="space-between"
            padding={isMobile ? '10px 0' : '10px 0'}
          >
            <NewLabel
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color={fontColor3}
              weight="500"
            >
              Est. Monthly Yield
              <PiQuestion className="question" data-tip data-for="monthly-yield" />
              <ReactTooltip
                id="monthly-yield"
                backgroundColor="#101828"
                borderColor="black"
                textColor="white"
                place="right"
              >
                <NewLabel
                  size={isMobile ? '12px' : '12px'}
                  height={isMobile ? '18px' : '18px'}
                  weight="500"
                  color="white"
                >
                  {useBeginnersFarm
                    ? `Based on live USD prices of tokens involved in this farm. Subject to change due to market fluctuations and the number of users in this farm.`
                    : useIFARM
                    ? 'Based on live USD price of iFARM. Considers current APY. Subject to change.'
                    : 'Based on live USD prices of underlying and reward tokens. Considers current APY and assumes staked fTokens. Subject to change.'}
                </NewLabel>
              </ReactTooltip>
            </NewLabel>
            <NewLabel
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color={fontColor4}
              weight="600"
              textAlign="right"
            >
              {account &&
              pickedToken.symbol !== 'Select Token' &&
              !new BigNumber(amount).isEqualTo(0) &&
              balanceList.length !== 0 ? (
                minReceiveAmountString !== '' ? (
                  convertMonthlyYieldUSD === '0' ? (
                    '$0.00'
                  ) : convertMonthlyYieldUSD === '-' ? (
                    '-'
                  ) : convertMonthlyYieldUSD === 'NaN' ? (
                    '-'
                  ) : Number(convertMonthlyYieldUSD) < 0.01 ? (
                    '<$0.01'
                  ) : (
                    `$${round(convertMonthlyYieldUSD, 2)}`
                  )
                ) : (
                  <TokenInfo>
                    <AnimatedDots />
                  </TokenInfo>
                )
              ) : (
                '-'
              )}
            </NewLabel>
          </NewLabel>
          <NewLabel
            display="flex"
            justifyContent="space-between"
            padding={isMobile ? '10px 0' : '10px 0'}
          >
            <NewLabel
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color={fontColor3}
              weight="500"
            >
              Est. Daily Yield
              <PiQuestion className="question" data-tip data-for="daily-yield" />
              <ReactTooltip
                id="daily-yield"
                backgroundColor="#101828"
                borderColor="black"
                textColor="white"
                place="right"
                width="100px"
              >
                <NewLabel
                  size={isMobile ? '12px' : '12px'}
                  height={isMobile ? '18px' : '18px'}
                  weight="500"
                  color="white"
                >
                  {useBeginnersFarm
                    ? `Based on live USD prices of tokens involved in this farm. Subject to change due to market fluctuations and the number of users in this farm.`
                    : useIFARM
                    ? 'Based on live USD price of iFARM. Considers current APY. Subject to change.'
                    : 'Based on live USD prices of underlying and reward tokens. Considers current APY and assumes staked fTokens. Subject to change.'}
                </NewLabel>
              </ReactTooltip>
            </NewLabel>
            <NewLabel
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color={fontColor4}
              weight="600"
              textAlign="right"
            >
              {account &&
              pickedToken.symbol !== 'Select Token' &&
              !new BigNumber(amount).isEqualTo(0) &&
              balanceList.length !== 0 ? (
                minReceiveAmountString !== '' ? (
                  convertDailyYieldUSD === '0' ? (
                    '$0.00'
                  ) : convertDailyYieldUSD === '-' ? (
                    '-'
                  ) : convertDailyYieldUSD === 'NaN' ? (
                    '-'
                  ) : Number(convertDailyYieldUSD) < 0.01 ? (
                    '<$0.01'
                  ) : (
                    `$${round(convertDailyYieldUSD, 2)}`
                  )
                ) : (
                  <TokenInfo>
                    <AnimatedDots />
                  </TokenInfo>
                )
              ) : (
                '-'
              )}
            </NewLabel>
          </NewLabel>
          <NewLabel
            display="flex"
            justifyContent="space-between"
            padding={isMobile ? '10px 0' : '10px 0'}
          >
            <NewLabel
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color={fontColor3}
              weight="500"
            >
              {useIFARM ? 'Est. Received' : 'Est. fTokens Received'}
              <PiQuestion className="question" data-tip data-for="min-received" />
              <ReactTooltip
                id="min-received"
                backgroundColor="#101828"
                borderColor="black"
                textColor="white"
                place="right"
              >
                <NewLabel
                  size={isMobile ? '12px' : '12px'}
                  height={isMobile ? '18px' : '18px'}
                  weight="500"
                  color="white"
                >
                  {useBeginnersFarm
                    ? `The estimated number of interest-bearing fTokens you will receive in your wallet. The default slippage is set as 'Auto'.`
                    : `The estimated number of fTokens you will receive in your wallet. The default slippage is set as 'Auto'.`}
                </NewLabel>
              </ReactTooltip>
            </NewLabel>
            <NewLabel
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color={fontColor4}
              weight="600"
              textAlign="right"
              display="flex"
              items="flex-end"
              flexFlow="column"
            >
              {account &&
              pickedToken.symbol !== 'Select Token' &&
              !new BigNumber(amount).isEqualTo(0) &&
              balanceList.length !== 0 ? (
                minReceiveAmountString !== '' ? (
                  minReceiveAmountString
                ) : (
                  <TokenInfo>
                    <AnimatedDots />
                  </TokenInfo>
                )
              ) : (
                '-'
              )}
              <span className="token-symbol">
                {useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`}
              </span>
            </NewLabel>
          </NewLabel>
        </NewLabel>
        <NewLabel>
          <Button
            color="wido-deposit"
            width="100%"
            onClick={() => {
              onClickDeposit()
            }}
          >
            {depositName}
            {/* {showDepositIcon && <img src={WalletIcon} alt="" />} */}
          </Button>
        </NewLabel>
      </BaseWidoDiv>
    </>
  )
}
export default DepositBase
