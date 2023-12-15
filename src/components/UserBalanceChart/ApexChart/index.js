import React, { useEffect, useState } from 'react'
import {
  ComposedChart,
  XAxis,
  YAxis,
  Line,
  Area,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useWindowWidth } from '@react-hook/window-size'
import { ClipLoader } from 'react-spinners'
import { useThemeContext } from '../../../providers/useThemeContext'
import { ceil10, floor10, round10, numberWithCommas } from '../../../utils'
import { LoadingDiv, NoData } from './style'
import { fromWei } from '../../../services/web3'

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

function getRangeNumber(strRange) {
  let ago = 30
  if (strRange === '1D') {
    ago = 1
  } else if (strRange === '1W') {
    ago = 7
  } else if (strRange === '1M') {
    ago = 30
  } else if (strRange === '1Y') {
    ago = 365
  }

  return ago
}

function getTimeSlots(ago, slotCount) {
  const slots = [],
    nowDate = new Date(),
    toDate = Math.floor(nowDate.getTime() / 1000),
    fromDate = Math.floor(nowDate.setDate(nowDate.getDate() - ago) / 1000),
    between = (toDate - fromDate) / slotCount
  for (let i = fromDate + between; i <= toDate; i += between) {
    slots.push(i)
  }

  return slots
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
function generateChartDataWithSlots(
  slots,
  apiData,
  decimals,
  filter,
  balance,
  priceUnderlying,
  sharePrice,
) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    for (let j = 0; j < apiData.length; j += 1) {
      if (slots[i] > parseInt(apiData[j].timestamp, 10)) {
        const value1 = parseFloat(apiData[j][balance])
        const value2 = parseFloat(apiData[j][priceUnderlying])
        const value3 = fromWei(parseFloat(apiData[j][sharePrice]), decimals)
        if (filter === 0) {
          seriesData.push({ x: slots[i] * 1000, y: value1 * value2 * value3 })
        } else if (filter === 1) {
          seriesData.push({ x: slots[i] * 1000, y: value1 * value3 })
        }
        break
      } else if (j === apiData.length - 1) {
        seriesData.push({ x: slots[i] * 1000, y: 0 })
      }
    }
  }

  return seriesData
}

function formatXAxis(value, range) {
  const date = new Date(value)

  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const mins = date.getMinutes()

  return range === '1D' ? `${hour}:${mins}` : `${month} / ${day}`
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

const ApexChart = ({ token, data, loadComplete, range, filter, setCurDate, setCurContent }) => {
  const { fontColor } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([])

  const onlyWidth = useWindowWidth()

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)
  const [roundedDecimal, setRoundedDecimal] = useState(2)
  const [fixedLen, setFixedLen] = useState(0)

  // const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentDate = formatDateTime(payload[0].payload.x)
      const balance = numberWithCommas(Number(payload[0].payload.y).toFixed(fixedLen))
      setCurDate(currentDate)
      setCurContent(balance)
    }

    return null
  }

  const renderCustomXAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = formatXAxis(payload.value, range)
    }
    return (
      <text
        orientation="bottom"
        x={x - 12}
        y={y + 4}
        width={24}
        height={24}
        viewBox="0 0 1024 1024"
        fill="#000"
      >
        <tspan dy="0.71em">{path}</tspan>
      </text>
    )
  }

  const renderCustomYAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = `${filter === 0 ? '$' : ''}${numberWithCommas(payload.value)}`
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
        fill="#000"
        textAnchor="end"
      >
        <tspan dx={0} dy="0.355em">
          {path}
        </tspan>
      </text>
    )
  }

  const [minVal, setMinVal] = useState(0)
  const [maxVal, setMaxVal] = useState(0)
  const [yAxisTicks, setYAxisTicks] = useState([])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      if (data === undefined) {
        setIsDataReady(false)
        return
      }

      let mainData = [],
        maxValue,
        minValue,
        len = 0,
        unitBtw

      if ((data && data.length === 0) || !loadComplete) {
        setIsDataReady(false)
        return
      }

      if ((Object.keys(data).length === 0 && data.constructor === Object) || data.length === 0) {
        return
      }
      const slotCount = 50,
        ago = getRangeNumber(range),
        slots = getTimeSlots(ago, slotCount)
      mainData = generateChartDataWithSlots(
        slots,
        data,
        token.decimals || token.data.watchAsset.decimals,
        filter,
        'value',
        'priceUnderlying',
        'sharePrice',
      )
      maxValue = findMax(mainData)
      minValue = findMin(mainData)
      minValue /= 2

      const between = maxValue - minValue
      unitBtw = between / 4
      if (unitBtw >= 1) {
        unitBtw = Math.ceil(unitBtw)
        len = unitBtw.toString().length
        unitBtw = ceil10(unitBtw, len - 1)
        maxValue = ceil10(maxValue, len - 1)
        minValue = floor10(minValue, len - 1)
      } else if (unitBtw === 0) {
        len = Math.ceil(maxValue).toString().length
        maxValue += 10 ** (len - 1)
        minValue -= 10 ** (len - 1)
      } else {
        len = Math.ceil(1 / unitBtw).toString().length + 1
        unitBtw = ceil10(unitBtw, -len)
        maxValue = ceil10(maxValue, -len)
        minValue = floor10(minValue, -len + 1)
      }

      if (unitBtw !== 0) {
        maxValue *= 1.5
        minValue = 0
      } else {
        unitBtw = (maxValue - minValue) / 4
      }

      // if (unitBtw === 0) {
      //   roundNum = 0
      // } else {
      //   roundNum = len
      // }
      setRoundedDecimal(-len)
      setFixedLen(len)
      setMinVal(minValue)
      setMaxVal(maxValue)

      // Set date and price with latest value by default
      setCurDate(formatDateTime(mainData[slotCount - 1].x))
      const balance = numberWithCommas(Number(mainData[slotCount - 1].y).toFixed(fixedLen))
      setCurContent(balance)

      const yAxisAry = getYAxisValues(minValue, maxValue, roundedDecimal)
      setYAxisTicks(yAxisAry)

      setMainSeries(mainData)

      setLoading(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    range,
    data,
    token.decimals,
    isDataReady,
    loadComplete,
    filter,
    roundedDecimal,
    setCurContent,
    setCurDate,
    fixedLen,
  ])

  return (
    <>
      {!loading ? (
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
            <XAxis dataKey="x" tickLine={false} tickCount={5} tick={renderCustomXAxisTick} />
            <YAxis
              dataKey="y"
              tickLine={false}
              tickCount={5}
              tick={renderCustomYAxisTick}
              ticks={yAxisTicks}
              domain={[minVal, maxVal]}
            />
            <Line
              dataKey="y"
              type="monotone"
              unit="M"
              strokeLinecap="round"
              strokeWidth={2}
              stroke="#00D26B"
              dot={false}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke="#00D26B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUvPrice)"
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{
                stroke: '#00D26B',
                strokeDasharray: 3,
                strokeLinecap: 'butt',
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <LoadingDiv>
          {isDataReady ? (
            <ClipLoader size={30} margin={2} color={fontColor} />
          ) : (
            <NoData color={fontColor}>
              You don&apos;t have any fTokens of this farm. <br />
              Or, if you just converted tokens, it might take up to 5mins for the chart to appear.
            </NoData>
          )}
        </LoadingDiv>
      )}
    </>
  )
}

export default ApexChart
