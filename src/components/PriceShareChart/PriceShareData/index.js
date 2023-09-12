import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
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
} from './style'

const recommendLinks = [
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const PriceShareData = ({ token, vaultPool, tokenSymbol, setLoadData }) => {
  const [selectedState, setSelectedState] = useState('1Y')

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')

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
        setSelectedState(day < 180 ? '1M' : '1Y')
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
              <TokenSymbol>{`f${tokenSymbol}`}</TokenSymbol>
              <FlexDiv>
                <CurContent color="#1b1b1b">{curDate}&nbsp;:&nbsp;</CurContent>
                <CurContent color="#00D26B">{curContent}</CurContent>
              </FlexDiv>
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
    </Container>
  )
}
export default PriceShareData
