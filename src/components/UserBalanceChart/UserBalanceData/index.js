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
      let firstUserTime,
        firstVaultTime = Math.floor(Date.now() / 1000),
        data2comb = [],
        flag2comb = true
      if (flag1) {
        firstUserTime = data1[data1.length - 1].timestamp
      }
      console.log(firstVaultTime, firstUserTime)
      while (firstVaultTime > firstUserTime && flag1) {
        console.log(firstVaultTime)
        /* eslint-disable no-await-in-loop */
        const { data2 } = await getUserBalanceHistories2(address, chainId, firstVaultTime)
        /* eslint-enable no-await-in-loop */
        if (data2.length === 0) {
          break
        }
        data2comb = data2comb.concat(data2)
        firstVaultTime = data2[data2.length - 1].timestamp
      }
      if (data2comb.length === 0) {
        flag2comb = false
      }
      console.log(data2comb)
      console.log(data2comb.length)
      const uniqueData2 = []
      const timestamps = []
      data2comb.forEach(obj => {
        if (!timestamps.includes(obj.timestamp)) {
          timestamps.push(obj.timestamp)
          uniqueData2.push(obj)
        }
      })
      const mergedData = []
      if (flag1 && flag2comb) {
        for (let i = 0; i < uniqueData2.length; i += 1) {
          const vaultData = uniqueData2[i]
          let j = 0,
            value
          while (data1[j].timestamp > vaultData.timestamp) {
            j += 1
            if (j >= data1.length) {
              break
            }
          }
          if (j >= data1.length) {
            value = 0
          } else {
            value = data1[j].value
          }
          vaultData.value = value
          mergedData.push(vaultData)
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
      setLoadComplete(flag1 && flag2comb)
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
