import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { quote } from 'wido'
import { get } from 'lodash'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import DropDownIcon from '../../../../assets/images/logos/wido/drop-down.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ArrowDown from '../../../../assets/images/logos/beginners/arrow-narrow-down.svg'
import ArrowUp from '../../../../assets/images/logos/beginners/arrow-narrow-up.svg'
import HelpIcon from '../../../../assets/images/logos/beginners/help-circle.svg'
import {
  WIDO_BALANCES_DECIMALS,
  POOL_BALANCES_DECIMALS,
  WIDO_EXTEND_DECIMALS,
  IFARM_TOKEN_SYMBOL,
  BEGINNERS_BALANCES_DECIMALS,
} from '../../../../constants'
import { useVaults } from '../../../../providers/Vault'
import { useWallet } from '../../../../providers/Wallet'
import { fromWei, toWei, getWeb3 } from '../../../../services/web3'
import { addresses } from '../../../../data'
import AnimatedDots from '../../../AnimatedDots'
import Button from '../../../Button'
import { CHAIN_IDS } from '../../../../data/constants'
import {
  BaseWidoDiv,
  InfoIconCircle,
  NewLabel,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  Title,
  AmountSection,
  BalanceInfo,
  InsufficientSection,
  CloseBtn,
  // ThemeMode,
  TokenSelectSection,
  SwitchTabTag,
} from './style'
import { isSpecialApp, formatNumberWido } from '../../../../utils'

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

