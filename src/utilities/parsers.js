import BigNumber from 'bignumber.js'
import { get, sumBy, find, isNaN } from 'lodash'
import { MAX_APY_DISPLAY } from '../constants'
import { CHAIN_IDS } from '../data/constants'
import { ceil10, floor10, formatNumber, round10 } from './formats'
import Arbitrum from '../assets/images/chains/arbitrum.svg'
import Base from '../assets/images/chains/base.svg'
import Zksync from '../assets/images/chains/zksync.svg'
import Ethereum from '../assets/images/chains/ethereum.svg'
import Polygon from '../assets/images/chains/polygon.svg'
import { fromWei } from '../services/viem'
import {
  getAllRewardEntities,
  getUserBalanceVaults,
  initMultipleBalanceAndDetailData,
} from './apiCalls'

export const getTotalApy = (vaultPool, token) => {
  const vaultData = vaultPool

  let farmAPY = get(vaultData, 'totalRewardAPY', 0),
    total

  const tradingAPY = get(vaultData, 'tradingApy', 0)
  const estimatedApy = get(token, 'estimatedApy', 0)
  const boostedRewardApy = get(vaultData, 'boostedRewardAPY', 0)

  total = new BigNumber(tradingAPY).plus(estimatedApy)

  if (new BigNumber(farmAPY).gt(0)) {
    if (new BigNumber(boostedRewardApy).gt(0)) {
      total = total.plus(boostedRewardApy)

      if (vaultPool && vaultPool.rewardTokenSymbols.length >= 2) {
        total = total.plus(sumBy(vaultPool.rewardAPY.slice(1), apy => Number(apy)))
      }
    } else {
      total = total.plus(farmAPY)
    }
  }

  if (new BigNumber(total).gte(MAX_APY_DISPLAY)) {
    total = MAX_APY_DISPLAY
  }

  if (isNaN(total)) {
    return null
  }

  return total.toFixed(2)
}

export const getChainNamePortals = chain => {
  let chainName = 'ethereum'
  switch (chain) {
    case CHAIN_IDS.POLYGON_MAINNET:
      chainName = 'polygon'
      break
    case CHAIN_IDS.ARBITRUM_ONE:
      chainName = 'arbitrum'
      break
    case CHAIN_IDS.BASE:
      chainName = 'base'
      break
    case CHAIN_IDS.ZKSYNC:
      chainName = 'zksync'
      break
    default:
      chainName = 'ethereum'
      break
  }
  return chainName
}

export const getChainName = chain => {
  let chainName = 'Ethereum'
  switch (chain) {
    case CHAIN_IDS.POLYGON_MAINNET:
      chainName = 'Polygon'
      break
    case CHAIN_IDS.ARBITRUM_ONE:
      chainName = 'Arbitrum'
      break
    case CHAIN_IDS.BASE:
      chainName = 'Base'
      break
    case CHAIN_IDS.ZKSYNC:
      chainName = 'Zksync'
      break
    default:
      chainName = 'Ethereum'
      break
  }
  return chainName
}

export const getChainIcon = chainNum => {
  let icon = null
  if (chainNum) {
    switch (chainNum) {
      case CHAIN_IDS.ETH_MAINNET:
        icon = Ethereum
        break
      case CHAIN_IDS.POLYGON_MAINNET:
        icon = Polygon
        break
      case CHAIN_IDS.ARBITRUM_ONE:
        icon = Arbitrum
        break
      case CHAIN_IDS.BASE:
        icon = Base
        break
      case CHAIN_IDS.ZKSYNC:
        icon = Zksync
        break
      default:
        icon = Ethereum
        break
    }
  }
  return icon
}

export const getTimeSlots = (ago, slotCount) => {
  const slots = [],
    nowDate = new Date(),
    toDate = Math.floor(nowDate.getTime() / 1000),
    fromDate = Math.floor(nowDate.setDate(nowDate.getDate() - ago) / 1000),
    between = (toDate - fromDate) / slotCount,
    sl = slots.length

  for (let i = fromDate + between; i <= toDate && sl < slotCount; i += between) {
    slots.push(i)
  }

  return slots
}

