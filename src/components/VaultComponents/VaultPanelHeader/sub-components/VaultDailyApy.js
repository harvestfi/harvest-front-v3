import { get } from 'lodash'
import React from 'react'
import { useVaults } from '../../../../providers/Vault'
import { getTotalApy } from '../../../../utilities/parsers'
import AnimatedDots from '../../../AnimatedDots'
import { RewardsContainer } from '../style'

const VaultDailyApy = ({ token, tokenSymbol, vaultPool, fontColor1 }) => {
  const { loadingVaults, vaultsData } = useVaults()
  const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

  const totalApy = getTotalApy(vaultPool, tokenVault)

  const apyDaily = totalApy
    ? (((Number(totalApy) / 100 + 1) ** (1 / 365) - 1) * 100).toFixed(3)
    : null

  return totalApy !== null && !loadingVaults ? (
    <RewardsContainer $fontcolor1={fontColor1}>
      {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
        token.inactive || token.testInactive ? (
          'Inactive'
        ) : null
      ) : (
        <>{apyDaily}% &nbsp;</>
      )}
    </RewardsContainer>
  ) : (
    <b>
      <AnimatedDots />
    </b>
  )
}

export default VaultDailyApy
