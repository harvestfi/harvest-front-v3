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

const ApexChart = ({ data, range }) => {
  const { backColor, fontColor } = useThemeContext()

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

      // if (data.length !== 0 && lastTVL && !Number.isNaN(lastTVL)) tvlData[0].value = lastTVL

      const slotCount = 50,
        slots = getTimeSlots(ago, slotCount)

      if (data.length === 0) {
        // setIsDataReady(false)
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
      /**
       * Set min value with 0, and max value *1.5 - trello card
       */
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
          style: { fontFamily: 'Work Sans' },
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
            type: 'x',
            enabled: true,
            autoScaleXaxis: true,
          },
          events: {
            scrolled(chartContext, { xaxis }) {
              console.log(
                new Date(xaxis.min).toLocaleDateString(),
                new Date(xaxis.max).toLocaleDateString(),
              )
            },
          },
        },
        grid: {
          show: true,
          borderColor: '#E3E3E3',
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
        fill: {
          opacity: 1,
          enabled: false,
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#F8DD9C'],
            inverseColors: true,
            opacityFrom: 0.6,
            opacityTo: 0.2,
            stops: [0, 20, 100],
            colorStops: [],
          },
        },
        markers: {
          strokeColor: '#EDAE50',
          size: 0,
          strokeWidth: 2,
          fillColor: '#fff',
          hover: { size: 8 },
        },
        tooltip: {
          x: {
            format: 'dd MMM - HH : mm ',
          },
          custom({ series, dataPointIndex }) {
            return `${'<div style="padding: 5px;"><h1 style="font-size: 12px; color: #888E8F">$'}
            ${numberWithCommas(series[0][dataPointIndex].toFixed(0))}</h1></div>`
          },
        },
        yaxis: yAxis,
        xaxis: {
          type: 'datetime',
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { fontFamily: 'Work Sans' },
          },
        },
      })

      setLoading(false)
    }

    init()
  }, [backColor, range, data, isDataReady])

  return (
    <>
      {!loading ? (
        <Chart options={options} series={mainSeries} type="area" height="100%" />
      ) : (
        <LoadingDiv>
          {isDataReady ? (
            <ClipLoader size={30} margin={2} color={fontColor} />
          ) : (
            <NoData color={fontColor}>&nbsp;No data !</NoData>
          )}
        </LoadingDiv>
      )}
    </>
  )
}

export default ApexChart
