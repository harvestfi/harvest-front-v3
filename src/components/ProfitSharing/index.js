import React, { useMemo } from 'react'
import { displayAPY, getTotalApy } from '../../utils'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS, DECIMAL_PRECISION } from '../../constants'
import { useStats } from '../../providers/Stats'
import { usePools } from '../../providers/Pools'
import { ProfitSharing, TopDiv, BottomDiv } from './style'
import ProfitSharingIcon from '../../assets/images/logos/sidebar/profit-sharing.svg'
import ProfitSharingTitle from '../../assets/images/logos/sidebar/profit-sharing-title.svg'
import Line from '../../assets/images/logos/sidebar/line.svg'

const ProfitSharingContainer = ({height}) => {
  const { pools } = usePools()
  const { profitShareAPY } = useStats()
  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
      },
    }),
    [
      profitShareAPY,
      farmProfitSharingPool,
    ],
  )  
  const token = poolVaults["FARM"]
  const totalApy = getTotalApy(null, token, true)

  return (
    <ProfitSharing height={height}>
      <TopDiv>
        <img src={ProfitSharingIcon} alt="profit-sharing" />
        <img src={ProfitSharingTitle} alt="profit-sharing" />
      </TopDiv>
      <BottomDiv>
        <div>
          {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
          &nbsp;APR
        </div>
        <img src={Line} alt="chart" />
      </BottomDiv>
    </ProfitSharing>
  )
}

export default ProfitSharingContainer
