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
import { ClipLoader } from 'react-spinners'
import { useWindowWidth } from '@react-hook/window-size'
import { useThemeContext } from '../../../providers/useThemeContext'
import { ceil10, floor10, round10, numberWithCommas } from '../../../utils'
import { LoadingDiv, NoData } from './style'

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
function generateChartDataWithSlots(slots, apiData, kind) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    for (let j = 0; j < apiData.length; j += 1) {
      if (slots[i] > parseInt(apiData[j].timestamp, 10)) {
        const value = parseFloat(apiData[j][kind])
        seriesData.push({ x: slots[i] * 1000, y: value })
        break
      } else if (j === apiData.length - 1) {
        seriesData.push({ x: slots[i] * 1000, y: 0 })
      }
    }
  }

  return seriesData
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

function generateIFARMTVLWithSlots(slots, apiData) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    const data = apiData.FARM.reduce((prev, curr) =>
      Math.abs(Number(curr.timestamp) - slots[i]) < Math.abs(Number(prev.timestamp) - slots[i])
        ? curr
        : prev,
    )

    seriesData.push({ x: slots[i] * 1000, y: Number(data.value) })
  }

  return seriesData
}

const ApexChart = ({
  data,
  iFarmTVL,
  isIFARM,
  range,
  filter,
  lastTVL,
  lastAPY,
  setCurDate,
  setCurContent,
}) => {
  const { fontColor } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([])

  const onlyWidth = useWindowWidth()

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)

  const [fixedLen, setFixedLen] = useState(0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      setCurDate(formatDateTime(payload[0].payload.x))
      const content = `<div style="font-size: 13px; display: flex;"><div style="color: #1b1b1b; font-weight: 700;">${
        filter === 1 ? 'TVL ' : filter === 0 ? 'APY ' : 'Balance '
      }</div><div style="color: #5B5181; font-weight: 500;">&nbsp;${
        filter === 1 ? '$' : ''
      }${numberWithCommas(Number(payload[0].payload.y.toFixed(filter === 1 ? 0 : fixedLen)))}${
        filter === 0 ? '%' : ''
      }</div></div>`
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
        fill="#000"
      >
        <tspan dy="0.71em">{path}</tspan>
      </text>
    )
  }

  const renderCustomYAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = `${filter === 1 ? '$' : ''}${numberWithCommas(payload.value)} ${
        filter === 0 ? '%' : ''
      }`
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
      const ago = getRangeNumber(range)

      let mainData = [],
        tvlData = [],
        apyData = [],
        userBalanceData = [],
        maxAPY = lastAPY,
        minAPY,
        maxTVL = lastTVL,
        minTVL,
        maxBalance,
        minBalance,
        maxValue,
        minValue,
        len = 0,
        unitBtw,
        roundNum

      if (filter === 1) {
        if (isIFARM) {
          if (iFarmTVL && iFarmTVL.FARM) {
            if (iFarmTVL.FARM.length === 0) {
              setIsDataReady(false)
              return
            }
          } else {
            return
          }
        } else {
          if (data && data.tvls) {
            if (data.tvls.length === 0) {
              setIsDataReady(false)
              return
            }
          }
          tvlData = data && data.tvls ? data.tvls : []
          if (tvlData.length !== 0 && lastTVL && !Number.isNaN(lastTVL)) tvlData[0].value = lastTVL
        }
      } else if (filter === 0) {
        if (data && data.generalApies) {
          if (data.generalApies.length === 0) {
            setIsDataReady(false)
            return
          }
        }
        apyData = data.generalApies !== undefined ? data.generalApies : []

        if (lastAPY && !Number.isNaN(lastAPY) && apyData.length > 0) apyData[0].apy = lastAPY
      } else {
        if (data && data.userBalanceHistories) {
          if (data.userBalanceHistories.length === 0) {
            setIsDataReady(false)
            return
          }
        }
        userBalanceData = data && data.userBalanceHistories ? data.userBalanceHistories : []
      }

      const slotCount = 50,
        slots = getTimeSlots(ago, slotCount)

      if (filter === 1) {
        if (isIFARM) {
          if (iFarmTVL.length === 0) {
            return
          }
          mainData = generateIFARMTVLWithSlots(slots, iFarmTVL, 'value')
        } else {
          if (tvlData.length === 0) {
            // setIsDataReady(false)
            return
          }
          mainData = generateChartDataWithSlots(slots, tvlData, 'value')
        }
        maxTVL = findMax(mainData)
        minTVL = findMin(mainData)
      } else if (filter === 0) {
        if (apyData.length === 0) {
          setIsDataReady(false)
          return
        }
        mainData = generateChartDataWithSlots(slots, apyData, 'apy')
        maxAPY = findMax(mainData)
        minAPY = findMin(mainData)
      } else {
        if (userBalanceData.length === 0) {
          return
        }
        mainData = generateChartDataWithSlots(slots, userBalanceData, 'value')
        maxBalance = findMax(mainData)
        minBalance = findMin(mainData)
        minBalance /= 2
      }

      maxValue = filter === 0 ? maxAPY : filter === 1 ? maxTVL : maxBalance
      minValue = filter === 0 ? minAPY : filter === 1 ? minTVL : minBalance

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
      /**
       * Set min value with 0, and max value *1.5 - trello card
       */
      if (unitBtw !== 0) {
        maxValue *= 1.5
        minValue = 0
      } else {
        unitBtw = (maxValue - minValue) / 4
      }

      if (filter === 1) {
        if (unitBtw === 0) {
          roundNum = 0
        } else {
          roundNum = len - 2
        }
      } else {
        roundNum = -len
      }
      setMinVal(minValue)
      setMaxVal(maxValue)

      const yAxisAry = getYAxisValues(minValue, maxValue, roundNum)
      setYAxisTicks(yAxisAry)

      setFixedLen(filter === 1 ? 0 : len)

      setMainSeries(mainData)

      setLoading(false)
    }

    init()
  }, [range, filter, data, lastTVL, lastAPY, isIFARM, iFarmTVL])

  return (
    <>
      {!loading ? (
        <ResponsiveContainer
          width="100%"
          height={onlyWidth > 1250 ? 380 : onlyWidth > 1050 ? 350 : 330}
        >
          <ComposedChart
            data={mainSeries}
            margin={{
              top: 20,
              right: 0,
              bottom: 0,
              left: -12,
            }}
          >
            <defs>
              <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B5181" stopOpacity={0.1} />
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
              strokeWidth={2.5}
              stroke="#5B5181"
              dot={false}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke="#5B5181"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUv1)"
            />
            <Tooltip
              content={CustomTooltip}
              legendType="none"
              dot={false}
              cursor={{
                stroke: '#5B5181',
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
