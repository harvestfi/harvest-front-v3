import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ChartButtonsGroup from '../ChartButtonsGroup'
import balanceImg from '../../../assets/images/logos/advancedfarm/coins.svg'
import usdbalance from '../../../assets/images/logos/advancedfarm/money.svg'
import { getPriceFeed } from '../../../utils'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'
import {
  ButtonGroup,
  ChartDiv,
  Container,
  Header,
  Total,
  TokenSymbol,
  TooltipInfo,
  FlexDiv,
  CurContent,
  FilterGroup,
} from './style'

const recommendLinks = [
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const filterList = [
  { id: 1, name: 'Balance in USD', img: usdbalance },
  { id: 2, name: 'Balance', img: balanceImg },
]

const PriceShareData = ({ token, vaultPool, setLoadData }) => {
  const [selectedState, setSelectedState] = useState('1Y')

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  const [clickedId, setClickedId] = useState(1)

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const initData = async () => {
      const { data, flag } = await getPriceFeed(address, chainId)
      setLoadComplete(flag)
      setLoadData(flag)
      setApiData(data)
      if (data && data.length > 0) {
        const curTimestamp = new Date().getTime() / 1000
        const between = curTimestamp - Number(data[data.length - 1].timestamp)
        const day = between / (24 * 3600)
        setSelectedState(day < 90 ? '1M' : '1Y')
      }
    }

    initData()
  }, [address, chainId, setLoadData])

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare">My Balance</TokenSymbol>
              <FlexDiv>
                <CurContent color="#1b1b1b">
                  {curDate}&nbsp;<span>|</span>&nbsp;
                </CurContent>
                <CurContent color="#15B088">{curContent}</CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          {!isMobile && (
            <FilterGroup>
              <ChartButtonsGroup
                buttons={filterList}
                clickedId={clickedId}
                setClickedId={setClickedId}
              />
            </FilterGroup>
          )}
        </Total>
      </Header>
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
      <ChartDiv className="advanced-price">
        <ApexChart
          data={apiData}
          loadComplete={loadComplete}
          range={selectedState}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
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
    </Container>
  )
}
export default PriceShareData
