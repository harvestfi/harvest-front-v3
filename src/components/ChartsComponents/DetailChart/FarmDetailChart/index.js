import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { addresses } from '../../../../data/index'
import { useWallet } from '../../../../providers/Wallet'
import { getDataQuery, getTotalTVLData } from '../../../../utils'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'
import {
  ButtonGroup,
  ChartDiv,
  Container,
  FilterGroup,
  Header,
  Total,
  CurDate,
  TooltipInfo,
  FlexDiv,
} from './style'

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const FarmDetailChart = ({ token, vaultPool, lastTVL, lastAPY }) => {
  const clickedId = 0
  const [selectedState, setSelectedState] = useState('1M')

  const { account } = useWallet()
  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [iFarmTVLData, setIFarmTVLData] = useState({})
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const isIFARM = token.tokenAddress === addresses.FARM

  useEffect(() => {
    const initData = async () => {
      const data = await getDataQuery(365, address, chainId, account)
      if (isIFARM) {
        const dataIFarm = await getDataQuery(365, token.tokenAddress, chainId, account)
        if (dataIFarm) {
          data.apyRewards = dataIFarm.apyRewards
          data.tvls = dataIFarm.tvls
        }

        const iFarmTVL = await getTotalTVLData()
        setIFarmTVLData(iFarmTVL)
      }
      setApiData(data)
    }

    initData()
  }, [address, chainId, account, token, isIFARM])

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <FilterGroup>
              {isMobile && (
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
              )}
            </FilterGroup>
            <TooltipInfo>
              <CurDate>{curDate}</CurDate>
              <div dangerouslySetInnerHTML={{ __html: curContent }} />
            </TooltipInfo>
          </FlexDiv>
          {!isMobile && (
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
          )}
        </Total>
      </Header>
      <ChartDiv className="advanced-farm">
        <ApexChart
          data={apiData}
          iFarmTVL={iFarmTVLData}
          isIFARM={isIFARM}
          range={selectedState}
          filter={clickedId}
          lastTVL={lastTVL}
          lastAPY={lastAPY}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
    </Container>
  )
}
export default FarmDetailChart
