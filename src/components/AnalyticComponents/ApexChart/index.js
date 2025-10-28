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
import { CHAIN_IDS } from '../../../data/constants'
import { useRate } from '../../../providers/Rate'
import { ceil10, floor10, numberWithCommas } from '../../../utilities/formats'
import {
  findMaxTotal,
  getRangeNumber,
  getTimeSlots,
  getYAxisValues,
} from '../../../utilities/parsers'
import {
  LoadingDiv,
  NoData,
  TooltipContainer,
  TooltipContent,
  TooltipTotal,
  ProtocolEntry,
  DottedUnderline,
} from './style'

const CHAIN_NAMES = {
  1: 'Ethereum',
  137: 'Polygon',
  42161: 'Arbitrum',
  8453: 'Base',
  324: 'ZkSync',
  999: 'HyperEVM',
}

function generateChartDataWithSlots(slots, apiData) {
  const seriesData = []

  const chains = Object.keys(apiData).filter(key => Object.values(CHAIN_IDS).includes(key))

  for (const t of slots) {
    const point = { x: t * 1000 }
    chains.forEach(chain => {
      const chainData = apiData[chain]
      if (!chainData?.length) {
        point[chain] = 0
      } else {
        const closest = chainData.reduce((prev, curr) =>
          Math.abs(+curr.timestamp - t) < Math.abs(+prev.timestamp - t) ? curr : prev,
        )
        point[CHAIN_NAMES[chain]] = +closest.value
      }
    })
    point.Total = chains.reduce((s, c) => s + point[CHAIN_NAMES[c]], 0)
    seriesData.push(point)
  }
  return seriesData
}

function formatXAxis(value, range) {
  const date = new Date(value)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours().toString().padStart(2, '0')
  const mins = date.getMinutes().toString().padStart(2, '0')

  return range === '1D'
    ? `${hour}:${mins}`
    : range === '1Y' || range === 'ALL'
      ? `${day} / ${month} / ${year}`
      : `${day} / ${month}`
}

const ApexChart = ({ data, range }) => {
  const { fontColor, inputFontColor } = useThemeContext()

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

  const renderTooltipContent = o => {
    const { payload, label } = o

    const date = new Date(label)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours().toString().padStart(2, '0')
    const mins = date.getMinutes().toString().padStart(2, '0')

    return (
      <TooltipContainer>
        <TooltipContent>
          <TooltipTotal>{`${day}/${month}/${year} ${hour}:${mins}`}</TooltipTotal>
          {payload
            .filter(entry => entry.value !== 0 && entry.value !== null)
            .map((entry, index) => {
              return (
                <ProtocolEntry
                  key={`item-${index}`}
                  color={entry.name == 'Total' ? '#FFFFFF' : entry.stroke}
                >
                  <DottedUnderline>{entry.name}</DottedUnderline>
                  &nbsp;&nbsp;
                  {`${currencySym}${numberWithCommas(
                    (Number(entry.value) * Number(currencyRate)).toFixed(0),
                  )}`}
                </ProtocolEntry>
              )
            })}
        </TooltipContent>
      </TooltipContainer>
    )
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
        fill={inputFontColor}
      >
        <tspan dy="0.71em">{path}</tspan>
      </text>
    )
  }

  const renderCustomYAxisTick = ({ x, y, payload }) => {
    let path = ''

    if (payload.value !== '') {
      path = `${currencySym}${numberWithCommas(
        (Number(payload.value) * Number(currencyRate)).toFixed(0),
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
        fill={inputFontColor}
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
        unitBtw

      if (
        data &&
        data.ETH &&
        data.MATIC &&
        data.ARBITRUM &&
        data.BASE &&
        data.ZKSYNC &&
        data.HYPEREVM
      ) {
        if (
          data.ETH.length === 0 &&
          data.MATIC.length === 0 &&
          data.ARBITRUM.length === 0 &&
          data.BASE.length === 0 &&
          data.ZKSYNC.length === 0 &&
          data.HYPEREVM.length === 0
        ) {
          setIsDataReady(false)
          return
        }
      }

      const slotCount = 100,
        slots = getTimeSlots(ago, slotCount)

      if (data.length === 0) {
        return
      }
      mainData = generateChartDataWithSlots(slots, data)
      maxValue = findMaxTotal(mainData)
      minValue = 0

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

      setMinVal(minValue)
      setMaxVal(maxValue)

      const yAxisAry = getYAxisValues(minValue, maxValue, len - 2)
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
              dataKey="Total"
              tickLine={false}
              tickCount={5}
              tick={renderCustomYAxisTick}
              ticks={yAxisTicks}
              domain={[minVal, maxVal]}
            />
            <Area
              dataKey="Ethereum"
              stackId="TVL"
              stroke="#d6a737"
              fill="#d6a737"
              fillOpacity={0.7}
            />
            <Area
              dataKey="Polygon"
              stackId="TVL"
              stroke="#9b7ede"
              fill="#9b7ede"
              fillOpacity={0.7}
            />
            <Area
              dataKey="Arbitrum"
              stackId="TVL"
              stroke="#5f9ea0"
              fill="#5f9ea0"
              fillOpacity={0.7}
            />
            <Area dataKey="Base" stackId="TVL" stroke="#b68f40" fill="#b68f40" fillOpacity={0.7} />
            <Area
              dataKey="ZkSync"
              stackId="TVL"
              stroke="#8a9a5b"
              fill="#8a9a5b"
              fillOpacity={0.7}
            />
            <Area
              dataKey="HyperEVM"
              stackId="TVL"
              stroke="#80f0e0"
              fill="#80f0e0"
              fillOpacity={0.7}
            />
            <Line dataKey="Total" stroke="#000000" strokeWidth={1} dot={false} />

            <Tooltip content={renderTooltipContent} />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <LoadingDiv>
          {isDataReady ? (
            <ClipLoader size={30} margin={2} color={fontColor} />
          ) : (
            <NoData $fontcolor={fontColor}>
              You don&apos;t have any active deposits in this farm.
            </NoData>
          )}
        </LoadingDiv>
      )}
    </>
  )
}

export default ApexChart
