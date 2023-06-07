import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getDataQuery } from '../../utils'
import { directDetailUrl } from '../../constants'
import { useStats } from '../../providers/Stats'
import { useWallet } from '../../providers/Wallet'
import SmallApexChart from '../SmallApexChart'
import { addresses } from '../../data/index'
import { ProfitSharing, TopDiv, BottomDiv } from './style'
import ProfitSharingIcon from '../../assets/images/logos/sidebar/profit-sharing.svg'
import ProfitSharingTitle from '../../assets/images/logos/sidebar/profit-sharing-title.svg'

const ProfitSharingContainer = ({ height }) => {
  const { chainId } = useWallet()
  const { profitShareAPY } = useStats()
  const { push } = useHistory()

  const [apiData, setApiData] = useState({})
  useEffect(() => {
    const initData = async () => {
      const data = await getDataQuery(365, addresses.iFARM, chainId.toString(), null)
      setApiData(data)
    }
    initData()
  }, [chainId])

  return (
    <ProfitSharing
      onClick={() => {
        push(`${directDetailUrl}ethereum/${addresses.FARM}`)
      }}
      height={height}
    >
      <TopDiv>
        <img src={ProfitSharingIcon} alt="profit-sharing" />
        <img src={ProfitSharingTitle} alt="profit-sharing" />
      </TopDiv>
      <BottomDiv>
        <div className="apy">
          {Number(profitShareAPY).toFixed(2)}
          %&nbsp;APR
        </div>
        <div className="chart">
          <SmallApexChart data={apiData} lastAPY={Number(profitShareAPY)} />
        </div>
      </BottomDiv>
    </ProfitSharing>
  )
}

export default ProfitSharingContainer
