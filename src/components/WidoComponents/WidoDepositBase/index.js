import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import DropDownIcon from '../../../assets/images/logos/wido/drop-down.svg'
import FARMIcon from '../../../assets/images/logos/wido/farm.svg'
import WidoIcon from '../../../assets/images/logos/wido/wido.svg'
import { WIDO_BALANCES_DECIMALS, POOL_BALANCES_DECIMALS } from '../../../constants'
import { useActions } from '../../../providers/Actions'
import { useContracts } from '../../../providers/Contracts'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useVaults } from '../../../providers/Vault'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, toWei } from '../../../services/web3'
import {
  formatNumberWido,
  hasAmountGreaterThanZero,
  hasRequirementsForInteraction,
} from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import Button from '../../Button'
import {
  BalanceInfo,
  BalanceInput,
  BaseWido,
  DepoTitle,
  Line,
  Max,
  Part,
  PoweredByWido,
  SelectToken,
  StakeAction,
  StakeInfo,
  TokenAmount,
  TokenInfo,
  TokenName,
  TokenSelect,
  TokenUSD,
} from './style'

const WidoDepositBase = ({
  selectTokenWido,
  setSelectTokenWido,
  startSlippage,
  depositWido,
  setDepositWido,
  finalStep,
  balance,
  usdValue,
  setUsdValue,
  pickedToken,
  inputAmount,
  setInputAmount,
  symbol,
  token,
  totalStaked,
  lpTokenBalance,
  setLoadingDots,
  pendingAction,
  setPendingAction,
  setAmountsToExecute,
  lpTokenApprovedBalance,
  fAssetPool,
  multipleAssets,
  loaded,
  loadingBalances,
}) => {
  const { handleStake } = useActions()
  const { contracts } = useContracts()
  const { userStats, fetchUserPoolStats } = usePools()
  const { connected, connect, account, getWalletBalances } = useWallet()
  const { vaultsData } = useVaults()
  const {
    backColor,
    borderColor,
    widoTagActiveFontColor,
    widoInputPanelBorderColor,
    widoInputBoxShadow,
  } = useThemeContext()
  const [stakeClick, setStakeClick] = useState(false)
  const [stakeInputValue, setStakeInputValue] = useState('')

  const onClickStake = async () => {
    if (stakeInputValue === '') {
      toast.error('Please input value!')
      return
    }
    const stakeAmount = toWei(stakeInputValue, fAssetPool.lpTokenData.decimals, 0)
    if (new BigNumber(stakeAmount).isGreaterThan(lpTokenBalance)) {
      toast.error('Please input sufficient value!')
      return
    }

    setStakeClick(true)
    await handleStake(
      token,
      account,
      symbol,
      stakeAmount,
      lpTokenApprovedBalance,
      fAssetPool,
      contracts,
      setPendingAction,
      multipleAssets,
      async () => {
        setAmountsToExecute(['', ''])
        setLoadingDots(false, true)
        await fetchUserPoolStats([fAssetPool], account, userStats)
        await getWalletBalances([symbol], false, true)
        setLoadingDots(false, false)
      },
      async () => {
        await fetchUserPoolStats([fAssetPool], account, userStats)
      },
    )
    setStakeClick(false)
  }

  const onClickDeposit = async () => {
    if (pickedToken.symbol === 'Select Token') {
      toast.error('Please select token to deposit!')
      return
    }
    if (new BigNumber(inputAmount).isGreaterThan(balance)) {
      toast.error('Please input sufficient amount for deposit!')
      return
    }
    if (new BigNumber(inputAmount).isEqualTo(0)) {
      toast.error('Please input amount for deposit!')
      return
    }
    setDepositWido(true)
  }

  useEffect(() => {
    if (pickedToken.usdPrice) {
      setInputAmount(formatNumberWido(balance, POOL_BALANCES_DECIMALS))
      setUsdValue(formatNumberWido(balance * pickedToken.usdPrice), 2)
    }
  }, [balance, setUsdValue, setInputAmount, pickedToken])

  const onInputBalance = e => {
    setInputAmount(formatNumberWido(e.currentTarget.value, POOL_BALANCES_DECIMALS))
    setUsdValue(formatNumberWido(e.currentTarget.value * pickedToken.usdPrice, 2))
  }

  return (
    <BaseWido show={!depositWido && !selectTokenWido && !startSlippage && !finalStep}>
      <DepoTitle fontColor={widoTagActiveFontColor}>I want to deposit</DepoTitle>
      <SelectToken
        backColor={backColor}
        borderColor={widoInputPanelBorderColor}
        shadow={widoInputBoxShadow}
      >
        <TokenInfo>
          <div>
            <TokenAmount
              type="number"
              value={inputAmount}
              borderColor={borderColor}
              backColor={backColor}
              fontColor={widoTagActiveFontColor}
              onChange={onInputBalance}
            />
            <TokenUSD>${usdValue}</TokenUSD>
          </div>
          <TokenSelect
            type="button"
            onClick={async () => {
              setSelectTokenWido(true)
              if (!connected) {
                await connect()
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
      <BalanceInfo fontColor={widoTagActiveFontColor}>
        Balance:
        <span>{balance}</span>
      </BalanceInfo>
      <Button
        color="wido-deposit"
        width="100%"
        size="md"
        onClick={() => {
          onClickDeposit()
        }}
      >
        Deposit
        <img src={ChevronRightIcon} alt="" />
      </Button>

      <PoweredByWido>
        <div>Powered By</div>
        <img src={WidoIcon} alt="" />
        <span>wido</span>
      </PoweredByWido>

      <Line height="1px" backColor="#EAECF0" />

      <div>
        <TokenName>
          <img src={FARMIcon} width={20} height={20} alt="" />
          {`f${symbol}`}
        </TokenName>
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

      <StakeAction>
        <Part width="55%">
          <BalanceInput
            type="number"
            value={stakeInputValue}
            onChange={e => {
              setStakeInputValue(e.target.value)
            }}
            borderColor={widoInputPanelBorderColor}
            backColor={backColor}
            fontColor={widoTagActiveFontColor}
          />
          <Max
            onClick={() => {
              setStakeInputValue(
                fromWei(
                  lpTokenBalance,
                  fAssetPool.lpTokenData.decimals,
                  WIDO_BALANCES_DECIMALS,
                  true,
                ),
              )
            }}
          >
            Max
          </Max>
        </Part>
        <Part width="40%">
          <Button
            width="100%"
            color="wido-stake"
            height="50px"
            onClick={() => {
              onClickStake()
            }}
            disabled={
              !hasRequirementsForInteraction(loaded, pendingAction, vaultsData, loadingBalances) ||
              !hasAmountGreaterThanZero(lpTokenBalance) ||
              token.inactive
            }
          >
            {stakeClick ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                style={{ margin: 'auto' }}
                aria-hidden="true"
              />
            ) : (
              'Stake'
            )}
          </Button>
        </Part>
      </StakeAction>
    </BaseWido>
  )
}
export default WidoDepositBase
