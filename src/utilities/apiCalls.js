import axios from 'axios'
import { get } from 'lodash'
import { CHAIN_IDS } from '../data/constants'
import {
  GRAPH_URLS,
  TOTAL_TVL_API_ENDPOINT,
  GECKO_URL,
  COINGECKO_API_KEY,
  LEADERBOARD_API_ENDPOINT,
  IPOR_API_URL,
} from '../constants'
import { fromWei } from '../services/viem'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const farm = '0xa0246c9032bc3a600820415ae600c6388619a14d'
const ifarm = '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'

const executeGraphCall = async (url, query, variables, retries = 10, delayMs = 5000) => {
  let retry = 0,
    response
  try {
    response = await axios.post(url, {
      query,
      variables,
    })
  } catch (error) {
    response = error.response
  }

  while (retry < retries && (!response || response.status !== 200)) {
    console.warn(`Error in subgraph call. Retry ${retry + 1}. Retrying after ${delayMs}ms...`)

    await delay(delayMs)
    try {
      response = await axios.post(url, {
        query,
        variables,
      })
    } catch (error) {
      response = error.response
    }
    retry += 1
  }
  const data = get(response, 'data.data')
  if (data) {
    return data
  }
  return null
}

export const getLastHarvestInfo = async (address, chainId) => {
  let result = ''
  const nowDate = Math.floor(new Date().getTime() / 1000)

  address = address.toLowerCase()

  const query = `
    query getLastHarvestInfo($vault: String!) {
      vaultHistories(
        first: 1,
        where: {
          vault: $vault,
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        timestamp
      }
    }
  `
  const variables = address === farm ? { vault: ifarm } : { vault: address }
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, variables)
  const hisData = data.vaultHistories

  if (hisData && hisData.length !== 0) {
    const timeStamp = hisData[0].timestamp
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
    result = `${`${dayString !== '' ? `${dayString} ` : ''}${
      hourString !== '' ? `${hourString} ` : ''
    }`}${minString}`
  }
  return result
}

export const getPublishDate = async () => {
  const allData = [],
    allFlags = []

  const graphqlQueries = [
    {
      url: GRAPH_URLS[CHAIN_IDS.ETH_MAINNET],
      query: `{
        vaults(
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id, timestamp
        }
      }`,
    },
    {
      url: GRAPH_URLS[CHAIN_IDS.POLYGON_MAINNET],
      query: `{
        vaults(
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id, timestamp
        }
      }`,
    },
    {
      url: GRAPH_URLS[CHAIN_IDS.BASE],
      query: `{
        vaults(
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id, timestamp
        }
      }`,
    },
    {
      url: GRAPH_URLS[CHAIN_IDS.ARBITRUM_ONE],
      query: `{
        vaults(
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id, timestamp
        }
      }`,
    },
    {
      url: GRAPH_URLS[CHAIN_IDS.ZKSYNC],
      query: `{
        vaults(
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id, timestamp
        }
      }`,
    },
  ]

  try {
    const results = await Promise.all(
      graphqlQueries.map(({ url, query }) => executeGraphCall(url, query, {})),
    )

    results.forEach(data => {
      allData.push(...data.vaults)
      allFlags.push(data.vaults.length > 0)
    })
  } catch (err) {
    console.error('Error fetching data:', err)
    return { data: [], flag: false }
  }

  const combinedFlags = allFlags.every(flag => flag)
  return { data: allData, flag: combinedFlags }
}

export const getSequenceId = async (address, chainId) => {
  let vaultTVLCount,
    vaultPriceFeedCount,
    vaultsFlag = true

  address = address.toLowerCase()
  const vaultAddress = address === ifarm ? farm : address

  const query = `
    {
      vaults(
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id, tvlSequenceId, priceFeedSequenceId
      }
    }
  `
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, {})
  const vaultsData = data ? data.vaults : []

  if (!vaultsData || vaultsData.length === 0) {
    vaultsFlag = false
  } else {
    const matchingVault = vaultsData.find(vault => vault.id === vaultAddress)
    if (matchingVault) {
      vaultTVLCount = matchingVault.tvlSequenceId
      vaultPriceFeedCount = matchingVault.priceFeedSequenceId
    }
  }

  return { vaultTVLCount, vaultPriceFeedCount, vaultsFlag }
}

export const getIPORSequenceId = async (vault, chainId) => {
  let vaultTVLCount

  const query = `
    query getVaultHistories($vault: String!) {
      plasmaVaultHistories(
        where: {
          plasmaVault: $vault,
        },
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        historySequenceId
      }
    }
  `
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, { vault })
  const vaultsData = data ? data.plasmaVaultHistories : []

  if (!vaultsData || vaultsData.length === 0) {
    vaultTVLCount = 0
  } else if (vaultsData) {
    vaultTVLCount = vaultsData[0].historySequenceId
  }

  return { vaultTVLCount }
}

