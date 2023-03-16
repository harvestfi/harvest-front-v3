import React, { useEffect, useState } from 'react'
import APY_active from '../../assets/images/logos/earn/apy.svg'
import myBalance_active from '../../assets/images/logos/earn/mybalance.svg'
import TVL_active from '../../assets/images/logos/earn/tvl.svg'
import { addresses } from '../../data/index'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { getDataQuery } from '../../utils'
import ApexChart from '../ApexChart'
import ChartButtonsGroup from '../ChartButtonsGroup'
import ChartRangeSelect from '../ChartRangeSelect'
import {
  ButtonGroup,
  ChartDiv, Container, FilterGroup,
  FilterName, Header, Title, Total
} from './style'

const filterList = [
  { id: 1, name: 'APY', img: APY_active },
  { id: 2, name: 'TVL in USD', img: TVL_active },
  { id: 3, name: 'My Balance', img: myBalance_active },
]

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const FarmDetailChart = ({ token, vaultPool, lastTVL, lastAPY }) => {
  const [clickedId, setClickedId] = useState(1)

  const [selectedState, setSelectedState] = React.useState('1M')

  const { account } = useWallet()

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress

  const chainId = token.chain || token.data.chain

  const decimal = token.decimals

  const [apiData, setApiData] = React.useState({})

  useEffect(() => {
    const initData = async () => {
      const data = await getDataQuery(365, address, chainId, account)
      const isIFARM = token.tokenAddress === addresses.iFARM
      if (isIFARM) {
        const dataIFarm = await getDataQuery(365, token.tokenAddress, chainId, account)
        if (dataIFarm) {
          data.apyAutoCompounds = dataIFarm.apyAutoCompounds
          data.apyRewards = dataIFarm.apyRewards
          data.userBalanceHistories = dataIFarm.userBalanceHistories
        }
      }
      setApiData(data)
    }

    initData()
  }, [address, chainId, account, token])

  const { fontColor, backColor } = useThemeContext()

  return (
    <Container backColor={backColor} fontColor={fontColor}>
      <Header>
        <Total>
          <Title>Historical Data</Title>
          <FilterGroup>
            <ChartButtonsGroup
              buttons={filterList}
              clickedId={clickedId}
              setClickedId={setClickedId}
            />
          </FilterGroup>
        </Total>
        <FilterName>{filterList[clickedId].name}</FilterName>
      </Header>
      <ChartDiv>
        <ApexChart
          data={apiData}
          range={selectedState}
          filter={clickedId}
          decimal={decimal}
          lastTVL={lastTVL}
          lastAPY={lastAPY}
        />
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
  )
}
export default FarmDetailChart
