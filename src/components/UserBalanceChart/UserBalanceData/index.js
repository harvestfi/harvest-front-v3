import React, { useEffect, useState, useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { useRate } from '../../../providers/Rate'
import { formatDate, numberWithCommas, showTokenBalance } from '../../../utilities/formats'
import { getPriceFeeds, getSequenceId, getUserBalanceHistories } from '../../../utilities/apiCalls'
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
  NewLabel,
} from './style'

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: 'ALL', type: 3, state: 'ALL' },
  { name: 'LAST', type: 4, state: 'LAST' },
]

const UserBalanceData = ({
  token,
  vaultPool,
  totalValue,
  useIFARM,
  farmPrice,
  underlyingPrice,
  pricePerFullShare,
  lpTokenBalance,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { darkMode, backColor, borderColor, fontColor3 } = useThemeContext()
  const { account } = useWallet()

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  const [selectedState, setSelectedState] = useState('LAST')
  const [apiData, setApiData] = useState([])
  const [loadComplete, setLoadComplete] = useState(false)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState(`${currencySym}0`)
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
      const currentDate = formatDate(payload[0].payload.x)
      if (Number(payload[0].payload.y === 0)) {
        setCurContent(`${currencySym}0`)
      } else if (Number(payload[0].payload.y < 0.01)) {
        setCurContent(`<${currencySym}0.01`)
      } else {
        setCurContent(
          `${currencySym}${numberWithCommas(
            (Number(payload[0].payload.y) * Number(currencyRate)).toFixed(fixedLen),
          )}`,
        )
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
    let isMounted = true
    const initData = async () => {
      if (account && address && chainId && pricePerFullShare && totalValue) {
        try {
          const uniqueData2 = []
          const timestamps = []
          const mergedData = []
          let priceFeedData, priceFeedFlag

          const { balanceData, balanceFlag } = await getUserBalanceHistories(
            address,
            chainId,
            account,
          )
          if (balanceFlag) {
            const firstTimeStamp = balanceData[balanceData.length - 1].timestamp
            const { vaultPriceFeedCount } = await getSequenceId(address, chainId)
            const result = await getPriceFeeds(
              address,
              chainId,
              vaultPriceFeedCount,
              firstTimeStamp,
              null,
              false,
            )
            priceFeedData = result.priceFeedData
            priceFeedFlag = result.priceFeedFlag
          }

          if (priceFeedFlag) {
            priceFeedData.forEach(obj => {
              if (!timestamps.includes(obj.timestamp)) {
                timestamps.push(obj.timestamp)
                const modifiedObj = { ...obj, priceUnderlying: obj.price } // Rename the 'price' property to 'priceUnderlying'
                delete modifiedObj.price // Remove the 'value' property from modifiedObj
                uniqueData2.push(modifiedObj)
              }
            })
          }

          if (balanceFlag) {
            const lastMatchingTimestamp = findLastMatchingTimestamp(balanceData)
            setLastFarmingTimeStamp(lastMatchingTimestamp)
          }

          if (balanceFlag && priceFeedFlag) {
            const nowDate = new Date()
            const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)

            if (balanceData[0].timestamp > uniqueData2[0].timestamp) {
              let i = 0,
                z = 0,
                addFlag = false

              while (balanceData[i]?.timestamp > uniqueData2[0].timestamp) {
                balanceData[i].priceUnderlying = uniqueData2[0].priceUnderlying
                balanceData[i].sharePrice = uniqueData2[0].sharePrice
                mergedData.push(balanceData[i])
                i += 1
              }
              while (i < balanceData.length) {
                if (z < uniqueData2.length) {
                  while (uniqueData2[z].timestamp >= balanceData[i].timestamp) {
                    uniqueData2[z].value = balanceData[i].value
                    mergedData.push(uniqueData2[z])
                    z += 1
                    if (!addFlag && uniqueData2[z].timestamp === balanceData[i].timestamp) {
                      addFlag = true
                    }
                  }
                }
                if (!addFlag) {
                  balanceData[i].priceUnderlying =
                    uniqueData2[z === uniqueData2.length ? z - 1 : z].priceUnderlying
                  balanceData[i].sharePrice =
                    uniqueData2[z === uniqueData2.length ? z - 1 : z].sharePrice
                  mergedData.push(balanceData[i])
                }
                addFlag = false
                i += 1
              }
              while (z < uniqueData2.length) {
                uniqueData2[z].value = 0
                mergedData.push(uniqueData2[z])
                z += 1
              }
              while (i < balanceData.length) {
                balanceData[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
                balanceData[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
                mergedData.push(balanceData[i])
                i += 1
              }
            } else {
              let i = 0,
                z = 0,
                addFlag = false
              while (
                i < uniqueData2.length &&
                uniqueData2[i].timestamp > balanceData[0].timestamp
              ) {
                uniqueData2[i].value = balanceData[0].value
                mergedData.push(uniqueData2[i])
                i += 1
              }
              while (z < balanceData.length) {
                if (i < uniqueData2.length) {
                  while (uniqueData2[i].timestamp >= balanceData[z].timestamp) {
                    uniqueData2[i].value = balanceData[z].value
                    mergedData.push(uniqueData2[i])
                    i += 1
                    if (i >= uniqueData2.length) {
                      break
                    }
                    if (!addFlag && uniqueData2[i].timestamp === balanceData[z].timestamp) {
                      addFlag = true
                    }
                  }
                }
                if (!addFlag) {
                  balanceData[z].priceUnderlying =
                    uniqueData2[i === uniqueData2.length ? i - 1 : i].priceUnderlying
                  balanceData[z].sharePrice =
                    uniqueData2[i === uniqueData2.length ? i - 1 : i].sharePrice
                  mergedData.push(balanceData[z])
                }
                addFlag = false
                z += 1
              }
              while (i < uniqueData2.length) {
                uniqueData2[i].value = 0
                mergedData.push(uniqueData2[i])
                i += 1
              }
              while (z < balanceData.length) {
                balanceData[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
                balanceData[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
                mergedData.push(balanceData[z])
                z += 1
              }
            }

            const firstObject = {
              priceUnderlying: useIFARM ? farmPriceRef.current : usdPriceRef.current,
              sharePrice: mergedData[0].sharePrice,
              timestamp: currentTimeStamp,
              value: totalValueRef.current,
            }
            const apiAllData = [firstObject, ...mergedData]
            setApiData(apiAllData)
          }
          if (isMounted) {
            setLoadComplete(balanceFlag && priceFeedFlag)
          }
        } catch (error) {
          console.log('An error ocurred', error)
        }
      }
    }

    initData()

    return () => {
      isMounted = false
    }
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
                {`${rates?.currency?.symbol ?? 'USD'}`} Balance
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
                  <div className="question" data-tip data-for="chart-underlying-balance">
                    {showTokenBalance(curContentUnderlying)}
                  </div>
                  <ReactTooltip
                    id="chart-underlying-balance"
                    backgroundColor={darkMode ? 'white' : '#101828'}
                    borderColor={darkMode ? 'white' : 'black'}
                    textColor={darkMode ? 'black' : 'white'}
                    place="top"
                  >
                    <NewLabel
                      size={isMobile ? '12px' : '12px'}
                      height={isMobile ? '18px' : '18px'}
                      weight="500"
                    >
                      {curContentUnderlying}
                    </NewLabel>
                  </ReactTooltip>
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
          lpTokenBalance={lpTokenBalance}
          totalValue={totalValue}
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