export const getVaultHistories = async (address, chainId, isIPOR = false) => {
  let vaultHistoryData = [],
    vaultHistoryFlag = true,
    query,
    variables

  address = address.toLowerCase()

  if (isIPOR) {
    query = `
      query getVaultHistories($vault: String!) {
        plasmaVaultHistories(
          where: {
            plasmaVault: $vault,
          },
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          tvl, apy, priceUnderlying, sharePrice, timestamp
        }
      }
    `
    variables = { vault: address }
  } else {
    query = `
      query getVaultHistories($vault: String!) {
        vaultHistories(
          first: 1000,
          where: {
            vault: $vault,
          },
          orderBy: timestamp,
          orderDirection: desc
        ) {
          priceUnderlying, sharePrice, timestamp
        }
      }
    `
    variables = address === farm ? { vault: ifarm } : { vault: address }
  }

  const url = GRAPH_URLS[chainId]

  try {
    const data = await executeGraphCall(url, query, variables)

    if (isIPOR) {
      vaultHistoryData = data?.plasmaVaultHistories || []
    } else {
      vaultHistoryData = data?.vaultHistories || []
    }
  } catch (e) {
    console.error('Error fetching vault histories:', e)
    return { vaultHData: [], vaultHFlag: false, error: e }
  }

  if (!vaultHistoryData || vaultHistoryData.length === 0) {
    vaultHistoryFlag = false
    return { vaultHData: [], vaultHFlag: false }
  }

  vaultHistoryData = vaultHistoryData.map(item => ({
    ...item,
    vaultId: address,
  }))

  return {
    vaultHData: vaultHistoryData,
    vaultHFlag: vaultHistoryFlag,
  }
}

export const getMultiVaultHistories = async (addresses, chainId, isIPOR = false) => {
  let vaultHistoryData = [],
    vaultHistoryFlag = true,
    query,
    variables

  const processedAddresses = addresses.map(address => {
    const lowerAddress = address.toLowerCase()
    return lowerAddress === farm ? ifarm : lowerAddress
  })

  if (isIPOR) {
    query = `
      query getMultipleVaultHistories($vaults: [String!]) {
        plasmaVaultHistories(
          where: {
            plasmaVault_in: $vaults,
          },
          first: 1000,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          tvl, apy, priceUnderlying, sharePrice, timestamp, plasmaVault{id}
        }
      }
    `
  } else {
    query = `
      query getMultipleVaultHistories($vaults: [String!]) {
        vaultHistories(
          first: 1000,
          where: {
            vault_in: $vaults,
          },
          orderBy: timestamp,
          orderDirection: desc
        ) {
          priceUnderlying, sharePrice, timestamp, vault{id}
        }
      }
    `
  }
  variables = { vaults: processedAddresses }

  const url = GRAPH_URLS[chainId]

  try {
    const data = await executeGraphCall(url, query, variables)

    if (isIPOR) {
      vaultHistoryData = data?.plasmaVaultHistories || []
    } else {
      vaultHistoryData = data?.vaultHistories || []
    }
  } catch (e) {
    console.error('Error fetching vault histories:', e)
    return {
      vaultHFlag: false,
      error: e,
      groupedHistories: {},
    }
  }

  if (!vaultHistoryData || vaultHistoryData.length === 0) {
    vaultHistoryFlag = false
    return {
      vaultHFlag: false,
      groupedHistories: {},
    }
  }

  vaultHistoryData = vaultHistoryData.map(item => {
    const vaultId = isIPOR ? item.plasmaVault?.id : item.vault?.id
    return {
      ...item,
      vaultId,
    }
  })

  const groupedHistories = vaultHistoryData.reduce((result, item) => {
    const vaultId = item.vaultId

    if (!vaultId) return result

    if (!result[vaultId]) {
      result[vaultId] = []
    }

    result[vaultId].push(item)

    return result
  }, {})

  return {
    vaultHFlag: vaultHistoryFlag,
    groupedHistories,
  }
}

export const getMultipleVaultHistories = async (vaults, startTime, chainId) => {
  let vaultHData = [],
    vaultHFlag = true,
    run = true,
    lastLn = 0,
    finishTime = Math.floor(new Date().getTime() / 1000)

  vaults = vaults.map(address => address.toLowerCase())
  vaults = vaults.map(address => (address === farm ? ifarm : address))

  const query = `
    query getVaultHistories($vaults: [String!], $startTime: BigInt!, $finishTime: BigInt!) {
      vaultHistories(
        first: 1000,
        where: {
          vault_in: $vaults,
          timestamp_gte: $startTime,
          timestamp_lte: $finishTime
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        priceUnderlying, sharePriceDec, timestamp, vault{id}
      }
    }
  `

  const url = GRAPH_URLS[chainId]
  while (run) {
    const variables = { vaults, startTime, finishTime }

    const data = await executeGraphCall(url, query, variables)
    vaultHData = vaultHData.concat(data?.vaultHistories)
    if (vaultHData.length % 1000 === 0 && vaultHData.length > lastLn) {
      lastLn = vaultHData.length
      finishTime = vaultHData[vaultHData.length - 1].timestamp
    } else {
      run = false
    }
  }

  if (!vaultHData || vaultHData.length === 0) {
    vaultHFlag = false
  }

  return { vaultHData, vaultHFlag }
}

