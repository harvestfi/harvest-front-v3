import React, { useState, useEffect } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { PiInfoBold } from 'react-icons/pi'
import 'react-loading-skeleton/dist/skeleton.css'
import BackLogo from '../../assets/images/logos/autopilot/autopilot-background.png'
import { useThemeContext } from '../../providers/useThemeContext'
import { isSpecialApp, showTokenBalance } from '../../utilities/formats'
import Button from '../Button'
import { useWallet } from '../../providers/Wallet'
import { usePortals } from '../../providers/Portals'
import { useContracts } from '../../providers/Contracts'
import AnimatedDots from '../../components/AnimatedDots'
import { CHAIN_IDS } from '../../data/constants'
import { getChainName } from '../../utilities/parsers'
import { fromWei } from '../../services/web3'

import {
  PanelHeader,
  BasePanelBox,
  TokenInfo,
  ApyInfo,
  NewLabel,
  PilotInfo,
  PanelBalance,
  FlexDiv,
  PanelSubscribe,
  ThemeMode,
  TokenInput,
  TokenAmount,
  TokenUSDAmount,
  TokenType,
  TokenName,
} from './style'

const AutopilotPanel = ({
  vaultData,
  currencyRate,
  currencySym,
  index,
}) => {
  const {
    pilotBorderColor1,
    pilotBorderColor2,
    pilotButtonColor1,
    pilotButtonColor2,
    bgColor,
    backColor,
    fontColor2,
    fontColor3,
  } = useThemeContext()

  const [subscribe, setSubscribe] = useState(true)
  const [subscribeName, setSubscribeName] = useState('Subscribe')
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe')
  const [walletBalance, setWalletBalance] = useState('-')

  const { connected, account, connectAction, balances, chainId, setChainId } = useWallet()
  const { getPortalsToken } = usePortals()
  const { contracts } = useContracts()

  const [
    {
      connectedChain, // the current chain the user's wallet is connected to
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain()

  const curChain = isSpecialApp
    ? chainId
    : connectedChain
    ? parseInt(connectedChain.id, 16).toString()
    : ''

  const tokenChain = CHAIN_IDS.ARBITRUM_ONE

  const [inputAmount, setInputAmount] = useState(0)
  const [inputUSDAmount, setInputUSDAmount] = useState('-')

  const switchSubscribe = () => setSubscribe(prev => !prev)

  useEffect(() => {
    const updateData = async () => {
      if (account) {
        if (curChain !== '' && curChain !== tokenChain) {
          const chainName = getChainName(tokenChain)
          setSubscribeName(`Change Network to ${chainName}`)
          setSubscribeLabel(`Subscribe`)
        } else {
          if(vaultData) {
            const { methods, instance } = contracts[vaultData.id]
            const assetBalanceRaw = await methods.getBalance(account, instance)
            const assetBalance = fromWei(assetBalanceRaw, vaultData.decimals, 2)
            setWalletBalance(assetBalance)
          }
          if(subscribe) {
          setSubscribeLabel(`Subscribe`)
          setSubscribeName('Subscribe')
          } else {
          setSubscribeLabel(`Unsubscribe`)
          setSubscribeName('Unsubscribe')
          }
        }
      } else {
        setSubscribeName('Connect Wallet to Get Started')
        setSubscribeLabel(`Subscribe`)
      }
    }
    updateData()
  }, [account, curChain, tokenChain, subscribe, vaultData, contracts])

  useEffect(() => {
    const getUSDValue = async () => {
      if( account && curChain === tokenChain && vaultData) {
        const inputTokenDetail = await getPortalsToken(chainId, vaultData.tokenAddress)
  
        const inputValue = Number(inputAmount) * Number(currencyRate)
    
        if (Number(inputValue) < 0.01) {
          setInputUSDAmount(`<${currencySym}0.01`)
        } else {
          setInputUSDAmount(
            `≈${currencySym}${(Number(inputValue) * Number(inputTokenDetail?.price) * Number(currencyRate)).toFixed(2)}`,
          )
        }
      }
    }
    getUSDValue()
  }, [account, chainId, curChain, tokenChain, inputAmount, currencySym, currencyRate, getPortalsToken, vaultData])

  const onInputBalance = e => {
    const inputValue = e.currentTarget.value.replace(/,/g, '.').replace(/[^0-9.]/g, '')
    setInputAmount(inputValue)
  }

  const onClickSubscribe = async () => {
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
    }
  }

  return (
    <BasePanelBox 
      backColor={backColor}
      borderColor={pilotBorderColor1}
      marginBottom='0px'
      borderRadius='15px'
      key={index}
    >
      <PanelHeader
        background={BackLogo}
      >
        <TokenInfo>
          <img className="logo" src={vaultData?.logoUrl} width={90} height={90} alt="" />
          <ApyInfo>
            <NewLabel
              size='11px'
              height='20px'
              weight="600"
              color={fontColor2}
              marginBottom="6px"
            >
              APY
            </NewLabel>
            <NewLabel
              size='22px'
              height='30px'
              weight="600"
              color={fontColor2}
            >
              {vaultData?.estimatedApy}%
            </NewLabel>
          </ApyInfo>
        </TokenInfo>
        <PilotInfo>
          <PiInfoBold className="pilot-info"/>
        </PilotInfo>
      </PanelHeader>
      <PanelBalance borderColor={pilotBorderColor2}>
        <FlexDiv flexDirection='row' justifyContent='space-between'>
          <NewLabel
            size='14px'
            height='20px'
            weight="500"
            color={fontColor2}
            marginTop="30px"
            marginBottom="10px"
            marginLeft="25px"
          >
            My Balance
          </NewLabel>
          <NewLabel
            size='14px'
            height='20px'
            weight='500'
            color={fontColor2}
            marginTop='30px'
            marginBottom='10px'
            marginRight='25px'
          >
            {vaultData?.estimatedApy}&nbsp;{vaultData?.tokenNames[0]}
          </NewLabel>
        </FlexDiv>
        <FlexDiv flexDirection='row' justifyContent='space-between'>
          <NewLabel
            size='14px'
            height='20px'
            weight="500"
            color={fontColor2}
            marginTop="10px"
            marginBottom="30px"
            marginLeft="25px"
          >
            Lifetime Yield
          </NewLabel>
          <NewLabel
            size='14px'
            height='20px'
            weight="500"
            color='#5DCF46'
            marginTop="10px"
            marginBottom="30px"
            marginRight="25px"
          >
            {vaultData?.estimatedApy}&nbsp;{vaultData?.tokenNames[0]}
          </NewLabel>
        </FlexDiv>
      </PanelBalance>
      <PanelSubscribe>
        <FlexDiv flexDirection='row' justifyContent='space-between'>
          <NewLabel
            size='14px'
            height='20px'
            weight="500"
            color={fontColor2}
          >
            {subscribeLabel}
          </NewLabel>
          <ThemeMode mode={subscribe ? 'subscribe' : 'unsubscribe'}>
            <div id="theme-switch">
              <div className="switch-track">
                <div className="switch-thumb" />
              </div>

              <input
                type="checkbox"
                checked={subscribe}
                onChange={switchSubscribe}
                aria-label="Switch between subscribe and unsubscribe"
              />
            </div>
          </ThemeMode>
        </FlexDiv>
        <FlexDiv flexDirection='row' justifyContent='space-between' marginTop='10px'>
          <TokenInput>
            <TokenAmount
              type="number"
              value={inputAmount}
              onChange={onInputBalance}
              bgColor={bgColor}
              fontColor2={fontColor2}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <input type="hidden" value={Number(inputAmount)} />
            <TokenUSDAmount
              fontColor3={fontColor3}
            >
              {inputAmount === '0' ||
              inputAmount === '' ? (
                `${currencySym}0`
              ) : inputUSDAmount === '' ? (
                <TokenInfo>
                  <AnimatedDots />
                </TokenInfo>
              ) : inputUSDAmount === '-' ? (
                '-'
              ) : (
                `${inputUSDAmount}`
              )}
            </TokenUSDAmount>
          </TokenInput>
          <TokenType>
            <img className="token-symbol" src={vaultData?.logoUrl} width={26} height={26} alt="" />
            <TokenName
              fontColor={fontColor2}
            >
              {vaultData?.tokenNames[0]}
            </TokenName>
          </TokenType>
        </FlexDiv>
        <FlexDiv flexDirection='row' justifyContent='space-between' marginTop='12px'>
          <NewLabel
            size='12px'
            height='20px'
            weight='400'
            color={fontColor2}
          >
            Balance: {walletBalance}
          </NewLabel>
        </FlexDiv>
        <FlexDiv marginTop='18px'>
          <Button
            color={connected ? curChain === tokenChain ? subscribe ? 'subscribe' : 'unsubscribe' : 'wido-deposit' : 'connectwallet'}
            width="100%"
            onClick={() => {
              onClickSubscribe()
            }}
          >
            {subscribeName}
          </Button>
        </FlexDiv>
      </PanelSubscribe>
    </BasePanelBox>
  )
}

export default AutopilotPanel