export const getChartDomain = (maxValue, minValue, maxValueUnderlying, minValueUnderlying) => {
  let len = 0,
    lenUnderlying = 0,
    unitBtw,
    unitBtwUnderlying

  minValue /= 1.01
  const between = maxValue - minValue
  const betweenUnderlying = maxValueUnderlying - minValueUnderlying
  unitBtw = between / 4
  unitBtwUnderlying = betweenUnderlying / 4
  if (unitBtw >= 1) {
    unitBtw = Math.ceil(unitBtw)
    len = 2
    // len = unitBtw.toString().length
    unitBtw = ceil10(unitBtw, len - 1)
    // maxValue = ceil10(maxValue, len - 1)
    // minValue = floor10(minValue, len - 1)
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

  if (unitBtwUnderlying >= 1) {
    unitBtwUnderlying = Math.ceil(unitBtwUnderlying)
    lenUnderlying = unitBtwUnderlying.toString().length
    unitBtwUnderlying = ceil10(unitBtwUnderlying, lenUnderlying - 1)
    maxValueUnderlying = ceil10(maxValueUnderlying, lenUnderlying - 1)
    minValueUnderlying = floor10(minValueUnderlying, lenUnderlying - 1)
  } else if (unitBtwUnderlying === 0) {
    lenUnderlying = Math.ceil(maxValueUnderlying).toString().length
    maxValueUnderlying += 10 ** (lenUnderlying - 1)
    minValueUnderlying -= 10 ** (lenUnderlying - 1)
  } else {
    lenUnderlying = Math.ceil(1 / unitBtwUnderlying).toString().length + 1
    unitBtwUnderlying = ceil10(unitBtwUnderlying, -lenUnderlying)
    maxValueUnderlying = ceil10(maxValueUnderlying, -lenUnderlying)
    minValueUnderlying = floor10(minValueUnderlying, -lenUnderlying + 1)
  }
  if (unitBtw !== 0) {
    if (minValue === 0) {
      maxValue *= 1.1
    } else {
      maxValue += between / 5
    }
  } else {
    unitBtw = (maxValue - minValue) / 4
  }

  if (unitBtwUnderlying !== 0) {
    if (minValueUnderlying === 0) {
      maxValueUnderlying *= 1.5
    } else {
      maxValueUnderlying += betweenUnderlying * 2
    }
    // minValueUnderlying = 0
  } else {
    unitBtwUnderlying = (maxValueUnderlying - minValueUnderlying) / 4
  }

  return { maxValue, minValue, maxValueUnderlying, minValueUnderlying, len, lenUnderlying }
}

export const getRangeNumber = strRange => {
  let ago = 30
  if (strRange === '1D') {
    ago = 1
  } else if (strRange === '1W') {
    ago = 7
  } else if (strRange === '1M') {
    ago = 30
  } else if (strRange === '1Y') {
    ago = 365
  } else if (strRange === 'ALL') {
    ago = 365
  }

  return ago
}

export const findMax = data => {
  const ary = data.map(el => el.y)
  const max = Math.max(...ary)
  return max
}

export const findMin = data => {
  const ary = data.map(el => el.y)
  const min = Math.min(...ary)
  return min
}

export const findMaxTotal = data => {
  const ary = data.map(el => el.Total)
  const max = Math.max(...ary)
  return max
}

export const findMaxData = data => {
  let maxVal = -Infinity // Start with the smallest possible value

  Object.values(data).forEach(item => {
    if (item && item.value !== undefined) {
      maxVal = Math.max(maxVal, item.value)
    }
  })

  return maxVal === -Infinity ? null : maxVal // Return null if no valid value found
}

export const findMinData = data => {
  let minVal = Infinity

  Object.values(data).forEach(item => {
    if (item && item.value !== undefined) {
      minVal = Math.min(minVal, item.value)
    }
  })

  return minVal === Infinity ? null : minVal
}

export const findMinMax = (data, key) => {
  const filteredData = data.filter(item => item[key] !== undefined)

  filteredData.sort((a, b) => a[key] - b[key])

  return {
    min: filteredData[0] ? { x: filteredData[0].x, value: filteredData[0][key] } : null,
    max: filteredData[filteredData.length - 1]
      ? {
          x: filteredData[filteredData.length - 1].x,
          value: filteredData[filteredData.length - 1][key],
        }
      : null,
  }
}

export const findClosestIndex = (data, target) => {
  let closestIndex = 0,
    closestDistance = Math.abs(data[0].x - target)

  const dl = data.length
  for (let i = 1; i < dl; i += 1) {
    const distance = Math.abs(data[i].x - target)
    if (distance < closestDistance) {
      closestIndex = i
      closestDistance = distance
    }
  }

  return closestIndex
}

export const getYAxisValues = (min, max, roundNum) => {
  const duration = Number(max - min)
  const ary = []
  const step = duration / 4

  for (let i = 0; i <= 4; i++) {
    const value = min + i * step
    const val = round10(value, roundNum)

    if (!ary.includes(val)) {
      ary.push(val)
    }
  }
  return ary
}

export const getTokenNames = (userVault, dataVaults) => {
  const vaults = userVault.vaults
  const tokenNames = []
  const matchedVaults = {}

  Object.entries(vaults).forEach(([vaultKey]) => {
    const match = Object.entries(dataVaults).find(([, vaultData]) => {
      return (
        vaultData.vaultAddress &&
        vaultData.vaultAddress.toLowerCase() === vaultKey.toLowerCase() &&
        !vaultData.inactive
      )
    })

    if (match) {
      const [, vaultData] = match
      if (vaultData.tokenNames.length > 1) {
        tokenNames.push(vaultData.tokenNames.join(', '))
      } else {
        tokenNames.push(...vaultData.tokenNames)
      }
      matchedVaults[vaultKey] = vaults[vaultKey]
    }
  })

  userVault.vaults = matchedVaults
  return tokenNames
}

export const getVaultApy = (vaultKey, vaultsData, pools) => {
  const tokenVault = get(vaultsData, vaultKey)

  const vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))

  const totalApy = getTotalApy(vaultPool, tokenVault)

  return totalApy
}

