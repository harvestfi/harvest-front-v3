import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  ComposedChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useWindowWidth } from '@react-hook/window-size'
import { ClipLoader } from 'react-spinners'
import { useThemeContext } from '../../../providers/useThemeContext'
import {
  round10,
  numberWithCommas,
  formatDate,
  formatXAxis,
  normalizeSliderValue,
  denormalizeSliderValue,
  calculateMarks,
} from '../../../utilities/formats'
import { getChartDomain, getTimeSlots } from '../../../utilities/parsers'
import { LoadingDiv, NoData, FakeChartWrapper } from './style'
import { useWallet } from '../../../providers/Wallet'
import { useRate } from '../../../providers/Rate'

function getRangeNumber(strRange) {
  let ago = 30
  if (strRange === '1D') {
    ago = 1
  } else if (strRange === '1W') {
    ago = 7
  } else if (strRange === '1M') {
    ago = 30
  } else if (strRange === 'ALL') {
    ago = 365
  }

  return ago
}

function findMax(data) {
  const ary = data.map(el => el.y)
  const max = Math.max(...ary)
  return max
}
function findMin(data) {
  const ary = data.map(el => el.y)
  const min = Math.min(...ary)
  return min
}

function findMaxUnderlying(data) {
  const ary = data.map(el => el.z)
  const max = Math.max(...ary)
  return max
}
function findMinUnderlying(data) {
  const ary = data.map(el => el.z)
  const min = Math.min(...ary)
  return min
}

function generateChartDataWithSlots(slots, apiData, balance, priceUnderlying, sharePrice) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    for (let j = 0; j < apiData.length; j += 1) {
      if (slots[i] >= parseInt(apiData[j].timestamp, 10)) {
        const value1 = parseFloat(apiData[j][balance])
        const value2 = parseFloat(apiData[j][priceUnderlying])
        const value3 = parseFloat(apiData[j][sharePrice])
        seriesData.push({ x: slots[i] * 1000, y: value1 * value2 * value3, z: value1 * value3 })
        break
      }
      // else if (j === apiData.length - 1) {
      //   seriesData.push({ x: slots[i] * 1000, y: 0, z: 0 })
      // }
    }
  }

  return seriesData
}

function getYAxisValues(min, max, roundNum) {
  const bet = Number(max - min)
  const ary = []
  for (let i = min; i <= max; i += bet / 4) {
    const val = round10(i, roundNum)
    ary.push(val)
  }
  return ary
}

