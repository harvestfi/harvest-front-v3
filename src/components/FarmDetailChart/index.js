import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Title, Header, Total, ButtonGroup, ChartDiv, FilterGroup, FilterName } from './style'
import { getDataQuery } from '../../utils'
import { addresses } from '../../data/index'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'
import ChartButtonsGroup from '../ChartButtonsGroup'
import MyBalance_Active from '../../assets/images/logos/earn/mybalance.svg'
import APY_Active from '../../assets/images/logos/earn/apy.svg'
import TVL_Active from '../../assets/images/logos/earn/tvl.svg'
import { useWallet } from '../../providers/Wallet'

const filterList = [
  { id: 1, name: "APY", img: APY_Active },
  { id: 2, name: "TVL in USD", img: TVL_Active },
  { id: 3, name: "My Balance", img: MyBalance_Active },
]

const recommendLinks = [
  {name: "1D", type: 0, state: "1D" },
  {name: "1W", type: 1, state: "1W" },
  {name: "1M", type: 2, state: "1M" },
  {name: "1Y", type: 3, state: "1Y" },
]

const FarmDetailChart = ({token, vaultPool, lastTVL, lastAPY}) => {
  const [clickedId, setClickedId] = useState(1)

  const [selectedState, setSelectedState] = React.useState("1M")

  const { account } = useWallet()

  let address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress

  const chainId = token.chain || token.data.chain

  const decimal = token.decimals

  const [apiData, setApiData] = React.useState({})
  
  useEffect(()=>{
    const initData = async () => {
      let data = await getDataQuery(365, address, chainId, account)
      const isIFARM = token.tokenAddress === addresses.iFARM
      if(isIFARM) {
        let dataIFarm = await getDataQuery(365, token.tokenAddress, chainId, account)
        if(dataIFarm) {
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
        <FilterName>
          {filterList[clickedId].name}
        </FilterName>
      </Header>
      <ChartDiv>
        <ApexChart data={apiData} range={selectedState} filter={clickedId} decimal={decimal} lastTVL={lastTVL} lastAPY={lastAPY} />
      </ChartDiv>
      <ButtonGroup>
        {
          recommendLinks.map((item, i) => (
            <ChartRangeSelect 
              key={i}
              onClick={()=>{
                setSelectedState(item.state)
              }}
              state={selectedState} 
              type={item.type} 
              text={item.name} 
            />
          ))
        }
      </ButtonGroup>
    </Container>
  )
}
export default FarmDetailChart
