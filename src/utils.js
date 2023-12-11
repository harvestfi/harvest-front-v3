import axios from 'axios'
import axiosRetry from 'axios-retry'
import BigNumber from 'bignumber.js'
import mobile from 'is-mobile'
import { get, isArray, isNaN, isEmpty, size as arraySize, sum, sumBy } from 'lodash'
import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import {
  DECIMAL_PRECISION,
  DISABLED_DEPOSITS,
  DISABLED_WITHDRAWS,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  HARVEST_LAUNCH_DATE,
  IFARM_TOKEN_SYMBOL,
  KEY_CODES,
  MAX_APY_DISPLAY,
  SPECIAL_VAULTS,
  UNIV3_POOL_ID_REGEX,
  GRAPH_URL_MAINNET,
  GRAPH_URL_POLYGON,
  GRAPH_URL_ARBITRUM,
  TOTAL_TVL_API_ENDPOINT,
  GRAPH_URL_BASE,
} from './constants'
import { CHAIN_IDS } from './data/constants'
import { addresses } from './data/index'

axiosRetry(axios, {
  retries: 1,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 303),
})

export const preventNonNumericInput = e =>
  (e.keyCode === KEY_CODES.MINUS || e.keyCode === KEY_CODES.E) && e.preventDefault()

export const preventNonNumericPaste = e => {
  const pastedData = e.clipboardData.getData('Text')
  if (!/^\d*\.?\d+$/.test(pastedData)) {
    e.preventDefault()
  }
}

export const toAPYPercentage = number => {
  let percentage = '0'

  if (number) {
    percentage = new BigNumber(number).toFixed(2, 1)
  }

  return `${percentage}%`
}

export const abbreaviteNumber = (number, decPlaces) => {
  const signs = ['K', 'M', 'B', 'T']
  const adjDecPlaces = 10 ** decPlaces

  if (number < 1 / adjDecPlaces) {
    return number.toFixed(decPlaces)
  }

  for (let i = signs.length - 1; i >= 0; i -= 1) {
    const size = 10 ** ((i + 1) * 3)
    if (size <= number) {
      number = (Math.floor((number * adjDecPlaces) / size) / adjDecPlaces).toFixed(decPlaces)
      number += signs[i]
      break
    }
  }

  if (typeof number === 'number' && number < 1000) {
    return number.toFixed(decPlaces)
  }

  return number
}

export const showNumber = (number, decPlaces) => {
  const adjDecPlaces = 10 ** decPlaces

  if (number < 1 / adjDecPlaces) {
    return number.toFixed(decPlaces)
  }

  if (typeof number === 'number' && number < 1000) {
    return number.toFixed(decPlaces)
  }

  return number
}

export const countDecimals = value => {
  if (typeof value === 'string' && value.split('.').length > 1) {
    return value.split('.')[1].length
  }
  return 0
}

export const truncateNumberString = (
  numberString,
  decimals = DECIMAL_PRECISION,
  maxDigits = false,
) => {
  let truncatedNumberAsBN = new BigNumber(numberString)

  if (truncatedNumberAsBN.dp() > decimals) {
    truncatedNumberAsBN = truncatedNumberAsBN.dp(decimals)
  }

  const truncatedNumberAsString = truncatedNumberAsBN.toString(10)

  if (maxDigits && truncatedNumberAsString && truncatedNumberAsString.length > maxDigits) {
    return `${truncatedNumberAsString.substring(0, maxDigits)}...`
  }

  return truncatedNumberAsBN.isNaN() ? '0' : truncatedNumberAsBN.toFixed(2)
}
export const parseValue = value => {
  if (value === null || value === undefined) {
    return NaN
  }

  let newValue = value.toString().replace(/,/g, ''),
    multiplier = 1
  const suffix = newValue.slice(-1).toUpperCase()

  if (isNaN(newValue.slice(0, -1))) {
    return NaN
  }

  if (suffix === 'K') {
    multiplier = 1000
  } else if (suffix === 'M') {
    multiplier = 1000000
  } else if (suffix === 'B') {
    multiplier = 1000000000
  } else if (suffix === 'T') {
    multiplier = 1000000000000
  } else if (suffix === 'Q') {
    multiplier = 1000000000000000
  }

  newValue = parseFloat(newValue) * multiplier
  return newValue
}
export const formatNumber = (number, decimals = DECIMAL_PRECISION) => {
  let result = number

  if (countDecimals(result) > decimals) {
    result = result.substring(0, result.indexOf('.') + decimals + 1)
  }

  return abbreaviteNumber(Number(result), decimals)
}

export const formatNumberWido = (number, decimals = DECIMAL_PRECISION) => {
  let result = number.toString()
  if (countDecimals(result) > decimals) {
    result = result.substring(0, result.indexOf('.') + decimals + 1)
  }

  // return showNumber(Number(result), decimals)
  return result
}

