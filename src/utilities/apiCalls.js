import axios from 'axios'
import { get } from 'lodash'
import { CHAIN_IDS } from '../data/constants'
import {
  GRAPH_URL_MAINNET,
  GRAPH_URL_POLYGON,
  GRAPH_URL_ARBITRUM,
  GRAPH_URL_BASE,
  TOTAL_TVL_API_ENDPOINT,
} from '../constants'

export const getLastHarvestInfo = async (address, chainId) => {
  // eslint-disable-next-line no-unused-vars
  let nowDate = new Date(),
    data = {},
    result = ''

  nowDate = Math.floor(nowDate.setDate(nowDate.getDate()) / 1000)

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  address = address.toLowerCase()
  const farm = '0xa0246c9032bc3a600820415ae600c6388619a14d'
  const ifarm = '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'

  const graphql = JSON.stringify({
      query: `{
        vaultHistories(
            where: {
              vault: "${address === farm ? ifarm : address}",
            },
            orderBy: timestamp,
            orderDirection: desc,
            first: 1
          ) {
            timestamp
          }
        }`,
      variables: {},
    }),
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    }

  const url =
    chainId === CHAIN_IDS.ETH_MAINNET
      ? GRAPH_URL_MAINNET
      : chainId === CHAIN_IDS.POLYGON_MAINNET
      ? GRAPH_URL_POLYGON
      : chainId === CHAIN_IDS.BASE
      ? GRAPH_URL_BASE
      : GRAPH_URL_ARBITRUM

  try {
    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => {
        data = res.data.vaultHistories
        if (data.length !== 0) {
          const timeStamp = data[0].timestamp
          let duration = Number(nowDate) - Number(timeStamp),
            day = 0,
            hour = 0,
            min = 0
          // calculate (and subtract) whole days
          day = Math.floor(duration / 86400)
          duration -= day * 86400

          // calculate (and subtract) whole hours
          hour = Math.floor(duration / 3600) % 24
          duration -= hour * 3600

          // calculate (and subtract) whole minutes
          min = Math.floor(duration / 60) % 60

          const dayString = `${day > 0 ? `${day}d` : ''}`
          const hourString = `${hour > 0 ? `${hour}h` : ''}`
          const minString = `${min > 0 ? `${min}m` : ''}`
          result = `${
            `${dayString !== '' ? `${dayString} ` : ''}` +
            `${hourString !== '' ? `${hourString} ` : ''}`
          }${minString}`
        }
      })
      .catch(error => console.log('error', error))
  } catch (err) {
    console.log('Fetch data about last harvest: ', err)
  }
  return result
}

export const getPublishDate = async (address, chainId) => {
  // eslint-disable-next-line no-unused-vars
  let nowDate = new Date(),
    data = {},
    flag = true

  nowDate = Math.floor(nowDate.setDate(nowDate.getDate()) / 1000)

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  address = address.toLowerCase()

  const graphql = JSON.stringify({
      query: `{
        vaultHistories(
            where: {
              vault: "${address}"
            },
            orderBy: timestamp,
            orderDirection: desc,
          ) {
            sharePrice, timestamp
          }
        }`,
      variables: {},
    }),
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    }

  const url =
    chainId === CHAIN_IDS.ETH_MAINNET
      ? GRAPH_URL_MAINNET
      : chainId === CHAIN_IDS.POLYGON_MAINNET
      ? GRAPH_URL_POLYGON
      : chainId === CHAIN_IDS.BASE
      ? GRAPH_URL_BASE
      : GRAPH_URL_ARBITRUM

  try {
    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => {
        data = res.data.vaultHistories
        if (data.length === 0) {
          flag = false
        }
      })
      .catch(error => {
        console.log('error', error)
        flag = false
      })
  } catch (err) {
    console.log('Fetch data about price feed: ', err)
    flag = false
  }
  return { data, flag }
}

