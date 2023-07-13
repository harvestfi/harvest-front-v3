import React, { useEffect, useState } from 'react'
import { ComposedChart, XAxis, YAxis, Line, Area, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { ClipLoader } from 'react-spinners'
import { useWindowWidth } from '@react-hook/window-size'
import { useThemeContext } from '../../providers/useThemeContext'
import { ceil10, floor10, round10 } from '../../utils'
import { LoadingDiv, NoData } from './style'

function numberWithCommas(x) {
  if (x < 1000) return x
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
function generateChartDataWithSlots(slots, apiData, kind) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    for (let j = 0; j < apiData.length; j += 1) {
      if (slots[i] > parseInt(apiData[j].timestamp, 10)) {
        const value = parseFloat(apiData[j][kind])
        seriesData.push({x: slots[i] * 1000, y: value})
        break
      } else if (j === apiData.length - 1) {
        seriesData.push({x: slots[i] * 1000, y: 0})
      }
    }
  }

  return seriesData
}

function generateChartDataForApy(apyData1, apyData2, field) {
  apyData1 = apyData1.map(function reducer(x) {
    return [x.timestamp, Number(x[field]), 1]
  })
  apyData2 = apyData2.map(function reducer(x) {
    return [x.timestamp, Number(x[field]), 2]
  })

  let apyData = apyData1.concat(apyData2)
  apyData = apyData.sort(function reducer(a, b) {
    return b[0] - a[0]
  })

  if (apyData.length > 1) {
    for (let i = 0; i < apyData.length; i += 1) {
      if (i === 0) {
        if (apyData[i][2] !== apyData[i + 1][2]) apyData[i][1] += apyData[i + 1][1]
      } else if (i === apyData.length - 1) {
        if (apyData[i][2] !== apyData[i - 1][2]) {
          apyData[i][1] += apyData[i - 1][1]
        }
      } else if (apyData[i][2] !== apyData[i + 1][2]) {
        if (apyData[i][2] !== apyData[i - 1][2]) {
          if (
            Math.abs(apyData[i][1] - apyData[i - 1][1]) <=
            Math.abs(apyData[i][1] - apyData[i + 1][1])
          )
            apyData[i][1] += apyData[i - 1][1]
          else apyData[i][1] += apyData[i + 1][1]
        } else {
          apyData[i][1] += apyData[i + 1][1]
        }
      } else if (apyData[i][2] !== apyData[i - 1][2]) {
        apyData[i][1] += apyData[i - 1][1]
      }
    }
  }

  apyData = apyData.map(function reducer(x) {
    const d = 1 / x[1]
    if (d > 1) {
      const len = Math.ceil(d).toString().length + 1
      x[1] = x[1].toFixed(len)
    }
    const obj = {}
    obj.timestamp = x[0]
    obj[field] = x[1]
    return obj
  })

  return apyData
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

    seriesData.push([slots[i] * 1000, Number(data.value)])
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
  const { darkMode, backColor, fontColor } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([
    {
      name: 'TVL m$',
      data: [],
    },
  ])

  const onlyWidth = useWindowWidth()

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)

  const [fixedLen, setFixedLen] = useState(0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      setCurDate(formatDateTime(payload[0].payload.x))
      const content = `<div style="font-size: 13px; line-height: 16px; display: flex;"><div style="font-weight: 700;">${
        filter === 1 ? 'TVL ' : filter === 0 ? 'APY ' : 'Balance '
      }</div><div style="color: #ff9400; font-weight: 500;">&nbsp;${
        filter === 1 ? '$' : ''
      }${numberWithCommas(Number(payload[0].payload.y.toFixed(filter === 1 ? 0 : fixedLen)))}${
        filter === 0 ? '%' : ''
      }</div></div>`
      setCurContent(content)
    }
  
    return null
  }

  const renderCustomAxisTick = ({ x, y, payload }) => {
    let path = ''
  
    if (payload.value !== '') {
      path = formatXAxis(payload.value, range)
    }
    return (
      <text orientation={"bottom"} x={x - 12} y={y + 4} width={24} height={24} viewBox="0 0 1024 1024" fill="#666">
        <tspan dy="0.71em">{path}</tspan>
      </text>
    );
  };

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
        if (data && (data.apyAutoCompounds || data.apyRewards)) {
          if (data.apyAutoCompounds.length === 0 && data.apyRewards.length === 0) {
            setIsDataReady(false)
            return
          }
        }
        const apyAutoCompounds = data.apyAutoCompounds !== undefined ? data.apyAutoCompounds : [],
          apyRewards = data.apyRewards !== undefined ? data.apyRewards : []

        apyData = generateChartDataForApy(apyAutoCompounds, apyRewards, 'apy')

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
  }, [
    backColor,
    range,
    filter,
    data,
    lastTVL,
    lastAPY,
    darkMode,
    setCurDate,
    setCurContent,
    isIFARM,
    iFarmTVL,
  ])

  return (
    <>
      {!loading ? (
        // <Chart options={options} series={mainSeries} type="area" height="100%" />
        <ResponsiveContainer width="100%" height={onlyWidth > 1250 ? 380 : onlyWidth > 992 ? 350 : 330}>
          <ComposedChart
            data={mainSeries}
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4BE37" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" strokeLinecap='butt' stroke="rgba(228, 228, 228, 0.2)" vertical={false} />
            <XAxis dataKey="x" tickCount={5} tick={renderCustomAxisTick} />
            <YAxis dataKey="y" tickCount={5} ticks={yAxisTicks} domain={[minVal, maxVal]} />
            <Line dataKey="y" type="monotone" unit="M" strokeLinecap="round" strokeWidth={2}
              stroke="#FF9400"
              dot={false}
              legendType="none" />
            <Area type="monotone" dataKey="y" stroke={false} strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
            <Tooltip content={CustomTooltip} legendType="none" dot={false} />
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
