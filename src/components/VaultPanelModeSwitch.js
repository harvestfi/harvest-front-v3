import { get } from 'lodash'
import React from 'react'
import { Tooltip } from 'react-tooltip'
import { DISABLED_WITHDRAWS } from '../constants'
import { usePools } from '../providers/Pools'
import { useVaults } from '../providers/Vault'
import { hasAmountGreaterThanZero, hasRequirementsForInteraction } from '../utilities/formats'
import ButtonSwitch from './ButtonSwitch'

const VaultPanelModeSwitch = ({
  token,
  tokenSymbol,
  vaultPool,
  withdrawMode,
  loaded,
  pendingAction,
  loadingBalances,
  setWithdrawMode,
}) => {
  const { userStats } = usePools()
  const { vaultsData } = useVaults()
  const lpTokenBalance = get(userStats, `[${vaultPool.id}]['lpTokenBalance']`, 0)
  const totalStaked = get(userStats, `[${vaultPool.id}]['totalStaked']`, 0)

  let withdrawalTimestamp = 0,
    timeLimited = false

  if (token.uniswapV3ManagedData?.capToken) {
    withdrawalTimestamp = token.uniswapV3ManagedData.withdrawalTimestamp
      ? parseInt(token.uniswapV3ManagedData.withdrawalTimestamp, 10)
      : 0
    timeLimited = !(Date.now() >= withdrawalTimestamp)
  }

  return (
    <>
      <Tooltip
        id={`${tokenSymbol}-withdraw-button`}
        backgroundColor="#fffce6"
        borderColor="black"
        border
        textColor="black"
        disable={!token.disabledWithdrawTooltip}
        effect="solid"
        delayHide={50}
        clickable
      >
        {token.disabledWithdrawTooltip}
      </Tooltip>
      <div style={{ display: 'flex' }} data-tip data-for={`${tokenSymbol}-withdraw-button`}>
        <ButtonSwitch
          checked={withdrawMode}
          options={{
            checked: {
              label: 'Deposit',
              disabled: !hasRequirementsForInteraction(
                loaded,
                pendingAction,
                vaultsData,
                loadingBalances,
              ),
            },
            unchecked: {
              label: 'Withdraw',
              disabled:
                !!token.disabledWithdrawTooltip ||
                timeLimited ||
                !hasRequirementsForInteraction(
                  loaded,
                  pendingAction,
                  vaultsData,
                  loadingBalances,
                ) ||
                DISABLED_WITHDRAWS.indexOf(tokenSymbol) !== -1 ||
                (!hasAmountGreaterThanZero(totalStaked) &&
                  !hasAmountGreaterThanZero(lpTokenBalance)),
            },
          }}
          setChecked={checked => {
            setWithdrawMode(checked)
          }}
        />
      </div>
    </>
  )
}

export default VaultPanelModeSwitch