export const getDataQuery = async (ago, address, chainId, myWallet) => {
  let nowDate = new Date(),
    data = {}
  nowDate = Math.floor(nowDate.setDate(nowDate.getDate() - 1) / 1000)
  const startDate = nowDate - 3600 * 24 * ago

  address = address.toLowerCase()
  const farm = '0xa0246c9032bc3a600820415ae600c6388619a14d'
  const ifarm = '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'

  address = address.toLowerCase()
  if (myWallet) {
    myWallet = myWallet.toLowerCase()
  }
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const graphql = JSON.stringify({
      query: `{
        generalApies(
          first: 1000,
          where: {
            vault: "${address === farm ? ifarm : address}",
            timestamp_gte: "${startDate}"
          }, 
          orderBy: timestamp, 
          orderDirection: desc
        ) { 
          apy, timestamp
        }
        tvls(
          first: 1000,
          where: {
            vault: "${address === farm ? ifarm : address}", 
            timestamp_gte: "${startDate}"
          },
          orderBy: timestamp,
          orderDirection: desc
        ) {
          value, timestamp
        },
        vaultHistories(
          first: 1000,
          where: {
            vault: "${address === farm ? ifarm : address}",
          },
          orderBy: timestamp,
          orderDirection: desc
        ) {
          priceUnderlying, sharePrice, timestamp
        }
      }`,
      variables: {},
    }),
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    }
  const url =
    chainId === CHAIN_IDS.ETH_MAINNET
      ? GRAPH_URL_MAINNET
      : chainId === CHAIN_IDS.POLYGON_MAINNET
      ? GRAPH_URL_POLYGON
      : chainId === CHAIN_IDS.BASE
      ? GRAPH_URL_BASE
      : GRAPH_URL_ARBITRUM

  try {
    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        data = result.data
      })
      .catch(error => console.log('error', error))
  } catch (err) {
    console.log('Fetch data about subgraph: ', err)
  }

  return data
}

export const getUserBalanceHistories1 = async (address, chainId, account) => {
  let data1 = {},
    flag1 = true

  address = address.toLowerCase()
  const farm = '0xa0246c9032bc3a600820415ae600c6388619a14d'
  const ifarm = '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'
  if (account) {
    account = account.toLowerCase()
  }

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const graphql = JSON.stringify({
      query: `{
        userBalanceHistories(
          first: 1000,
          where: {
            vault: "${address === farm ? ifarm : address}",
            userAddress: "${account}"
          },
          orderBy: timestamp,
          orderDirection: desc,
        ) {
          value, timestamp
        }
      }`,
      variables: {},
    }),
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    }

  const url =
    chainId === CHAIN_IDS.ETH_MAINNET
      ? GRAPH_URL_MAINNET
      : chainId === CHAIN_IDS.POLYGON_MAINNET
      ? GRAPH_URL_POLYGON
      : chainId === CHAIN_IDS.BASE
      ? GRAPH_URL_BASE
      : GRAPH_URL_ARBITRUM

  try {
    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => {
        data1 = res.data.userBalanceHistories
        if (data1.length === 0) {
          flag1 = false
        }
      })
      .catch(error => {
        console.log('error', error)
        flag1 = false
      })
  } catch (err) {
    console.log('Fetch data about user balance histories: ', err)
    flag1 = false
  }
  return { data1, flag1 }
}

export const getUserBalanceHistories2 = async (address, chainId) => {
  let data2 = {},
    flag2 = true

  address = address.toLowerCase()

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const graphql = JSON.stringify({
      query: `{
        priceFeeds(
          first: 1000,
          where: {
            vault: "${address}",
          },
          orderBy: timestamp,
          orderDirection: desc,
        ) {
          sharePrice, price, timestamp
        }
      }`,
      variables: {},
    }),
    requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    }

  const url =
    chainId === CHAIN_IDS.ETH_MAINNET
      ? GRAPH_URL_MAINNET
      : chainId === CHAIN_IDS.POLYGON_MAINNET
      ? GRAPH_URL_POLYGON
      : chainId === CHAIN_IDS.BASE
      ? GRAPH_URL_BASE
      : GRAPH_URL_ARBITRUM

  try {
    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => {
        data2 = res.data.priceFeeds
        if (data2.length === 0) {
          flag2 = false
        }
      })
      .catch(error => {
        console.log('error', error)
        flag2 = false
      })
  } catch (err) {
    console.log('Fetch data about user balance histories: ', err)
    flag2 = false
  }
  return { data2, flag2 }
}

