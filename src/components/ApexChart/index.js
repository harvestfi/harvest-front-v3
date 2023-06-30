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
function generateChartDataWithSlots(slots, apiData, kind) {
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
  let hour = date.getHours(),
    min = date.getMinutes()
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour %= 12
  hour = hour || 12 // the hour '0' should be '12'
  hour = hour < 10 ? `0${hour}` : hour
  min = min < 10 ? `0${min}` : min

  return `${month} ${day}, ${year} ${hour}:${min} ${ampm}`
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
        maxTVL = lastTVL,
        maxBalance = 0,
        minBalance,
        maxTVLValue,
        minTVLValue,
        lenTVL = 0,
        unitTVLBtw,
        roundNumTVL,
        maxAPYValue,
        minAPYValue,
        lenAPY = 0,
        unitAPYBtw,
        maxBalValue,
        minBalValue,
        lenBal = 0,
        unitBalBtw

      // if (filter === 1) {
      if (data && data.tvls) {
        if (data.tvls.length === 0) {
          setIsDataReady(false)
          return
        }
      }
      tvlData = data && data.tvls ? data.tvls : []

      if (tvlData.length !== 0 && lastTVL && !Number.isNaN(lastTVL)) tvlData[0].value = lastTVL
      // } else if (filter === 0) {
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
      // } else {
      if (data && data.userBalanceHistories) {
        if (data.userBalanceHistories.length === 0) {
          setIsDataReady(false)
          return
        }
      }
      userBalanceData = data && data.userBalanceHistories ? data.userBalanceHistories : []
      // }

      const slotCount = 50,
        slots = getTimeSlots(ago, slotCount)

      const tvlMainData = generateChartDataWithSlots(slots, tvlData, 'value')
      maxTVL = findMax(tvlMainData)
      const minTVL = findMin(tvlMainData)

      const apyMainData = generateChartDataWithSlots(slots, apyData, 'apy')
      maxAPY = findMax(apyMainData)
      const minAPY = findMin(apyMainData)

      const balMainData = generateChartDataWithSlots(slots, userBalanceData, 'value')
      maxBalance = findMax(balMainData)
      minBalance = findMin(balMainData)
      minBalance /= 2

      if (filter === 1) {
        if (tvlData.length === 0) {
          // setIsDataReady(false)
          return
        }
        mainData = generateChartDataWithSlots(slots, tvlData, 'value')
      } else if (filter === 0) {
        if (apyData.length === 0) {
          setIsDataReady(false)
          return
        }

        mainData = generateChartDataWithSlots(slots, apyData, 'apy')
      } else {
        if (userBalanceData.length === 0) {
          return
        }
        mainData = generateChartDataWithSlots(slots, userBalanceData, 'value')
      }

      // TVL

      maxTVLValue = maxTVL
      minTVLValue = minTVL

      const betweenTVL = maxTVLValue - minTVLValue
      unitTVLBtw = betweenTVL / 4
      if (unitTVLBtw >= 1) {
        unitTVLBtw = Math.ceil(unitTVLBtw)
        lenTVL = unitTVLBtw.toString().length
        unitTVLBtw = ceil10(unitTVLBtw, lenTVL - 1)
        maxTVLValue = ceil10(maxTVLValue, lenTVL - 1)
        minTVLValue = floor10(minTVLValue, lenTVL - 1)
      } else if (unitTVLBtw === 0) {
        lenTVL = Math.ceil(maxTVLValue).toString().length
        maxTVLValue += 10 ** (lenTVL - 1)
        minTVLValue -= 10 ** (lenTVL - 1)
      } else {
        lenTVL = Math.ceil(1 / unitTVLBtw).toString().length + 1
        unitTVLBtw = ceil10(unitTVLBtw, -lenTVL)
        maxTVLValue = ceil10(maxTVLValue, -lenTVL)
        minTVLValue = floor10(minTVLValue, -lenTVL + 1)
      }
      /**
       * Set min value with 0, and max value *1.5 - trello card
       */
      if (unitTVLBtw !== 0) {
        maxTVLValue *= 1.5
        minTVLValue = 0
      } else {
        unitTVLBtw = (maxTVLValue - minTVLValue) / 4
      }

      if (unitTVLBtw === 0) {
        roundNumTVL = 0
      } else {
        roundNumTVL = lenTVL - 2
      }

      // APY

      maxAPYValue = maxAPY
      minAPYValue = minAPY

      const betweenAPY = maxAPYValue - minAPYValue
      unitAPYBtw = betweenAPY / 4
      if (unitAPYBtw >= 1) {
        unitAPYBtw = Math.ceil(unitAPYBtw)
        lenAPY = unitAPYBtw.toString().length
        unitAPYBtw = ceil10(unitAPYBtw, lenAPY - 1)
        maxAPYValue = ceil10(maxAPYValue, lenAPY - 1)
        minAPYValue = floor10(minAPYValue, lenAPY - 1)
      } else if (unitAPYBtw === 0) {
        lenAPY = Math.ceil(maxAPYValue).toString().length
        maxAPYValue += 10 ** (lenAPY - 1)
        minAPYValue -= 10 ** (lenAPY - 1)
      } else {
        lenAPY = Math.ceil(1 / unitAPYBtw).toString().length + 1
        unitAPYBtw = ceil10(unitAPYBtw, -lenAPY)
        maxAPYValue = ceil10(maxAPYValue, -lenAPY)
        minAPYValue = floor10(minAPYValue, -lenAPY + 1)
      }
      /**
       * Set min value with 0, and max value *1.5 - trello card
       */
      if (unitAPYBtw !== 0) {
        maxAPYValue *= 1.5
        minAPYValue = 0
      } else {
        unitAPYBtw = (maxAPYValue - minAPYValue) / 4
      }

      const roundNumAPY = -lenAPY

      // UserBalance

      maxBalValue = maxBalance
      minBalValue = minBalance

      const betweenBal = maxBalValue - minBalValue
      unitBalBtw = betweenBal / 4
      if (unitBalBtw >= 1) {
        unitBalBtw = Math.ceil(unitBalBtw)
        lenBal = unitBalBtw.toString().length
        unitBalBtw = ceil10(unitBalBtw, lenBal - 1)
        maxBalValue = ceil10(maxBalValue, lenBal - 1)
        minBalValue = floor10(minBalValue, lenBal - 1)
      } else if (unitBalBtw === 0) {
        lenBal = Math.ceil(maxBalValue).toString().length
        maxBalValue += 10 ** (lenBal - 1)
        minBalValue -= 10 ** (lenBal - 1)
      } else {
        lenBal = Math.ceil(1 / unitBalBtw).toString().length + 1
        unitBalBtw = ceil10(unitBalBtw, -lenBal)
        maxBalValue = ceil10(maxBalValue, -lenBal)
        minBalValue = floor10(minBalValue, -lenBal + 1)
      }
      /**
       * Set min value with 0, and max value *1.5 - trello card
       */
      if (unitBalBtw !== 0) {
        maxBalValue *= 1.5
        minBalValue = 0
      } else {
        unitBalBtw = (maxBalValue - minBalValue) / 4
      }

      const roundNumBal = -lenBal

      const yAxis = {
        opposite: false,
        min: filter === 1 ? minTVLValue : filter === 0 ? minAPYValue : minBalValue,
        max: filter === 1 ? maxTVLValue : filter === 0 ? maxAPYValue : maxBalValue,
        tickAmount: 4,
        labels: {
          style: { fontFamily: 'Work Sans' },
          formatter: val =>
            numberWithCommas(
              (filter === 1
                ? round10(
                    val,
                    filter === 1 ? roundNumTVL : filter === 0 ? roundNumAPY : roundNumBal,
                  )
                : val
              ).toFixed(filter === 1 ? 0 : filter === 0 ? lenAPY : lenBal),
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
          custom({ dataPointIndex }) {
            return `${'<div style="padding: 15px; height: 100%; background: black; color: white;"><h1 style="font-size: 16px;">'}${formatDateTime(
              mainData[dataPointIndex][0],
            )}</h1><div style="font-size: 16px;">APY: ${numberWithCommas(
              apyMainData[dataPointIndex][1].toFixed(lenAPY - 1),
            )}%</div><div style="font-size: 16px;">TVL: $${numberWithCommas(
              tvlMainData[dataPointIndex][1].toFixed(0),
            )}</div></div>`
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
          tooltip: {
            enabled: false,
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
