import React, { useState, useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { isEqual } from 'lodash'
import { useSetChain } from '@web3-onboard/react'
import { PiInfoBold } from 'react-icons/pi'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from 'react-toastify'
import useEffectWithPrevious from 'use-effect-with-previous'
import { useThemeContext } from '../../../providers/useThemeContext'
import { isSpecialApp } from '../../../utilities/formats'
import Button from '../../Button'
import { useWallet } from '../../../providers/Wallet'
import { usePortals } from '../../../providers/Portals'
import { useContracts } from '../../../providers/Contracts'
import AnimatedDots from '../../AnimatedDots'
import { getChainName, handleToggle, getUnderlyingId } from '../../../utilities/parsers'
import { fromWei } from '../../../services/web3'
import { useRate } from '../../../providers/Rate'
import SubscribeModal from '../SubscribeModal'
import UnsubscribeModal from '../UnsubscribeModal'
import AutopilotInfo from '../AutoPilotInfo'
import { initBalanceAndDetailData } from '../../../utilities/apiCalls'
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

const AutopilotPanel = ({ allVaultsData, vaultData, index }) => {
  const {
    darkMode,
    borderColorBox,
    borderColorBox2,
    bgColorBox,
    fontColor2,
    fontColor3,
    fontColor8,
  } = useThemeContext()
  const { rates } = useRate()

  const [subscribe, setSubscribe] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [pilotInfoShow, setPilotInfoShow] = useState(false)
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [subscribeName, setSubscribeName] = useState('Subscribe')
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe')
  const [walletBalance, setWalletBalance] = useState('-')
  const [userVBalance, setUserVBalance] = useState('-')
  const [userAssetBalance, setUserAssetBalance] = useState('-')
  const [yeildValue, setYeildValue] = useState('-')

  const {
    connected,
    account,
    connectAction,
    balances,
    getWalletBalances,
    chainId,
    setChainId,
  } = useWallet()
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

  const tokenChain = vaultData.chain

  const [inputAmount, setInputAmount] = useState(0)
  const [inputUSDAmount, setInputUSDAmount] = useState('-')
  const firstWalletBalanceLoad = useRef(true)

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
        } else {
          if (subscribe) {
            setSubscribeName('Subscribe')
          } else {
            setSubscribeName('Unsubscribe')
          }
          const underlyingId = getUnderlyingId(vaultData.id)
          setWalletBalance(fromWei(balances[underlyingId], vaultData.decimals, vaultData.decimals)) // to get USDC value in user's wallet
        }
      } else {
        setSubscribeName('Connect Wallet to Get Started')
        setSubscribeLabel(`Subscribe`)
      }
    }
    updateData()
  }, [
    account,
    curChain,
    tokenChain,
    subscribe,
    vaultData,
    setWalletBalance,
    balances,
    getWalletBalances,
  ])

  useEffectWithPrevious(
    ([prevAccount, prevVBalance]) => {
      const hasSwitchedAccount = account !== prevAccount && account
      if (
        connected &&
        (hasSwitchedAccount ||
          firstWalletBalanceLoad.current ||
          (userVBalance && !isEqual(userVBalance, prevVBalance)))
      ) {
        const getBalance = async () => {
          firstWalletBalanceLoad.current = false
          const underlyingId = getUnderlyingId(vaultData.id)
          await getWalletBalances([vaultData.id, underlyingId], account, true) // to get USDC value in user's wallet
          const vaultContract = contracts.iporVaults[vaultData.id]
          const vaultBalance = await vaultContract.methods.getBalanceOf(
            vaultContract.instance,
            account,
          )
          const AssetBalance = await vaultContract.methods.convertToAssets(
            vaultContract.instance,
            vaultBalance,
          )

          if (new BigNumber(AssetBalance).gt(0)) {
            const userBal = fromWei(new BigNumber(vaultBalance), Number(vaultData.vaultDecimals))
            const userAssetBal = fromWei(
              new BigNumber(AssetBalance),
              Number(vaultData.decimals),
              Number(vaultData.decimals),
            )
            setUserAssetBalance(userAssetBal)
            setUserVBalance(userBal)
          } else {
            setUserAssetBalance(0)
            setUserVBalance(0)
          }
          const iporVFlag = vaultData.isIPORVault ?? false

          const { bFlag, vHFlag, sumNetChangeUsd } = await initBalanceAndDetailData(
            vaultData.vaultAddress,
            vaultData.chain,
            account,
            vaultData.decimals,
            iporVFlag,
          )

          if (bFlag && vHFlag) {
            setYeildValue(parseFloat(sumNetChangeUsd).toFixed(6))
          }
        }

        getBalance()
      }
    },
    [account, userVBalance],
  )

  useEffect(() => {
    let isMounted = true
    const getUSDValue = async () => {
      if (account && curChain === tokenChain && vaultData) {
        const inputTokenDetail = await getPortalsToken(chainId, vaultData.tokenAddress)

        const inputValue = Number(inputAmount) * Number(currencyRate)
        if (isMounted) {
          if (Number(inputValue) < 0.01) {
            setInputUSDAmount(`<${currencySym}0.01`)
          } else {
            setInputUSDAmount(
              `≈${currencySym}${(
                Number(inputValue) *
                Number(inputTokenDetail?.price) *
                Number(currencyRate)
              ).toFixed(2)}`,
            )
          }
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
        if (walletBalance >= Number(inputAmount)) {
          setModalShow(true)
        } else {
          toast.error(`InputAmount exceeds wallet Balance!`)
        }
      } else if (Number(userAssetBalance) >= Number(inputAmount)) {
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
        <BasePanelBox key={index} backColor={bgColorBox} borderColor={borderColorBox2}>
          <PanelHeader borderColor={borderColorBox} darkMode={darkMode}>
            <TokenInfo>
              <img className="logo" src={vaultData?.logoUrl} width={90} height={90} alt="" />
              <ApyInfo>
                <NewLabel size="11px" height="20px" weight="600" color={fontColor8}>
                  Live APY
                </NewLabel>
                <NewLabel size="20px" height="28px" weight="700" color={fontColor3}>
                  {vaultData?.estimatedApy}%
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
            <FlexDiv flexDirection="row" justifyContent="space-between">
              <NewLabel
                size="14px"
                height="20px"
                weight="500"
                color={fontColor2}
                marginTop="30px"
                marginBottom="10px"
                marginLeft="25px"
              >
                My Balance
              </NewLabel>
              <NewLabel
                size="14px"
                height="20px"
                weight="500"
                color={fontColor2}
                marginTop="30px"
                marginBottom="10px"
                marginRight="25px"
              >
                {userAssetBalance}&nbsp;{vaultData?.tokenNames[0]}
              </NewLabel>
            </FlexDiv>
            <FlexDiv flexDirection="row" justifyContent="space-between">
              <NewLabel
                size="14px"
                height="20px"
                weight="500"
                color={fontColor2}
                marginTop="10px"
                marginBottom="30px"
                marginLeft="25px"
              >
                Lifetime Yield
              </NewLabel>
              <NewLabel
                size="14px"
                height="20px"
                weight="500"
                color="#5DCF46"
                marginTop="10px"
                marginBottom="30px"
                marginRight="25px"
              >
                {yeildValue}&nbsp;{vaultData?.tokenNames[0]}
              </NewLabel>
            </FlexDiv>
          </PanelBalance>
          <PanelSubscribe>
            <FlexDiv flexDirection="row" justifyContent="space-between">
              <NewLabel size="14px" height="20px" weight="500" color={fontColor2}>
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
                    onChange={handleToggle(setSubscribe)}
                    aria-label="Switch between subscribe and unsubscribe"
                  />
                </div>
              </ThemeMode>
            </FlexDiv>
            <FlexDiv flexDirection="row" justifyContent="space-between" marginTop="10px" gap="10px">
              <TokenInput>
                <TokenAmount
                  type="number"
                  value={inputAmount}
                  onChange={onInputBalance}
                  backColor={bgColorBox}
                  fontColor2={fontColor2}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <input type="hidden" value={Number(inputAmount)} />
                <TokenUSDAmount fontColor3={fontColor3}>
                  {inputAmount === '0' || inputAmount === '' ? (
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
                <img
                  className="token-symbol"
                  src={vaultData?.logoUrl}
                  width={26}
                  height={26}
                  alt=""
                />
                <TokenName fontColor={fontColor2}>{vaultData?.tokenNames[0]}</TokenName>
              </TokenType>
            </FlexDiv>
            <FlexDiv flexDirection="row" justifyContent="space-between" marginTop="12px">
              <NewLabel size="12px" height="20px" weight="400" color={fontColor2}>
                {subscribe ? 'Wallet Balance' : 'My Balance'}:{' '}
                {subscribe
                  ? `${walletBalance} ${vaultData?.tokenNames[0]}`
                  : `${userAssetBalance} ${vaultData?.tokenNames[0]}`}
              </NewLabel>
            </FlexDiv>
            <FlexDiv marginTop="18px">
              <Button
                color={
                  connected
                    ? curChain === tokenChain
                      ? subscribe
                        ? 'subscribe'
                        : 'unsubscribe'
                      : 'wido-deposit'
                    : 'connectwallet'
                }
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
      )}
      {pilotInfoShow && (
        <AutopilotInfo
          allVaultsData={allVaultsData}
          vaultData={vaultData}
          setPilotInfoShow={setPilotInfoShow}
        />
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