export const formatAddress = address => {
  if (address) {
    return `${address.substring(0, mobile() ? 4 : 6)}...${address.substring(
      address.length - 4,
      address.length,
    )}`
  }
  return '0x...0'
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

export const getNextEmissionsCutDate = () => {
  const result = new Date()
  result.setUTCHours(19)
  result.setUTCMinutes(0)
  result.setUTCSeconds(0)
  result.setUTCMilliseconds(0)
  result.setUTCDate(result.getUTCDate() + ((2 - result.getUTCDay() + 7) % 7))
  return result
}

export const stringToArray = value => (isArray(value) ? value : [value])

export const getUserVaultBalance = (
  tokenSymbol,
  farmingBalances,
  totalStakedInPool,
  iFARMinFARM,
) => {
  switch (tokenSymbol) {
    case FARM_TOKEN_SYMBOL:
      return new BigNumber(totalStakedInPool).plus(iFARMinFARM).toString()
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
        ? new BigNumber(token.underlyingBalanceWithInvestment)
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

const getRewardSymbol = (vault, isIFARM, vaultPool) => {
  switch (true) {
    case vaultPool && vaultPool.rewardTokenSymbols.length > 1:
      return vaultPool.rewardTokenSymbols
        .filter((_, symbolIdx) => Number(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0)) !== 0)
        .join(', ')
    case vaultPool && vaultPool.rewardTokenSymbols.length === 1:
      return vaultPool.rewardTokenSymbols[0]
    case vault.chain === CHAIN_IDS.POLYGON_MAINNET || isIFARM:
      return 'iFARM'
    default:
      return 'FARM'
  }
}

export const displayAPY = (apy, ...args) =>
  new BigNumber(apy).isGreaterThan(MAX_APY_DISPLAY)
    ? `${MAX_APY_DISPLAY}%+`
    : new BigNumber(apy).isLessThanOrEqualTo(0)
    ? '0.00%'
    : `${truncateNumberString(apy, ...args)}%`

export const getRewardsText = (
  token,
  tokens,
  vaultPool,
  tradingApy,
  farmAPY,
  specialVaultApy,
  isSpecialVault,
  boostedEstimatedAPY,
  boostedRewardAPY,
) => {
  const components = []

  const isUniv3Vault = !!(vaultPool && new RegExp(UNIV3_POOL_ID_REGEX).test(vaultPool.id))

  const isHodlVault = token.hodlVaultId

  if (vaultPool && (isUniv3Vault || vaultPool.rewardTokenSymbols.length > 1)) {
    const rewardSymbols = !isUniv3Vault
      ? token.apyTokenSymbols
      : token.apyTokenSymbols.filter(symbol => symbol !== 'UNI')

    if (rewardSymbols && rewardSymbols.length) {
      rewardSymbols.forEach((symbol, i) => {
        if (get(token, `estimatedApyBreakdown[${i}]`)) {
          components.push(`<div style="display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;">
          <div style="min-width: 75px;">
          ${token.apyIconUrls.map(
            (item, index) => `<img src='${item.toLowerCase()}' key=${index} width=24 alt="" />`,
          )}</div>
            <div style="min-width: 60px; color: #1F2937; font-weight: 700;">${
              new BigNumber(token.estimatedApyBreakdown[i]).gt(0)
                ? `${displayAPY(token.estimatedApyBreakdown[i])}`
                : `...`
            }</div>
            <div style="min-width: 150px; font-weight: 400; color: #888E8F;">${get(
              token,
              `apyDescriptionOverride[${i}]`,
              `Auto harvested&nbsp;<span style="color: #1F2937; font-weight: 700;">${
                rewardSymbols.length > 1 && token.estimatedApyBreakdown.length === 1
                  ? rewardSymbols.join(', ')
                  : symbol
              }</span>`,
            )}</div></div>`)
        }
      })
    }

    const hasBoostedApy = new BigNumber(boostedRewardAPY).isGreaterThan(0)

    if (hasBoostedApy) {
      components.push(
        `<div style="display: flex; color: #1F2937; font-weight: 700; font-size: 16px; line-height: 21px; margin-bottom: 14px;">
        <div style="min-width: 75px;"><img src='./icons/ifarm.png' width=25 alt="" /></div>
        <div style="min-width: 60px;">${displayAPY(boostedRewardAPY)}</div>
        <div style="min-width: 150px; font-weight: 400; color: #888E8F;">
        <span style="color: #1F2937; font-weight: 700;">iFARM</span>
        &nbsp;auto-compounding rewards</div></div>`,
      )
    }

    if (Number(farmAPY) > 0) {
      vaultPool.rewardTokenSymbols.forEach((symbol, symbolIdx) => {
        const farmSymbols = [FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL]

        if (token.hideFarmApy && farmSymbols.includes(symbol)) {
          return
        }

        if (
          (!hasBoostedApy || !!symbolIdx) &&
          new BigNumber(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0)).isGreaterThan(0)
        ) {
          components.push(`
          <div style='display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;'>
            <div style='min-width: 75px'><img src='./icons/${symbol}.png' width=24 alt="" /></div>
            <div style="min-width: 60px; color: #1F2937; font-weight: 700;">
              ${displayAPY(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0))}
            </div>&nbsp;
            <div style="min-width: 150px; font-weight: 400; color: #888E8F;">
              <span style="color: #1F2937; font-weight: 700;">${symbol}</span>
              &nbsp;rewards
            </div>`)

          if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(symbol)) {
            components.push(vaultPool.vestingDescriptionOverride[symbol])
          }
        }
      })
    }

    if (isUniv3Vault) {
      components.push(`
      <div style='display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;'>
        <div style='min-width: 75px;'>

        ${
          token.apyIconUrls
            ? token.apyIconUrls.map(url => `<img key=${url} width=24 src='${url}' />`)
            : null
        }
          ${
            !token.inactive && !isHodlVault && vaultPool.rewardTokenSymbols.length >= 2
              ? vaultPool.rewardTokenSymbols.map((symbol, symbolIdx) =>
                  symbolIdx !== 0 && symbolIdx < vaultPool.rewardTokens.length
                    ? `<img
                key=${symbol} width=24 style='margin-right: 10px;'
                src='./icons/${symbol.toLowerCase()}.png'
              />`
                    : null,
                )
              : ''
          }
          </div>
          <div style="min-width: 60px; color: #1F2937; font-weight: 700;">0.00%</div>
          <div style="min-width: 150px; font-weight: 400; color: #888E8F;">Earn Uniswap v3 trading fees ${
            new BigNumber(tradingApy).gt(0)
              ? `estimated at&nbsp; <b>${displayAPY(tradingApy)}</b>`
              : ``
          }</div>`)
      // components.push(`
    } else if (Number(tradingApy) > 0) {
      components.push(`
      <div style="display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;">
        <div style="min-width: 75px;"><img src='./icons/swapfee.svg' width=24 alt="" /></div>
        <div style="min-width: 60px; color: #1F2937; font-weight: 700;">${displayAPY(
          tradingApy,
        )}</div>
        <div style="min-width: 150px; color: #888E8F; font-weight: 500;">Liquidity Provider APY</div>
      </div>`)
    }

    const tooltipText = `<ul style="list-style-type: none; margin: 5px; padding-left: 0px; text-align: left;">${components
      .filter(c => !isEmpty(c))
      .map(c => `<li align="left" style="margin: -5px;">${c}</li>`)
      .join('<br />')}</ul>`

    return ReactHtmlParser(tooltipText)
  }

  if (vaultPool.id === 'fweth-farm') {
    components.push(`<b>${displayAPY(farmAPY)}:</b> <b>FARM</b> rewards`)
    if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(FARM_TOKEN_SYMBOL)) {
      components.push(vaultPool.vestingDescriptionOverride[FARM_TOKEN_SYMBOL])
    }
    components.push(
      `<b>${displayAPY(token.estimatedApy)}</b>: Auto harvested <b>${token.apyTokenSymbols.join(
        ', ',
      )}</b>`,
    )

    const tooltipText = `<ul style="margin: 5px; padding-left: 0px; text-align: left;">${components
      .filter(c => !isEmpty(c))
      .map(c => `<li align="left" style="margin: -5px;">${c}</li>`)
      .join('<br />')}</ul>`

    return ReactHtmlParser(tooltipText)
  }

  const isIFARM = vaultPool.rewardTokens[0] === addresses.iFARM

  if (isSpecialVault && vaultPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
    components.push(
      `<div style="display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;">
      <div style="width: 75px;"><img src='./icons/${token.rewardSymbol}.png' width=24 alt=${
        token.rewardSymbol
      } /></div>
      <div style="min-width: 60px; color: #1F2937; font-weight: 700;"> ${
        specialVaultApy > 0 ? `${displayAPY(specialVaultApy)}` : 'N/A'
      }</div>
      <div style="min-width: 150px; color: #888E8F; font-weight: 500;">
      <span style="color: #1F2937; font-weight: 700;">${
        token.rewardSymbol
      }</span>&nbsp;rewards</div></div>`,
    )
  } else {
    if (!token.hideTokenApy) {
      if (Number(tradingApy) > 0) {
        components.push(`<div style="display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;">
          <div style="min-width: 75px;"><img src='./icons/swapfee.svg' width=24 alt="" /></div>
          <div style="min-width: 60px; color: #1F2937; font-weight: 700;">${displayAPY(
            tradingApy,
          )}</div> 
          <div style="min-width: 150px; color: #888E8F; font-weight: 500;">Liquidity Provider APY</div>
        </div>`)
      }

      if (arraySize(token.apyTokenSymbols)) {
        if (token.apyOverride) {
          components.push(`<b>${token.apyOverride}</b>`)
        } else if (Number(token.estimatedApy) > 0) {
          let apyString = ''

          if (token.apyDescriptionOverride && token.apyDescriptionOverride.length) {
            token.apyTokenSymbols.forEach((symbol, symbolIdx) => {
              const extraDescription = token.apyDescriptionOverride[symbolIdx]

              apyString += `<b>${
                token.estimatedApyBreakdown
                  ? displayAPY(token.estimatedApyBreakdown[symbolIdx])
                  : '...'
              }</b>: Auto harvested <b>${symbol}</b>`

              if (extraDescription) {
                apyString += ` ${extraDescription}<br/>`
              } else {
                apyString += `<br/>`
              }
            })
          } else {
            apyString = `<div style="display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;"><div style="min-width: 75px;">`
            apyString += `${
              token.apyIconUrls ? (
                token.apyIconUrls.map(
                  (url, i) =>
                    `<img key='${i}' width=24 style={{margin:"0px 5px 0px 0px"}} src='${url}' />`,
                )
              ) : (
                <>
                  $
                  {vaultPool.rewardTokenSymbols.map((symbol, idx) => {
                    return `<img key=${idx} src='./icons/${symbol.toLowerCase()}.png' width=24 alt='${symbol}' />`
                  })}
                </>
              )
            }`
            apyString += '</div>'
            apyString += `<div style="min-width: 60px; color: #1F2937; font-weight: 700;">${
              isIFARM && token.fullBuyback
                ? displayAPY(boostedEstimatedAPY)
                : displayAPY(token.estimatedApy)
            }</div> <div style="min-width: 150px; color: #888E8F;">Auto ${
              isHodlVault ? 'hodling <b>SUSHI<b> in' : 'harvested'
            }&nbsp; <span style="color: #1F2937; font-weight: 700;">${token.apyTokenSymbols.join(
              ', ',
            )}${
              isIFARM && token.fullBuyback
                ? ` <span style="color: #1F2937; font-weight: 700;">(${displayAPY(
                    token.estimatedApy,
                  )})</span>`
                : ``
            }</span>${
              token.fullBuyback ||
              (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault)
                ? ``
                : `<br/>`
            }`
          }
          apyString += `</div></div>`
          if (token.fullBuyback) {
            if (isIFARM) {
              apyString += ` claimable as auto-compounded <b>${getRewardSymbol(
                token,
                true,
              )}</b> boosting APY to <b>${displayAPY(boostedEstimatedAPY)}</b><br/>`
            } else {
              apyString += ` (claimable as <b>${getRewardSymbol(
                token,
              )}</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          if (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault) {
            if (
              token.migrated &&
              (token.vaultAddress === addresses.V2.oneInch_ETH_DAI.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDC.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDT.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_WBTC.NewVault)
            ) {
              apyString += ` (sent as <b>fSUSHI</b> alongside with <b>${getRewardSymbol(
                token,
                isIFARM,
              )}</b> <u>upon withdrawal</u>)<br/>`
            } else {
              apyString += ` (claimable as <b>fSUSHI</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          components.push(apyString)
        }
      }
    }

    if (!token.hideFarmApy && Number(farmAPY) > 0) {
      let apyString = `<div style="display: flex; margin-bottom: 14px; font-size: 16px; line-height: 21px;">
        <div style="min-width: 75px;"><img src='./icons/${getRewardSymbol(
          token,
          isIFARM,
          vaultPool,
        )}.png' width=24 alt='' /></div>`

      apyString += `<div style="min-width: 60px; color: #1F2937; font-weight: 700;">${
        isIFARM || Number(boostedRewardAPY) > 0 ? displayAPY(boostedRewardAPY) : displayAPY(farmAPY)
      }</div><div style="min-width: 150px; font-weight: 400; color: #888E8F;" ><span style="color: #1F2937; font-weight: 700;">${getRewardSymbol(
        token,
        isIFARM,
        vaultPool,
      )}</span>&nbsp; rewards${isIFARM ? `` : ``}${
        isIFARM || Number(boostedRewardAPY) > 0
          ? ` (<span style="color: #1F2937; font-weight: 700;">${displayAPY(farmAPY)}</span>)`
          : ''
      }&nbsp;`

      if (Number(boostedRewardAPY) > 0) {
        if (isIFARM) {
          apyString += ` boosted to &nbsp;<span style="color: #1F2937; font-weight: 700;">${displayAPY(
            boostedRewardAPY,
          )}</span>&nbsp; by <span style="display: contents;">${getRewardSymbol(
            token,
            true,
          )}</span> auto-compounding</div>`
        }

        apyString += '</div>'
      }

      components.push(apyString)
    }
  }

  const tooltipText = `<div align="left">${components.join('')}</div>`

  return ReactHtmlParser(tooltipText)
}

export const getDetailText = (
  token,
  vaultPool,
  tradingApy,
  farmAPY,
  specialVaultApy,
  isSpecialVault,
  boostedEstimatedAPY,
  boostedRewardAPY,
) => {
  const components = []

  const isUniv3Vault = !!(vaultPool && new RegExp(UNIV3_POOL_ID_REGEX).test(vaultPool.id))

  const isHodlVault = !!token.hodlVaultId

  if (vaultPool && (isUniv3Vault || vaultPool.rewardTokenSymbols.length > 1)) {
    const rewardSymbols = !isUniv3Vault
      ? token.apyTokenSymbols
      : token.apyTokenSymbols.filter(symbol => symbol !== 'UNI')

    if (rewardSymbols && rewardSymbols.length) {
      rewardSymbols.forEach((symbol, i) => {
        if (get(token, `estimatedApyBreakdown[${i}]`)) {
          components.push(`
          <div class="detail-box">
            <div class="detail-icon">
              ${token.apyIconUrls.map(
                (item, index) =>
                  `<img src='${item
                    .slice(1, item.length)
                    .toLowerCase()}' key=${index} width=24 height=24 alt="" style='margin-left: ${
                    index !== 0 ? '-15px;' : ''
                  }' />`,
              )}
            </div>
            <div class="detail-apy">
              ${
                new BigNumber(token.estimatedApyBreakdown[i]).gt(0)
                  ? `${displayAPY(token.estimatedApyBreakdown[i])}`
                  : `...`
              }
            </div>
            <div class="detail-desc-auto">
              Auto harvested&nbsp;
              <span class="detail-token">
              ${
                rewardSymbols.length > 1 && token.estimatedApyBreakdown.length === 1
                  ? rewardSymbols.join(' ')
                  : symbol
              }</span>
            </div>
          </div>`)
        }
      })
    }

    const hasBoostedApy = new BigNumber(boostedRewardAPY).isGreaterThan(0)

    if (hasBoostedApy) {
      components.push(`
      <div class="detail-box">
        <div class="detail-icon">
          <img src='/icons/ifarm.svg' width=24 height=24 alt="" />
        </div>
        <div class="detail-apy">
          <b>${displayAPY(boostedRewardAPY)}</b>
        </div>
        <div class="detail-desc-no-width">
          iFARM auto-compounding rewards
        </div>
      </div>`)
    }

    if (Number(farmAPY) > 0) {
      vaultPool.rewardTokenSymbols.forEach((symbol, symbolIdx) => {
        const farmSymbols = [FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL]

        if (token.hideFarmApy && farmSymbols.includes(symbol)) {
          return
        }

        if (
          (!hasBoostedApy || !!symbolIdx) &&
          new BigNumber(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0)).isGreaterThan(0)
        ) {
          components.push(`
          <div class='detail-box'>
            <div class='detail-icon'>
              <img src='/icons/${symbol.toLowerCase()}.svg' width=24 height=24 alt="" />
            </div>
            <div class="detail-apy">
              <b>${displayAPY(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0))}</b>
            </div>
            <div class="detail-desc">
              ${symbol} rewards
            </div>
          </div>`)

          if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(symbol)) {
            components.push(vaultPool.vestingDescriptionOverride[symbol])
          }
        }
      })
    }

    if (isUniv3Vault && BigNumber(tradingApy).gt(0)) {
      components.push(`
      <div class='detail-box'>
        <div class='detail-icon'>
          ${
            token.apyIconUrls
              ? token.apyIconUrls.map(
                  (url, i) =>
                    `<img style='${i !== 0 ? 'margin-left: -15px;' : ''}'
                 key=${url} width=24 height=24 src='${url.slice(1, url.length)}' />`,
                )
              : null
          }
          ${
            !token.inactive && !isHodlVault && vaultPool.rewardTokenSymbols.length >= 2
              ? vaultPool.rewardTokenSymbols.map((symbol, symbolIdx) =>
                  symbolIdx !== 0 && symbolIdx < vaultPool.rewardTokens.length
                    ? `<img style='${symbolIdx !== 0 ? 'margin-left: -15px;' : ''}'
                key=${symbol} width=24 height=24 style='margin-right: 10px;'
                src='/icons/${symbol.toLowerCase()}.svg'
              />`
                    : null,
                )
              : ''
          }
        </div>
        <div class="detail-apy">
          <b>${new BigNumber(tradingApy).gt(0) ? `${displayAPY(tradingApy)}` : `0.00%`}</b>
        </div>
        <div class="detail-token-no-width">Liquidity Provision</div>
      </div>`)
      // components.push(`
    } else if (Number(tradingApy) > 0) {
      components.push(`
      <div class="detail-box">
        <div class="detail-icon">
          <img src='/icons/swapfee.svg' width=24 height=24 alt="" />
        </div>
        <div class="detail-apy">
          <b>${displayAPY(tradingApy)}</b>
        </div>
        <div class="detail-desc-no-width">Liquidity Provision</div>
      </div>`)
    }

    const tooltipText = `<div>${components
      .filter(c => !isEmpty(c))
      .map(c => `${c}`)
      .join('')}</div>`

    return tooltipText
  }
  // if(vaultPool === undefined) {
  //   return '';
  // }
  if (vaultPool.id === 'fweth-farm') {
    components.push(`<b>${displayAPY(farmAPY)}:</b> <b>FARM</b> rewards`)
    if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(FARM_TOKEN_SYMBOL)) {
      components.push(vaultPool.vestingDescriptionOverride[FARM_TOKEN_SYMBOL])
    }
    components.push(
      `<b>${displayAPY(token.estimatedApy)}</b>: Auto harvested <b>${token.apyTokenSymbols.join(
        ' ',
      )}</b>`,
    )

    const tooltipText = `<div>${components
      .filter(c => !isEmpty(c))
      .map(c => `${c}`)
      .join('<br />')}</div>`

    return tooltipText
  }

  const isIFARM = vaultPool.rewardTokens[0] === addresses.iFARM

  if (isSpecialVault && vaultPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
    components.push(
      `<div class="detail-box">
        <div class="detail-icon"><img src='/icons/${token.rewardSymbol.toLowerCase()}.svg' width=24 height=24 alt=${
        token.rewardSymbol
      } /></div>
        <div class="detail-apy"> ${
          specialVaultApy > 0 ? `${displayAPY(specialVaultApy)}</div>` : '...</div>'
        } 
        <div class="detail-desc">${token.rewardSymbol} rewards</div>
      </div>`,
    )
  } else {
    if (!token.hideTokenApy) {
      if (Number(tradingApy) > 0) {
        components.push(`<div class="detail-box">
          <div class="detail-icon"><img src='/icons/swapfee.svg' width=24 height=24 alt="" /></div>
          <div class="detail-apy">${displayAPY(tradingApy)}</div> 
          <div class="detail-desc-no-width">Liquidity Provision </div>
        </div>`)
      }

      if (arraySize(token.apyTokenSymbols)) {
        if (token.apyOverride) {
          components.push(`<b>${token.apyOverride}</b>`)
        } else if (Number(token.estimatedApy) > 0) {
          let apyString = ''

          if (token.apyDescriptionOverride && token.apyDescriptionOverride.length) {
            // token.apyTokenSymbols.forEach((symbol, symbolIdx) => {
            //   const extraDescription = token.apyDescriptionOverride[symbolIdx]

            //   apyString += `<b>${
            //     token.estimatedApyBreakdown
            //       ? displayAPY(token.estimatedApyBreakdown[symbolIdx])
            //       : '...'
            //   }</b>: Auto harvested <b>${symbol}</b>`

            //   if (extraDescription) {
            //     apyString += ` ${extraDescription}<br/>`
            //   } else {
            //     apyString += `<br/>`
            //   }
            // })
            apyString += 'Auto harvested'
          } else {
            apyString = `
            <div class="detail-box">
              <div class="detail-icon">`
            apyString += `${
              token.apyIconUrls ? (
                token.apyIconUrls.map(
                  (url, i) =>
                    `<img key='${i}' width=24 height=24 style='margin:0px -15px 0px 0px;' src='${url.slice(
                      1,
                      url.length,
                    )}' />`,
                )
              ) : (
                <>
                  $
                  {vaultPool.rewardTokenSymbols.map((symbol, idx) => {
                    return `<img key=${idx} src='/icons/${symbol.toLowerCase()}.svg' width=24 height=24 alt='${symbol}' />`
                  })}
                </>
              )
            }`
            apyString += '</div>'
            apyString += `<div class="detail-apy">${
              isIFARM && token.fullBuyback
                ? displayAPY(boostedEstimatedAPY)
                : displayAPY(token.estimatedApy)
            }</div>
            <div class="detail-desc-auto">Auto ${
              isHodlVault ? 'hodling <b>SUSHI<b> in' : 'harvested&nbsp;'
            }
            <span class="detail-token">${token.apyTokenSymbols.join(',  ')}</span></div>
            ${
              isIFARM && token.fullBuyback ? ` <b>(${displayAPY(token.estimatedApy)})</b>` : ``
            }</b>${
              token.fullBuyback ||
              (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault)
                ? ``
                : `<br/>`
            }`
          }
          apyString += `</div>`
          if (token.fullBuyback) {
            if (isIFARM) {
              apyString += ` claimable as auto-compounded <b>${getRewardSymbol(
                token,
                true,
              )}</b> boosting APY to <b>${displayAPY(boostedEstimatedAPY)}</b><br/>`
            } else {
              apyString += ` (claimable as <b>${getRewardSymbol(
                token,
              )}</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          if (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault) {
            if (
              token.migrated &&
              (token.vaultAddress === addresses.V2.oneInch_ETH_DAI.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDC.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDT.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_WBTC.NewVault)
            ) {
              apyString += ` (sent as <b>fSUSHI</b> alongside with <b>${getRewardSymbol(
                token,
                isIFARM,
              )}</b> <u>upon withdrawal</u>)<br/>`
            } else {
              apyString += ` (claimable as <b>fSUSHI</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          components.push(apyString)
        }
      }
    }

    if (!token.hideFarmApy && Number(farmAPY) > 0) {
      let apyString = `<div class="detail-box">
        <div class="detail-icon"><img src='/icons/${getRewardSymbol(
          token,
          isIFARM,
          vaultPool,
        ).toLowerCase()}.svg' width=24 height=24 alt='' /></div>`
      apyString += `<div class="detail-apy">${
        isIFARM || Number(boostedRewardAPY) > 0 ? displayAPY(boostedRewardAPY) : displayAPY(farmAPY)
      }</div> <div class="detail-desc">${getRewardSymbol(token, isIFARM, vaultPool)} rewards</div>`

      if (Number(boostedRewardAPY) > 0) {
        // if (isIFARM) {
        //   apyString += ` boosted to <b>${displayAPY(
        //     boostedRewardAPY,
        //   )}</b> by <b style="display: contents;">${getRewardSymbol(
        //     token,
        //     true,
        //   )}</b> auto-compounding`
        // }
        // if (isAmpliFARM) {
        //   apyString += ` boosted to <b>${displayAPY(
        //     boostedRewardAPY,
        //   )}</b> when <b>${truncateNumberString(
        //     vaultPool.amountToStakeForBoost,
        //   )}</b> <b>bFARM</b> is <a href='${
        //     ROUTES.AMPLIFARM
        //   }'>staked for 2 years on the Booster page</a>`
        // }
        // apyString += "</div></div>"
      }

      components.push(apyString)
    }
  }

  const tooltipText = `<div align="left">${components.join('')}</div>`

  return tooltipText
}

