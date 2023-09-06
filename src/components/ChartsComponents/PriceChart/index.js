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
import { ceil10, floor10 } from '../../../utils'
import { LoadingDiv, NoData } from './style'

function numberWithCommas(x) {
  if (x < 1000) return x
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

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

function generateChartDataWithSlots(slots, apiData) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    const data = apiData.reduce((prev, curr) =>
      Math.abs(Number(curr.timestamp) - slots[i]) < Math.abs(Number(prev.timestamp) - slots[i])
        ? curr
        : prev,
    )

    seriesData.push({ x: slots[i] * 1000, y: data.sharePrice })
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
  const ary = [],
    result = []
  const bet = Number(max - min)
  for (let i = min; i <= max; i += bet / 4) {
    const val = i
    ary.push(val)
  }

  for (let j = 0; j < ary.length; j += 1) {
    const val = ary[j].toFixed(roundNum)
    result.push(val)
  }

  return result
}

const ApexChart = ({ data, loadComplete, range, setCurDate, setCurContent }) => {
  const { fontColor } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([])

  const onlyWidth = useWindowWidth()

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)
  const [roundedDecimal, setRoundedDecimal] = useState(2)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      setCurDate(formatDateTime(payload[0].payload.x))
      const price = numberWithCommas(Number(payload[0].payload.y).toFixed(roundedDecimal))
      setCurContent(`$${price}`)
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
      path = `$${numberWithCommas(payload.value)}`
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
        unitBtw,
        roundNum

      if ((data && data.length === 0) || !loadComplete) {
        setIsDataReady(false)
        return
      }

      if ((Object.keys(data).length === 0 && data.constructor === Object) || data.length === 0) {
        return
      }
      const slotCount = 50,
        // Remove range. Set default for all data.
        ago = getRangeNumber(range),
        slots = getTimeSlots(ago, slotCount)
      mainData = generateChartDataWithSlots(slots, data)
      maxValue = findMax(mainData)
      minValue = findMin(mainData)

      const between = maxValue - minValue
      unitBtw = between / 4
      if (unitBtw >= 1) {
        len = (1 / unitBtw).toString().length
        // unitBtw = ceil10(unitBtw, -len)
        maxValue = ceil10(maxValue, -len)
        minValue = floor10(minValue, -len)
      } else if (unitBtw === 0) {
        len = (1 / maxValue).toString().length
        maxValue += 1
        minValue -= 1
      } else {
        len = (1 / unitBtw).toString().length
        // unitBtw = ceil10(between, -len)
        maxValue = ceil10(maxValue, -len)
        minValue = floor10(minValue, -len + 1)
      }

      if (unitBtw === 0) {
        unitBtw = (maxValue - minValue) / 4
      } else {
        const rate = Number((unitBtw / maxValue).toFixed(2)) + 1
        maxValue *= rate
        maxValue = ceil10(maxValue, -len)
      }

      if (unitBtw === 0) {
        roundNum = 0
      } else {
        roundNum = len
      }
      setRoundedDecimal(roundNum > 3 ? 3 : roundNum)
      setMinVal(minValue)
      setMaxVal(maxValue)

      // Set date and price with latest value by default
      setCurDate(formatDateTime(mainData[slotCount - 1].x))
      const price = numberWithCommas(Number(mainData[slotCount - 1].y).toFixed(roundedDecimal))
      setCurContent(`$${price}`)

      const yAxisAry = getYAxisValues(minValue, maxValue, roundedDecimal)
      setYAxisTicks(yAxisAry)

      setMainSeries(mainData)

      setLoading(false)
    }

    init()
  }, [range, data, isDataReady, loadComplete, roundedDecimal, setCurContent, setCurDate])

  return (
    <>
      {!loading ? (
        <ResponsiveContainer
          width="100%"
          height={
            onlyWidth > 1291
              ? 335
              : onlyWidth > 1262
              ? 353
              : onlyWidth > 1035
              ? 373
              : onlyWidth > 992
              ? 393
              : 300
          }
        >
          <ComposedChart
            data={mainSeries}
            margin={{
              top: 20,
              right: 0,
              bottom: 0,
              left: -14,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#colorUv)"
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
            <NoData color={fontColor}>You don&apos;t have any active deposits in this farm.</NoData>
          )}
        </LoadingDiv>
      )}
    </>
  )
}

export default ApexChart