export const getDataQuery = async (
  address,
  chainId,
  vaultTVLCount,
  asQuery,
  timestamp,
  chartData = {},
) => {
  const sequenceIdsArray = []
  if (vaultTVLCount > 10000) {
    const step = Math.ceil(vaultTVLCount / 2000)
    for (let i = 1; i <= vaultTVLCount; i += step) {
      sequenceIdsArray.push(i)
    }
  } else if (vaultTVLCount > 1000) {
    const step = Math.ceil(vaultTVLCount / 1000)
    for (let i = 1; i <= vaultTVLCount; i += step) {
      sequenceIdsArray.push(i)
    }
  } else {
    for (let i = 1; i <= vaultTVLCount; i += 1) {
      sequenceIdsArray.push(i)
    }
  }

  const nowTime = Math.floor(new Date().getTime() / 1000)
  const timestampQuery = asQuery ? timestamp : nowTime
  address = address.toLowerCase()

  const query = `
    query getData($vault: String!, $endTime: BigInt, $sequenceIds: [Int!]) {
      generalApies(
        first: 1000,
        where: {
          vault: $vault,
        }, 
        orderBy: timestamp, 
        orderDirection: desc
      ) { 
        apy, timestamp
      }
      tvls(
        first: 1000,
        where: {
          vault: $vault, 
          timestamp_lt: $endTime,
          tvlSequenceId_in: $sequenceIds
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        value, timestamp
      },
      vaultHistories(
        first: 1000,
        where: {
          vault: $vault,
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        priceUnderlying, sharePrice, timestamp
      }
    }
  `
  const variables =
    address === farm
      ? { vault: ifarm, endTime: timestampQuery, sequenceIds: sequenceIdsArray }
      : { vault: address, endTime: timestampQuery, sequenceIds: sequenceIdsArray }
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, variables)
  // To merge the response data into the chartData object
  Object.keys(data).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(chartData, key)) {
      chartData[key] = data[key]
    } else if (Array.isArray(chartData[key]) && Array.isArray(data[key])) {
      chartData[key].push(...data[key])
    } else if (typeof chartData[key] === 'object' && typeof data[key] === 'object') {
      Object.assign(chartData[key], data[key])
    } else {
      chartData[key] = data[key]
    }
  })
  const dataTimestamp = Number(
    chartData.vaultHistories[chartData.vaultHistories.length - 1].timestamp,
  )
  const initTimestamp = Number(chartData.generalApies[chartData.generalApies.length - 1].timestamp)

  if (data.tvls.length === 1000 && dataTimestamp > initTimestamp) {
    await getDataQuery(address, chainId, vaultTVLCount, true, dataTimestamp, chartData)
  }
  return chartData
}

export const getRewardEntities = async (account, address, chainId) => {
  let rewardsData = [],
    rewardsFlag = true

  address = address.toLowerCase()
  const vaultAddress = address === farm ? ifarm : address

  if (account) {
    account = account.toLowerCase()
  }

  const query = `
    query getRewardEntities($vault: String!, $account: String!) {
      rewardPaidEntities(
        first:1000,
        where: {
          userAddress: $account,
          pool_: {
            vault: $vault,
          }
        },
        orderBy: timestamp,
        orderDirection: desc,
      ) {
        price,
        value,
        pool {
          vault {
            id
          }
        },
        token {
          symbol,
          decimals,
        },
        timestamp,
      }
    }
  `
  const variables = { vault: vaultAddress, account }
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, variables)
  rewardsData = data ? data.rewardPaidEntities : []

  if (!rewardsData || rewardsData.length === 0) {
    rewardsFlag = false
  }

  return { rewardsData, rewardsFlag }
}

export const getAllRewardEntities = async account => {
  const rewardsAPIData = []

  if (account) {
    account = account.toLowerCase()
  }

  const query = `
    query getRewardEntities($account: String!) {
      rewardPaidEntities(
        first:1000,
        where: {
          userAddress: $account,
        },
        orderBy: timestamp,
        orderDirection: desc,
      ) {
        price,
        value,
        pool {
          vault {
            id
          }
        },
        token {
          symbol,
          decimals,
        },
        timestamp,
      }
    }
  `
  const variables = { account }
  const urls = [
    GRAPH_URLS[CHAIN_IDS.ETH_MAINNET],
    GRAPH_URLS[CHAIN_IDS.POLYGON_MAINNET],
    GRAPH_URLS[CHAIN_IDS.BASE],
    GRAPH_URLS[CHAIN_IDS.ARBITRUM_ONE],
  ]

  const results = await Promise.all(urls.map(url => executeGraphCall(url, query, variables)))
  results.forEach(userRewardsData => {
    if (userRewardsData && Array.isArray(userRewardsData.rewardPaidEntities)) {
      userRewardsData.rewardPaidEntities.forEach(reward => {
        rewardsAPIData.push(reward)
      })
    }
  })
  rewardsAPIData.sort((a, b) => b.timestamp - a.timestamp)

  return { rewardsAPIData }
}

