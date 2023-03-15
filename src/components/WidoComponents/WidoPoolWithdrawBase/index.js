import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { fromWei, toWei } from '../../../services/web3'
import Button from '../../Button'
import { WIDO_BALANCES_DECIMALS, FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../../constants'
import AnimatedDots from '../../AnimatedDots'
import { useWallet } from '../../../providers/Wallet'
import { usePools } from '../../../providers/Pools'
import { useActions } from '../../../providers/Actions'
import { useThemeContext } from '../../../providers/useThemeContext'
import { formatNumberWido } from '../../../utils'
import { Divider } from '../../GlobalStyle'
import { BaseWido, TokenSelect, TokenInfo, PoweredByWido, TokenName, StakeInfo, NewLabel, Balance, TokenAmount, 
  SwitchMode, ThemeMode, AmountInfo } from './style'
import WidoIcon from '../../../assets/images/logos/wido/wido.svg'
import IFARMIcon from '../../../assets/images/logos/wido/ifarm.svg'
import FARMIcon from '../../../assets/images/logos/wido/farm.svg'
import DropDownIcon from '../../../assets/images/logos/wido/drop-down.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'

const { tokens } = require('../../../data')

const WidoPoolWithdrawBase = ( { selectTokenWido, setSelectTokenWido, withdrawWido, setWithdrawWido, finalStep,  
  pickedToken, setPickedToken, setUnstakeBalance, fAssetPool, totalStaked, lpTokenBalance, 
  setPendingAction, multipleAssets, symbol, setSymbol } ) => {
  
  const [legacyUnStaking, setLegacyUnStaking] = useState(false)
  const [unstakeClick, setUnstakeClick] = React.useState(false)
  const [unstakeInputValue, setUnstakeInputValue] = useState(0)

  const walletBalancesToCheck = multipleAssets || [symbol]

  const { account, balances, getWalletBalances, connected, connect } = useWallet()
  const { fetchUserPoolStats, userStats } = usePools()
  const { handleExit } = useActions()
  const { backColor, borderColor, fontColor, widoTagActiveFontColor, toggleActiveBackColor, toggleInactiveBackColor } = useThemeContext()

  const FARMBalance = fromWei(get(balances, IFARM_TOKEN_SYMBOL, 0), tokens[IFARM_TOKEN_SYMBOL].decimals, WIDO_BALANCES_DECIMALS)

  const onClickUnStake = async () => {
    if(totalStaked === 0) {
      toast.error("Please stake first!")
      return
    }
    setUnstakeClick(true)
    await handleExit(
      account,
      fAssetPool,
      false,
      totalStaked,
      setPendingAction,
      async () => {
        await fetchUserPoolStats([fAssetPool], account, userStats)
        await getWalletBalances(walletBalancesToCheck, false, true)
      },
    )
    setUnstakeClick(false)
  }

  const onInputUnstake = (e) => {
    setUnstakeBalance(toWei(e.currentTarget.value, fAssetPool.lpTokenData.decimals))
    setUnstakeInputValue(e.currentTarget.value)
  }

  const onClickWithdraw = async () => {
    if(pickedToken.symbol === "Destination token") {
      toast.error("Please select token to withdraw!")
      return
    }

    if(new BigNumber(unstakeInputValue).isEqualTo(0)) {
      toast.error("Please input amount to withdraw!")
      return
    }
    if(!legacyUnStaking) {
      if(new BigNumber(FARMBalance).isLessThanOrEqualTo(unstakeInputValue)) {
        toast.error("Please input sufficient amount to withdraw!")
        return
      }
    }
    setWithdrawWido(true)
  }

  const switchLegacyUnStaking = () => {
    setLegacyUnStaking(!legacyUnStaking)
    setSymbol(legacyUnStaking ? "iFARM" : FARM_TOKEN_SYMBOL)
    setPickedToken({symbol: "Select Token"})
    setUnstakeBalance(0)
  }

  return (
    <BaseWido show={!selectTokenWido && !withdrawWido && !finalStep}>
      <div>
        <SwitchMode fontColor={widoTagActiveFontColor}>
          <ThemeMode mode={legacyUnStaking ? "true" : "false"} activeBackColor={toggleActiveBackColor} inactiveBackColor={toggleInactiveBackColor} borderColor={borderColor}>
            <div id="theme-switch">
              <div className="switch-track">
                <div className="switch-thumb"></div>
              </div>

              <input
                type="checkbox"
                checked={legacyUnStaking}
                onChange={switchLegacyUnStaking}
                aria-label="Switch between dark and light mode"
              />
            </div>
          </ThemeMode>
          Legacy Unstaking
        </SwitchMode>
        <TokenName>
          <img src={legacyUnStaking ? FARMIcon : IFARMIcon} width={20} height={20} alt="" />{symbol}
        </TokenName>
        {
          legacyUnStaking ?
          <StakeInfo>
            <label>Staked</label>
            <span>
              {!connected ? (
                  ''
                ) : totalStaked ? (
                  fromWei(
                    totalStaked,
                    tokens[FARM_TOKEN_SYMBOL].decimals,
                    WIDO_BALANCES_DECIMALS,
                    true,
                  )
                ) : (
                <AnimatedDots />
              )}
            </span>
          </StakeInfo>
          :<></>
        }
      </div>

      {
        legacyUnStaking ? 
        <>
          <NewLabel display={"flex"} justifyContent={"space-between"} marginTop={"20px"}>
            <Button color={"wido-stake"} width={"100%"} height={"auto"} onClick={()=>{onClickUnStake()}}>
              <NewLabel size={"16px"} weight={"bold"} height={"21px"}>
              {
                unstakeClick ? 
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    style={{margin: "auto"}}
                    aria-hidden="true"
                  /> : "Unstake All"
                }
              </NewLabel>
            </Button>
          </NewLabel>

          <Divider height={"1px"} backColor={"#EAECF0"} marginTop={"15px"} />
        </>
        :<></>
      }


      <StakeInfo>
        <label>{legacyUnStaking ? "Unstaked" : "Balance"}</label>
        <AmountInfo onClick={()=>{
          if(!legacyUnStaking) {
            setUnstakeBalance(toWei(formatNumberWido(FARMBalance, WIDO_BALANCES_DECIMALS), fAssetPool.lpTokenData.decimals))
            setUnstakeInputValue(formatNumberWido(FARMBalance, WIDO_BALANCES_DECIMALS))
          }
        }}>
            {
              legacyUnStaking ? 
                !connected ? (
                  ''
                ) : lpTokenBalance ? (
                  fromWei(
                    lpTokenBalance,
                    tokens[FARM_TOKEN_SYMBOL].decimals,
                    WIDO_BALANCES_DECIMALS,
                    true,
                  )
                ) : (
                  <AnimatedDots />
                )
              : !connected ? '' : formatNumberWido(FARMBalance, WIDO_BALANCES_DECIMALS)
            }
        </AmountInfo>
      </StakeInfo>

      {
        legacyUnStaking ? <></> :
        <>
          <NewLabel display={"flex"} position={"relative"} justifyContent={"space-between"} marginTop={"15px"} marginBottom={"15px"}>
            <Balance width={"49%"} backColor={backColor}>
              <TokenAmount type="number" value={unstakeInputValue} 
                borderColor={borderColor} backColor={backColor} fontColor={fontColor} onChange={onInputUnstake}/>
            </Balance>

            <TokenInfo>
              <TokenSelect type="button" onClick={ async ()=>{
                  setSelectTokenWido(true)
                  if(!connected) {
                    await connect()
                  }
                }}>
                {
                  pickedToken.logoURI ?
                    <img className='logo' src={pickedToken.logoURI} width={24} height={24} alt="" /> : <></>
                }
                <NewLabel size={"14px"} weight={"500"} height={"18px"}>
                  <div className='token'>{pickedToken.symbol}</div>
                </NewLabel>
                <img src={DropDownIcon} alt="" />
              </TokenSelect>
            </TokenInfo>
          </NewLabel>
          
          <Button
            color="wido-deposit"
            width="100%"
            size="md"
            onClick={()=>{
              onClickWithdraw()
            }}
          >
            <NewLabel size={"16px"} weight={"600"} height={"21px"}>Withdraw to Wallet</NewLabel>
            <img src={ChevronRightIcon} alt="" />
          </Button>
        </>
      }

      {
        legacyUnStaking ? <></>
        : <PoweredByWido>
          <div>Powered By</div>
          <img src={WidoIcon} alt="" />
          <span>wido</span>
        </PoweredByWido>
      }
    </BaseWido>
  )
}
export default WidoPoolWithdrawBase
