import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
// import { ClipLoader } from 'react-spinners'
// import { LoadingDiv } from './style'
import { useThemeContext } from '../../providers/useThemeContext'
import { ceil10, floor10 } from '../../utils'

// function numberWithCommas(x) {
//   if(x < 1000) 
//     return x
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// }

// function getRangeNumber(strRange) {
//   let ago = 30
//   if(strRange === '1D') {
//     ago = 1
//   }
//   else if(strRange === '1W') {
//     ago = 7
//   }
//   else if(strRange === '1M') {
//     ago = 30
//   }
//   else if(strRange === '1Y') {
//     ago = 365
//   }

//   return ago
// }

function getTimeSlots(ago, slotCount) {
  let slots = []
  let nowDate = new Date()
  let toDate = Math.floor(nowDate.getTime() / 1000)
  let fromDate = Math.floor(nowDate.setDate(nowDate.getDate() - ago) / 1000)
  
  let between = (toDate - fromDate) / slotCount
  for(let i = fromDate + between; i <= toDate; i += between) {
    slots.push(i)
  }

  return slots
}

function findMax(data) {
  const ary = data.map(el=>el[1])
  let max = Math.max(...ary)
  return max
}

function findMin(data) {
  const ary = data.map(el=>el[1])
  let min = Math.min(...ary)
  return min
}

// kind: "value" - TVL, "apy" - APY
function generateChartDataWithSlots(slots, apiData, kind) {
  let seriesData = []
  for(let i = 0; i < slots.length; i++) {
    for(let j = 0; j < apiData.length ; j++) {
      if(slots[i] > parseInt(apiData[j]["timestamp"])) {
        let value = parseFloat(apiData[j][kind])
        seriesData.push([slots[i]*1000, value])
        break
      }
      else {
        if(j === apiData.length-1) {
          seriesData.push([slots[i]*1000, 0])
        }
      }
    }
  }

  return seriesData
}

function generateChartDataForApy(apyData1, apyData2, field) {
  apyData1 = apyData1.map(function(x) {
    return [x["timestamp"], Number(x[field]), 1]
  })
  apyData2 = apyData2.map(function(x) {
    return [x["timestamp"], Number(x[field]), 2]
  })

  let apyData = apyData1.concat(apyData2)
  apyData = apyData.sort(function(a, b) { return b[0] - a[0] })

  for(let i = 0; i < apyData.length; i++) {
    if(i === 0) {
      if(apyData[i][2] !== apyData[i+1][2])
        apyData[i][1] += apyData[i+1][1]
    }
    else if(i === apyData.length - 1) {
      if(apyData[i][2] !== apyData[i-1][2]){
        apyData[i][1] += apyData[i-1][1]
      }
    }
    else {
      if(apyData[i][2] !== apyData[i+1][2]) {
        if(apyData[i][2] !== apyData[i-1][2]) {
          if(Math.abs(apyData[i][1] - apyData[i-1][1]) <= Math.abs(apyData[i][1] - apyData[i+1][1]))
            apyData[i][1] += apyData[i-1][1]
          else 
            apyData[i][1] += apyData[i+1][1]
        }
        else {
          apyData[i][1] += apyData[i+1][1]
        }
      }
      else {
        if(apyData[i][2] !== apyData[i-1][2]) {
          apyData[i][1] += apyData[i-1][1]
        }
      }
    }
  }

  apyData = apyData.map(function(x) {
    var d = 1 / x[1]
    if(d > 1) {
      let len = Math.ceil(d).toString().length + 1
      x[1] = x[1].toFixed(len)
    }
    let obj = {}
    obj["timestamp"] = x[0]
    obj[field] = x[1]
    return obj
  })

  return apyData
}

