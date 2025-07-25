import React, { useEffect, useState, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { Tooltip } from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { useRate } from '../../../providers/Rate'
import { formatDate, numberWithCommas, showTokenBalance } from '../../../utilities/formats'
import {
  getVaultHistories,
  getPriceFeeds,
  getSequenceId,
  getUserBalanceHistories,
} from '../../../utilities/apiCalls'
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
  { name: 'All', type: 3, state: 'All' },
  { name: 'Latest', type: 4, state: 'Latest' },
]

const PerformanceChart = ({
  token,
  vaultPool,
  totalValue,
  underlyingPrice,
  lpTokenBalance,
  chartData,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { darkMode, bgColorNew, borderColorBox, fontColor3 } = useThemeContext()
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

  const [selectedState, setSelectedState] = useState('Latest')
  const [apiData, setApiData] = useState([])
  const [apiData1, setApiData1] = useState([])
  const [loadComplete, setLoadComplete] = useState(false)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState(`${currencySym}0`)
  const [curContentUnderlying, setCurContentUnderlying] = useState('0')
  const [fixedLen, setFixedLen] = useState(0)
  const [lastFarmingTimeStamp, setLastFarmingTimeStamp] = useState('-')

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const totalValueRef = useRef(totalValue)
  const usdPriceRef = useRef(underlyingPrice)

  useEffect(() => {
    totalValueRef.current = totalValue
    usdPriceRef.current = underlyingPrice
  }, [totalValue, underlyingPrice])

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
    const dl = data.length
    if (data && dl > 0) {
      const firstValue = data[0].value

      for (let i = dl - 1; i >= 0; i -= 1) {
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
      if (account && address && chainId && usdPriceRef.current > 0) {
        try {
          const uniqueData2 = []
          const timestamps = []
          const mergedData = []
          let priceFeedData, priceFeedFlag

          const data = token.isIPORVault
            ? await getUserBalanceHistories(address.toLowerCase(), token.chain, account, true)
            : await getUserBalanceHistories(address, chainId, account)

          const balanceData = data.balanceData
          const balanceFlag = data.balanceFlag

          if (token.isIPORVault) {
            balanceData.map(obj => {
              obj.value = new BigNumber(obj.value)
                .div(new BigNumber(10 ** token.vaultDecimals))
                .toFixed()
              return obj
            })
          }

          if (balanceFlag && !token.isIPORVault && balanceData && balanceData.length > 0) {
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
          } else if (balanceFlag && token.isIPORVault) {
            const result = await getVaultHistories(address.toLowerCase(), token.chain, true)
            priceFeedFlag = result.vaultHFlag
            priceFeedData = result.vaultHData
          }

          if (
            priceFeedFlag &&
            !token.isIPORVault &&
            priceFeedData &&
            Array.isArray(priceFeedData)
          ) {
            priceFeedData.forEach(obj => {
              if (obj && obj.timestamp && !timestamps.includes(obj.timestamp)) {
                timestamps.push(obj.timestamp)
                const modifiedObj = { ...obj, priceUnderlying: obj.price }
                delete modifiedObj.price
                uniqueData2.push(modifiedObj)
              }
            })
          } else if (
            priceFeedFlag &&
            token.isIPORVault &&
            priceFeedData &&
            Array.isArray(priceFeedData)
          ) {
            priceFeedData.forEach(obj => {
              if (obj && obj.timestamp && !timestamps.includes(obj.timestamp)) {
                timestamps.push(obj.timestamp)
                const modifiedObj = {
                  timestamp: obj.timestamp,
                  sharePrice: new BigNumber(obj.sharePrice)
                    .div(new BigNumber(10 ** Number(token.decimals)))
                    .toFixed(),
                  priceUnderlying: Number(obj.priceUnderlying),
                }
                uniqueData2.push(modifiedObj)
              }
            })
          }

          if (balanceFlag && balanceData && balanceData.length > 0) {
            const lastMatchingTimestamp = findLastMatchingTimestamp(balanceData)
            setLastFarmingTimeStamp(lastMatchingTimestamp)
          }

          if (
            balanceFlag &&
            priceFeedFlag &&
            balanceData &&
            balanceData.length > 0 &&
            uniqueData2.length > 0
          ) {
            const nowDate = new Date(),
              currentTimeStamp = Math.floor(nowDate.getTime() / 1000),
              bl = balanceData.length,
              ul = uniqueData2.length

            if (
              balanceData[0] &&
              uniqueData2[0] &&
              balanceData[0].timestamp > uniqueData2[0].timestamp
            ) {
              let i = 0,
                z = 0,
                addFlag = false

              while (
                balanceData[i] &&
                uniqueData2[0] &&
                balanceData[i].timestamp > uniqueData2[0].timestamp
              ) {
                balanceData[i].priceUnderlying = uniqueData2[0].priceUnderlying
                balanceData[i].sharePrice = uniqueData2[0].sharePrice
                mergedData.push(balanceData[i])
                i += 1
              }
              while (i < bl) {
                if (z < ul) {
                  while (
                    uniqueData2[z] &&
                    balanceData[i] &&
                    uniqueData2[z].timestamp >= balanceData[i].timestamp
                  ) {
                    uniqueData2[z].value = balanceData[i].value
                    mergedData.push(uniqueData2[z])
                    z += 1
                    if (
                      !addFlag &&
                      uniqueData2[z] &&
                      balanceData[i] &&
                      uniqueData2[z].timestamp === balanceData[i].timestamp
                    ) {
                      addFlag = true
                    }
                  }
                }
                if (!addFlag && balanceData[i]) {
                  const sourceIndex = z === ul ? z - 1 : z
                  if (uniqueData2[sourceIndex]) {
                    balanceData[i].priceUnderlying = uniqueData2[sourceIndex].priceUnderlying
                    balanceData[i].sharePrice = uniqueData2[sourceIndex].sharePrice
                  }
                  mergedData.push(balanceData[i])
                }
                addFlag = false
                i += 1
              }
              while (z < ul && uniqueData2[z]) {
                uniqueData2[z].value = 0
                mergedData.push(uniqueData2[z])
                z += 1
              }
              while (i < bl && balanceData[i]) {
                if (uniqueData2[ul - 1]) {
                  balanceData[i].priceUnderlying = uniqueData2[ul - 1].priceUnderlying
                  balanceData[i].sharePrice = uniqueData2[ul - 1].sharePrice
                }
                mergedData.push(balanceData[i])
                i += 1
              }
            } else if (balanceData[0] && uniqueData2.length > 0) {
              let i = 0,
                z = 0,
                addFlag = false
              while (
                i < ul &&
                uniqueData2[i] &&
                balanceData[0] &&
                uniqueData2[i].timestamp > balanceData[0].timestamp
              ) {
                uniqueData2[i].value = balanceData[0].value
                mergedData.push(uniqueData2[i])
                i += 1
              }
              while (z < bl) {
                if (i < ul) {
                  while (
                    uniqueData2[i] &&
                    balanceData[z] &&
                    uniqueData2[i].timestamp >= balanceData[z].timestamp
                  ) {
                    uniqueData2[i].value = balanceData[z].value
                    mergedData.push(uniqueData2[i])
                    i += 1
                    if (i >= ul) {
                      break
                    }
                    if (
                      !addFlag &&
                      uniqueData2[i] &&
                      balanceData[z] &&
                      uniqueData2[i].timestamp === balanceData[z].timestamp
                    ) {
                      addFlag = true
                    }
                  }
                }
                if (!addFlag && balanceData[z]) {
                  const sourceIndex = i === ul ? i - 1 : i
                  if (uniqueData2[sourceIndex]) {
                    balanceData[z].priceUnderlying = uniqueData2[sourceIndex].priceUnderlying
                    balanceData[z].sharePrice = uniqueData2[sourceIndex].sharePrice
                  }
                  mergedData.push(balanceData[z])
                }
                addFlag = false
                z += 1
              }
              while (i < ul && uniqueData2[i]) {
                uniqueData2[i].value = 0
                mergedData.push(uniqueData2[i])
                i += 1
              }
              while (z < bl && balanceData[z]) {
                if (uniqueData2[ul - 1]) {
                  balanceData[z].priceUnderlying = uniqueData2[ul - 1].priceUnderlying
                  balanceData[z].sharePrice = uniqueData2[ul - 1].sharePrice
                }
                mergedData.push(balanceData[z])
                z += 1
              }
            }

            const firstObject = {
              priceUnderlying: usdPriceRef.current,
              sharePrice: mergedData.length > 0 ? mergedData[0].sharePrice : 1,
              timestamp: currentTimeStamp.toString(),
              value: totalValueRef.current,
            }

            let apiAllData = [],
              apiAllData1 = [],
              firstNonZeroIndex = -1,
              firstNonZeroIndex1 = -1,
              filteredData,
              filteredData1,
              enrichedData,
              enrichedData1
            apiAllData = [firstObject, ...mergedData]
            apiAllData1 = [firstObject, ...chartData]

            const al = apiAllData.length
            const al1 = apiAllData1.length
            if (apiAllData1.length > 1) {
              for (let i = al1 - 1; i >= 0; i -= 1) {
                if (apiAllData1[i].value !== 0) {
                  firstNonZeroIndex1 = i
                  break
                }
              }

              filteredData1 =
                firstNonZeroIndex1 === -1
                  ? apiAllData1
                  : apiAllData1.slice(0, firstNonZeroIndex1 + 1)

              enrichedData1 = filteredData1
                .map((item, index, array) => {
                  const nextItem = array[index + 1]
                  let event

                  if (nextItem) {
                    if (Number(item.value) === Number(nextItem.value)) {
                      event = 'Harvest'
                    } else if (Number(item.value) > Number(nextItem.value)) {
                      event = 'Convert'
                    } else {
                      event = 'Revert'
                    }
                  } else {
                    event = 'Convert'
                  }

                  return {
                    ...item,
                    event,
                  }
                })
                .filter(Boolean)

              setApiData1(enrichedData1)
            }

            if (apiAllData.length > 1) {
              for (let i = al - 1; i >= 0; i -= 1) {
                if (apiAllData[i].value !== 0) {
                  firstNonZeroIndex = i
                  break
                }
              }

              filteredData =
                firstNonZeroIndex === -1 ? apiAllData : apiAllData.slice(0, firstNonZeroIndex + 1)

              enrichedData = filteredData
                .map((item, index, array) => {
                  const nextItem = array[index + 1]
                  let event

                  if (nextItem) {
                    if (Number(item.value) === Number(nextItem.value)) {
                      event = 'Harvest'
                    } else if (Number(item.value) > Number(nextItem.value)) {
                      event = 'Convert'
                    } else {
                      event = 'Revert'
                    }
                  } else {
                    event = 'Convert'
                  }

                  return {
                    ...item,
                    event,
                  }
                })
                .filter(Boolean)

              setApiData(enrichedData)
            }
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
  }, [address, chainId, account, totalValue, underlyingPrice, chartData, token])

  return (
    <Container $backcolor={bgColorNew} $bordercolor={borderColorBox}>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare" $fontcolor="#15B088">
                {`${rates?.currency?.symbol ?? 'USD'}`}
              </TokenSymbol>
              <FlexDiv>
                <CurContent $fontcolor={fontColor3}>
                  {curContent === '0' ? (
                    ''
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: `${curDate}&nbsp;<span>|</span>&nbsp;` }}
                    />
                  )}
                </CurContent>
                <CurContent $fontcolor="#15B088">{curContent}</CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          <FlexDiv>
            <TooltipInfo className="tooltip-underlying">
              <TokenSymbol className="priceshare" $fontcolor="#8884d8">
                Underlying Token
              </TokenSymbol>
              <FlexDiv>
                <CurContent $fontcolor="#8884d8" className="tt-content-underlying">
                  <div className="question" data-tip id="chart-underlying-balance">
                    {showTokenBalance(curContentUnderlying)} {vaultPool?.id}
                  </div>
                  <Tooltip
                    id="chart-underlying-balance"
                    anchorSelect="#chart-underlying-balance"
                    backgroundColor={darkMode ? 'white' : '#101828'}
                    borderColor={darkMode ? 'white' : 'black'}
                    textColor={darkMode ? 'black' : 'white'}
                    place="top"
                  >
                    <NewLabel
                      $size={isMobile ? '10px' : '10px'}
                      $height={isMobile ? '14px' : '14px'}
                      $weight="500"
                    >
                      {curContentUnderlying}
                    </NewLabel>
                  </Tooltip>
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
          data1={apiData1}
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
          isInactive={token.inactive}
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
export default PerformanceChart
