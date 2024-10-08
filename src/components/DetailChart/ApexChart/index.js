import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
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
import { round } from 'lodash'
import { ClipLoader } from 'react-spinners'
import { useWindowWidth } from '@react-hook/window-size'
import { useThemeContext } from '../../../providers/useThemeContext'
import { ceil10, floor10, round10, numberWithCommas, formatDate } from '../../../utilities/formats'
import { findMax, findMin, getRangeNumber, getTimeSlots } from '../../../utilities/parsers'
import { LoadingDiv, NoData } from './style'
import { fromWei } from '../../../services/web3'
import { useRate } from '../../../providers/Rate'

function generateChartDataWithSlots(slots, apiData, kind, filter, decimals) {
  const seriesData = [],
    sl = slots.length,
    al = apiData.length

  for (let i = 0; i < sl; i += 1) {
    for (let j = 0; j < al; j += 1) {
      if (slots[i] > parseInt(apiData[j].timestamp, 10)) {
        const value = parseFloat(apiData[j][kind])
        if (filter === 2) {
          seriesData.push({ x: slots[i] * 1000, y: fromWei(value, decimals, decimals, true) })
        } else {
          seriesData.push({ x: slots[i] * 1000, y: value })
        }
        break
      } else if (j === al - 1) {
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

function getYAxisValues(min, max, roundNum, filter) {
  const duration = max - min
  const result = []
  if (filter === 2) {
    const ary = []
    const bet = Number(max - min)
    for (let i = min; i <= max; i += bet / 4) {
      ary.push(i)
    }
    if (ary.length === 4) {
      ary.push(max)
    }

    for (let j = 0; j < ary.length; j += 1) {
      const val = ary[j].toFixed(roundNum)
      result.push(val)
    }
  } else if (filter === 1) {
    for (let i = min; i <= max; i += duration / 4) {
      const val = round(i, 2)
      result.push(val)
    }
  } else {
    for (let i = min; i <= max; i += duration / 4) {
      const val = round10(i, roundNum)
      result.push(val)
    }
  }
  return result
}

function generateIFARMTVLWithSlots(slots, apiData) {
  const seriesData = [],
    sl = slots.length

  for (let i = 0; i < sl; i += 1) {
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
  token,
  data,
  iFarmTVL,
  isIFARM,
  range,
  filter,
  lastTVL,
  lastAPY,
  setCurDate,
  setCurContent,
  setRoundNumber,
  handleTooltipContent,
  setFixedLen,
  fixedLen,
}) => {
  const { fontColor, fontColor5 } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([])

  const onlyWidth = useWindowWidth()

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

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
        fill={fontColor5}
      >
        <tspan dy="0.71em">{path}</tspan>
      </text>
    )
  }

  const renderCustomYAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = `${filter === 1 ? currencySym : ''}${
        filter === 1
          ? numberWithCommas((Number(payload.value) * Number(currencyRate)).toFixed(0))
          : payload.value
      } ${filter === 0 ? '%' : ''}`
    }
    return (
      <text
        orientation="left"
        className="recharts-text recharts-cartesian-axis-tick-value"
        x={isMobile ? (path.length > 8 ? x + 10 : x) : path.length > 8 ? x + 10 : x}
        y={y}
        width={60}
        height={310}
        stroke="none"
        fill={fontColor5}
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
        tvlData = [],
        apyData = [],
        userPriceFeedData = [],
        maxAPY = lastAPY,
        minAPY,
        maxTVL = lastTVL,
        minTVL,
        maxSharePrice,
        minSharePrice,
        maxValue,
        minValue,
        len = 0,
        unitBtw,
        roundNum,
        firstDate,
        slotCount = 100,
        ago

      if (range === 'ALL' || range === '1Y') {
        if (filter === 0) {
          firstDate =
            data?.generalApies?.length > 0
              ? data.generalApies[data.generalApies.length - 1]?.timestamp
              : null
        } else if (filter === 1) {
          firstDate = data?.tvls?.length > 0 ? data.tvls[data.tvls.length - 1]?.timestamp : null
        } else {
          firstDate =
            data?.vaultHistories?.length > 0
              ? data.vaultHistories[data.vaultHistories.length - 1]?.timestamp
              : null
        }

        const nowDate = new Date(),
          toDate = Math.floor(nowDate.getTime() / 1000),
          periodDate = (toDate - Number(firstDate)) / (24 * 60 * 60)

        if (range === '1Y' && periodDate > 365) {
          ago = getRangeNumber(range)
        } else {
          ago = Math.ceil(periodDate)
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
      }

      const slots = getTimeSlots(ago, slotCount)

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
        if (data && data.vaultHistories) {
          if (data.vaultHistories.length === 0) {
            setIsDataReady(false)
            return
          }
        }
        userPriceFeedData = data && data.vaultHistories ? data.vaultHistories : []
      }

      if (filter === 1) {
        if (isIFARM) {
          if (iFarmTVL.length === 0) {
            return
          }
          const filteredSlots = slots.filter(
            timestamp => timestamp > Number(iFarmTVL[iFarmTVL.length - 1].timestamp),
          )
          mainData = generateIFARMTVLWithSlots(filteredSlots, iFarmTVL, 'value')
        } else {
          if (tvlData.length === 0) {
            // setIsDataReady(false)
            return
          }
          const filteredSlots = slots.filter(
            timestamp => timestamp > Number(tvlData[tvlData.length - 1].timestamp),
          )
          mainData = generateChartDataWithSlots(
            filteredSlots,
            tvlData,
            'value',
            filter,
            token.decimals || token.data.watchAsset.decimals,
          )
        }
        maxTVL = findMax(mainData)
        minTVL = findMin(mainData)
      } else if (filter === 0) {
        if (apyData.length === 0) {
          setIsDataReady(false)
          return
        }
        const filteredSlots = slots.filter(
          timestamp => timestamp > Number(apyData[apyData.length - 1].timestamp),
        )
        mainData = generateChartDataWithSlots(
          filteredSlots,
          apyData,
          'apy',
          filter,
          token.decimals || token.data.watchAsset.decimals,
        )
        maxAPY = findMax(mainData)
        minAPY = findMin(mainData)
      } else {
        if (userPriceFeedData.length === 0) {
          return
        }
        const filteredSlots = slots.filter(
          timestamp =>
            timestamp > Number(userPriceFeedData[userPriceFeedData.length - 1].timestamp),
        )
        mainData = generateChartDataWithSlots(
          filteredSlots,
          userPriceFeedData,
          'sharePrice',
          filter,
          token.decimals || token.data.watchAsset.decimals,
        )
        maxSharePrice = findMax(mainData)
        minSharePrice = findMin(mainData)
      }

      maxValue = filter === 0 ? maxAPY : filter === 1 ? maxTVL : maxSharePrice
      minValue = filter === 0 ? minAPY : filter === 1 ? minTVL : minSharePrice

      const between = maxValue - minValue
      unitBtw = between / 4
      if (filter === 2) {
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
          const rate = Number(unitBtw / maxValue) + 1
          maxValue *= rate
          maxValue = ceil10(maxValue, -len)
          minValue /= rate
        }
      } else {
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
      }

      if (filter === 1) {
        if (unitBtw === 0) {
          roundNum = 0
        } else {
          roundNum = len - 2
        }
      } else if (filter === 0) {
        roundNum = -len
      } else if (filter === 2) {
        roundNum = maxValue - minValue < 0.001 ? 6 : 5
      }

      setMinVal(minValue)
      setMaxVal(maxValue)

      setFixedLen(filter === 1 ? 0 : len)
      setRoundNumber(roundNum)

      setCurDate(formatDate(mainData[mainData.length - 1].x))
      const content = numberWithCommas(
        (
          Number(mainData[mainData.length - 1].y) * (filter === 1 ? Number(currencyRate) : 1)
        ).toFixed(filter === 1 ? 2 : filter === 0 ? fixedLen : roundNum),
      )
      setCurContent(content)

      const yAxisAry = getYAxisValues(minValue, maxValue, roundNum, filter)
      setYAxisTicks(yAxisAry)

      setMainSeries(mainData)

      setLoading(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    range,
    filter,
    data,
    lastTVL,
    lastAPY,
    isIFARM,
    iFarmTVL,
    fixedLen,
    setCurContent,
    setCurDate,
    token.decimals,
    currencyRate,
  ])

  return (
    <>
      {!loading ? (
        <ResponsiveContainer
          width="100%"
          // height={onlyWidth > 1250 ? 350 : onlyWidth > 1050 ? 330 : 330}
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
              left: isMobile ? 0 : 0,
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
            <XAxis
              dataKey="x"
              tickLine={false}
              // interval={20}
              tickCount={isMobile ? 7 : 5}
              tick={renderCustomXAxisTick}
              padding={{ right: 10 }}
            />
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
              content={<CustomTooltip onTooltipContentChange={handleTooltipContent} />}
              legendType="none"
              dot={false}
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
            <NoData color={fontColor}>Vault data soon to be available.</NoData>
          )}
        </LoadingDiv>
      )}
    </>
  )
}

export default ApexChart
