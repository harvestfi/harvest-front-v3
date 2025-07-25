import React, { useState, useEffect } from 'react'
import { useSetChain } from '@web3-onboard/react'
import { PiInfoBold } from 'react-icons/pi'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from 'react-toastify'
import { useThemeContext } from '../../../providers/useThemeContext'
import {
  formatNumber,
  getRawTokenBalance,
  isSpecialApp,
  showTokenBalance,
  showUsdValueCurrency,
} from '../../../utilities/formats'
import Button from '../../Button'
import { useWallet } from '../../../providers/Wallet'
import { usePortals } from '../../../providers/Portals'
import AnimatedDots from '../../AnimatedDots'
import { getChainName, handleToggle } from '../../../utilities/parsers'
import { useRate } from '../../../providers/Rate'
import DisclaimersModal from '../DisclaimersModal'
import SubscribeModal from '../SubscribeModal'
import UnsubscribeModal from '../UnsubscribeModal'
import AutopilotInfo from '../AutoPilotInfo'
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
  allVaultsData,
  vaultData,
  walletBalance,
  userBalance,
  yieldValue,
  index,
}) => {
  const {
    darkMode,
    borderColorBox,
    borderColorBox2,
    bgColorBox,
    fontColor2,
    fontColor3,
    fontColor8,
    btnColor,
    btnHoverColor,
    btnActiveColor,
  } = useThemeContext()
  const { rates } = useRate()
  const firstAutopilot = localStorage.getItem('firstAutopilot')

  const [subscribe, setSubscribe] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [disclaimersModalShow, setDisclaimersModalShow] = useState(false)
  const [pilotInfoShow, setPilotInfoShow] = useState(false)
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [subscribeName, setSubscribeName] = useState('Subscribe')
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe')
  const [inputAmount, setInputAmount] = useState('')
  const [inputUSDAmount, setInputUSDAmount] = useState('-')

  const { connected, account, connectAction, chainId, setChainId } = useWallet()
  const { getPortalsToken } = usePortals()

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

  const tokenChain = vaultData.chain

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    const updateData = () => {
      if (subscribe) {
        setSubscribeLabel(`Subscribe`)
      } else {
        setSubscribeLabel(`Unsubscribe`)
      }
      if (account) {
        if (curChain !== '' && curChain !== tokenChain) {
          const chainName = getChainName(tokenChain)
          setSubscribeName(`Change Network to ${chainName}`)
          setSubscribeLabel(`Subscribe`)
        } else if (subscribe) {
          setSubscribeName('Subscribe')
        } else {
          setSubscribeName('Unsubscribe')
        }
      } else {
        setSubscribeName('Connect')
        setSubscribeLabel(`Subscribe`)
      }
    }
    updateData()
  }, [account, curChain, tokenChain, subscribe])

  useEffect(() => {
    let isMounted = true
    const getUSDValue = async () => {
      if (account && curChain === tokenChain && vaultData) {
        const inputTokenDetail = await getPortalsToken(chainId, vaultData.tokenAddress)

        const inputValue = Number(inputAmount) * Number(inputTokenDetail?.price)
        if (isMounted) {
          setInputUSDAmount(inputValue)
        }
      }
    }
    getUSDValue()
    return () => {
      isMounted = false
    }
  }, [
    account,
    chainId,
    curChain,
    tokenChain,
    inputAmount,
    currencySym,
    currencyRate,
    getPortalsToken,
    vaultData,
  ])

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
    } else if (Number(inputAmount) !== 0) {
      if (subscribe) {
        if (firstAutopilot === null || firstAutopilot === 'true') {
          localStorage.setItem('firstAutopilot', true)
          setDisclaimersModalShow(true)
        } else if (walletBalance >= Number(inputAmount)) {
          setModalShow(true)
        } else {
          toast.error(`InputAmount exceeds wallet Balance!`)
        }
      } else if (Number(userBalance) >= Number(inputAmount)) {
        setModalShow(true)
      } else {
        toast.error(`InputAmount exceeds deposited Balance!`)
      }
    } else {
      toast.error(`InputAmount should not be 0!`)
    }
  }

  return (
    <>
      {!pilotInfoShow && (
        <BasePanelBox key={index} $backcolor={bgColorBox} $bordercolor={borderColorBox2}>
          <PanelHeader $bordercolor={borderColorBox} $darkmode={darkMode}>
            <TokenInfo>
              <img className="logo" src={`.${vaultData?.logoUrl}`} width={90} height={90} alt="" />
              <ApyInfo>
                <NewLabel $size="11px" $height="20px" $weight="600" $fontcolor={fontColor8}>
                  Live APY
                </NewLabel>
                <NewLabel $size="20px" $height="28px" $weight="700" $fontcolor={fontColor3}>
                  {formatNumber(vaultData?.estimatedApy, 2)}%
                </NewLabel>
              </ApyInfo>
            </TokenInfo>
            <PilotInfo>
              <PiInfoBold
                className="pilot-info"
                onClick={() => {
                  setPilotInfoShow(true)
                }}
              />
            </PilotInfo>
          </PanelHeader>
          <PanelBalance>
            <FlexDiv $flexdirection="row" $justifycontent="space-between">
              <NewLabel
                $size="14px"
                $height="20px"
                $weight="500"
                $fontcolor={fontColor2}
                $margintop="30px"
                $marginbottom="10px"
                $marginleft="25px"
              >
                My Balance
              </NewLabel>
              <NewLabel
                $size="14px"
                $height="20px"
                $weight="500"
                $fontcolor={fontColor2}
                $margintop="30px"
                $marginbottom="10px"
                $marginright="25px"
              >
                {showTokenBalance(userBalance)}&nbsp;{vaultData?.vaultSymbol}
              </NewLabel>
            </FlexDiv>
            <FlexDiv $flexdirection="row" $justifycontent="space-between">
              <NewLabel
                $size="14px"
                $height="20px"
                $weight="500"
                $fontcolor={fontColor2}
                $margintop="10px"
                $marginbottom="30px"
                $marginleft="25px"
              >
                Lifetime Yield
              </NewLabel>
              <NewLabel
                $size="14px"
                $height="20px"
                $weight="500"
                $fontcolor="#5DCF46"
                $margintop="10px"
                $marginbottom="30px"
                $marginright="25px"
              >
                {showTokenBalance(yieldValue)}&nbsp;{vaultData?.tokenNames[0]}
              </NewLabel>
            </FlexDiv>
          </PanelBalance>
          <PanelSubscribe>
            <FlexDiv $flexdirection="row" $justifycontent="space-between">
              <NewLabel $size="14px" $height="20px" $weight="500" $fontcolor={fontColor2}>
                {subscribeLabel}
              </NewLabel>
              <ThemeMode $mode={subscribe ? 'subscribe' : 'unsubscribe'}>
                <div id="theme-switch">
                  <div className="switch-track">
                    <div className="switch-thumb" />
                  </div>

                  <input
                    type="checkbox"
                    checked={subscribe}
                    onChange={handleToggle(setSubscribe)}
                    aria-label="Switch between subscribe and unsubscribe"
                  />
                </div>
              </ThemeMode>
            </FlexDiv>
            <FlexDiv
              $flexdirection="row"
              $justifycontent="space-between"
              $margintop="10px"
              $gap="10px"
            >
              <TokenInput>
                <TokenAmount
                  type="number"
                  value={inputAmount}
                  onChange={onInputBalance}
                  $backcolor={bgColorBox}
                  $fontcolor2={fontColor2}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                />
                <input type="hidden" value={Number(inputAmount)} />
                <TokenUSDAmount $fontcolor3={fontColor3}>
                  {inputUSDAmount === '' ? (
                    <TokenInfo>
                      <AnimatedDots />
                    </TokenInfo>
                  ) : (
                    showUsdValueCurrency(inputUSDAmount, currencySym, currencyRate, true)
                  )}
                </TokenUSDAmount>
              </TokenInput>
              <TokenType>
                <img
                  className="token-symbol"
                  src={`.${vaultData?.logoUrl}`}
                  width={26}
                  height={26}
                  alt=""
                />
                <TokenName $fontcolor={fontColor2}>{vaultData?.tokenNames[0]}</TokenName>
              </TokenType>
            </FlexDiv>
            <FlexDiv $flexdirection="row" $justifycontent="space-between" $margintop="12px">
              <NewLabel
                className="balance-input"
                $size="12px"
                $height="20px"
                $weight="400"
                $fontcolor={fontColor2}
                onClick={() => {
                  if (account) {
                    if (subscribe) {
                      setInputAmount(getRawTokenBalance(walletBalance, 8))
                    } else {
                      setInputAmount(getRawTokenBalance(userBalance, 8))
                    }
                  }
                }}
              >
                {subscribe ? 'Wallet Balance' : 'My Balance'}:{' '}
                {subscribe
                  ? `${showTokenBalance(walletBalance, 8)} ${vaultData?.tokenNames[0]}`
                  : `${showTokenBalance(userBalance, 8)} ${vaultData?.vaultSymbol}`}
              </NewLabel>
            </FlexDiv>
            <FlexDiv $margintop="18px">
              <Button
                $fontcolor={
                  connected
                    ? curChain === tokenChain
                      ? subscribe
                        ? 'subscribe'
                        : 'unsubscribe'
                      : 'wido-deposit'
                    : 'connectwallet'
                }
                $width="100%"
                $btncolor={btnColor}
                $btnhovercolor={btnHoverColor}
                $btnactivecolor={btnActiveColor}
                onClick={() => {
                  onClickSubscribe()
                }}
              >
                {subscribeName}
              </Button>
            </FlexDiv>
          </PanelSubscribe>
        </BasePanelBox>
      )}
      {pilotInfoShow && (
        <AutopilotInfo
          allVaultsData={allVaultsData}
          vaultData={vaultData}
          setPilotInfoShow={setPilotInfoShow}
        />
      )}
      {disclaimersModalShow && (
        <DisclaimersModal modalShow={disclaimersModalShow} setModalShow={setDisclaimersModalShow} />
      )}
      {modalShow && subscribe && (
        <SubscribeModal
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          token={vaultData}
          modalShow={modalShow}
          setModalShow={setModalShow}
        />
      )}
      {modalShow && !subscribe && (
        <UnsubscribeModal
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          token={vaultData}
          modalShow={modalShow}
          setModalShow={setModalShow}
        />
      )}
    </>
  )
}

export default AutopilotPanel