export const getAdvancedRewardText = (
  token,
  vaultPool,
  tradingApy,
  farmAPY,
  specialVaultApy,
  isSpecialVault,
  boostedEstimatedAPY,
  boostedRewardAPY,
) => {
  const components = []

  const isUniv3Vault = !!(vaultPool && new RegExp(UNIV3_POOL_ID_REGEX).test(vaultPool.id))

  const isHodlVault = !!token.hodlVaultId

  if (vaultPool && (isUniv3Vault || vaultPool.rewardTokenSymbols.length > 1)) {
    const rewardSymbols = !isUniv3Vault
      ? token.apyTokenSymbols
      : token.apyTokenSymbols.filter(symbol => symbol !== 'UNI')

    if (rewardSymbols && rewardSymbols.length) {
      rewardSymbols.forEach((symbol, i) => {
        if (get(token, `estimatedApyBreakdown[${i}]`)) {
          components.push(`
          <div class="detail-box">
            <div class="detail-box-main">
              <div class="detail-icon">
                ${token.apyIconUrls.map(
                  (item, index) =>
                    `<img src='${item
                      .slice(1, item.length)
                      .toLowerCase()}' key=${index} width=24 height=24 alt="" style='margin-left: ${
                      index !== 0 ? '-15px;' : ''
                    }' />`,
                )}
              </div>
              <div class="detail-desc-auto">
                Auto harvested&nbsp;
                <span class="detail-token">
                ${
                  rewardSymbols.length > 1 && token.estimatedApyBreakdown.length === 1
                    ? rewardSymbols.join(' ')
                    : symbol
                }</span>
              </div>
            </div>
            <div class="detail-apy">
              ${
                new BigNumber(token.estimatedApyBreakdown[i]).gt(0)
                  ? `${displayAPY(token.estimatedApyBreakdown[i])}`
                  : `...`
              }
            </div>
          </div>`)
        }
      })
    }

    const hasBoostedApy = new BigNumber(boostedRewardAPY).isGreaterThan(0)

    if (hasBoostedApy) {
      components.push(`
      <div class="detail-box">
        <div class="detail-box-main>
          <div class="detail-icon">
            <img src='/icons/ifarm.svg' width=24 height=24 alt="" />
          </div>
          <div class="detail-desc-no-width">
            iFARM auto-compounding rewards
          </div>
        </div>
        <div class="detail-apy">
          ${displayAPY(boostedRewardAPY)}
        </div>
      </div>`)
    }

    if (Number(farmAPY) > 0) {
      vaultPool.rewardTokenSymbols.forEach((symbol, symbolIdx) => {
        const farmSymbols = [FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL]

        if (token.hideFarmApy && farmSymbols.includes(symbol)) {
          return
        }

        if (
          (!hasBoostedApy || !!symbolIdx) &&
          new BigNumber(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0)).isGreaterThan(0)
        ) {
          components.push(`
          <div class='detail-box'>
            <div class="detail-box-main">
              <div class='detail-icon'>
                <img src='/icons/${symbol.toLowerCase()}.svg' width=24 height=24 alt="" />
              </div>
              <div class="detail-desc">
                ${symbol} rewards
              </div>
            </div>
            <div class="detail-apy">
              ${displayAPY(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0))}
            </div>
          </div>`)

          if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(symbol)) {
            components.push(vaultPool.vestingDescriptionOverride[symbol])
          }
        }
      })
    }

    if (isUniv3Vault && BigNumber(tradingApy).gt(0)) {
      components.push(`
      <div class='detail-box'>
        <div class="detail-box-main">
          <div class='detail-icon'>
            ${
              token.apyIconUrls
                ? token.apyIconUrls.map(
                    (url, i) =>
                      `<img style='${i !== 0 ? 'margin-left: -15px;' : ''}'
                  key=${url} width=24 height=24 src='${url.slice(1, url.length)}' />`,
                  )
                : null
            }
            ${
              !token.inactive && !isHodlVault && vaultPool.rewardTokenSymbols.length >= 2
                ? vaultPool.rewardTokenSymbols.map((symbol, symbolIdx) =>
                    symbolIdx !== 0 && symbolIdx < vaultPool.rewardTokens.length
                      ? `<img style='${symbolIdx !== 0 ? 'margin-left: -15px;' : ''}'
                  key=${symbol} width=24 height=24 style='margin-right: 10px;'
                  src='/icons/${symbol.toLowerCase()}.svg'
                />`
                      : null,
                  )
                : ''
            }
          </div>
          <div class="detail-token-no-width">Liquidity Provision</div>
        </div>
        <div class="detail-apy">
          ${new BigNumber(tradingApy).gt(0) ? `${displayAPY(tradingApy)}` : `0.00%`}
        </div>
      </div>`)
      // components.push(`
    } else if (Number(tradingApy) > 0) {
      components.push(`
      <div class="detail-box">
        <div class="detail-box-main">
          <div class="detail-icon">
            <img src='/icons/swapfee.svg' width=24 height=24 alt="" />
          </div>
          <div class="detail-desc-no-width">Liquidity Provision</div>
        </div>
        <div class="detail-apy">
          ${displayAPY(tradingApy)}
        </div>
      </div>`)
    }

    const tooltipText = `<div>${components
      .filter(c => !isEmpty(c))
      .map(c => `${c}`)
      .join('')}</div>`

    return tooltipText
  }
  if (vaultPool.id === 'fweth-farm') {
    components.push(`<b>${displayAPY(farmAPY)}:</b> <b>FARM</b> rewards`)
    if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(FARM_TOKEN_SYMBOL)) {
      components.push(vaultPool.vestingDescriptionOverride[FARM_TOKEN_SYMBOL])
    }
    components.push(
      `<b>${displayAPY(token.estimatedApy)}</b>: Auto harvested <b>${token.apyTokenSymbols.join(
        ' ',
      )}</b>`,
    )

    const tooltipText = `<div>${components
      .filter(c => !isEmpty(c))
      .map(c => `${c}`)
      .join('<br />')}</div>`

    return tooltipText
  }

  const isIFARM = vaultPool.rewardTokens[0] === addresses.iFARM

  if (isSpecialVault && vaultPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
    components.push(
      `<div class="detail-box">
        <div class="detail-box-main">
          <div class="detail-icon"><img src='/icons/${token.rewardSymbol.toLowerCase()}.svg' width=24 height=24 alt=${
        token.rewardSymbol
      } /></div>
          <div class="detail-desc">${token.rewardSymbol} rewards</div>
        </div>
        <div class="detail-apy"> ${
          specialVaultApy > 0 ? `${displayAPY(specialVaultApy)}</div>` : '...</div>'
        } 
      </div>`,
    )
  } else {
    if (!token.hideTokenApy) {
      if (Number(tradingApy) > 0) {
        components.push(`<div class="detail-box">
          <div class="detail-box-main">
            <div class="detail-icon"><img src='/icons/swapfee.svg' width=24 height=24 alt="" /></div>
            <div class="detail-desc-no-width">Liquidity Provision</div>
          </div>
          <div class="detail-apy">${displayAPY(tradingApy)}</div> 
        </div>`)
      }

      if (arraySize(token.apyTokenSymbols)) {
        if (token.apyOverride) {
          components.push(`<b>${token.apyOverride}</b>`)
        } else if (Number(token.estimatedApy) > 0) {
          let apyString = ''

          if (token.apyDescriptionOverride && token.apyDescriptionOverride.length) {
            apyString += 'Auto harvested'
          } else {
            apyString = `
            <div class="detail-box">
              <div class="detail-box-main">
                <div class="detail-icon">`
            apyString += `${
              token.apyIconUrls ? (
                token.apyIconUrls.map(
                  (url, i) =>
                    `<img key='${i}' width=24 height=24 src='${url.slice(1, url.length)}' />`,
                )
              ) : (
                <>
                  $
                  {vaultPool.rewardTokenSymbols.map((symbol, idx) => {
                    return `<img key=${idx} src='/icons/${symbol.toLowerCase()}.svg' width=24 height=24 alt='${symbol}' />`
                  })}
                </>
              )
            }`
            apyString += '</div>'
            apyString += `<div class="detail-desc-auto">Auto ${
              isHodlVault ? 'hodling <b>SUSHI<b> in' : 'harvested&nbsp;'
            }
            <span class="detail-token">${token.apyTokenSymbols.join(',  ')}</span></div></div>
            ${
              isIFARM && token.fullBuyback ? ` <b>(${displayAPY(token.estimatedApy)})</b>` : ``
            }</b>${
              token.fullBuyback ||
              (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault)
                ? ``
                : `<br/>`
            }`
          }
          apyString += `<div class="detail-apy">${
            isIFARM && token.fullBuyback
              ? displayAPY(boostedEstimatedAPY)
              : displayAPY(token.estimatedApy)
          }</div></div>`
          if (token.fullBuyback) {
            if (isIFARM) {
              apyString += ` claimable as auto-compounded <b>${getRewardSymbol(
                token,
                true,
              )}</b> boosting APY to <b>${displayAPY(boostedEstimatedAPY)}</b><br/>`
            } else {
              apyString += ` (claimable as <b>${getRewardSymbol(
                token,
              )}</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          if (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault) {
            if (
              token.migrated &&
              (token.vaultAddress === addresses.V2.oneInch_ETH_DAI.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDC.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDT.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_WBTC.NewVault)
            ) {
              apyString += ` (sent as <b>fSUSHI</b> alongside with <b>${getRewardSymbol(
                token,
                isIFARM,
              )}</b> <u>upon withdrawal</u>)<br/>`
            } else {
              apyString += ` (claimable as <b>fSUSHI</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          components.push(apyString)
        }
      }
    }

    if (!token.hideFarmApy && Number(farmAPY) > 0) {
      let apyString = `<div class="detail-box">
      <div class="detail-box-main">
        <div class="detail-icon"><img src='/icons/${getRewardSymbol(
          token,
          isIFARM,
          vaultPool,
        ).toLowerCase()}.svg' width=24 height=24 alt='' /></div>`
      apyString += `<div class="detail-desc">${getRewardSymbol(
        token,
        isIFARM,
        vaultPool,
      )} rewards</div></div><div class="detail-apy">${
        isIFARM || Number(boostedRewardAPY) > 0 ? displayAPY(boostedRewardAPY) : displayAPY(farmAPY)
      }</div>`

      components.push(apyString)
    }
  }

  const tooltipText = `<div align="left">${components.join('')}</div>`

  return tooltipText
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

export const hasValidAmountForInputAndMaxButton = (
  userBalance,
  lpTokenBalance,
  totalStaked,
  tokenSymbol,
  withdrawMode,
  isSpecialVault,
  iFARMBalance,
  useIFARM,
) => {
  if (tokenSymbol === FARM_TOKEN_SYMBOL && withdrawMode && !useIFARM) {
    return false
  }

  if (!withdrawMode) {
    return (
      new BigNumber(isSpecialVault ? lpTokenBalance : userBalance).isGreaterThan(0) &&
      DISABLED_DEPOSITS.indexOf(tokenSymbol) === -1
    )
  }

  if (isSpecialVault) {
    return (
      new BigNumber(useIFARM ? iFARMBalance : totalStaked).isGreaterThan(0) &&
      DISABLED_WITHDRAWS.indexOf(tokenSymbol) === -1
    )
  }
  return (
    new BigNumber(totalStaked).plus(lpTokenBalance).isGreaterThan(0) &&
    DISABLED_WITHDRAWS.indexOf(tokenSymbol) === -1
  )
}

export const hasValidAmountForWithdraw = (
  amountToExecute,
  unstakedBalance,
  totalStaked,
  autoUnStake,
) => {
  const amountToExecuteInBN = new BigNumber(amountToExecute)
  const unstakedBalanceInBN = new BigNumber(unstakedBalance)
  const totalBalanceInBN = new BigNumber(unstakedBalance).plus(totalStaked)

  if (amountToExecuteInBN.isGreaterThan(0)) {
    if (autoUnStake && amountToExecuteInBN.isGreaterThan(unstakedBalanceInBN)) {
      const amountToUnStake = amountToExecuteInBN.minus(unstakedBalanceInBN)
      return (
        totalBalanceInBN.isGreaterThanOrEqualTo(amountToExecuteInBN) &&
        amountToUnStake.isLessThanOrEqualTo(totalStaked)
      )
    }
    return unstakedBalanceInBN.isGreaterThanOrEqualTo(amountToExecute)
  }
  return false
}

export const hasAmountLessThanOrEqualTo = (primaryAmount, secondaryAmount) =>
  new BigNumber(secondaryAmount).isGreaterThanOrEqualTo(primaryAmount)

export const hasAmountGreaterThanZero = amount => new BigNumber(amount).isGreaterThan(0)

export const hasRequirementsForInteraction = (loaded, pendingAction, vaultsData, loadingBalances) =>
  loaded === true && pendingAction === null && !isEmpty(vaultsData) && !loadingBalances

export const convertAmountToFARM = (token, balance, decimals, vaultsData) => {
  const pricePerFullShare = get(vaultsData, `[${token}].pricePerFullShare`, 0)

  return new BigNumber(balance)
    .times(pricePerFullShare)
    .dividedBy(new BigNumber(10).exponentiatedBy(decimals))
    .toString()
}

export function CustomException(message, code) {
  this.message = message
  this.code = code
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
          orderBy: createAtBlock, 
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
          orderBy: createAtBlock,
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

function decimalAdjust(type, value, exp) {
  type = String(type)
  if (!['round', 'floor', 'ceil'].includes(type)) {
    throw new TypeError(
      "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
    )
  }
  exp = Number(exp)
  value = Number(value)
  if (exp % 1 !== 0 || Number.isNaN(value)) {
    return NaN
  }
  if (exp === 0) {
    return Math[type](value)
  }
  const [magnitude, exponent = 0] = value.toString().split('e')
  const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`)
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e')
  return Number(`${newMagnitude}e${+newExponent + exp}`)
}

// Decimal round
export const round10 = (value, exp) => decimalAdjust('round', value, exp)
// Decimal floor
export const floor10 = (value, exp) => decimalAdjust('floor', value, exp)
// Decimal ceil
export const ceil10 = (value, exp) => decimalAdjust('ceil', value, exp)

export const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export const isLoadedInOtherDomain = domain => {
  return (
    isInIframe() &&
    (window?.location?.ancestorOrigins?.[0]?.includes(domain) ||
      document?.referrer?.includes(domain))
  )
}

export const isLedgerLive = () => {
  return isLoadedInOtherDomain('ledger')
}

export const isSafeApp = () => {
  return isLoadedInOtherDomain('app.safe.global')
}

export const isSpecialApp = isLedgerLive() || isSafeApp()

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
          where: {
            vault: "${address === farm ? ifarm : address}",
            userAddress: "${account}"
          },
          orderBy: createAtBlock,
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
  const farm = '0xa0246c9032bc3a600820415ae600c6388619a14d'
  const ifarm = '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const graphql = JSON.stringify({
      query: `{
        userBalanceHistories(
          where: {
            vault: "${address === farm ? ifarm : address}",
          },
          orderBy: createAtBlock,
          orderDirection: desc,
        ) {
          sharePrice, priceUnderlying, timestamp
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
        data2 = res.data.userBalanceHistories
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

export const numberWithCommas = x => {
  const parts = x.toString().split('.')
  let integerPart = parts[0]
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : ''
  if (parseInt(integerPart, 10) < 1000) return x
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return integerPart + decimalPart
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
