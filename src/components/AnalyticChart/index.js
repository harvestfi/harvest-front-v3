import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { usePools } from '../../providers/Pools'
import { Container, Title, Header, ButtonGroup, ChartDiv, ConnectButton } from './style'
import { SPECIAL_VAULTS } from '../../constants'
import { getDataQuery } from '../../utils'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const AnalyticChart = () => {
  const { totalPools } = usePools()

  const farmProfitSharingPool = totalPools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const chainId = farmProfitSharingPool.chain

  const [clickedId] = useState(1)

  const [selectedState, setSelectedState] = React.useState('1W')

  const address =
    farmProfitSharingPool.autoStakePoolAddress || farmProfitSharingPool.contractAddress

  const [apiData, setApiData] = React.useState([])

  useEffect(() => {
    const initData = async () => {
      const data = await getDataQuery(365, address, chainId)
      setApiData(data)
    }

    initData()
  }, [address, chainId])

  const { fontColor } = useThemeContext()

  return (
    <>
      <Container fontColor={fontColor}>
        <Header>
          <Title>Harvest TVL Chart</Title>
        </Header>
        <ChartDiv>
          <ApexChart data={apiData} range={selectedState} filter={clickedId} />
        </ChartDiv>
        <ButtonGroup>
          {recommendLinks.map((item, i) => (
            <ChartRangeSelect
              key={i}
              onClick={() => {
                setSelectedState(item.state)
              }}
              state={selectedState}
              type={item.type}
              text={item.name}
            />
          ))}
        </ButtonGroup>
      </Container>
      <ConnectButton color="connectwallet" minWidth="190px" bordercolor={fontColor}>
        Coming Soon
      </ConnectButton>
    </>
  )
}
export default AnalyticChart
