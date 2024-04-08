import React, { useEffect, useState, useRef } from 'react'
import {
  getUserBalanceHistories1,
  getUserBalanceHistories2,
  numberWithCommas,
} from '../../../utils'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
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
  token,
  vaultPool,
  useIFARM,
  totalValue,
  farmPrice,
  underlyingPrice,
  pricePerFullShare,
}) => {
  const { backColor, borderColor, fontColor3 } = useThemeContext()
  const { account } = useWallet()

  const [selectedState, setSelectedState] = useState('LAST')
  const [apiData, setApiData] = useState([])
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('$0')
  const [curContentUnderlying, setCurContentUnderlying] = useState('0')
  const [fixedLen, setFixedLen] = useState(0)
  const [lastFarmingTimeStamp, setLastFarmingTimeStamp] = useState('-')

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

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
      const { data1, flag1 } = await getUserBalanceHistories1(address, chainId, account)
      const { data2, flag2 } = await getUserBalanceHistories2(address, chainId)
      const uniqueData2 = []
      const timestamps = []

      if (data1) {
        const lastMatchingTimestamp = findLastMatchingTimestamp(data1)
        setLastFarmingTimeStamp(lastMatchingTimestamp)
      }

      data2.forEach(obj => {
        if (!timestamps.includes(obj.timestamp)) {
          timestamps.push(obj.timestamp)
          const modifiedObj = { ...obj, priceUnderlying: obj.price } // Rename the 'price' property to 'priceUnderlying'
          delete modifiedObj.price // Remove the 'value' property from modifiedObj
          uniqueData2.push(modifiedObj)
        }
      })
      const mergedData = []
      if (flag1 && flag2) {
        const nowDate = new Date()
        const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)

        if (data1[0].timestamp > uniqueData2[0].timestamp) {
          let i = 0,
            z = 0,
            addFlag = false

          while (data1[i].timestamp > uniqueData2[0].timestamp) {
            data1[i].priceUnderlying = uniqueData2[0].priceUnderlying
            data1[i].sharePrice = uniqueData2[0].sharePrice
            mergedData.push(data1[i])
            i += 1
          }
          while (i < data1.length) {
            if (z < uniqueData2.length) {
              while (uniqueData2[z].timestamp >= data1[i].timestamp) {
                uniqueData2[z].value = data1[i].value
                mergedData.push(uniqueData2[z])
                z += 1
                if (!addFlag) {
                  addFlag = true
                }
              }
            }
            if (!addFlag) {
              data1[i].priceUnderlying =
                uniqueData2[z === uniqueData2.length ? z - 1 : z].priceUnderlying
              data1[i].sharePrice = uniqueData2[z === uniqueData2.length ? z - 1 : z].sharePrice
              mergedData.push(data1[i])
            }
            addFlag = false
            i += 1
          }
          while (z < uniqueData2.length) {
            uniqueData2[z].value = 0
            mergedData.push(uniqueData2[z])
            z += 1
          }
          while (i < data1.length) {
            data1[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
            data1[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
            mergedData.push(data1[i])
            i += 1
          }
        } else {
          let i = 0,
            z = 0,
            addFlag = false
          while (i < uniqueData2.length && uniqueData2[i].timestamp > data1[0].timestamp) {
            uniqueData2[i].value = data1[0].value
            mergedData.push(uniqueData2[i])
            i += 1
          }
          while (z < data1.length) {
            if (i < uniqueData2.length) {
              while (uniqueData2[i].timestamp >= data1[z].timestamp) {
                uniqueData2[i].value = data1[z].value
                mergedData.push(uniqueData2[i])
                i += 1
                if (i >= uniqueData2.length) {
                  break
                }
                if (!addFlag) {
                  addFlag = true
                }
              }
            }
            if (!addFlag) {
              data1[z].priceUnderlying =
                uniqueData2[i === uniqueData2.length ? i - 1 : i].priceUnderlying
              data1[z].sharePrice = uniqueData2[i === uniqueData2.length ? i - 1 : i].sharePrice
              mergedData.push(data1[z])
            }
            addFlag = false
            z += 1
          }
          while (i < uniqueData2.length) {
            uniqueData2[i].value = 0
            mergedData.push(uniqueData2[i])
            i += 1
          }
          while (z < data1.length) {
            data1[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
            data1[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
            mergedData.push(data1[z])
            z += 1
          }
        }
        const firstObject = {
          priceUnderlying: useIFARM ? farmPriceRef.current : usdPriceRef.current,
          sharePrice: pricePerFullShareRef.current,
          timestamp: currentTimeStamp,
          value: totalValueRef.current,
        }
        mergedData.unshift(firstObject)
        // console.log('totalValue -------------', totalValue)
        // console.log('underlyingPrice -------------', underlyingPrice)
        // console.log('data1 -------------', data1)
        // console.log('data2 -------------', data2)
        console.log('mergedData -------------', mergedData)
      }
      setLoadComplete(flag1 && flag2)
      setApiData(mergedData)
    }

    initData()
  }, [
    address,
    chainId,
    account,
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