export const getIPORDataQuery = async (
  vault,
  chainId,
  vaultTVLCount,
  asQuery,
  timestamp,
  chartData = {},
) => {
  const sequenceIdsArray = []
  if (vaultTVLCount > 10000) {
    const step = Math.ceil(vaultTVLCount / 2000)
    for (let i = 1; i <= vaultTVLCount; i += step) {
      sequenceIdsArray.push(i)
    }
  } else if (vaultTVLCount > 1000) {
    const step = Math.ceil(vaultTVLCount / 1000)
    for (let i = 1; i <= vaultTVLCount; i += step) {
      sequenceIdsArray.push(i)
    }
  } else {
    for (let i = 1; i <= vaultTVLCount; i += 1) {
      sequenceIdsArray.push(i)
    }
  }

  const nowTime = Math.floor(new Date().getTime() / 1000)
  const timestampQuery = asQuery ? timestamp : nowTime

  const query = `
    query getData($vault: String!, $endTime: BigInt, $sequenceIds: [Int!]) {
    generalApies: plasmaVaultHistories(
        where: {
          plasmaVault: $vault,
        },
        first: 1000,
        orderBy: timestamp, 
        orderDirection: desc
      ) { 
        apy, timestamp
      }
      tvls: plasmaVaultHistories(
        first: 1000,
        where: {
          plasmaVault: $vault,
          timestamp_lt: $endTime,
          historySequenceId_in: $sequenceIds
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        tvl, timestamp
      },
      vaultHistories: plasmaVaultHistories(
        where: {
          plasmaVault: $vault,
        },
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        priceUnderlying, sharePrice, timestamp
      }
    }
  `
  const variables = { vault, endTime: timestampQuery, sequenceIds: sequenceIdsArray }
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, variables)
  // To merge the response data into the chartData object
  Object.keys(data).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(chartData, key)) {
      chartData[key] = data[key]
    } else if (Array.isArray(chartData[key]) && Array.isArray(data[key])) {
      chartData[key].push(...data[key])
    } else if (typeof chartData[key] === 'object' && typeof data[key] === 'object') {
      Object.assign(chartData[key], data[key])
    } else {
      chartData[key] = data[key]
    }
  })

  const dataTimestamp = Number(chartData.tvls[chartData.tvls.length - 1]?.timestamp)
  const initTimestamp = Number(chartData.generalApies[chartData.generalApies.length - 1]?.timestamp)

  if (data.tvls.length === 1000 && dataTimestamp > initTimestamp) {
    await getDataQuery(vaultTVLCount, true, dataTimestamp, chartData)
  }

  chartData.tvls.forEach(obj => {
    obj.value = obj.tvl
    delete obj.tvl
  })

  return chartData
}

export const getUserBalanceHistories = async (address, chainId, account, isIPOR = false) => {
  let balanceData = [],
    balanceFlag = true,
    query,
    variables

  if (account) {
    account = account.toLowerCase()
  }
  address = address.toLowerCase()

  if (isIPOR) {
    query = `
      query getUserBalanceHistories($vault: String!, $account: String!) {
        plasmaUserBalanceHistories(
          first: 1000,
          where: {
            plasmaVault: $vault,
            userAddress: $account,
          },
          orderBy: timestamp,
          orderDirection: desc,
        ) {
          value, timestamp, plasmaVault{id}
        }
      }
    `
  } else {
    query = `
      query getUserBalanceHistories($vault: String!, $account: String!) {
        userBalanceHistories(
          first: 1000,
          where: {
            vault: $vault,
            userAddress: $account,
          },
          orderBy: timestamp,
          orderDirection: desc,
        ) {
          value, timestamp, vault{id}
        }
      }
    `
  }

  variables = address === farm ? { vault: ifarm, account } : { vault: address, account }
  const url = GRAPH_URLS[chainId]

  try {
    const data = await executeGraphCall(url, query, variables)

    if (isIPOR) {
      balanceData = data?.plasmaUserBalanceHistories || []
    } else {
      balanceData = data?.userBalanceHistories || []
    }
  } catch (e) {
    console.error('Error fetching user balance histories:', e)
    return { balanceData: [], balanceFlag: false, error: e }
  }

  if (!balanceData || balanceData.length === 0) {
    balanceFlag = false
  }

  balanceData = balanceData.map(item => ({
    ...item,
    vaultId: isIPOR ? item.plasmaVault?.id : item.vault?.id,
  }))

  return { balanceData, balanceFlag }
}

export const getMultipleUserBalanceHistories = async (
  addresses,
  chainId,
  account,
  isIPOR = false,
) => {
  let balanceData = [],
    balanceFlag = true,
    query,
    variables

  if (account) {
    account = account.toLowerCase()
  }

  // Process addresses to lowercase and replace farm with ifarm
  const processedAddresses = addresses.map(address => {
    const lowerAddress = address.toLowerCase()
    return lowerAddress === farm ? ifarm : lowerAddress
  })

  if (isIPOR) {
    query = `
      query getMultipleUserBalanceHistories($vaults: [String!]!, $account: String!) {
        plasmaUserBalanceHistories(
          first: 1000,
          where: {
            plasmaVault_in: $vaults,
            userAddress: $account,
          },
          orderBy: timestamp,
          orderDirection: desc,
        ) {
          value, timestamp, plasmaVault{id}
        }
      }
    `
  } else {
    query = `
      query getMultipleUserBalanceHistories($vaults: [String!]!, $account: String!) {
        userBalanceHistories(
          first: 1000,
          where: {
            vault_in: $vaults,
            userAddress: $account,
          },
          orderBy: timestamp,
          orderDirection: desc,
        ) {
          value, timestamp, vault{id}
        }
      }
    `
  }

  variables = { vaults: processedAddresses, account }
  const url = GRAPH_URLS[chainId]

  try {
    const data = await executeGraphCall(url, query, variables)

    if (isIPOR) {
      balanceData = data?.plasmaUserBalanceHistories || []
    } else {
      balanceData = data?.userBalanceHistories || []
    }
  } catch (e) {
    console.error('Error fetching user balance histories:', e)
    return { balanceFlag: false, error: e, groupedBalances: {} }
  }

  if (!balanceData || balanceData.length === 0) {
    balanceFlag = false
    return { balanceFlag: false, groupedBalances: {} }
  }

  const groupedBalances = balanceData.reduce((result, item) => {
    const vaultId = isIPOR ? item.plasmaVault?.id : item.vault?.id

    if (!vaultId) return result

    if (!result[vaultId]) {
      result[vaultId] = []
    }

    result[vaultId].push({
      ...item,
      vaultId, // Add vaultId directly to the item for easier access
    })

    return result
  }, {})

  return {
    balanceFlag,
    groupedBalances,
  }
}

