import { get } from 'lodash'
import React from 'react'
import { DECIMAL_PRECISION } from '../../../../constants'
import { useVaults } from '../../../../providers/Vault'
import { displayAPY, getTotalApy } from '../../../../utils'
import AnimatedDots from '../../../AnimatedDots'
import { RewardsContainer } from '../style'

const VaultApy = ({ token, tokenSymbol, vaultPool, isSpecialVault }) => {
  const { loadingVaults, vaultsData } = useVaults()
  const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  if (token.excludeVaultStats) {
    return 'N/A'
  }

  return isSpecialVault ? (
    token.data && token.data.loaded && (token.data.dataFetched === false || totalApy !== null) ? (
      <RewardsContainer>
        {token.inactive ? 'Inactive' : <>{totalApy ? displayAPY(totalApy) : null}</>}
      </RewardsContainer>
    ) : (
      <b>
        <AnimatedDots />
      </b>
    )
  ) : vaultPool.loaded && totalApy !== null && !loadingVaults ? (
    <RewardsContainer>
      {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
        token.inactive || token.testInactive ? (
          'Inactive'
        ) : null
      ) : (
        <>{displayAPY(totalApy, DECIMAL_PRECISION, 10)}</>
      )}
    </RewardsContainer>
  ) : (
    <b>
      <AnimatedDots />
    </b>
  )
}

export default VaultApy
