import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
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
  const ary = data.map(el => el[1])
  const max = Math.max(...ary)
  return max
}

function findMin(data) {
  const ary = data.map(el => el[1])
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
    seriesData.push([slots[i] * 1000, value])
  }

  return seriesData
}

const ApexChart = ({ data, range, setCurDate, setCurContent }) => {
  const { backColor, fontColor, darkMode } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([
    {
      name: 'TVL m$',
      data: [],
    },
  ])

  const [options, setOptions] = useState({
    chart: {
      id: 'apexchart-example',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
      type: 'area',
      stacked: false,
      height: 350,
      foreColor: '#707070',
      background: backColor,
      animations: {
        enabled: false,
      },
    },
    colors: ['#000'],
    dataLabels: { enabled: false },
    markers: {
      strokeColor: '#EDAE50',
      strokeWidth: 2,
      fillColor: '#fff',
      hover: { size: 8 },
    },
    tooltip: {
      custom() {
        return '<div style="padding: 5px;"></div>'
      },
    },
    stroke: {
      curve: 'straight',
      colors: ['#EDAE50'],
      width: 2,
    },
    xaxis: {
      type: 'datetime',
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontFamily: 'Work Sans' },
      },
    },
    yaxis: {
      opposite: false,
      show: false,
      tickAmount: 3,
      labels: {
        style: { fontFamily: 'Work Sans' },
        formatter: val => `$ ${numberWithCommas(val.toFixed(0))}`,
      },
    },
    fill: {
      enabled: false,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#EDAE30'],
        inverseColors: true,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 20, 100],
        colorStops: [],
      },
    },
  })

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)

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
      const maxTVL = findMax(mainData)
      const minTVL = findMin(mainData)

      maxValue = maxTVL
      minValue = minTVL

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

      const yAxis = {
        opposite: false,
        min: minValue,
        max: maxValue,
        tickAmount: 4,
        labels: {
          style: { colors: darkMode ? 'white' : 'black', fontFamily: 'Roboto, sans-serif' },
          formatter: val => numberWithCommas(round10(val, roundNum).toFixed(0)),
        },
      }

      setMainSeries([
        {
          data: mainData,
        },
      ])

      setOptions({
        chart: {
          id: 'chartArea',
          toolbar: {
            autoSelected: 'pan',
            show: false,
          },
          foreColor: '#707070',
          stacked: false,
          background: backColor,
          zoom: {
            enabled: false,
          },
        },
        fill: {
          type: 'pattern',
          pattern: {
            style: 'squares',
            width: 4,
            height: 4,
            strokeWidth: 1,
          },
        },
        grid: {
          show: true,
          borderColor: 'rgba(228, 228, 228, 0.2)',
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        colors: ['#F4BE37'],
        stroke: {
          colors: ['#F4BE37'],
          width: 3,
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          strokeColor: '#EDAE50',
          size: 0,
          strokeWidth: 2,
          fillColor: '#fff',
          hover: { size: 0 },
        },
        tooltip: {
          custom({ dataPointIndex }) {
            setCurDate(formatDateTime(mainData[dataPointIndex][0]))
            const content = `<div style="font-size: 13px; line-height: 16px; display: flex;"><div style="font-weight: 700;">TVL 
            </div><div style="color: #ff9400; font-weight: 500;">$
            ${numberWithCommas(mainData[dataPointIndex][1].toFixed(0))}</div></div>`
            setCurContent(content)
          },
        },
        yaxis: yAxis,
        xaxis: {
          type: 'category',
          tickAmount: 5,
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { colors: darkMode ? 'white' : 'black', fontFamily: 'Roboto, sans-serif' },
            formatter(value, timestamp) {
              const date = new Date(timestamp)
              const dateString = `${date.getMonth() + 1} / ${date.getDate()}`
              const timeString = `${date.getHours()}:${date.getMinutes()}`
              if (range === '1D') {
                return timeString
              }
              return dateString
            },
          },
          tooltip: {
            enabled: false,
          },
        },
      })

      setLoading(false)
    }

    init()
  }, [backColor, range, data, isDataReady, setCurDate, setCurContent, darkMode])

  return (
    <>
      {!loading ? (
        <Chart options={options} series={mainSeries} type="area" height="100%" />
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