export const getIPORLastHarvestInfo = async (vaultAdr, chainId) => {
  let result = ''
  const nowDate = Math.floor(new Date().getTime() / 1000)

  const query = `
    query getLastHarvestInfo($vaultAdr: String!){
      plasmaVaultHistories(
        where: {
          plasmaVault: $vaultAdr,
        },
        first: 1,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        timestamp
      }
    }
`
  const variables = { vaultAdr }
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, variables)
  const hisData = data?.plasmaVaultHistories

  if (hisData && hisData.length !== 0) {
    const timeStamp = hisData[0].timestamp
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
    result = `${`${dayString !== '' ? `${dayString} ` : ''}${
      hourString !== '' ? `${hourString} ` : ''
    }`}${minString}`
  }
  return result
}

export const getPriceFeeds = async (
  address,
  chainId,
  vaultPriceFeedCount,
  firstTimeStamp,
  timestamp,
  asQuery,
  priceFeedData = [],
) => {
  let priceFeedFlag = true
  const sequenceIdsArray = []

  if (vaultPriceFeedCount > 10000) {
    const step = Math.ceil(vaultPriceFeedCount / 2000)
    for (let i = 1; i <= vaultPriceFeedCount; i += step) {
      sequenceIdsArray.push(i)
    }
  } else if (vaultPriceFeedCount > 1000) {
    const step = Math.ceil(vaultPriceFeedCount / 1000)
    for (let i = 1; i <= vaultPriceFeedCount; i += step) {
      sequenceIdsArray.push(i)
    }
  } else {
    for (let i = 1; i <= vaultPriceFeedCount; i += 1) {
      sequenceIdsArray.push(i)
    }
  }

  address = address.toLowerCase()
  const nowTime = Math.floor(new Date().getTime() / 1000)
  const timestampQuery = timestamp && asQuery ? timestamp : nowTime

  const query = `
    query getPriceFeeds($vault: String!, $endTime: BigInt, $sequenceIds: [Int!]) {
      priceFeeds(
        first: 1000,
        where: {
          vault: $vault,
          timestamp_lt: $endTime,
          priceFeedSequenceId_in: $sequenceIds,
        },
        orderBy: timestamp,
        orderDirection: desc,
      ) {
        sharePrice, price, timestamp
      }
    }
  `
  const variables =
    address === ifarm
      ? { vault: farm, endTime: timestampQuery, sequenceIds: sequenceIdsArray }
      : { vault: address, endTime: timestampQuery, sequenceIds: sequenceIdsArray }
  const url = GRAPH_URLS[chainId]

  const data = await executeGraphCall(url, query, variables)

  if (data && data.priceFeeds) {
    if (data.priceFeeds.length > 0) {
      priceFeedData.push(...data.priceFeeds)
      const dataTimestamp = priceFeedData[priceFeedData.length - 1]?.timestamp
      if (Number(dataTimestamp) > Number(firstTimeStamp)) {
        return getPriceFeeds(
          address,
          chainId,
          vaultPriceFeedCount,
          firstTimeStamp,
          dataTimestamp,
          true,
          priceFeedData,
        )
      }
    }
  } else {
    console.error('Error: Unable to retrieve price feeds from the response.')
    priceFeedFlag = false
  }

  if (priceFeedData.length === 0) {
    priceFeedFlag = false
  }
  return { priceFeedData, priceFeedFlag }
}

