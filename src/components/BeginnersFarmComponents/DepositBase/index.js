import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { toast } from 'react-toastify'
import DropDownIcon from '../../../assets/images/logos/wido/drop-down.svg'
import WalletIcon from '../../../assets/images/logos/beginners/wallet-in-button.svg'
import CreditCard from '../../../assets/images/logos/beginners/credit-card-shield.svg'
import InfoIcon from '../../../assets/images/logos/beginners/info-circle.svg'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import { POOL_BALANCES_DECIMALS } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { CHAIN_IDS } from '../../../data/constants'
import { formatNumberWido, isSpecialApp } from '../../../utils'
import Button from '../../Button'
import {
  BalanceInfo,
  BaseWido,
  DepoTitle,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  NewLabel,
  AmountSection,
  CreditCardBox,
  ThemeMode,
  InsufficientSection,
  CloseBtn,
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
  selectTokenWido,
  setSelectTokenWido,
  depositWido,
  setDepositWido,
  balance,
  pickedToken,
  inputAmount,
  setInputAmount,
  token,
  supTokenList,
  activeDepo,
  switchMethod,
}) => {
  const { connected, connectAction, account, chainId, setChainId } = useWallet()
  const { backColor, borderColor, widoTagActiveFontColor } = useThemeContext()

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
      setDepositWido(true)
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

  return (
    <BaseWido show={!depositWido && !selectTokenWido}>
      <NewLabel display="flex" justifyContent="space-between" marginBottom="16px">
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
      <NewLabel size="18px" height="28px" weight="600" color="#101828">
        Deposit
      </NewLabel>
      <DepoTitle>Deposit USDC or other token from your wallet to get started.</DepoTitle>
      <TokenInfo>
        <AmountSection>
          <NewLabel size="14px" height="20px" weight="500" color="#344054" marginBottom="6px">
            Amount to Deposit
          </NewLabel>
          <TokenAmount
            type="number"
            value={inputAmount}
            borderColor={borderColor}
            backColor={backColor}
            fontColor={widoTagActiveFontColor}
            onChange={onInputBalance}
          />
        </AmountSection>
        <div>
          <NewLabel size="14px" height="20px" weight="500" color="#344054" marginBottom="6px">
            Deposit Token
          </NewLabel>
          <TokenSelect
            type="button"
            onClick={async () => {
              setSelectTokenWido(true)
            }}
            fontColor={widoTagActiveFontColor}
            borderColor={borderColor}
          >
            {pickedToken.logoURI ? (
              <img className="logo" src={pickedToken.logoURI} width={24} height={24} alt="" />
            ) : (
              <></>
            )}
            <span>{pickedToken.symbol}</span>
            <img src={DropDownIcon} alt="" />
          </TokenSelect>
        </div>
      </TokenInfo>
      <BalanceInfo
        fontColor={widoTagActiveFontColor}
        onClick={() => {
          if (account && pickedToken.symbol !== 'Select Token') {
            setInputAmount(balance)
          }
        }}
      >
        USDC Balance Available:
        <span>{formatNumberWido(balance, POOL_BALANCES_DECIMALS)}</span>
      </BalanceInfo>
      <InsufficientSection isShow={showWarning ? 'true' : 'false'}>
        <NewLabel display="flex" widthDiv="80%" items="center">
          <img className="info-icon" src={InfoIcon} alt="" />
          <NewLabel size="14px" height="20px" weight="600" color="#344054">
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
      <NewLabel marginTop="25px">
        <Button
          color="wido-deposit"
          width="100%"
          size="md"
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