const getMigrateVaultApy = (vaultKey, vaultsData, pools) => {
  const tokenVault = get(vaultsData, vaultKey)

  const vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))

  const totalApy = getTotalApy(vaultPool, tokenVault)

  const vaultTvl = new BigNumber(get(tokenVault, 'totalValueLocked', 0))

  return { totalApy, vaultTvl }
}

export const rearrangeApiData = (apiData, groupOfVaults) => {
  const vaultsFilteredData = Object.entries(apiData)
    .map(([wallet, entry]) => {
      const vaultsNumber = Object.entries(entry.vaults).length
      const vaultTokenNames = getTokenNames(entry, groupOfVaults)
      if (vaultTokenNames.length > 0 && Number(vaultsNumber) > 0) {
        return [wallet, entry]
      }
      return null
    })
    .filter(item => item != null)

  const removeLowMonthlyYieldData = vaultsFilteredData
    .map(([wallet, entry]) => {
      const result = (entry.totalDailyYield * 365) / 12
      if (result >= 0.01) {
        return [wallet, entry]
      }
      return null
    })
    .filter(item => item != null)

  const filteredApiData = Object.fromEntries(removeLowMonthlyYieldData)

  const vaultBalanceSortedData = Object.entries(filteredApiData)
    .map(([address, data]) => {
      const totalVaultBalance = Object.values(data.vaults).reduce((sum, vault) => {
        return sum + vault.balance
      }, 0)
      data.totalBalance = totalVaultBalance
      return { address, data, totalVaultBalance }
    })
    .sort((a, b) => b.totalVaultBalance - a.totalVaultBalance)
    .reduce((acc, { address, data }) => {
      acc[address] = data
      return acc
    }, {})

  Object.entries(vaultBalanceSortedData).forEach(([, value]) => {
    if (value.vaults) {
      value.vaults = Object.fromEntries(
        Object.entries(value.vaults).sort(([, a], [, b]) => b.balance - a.balance),
      )
    }
  })
  return vaultBalanceSortedData
}