const removeZeroValueObjects = data => {
  let nonZeroValueEncountered = false
  const dl = data.length
  for (let i = dl - 1; i >= 0; i -= 1) {
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

const processBalanceAndVaultData = (
  balanceData,
  vaultData,
  tokenDecimals,
  vaultDecimals = 8,
  isIPORVault = false,
) => {
  const timestamps = []
  const uniqueVaultHData = []
  const updatedBalanceData = []
  const mergedData = []
  let enrichedData = [],
    sumNetChange = 0,
    sumNetChangeUsd = 0,
    sumLatestNetChange = 0,
    sumLatestNetChangeUsd = 0

  if (vaultData && vaultData.length > 0) {
    vaultData.forEach(obj => {
      if (!timestamps.includes(obj.timestamp)) {
        timestamps.push(obj.timestamp)
        const sharePriceDecimals = fromWei(obj.sharePrice, tokenDecimals, tokenDecimals)
        const modifiedObj = { ...obj, sharePrice: sharePriceDecimals }
        uniqueVaultHData.push(modifiedObj)
      }
    })
  }

  if (isIPORVault && balanceData && balanceData.length > 0) {
    balanceData.forEach(obj => {
      timestamps.push(obj.timestamp)
      const valueDecimals = fromWei(obj.value, vaultDecimals, vaultDecimals)
      const modifiedObj = { ...obj, value: valueDecimals }
      updatedBalanceData.push(modifiedObj)
    })
  }

  if (balanceData && balanceData.length > 0 && uniqueVaultHData.length > 0) {
    let uniqueData = [],
      uniqueFixedData = [],
      lastUserEvent = false,
      lastUserEventUsd = false,
      lastKnownSharePrice = null,
      lastKnownPriceUnderlying = null

    const processedBalanceData = isIPORVault ? updatedBalanceData : balanceData

    if (isIPORVault) {
      processedBalanceData.sort((a, b) => b.timestamp - a.timestamp)
      uniqueVaultHData.sort((a, b) => b.timestamp - a.timestamp)
    }

    const bl = processedBalanceData.length
    const ul = uniqueVaultHData.length

    if (isIPORVault) {
      let i = 0,
        z = 0
      while (i < bl || z < ul) {
        if (
          i < bl &&
          (z >= ul || processedBalanceData[i].timestamp > (uniqueVaultHData[z]?.timestamp || 0))
        ) {
          // Balance entry without a matching Vault entry
          const balanceEntry = { ...processedBalanceData[i] }
          balanceEntry.priceUnderlying =
            uniqueVaultHData[z - 1]?.priceUnderlying || lastKnownPriceUnderlying
          balanceEntry.sharePrice = uniqueVaultHData[z - 1]?.sharePrice || lastKnownSharePrice
          balanceEntry.tvl = uniqueVaultHData[z - 1]?.tvl || 0
          balanceEntry.apy = uniqueVaultHData[z - 1]?.apy || 0
          mergedData.push(balanceEntry)
          i += 1
        } else {
          // Vault entry, possibly matching a Balance entry
          const vaultEntry = { ...uniqueVaultHData[z] }
          vaultEntry.value = processedBalanceData[i]?.value || 0
          mergedData.push(vaultEntry)
          z += 1
        }
      }
    } else {
      if (processedBalanceData[0].timestamp > uniqueVaultHData[0].timestamp) {
        let i = 0,
          z = 0,
          addFlag = false

        while (processedBalanceData[i]?.timestamp > uniqueVaultHData[0].timestamp) {
          processedBalanceData[i].priceUnderlying = uniqueVaultHData[0].priceUnderlying
          processedBalanceData[i].sharePrice = uniqueVaultHData[0].sharePrice
          mergedData.push(processedBalanceData[i])
          i += 1
        }

        while (i < bl) {
          if (z < ul) {
            while (z < ul && uniqueVaultHData[z].timestamp >= processedBalanceData[i].timestamp) {
              uniqueVaultHData[z].value = processedBalanceData[i].value
              mergedData.push(uniqueVaultHData[z])
              z += 1
              if (
                z < ul &&
                !addFlag &&
                uniqueVaultHData[z]?.timestamp === processedBalanceData[i].timestamp
              ) {
                addFlag = true
              }
            }
          }

          if (!addFlag) {
            processedBalanceData[i].priceUnderlying =
              uniqueVaultHData[z === ul ? z - 1 : z]?.priceUnderlying ||
              uniqueVaultHData[ul - 1].priceUnderlying
            processedBalanceData[i].sharePrice =
              uniqueVaultHData[z === ul ? z - 1 : z]?.sharePrice ||
              uniqueVaultHData[ul - 1].sharePrice
            mergedData.push(processedBalanceData[i])
          }

          addFlag = false
          i += 1
        }

        while (z < ul) {
          uniqueVaultHData[z].value = 0
          mergedData.push(uniqueVaultHData[z])
          z += 1
        }

        while (i < bl) {
          processedBalanceData[i].priceUnderlying = uniqueVaultHData[ul - 1].priceUnderlying
          processedBalanceData[i].sharePrice = uniqueVaultHData[ul - 1].sharePrice
          mergedData.push(processedBalanceData[i])
          i += 1
        }
      } else {
        let i = 0,
          z = 0,
          addFlag = false

        while (i < ul && uniqueVaultHData[i].timestamp > processedBalanceData[0].timestamp) {
          uniqueVaultHData[i].value = processedBalanceData[0].value
          mergedData.push(uniqueVaultHData[i])
          i += 1
        }

        while (z < bl) {
          if (i < ul) {
            while (i < ul && uniqueVaultHData[i].timestamp >= processedBalanceData[z].timestamp) {
              uniqueVaultHData[i].value = processedBalanceData[z].value
              mergedData.push(uniqueVaultHData[i])
              i += 1
              if (i >= ul) {
                break
              }
              if (
                !addFlag &&
                uniqueVaultHData[i]?.timestamp === processedBalanceData[z].timestamp
              ) {
                addFlag = true
              }
            }
          }

          if (!addFlag) {
            processedBalanceData[z].priceUnderlying =
              uniqueVaultHData[i === ul ? i - 1 : i]?.priceUnderlying ||
              uniqueVaultHData[ul - 1].priceUnderlying
            processedBalanceData[z].sharePrice =
              uniqueVaultHData[i === ul ? i - 1 : i]?.sharePrice ||
              uniqueVaultHData[ul - 1].sharePrice
            mergedData.push(processedBalanceData[z])
          }

          addFlag = false
          z += 1
        }

        while (i < ul) {
          uniqueVaultHData[i].value = 0
          mergedData.push(uniqueVaultHData[i])
          i += 1
        }

        while (z < bl) {
          processedBalanceData[z].priceUnderlying = uniqueVaultHData[ul - 1].priceUnderlying
          processedBalanceData[z].sharePrice = uniqueVaultHData[ul - 1].sharePrice
          mergedData.push(processedBalanceData[z])
          z += 1
        }
      }
    }

    const filteredData = removeZeroValueObjects(mergedData)

    const map = new Map()
    filteredData.forEach(item => {
      const key = `${item.value}_${item.sharePrice}`
      map.set(key, item)
    })

    uniqueData = Array.from(map.values())
    uniqueData.sort((a, b) => b.timestamp - a.timestamp)

    uniqueFixedData = uniqueData.map(item => {
      if (item.sharePrice === '0') {
        item.sharePrice = lastKnownSharePrice !== null ? lastKnownSharePrice : item.sharePrice
      } else {
        lastKnownSharePrice = item.sharePrice
      }

      if (item.priceUnderlying === '0') {
        item.priceUnderlying =
          lastKnownPriceUnderlying !== null ? lastKnownPriceUnderlying : item.priceUnderlying
      } else {
        lastKnownPriceUnderlying = item.priceUnderlying
      }

      return item
    })

    enrichedData = uniqueFixedData
      .map((item, index, array) => {
        const nextItem = array[index + 1]
        let event, balance, balanceUsd, netChange, netChangeUsd

        if (Number(item.value) === 0) {
          if (nextItem && Number(nextItem.value) === 0) {
            return false
          }
          balance = '0'
          balanceUsd = '0'
        } else {
          balance = Number(item.value) * Number(item.sharePrice)
          balanceUsd = balance * Number(item.priceUnderlying)
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
          netChangeUsd = Number(netChange) * Number(item.priceUnderlying)
        } else {
          event = 'Convert'
          netChange = balance
          netChangeUsd = netChange * Number(item.priceUnderlying)
        }

        return {
          ...item,
          event,
          balance,
          balanceUsd,
          netChange,
          netChangeUsd,
        }
      })
      .filter(Boolean)

    sumNetChange = enrichedData.reduce((sumValue, item) => {
      if (item.event === 'Harvest') {
        return sumValue + item.netChange
      }
      return sumValue
    }, 0)

    sumNetChangeUsd = enrichedData.reduce((sumUsdValue, item) => {
      if (item.event === 'Harvest') {
        return sumUsdValue + item.netChangeUsd
      }
      return sumUsdValue
    }, 0)

    // Calculate latest net change values
    enrichedData.forEach(item => {
      if (!lastUserEvent) {
        if (item.event === 'Harvest') {
          sumLatestNetChange += item.netChange
        } else if (item.event === 'Convert' || item.event === 'Revert') {
          lastUserEvent = true
        }
      }
    })

    enrichedData.forEach(item => {
      if (!lastUserEventUsd) {
        if (item.event === 'Harvest') {
          sumLatestNetChangeUsd += item.netChangeUsd
        } else if (item.event === 'Convert' || item.event === 'Revert') {
          lastUserEventUsd = true
        }
      }
    })
  }

  return {
    sumNetChange,
    sumNetChangeUsd,
    sumLatestNetChange,
    sumLatestNetChangeUsd,
    enrichedData,
    uniqueVaultHData,
  }
}

export const initBalanceAndDetailData = async (
  address,
  chainId,
  account,
  tokenDecimals,
  isIPORVault = false,
  vaultDecimals = 8,
) => {
  let bFlag = false,
    vHFlag = false,
    balanceData,
    vaultData
  address = address.toLowerCase()

  const balanceResult = await getUserBalanceHistories(address, chainId, account, isIPORVault)
  const vaultResult = await getVaultHistories(address, chainId, isIPORVault)

  balanceData = balanceResult.balanceData
  vaultData = vaultResult.vaultHData
  bFlag = balanceResult.balanceFlag
  vHFlag = vaultResult.vaultHFlag

  const result = processBalanceAndVaultData(
    balanceData,
    vaultData,
    tokenDecimals,
    vaultDecimals,
    isIPORVault,
  )

  return {
    bFlag,
    vHFlag,
    ...result,
  }
}

export const initMultipleBalanceAndDetailData = async (
  addresses,
  chainId,
  account,
  isIPORVault = false,
  vaultDataMap = null,
) => {
  const balanceResult = await getMultipleUserBalanceHistories(
    addresses,
    chainId,
    account,
    isIPORVault,
  )
  const vaultResult = await getMultiVaultHistories(addresses, chainId, isIPORVault)

  const balancesData = balanceResult.groupedBalances
  const vaultsData = vaultResult.groupedHistories
  const bFlag = balanceResult.balanceFlag
  const vHFlag = vaultResult.vaultHFlag

  // Initialize result objects
  const processedResults = {}
  let totalSumNetChange = 0,
    totalSumNetChangeUsd = 0,
    totalSumLatestNetChange = 0,
    totalSumLatestNetChangeUsd = 0,
    allEnrichedData = []

  const vaultIds = new Set([...Object.keys(balancesData), ...Object.keys(vaultsData)])

  for (const vaultId of vaultIds) {
    const balanceData = balancesData[vaultId] || []
    const vaultHistoryData = vaultsData[vaultId] || []

    if (balanceData.length === 0 || vaultHistoryData.length === 0) {
      continue
    }

    const defaultTokenDecimals = 18
    const defaultVaultDecimals = 8

    let vaultTokenDecimals = defaultTokenDecimals,
      vaultVaultDecimals = defaultVaultDecimals

    if (vaultDataMap && vaultId in vaultDataMap && vaultDataMap[vaultId]) {
      vaultTokenDecimals = vaultDataMap[vaultId].tokenDecimals || defaultTokenDecimals
      vaultVaultDecimals = vaultDataMap[vaultId].vaultDecimals || defaultVaultDecimals
    }

    const result = processBalanceAndVaultData(
      balanceData,
      vaultHistoryData,
      vaultTokenDecimals,
      vaultVaultDecimals,
      isIPORVault,
    )

    processedResults[vaultId] = result

    totalSumNetChange += result.sumNetChange || 0
    totalSumNetChangeUsd += result.sumNetChangeUsd || 0
    totalSumLatestNetChange += result.sumLatestNetChange || 0
    totalSumLatestNetChangeUsd += result.sumLatestNetChangeUsd || 0

    if (result.enrichedData && result.enrichedData.length > 0) {
      const vaultEnrichedData = result.enrichedData.map(item => ({
        ...item,
        vaultId,
      }))
      allEnrichedData = allEnrichedData.concat(vaultEnrichedData)
    }
  }

  allEnrichedData.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))

  return {
    bFlag,
    vHFlag,
    sumNetChange: totalSumNetChange,
    sumNetChangeUsd: totalSumNetChangeUsd,
    sumLatestNetChange: totalSumLatestNetChange,
    sumLatestNetChangeUsd: totalSumLatestNetChangeUsd,
    enrichedData: allEnrichedData,
    processedResults, // Individual results for each vault
    vaultIds: Array.from(vaultIds), // List of processed vault IDs
  }
}

