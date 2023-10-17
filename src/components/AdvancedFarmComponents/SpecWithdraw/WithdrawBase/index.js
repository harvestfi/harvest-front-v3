import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'react-responsive'
import ArrowRightIcon from '../../../../assets/images/logos/beginners/arrow-right.svg'
import DropDownIcon from '../../../../assets/images/logos/wido/drop-down.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ArrowDown from '../../../../assets/images/logos/beginners/arrow-narrow-down.svg'
import ArrowUp from '../../../../assets/images/logos/beginners/arrow-narrow-up.svg'
import { POOL_BALANCES_DECIMALS } from '../../../../constants'
import { useWallet } from '../../../../providers/Wallet'
import { fromWei, toWei } from '../../../../services/web3'
import AnimatedDots from '../../../AnimatedDots'
import Button from '../../../Button'
import { CHAIN_IDS } from '../../../../data/constants'
import {
  BaseWido,
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
import { isSpecialApp } from '../../../../utils'

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
  selectToken,
  setSelectToken,
  withdrawStart,
  setWithdrawStart,
  finalStep,
  pickedToken,
  unstakeBalance,
  setUnstakeBalance,
  tokenSymbol,
  fAssetPool,
  lpTokenBalance,
  token,
  switchMethod,
  useIFARM,
}) => {
  const [unstakeInputValue, setUnstakeInputValue] = useState(0)
  const { account, connected, chainId } = useWallet()

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
  const [withdrawName, setWithdrawName] = useState('Withdraw')
  const [showWarning, setShowWarning] = useState(false)
  const [showWithdrawIcon, setShowWithdrawIcon] = useState(true)

  useEffect(() => {
    if (account) {
      if (curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setWithdrawName(`Change Network to ${chainName}`)
        setShowWithdrawIcon(false)
      } else {
        setWithdrawName('Withdraw')
      }
    } else {
      setWithdrawName('Connect Wallet to Get Started')
    }
  }, [account, curChain, tokenChain])

  const onInputUnstake = e => {
    setUnstakeInputValue(e.currentTarget.value)
    setUnstakeBalance(toWei(e.currentTarget.value, token.decimals))
  }

  const onClickWithdraw = async () => {
    if (pickedToken.symbol === 'Select') {
      toast.error('Please choose your Output Token.')
      return
    }

    if (new BigNumber(unstakeBalance).isEqualTo(0)) {
      toast.error('Please input amount to withdraw!')
      return
    }

    if (!new BigNumber(unstakeBalance).isLessThanOrEqualTo(lpTokenBalance)) {
      setShowWarning(true)
      return
    }
    setWithdrawStart(true)
  }
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const mainTags = [
    { name: 'Deposit', img: ArrowDown },
    { name: 'Withdraw', img: ArrowUp },
  ]

  return (
    <BaseWido show={!withdrawStart && !selectToken && !finalStep}>
      <NewLabel
        size={isMobile ? '12px' : '16px'}
        height={isMobile ? '21px' : '24px'}
        weight="600"
        color="#101828"
        display="flex"
        justifyContent="center"
        padding={isMobile ? '0' : '6px 0'}
        marginBottom="15px"
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
            color={i === 1 ? '#1F2937' : '#667085'}
            borderColor={i === 1 ? '#F8F8F8' : ''}
            backColor={i === 1 ? '#F8F8F8' : ''}
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
        {useIFARM
          ? `Withdraw i${tokenSymbol} into any token`
          : `Withdraw f${tokenSymbol} into any token`}
      </Title>
      <TokenInfo>
        <AmountSection>
          <NewLabel
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '15px' : '20px'}
            weight="500"
            color="#344054"
            marginBottom="6px"
          >
            Amount to Withdraw
          </NewLabel>
          <TokenAmount type="number" value={unstakeInputValue} onChange={onInputUnstake} />
        </AmountSection>
        <TokenSelectSection>
          <NewLabel
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '15px' : '20px'}
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
          if (account && pickedToken.symbol !== 'Select Token') {
            setUnstakeBalance(lpTokenBalance)
            setUnstakeInputValue(Number(fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals)))
          }
        }}
      >
        Balance Available:
        <span>
          {!connected ? (
            0
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
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '15px' : '20px'}
            weight="600"
            color="#344054"
          >
            The amount of {`f${tokenSymbol}`} you entered exceeds deposited balance.
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

      <NewLabel marginTop={isMobile ? '19px' : '25px'} padding={isMobile ? '0 7px' : '0'}>
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
          {showWithdrawIcon && <img src={ArrowRightIcon} alt="" />}
        </Button>
      </NewLabel>
    </BaseWido>
  )
}
export default WithdrawBase