const removeZeroValueObjects = data => {
  let nonZeroValueEncountered = false
  for (let i = data.length - 1; i >= 0; i -= 1) {
    if (parseFloat(data[i].value) === 0 || data[i].value === '0') {
      if (!nonZeroValueEncountered) {
        data.splice(i, 1)
      }
    } else {
      nonZeroValueEncountered = true
    }
  }
  return data
}

export const initBalanceAndDetailData = async (address, chainId, account) => {
  const timestamps = []
  const uniqueData2 = []
  const mergedData = []
  let enrichedData = [],
    sumNetChange = 0,
    sumNetChangeUsd = 0,
    sumLatestNetChange = 0,
    sumLatestNetChangeUsd = 0
  const { data1, flag1 } = await getUserBalanceHistories1(address, chainId, account)
  const { data2, flag2 } = await getUserBalanceHistories2(address, chainId)

  if (flag2) {
    data2.forEach(obj => {
      if (!timestamps.includes(obj.timestamp)) {
        timestamps.push(obj.timestamp)
        const modifiedObj = { ...obj, priceUnderlying: obj.price } // Rename the 'price' property to 'priceUnderlying'
        delete modifiedObj.price // Remove the 'value' property from modifiedObj
        uniqueData2.push(modifiedObj)
      }
    })
  }

  if (flag1 && flag2) {
    let uniqueData = [],
      lastUserEvent = false
    if (data1[0].timestamp > uniqueData2[0].timestamp) {
      let i = 0,
        z = 0,
        addFlag = false

      while (data1[i]?.timestamp > uniqueData2[0].timestamp) {
        data1[i].priceUnderlying = uniqueData2[0].priceUnderlying
        data1[i].sharePrice = uniqueData2[0].sharePrice
        mergedData.push(data1[i])
        i += 1
      }
      while (i < data1.length) {
        if (z < uniqueData2.length) {
          while (uniqueData2[z].timestamp >= data1[i].timestamp) {
            uniqueData2[z].value = data1[i].value
            mergedData.push(uniqueData2[z])
            z += 1
            if (!addFlag && uniqueData2[z].timestamp === data1[i].timestamp) {
              addFlag = true
            }
          }
        }
        if (!addFlag) {
          data1[i].priceUnderlying =
            uniqueData2[z === uniqueData2.length ? z - 1 : z].priceUnderlying
          data1[i].sharePrice = uniqueData2[z === uniqueData2.length ? z - 1 : z].sharePrice
          mergedData.push(data1[i])
        }
        addFlag = false
        i += 1
      }
      while (z < uniqueData2.length) {
        uniqueData2[z].value = 0
        mergedData.push(uniqueData2[z])
        z += 1
      }
      while (i < data1.length) {
        data1[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
        data1[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
        mergedData.push(data1[i])
        i += 1
      }
    } else {
      let i = 0,
        z = 0,
        addFlag = false
      while (i < uniqueData2.length && uniqueData2[i].timestamp > data1[0].timestamp) {
        uniqueData2[i].value = data1[0].value
        mergedData.push(uniqueData2[i])
        i += 1
      }
      while (z < data1.length) {
        if (i < uniqueData2.length) {
          while (uniqueData2[i].timestamp >= data1[z].timestamp) {
            uniqueData2[i].value = data1[z].value
            mergedData.push(uniqueData2[i])
            i += 1
            if (i >= uniqueData2.length) {
              break
            }
            if (!addFlag && uniqueData2[i].timestamp === data1[z].timestamp) {
              addFlag = true
            }
          }
        }
        if (!addFlag) {
          data1[z].priceUnderlying =
            uniqueData2[i === uniqueData2.length ? i - 1 : i].priceUnderlying
          data1[z].sharePrice = uniqueData2[i === uniqueData2.length ? i - 1 : i].sharePrice
          mergedData.push(data1[z])
        }
        addFlag = false
        z += 1
      }
      while (i < uniqueData2.length) {
        uniqueData2[i].value = 0
        mergedData.push(uniqueData2[i])
        i += 1
      }
      while (z < data1.length) {
        data1[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
        data1[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
        mergedData.push(data1[z])
        z += 1
      }
    }

    const filteredData = removeZeroValueObjects(mergedData)

    // Create a map to keep track of unique combinations of 'value' and 'sharePrice'
    const map = new Map()
    filteredData.forEach(item => {
      const key = `${item.value}_${item.sharePrice}`
      map.set(key, item)
    })

    // Convert the map back to an array
    uniqueData = Array.from(map.values())
    uniqueData.sort((a, b) => b.timestamp - a.timestamp)

    enrichedData = uniqueData
      .map((item, index, array) => {
        const nextItem = array[index + 1]
        let event, balance, netChange

        if (Number(item.value) === 0) {
          if (nextItem && Number(nextItem.value) === 0) {
            return false
          }
          balance = '0'
        } else {
          balance = Number(item.value) * Number(item.sharePrice)
        }

        if (nextItem) {
          if (Number(item.value) === Number(nextItem.value)) {
            event = 'Harvest'
          } else if (Number(item.value) > Number(nextItem.value)) {
            event = 'Convert'
          } else {
            event = 'Revert'
          }

          const nextBalance = Number(nextItem.value) * Number(nextItem.sharePrice)
          netChange = balance - nextBalance
        } else {
          event = 'Convert'
          netChange = balance
        }

        return {
          ...item,
          event,
          balance,
          netChange,
        }
      })
      .filter(Boolean)

    sumNetChange = enrichedData.reduce((sumValue, item) => {
      if (item.event === 'Harvest') {
        return sumValue + item.netChange
      }
      return sumValue
    }, 0)
    sumNetChangeUsd = Number(sumNetChange) * Number(enrichedData[0].priceUnderlying)

    enrichedData.forEach(item => {
      if (!lastUserEvent) {
        if (item.event === 'Harvest') {
          sumLatestNetChange += item.netChange
        } else if (item.event === 'Convert' || item.event === 'Revert') {
          lastUserEvent = true
        }
      }
    })
    sumLatestNetChangeUsd = Number(sumLatestNetChange) * Number(enrichedData[0].priceUnderlying)
  }

  return {
    flag1,
    flag2,
    data1,
    mergedData,
    sumNetChange,
    sumNetChangeUsd,
    sumLatestNetChange,
    sumLatestNetChangeUsd,
    enrichedData,
  }
}

export const getTVLData = async (ago, address) => {
  let nowDate = new Date(),
    data = []
  nowDate = Math.floor(nowDate.setDate(nowDate.getDate() - 1) / 1000)
  const startDate = nowDate - 3600 * 24 * ago

  const api = `https://ethparser-api.herokuapp.com/api/transactions/history/tvl/${address}?reduce=1&start=${startDate}&network=eth`
  try {
    await fetch(api)
      .then(async res => {
        res = await res.json()
        if (res.length > 0) {
          data = res.map(a => {
            return [a.calculateTime, a.lastTvl]
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
  }

  return data
}

// eslint-disable-next-line consistent-return
export const getTotalTVLData = async () => {
  try {
    const apiResponse = await axios.get(TOTAL_TVL_API_ENDPOINT)
    const apiData = get(apiResponse, 'data')
    return apiData
  } catch (err) {
    console.log(err)
  }
}

// /**
//  * @param symbol token symbol
//  * @param apiData coingeko data
//  * @dev get token id from api data
//  * ** */
// export function getTokenIdBySymbolInApiData(symbol, apiData) {
//   const symbol = symbol.toLowerCase();
//   for (let ids = 0; ids < apiData.length; ids += 1) {
//     const tempData = apiData[ids]
//     const tempSymbol = tempData.symbol
//     if (tempSymbol.toLowerCase() === symbol.toLowerCase()) {
//       return tempData.id
//     }
//   }
//   return null;
// }