export const getMatchedVaultList = (allVaults, chainName, pools) => {
  const sameNetworkVaults = []

  Object.keys(allVaults).map(vaultKey => {
    const compareChain = allVaults[vaultKey].chain
    if (Number(compareChain) === Number(chainName)) {
      const { totalApy: vaultApy, vaultTvl } = getMigrateVaultApy(vaultKey, allVaults, pools)
      sameNetworkVaults.push({
        vaultApy: Number(vaultApy),
        vaultTvl: Number(vaultTvl),
        vault: allVaults[vaultKey],
      })
    }
    return true
  })
  sameNetworkVaults.sort((a, b) => b.vaultApy - a.vaultApy)
  if (sameNetworkVaults) {
    return sameNetworkVaults
  }
  return false
}

const mergeArrays = (rewardsAPIData, totalHistoryData) => {
  const rewardsData = rewardsAPIData.map(reward => ({
    event: 'Rewards',
    symbol: reward.token.symbol,
    timestamp: reward.timestamp,
    rewards: fromWei(reward.value, reward.token.decimals, reward.token.decimals, true),
    rewardsUSD:
      parseFloat(reward.price) *
      fromWei(reward.value, reward.token.decimals, reward.token.decimals, true),
  }))

  const combinedArray = [...totalHistoryData, ...rewardsData]

  combinedArray.sort((a, b) => parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10))

  return combinedArray
}

export const handleToggle = setter => () => setter(prev => !prev)

export const calculateApy = (vaultHData, latestSharePriceValue, vaultData, periodDays) => {
  const filteredData = vaultHData.filter(
    entry => Number(entry.timestamp) >= Number(vaultHData[0].timestamp) - periodDays * 24 * 3600,
  )

  if (filteredData.length === 0) return '0%'

  const initialSharePrice = fromWei(
    filteredData[filteredData.length - 1].sharePrice,
    vaultData.decimals || vaultData.data.watchAsset.decimals,
    vaultData.decimals || vaultData.data.watchAsset.decimals,
    false,
  )

  return `${formatNumber(
    ((latestSharePriceValue - initialSharePrice) / (periodDays / 365)) * 100,
    2,
  )}%`
}

export const generateColor = (vaultList, key) => {
  const colorPalette = [
    '#9b7ede', // Dusty Purple
    '#d6a737', // Goldenrod
    '#5f9ea0', // Teal Grey
    '#8a9a5b', // Olive Green
    '#b68f40', // Spicy Mustard
    '#708090', // Slate
    '#b491c8', // Soft Lilac
    '#c4a000', // Mustard
    '#a39887', // Taupe
    '#556b2f', // Forest Moss
    '#d0893d', // Muted Amber
    '#77bfa3', // Seafoam
    '#d08ca7', // Clay Pink
    '#7a9e9f', // Dust Blue
    '#b87333', // Copper
    '#9b7ede', // Dusty Purple
    '#d6a737', // Goldenrod
    '#5f9ea0', // Teal Grey
    '#8a9a5b', // Olive Green
    '#b68f40', // Spicy Mustard
    '#708090', // Slate
    '#b491c8', // Soft Lilac
    '#c4a000', // Mustard
    '#a39887', // Taupe
    '#556b2f', // Forest Moss
    '#d0893d', // Muted Amber
    '#77bfa3', // Seafoam
    '#d08ca7', // Clay Pink
    '#7a9e9f', // Dust Blue
    '#b87333', // Copper
  ]
  const index = Object.keys(vaultList).indexOf(key)
  const color = colorPalette[index]

  return color
}

