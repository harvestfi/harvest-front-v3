import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { SPECIAL_VAULTS } from '../../../../constants'
import { formatNumber } from '../../../../utilities/formats'
import AnimatedDots from '../../../AnimatedDots'
import { Value } from '../style'

const getVaultValue = token => {
  const poolId = get(token, 'data.id')

  switch (poolId) {
    case SPECIAL_VAULTS.FARM_WETH_POOL_ID:
      return get(token, 'data.lpTokenData.liquidity')
    case SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID: {
      if (!get(token, 'data.lpTokenData.price')) {
        return null
      }

      return new BigNumber(get(token, 'data.totalValueLocked', 0))
    }
    case SPECIAL_VAULTS.FARM_GRAIN_POOL_ID:
    case SPECIAL_VAULTS.FARM_USDC_POOL_ID:
      return get(token, 'data.totalValueLocked')
    default:
      return token.usdPrice
        ? new BigNumber(token.underlyingBalanceWithInvestment)
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

const VaultValue = ({ token, fontColor1 }) => {
  const [vaultValue, setVaultValue] = useState(null)

  useEffect(() => {
    setVaultValue(getVaultValue(token))
  }, [token])

  return (
    <Value fontColor1={fontColor1}>
      {token.excludeVaultStats ? (
        'N/A'
      ) : vaultValue ? (
        <>{formatNumber(vaultValue, 2)}</>
      ) : (
        <AnimatedDots />
      )}
    </Value>
  )
}

export default VaultValue