const ApexChart = ({data, lastAPY, specVault }) => {

  const { backColor } = useThemeContext()

  const [mainSeries, setMainSeries] = useState([{
    name: 'TVL m$',
    data: []
  }])

  const [options, setOptions] = useState({
    chart: {
      id: 'apexchart-example',
      zoom: {
        enabled: false,
      },
      toolbar: {
        autoSelected: 'zoom'
      },
      type: 'area',
      stacked: false,
      height: 350,
      foreColor: '#707070',
      background: 'transparent',
      animations: {
        enabled: false
      }
    },
    grid: {
      show: false,
    },
    stroke: {
      // colors: [specVault === 'false' ? '#12B76A' : 'white'],
      colors: ['#12B76A'],
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      enabled: false,
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ['#F8DD9C'],
        inverseColors: true,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 20, 100],
        colorStops: []
      }
    },
    tooltip: {
      enabled: false
    },
    markers: {
      strokeColor: '#EDAE50',
      size: 0,
      strokeWidth: 2,
      fillColor: '#fff',
      hover: { size: 8 }
    },
    yaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    xaxis: {
      show: false,
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    }
  })

  const [, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      let mainData = []
      
      setLoading(true)
      let ago = 30

      let apyData = []
      if(data && (data.apyAutoCompounds || data.apyRewards)) {
        if(data.apyAutoCompounds.length === 0 && data.apyRewards.length === 0)  {
          return
        }
      }
      let apyAutoCompounds = data.apyAutoCompounds ? data.apyAutoCompounds : []
      let apyRewards = data.apyRewards ? data.apyRewards : []

      apyData = generateChartDataForApy(apyAutoCompounds, apyRewards, 'apy')
      if(lastAPY && lastAPY !== 0 && apyData.length !== 0)
        apyData[0]["apy"] = lastAPY

      let slotCount = 30
      let slots = getTimeSlots(ago, slotCount)

      let maxAPY = lastAPY, minAPY

      if(apyData.length === 0) {
        return
      }
      
      mainData = generateChartDataWithSlots(slots, apyData, "apy")

      maxAPY = findMax(mainData)
      minAPY = findMin(mainData)
      
      let maxValue, minValue
      maxValue = maxAPY
      minValue = minAPY

      const between = maxValue - minValue
      let len = 0
      let unitBtw = between / 4
      if(unitBtw >= 1) {
        unitBtw = Math.ceil(unitBtw)
        len = unitBtw.toString().length
        unitBtw = ceil10(unitBtw, len-1)
        maxValue = ceil10(maxValue, len-1)
        minValue = floor10(minValue, len-1)
      }
      else if(unitBtw === 0) {
        len = Math.ceil(maxValue).toString().length
        maxValue += Math.pow(10, len-1)
        minValue -= Math.pow(10, len-1)
      }
      else {
        len = Math.ceil(1 / unitBtw).toString().length + 1
        unitBtw = ceil10(unitBtw, -len)
        maxValue = ceil10(maxValue, -len)
        minValue = floor10(minValue, -len+1)
      }
      /**
       * Set min value with 0, and max value *1.5 - trello card
       */
      if(unitBtw !== 0) {
        maxValue *= 1.5
        minValue = 0
      }
      else {
        unitBtw = (maxValue - minValue) / 4
      }

      const yAxis = {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      }

      setMainSeries([
        {
          data: mainData
        }
      ])
  
      setOptions({
          chart: {
            id: "chartArea",
            toolbar: {
              autoSelected: "pan",
              show: false
            },
            foreColor: '#707070',
            stacked: false,
            background: 'transparent',
            zoom: {
              type: 'x',
              enabled: false,
            },
          },
          grid: {
            show: false,
          },
          stroke: {
            colors: [specVault === 'false' ? '#12B76A' : 'white'],
            width: 3
          },
          dataLabels: {
            enabled: false
          },
          fill: {
            opacity: 1,
            enabled: false,
            gradient: {
              shade: 'dark',
              type: "vertical",
              shadeIntensity: 0.5,
              gradientToColors: ['#F8DD9C'],
              inverseColors: true,
              opacityFrom: 0.6,
              opacityTo: 0.2,
              stops: [0, 20, 100],
              colorStops: []
            }
          },
          tooltip: {
            enabled: false
          },
          markers: {
            strokeColor: '#EDAE50',
            size: 0,
            strokeWidth: 2,
            fillColor: '#fff',
            hover: { size: 8 }
          },
          yaxis: yAxis,
          xaxis: {
            show: false,
            labels: {
              show: false
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          }
      })

      setLoading(false)
    }

    init()
  }, [backColor, data, lastAPY, specVault])

  return (
    <>
      {
        // !loading ? 
        <Chart
            options={options}
            series={mainSeries}
            type="area"
            height='100'
            width="180"
        />
        // : 
        // <LoadingDiv>
        //   {<ClipLoader size={30} margin={2} color={fontColor}></ClipLoader>}
        // </LoadingDiv>
      }
    </>
  )
}

export default ApexChart