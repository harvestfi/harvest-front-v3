import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { isEmpty } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import AlertIcon from '../../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../../assets/images/logos/beginners/alert-close.svg'
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
  FTokenWrong,
  ImgBtn,
  AmountInputSection,
  SwitchTabTag,
} from './style'

const { tokens } = require('../../../../data')

const getChainName = chain => {
  let chainName = 'Ethereum'
  switch (chain) {
    case CHAIN_IDS.POLYGON_MAINNET:
      chainName = 'Polygon'
      break
    case CHAIN_IDS.ARBITRUM_ONE:
      chainName = 'Arbitrum'
      break
    default:
      chainName = 'Ethereum'
      break
  }
  return chainName
}

const UnstakeBase = ({
  setUnstakeStart,
  finalStep,
  inputAmount,
  setInputAmount,
  token,
  switchMethod,
  tokenSymbol,
  totalStaked,
  fAssetPool,
  multipleAssets,
  amountsToExecute,
  setAmountsToExecute,
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
  const [btnName, setBtnName] = useState('Preview & Unstake')
  const [showWarning, setShowWarning] = useState(false)
  const [warningContent, setWarningContent] = useState('')
  const [unstakeFailed, setUnstakeFailed] = useState(false)

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  const tokenDecimals = token.decimals || tokens[tokenSymbol].decimals

  useEffect(() => {
    if (account) {
      if (curChain !== '' && curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setBtnName(`Change Network to ${chainName}`)
      } else {
        setBtnName('Preview & Unstake')
      }
    } else {
      setBtnName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain])

  const onClickUnStake = async () => {
    if (new BigNumber(totalStaked).isEqualTo(0)) {
      setWarningContent('The amount to unstake must be greater than 0.')
      setShowWarning(true)
      return
    }

    if (inputAmount === '' || inputAmount === 0 || inputAmount === '0') {
      setWarningContent('The amount to unstake must be greater than 0.')
      setShowWarning(true)
      return
    }

    const amountsToExecuteInWei = amountsToExecute.map(amount => {
      if (isEmpty(amount)) {
        return null
      }

      if (multipleAssets) {
        return toWei(amount, token.decimals, 0)
      }
      return toWei(amount, isSpecialVault ? tokenDecimals : token.decimals)
    })

    if (new BigNumber(amountsToExecuteInWei[0]) === 0) {
      setWarningContent('The amount to unstake must be greater than 0.')
      setShowWarning(true)
      return
    }

    const isAvailableUnstake = new BigNumber(amountsToExecuteInWei[0]).isLessThanOrEqualTo(
      totalStaked,
    )

    if (!isAvailableUnstake) {
      setWarningContent(`Insufficient f${tokenSymbol} balance`)
      setShowWarning(true)
      return
    }

    setUnstakeStart(true)
  }

  const onInputBalance = e => {
    const inputValue = e.currentTarget.value.replace(/,/g, '.')
    setInputAmount(inputValue)
    setAmountsToExecute([inputValue])
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const mainTags = [
    { name: 'Stake', img: ArrowDown },
    { name: 'Unstake', img: ArrowUp },
  ]

  return (
    <BaseSection show={!finalStep}>
      <NewLabel
        size={isMobile ? '16px' : '16px'}
        height={isMobile ? '28px' : '28px'}
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
            <img src={tag.img} className="logo" alt="logo" />
            <p>{tag.name}</p>
          </SwitchTabTag>
        ))}
      </NewLabel>
      <DepoTitle>Unstake your fTokens.</DepoTitle>
      <AmountSection>
        <NewLabel
          size={isMobile ? '14px' : '14px'}
          height={isMobile ? '20px' : '20px'}
          weight="500"
          color="#344054"
          marginBottom="6px"
        >
          Amount to Unstake
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
                    totalStaked,
                    fAssetPool.lpTokenData.decimals,
                    fAssetPool.lpTokenData.decimals,
                    false,
                  ),
                )
                setAmountsToExecute([
                  fromWei(
                    totalStaked,
                    fAssetPool.lpTokenData.decimals,
                    fAssetPool.lpTokenData.decimals,
                    false,
                  ),
                ])
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
                totalStaked,
                fAssetPool.lpTokenData.decimals,
                fAssetPool.lpTokenData.decimals,
                false,
              ),
            )
            setAmountsToExecute([
              fromWei(
                totalStaked,
                fAssetPool.lpTokenData.decimals,
                fAssetPool.lpTokenData.decimals,
                false,
              ),
            ])
          }
        }}
      >
        Balance Available:
        <span>
          {!connected ? (
            0
          ) : totalStaked ? (
            fromWei(
              totalStaked,
              fAssetPool.lpTokenData.decimals,
              fAssetPool.lpTokenData.decimals,
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

      <FTokenWrong isShow={unstakeFailed ? 'true' : 'false'}>
        <NewLabel marginRight="12px" display="flex">
          <div>
            <img src={AlertIcon} alt="" />
          </div>
          <NewLabel marginLeft="12px">
            <NewLabel
              color="#B54708"
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="600"
              marginBottom="4px"
            >
              Whoops, something went wrong.
            </NewLabel>
            <NewLabel
              color="#B54708"
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              weight="400"
              marginBottom="5px"
            >
              Please try to repeat the transaction in your wallet.
            </NewLabel>
          </NewLabel>
        </NewLabel>
        <NewLabel>
          <ImgBtn
            src={AlertCloseIcon}
            alt=""
            onClick={() => {
              setUnstakeFailed(false)
            }}
          />
        </NewLabel>
      </FTokenWrong>

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
              onClickUnStake()
            }
          }}
        >
          {btnName}
        </Button>
      </NewLabel>
    </BaseSection>
  )
}
export default UnstakeBase