export const getTotalTVLData = async () => {
  try {
    const apiResponse = await axios.get(TOTAL_TVL_API_ENDPOINT)
    const apiData = get(apiResponse, 'data')
    return apiData
  } catch (err) {
    console.log(err)
    return null
  }
}

export const getCoinListFromApi = async () => {
  try {
    const response = await axios.get(`${GECKO_URL}coins/list`, {
      headers: {
        'x-cg-pro-api-key': COINGECKO_API_KEY,
      },
    })
    return response.data
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
    return []
  }
}

export const getTokenPriceFromApi = async tokenID => {
  try {
    const response = await axios.get(`${GECKO_URL}simple/price`, {
      params: {
        ids: tokenID,
        // eslint-disable-next-line camelcase
        vs_currencies: 'usd',
      },
      headers: {
        'x-cg-pro-api-key': COINGECKO_API_KEY,
      },
    })
    return response.data[tokenID].usd
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
    return null
  }
}

export const fetchLeaderboardData = async () => {
  try {
    const response = await axios.get(LEADERBOARD_API_ENDPOINT)
    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = response.data

    return data
  } catch (error) {
    console.log('Error fetching leaderboard data', error)
    return null
  }
}

export const getPlasmaVaultHistory = async (address, chainId) => {
  const response = await axios.get(
    `${IPOR_API_URL}/fusion/vaults-history/${chainId}/${address.toLowerCase()}`,
  )
  const data = response.data.history
  return data
}

