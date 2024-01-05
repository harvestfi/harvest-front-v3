import React, { useEffect, useState, useRef } from 'react'
import {
  getUserBalanceHistories1,
  getUserBalanceHistories2,
  numberWithCommas,
} from '../../../utils'
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
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: 'ALL', type: 3, state: 'ALL' },
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
  totalValue,
  useIFARM,
  farmPrice,
  underlyingPrice,
  pricePerFullShare,
}) => {
  const [selectedState, setSelectedState] = useState('ALL')

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

  const { account } = useWallet()
  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('0')
  const [curContentUnderlying, setCurContentUnderlying] = useState('0')
  const [fixedLen, setFixedLen] = useState(0)

  const handleTooltipContent = payload => {
    if (payload && payload.length) {
      const currentDate = formatDateTime(payload[0].payload.x)
      const balance = numberWithCommas(Number(payload[0].payload.y).toFixed(fixedLen))
      const balanceUnderlying = numberWithCommas(Number(payload[0].payload.z))

      setCurDate(currentDate)
      setCurContent(balance)
      setCurContentUnderlying(balanceUnderlying)
    }
  }

  useEffect(() => {
    const initData = async () => {
      const { data1, flag1 } = await getUserBalanceHistories1(address, chainId, account)
      const { data2, flag2 } = await getUserBalanceHistories2(address, chainId)
      const uniqueData2 = []
      const timestamps = []
      data2.forEach(obj => {
        if (!timestamps.includes(obj.timestamp)) {
          timestamps.push(obj.timestamp)
          uniqueData2.push(obj)
        }
      })
      const mergedData = []
      if (flag1 && flag2) {
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
              data1[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
              data1[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
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
              data1[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
              data1[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
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
          timestamp: mergedData[0].timestamp,
          value: totalValueRef.current,
        }
        mergedData.unshift(firstObject)
        // console.log('totalValue -------------', totalValue)
        // console.log('underlyingPrice -------------', underlyingPrice)
        // console.log('mergedData -------------', mergedData)
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
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare" color="#15B088">
                USD Balance
              </TokenSymbol>
              <FlexDiv>
                <CurContent color="#6F78AA">
                  {curContent === '0' ? (
                    ''
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: `${curDate}&nbsp;<span>|</span>&nbsp;` }}
                    />
                  )}
                </CurContent>
                <CurContent color="#15B088">${curContent}</CurContent>
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
          token={token}
          data={apiData}
          loadComplete={loadComplete}
          range={selectedState}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
          setCurContentUnderlying={setCurContentUnderlying}
          handleTooltipContent={handleTooltipContent}
          setFixedLen={setFixedLen}
          fixedLen={fixedLen}
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
