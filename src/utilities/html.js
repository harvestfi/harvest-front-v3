import React from 'react'
import BigNumber from 'bignumber.js'
import { get, isEmpty, size as arraySize } from 'lodash'
import { addresses } from '../data/index'
import { CHAIN_IDS } from '../data/constants'
import { displayAPY } from './formats'
import {
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  UNIV3_POOL_ID_REGEX,
} from '../constants'

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
              ${
                rewardSymbols.length > 1 && token.estimatedApyBreakdown.length === 1
                  ? token.apyIconUrls.map(
                      (item, index) =>
                        `<img src='${item
                          .slice(1, item.length)
                          .toLowerCase()}' key=${index} width=24 height=24 alt="" style='margin-left: ${
                          index !== 0 ? '-15px;' : ''
                        }' />`,
                    )
                  : `<img src='${token.apyIconUrls[i]
                      .slice(1, token.apyIconUrls[i].length)
                      .toLowerCase()}' key=${i} width=24 height=24 alt=""/>`
              }
            </div>
            <div class="detail-apy">
              ${
                new BigNumber(token.estimatedApyBreakdown[i]).gt(0)
                  ? `${displayAPY(token.estimatedApyBreakdown[i])}`
                  : `...`
              }
            </div>
            <div class="detail-desc-auto">
              ${
                token.apyDescriptionOverride
                  ? `${token.apyDescriptionOverride[i]}`
                  : `Auto harvested`
              }
              <span class="detail-token">
              ${
                token.apyDescriptionOverride
                  ? ''
                  : rewardSymbols.length > 1 && token.estimatedApyBreakdown.length === 1
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
                      index !== 0 ? 0 : ''
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
