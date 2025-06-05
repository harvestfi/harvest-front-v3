import { get } from 'lodash'
import React from 'react'
import { DECIMAL_PRECISION } from '../../../../constants'
import { useVaults } from '../../../../providers/Vault'
import { displayAPY } from '../../../../utilities/formats'
import { getTotalApy } from '../../../../utilities/parsers'
import AnimatedDots from '../../../AnimatedDots'
import { RewardsContainer } from '../style'

const VaultApy = ({ token, tokenSymbol, vaultPool, fontColor1 }) => {
  const { loadingVaults, vaultsData } = useVaults()
  const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

  const totalApy = getTotalApy(vaultPool, tokenVault)

  return totalApy !== null && !loadingVaults ? (
    <RewardsContainer $fontcolor1={fontColor1}>
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
