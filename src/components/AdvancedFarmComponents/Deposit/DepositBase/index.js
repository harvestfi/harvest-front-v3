import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import DropDownIcon from '../../../../assets/images/logos/wido/drop-down.svg'
import WalletIcon from '../../../../assets/images/logos/beginners/wallet-in-button.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import { POOL_BALANCES_DECIMALS } from '../../../../constants'
import { useWallet } from '../../../../providers/Wallet'
import { CHAIN_IDS } from '../../../../data/constants'
import { formatNumberWido, isSpecialApp } from '../../../../utils'
import Button from '../../../Button'
import {
  BalanceInfo,
  BaseWido,
  DepoTitle,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  NewLabel,
  AmountSection,
  ThemeMode,
  InsufficientSection,
  CloseBtn,
  DepositTokenSection,
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
    default:
      chainName = 'Ethereum'
      break
  }
  return chainName
}

const DepositBase = ({
  selectToken,
  setSelectToken,
  deposit,
  setDeposit,
  finalStep,
  balance,
  pickedToken,
  inputAmount,
  setInputAmount,
  token,
  supTokenList,
  activeDepo,
  switchMethod,
  tokenSymbol,
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
  const [depositName, setDepositName] = useState('Deposit')
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (account) {
      if (curChain !== '' && curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setDepositName(`Switch to ${chainName}`)
      } else {
        setDepositName('Deposit')
      }
    }
  }, [account, curChain, tokenChain])

  useEffect(() => {
    if (connected) {
      setDepositName('Deposit')
    } else {
      setDepositName('Connect Wallet to Get Started')
    }
  }, [connected])

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
        toast.error('Please select token to deposit!')
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
    setInputAmount(e.currentTarget.value)
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <BaseWido show={!deposit && !selectToken && !finalStep}>
      <NewLabel
        size={isMobile ? '12px' : '16px'}
        height={isMobile ? '21px' : '24px'}
        weight="600"
        color="#101828"
        display="flex"
        justifyContent="space-between"
      >
        Deposit
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
      <DepoTitle>Turn any token from your wallet into f{tokenSymbol}.</DepoTitle>
      <TokenInfo>
        <AmountSection>
          <NewLabel
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '15px' : '20px'}
            weight="500"
            color="#344054"
            marginBottom="6px"
          >
            Amount to Deposit
          </NewLabel>
          <TokenAmount type="number" value={inputAmount} onChange={onInputBalance} />
        </AmountSection>
        <DepositTokenSection>
          <NewLabel
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '15px' : '20px'}
            weight="500"
            color="#344054"
            marginBottom="6px"
          >
            Deposit Token
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
        </DepositTokenSection>
      </TokenInfo>
      <BalanceInfo
        onClick={() => {
          if (account && pickedToken.symbol !== 'Select Token') {
            setInputAmount(balance)
          }
        }}
      >
        Balance Available:
        <span>{formatNumberWido(balance, POOL_BALANCES_DECIMALS)}</span>
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
      <NewLabel marginTop={isMobile ? '19px' : '25px'} padding={isMobile ? '0 7px' : '0'}>
        <Button
          color="wido-deposit"
          width="100%"
          onClick={() => {
            onClickDeposit()
          }}
        >
          {depositName}
          <img src={WalletIcon} alt="" />
        </Button>
      </NewLabel>
    </BaseWido>
  )
}
export default DepositBase
