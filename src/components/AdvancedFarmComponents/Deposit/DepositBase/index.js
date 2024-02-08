import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { get, round } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import DropDownIcon from '../../../../assets/images/logos/wido/drop-down.svg'
// import WalletIcon from '../../../../assets/images/logos/beginners/wallet-in-button.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ArrowDown from '../../../../assets/images/logos/beginners/arrow-narrow-down.svg'
import ArrowUp from '../../../../assets/images/logos/beginners/arrow-narrow-up.svg'
import HelpIcon from '../../../../assets/images/logos/earn/info.svg'
import {
  IFARM_TOKEN_SYMBOL,
  WIDO_EXTEND_DECIMALS,
  BEGINNERS_BALANCES_DECIMALS,
} from '../../../../constants'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { useWallet } from '../../../../providers/Wallet'
import { CHAIN_IDS } from '../../../../data/constants'
import { fromWei, toWei } from '../../../../services/web3'
import { useVaults } from '../../../../providers/Vault'
import { addresses } from '../../../../data'
import { formatNumberWido, isSpecialApp } from '../../../../utils'
import Button from '../../../Button'
import AnimatedDots from '../../../AnimatedDots'
import {
  BalanceInfo,
  BaseWidoDiv,
  DepoTitle,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  NewLabel,
  AmountSection,
  // ThemeMode,
  InsufficientSection,
  CloseBtn,
  DepositTokenSection,
  SwitchTabTag,
  InfoIconCircle,
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
  inputAmount,
  setInputAmount,
  token,
  supTokenList,
  switchMethod,
  tokenSymbol,
  useIFARM,
  useBeginnersFarm,
  setFromInfoAmount,
  setFromInfoUsdAmount,
  convertMonthlyYieldUSD,
  convertDailyYieldUSD,
  minReceiveAmountString,
  setMinReceiveAmountString,
  setMinReceiveUsdAmount,
}) => {
  const { connected, connectAction, account, chainId, setChainId, web3 } = useWallet()
  const { vaultsData } = useVaults()
  const { getPortalsEstimate, getPortalsToken } = usePortals()
  const { filterColor } = useThemeContext()

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

  const pricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)

  const [depositName, setDepositName] = useState(
    useBeginnersFarm ? 'Preview & Earn Yield' : 'Convert',
  )
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
        setDepositName(useBeginnersFarm ? 'Preview & Earn Yield' : 'Convert')
      }
    } else {
      setDepositName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain, useBeginnersFarm])

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(amount).isEqualTo(0) &&
      curChain === tokenChain &&
      balanceList.length !== 0
    ) {
      const getQuoteResult = async () => {
        setFromInfoAmount('')
        setFromInfoUsdAmount('')
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = '',
            minReceiveAmount = '',
            minReceiveUsd = '',
            curToken = balanceList.filter(itoken => itoken.symbol === pickedToken.symbol)
          const fromToken = pickedToken.address
          const toToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
          const portalsEstimate = await getPortalsEstimate({
            chainId,
            tokenIn: fromToken,
            inputAmount: amount,
            tokenOut: toToken,
            slippage,
            sender: account,
          })

          if (Object.keys(portalsEstimate).length === 0)
            throw new Error('Portals estimate fetch failture')

          const fromTokenDetail = await getPortalsToken(chainId, fromToken)
          const toTokenDetail = await getPortalsToken(chainId, toToken)
          const fromTokenUsdPrice = fromTokenDetail?.price

          const quoteResult = {
            fromTokenAmount: amount,
            fromTokenUsdPrice,
            minToTokenAmount: portalsEstimate.outputAmount,
            outputTokenDecimals: portalsEstimate.outputTokenDecimals,
          }

          curToken = curToken[0]
          if (curToken) {
            fromInfoValue = formatNumberWido(
              fromWei(quoteResult.fromTokenAmount, curToken.decimals, WIDO_EXTEND_DECIMALS, true),
              WIDO_EXTEND_DECIMALS,
            )

            fromInfoUsdValue =
              quoteResult.fromTokenAmount === null
                ? '0'
                : formatNumberWido(
                    fromWei(quoteResult.fromTokenAmount, curToken.decimals, WIDO_EXTEND_DECIMALS) *
                      quoteResult.fromTokenUsdPrice,
                    BEGINNERS_BALANCES_DECIMALS,
                  )
            minReceiveAmount = formatNumberWido(
              fromWei(
                quoteResult.minToTokenAmount,
                quoteResult.outputTokenDecimals || token.data.lpTokenData.decimals,
                WIDO_EXTEND_DECIMALS,
              ),
              WIDO_EXTEND_DECIMALS,
            )
            minReceiveUsd = formatNumberWido(
              minReceiveAmount * toTokenDetail?.price,
              BEGINNERS_BALANCES_DECIMALS,
            )
          }
          setMinReceiveAmountString(minReceiveAmount)
          setMinReceiveUsdAmount(minReceiveUsd)
          setFromInfoAmount(fromInfoValue)
          if (Number(fromInfoUsdValue) < 0.01) {
            setFromInfoUsdAmount('<$0.01')
          } else {
            setFromInfoUsdAmount(`$${fromInfoUsdValue}`)
          }
        } catch (e) {
          setMinReceiveAmountString('')
          setMinReceiveUsdAmount('')
          toast.error('Failed to get quote!')
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
    token,
    deposit,
    balanceList,
    useIFARM,
    web3,
    inputAmount,
    pricePerFullShare,
    setFromInfoAmount,
    setFromInfoUsdAmount,
    setMinReceiveAmountString,
    setMinReceiveUsdAmount,
    getPortalsEstimate,
    getPortalsToken,
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
      if (!supToken) {
        toast.error("Can't Deposit with Unsupported token!")
        return
      }
      if (new BigNumber(inputAmount).isGreaterThan(balance)) {
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
    if (pickedToken.usdPrice) {
      setInputAmount(balance)
    }
  }, [balance, setInputAmount, pickedToken])

  const onInputBalance = e => {
    const inputValue = e.currentTarget.value.replace(/,/g, '.')
    setInputAmount(inputValue)
  }

  const mainTags = [
    { name: 'Convert', img: ArrowDown },
    { name: 'Revert', img: ArrowUp },
  ]

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <>
      <BaseWidoDiv>
        <NewLabel
          size={isMobile ? '16px' : '16px'}
          height={isMobile ? '24px' : '24px'}
          weight="600"
          color="#101828"
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
              color={i === 0 ? '#1F2937' : '#6F78AA'}
              borderColor={i === 0 ? '#F2F5FF' : ''}
              backColor={i === 0 ? '#F2F5FF' : ''}
              boxShadow={
                i === 0
                  ? '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
                  : ''
              }
            >
              <img src={tag.img} alt="logo" />
              <p>{tag.name}</p>
            </SwitchTabTag>
          ))}
        </NewLabel>
        <DepoTitle>
          {useBeginnersFarm
            ? `Convert your crypto into interest-bearing ${
                tokenSymbol === 'WETH_base' ? 'fWETH' : 'fUSDbC'
              } to earn yield`
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
              color="#344054"
              marginBottom="6px"
            >
              Amount to convert
            </NewLabel>
            <TokenAmount type="text" value={inputAmount} onChange={onInputBalance} />
          </AmountSection>
          <DepositTokenSection>
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="500"
              color="#344054"
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
          onClick={() => {
            if (account && pickedToken.symbol !== 'Select Token') {
              setInputAmount(balance)
            }
          }}
        >
          {isMobile && (pickedToken.symbol === 'Select Token' ? '' : `${pickedToken.symbol} `)}
          Balance Available:
          <span>{balance}</span>
        </BalanceInfo>
        <InsufficientSection isShow={showWarning ? 'true' : 'false'}>
          <NewLabel display="flex" widthDiv="80%" items="center">
            <img className="info-icon" src={InfoIcon} alt="" />
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="600"
              color="#344054"
            >
              Insufficient {pickedToken.symbol} balance on your wallet
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
              color="#6F78AA"
              weight="500"
            >
              Est. Monthly Yield
              <InfoIconCircle
                className="info"
                width={isMobile ? 16 : 16}
                src={HelpIcon}
                filterColor={filterColor}
                alt=""
                data-tip
                data-for="monthly-yield"
              />
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
              color="#1F2937"
              weight="600"
              textAlign="right"
            >
              {account &&
              pickedToken.symbol !== 'Select Token' &&
              !new BigNumber(amount).isEqualTo(0) &&
              balanceList.length !== 0 ? (
                minReceiveAmountString !== '' ? (
                  convertMonthlyYieldUSD === 0 ? (
                    '$0.00'
                  ) : convertMonthlyYieldUSD < 0.01 ? (
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
              color="#6F78AA"
              weight="500"
            >
              Est. Daily Yield
              <InfoIconCircle
                className="info"
                width={isMobile ? 16 : 16}
                src={HelpIcon}
                filterColor={filterColor}
                alt=""
                data-tip
                data-for="daily-yield"
              />
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
              color="#1F2937"
              weight="600"
              textAlign="right"
            >
              {account &&
              pickedToken.symbol !== 'Select Token' &&
              !new BigNumber(amount).isEqualTo(0) &&
              balanceList.length !== 0 ? (
                minReceiveAmountString !== '' ? (
                  convertDailyYieldUSD === 0 ? (
                    '$0.00'
                  ) : convertDailyYieldUSD < 0.01 ? (
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
              color="#6F78AA"
              weight="500"
            >
              {useIFARM ? 'Est. Received' : 'Est. fTokens Received'}
              <InfoIconCircle
                className="info"
                width={isMobile ? 16 : 16}
                filterColor={filterColor}
                src={HelpIcon}
                alt=""
                data-tip
                data-for="min-received"
              />
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
              color="#1F2937"
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
