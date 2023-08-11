import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'react-responsive'
import ArrowRightIcon from '../../../assets/images/logos/beginners/arrow-right.svg'
import InfoIcon from '../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import CreditCard from '../../../assets/images/logos/beginners/credit-card-shield.svg'
import { POOL_BALANCES_DECIMALS } from '../../../constants'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, toWei } from '../../../services/web3'
import AnimatedDots from '../../AnimatedDots'
import Button from '../../Button'
import { CHAIN_IDS } from '../../../data/constants'
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
  CreditCardBox,
  ThemeMode,
} from './style'
import { isSpecialApp } from '../../../utils'

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

const WithdrawBase = ({
  withdrawStart,
  setWithdrawStart,
  finalStep,
  pickedToken,
  setPickedToken,
  unstakeBalance,
  setUnstakeBalance,
  symbol,
  fAssetPool,
  lpTokenBalance,
  token,
  supTokenList,
  activeDepo,
  switchMethod,
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

  useEffect(() => {
    if (account) {
      if (curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setWithdrawName(`Switch to ${chainName}`)
      } else {
        setWithdrawName('Withdraw')
      }
    }
  }, [account, curChain, tokenChain])

  useEffect(() => {
    if (connected) {
      setWithdrawName('Withdraw')
    } else {
      setWithdrawName('Connect Wallet to Get Started')
    }
  }, [connected])

  useEffect(() => {
    if (supTokenList.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < supTokenList.length; i++) {
        if (supTokenList[i].symbol === symbol) {
          setPickedToken(supTokenList[i])
        }
      }
    }
  }, [supTokenList, setPickedToken, symbol])

  const onInputUnstake = e => {
    setUnstakeInputValue(e.currentTarget.value)
    setUnstakeBalance(toWei(e.currentTarget.value, token.decimals))
  }

  const onClickWithdraw = async () => {
    const supToken = supTokenList.find(el => el.symbol === pickedToken.symbol)
    if (!supToken) {
      toast.error("Can't Withdraw with Unsupported token!")
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

  return (
    <BaseWido show={!withdrawStart && !finalStep}>
      <NewLabel
        display="flex"
        justifyContent="space-between"
        marginBottom={isMobile ? '12px' : '16px'}
        items="center"
      >
        <CreditCardBox>
          <img src={CreditCard} alt="" />
        </CreditCardBox>
        <ThemeMode mode={activeDepo ? 'deposit' : 'withdraw'}>
          <div id="theme-switch">
            <div className="switch-track">
              <div className="switch-thumb" />
            </div>

            <input
              type="checkbox"
              checked={activeDepo}
              onChange={switchMethod}
              aria-label="Switch between dark and light mode"
            />
          </div>
        </ThemeMode>
      </NewLabel>
      <NewLabel
        size={isMobile ? '14px' : '18px'}
        height={isMobile ? '21px' : '28px'}
        weight="600"
        color="#101828"
      >
        Withdraw
      </NewLabel>
      <Title>Withdraw your deposit back to USDC.</Title>
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
        <div>
          <NewLabel
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '15px' : '20px'}
            weight="500"
            color="#344054"
            marginBottom="6px"
          >
            Withdraw to
          </NewLabel>
          <TokenSelect>
            {pickedToken.logoURI ? (
              <img className="logo" src={pickedToken.logoURI} width={24} height={24} alt="" />
            ) : (
              <></>
            )}
            <span>{pickedToken.symbol}</span>
          </TokenSelect>
        </div>
      </TokenInfo>
      <BalanceInfo
        onClick={() => {
          if (account && pickedToken.symbol !== 'Select Token') {
            setUnstakeBalance(lpTokenBalance)
            setUnstakeInputValue(Number(fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals)))
          }
        }}
      >
        {`f${symbol}`} Balance Available:
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
            The amount of {`f${symbol}`} you entered exceeds deposited balance.
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

      <NewLabel marginTop={isMobile ? '19px' : '25px'}>
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
          <NewLabel size="16px" weight="600" height="21px">
            {withdrawName}
          </NewLabel>
          <img src={ArrowRightIcon} alt="" />
        </Button>
      </NewLabel>
    </BaseWido>
  )
}
export default WithdrawBase
