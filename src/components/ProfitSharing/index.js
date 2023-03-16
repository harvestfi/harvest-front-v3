import React, { useState, useEffect, useMemo } from 'react'
import { displayAPY, getTotalApy, getDataQuery } from '../../utils'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS, DECIMAL_PRECISION, directDetailUrl } from '../../constants'
import { useStats } from '../../providers/Stats'
import { usePools } from '../../providers/Pools'
import { useWallet } from '../../providers/Wallet'
import SmallApexChart from '../SmallApexChart'
import { addresses } from '../../data/index'
import { ProfitSharing, TopDiv, BottomDiv } from './style'
import ProfitSharingIcon from '../../assets/images/logos/sidebar/profit-sharing.svg'
import ProfitSharingTitle from '../../assets/images/logos/sidebar/profit-sharing-title.svg'

const ProfitSharingContainer = ({height}) => {
  const { pools } = usePools()
  const { chainId } = useWallet()
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

  const [apiData, setApiData] = useState({})
  useEffect(()=>{
    const initData = async () => {
      let data = await getDataQuery(365, addresses.iFARM, chainId.toString(), null)
      setApiData(data)
    }
    initData()
  }, [chainId])

  return (
    <ProfitSharing href={directDetailUrl + FARM_TOKEN_SYMBOL} height={height}>
      <TopDiv>
        <img src={ProfitSharingIcon} alt="profit-sharing" />
        <img src={ProfitSharingTitle} alt="profit-sharing" />
      </TopDiv>
      <BottomDiv>
        <div className="apy">
          {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
          &nbsp;APR
        </div>
        <div className='chart'>
          <SmallApexChart data={apiData} lastAPY={Number(totalApy)} />
        </div>
      </BottomDiv>
    </ProfitSharing>
  )
}

export default ProfitSharingContainer
