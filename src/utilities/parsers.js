import BigNumber from 'bignumber.js'
import { get, sum, sumBy } from 'lodash'
import {
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  MAX_APY_DISPLAY,
  HARVEST_LAUNCH_DATE,
  SPECIAL_VAULTS,
} from '../constants'
import { CHAIN_IDS } from '../data/constants'
import { ceil10, floor10, round10 } from './formats'

export const getNextEmissionsCutDate = () => {
  const result = new Date()
  result.setUTCHours(19)
  result.setUTCMinutes(0)
  result.setUTCSeconds(0)
  result.setUTCMilliseconds(0)
  result.setUTCDate(result.getUTCDate() + ((2 - result.getUTCDay() + 7) % 7))
  return result
}

export const getUserVaultBalance = (
  tokenSymbol,
  farmingBalances,
  totalStakedInPool,
  iFARMBalance,
) => {
  switch (tokenSymbol) {
    case FARM_TOKEN_SYMBOL:
      // return new BigNumber(totalStakedInPool).plus(iFARMBalance).toString()
      return iFARMBalance.toString()
    case FARM_WETH_TOKEN_SYMBOL:
    case FARM_GRAIN_TOKEN_SYMBOL:
      return totalStakedInPool
    default:
      return farmingBalances[tokenSymbol]
        ? farmingBalances[tokenSymbol] === 'error'
          ? false
          : farmingBalances[tokenSymbol]
        : '0'
  }
}

export const getUserVaultBalanceInDetail = (tokenSymbol, totalStakedInPool, iFARMinFARM) => {
  switch (tokenSymbol) {
    case FARM_TOKEN_SYMBOL:
      return new BigNumber(totalStakedInPool).plus(iFARMinFARM).toString()
    default:
      return totalStakedInPool
  }
}

export const getVaultValue = token => {
  const poolId = get(token, 'data.id')

  switch (poolId) {
    case SPECIAL_VAULTS.FARM_WETH_POOL_ID:
      return get(token, 'data.lpTokenData.liquidity')
    case SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID: {
      if (!get(token, 'data.lpTokenData.price')) {
        return null
      }

      return new BigNumber(get(token, 'data.totalValueLocked', 0))
    }
    case SPECIAL_VAULTS.FARM_GRAIN_POOL_ID:
    case SPECIAL_VAULTS.FARM_USDC_POOL_ID:
      return get(token, 'data.totalValueLocked')
    default:
      return token.usdPrice
        ? new BigNumber(token.underlyingBalanceWithInvestment.toString())
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

export const getTotalApy = (vaultPool, token, isSpecialVault) => {
  const vaultData = isSpecialVault ? token.data : vaultPool

  if (
    isSpecialVault &&
    vaultData &&
    vaultData.id &&
    vaultData.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID
  ) {
    if (Number(token.profitShareAPY) <= 0) {
      return null
    }
    return Number.isNaN(Number(token.profitShareAPY)) ? 0 : Number(token.profitShareAPY).toFixed(2)
  }
  // if(token === undefined) {
  //   return 0;
  // }
  let farmAPY = token.hideFarmApy
      ? sumBy(
          vaultPool.rewardAPY.filter((_, index) => index !== 0),
          apy => Number(apy),
        )
      : get(vaultData, 'totalRewardAPY', 0),
    total

  const tradingAPY = get(vaultData, 'tradingApy', 0)
  const estimatedApy = get(token, 'estimatedApy', 0)
  const boostedEstimatedApy = get(token, 'boostedEstimatedAPY', 0)
  const boostedRewardApy = get(vaultData, 'boostedRewardAPY', 0)

  if (new BigNumber(farmAPY).gte(MAX_APY_DISPLAY)) {
    farmAPY = MAX_APY_DISPLAY
  }

  total = new BigNumber(tradingAPY).plus(
    token.fullBuyback && new BigNumber(boostedEstimatedApy).gt(0)
      ? boostedEstimatedApy
      : estimatedApy,
  )

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

  if (total.isNaN()) {
    return null
  }

  return total.toFixed(2)
}

export const getTotalFARMSupply = () => {
  const earlyEmissions = [57569.1, 51676.2, 26400.0, 24977.5]
  const weeksSinceLaunch = Math.floor(
    (new Date() - HARVEST_LAUNCH_DATE) / (7 * 24 * 60 * 60 * 1000),
  ) // Get number of weeks (including partial) between now, and the launch date
  let thisWeeksSupply = 690420

  if (weeksSinceLaunch <= 208) {
    const emissionsWeek5 = 23555.0
    const emissionsWeeklyScale = 0.95554375

    const totalOfEarlyEmissions = sum(earlyEmissions)

    thisWeeksSupply =
      totalOfEarlyEmissions +
      (emissionsWeek5 * (1 - emissionsWeeklyScale ** (weeksSinceLaunch - 4))) /
        (1 - emissionsWeeklyScale)
  }

  return thisWeeksSupply
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

export const getTimeSlots = (ago, slotCount) => {
  const slots = [],
    nowDate = new Date(),
    toDate = Math.floor(nowDate.getTime() / 1000),
    fromDate = Math.floor(nowDate.setDate(nowDate.getDate() - ago) / 1000),
    between = (toDate - fromDate) / slotCount

  for (let i = fromDate + between; i <= toDate && slots.length < slotCount; i += between) {
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

export const getYAxisValues = (min, max, roundNum) => {
  const duration = Number(max - min)
  const ary = []
  for (let i = min; i <= max; i += duration / 4) {
    const val = round10(i, roundNum)
    ary.push(val)
  }
  return ary
}
