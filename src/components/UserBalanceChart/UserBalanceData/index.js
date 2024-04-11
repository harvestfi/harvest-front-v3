import React, { useEffect, useState, useRef } from 'react'
import { numberWithCommas } from '../../../utilities/formats'
import { useThemeContext } from '../../../providers/useThemeContext'
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
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: 'ALL', type: 3, state: 'ALL' },
  { name: 'LAST', type: 4, state: 'LAST' },
]

function formatDateTime(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthNum = date.getMonth()
  const month = monthNames[monthNum]
  const day = date.getDate()

  return `${day} ${month} ${year}`
}

const UserBalanceData = ({
  totalValue,
  useIFARM,
  farmPrice,
  underlyingPrice,
  pricePerFullShare,
  balanceFlag,
  detailFlag,
  allData,
  balanceData,
}) => {
  const { backColor, borderColor, fontColor3 } = useThemeContext()

  const [selectedState, setSelectedState] = useState('LAST')
  const [apiData, setApiData] = useState([])
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('$0')
  const [curContentUnderlying, setCurContentUnderlying] = useState('0')
  const [fixedLen, setFixedLen] = useState(0)
  const [lastFarmingTimeStamp, setLastFarmingTimeStamp] = useState('-')

  const totalValueRef = useRef(totalValue)
  const farmPriceRef = useRef(farmPrice)
  const usdPriceRef = useRef(underlyingPrice)
  const pricePerFullShareRef = useRef(pricePerFullShare)
  useEffect(() => {
    totalValueRef.current = totalValue
    farmPriceRef.current = farmPrice
    usdPriceRef.current = underlyingPrice
    pricePerFullShareRef.current = pricePerFullShare
  }, [totalValue, underlyingPrice, farmPrice, pricePerFullShare])

  const handleTooltipContent = payload => {
    if (payload && payload.length) {
      const currentDate = formatDateTime(payload[0].payload.x)
      const balance = numberWithCommas(Number(payload[0].payload.y).toFixed(fixedLen))
      if (Number(payload[0].payload.y === 0)) {
        setCurContent('$0')
      } else if (Number(payload[0].payload.y < 0.01)) {
        setCurContent('<$0.01')
      } else {
        setCurContent(`$${balance}`)
      }
      const balanceUnderlying = numberWithCommas(Number(payload[0].payload.z))

      setCurDate(currentDate)
      setCurContentUnderlying(balanceUnderlying)
    }
  }

  const findLastMatchingTimestamp = data => {
    if (data && data.length > 0) {
      const firstValue = data[0].value

      for (let i = data.length - 1; i >= 0; i -= 1) {
        if (data[i].value === firstValue) {
          return data[i].timestamp
        }
      }

      return data[0].timestamp
    }

    return '-'
  }

  useEffect(() => {
    const initData = async () => {
      if (balanceFlag) {
        const lastMatchingTimestamp = findLastMatchingTimestamp(balanceData)
        setLastFarmingTimeStamp(lastMatchingTimestamp)
      }

      if (balanceFlag && detailFlag) {
        const nowDate = new Date()
        const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)

        const firstObject = {
          priceUnderlying: useIFARM ? farmPriceRef.current : usdPriceRef.current,
          sharePrice: pricePerFullShareRef.current,
          timestamp: currentTimeStamp,
          value: totalValueRef.current,
        }
        const apiAllData = [firstObject, ...allData]
        setApiData(apiAllData)
        console.log('apiAllData -------------', apiAllData)
      }
      setLoadComplete(balanceFlag && detailFlag)
    }

    initData()
  }, [
    allData,
    balanceData,
    balanceFlag,
    detailFlag,
    totalValue,
    underlyingPrice,
    useIFARM,
    farmPrice,
    pricePerFullShare,
  ])

  return (
    <Container backColor={backColor} borderColor={borderColor}>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare" color="#15B088">
                USD Balance
              </TokenSymbol>
              <FlexDiv>
                <CurContent color={fontColor3}>
                  {curContent === '0' ? (
                    ''
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: `${curDate}&nbsp;<span>|</span>&nbsp;` }}
                    />
                  )}
                </CurContent>
                <CurContent color="#15B088">{curContent}</CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          <FlexDiv>
            <TooltipInfo className="tooltip-underlying">
              <TokenSymbol className="priceshare" color="#8884d8">
                Underlying Balance
              </TokenSymbol>
              <FlexDiv>
                <CurContent color="#8884d8" className="tt-content-underlying">
                  {curContentUnderlying}
                </CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
        </Total>
      </Header>
      <ChartDiv className="advanced-price">
        <ApexChart
          data={apiData}
          loadComplete={loadComplete}
          range={selectedState}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
          setCurContentUnderlying={setCurContentUnderlying}
          handleTooltipContent={handleTooltipContent}
          setFixedLen={setFixedLen}
          fixedLen={fixedLen}
          lastFarmingTimeStamp={lastFarmingTimeStamp}
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
export default UserBalanceData