export async function fetchAndParseVaultData({ account, groupOfVaults }) {
  let combinedEnrichedData = [],
    cumulativeLifetimeYield = 0

  const { userBalanceVaults } = await getUserBalanceVaults(account)

  const stakedVaults = Object.keys(groupOfVaults).filter(key => {
    const vault = groupOfVaults[key]
    const paramAddressAll = (vault.vaultAddress || vault.tokenAddress || '').toLowerCase()
    return userBalanceVaults.includes(paramAddressAll)
  })

  const vaultNetChanges = []

  const vaultsByChainAndType = stakedVaults.reduce((acc, symbol) => {
    const token = groupOfVaults[symbol]
    if (!token) return acc

    const chainId = token.chain
    const isIPORVault = token.isIPORVault ?? false

    const groupKey = `${chainId}-${isIPORVault ? 'ipor' : 'regular'}`

    if (!acc[groupKey]) {
      acc[groupKey] = {
        chainId,
        isIPORVault,
        vaults: [],
        vaultData: {}, // Map of address to vault data
      }
    }

    const vaultAddress = (token.vaultAddress || token.tokenAddress).toLowerCase()

    acc[groupKey].vaultData[vaultAddress] = {
      address: vaultAddress,
      tokenDecimals: parseInt(token.decimals) || 18,
      vaultDecimals: parseInt(token.vaultDecimals) || 8,
    }

    acc[groupKey].vaults.push({
      symbol,
      address: vaultAddress,
      tokenDecimals: token.decimals,
      vaultDecimals: token.vaultDecimals,
      tokenNames: token.tokenNames,
      platform: token.platform,
    })

    return acc
  }, {})

  console.log('Vaults by chain and type:', vaultsByChainAndType)

  const groupPromises = Object.values(vaultsByChainAndType).map(async group => {
    const { chainId, isIPORVault, vaults, vaultData } = group
    const addresses = vaults.map(vault => vault.address)
    const result = await initMultipleBalanceAndDetailData(
      addresses,
      chainId,
      account,
      isIPORVault,
      vaultData,
    )

    vaults.forEach(vault => {
      const vaultId = vault.address.toLowerCase()
      const vaultResult = result.processedResults[vaultId]

      if (vaultResult) {
        vaultNetChanges.push({
          id: vault.symbol,
          sumNetChangeUsd: vaultResult.sumNetChangeUsd || 0,
        })

        if (vaultResult.enrichedData && vaultResult.enrichedData.length > 0) {
          const enrichedDataWithSymbol = vaultResult.enrichedData.map(data => ({
            ...data,
            tokenSymbol: vault.symbol,
            name: vault.tokenNames.join(' - '),
            platform: vault.platform.join(', '),
            chain: chainId,
            isIPORVault,
            tokenDecimals: vault.tokenDecimals,
            vaultDecimals: vault.vaultDecimals,
          }))

          combinedEnrichedData = combinedEnrichedData.concat(enrichedDataWithSymbol)
        }
      }
    })
  })

  await Promise.all(groupPromises)

  const { rewardsAPIData } = await getAllRewardEntities(account)

  if (rewardsAPIData.length !== 0) {
    combinedEnrichedData = mergeArrays(rewardsAPIData, combinedEnrichedData)
  }

  const combinedEnrichedArray = combinedEnrichedData
    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
    .map(item => {
      if (item.event === 'Harvest') {
        cumulativeLifetimeYield += Number(item.netChangeUsd)
      } else if (item.event === 'Rewards') {
        cumulativeLifetimeYield += Number(item.rewardsUSD)
      }
      return { ...item, lifetimeYield: cumulativeLifetimeYield.toString() }
    })

  const sortedCombinedEnrichedArray = combinedEnrichedArray
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .filter(entry => !(entry.event === 'Harvest' && Number(entry.netChange) === 0))

  return {
    vaultNetChanges,
    sortedCombinedEnrichedArray,
    cumulativeLifetimeYield: cumulativeLifetimeYield === 0 ? -1 : cumulativeLifetimeYield,
    stakedVaults: stakedVaults,
    rewardsAPIDataLength: rewardsAPIData.length,
  }
}