export const getUserBalanceVaults = async (account, isPortfolio = false) => {
  const userBalanceVaults = []
  let userBalanceFlag = true
  if (account) {
    account = account.toLowerCase()
  }

  const query1 = `
    query getUserVaults($account: String!) {
      userBalances(
        where: {
          userAddress: $account,
        }
      ) {
        vault{ id }
        value
      }
    }
  `

  const query2 = `
    query getUserVaults($account: String!) {
      userBalances(
        where: {
          userAddress: $account,
        }
      ) {
        vault{ id }
        value
      }
      plasmaUserBalances(
        where: {
          userAddress: $account,
        }
      ) {
        plasmaVault{id}
        value
      }
    }
  `

  const variables = { account }
  const urls = [
    GRAPH_URLS[CHAIN_IDS.ETH_MAINNET],
    GRAPH_URLS[CHAIN_IDS.POLYGON_MAINNET],
    GRAPH_URLS[CHAIN_IDS.BASE],
    GRAPH_URLS[CHAIN_IDS.ARBITRUM_ONE],
    GRAPH_URLS[CHAIN_IDS.ZKSYNC],
  ]

  try {
    const results = await Promise.all(
      urls.map(url =>
        url === GRAPH_URLS[CHAIN_IDS.BASE] ||
        url === GRAPH_URLS[CHAIN_IDS.ARBITRUM_ONE] ||
        url === GRAPH_URLS[CHAIN_IDS.ETH_MAINNET]
          ? executeGraphCall(url, query2, variables)
          : executeGraphCall(url, query1, variables),
      ),
    )
    results.forEach(userBalanceVaultData => {
      const balances = userBalanceVaultData.userBalances.concat(
        userBalanceVaultData.plasmaUserBalances ? userBalanceVaultData.plasmaUserBalances : [],
      )
      balances.forEach(balance => {
        if (isPortfolio) {
          if (parseFloat(balance.value) > 0) {
            userBalanceVaults.push(balance.vault?.id || balance.plasmaVault?.id)
          }
        } else {
          userBalanceVaults.push(balance.vault?.id || balance.plasmaVault?.id)
        }
      })
    })
  } catch (err) {
    console.error('Fetch data about user balance vaults failed: ', err)
    userBalanceFlag = false
  }
  return { userBalanceVaults, userBalanceFlag }
}
