import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import DropDownIcon from '../../../../assets/images/logos/advancedfarm/drop-down.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ArrowDown from '../../../../assets/images/logos/beginners/arrow-narrow-down.svg'
import ArrowUp from '../../../../assets/images/logos/beginners/arrow-narrow-up.svg'
import HelpIcon from '../../../../assets/images/logos/beginners/help-circle.svg'
import { useWallet } from '../../../../providers/Wallet'
import { fromWei, toWei } from '../../../../services/web3'
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
  HasErrorSection,
  FlexDiv,
} from './style'
import { isSpecialApp } from '../../../../utils'
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

const WithdrawBase = ({
  setSelectToken,
  unstakeInputValue,
  setUnstakeInputValue,
  withdrawStart,
  setWithdrawStart,
  defaultToken,
  pricePerFullShare,
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
  useIFARM,
  setRevertFromInfoAmount,
  setRevertFromInfoUsdAmount,
  setRevertMinReceivedAmount,
  revertMinReceivedAmount,
  hasErrorOccurred,
  setHasErrorOccurred,
}) => {
  const [withdrawName, setWithdrawName] = useState('Preview & Revert')
  const [showWarning, setShowWarning] = useState(false)

  const { account, web3, connected, chainId } = useWallet()
  const { getPortalsEstimate, getPortalsToken } = usePortals()

  const slippage = 0.5 // Default slippage Percent

  const fromToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress1

  let stakeAmountWei
  if (useIFARM) {
    stakeAmountWei = toWei(
      stakedAmount,
      useIFARM ? fAssetPool?.lpTokenData?.decimals : token.decimals,
    )
  }

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
        let portalsEstimate
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = '',
            minReceivedString = '',
            outputAmountDefault = ''
          const toToken = pickedToken.address

          const pickedDefaultToken =
            pickedToken.address.toLowerCase() === defaultToken.address.toLowerCase()

          if (pickedDefaultToken) {
            const unstakeBalanceDecimals = fromWei(
              unstakeBalance,
              pickedToken.decimals,
              pickedToken.decimals,
            )
            const outputAmountDefaultDecimals = new BigNumber(unstakeBalanceDecimals)
              .times(pricePerFullShare)
              .toString()
            outputAmountDefault = toWei(outputAmountDefaultDecimals, pickedToken.decimals, 0)
          } else {
            portalsEstimate = await getPortalsEstimate({
              chainId,
              tokenIn: fromToken,
              inputAmount: amount,
              tokenOut: toToken,
              slippage,
              sender: account,
            })
          }

          if (pickedDefaultToken || portalsEstimate.succeed) {
            const fromTokenDetail = await getPortalsToken(chainId, fromToken)
            const fromTokenUsdPrice = fromTokenDetail?.price
            const quoteResult = {
              fromTokenAmount: amount,
              fromTokenUsdPrice,
              minToTokenAmount: pickedDefaultToken
                ? outputAmountDefault
                : portalsEstimate.res.outputAmount,
            }

            fromInfoValue = new BigNumber(
              fromWei(
                quoteResult.fromTokenAmount,
                useIFARM ? fAssetPool?.lpTokenData?.decimals : fromTokenDetail?.decimals,
                useIFARM ? fAssetPool?.lpTokenData?.decimals : fromTokenDetail?.decimals,
              ),
            ).toString()
            fromInfoUsdValue =
              quoteResult.fromTokenAmount === null
                ? '0'
                : new BigNumber(
                    fromWei(
                      quoteResult.fromTokenAmount,
                      useIFARM ? fAssetPool?.lpTokenData?.decimals : fromTokenDetail?.decimals,
                      useIFARM ? fAssetPool?.lpTokenData?.decimals : fromTokenDetail?.decimals,
                      true,
                    ) * quoteResult.fromTokenUsdPrice,
                  ).toString()
            minReceivedString = new BigNumber(
              fromWei(quoteResult.minToTokenAmount, pickedToken.decimals, pickedToken.decimals),
            ).toString()
            setRevertFromInfoAmount(fromInfoValue)
            setRevertFromInfoUsdAmount(fromInfoUsdValue)
            setRevertMinReceivedAmount(minReceivedString)
            setHasErrorOccurred(0)
          } else {
            setRevertFromInfoAmount('-')
            setRevertFromInfoUsdAmount('-')
            setRevertMinReceivedAmount('-')
            if (
              portalsEstimate.res.message === 'inputToken not found' ||
              portalsEstimate.res.message === 'Unexpected error'
            ) {
              setHasErrorOccurred(2)
            } else {
              setHasErrorOccurred(1)
            }
          }
        } catch (e) {
          console.error('Error content: ', e)
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
    web3,
    chainId,
    fromToken,
    curChain,
    setRevertFromInfoAmount,
    setRevertFromInfoUsdAmount,
    setRevertMinReceivedAmount,
    getPortalsEstimate,
    getPortalsToken,
  ])

  useEffect(() => {
    if (account) {
      if (curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setWithdrawName(`Change Network to ${chainName}`)
      } else {
        setWithdrawName('Preview & Revert')
      }
    } else {
      setWithdrawName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain])

  const onInputUnstake = e => {
    const inputValue = e.currentTarget.value.replace(/,/g, '.')
    setUnstakeInputValue(inputValue)
    setUnstakeBalance(
      toWei(inputValue, useIFARM ? fAssetPool.lpTokenData.decimals : token.decimals),
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
            <TokenAmount type="text" value={unstakeInputValue} onChange={onInputUnstake} />
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
                new BigNumber(
                  fromWei(
                    useIFARM ? stakeAmountWei : lpTokenBalance,
                    fAssetPool.lpTokenData.decimals,
                    fAssetPool.lpTokenData.decimals,
                    false,
                  ),
                ).toString(),
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
              new BigNumber(
                fromWei(
                  lpTokenBalance,
                  fAssetPool.lpTokenData.decimals,
                  fAssetPool.lpTokenData.decimals,
                  false,
                ),
              ).toString()
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
        <HasErrorSection isShow={hasErrorOccurred === 1 ? 'true' : 'false'}>
          <NewLabel display="flex" flexFlow="column" widthDiv="100%">
            <FlexDiv>
              <img className="info-icon" src={InfoIcon} alt="" />
              <NewLabel
                size={isMobile ? '14px' : '14px'}
                height={isMobile ? '20px' : '20px'}
                weight="600"
                color="#344054"
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
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '24px' : '24px'}
              color="#344054"
              weight="500"
            >
              Est. Received
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
                  The estimated number of tokens you will receive in your wallet. The default
                  slippage is set as &lsquo;Auto&lsquo;.
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
