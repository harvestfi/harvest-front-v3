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
import { ceil10, floor10, round10 } from '../../../utils'
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

  return `${month} ${day} ${year}`
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

// kind: "value" - TVL, "apy" - APY
function generateChartDataWithSlots(slots, apiData) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    const ethData = apiData.ETH.reduce((prev, curr) =>
      Math.abs(Number(curr.timestamp) - slots[i]) < Math.abs(Number(prev.timestamp) - slots[i])
        ? curr
        : prev,
    )

    const polygonData = apiData.MATIC.reduce((prev, curr) =>
      Math.abs(Number(curr.timestamp) - slots[i]) < Math.abs(Number(prev.timestamp) - slots[i])
        ? curr
        : prev,
    )

    const arbData = apiData.ARBITRUM.reduce((prev, curr) =>
      Math.abs(Number(curr.timestamp) - slots[i]) < Math.abs(Number(prev.timestamp) - slots[i])
        ? curr
        : prev,
    )

    const value = Number(ethData.value) + Number(polygonData.value) + Number(arbData.value)
    seriesData.push({ x: slots[i] * 1000, y: value })
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
  const duration = max - min
  const ary = []
  for (let i = min; i <= max; i += duration / 4) {
    const val = round10(i, roundNum)
    ary.push(val)
  }
  return ary
}

const ApexChart = ({ data, range, setCurDate, setCurContent }) => {
  const { fontColor } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([])

  const onlyWidth = useWindowWidth()

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      setCurDate(formatDateTime(payload[0].payload.x))
      const content = `<div style="font-size: 13px; line-height: 16px; display: flex;"><div style="font-weight: 700;">TVL
      </div><div style="color: #ff9400; font-weight: 500;">&nbsp;$
      ${numberWithCommas(Number(payload[0].payload.y.toFixed(0)))}</div></div>`
      setCurContent(content)
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
        fill="#666"
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
        fill="#666"
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
      const ago = getRangeNumber(range)

      let mainData = [],
        maxValue,
        minValue,
        len = 0,
        unitBtw,
        roundNum

      if (data && data.ETH && data.MATIC && data.ARBITRUM) {
        if (data.ETH.length === 0 && data.MATIC.length === 0 && data.ARBITRUM.length === 0) {
          setIsDataReady(false)
          return
        }
      }

      const slotCount = 50,
        slots = getTimeSlots(ago, slotCount)

      if (data.length === 0) {
        return
      }
      mainData = generateChartDataWithSlots(slots, data, 'value')
      maxValue = findMax(mainData)
      minValue = findMin(mainData)

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

      if (unitBtw === 0) {
        roundNum = 0
      } else {
        roundNum = len - 2
      }

      setMinVal(minValue)
      setMaxVal(maxValue)

      const yAxisAry = getYAxisValues(minValue, maxValue, roundNum)
      setYAxisTicks(yAxisAry)

      setMainSeries(mainData)

      setLoading(false)
    }

    init()
  }, [range, data, isDataReady])

  return (
    <>
      {!loading ? (
        <ResponsiveContainer
          width="100%"
          height={onlyWidth > 1250 ? 380 : onlyWidth > 992 ? 350 : 330}
        >
          <ComposedChart
            data={mainSeries}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4BE37" stopOpacity={0.1} />
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
              stroke="#FF9400"
              dot={false}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke="false"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{
                stroke: '#FF9400',
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
