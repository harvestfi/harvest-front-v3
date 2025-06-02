import React, { useEffect, useState } from 'react'
import ApexChart from '../ApexChart'
import { useThemeContext } from '../../../providers/useThemeContext'
import { fromWei } from '../../../services/web3'
import { getMultipleVaultHistories, getIPORVaultHistories } from '../../../utilities/apiCalls'
import { ChartDiv, Container, Header, Total, TokenSymbol, TooltipInfo, FlexDiv } from './style'

/* eslint-disable camelcase */
const vaultAdded = {
  morphoION_USDC: 1746057600,
  morphoMW_USDC: 1747958400,
  morphoGC_USDC: 1746921600,
  morphoSE_USDC: 1747440000,
  morphoGP_USDC: 1746316800,
  morphoSH_USDC: 1746662400,
  morphoSPK_USDC: 1746316800,
  euler_USDC_AR: 1746520200,
  arcadia_USDC: 1746520200,
  fortyAcres_USDC: 1748595000,
  morpho_AR_USDC: 1748595000,
  morpho_UN_USDC: 1748595000,
  morpho_YOG_USDC: 1748595000,
  arcadia_ETH: 1746520200,
  morphoSH_ETH: 1747612800,
  morphoMW_cbBTC: 1747180800,
  arcadia_cbBTC: 1746520200,
}

const { tokens } = require('../../../data')

const SharePricesData = ({ chainName, token, setSharePricesData, iporHvaultsLFAPY }) => {
  const { bgColorNew, borderColorBox } = useThemeContext()

  const [loadComplete, setLoadComplete] = useState(false)
  const [sharePriceData, setSharePriceData] = useState({})

  const address = token.vaultAddress
  const chainId = token.chain || token.data.chain

  useEffect(() => {
    const interpolateSharePrice = (prev, next, targetTimestamp) => {
      if (!prev || !next) return prev ? parseFloat(prev.sharePrice) : parseFloat(next.sharePrice) // Handle edge cases

      const t1 = parseInt(prev.timestamp, 10), // Ensure timestamps are numbers
        p1 = parseFloat(prev.sharePrice), // Ensure prices are numbers
        t2 = parseInt(next.timestamp, 10),
        p2 = parseFloat(next.sharePrice),
        t = parseInt(targetTimestamp, 10)

      if (t1 === t2) return p1 // Avoid division by zero

      return p1 + ((p2 - p1) * (t - t1)) / (t2 - t1)
    }

    const adjustTimestamps = (sharepriceData, id) => {
      const referenceTimestamps = sharepriceData[id]
        .map(entry => entry.timestamp)
        .filter(timestamp => timestamp > 1746057600)

      Object.keys(sharepriceData).forEach(key => {
        const targetEntries = sharepriceData[key].filter(
            entry => Number(entry.timestamp) > (vaultAdded[key] ? vaultAdded[key] : 1746057600),
          ),
          adjustedEntries = []

        let targetIndex = 0

        referenceTimestamps.forEach(ts => {
          while (
            targetIndex < targetEntries.length - 1 &&
            Number(targetEntries[targetIndex + 1].timestamp) >= ts
          ) {
            targetIndex += 1
          }

          const prev = targetEntries[targetIndex],
            next = targetEntries[targetIndex + 1] || prev,
            interpolatedPrice = interpolateSharePrice(prev, next, ts)

          adjustedEntries.push({
            timestamp: ts,
            sharePrice: parseFloat(interpolatedPrice.toFixed(5)), // Keep precision
          })
        })

        sharepriceData[key] = adjustedEntries
      })

      const targetFinalValue =
        parseFloat(sharepriceData[id][0].sharePrice) /
        parseFloat(sharepriceData[id][sharepriceData[id].length - 1].sharePrice)

      Object.keys(sharepriceData).forEach(key => {
        const targetEntries = sharepriceData[key],
          adjustedEntries = [],
          originalStartPrice = parseFloat(targetEntries[targetEntries.length - 1].sharePrice)

        referenceTimestamps.forEach(ts => {
          const curData = targetEntries.find(entry => entry.timestamp === ts) ?? 1,
            adjustedSharePrice = parseFloat(curData.sharePrice) / originalStartPrice

          adjustedEntries.push({
            timestamp: ts,
            sharePrice: parseFloat(adjustedSharePrice.toFixed(5)), // Keep precision
          })
        })
        // Remove outliers
        if (adjustedEntries[0].sharePrice / targetFinalValue > 1.001) {
          delete sharepriceData[key]
        } else {
          sharepriceData[key] = adjustedEntries
        }
      })
      return sharepriceData
    }

    const initData = async () => {
      if (address && chainId && Object.keys(sharePriceData).length === 0) {
        try {
          let sharePricesData = {}

          setLoadComplete(false)
          if (token.allocPointData && token.allocPointData.length > 0) {
            const vaults = token.allocPointData
              .filter(data => data.hVaultId !== 'Not invested')
              .map(data => ({ id: data.hVaultId, address: tokens[data.hVaultId].vaultAddress }))
            const addresses = vaults.map(vault => vault.address)
            const { vaultHData, vaultHFlag } = await getMultipleVaultHistories(
              addresses,
              '1746057600',
              chainId,
            )

            if (vaultHFlag) {
              await vaults.forEach(vault => {
                const vaultData = vaultHData.filter(
                  data => data.vault.id === vault.address.toLowerCase(),
                )
                if (vaultData) {
                  vaultData.forEach((obj, index) => {
                    vaultData[index].sharePrice = obj.sharePriceDec
                  })
                  sharePricesData[vault.id] = vaultData
                }
              })
            }

            const { vaultHIPORFlag, vaultHIPORData } = await getIPORVaultHistories(
              token.chain,
              token.vaultAddress.toLowerCase(),
            )
            sharePricesData[token.id] = {}
            if (vaultHIPORFlag) {
              vaultHIPORData.forEach((obj, index) => {
                const sharePriceDecimals = fromWei(obj.sharePrice, token.decimals, 5)
                vaultHIPORData[index].sharePrice = sharePriceDecimals
              })
              sharePricesData[token.id] = vaultHIPORData
            }
            setSharePricesData(sharePricesData)

            if (sharePricesData[token.id].length > 0) {
              sharePricesData = adjustTimestamps(sharePricesData, token.id)
            }
            setSharePriceData(sharePricesData)

            if (sharePricesData[token.id]?.length > 0) {
              setLoadComplete(true)
            }
          }
        } catch (error) {
          console.log('An error ocurred', error)
        }
      }
    }

    initData()
  }, [chainId, address, token, setSharePricesData, sharePriceData])

  return (
    <Container backColor={bgColorNew} borderColor={borderColorBox}>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare" color="#15B088">
                Share Price
              </TokenSymbol>
            </TooltipInfo>
          </FlexDiv>
        </Total>
      </Header>
      <ChartDiv className="advanced-price">
        <ApexChart
          chainName={chainName}
          token={token}
          loadComplete={loadComplete}
          sharePriceData={sharePriceData}
          iporHvaultsLFAPY={iporHvaultsLFAPY}
        />
      </ChartDiv>
    </Container>
  )
}
export default SharePricesData