const ApexChart = ({
  data,
  loadComplete,
  range,
  setCurDate,
  setCurContent,
  setCurContentUnderlying,
  handleTooltipContent,
  setFixedLen,
  fixedLen,
  lastFarmingTimeStamp,
  lpTokenBalance,
  totalValue,
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  setMarks,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { fontColor, fontColor5 } = useThemeContext()
  const { connected } = useWallet()

  const [mainSeries, setMainSeries] = useState([])
  const [allMainSeries, setAllMainSeries] = useState([])
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  const fakeChartData = [
    { x: 1691637444000, y: 5, z: 1.5 },
    { x: 1691780004000, y: 6, z: 2 },
    { x: 1691922564000, y: 7, z: 2.5 },
    { x: 1692065124000, y: 7, z: 2.5 },
    { x: 1692207684000, y: 7.5, z: 3 },
    { x: 1692350244000, y: 8, z: 3 },
    { x: 1692492804000, y: 8.5, z: 3 },
    { x: 1692635364000, y: 9, z: 3.5 },
    { x: 1692777924000, y: 10, z: 3.5 },
    { x: 1692920484000, y: 11, z: 3.7 },
    { x: 1693063044000, y: 11, z: 3.7 },
    { x: 1693205604000, y: 11.5, z: 4 },
    { x: 1693348164000, y: 11.5, z: 4.2 },
    { x: 1693490724000, y: 12, z: 4.3 },
    { x: 1693633284000, y: 14, z: 4.5 },
    { x: 1693775844000, y: 15, z: 4.5 },
  ]

  const onlyWidth = useWindowWidth()

  const [isDataReady, setIsDataReady] = useState('false')
  const [roundedDecimal, setRoundedDecimal] = useState(2)
  const [roundedDecimalUnderlying, setRoundedDecimalUnderlying] = useState(2)
  const [hourUnit, setHourUnit] = useState(false)

  const [minVal, setMinVal] = useState(0)
  const [maxVal, setMaxVal] = useState(0)
  const [minValUnderlying, setMinValUnderlying] = useState(0)
  const [maxValUnderlying, setMaxValUnderlying] = useState(0)
  const [minAllVal, setMinAllVal] = useState(0)
  const [maxAllVal, setMaxAllVal] = useState(0)
  const [minAllValUnderlying, setMinAllValUnderlying] = useState(0)
  const [maxAllValUnderlying, setMaxAllValUnderlying] = useState(0)
  const [yAxisTicks, setYAxisTicks] = useState([])
  const [zAxisTicks, setZAxisTicks] = useState([])

  const CustomTooltip = ({ active, payload, onTooltipContentChange }) => {
    useEffect(() => {
      if (active && payload && payload.length) {
        onTooltipContentChange(payload)
      }
    }, [active, payload, onTooltipContentChange])

    return null
  }

  const renderCustomXAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = formatXAxis(payload.value, hourUnit)
    }
    return (
      <text
        orientation="bottom"
        x={x - 12}
        y={y + 4}
        width={24}
        height={24}
        viewBox="0 0 1024 1024"
        fill={fontColor5}
      >
        <tspan dy="0.71em">{path}</tspan>
      </text>
    )
  }

  const renderCustomYAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = `${currencySym}${numberWithCommas(
        (Number(payload.value) * Number(currencyRate)).toFixed(fixedLen),
      )}`
    }
    return (
      <text
        orientation="left"
        className="recharts-text recharts-cartesian-axis-tick-value"
        x={x}
        y={y}
        width={60}
        height={310}
        stroke="none"
        fill="#00D26B"
        textAnchor="start"
      >
        <tspan dx={0} dy="0.355em">
          {path}
        </tspan>
      </text>
    )
  }

  const renderCustomZAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = `${numberWithCommas(payload.value)}`
    }

    return (
      <text
        orientation="right"
        className="recharts-text recharts-cartesian-axis-tick-value"
        x={x}
        y={y}
        width={60}
        height={310}
        stroke="none"
        fill="#8884d8"
        textAnchor="end"
      >
        <tspan dx={0} dy="0.355em">
          {path}
        </tspan>
      </text>
    )
  }

  useEffect(() => {
    const init = async () => {
      let mainData = [],
        allMainData = [],
        firstDate,
        ago,
        slotCount = 50,
        allSlotCount = 50,
        filteredData,
        filteredSlot

      if (!connected) {
        setIsDataReady('false')
      } else if (lpTokenBalance === 0) {
        setIsDataReady('loading')
      } else if (lpTokenBalance === '0' && totalValue !== 0 && data.length === 0) {
        setIsDataReady('loading')
      } else if (lpTokenBalance === '0' && totalValue === 0 && data.length === 0) {
        setIsDataReady('false')
      } else if (totalValue !== '0' && data.length === 0) {
        setIsDataReady('loading')
      } else if (data.length !== 0) {
        setIsDataReady('true')
      }

      if ((Object.keys(data).length === 0 && data.constructor === Object) || data.length === 0) {
        return
      }

      const maxTimestamp = data[0].timestamp * 1000
      const minTimestamp = data[data.length - 1].timestamp * 1000
      const startTimestamp = denormalizeSliderValue(startPoint, minTimestamp, maxTimestamp)
      const endTimestamp = denormalizeSliderValue(endPoint, minTimestamp, maxTimestamp)
      const nowDate = new Date()
      const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)

      for (let i = data.length - 1; i >= 0; i -= 1) {
        if (data[i].value !== 0) {
          firstDate = data[i].timestamp
          break
        }
      }
      if (firstDate === undefined) {
        firstDate = data[data.length - 1].timestamp
      }
      const allPeriodDate = (currentTimeStamp - Number(firstDate)) / (24 * 60 * 60)
      const allAgo = Math.ceil(allPeriodDate)
      if (allAgo > 700) {
        allSlotCount = 500
      } else if (allAgo > 365) {
        allSlotCount = 400
      } else if (allAgo > 180) {
        allSlotCount = 300
      } else if (allAgo > 90) {
        allSlotCount = 150
      } else if (allAgo > 60) {
        allSlotCount = 100
      } else if (allAgo > 30) {
        allSlotCount = 100
      } else {
        allSlotCount = 50
      }

      if (range === 'LAST') {
        const periodDate = (currentTimeStamp - Number(lastFarmingTimeStamp)) / (24 * 60 * 60)
        ago = Math.ceil(periodDate)
        if (ago === 1) {
          setHourUnit(true)
        } else {
          setHourUnit(false)
        }
        if (ago > 700) {
          slotCount = 500
        } else if (ago > 365) {
          slotCount = 400
        } else if (ago > 180) {
          slotCount = 300
        } else if (ago > 90) {
          slotCount = 150
        } else if (ago > 60) {
          slotCount = 100
        } else if (ago > 30) {
          slotCount = 100
        }
      } else if (range === 'ALL') {
        ago = allAgo
        if (ago === 1) {
          setHourUnit(true)
        } else {
          setHourUnit(false)
        }
        slotCount = allSlotCount
      } else if (range === 'CUSTOM') {
        const periodDate = (maxTimestamp / 1000 - startTimestamp) / (24 * 60 * 60)
        ago = Math.ceil(periodDate)
        if (ago === 1) {
          setHourUnit(true)
        } else {
          setHourUnit(false)
        }
        if (ago > 700) {
          slotCount = 500
        } else if (ago > 365) {
          slotCount = 400
        } else if (ago > 180) {
          slotCount = 300
        } else if (ago > 90) {
          slotCount = 150
        } else if (ago > 60) {
          slotCount = 100
        } else if (ago > 30) {
          slotCount = 100
        } else {
          slotCount = 50
        }
      } else {
        ago = getRangeNumber(range)
        if (range === '1D') {
          setHourUnit(true)
        } else {
          setHourUnit(false)
        }
      }

      const slots = getTimeSlots(ago, slotCount)
      const allSlots = getTimeSlots(allAgo, allSlotCount)

      if (range === 'LAST') {
        filteredData = data.filter(obj => parseInt(obj.timestamp, 10) >= lastFarmingTimeStamp)
        filteredSlot = slots.filter(obj => parseInt(obj, 10) >= lastFarmingTimeStamp)
      } else if (range === 'ALL') {
        filteredData = data.filter(obj => parseInt(obj.timestamp, 10) >= firstDate)
        filteredSlot = slots.filter(obj => parseInt(obj, 10) >= firstDate)
      } else if (range === 'CUSTOM') {
        filteredData = data.filter(obj => {
          const timestamp = parseInt(obj.timestamp, 10)
          return timestamp >= startTimestamp && timestamp <= endTimestamp
        })
        filteredSlot = slots.filter(obj => {
          const timestamp = parseInt(obj, 10)
          return timestamp >= startTimestamp && timestamp <= endTimestamp
        })
      }

      const allChartData = data.filter(obj => parseInt(obj.timestamp, 10) >= firstDate)
      const allChartSlot = allSlots.filter(obj => parseInt(obj, 10) >= firstDate)
      allMainData = generateChartDataWithSlots(
        allChartSlot,
        allChartData,
        'value',
        'priceUnderlying',
        'sharePrice',
      )
      if (allMainData.length === 1) {
        const firstObject = {
          x: currentTimeStamp,
          y: allMainData[0].y,
          z: allMainData[0].z,
        }
        allMainData.unshift(firstObject)
      }

      mainData = generateChartDataWithSlots(
        range === 'LAST' || (range === 'ALL' && ago > 2) || range === 'CUSTOM'
          ? filteredSlot
          : slots,
        range === 'LAST' || (range === 'ALL' && ago > 2) || range === 'CUSTOM'
          ? filteredData
          : data,
        'value',
        'priceUnderlying',
        'sharePrice',
      )
      if (mainData.length === 1) {
        const firstObject = {
          x: currentTimeStamp,
          y: mainData[0].y,
          z: mainData[0].z,
        }
        mainData.unshift(firstObject)
      }

      const startSliderPoint = mainData[0].x
      const endSliderPoint = mainData[mainData.length - 1].x

      const maxValue = findMax(mainData)
      const minValue = findMin(mainData)
      const maxValueUnderlying = findMaxUnderlying(mainData)
      const minValueUnderlying = findMinUnderlying(mainData)

      const {
        maxValue: maxDomain,
        minValue: minDomain,
        maxValueUnderlying: maxDomainUnderlying,
        minValueUnderlying: minDomainUnderlying,
        len,
        lenUnderlying,
      } = getChartDomain(maxValue, minValue, maxValueUnderlying, minValueUnderlying)

      const maxAllValue = findMax(allMainData)
      const minAllValue = findMin(allMainData)
      const maxAllValueUnderlying = findMaxUnderlying(allMainData)
      const minAllValueUnderlying = findMinUnderlying(allMainData)

      const {
        maxValue: maxAllDomain,
        minValue: minAllDomain,
        maxValueUnderlying: maxAllDomainUnderlying,
        minValueUnderlying: minAllDomainUnderlying,
      } = getChartDomain(maxAllValue, minAllValue, maxAllValueUnderlying, minAllValueUnderlying)

      if (range !== 'CUSTOM') {
        setStartPoint(normalizeSliderValue(startSliderPoint, minTimestamp, maxTimestamp))
        setEndPoint(normalizeSliderValue(endSliderPoint, minTimestamp, maxTimestamp))
      }
      setRoundedDecimal(-len)
      setFixedLen(len)
      setRoundedDecimalUnderlying(-lenUnderlying)
      setMinVal(minDomain)
      setMaxVal(maxDomain)
      setMaxValUnderlying(maxDomainUnderlying)
      setMinValUnderlying(minDomainUnderlying)
      setMinAllVal(minAllDomain)
      setMaxAllVal(maxAllDomain)
      setMaxAllValUnderlying(maxAllDomainUnderlying)
      setMinAllValUnderlying(minAllDomainUnderlying)

      // Set date and price with latest value by default
      if (mainData.length > 0) {
        setCurDate(formatDate(mainData[mainData.length - 1].x))
        const balanceUnderlying = numberWithCommas(Number(mainData[mainData.length - 1].z))
        setCurContent(
          `${currencySym}${numberWithCommas(
            (Number(mainData[mainData.length - 1].y) * Number(currencyRate)).toFixed(fixedLen),
          )}`,
        )
        setCurContentUnderlying(balanceUnderlying)
      } else {
        console.log('The chart data is either undefined or empty.')
      }

      const yAxisAry = getYAxisValues(minDomain, maxDomain, roundedDecimal)
      setYAxisTicks(yAxisAry)

      const zAxisAry = getYAxisValues(
        minDomainUnderlying,
        maxDomainUnderlying,
        roundedDecimalUnderlying,
      )
      setZAxisTicks(zAxisAry)
      setMainSeries(mainData)
      setAllMainSeries(allMainData)

      const markPoints = calculateMarks(allMainData, isMobile)
      setMarks(markPoints)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    connected,
    range,
    data,
    isDataReady,
    lpTokenBalance,
    totalValue,
    loadComplete,
    roundedDecimal,
    setCurContent,
    setCurContentUnderlying,
    setCurDate,
    fixedLen,
    startPoint,
    endPoint,
  ])

  return (
    <>
      {isDataReady === 'true' ? (
        <>
          <ResponsiveContainer
            width="100%"
            height={
              onlyWidth > 1291
                ? 346
                : onlyWidth > 1262
                ? 365
                : onlyWidth > 1035
                ? 365
                : onlyWidth > 992
                ? 365
                : 365
            }
          >
            <ComposedChart
              data={mainSeries}
              margin={{
                top: 20,
                right: 0,
                bottom: 0,
                left: roundedDecimal === 3 ? -14 : 0,
              }}
            >
              <defs>
                <linearGradient id="colorUvPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D26B" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0"
                strokeLinecap="butt"
                stroke="rgba(228, 228, 228, 0.2)"
                vertical={false}
              />
              <Line
                dataKey="y"
                type="monotone"
                unit="$"
                strokeLinecap="round"
                strokeWidth={2}
                stroke="#00D26B"
                dot={false}
                legendType="none"
                yAxisId="left"
              />
              <Line
                dataKey="z"
                type="monotone"
                strokeLinecap="round"
                strokeWidth={2}
                stroke="#8884d8"
                dot={false}
                legendType="none"
                yAxisId="right"
              />
              <XAxis dataKey="x" tickLine={false} tickCount={5} tick={renderCustomXAxisTick} />
              <YAxis
                dataKey="y"
                tickCount={5}
                tick={renderCustomYAxisTick}
                ticks={yAxisTicks}
                domain={[minVal, maxVal]}
                stroke="#00D26B"
                yAxisId="left"
                orientation="left"
                mirror
              />
              <YAxis
                dataKey="z"
                tickCount={5}
                tick={renderCustomZAxisTick}
                ticks={zAxisTicks}
                domain={[minValUnderlying, maxValUnderlying]}
                stroke="#8884d8"
                yAxisId="right"
                orientation="right"
                mirror
              />
              <Tooltip
                content={<CustomTooltip onTooltipContentChange={handleTooltipContent} />}
                cursor={{
                  stroke: '#00D26B',
                  strokeDasharray: 3,
                  strokeLinecap: 'butt',
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={50}>
            <ComposedChart data={allMainSeries} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorUvSmallChart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D26B" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Line
                dataKey="y"
                type="monotone"
                unit="$"
                strokeLinecap="round"
                strokeWidth={1}
                stroke="#00D26B"
                dot={false}
                legendType="none"
                yAxisId="left"
              />
              <Line
                dataKey="z"
                type="monotone"
                strokeLinecap="round"
                strokeWidth={1}
                stroke="#8884d8"
                dot={false}
                legendType="none"
                yAxisId="right"
              />
              <YAxis
                dataKey="y"
                tickCount={0}
                domain={[minAllVal, maxAllVal]}
                stroke="#00D26B"
                yAxisId="left"
                orientation="left"
                mirror
              />
              <YAxis
                dataKey="z"
                tickCount={0}
                domain={[minAllValUnderlying, maxAllValUnderlying]}
                stroke="#8884d8"
                yAxisId="right"
                orientation="right"
                mirror
              />
            </ComposedChart>
          </ResponsiveContainer>
        </>
      ) : (
        <LoadingDiv>
          {isDataReady === 'loading' ? (
            <ClipLoader size={30} margin={2} color={fontColor} />
          ) : (
            <>
              {connected ? (
                <NoData color={fontColor}>
                  No activity found for this wallet. Convert any token to start farming!
                </NoData>
              ) : (
                <NoData color={fontColor}>Connect wallet to see your balance chart</NoData>
              )}
              <FakeChartWrapper>
                <ResponsiveContainer
                  width="100%"
                  height={
                    onlyWidth > 1291
                      ? 346
                      : onlyWidth > 1262
                      ? 365
                      : onlyWidth > 1035
                      ? 365
                      : onlyWidth > 992
                      ? 365
                      : 365
                  }
                >
                  <ComposedChart
                    data={fakeChartData}
                    margin={{
                      top: 20,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorUvPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D26B" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="0"
                      strokeLinecap="butt"
                      stroke="rgba(228, 228, 228, 0.2)"
                      vertical={false}
                    />
                    <Line
                      dataKey="y"
                      type="monotone"
                      unit="$"
                      strokeLinecap="round"
                      strokeWidth={2}
                      stroke="#00D26B"
                      dot={false}
                      legendType="none"
                      yAxisId="left"
                    />
                    <Line
                      dataKey="z"
                      type="monotone"
                      strokeLinecap="round"
                      strokeWidth={2}
                      stroke="#8884d8"
                      dot={false}
                      legendType="none"
                      yAxisId="right"
                    />
                    <XAxis
                      dataKey="x"
                      tickLine={false}
                      tickCount={5}
                      tick={renderCustomXAxisTick}
                    />
                    <YAxis
                      dataKey="y"
                      tickCount={5}
                      stroke="#00D26B"
                      yAxisId="left"
                      orientation="left"
                      mirror
                    />
                    <YAxis
                      dataKey="z"
                      tickCount={5}
                      yAxisId="right"
                      orientation="right"
                      stroke="#8884d8"
                      mirror
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </FakeChartWrapper>
            </>
          )}
        </LoadingDiv>
      )}
    </>
  )
}

export default ApexChart
