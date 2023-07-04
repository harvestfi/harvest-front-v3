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

  return `${month} ${day} ${year}`
}

function generateIFARMTVLWithSlots(slots, apiData) {
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

const ApexChart = ({
  data,
  iFarmTVL,
  isIFARM,
  range,
  filter,
  decimal,
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
          if (iFarmTVL && iFarmTVL.ETH && iFarmTVL.MATIC && iFarmTVL.ARBITRUM) {
            if (
              iFarmTVL.ETH.length === 0 &&
              iFarmTVL.MATIC.length === 0 &&
              iFarmTVL.ARBITRUM.length === 0
            ) {
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

      const yAxis = {
        opposite: false,
        min: minValue,
        max: maxValue,
        tickAmount: 4,
        labels: {
          style: { colors: darkMode ? 'white' : 'black', fontFamily: 'Roboto, sans-serif' },
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
          colors: ['#FF9400'],
          curve: ['smooth'],
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
            const content = `<div style="font-size: 13px; line-height: 16px; display: flex;"><div style="font-weight: 700;">${
              filter === 1 ? 'TVL ' : filter === 0 ? 'APY ' : 'Balance '
            }</div><div style="color: #ff9400; font-weight: 500;">&nbsp;${
              filter === 1 ? '$' : ''
            }${numberWithCommas(mainData[dataPointIndex][1].toFixed(filter === 1 ? 0 : len))}${
              filter === 0 ? '%' : ''
            }</div></div>`
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
  }, [
    backColor,
    range,
    filter,
    decimal,
    data,
    lastTVL,
    lastAPY,
    isDataReady,
    darkMode,
    setCurDate,
    setCurContent,
    isIFARM,
    iFarmTVL,
  ])

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
