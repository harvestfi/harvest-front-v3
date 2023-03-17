import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { toWei, fromWei } from '../../../services/web3'
import Button from '../../Button'
import { WIDO_BALANCES_DECIMALS } from '../../../constants'
import AnimatedDots from '../../AnimatedDots'
import { useWallet } from '../../../providers/Wallet'
import { usePools } from '../../../providers/Pools'
import { useActions } from '../../../providers/Actions'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Divider } from '../../GlobalStyle'
import {
  BaseWido,
  TokenSelect,
  TokenInfo,
  PoweredByWido,
  TokenName,
  StakeInfo,
  NewLabel,
  Balance,
  TokenAmount,
  Max,
} from './style'
import WidoIcon from '../../../assets/images/logos/wido/wido.svg'
import FARMIcon from '../../../assets/images/logos/wido/farm.svg'
import DropDownIcon from '../../../assets/images/logos/wido/drop-down.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'

const { tokens } = require('../../../data')

const WidoWithdrawBase = ({
  selectTokenWido,
  setSelectTokenWido,
  withdrawWido,
  setWithdrawWido,
  finalStep,
  pickedToken,
  unstakeBalance,
  setUnstakeBalance,
  symbol,
  fAssetPool,
  totalStaked,
  lpTokenBalance,
  setPendingAction,
  multipleAssets,
  token,
}) => {
  const [amountsToExecute, setAmountsToExecute] = useState('')
  const [unstakeClick, setUnstakeClick] = useState(false)
  const [stakeInputValue, setStakeInputValue] = useState(0)
  const [unstakeInputValue, setUnstakeInputValue] = useState(0)

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  const tokenDecimals = token.decimals || tokens[symbol].decimals

  const walletBalancesToCheck = multipleAssets || [symbol]

  const { account, getWalletBalances, connected, connect } = useWallet()
  const { fetchUserPoolStats, userStats } = usePools()
  const { handleExit } = useActions()
  const { backColor, borderColor, fontColor } = useThemeContext()

  const onClickUnStake = async () => {
    if (new BigNumber(totalStaked).isEqualTo(0)) {
      toast.error('Please stake first!')
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
      toast.error('Please input value for Unstake!')
      return
    }

    const isAvailableUnstake = new BigNumber(amountsToExecuteInWei[0]).isLessThanOrEqualTo(
      totalStaked,
    )

    if (!isAvailableUnstake) {
      toast.error('Please input sufficient value for Unstake!')
      return
    }

    setUnstakeClick(true)

    const shouldDoPartialUnstake = new BigNumber(amountsToExecuteInWei[0]).isLessThan(totalStaked)

    await handleExit(
      account,
      fAssetPool,
      shouldDoPartialUnstake,
      amountsToExecuteInWei[0],
      setPendingAction,
      async () => {
        await fetchUserPoolStats([fAssetPool], account, userStats)
        await getWalletBalances(walletBalancesToCheck, false, true)
      },
    )

    setUnstakeClick(false)
    setStakeInputValue(0)
  }

  const onInputBalance = e => {
    setStakeInputValue(e.currentTarget.value)
    setAmountsToExecute([e.currentTarget.value])
  }

  const onInputUnstake = e => {
    setUnstakeInputValue(e.currentTarget.value)
    setUnstakeBalance(toWei(e.currentTarget.value, token.decimals))
  }

  const onClickWithdraw = async () => {
    if (pickedToken.symbol === 'Destination token') {
      toast.error('Please select token to withdraw!')
      return
    }

    if (new BigNumber(unstakeBalance).isEqualTo(0)) {
      toast.error('Please input amount to withdraw!')
      return
    }

    if (!new BigNumber(unstakeBalance).isLessThanOrEqualTo(lpTokenBalance)) {
      toast.error('Please input sufficient amount to withdraw!')
      return
    }
    setWithdrawWido(true)
  }

  return (
    <BaseWido show={!selectTokenWido && !withdrawWido && !finalStep}>
      <div>
        <TokenName>
          <img src={FARMIcon} width={20} height={20} alt="" />
          {token.balance}
        </TokenName>
        <StakeInfo>
          Staked
          <span>
            {!connected ? (
              0
            ) : totalStaked ? (
              fromWei(totalStaked, fAssetPool.lpTokenData.decimals, WIDO_BALANCES_DECIMALS, true)
            ) : (
              <AnimatedDots />
            )}
          </span>
        </StakeInfo>
      </div>

      <NewLabel display="flex" justifyContent="space-between" marginTop="20px">
        <Balance backColor={backColor} width="49%">
          <TokenAmount
            type="number"
            value={stakeInputValue}
            borderColor={borderColor}
            backColor={backColor}
            fontColor={fontColor}
            onChange={onInputBalance}
          />
          <Max
            onClick={() => {
              setStakeInputValue(
                Number(
                  fromWei(
                    totalStaked,
                    fAssetPool.lpTokenData.decimals,
                    WIDO_BALANCES_DECIMALS,
                    true,
                  ),
                ),
              )
              setAmountsToExecute([
                fromWei(totalStaked, fAssetPool.lpTokenData.decimals, WIDO_BALANCES_DECIMALS, true),
              ])
            }}
          >
            Max
          </Max>
        </Balance>

        <Button
          color="wido-stake"
          width="49%"
          height="auto"
          onClick={() => {
            onClickUnStake()
          }}
        >
          <NewLabel size="16px" weight="bold" height="21px">
            {unstakeClick ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                style={{ margin: 'auto' }}
                aria-hidden="true"
              />
            ) : (
              'Unstake'
            )}
          </NewLabel>
        </Button>
      </NewLabel>

      <Divider height="1px" backColor="#EAECF0" marginTop="15px" />

      <StakeInfo>
        Unstaked
        <span>
          {!connected ? (
            0
          ) : lpTokenBalance ? (
            fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals, WIDO_BALANCES_DECIMALS, true)
          ) : (
            <AnimatedDots />
          )}
        </span>
      </StakeInfo>

      <NewLabel
        display="flex"
        position="relative"
        justifyContent="space-between"
        marginTop="15px"
        marginBottom="15px"
      >
        <Balance width="49%" backColor={backColor}>
          <TokenAmount
            type="number"
            value={unstakeInputValue}
            borderColor={borderColor}
            backColor={backColor}
            fontColor={fontColor}
            onChange={onInputUnstake}
          />
          <Max
            onClick={() => {
              setUnstakeBalance(lpTokenBalance)
              setUnstakeInputValue(
                Number(
                  fromWei(
                    lpTokenBalance,
                    fAssetPool.lpTokenData.decimals,
                    WIDO_BALANCES_DECIMALS,
                    true,
                  ),
                ),
              )
            }}
          >
            Max
          </Max>
        </Balance>

        <TokenInfo>
          <TokenSelect
            type="button"
            onClick={async () => {
              setSelectTokenWido(true)
              if (!connected) {
                await connect()
              }
            }}
          >
            {pickedToken.logoURI ? (
              <img className="logo" src={pickedToken.logoURI} width={24} height={24} alt="" />
            ) : (
              <></>
            )}
            <NewLabel size="14px" weight="500" height="18px">
              <div className="token">{pickedToken.symbol}</div>
            </NewLabel>
            <img src={DropDownIcon} alt="" />
          </TokenSelect>
        </TokenInfo>
      </NewLabel>

      <Button
        color="wido-deposit"
        width="100%"
        size="md"
        onClick={() => {
          onClickWithdraw()
        }}
      >
        <NewLabel size="16px" weight="600" height="21px">
          Withdraw to Wallet
        </NewLabel>
        <img src={ChevronRightIcon} alt="" />
      </Button>

      <PoweredByWido>
        <div>Powered By</div>
        <img src={WidoIcon} alt="" />
        <span>wido</span>
      </PoweredByWido>
    </BaseWido>
  )
}
export default WidoWithdrawBase
