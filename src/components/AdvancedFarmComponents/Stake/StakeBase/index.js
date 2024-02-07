import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { useMediaQuery } from 'react-responsive'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ArrowDown from '../../../../assets/images/logos/beginners/arrow-narrow-down.svg'
import ArrowUp from '../../../../assets/images/logos/beginners/arrow-narrow-up.svg'
import AnimatedDots from '../../../AnimatedDots'
import { useWallet } from '../../../../providers/Wallet'
import { CHAIN_IDS } from '../../../../data/constants'
import { isSpecialApp } from '../../../../utils'
import { fromWei, toWei } from '../../../../services/web3'
import Button from '../../../Button'
import {
  BalanceInfo,
  BaseSection,
  DepoTitle,
  TokenAmount,
  NewLabel,
  AmountSection,
  // ThemeMode,
  InsufficientSection,
  CloseBtn,
  AmountInputSection,
  SwitchTabTag,
} from './style'

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

const StakeBase = ({
  setStakeStart,
  inputAmount,
  setInputAmount,
  token,
  switchMethod,
  tokenSymbol,
  lpTokenBalance,
  fAssetPool,
}) => {
  const { connected, connectAction, account, chainId, setChainId } = useWallet()

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
  const [btnName, setBtnName] = useState('Stake')
  const [showWarning, setShowWarning] = useState(false)
  const [warningContent, setWarningContent] = useState('')

  useEffect(() => {
    if (account) {
      if (curChain !== '' && curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setBtnName(`Change Network to ${chainName}`)
      } else {
        setBtnName('Stake')
      }
    } else {
      setBtnName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain])

  const onClickStake = async () => {
    if (inputAmount === '' || inputAmount === 0 || inputAmount === '0') {
      setWarningContent('The amount to stake must be greater than 0.')
      setShowWarning(true)
      return
    }
    const stakeAmount = toWei(inputAmount, fAssetPool.lpTokenData.decimals)
    if (new BigNumber(stakeAmount).isGreaterThan(lpTokenBalance)) {
      setWarningContent(`Insufficient f${tokenSymbol} balance`)
      setShowWarning(true)
      return
    }
    setShowWarning(false)
    setStakeStart(true)
  }

  const onInputBalance = e => {
    const inputValue = e.currentTarget.value.replace(/,/g, '.')
    setInputAmount(inputValue)
  }

  const mainTags = [
    { name: 'Stake', img: ArrowDown },
    { name: 'Unstake', img: ArrowUp },
  ]

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <BaseSection>
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
            <img src={tag.img} className="logo" alt="logo" />
            <p>{tag.name}</p>
          </SwitchTabTag>
        ))}
      </NewLabel>
      <DepoTitle>Stake your fTokens to earn extra rewards.</DepoTitle>
      <AmountSection>
        <NewLabel
          size={isMobile ? '14px' : '14px'}
          height={isMobile ? '20px' : '20px'}
          weight="500"
          color="#344054"
          marginBottom="6px"
        >
          Amount to Stake
        </NewLabel>
        <AmountInputSection>
          <TokenAmount type="text" value={inputAmount} onChange={onInputBalance} />
          <button
            className="max-btn"
            type="button"
            onClick={() => {
              if (account) {
                setInputAmount(
                  fromWei(
                    lpTokenBalance,
                    fAssetPool.lpTokenData.decimals,
                    Number(fAssetPool.lpTokenData.decimals),
                    false,
                  ),
                )
              }
            }}
          >
            Max
          </button>
        </AmountInputSection>
      </AmountSection>
      <BalanceInfo
        onClick={() => {
          if (account) {
            setInputAmount(
              fromWei(
                lpTokenBalance,
                fAssetPool.lpTokenData.decimals,
                Number(fAssetPool.lpTokenData.decimals),
                false,
              ),
            )
          }
        }}
      >
        Balance Available:
        <span>
          {!connected ? (
            0
          ) : lpTokenBalance ? (
            fromWei(
              lpTokenBalance,
              fAssetPool.lpTokenData.decimals,
              Number(fAssetPool.lpTokenData.decimals),
              false,
            )
          ) : (
            <AnimatedDots />
          )}
        </span>
      </BalanceInfo>
      <InsufficientSection isShow={showWarning ? 'true' : 'false'}>
        <NewLabel display="flex" widthDiv="80%" items="start">
          <img className="info-icon" src={InfoIcon} alt="" />
          <NewLabel
            size={isMobile ? '14px' : '14px'}
            height={isMobile ? '20px' : '20px'}
            weight="600"
            color="#344054"
          >
            {warningContent}
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

      <NewLabel marginTop={isMobile ? '10px' : '10px'}>
        <Button
          color="wido-deposit"
          width="100%"
          onClick={async () => {
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
              onClickStake()
            }
          }}
        >
          {btnName}
        </Button>
      </NewLabel>
    </BaseSection>
  )
}
export default StakeBase
