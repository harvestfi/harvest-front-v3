import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { ClipLoader } from 'react-spinners'
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
function generateChartDataWithSlots(slots, apiData, filter, decimal, kind) {
  const seriesData = []
  for (let i = 0; i < slots.length; i += 1) {
    for (let j = 0; j < apiData.length; j += 1) {
      if (slots[i] > parseInt(apiData[j].timestamp, 10)) {
        const value = parseFloat(apiData[j][kind])
        seriesData.push([slots[i] * 1000, value])
        break
      } else if (j === apiData.length - 1) {
        seriesData.push([slots[i] * 1000, 0])
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
          Math.abs(apyData[i][1] - apyData[i - 1][1]) <= Math.abs(apyData[i][1] - apyData[i + 1][1])
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

const ApexChart = ({ data, range, filter, decimal, lastTVL, lastAPY /* , userBalance */ }) => {
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
        if (data && data.tvls) {
          if (data.tvls.length === 0) {
            setIsDataReady(false)
            return
          }
        }
        tvlData = data && data.tvls ? data.tvls : []

        if (tvlData.length !== 0 && lastTVL && !Number.isNaN(lastTVL)) tvlData[0].value = lastTVL
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
        if (lastAPY && !Number.isNaN(lastAPY)) apyData[0].apy = lastAPY
      } else {
        if (data && data.userBalanceHistories) {
          if (data.userBalanceHistories.length === 0) {
            setIsDataReady(false)
            return
          }
        }
        userBalanceData = data && data.userBalanceHistories ? data.userBalanceHistories : []
        // if(userBalanceData.length !== 0 && userBalance)
        //   userBalanceData[0]["value"] = userBalance
      }

      const slotCount = 50,
        slots = getTimeSlots(ago, slotCount)

      if (filter === 1) {
        if (tvlData.length === 0) {
          // setIsDataReady(false)
          return
        }
        mainData = generateChartDataWithSlots(slots, tvlData, filter, decimal, 'value')
        maxTVL = findMax(mainData)
        minTVL = findMin(mainData)
      } else if (filter === 0) {
        if (apyData.length === 0) {
          setIsDataReady(false)
          return
        }

        mainData = generateChartDataWithSlots(slots, apyData, filter, decimal, 'apy')

        maxAPY = findMax(mainData)
        minAPY = findMin(mainData)
      } else {
        if (userBalanceData.length === 0) {
          return
        }
        mainData = generateChartDataWithSlots(slots, userBalanceData, filter, decimal, 'value')
        maxBalance = findMax(mainData)
        minBalance = findMin(mainData)
        minBalance /= 2
        // maxBalance *= 2
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

      const yAxis = {
        opposite: false,
        min: minValue,
        max: maxValue,
        tickAmount: 4,
        labels: {
          style: { fontFamily: 'Work Sans' },
          formatter: val =>
            numberWithCommas(
              (filter === 1 ? round10(val, roundNum) : val).toFixed(filter === 1 ? 0 : len),
            ),
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
            return `${'<div style="padding: 5px;"><h1 style="font-size: 12px; color: #888E8F">'}${
              filter === 1 ? '$' : ''
            }${numberWithCommas(series[0][dataPointIndex].toFixed(filter === 1 ? 0 : len - 1))}${
              filter === 0 ? '%' : ''
            }</h1></div>`
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
  }, [backColor, range, filter, decimal, data, lastTVL, lastAPY, /* userBalance, */ isDataReady])

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
