import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { toast } from 'react-toastify'
import DropDownIcon from '../../../assets/images/logos/wido/drop-down.svg'
import WidoIcon from '../../../assets/images/logos/wido/wido.svg'
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
  PoweredByWido,
  SelectToken,
  TokenAmount,
  TokenInfo,
  TokenSelect,
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
  startSlippage,
  depositWido,
  setDepositWido,
  finalStep,
  balance,
  pickedToken,
  inputAmount,
  setInputAmount,
  token,
  supTokenList,
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

  useEffect(() => {
    if (account) {
      if (curChain !== tokenChain) {
        const chainName = getChainName(tokenChain)
        setDepositName(`Switch to ${chainName}`)
      } else {
        setDepositName('Deposit')
      }
    }
  }, [account, curChain, tokenChain])

  const onClickDeposit = async () => {
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
        toast.error('Cannot deposit more than balance!')
        return
      }
      if (new BigNumber(inputAmount).isEqualTo(0)) {
        toast.error('Cannot deposit 0!')
        return
      }
      setDepositWido(true)
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
    <BaseWido show={!depositWido && !selectTokenWido && !startSlippage && !finalStep}>
      <DepoTitle fontColor={widoTagActiveFontColor}>
        Deposit USDC or other token from your wallet to get started.
      </DepoTitle>
      <SelectToken>
        <TokenInfo>
          <TokenAmount
            type="number"
            value={inputAmount}
            borderColor={borderColor}
            backColor={backColor}
            fontColor={widoTagActiveFontColor}
            onChange={onInputBalance}
          />
          <TokenSelect
            type="button"
            onClick={async () => {
              setSelectTokenWido(true)
              if (!connected) {
                await connectAction()
              }
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
        </TokenInfo>
      </SelectToken>
      <BalanceInfo
        fontColor={widoTagActiveFontColor}
        onClick={() => {
          if (account && pickedToken.symbol !== 'Select Token') {
            setInputAmount(balance)
          }
        }}
      >
        Balance:
        <span>{formatNumberWido(balance, POOL_BALANCES_DECIMALS)}</span>
      </BalanceInfo>
      <Button
        color="wido-deposit"
        width="100%"
        size="md"
        onClick={() => {
          onClickDeposit()
        }}
      >
        {depositName}
      </Button>

      <PoweredByWido>
        <div>Powered By</div>
        <img src={WidoIcon} alt="" />
        <span>wido</span>
      </PoweredByWido>
    </BaseWido>
  )
}
export default DepositBase