const WithdrawBase = ({
  setSelectToken,
  unstakeInputValue,
  setUnstakeInputValue,
  withdrawStart,
  setWithdrawStart,
  pickedToken,
  unstakeBalance,
  setUnstakeBalance,
  balanceList,
  tokenSymbol,
  fAssetPool,
  lpTokenBalance,
  stakedAmount,
  token,
  supTokenList,
  switchMethod,
  quoteValue,
  setQuoteValue,
  useBeginnersFarm,
  useIFARM,
  setRevertFromInfoAmount,
  setRevertFromInfoUsdAmount,
  setRevertMinReceivedAmount,
  revertMinReceivedAmount,
  setRevertedAmount,
}) => {
  const [withdrawName, setWithdrawName] = useState(
    useBeginnersFarm ? 'Preview & Stop Earning Yield' : 'Revert',
  )
  const [showWarning, setShowWarning] = useState(false)

  const { account, web3, connected, chainId } = useWallet()
  const { vaultsData } = useVaults()

  const pricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)

  const slippagePercentage = 0.005 // Default slippage Percent
  // const chainId = token.chain || token.data.chain
  const fromToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress1

  const stakeAmountWei = toWei(
    stakedAmount,
    useIFARM ? fAssetPool?.lpTokenData?.decimals : token.decimals,
  )

  const [
    {
      connectedChain, // the current chain the user's wallet is connected to
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain()

  const tokenChain = token.chain || token.data.chain
  const curChain = isSpecialApp
    ? chainId
    : connectedChain
    ? parseInt(connectedChain.id, 16).toString()
    : ''

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select' &&
      !new BigNumber(unstakeBalance).isEqualTo(0) &&
      curChain === tokenChain
    ) {
      const getQuoteResult = async () => {
        setRevertFromInfoAmount('')
        setRevertFromInfoUsdAmount('')
        const amount = unstakeBalance
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = '',
            minReceivedString = ''

          if (pickedToken.default) {
            fromInfoValue = `${formatNumberWido(
              fromWei(amount, pickedToken.decimals),
              WIDO_EXTEND_DECIMALS,
            )}`
            fromInfoUsdValue = formatNumberWido(
              new BigNumber(fromWei(amount, pickedToken.decimals))
                .multipliedBy(fromWei(pricePerFullShare, pickedToken.decimals))
                .multipliedBy(pickedToken.usdPrice),
              WIDO_BALANCES_DECIMALS,
            )
            minReceivedString = formatNumberWido(
              new BigNumber(fromWei(unstakeBalance, pickedToken.decimals)).multipliedBy(
                fromWei(pricePerFullShare, pickedToken.decimals),
              ),
              WIDO_EXTEND_DECIMALS,
            )
          } else {
            const fromChainId = chainId
            const toToken = pickedToken.address
            const toChainId = chainId
            const user = account
            const mainWeb = await getWeb3(chainId, account, web3)
            let curToken = balanceList.filter(el => el.symbol === pickedToken.symbol)

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
              fromWei(
                quoteResult.fromTokenAmount,
                useIFARM ? fAssetPool?.lpTokenData?.decimals : curToken.decimals,
              ),
              WIDO_EXTEND_DECIMALS,
            )
            fromInfoUsdValue =
              quoteResult.fromTokenAmount === null
                ? '0'
                : formatNumberWido(
                    fromWei(
                      quoteResult.fromTokenAmount,
                      useIFARM ? fAssetPool?.lpTokenData?.decimals : curToken.decimals,
                    ) * quoteResult.fromTokenUsdPrice,
                    BEGINNERS_BALANCES_DECIMALS,
                  )
            minReceivedString = formatNumberWido(
              fromWei(quoteResult.minToTokenAmount, pickedToken.decimals),
              WIDO_EXTEND_DECIMALS,
            )
          }
          setRevertFromInfoAmount(fromInfoValue)
          setRevertFromInfoUsdAmount(fromInfoUsdValue)
          setRevertMinReceivedAmount(minReceivedString)
        } catch (e) {
          toast.error('Failed to get quote!')
        }
      }
      getQuoteResult()
    }
    // eslint-disable-next-line
  }, [
    account,
    tokenChain,
    pickedToken,
    unstakeBalance,
    withdrawStart,
    balanceList,
    token,
    pricePerFullShare,
    web3,
    setQuoteValue,
    chainId,
    fromToken,
    curChain,
    setRevertFromInfoAmount,
    setRevertFromInfoUsdAmount,
    setRevertMinReceivedAmount,
  ])

  const amountValue = fromWei(unstakeBalance, pickedToken.decimals)

  useEffect(() => {
    const receiveString = pickedToken.default
      ? formatNumberWido(
          new BigNumber(amountValue)
            .multipliedBy(fromWei(pricePerFullShare, pickedToken.decimals))
            .toFixed(),
          WIDO_EXTEND_DECIMALS,
        )
      : quoteValue
      ? formatNumberWido(
          fromWei(quoteValue.toTokenAmount, pickedToken.decimals),
          WIDO_EXTEND_DECIMALS,
        )
      : ''
    setRevertedAmount(receiveString)
  }, [amountValue, quoteValue, pickedToken, pricePerFullShare, setRevertedAmount])

  useEffect(() => {
    if (account) {
      if (curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setWithdrawName(`Change Network to ${chainName}`)
      } else {
        setWithdrawName(useBeginnersFarm ? 'Preview & Stop Earning Yield' : 'Revert')
      }
    } else {
      setWithdrawName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain, useBeginnersFarm])

  const onInputUnstake = e => {
    setUnstakeInputValue(e.currentTarget.value)
    setUnstakeBalance(
      toWei(e.currentTarget.value, useIFARM ? fAssetPool.lpTokenData.decimals : token.decimals),
    )
  }

  const onClickWithdraw = async () => {
    if (pickedToken.symbol === 'Select') {
      toast.error('Please choose your Output Token.')
      return
    }
    const supToken = supTokenList.find(el => el.symbol === pickedToken.symbol)
    if (!supToken) {
      toast.error("Can't revert with Unsupported token!")
      return
    }

    if (new BigNumber(unstakeBalance).isEqualTo(0)) {
      toast.error('Please input amount to revert!')
      return
    }

    if (useIFARM) {
      if (!new BigNumber(unstakeBalance).isLessThanOrEqualTo(stakeAmountWei)) {
        setShowWarning(true)
      }
    } else if (!new BigNumber(unstakeBalance).isLessThanOrEqualTo(lpTokenBalance)) {
      setShowWarning(true)
      return
    }
    setWithdrawStart(true)
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const mainTags = [
    { name: 'Convert', img: ArrowDown },
    { name: 'Revert', img: ArrowUp },
  ]

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
              onClick={() => {
                if (i === 0) {
                  switchMethod()
                }
              }}
              num={i}
              color={i === 1 ? '#1F2937' : '#6F78AA'}
              borderColor={i === 1 ? '#F2F5FF' : ''}
              backColor={i === 1 ? '#F2F5FF' : ''}
              boxShadow={
                i === 1
                  ? '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
                  : ''
              }
            >
              <img src={tag.img} alt="logo" />
              <p>{tag.name}</p>
            </SwitchTabTag>
          ))}
        </NewLabel>
        <Title>
          {`Revert your ${useIFARM ? `i${tokenSymbol}` : 'fToken'} into`}{' '}
          {pickedToken.symbol !== 'Select' ? pickedToken.symbol : 'Output Token'}.
        </Title>
        <TokenInfo>
          <AmountSection>
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="500"
              color="#344054"
              marginBottom="6px"
            >
              Amount to Revert
            </NewLabel>
            <TokenAmount type="number" value={unstakeInputValue} onChange={onInputUnstake} />
          </AmountSection>
          <TokenSelectSection>
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="500"
              color="#344054"
              marginBottom="6px"
            >
              Output Token
            </NewLabel>
            <TokenSelect
              type="button"
              onClick={async () => {
                setSelectToken(true)
              }}
            >
              {pickedToken.logoURI ? (
                <img className="logo" src={pickedToken.logoURI} width={24} height={24} alt="" />
              ) : (
                <></>
              )}
              <span>{pickedToken.symbol}</span>
              <img className="dropdown-icon" src={DropDownIcon} alt="" />
            </TokenSelect>
          </TokenSelectSection>
        </TokenInfo>
        <BalanceInfo
          onClick={() => {
            if (account) {
              setUnstakeBalance(useIFARM ? stakeAmountWei : lpTokenBalance)
              setUnstakeInputValue(
                Number(
                  fromWei(
                    useIFARM ? stakeAmountWei : lpTokenBalance,
                    fAssetPool.lpTokenData.decimals,
                  ),
                ),
              )
            }
          }}
        >
          Balance Available:
          <span>
            {!connected ? (
              0
            ) : useIFARM ? (
              stakedAmount || <AnimatedDots />
            ) : lpTokenBalance ? (
              fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals, POOL_BALANCES_DECIMALS, true)
            ) : (
              <AnimatedDots />
            )}
          </span>
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
              The amount of {useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`} you entered exceeds
              deposited balance.
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
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color="#344054"
              weight="500"
            >
              Min. Received
              <InfoIconCircle
                className="info"
                width={isMobile ? 16 : 16}
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
                  weight="600"
                  color="white"
                >
                  You will not receive less than the displayed number of tokens.
                </NewLabel>
              </ReactTooltip>
            </NewLabel>
            <NewLabel
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color="#344054"
              weight="600"
              textAlign="right"
              display="flex"
              items="flex-end"
              flexFlow="column"
            >
              <TokenInfo>
                {account &&
                pickedToken.symbol !== 'Select' &&
                !new BigNumber(unstakeBalance).isEqualTo(0) &&
                curChain === tokenChain ? (
                  revertMinReceivedAmount !== '' ? (
                    revertMinReceivedAmount
                  ) : (
                    <TokenInfo>
                      <AnimatedDots />
                    </TokenInfo>
                  )
                ) : (
                  '-'
                )}
              </TokenInfo>
              <span className="token-symbol">
                {pickedToken.symbol !== 'Select' ? pickedToken.symbol : 'Output Token'}
              </span>
            </NewLabel>
          </NewLabel>
        </NewLabel>
        <NewLabel>
          <Button
            color="wido-deposit"
            width="100%"
            size="md"
            onClick={async () => {
              if (curChain !== tokenChain) {
                const chainHex = `0x${Number(tokenChain).toString(16)}`
                await setChain({ chainId: chainHex })
              } else {
                onClickWithdraw()
              }
            }}
          >
            {withdrawName}
          </Button>
        </NewLabel>
      </BaseWidoDiv>
    </>
  )
}
export default WithdrawBase
