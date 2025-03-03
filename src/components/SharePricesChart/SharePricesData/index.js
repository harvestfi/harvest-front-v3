import React, { useEffect, useState } from 'react'
import ApexChart from '../ApexChart'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { formatDate, numberWithCommas } from '../../../utilities/formats'
import { fromWei } from '../../../services/web3'
import { getVaultHistories, getIPORVaultHistories } from '../../../utilities/apiCalls'
import {
  ChartDiv,
  Container,
  Header,
  Total,
  TokenSymbol,
  TooltipInfo,
  FlexDiv,
  CurContent,
} from './style'

const { tokens } = require('../../../data')

const SharePricesData = ({ token }) => {
  const { bgColorNew, borderColorBox, fontColor3 } = useThemeContext()
  const { account } = useWallet()

  const [loadComplete, setLoadComplete] = useState(false)
  const [sharePriceData, setSharePriceData] = useState({})
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  const [fixedLen, setFixedLen] = useState(0)
  const [lastFarmingTimeStamp, setLastFarmingTimeStamp] = useState('-')

  const address = token.vaultAddress
  const chainId = token.chain || token.data.chain

  const handleTooltipContent = payload => {
    if (payload && payload.length) {
      const currentDate = formatDate(payload[0].payload.x)
      if (Number(payload[0].payload[token.id] === 0)) {
        setCurContent(`0`)
      } else {
        setCurContent(`${numberWithCommas(Number(payload[0].payload[token.id]))}`)
      }

      setCurDate(currentDate)
    }
  }

  const findLastMatchingTimestamp = data => {
    const dl = data.length
    if (data && dl > 0) {
      const firstSharePrice = data[dl - 1].sharePrice

      for (let i = dl - 1; i >= 0; i -= 1) {
        if (data[i].sharePrice === firstSharePrice) {
          return data[i].timestamp
        }
      }

      return data[0].timestamp
    }

    return '-'
  }

  const adjustTimestamps = (sharepriceData, id) => {
    const timestamps = sharepriceData[id].map(entry => entry.timestamp)

    // Iterate over all keys except "morphoGC_cbBTC"
    Object.keys(sharepriceData).forEach(key => {
      if (key === id) return

      sharepriceData[key].forEach(entry => {
        // Find the next larger timestamp in morphoGC_cbBTC
        for (let i = 0; i < timestamps.length - 1; i += 1) {
          if (entry.timestamp >= timestamps[i + 1] && entry.timestamp < timestamps[i]) {
            entry.timestamp = timestamps[i + 1]
            break
          }
        }
        if (entry.timestamp > timestamps[0]) {
          entry.timestamp = timestamps[0]
        }
      })

      // Group by timestamp and keep only the entry with the largest sharePrice
      const grouped = {}
      sharepriceData[key].forEach(entry => {
        const ts = entry.timestamp
        if (!grouped[ts] || parseFloat(entry.sharePrice) < parseFloat(grouped[ts].sharePrice)) {
          grouped[ts] = entry
        }
      })

      // Convert grouped object back to array
      sharepriceData[key] = Object.values(grouped)
    })

    return sharepriceData
  }

  useEffect(() => {
    let isMounted = true
    const initData = async () => {
      if (account && address && chainId) {
        try {
          let sharePricesData = {}

          setLoadComplete(false)
          if (token.allocPointData && token.allocPointData.length > 0) {
            await Promise.all(
              token.allocPointData
                .filter(data => data.hVaultId !== 'Not invested')
                .map(async data => {
                  const vaultAddress = tokens[data.hVaultId].vaultAddress
                  const vaultChain = tokens[data.hVaultId].chain
                  const { vaultHData, vaultHFlag } = await getVaultHistories(
                    vaultAddress,
                    vaultChain,
                  )
                  if (vaultHFlag) {
                    vaultHData.forEach((obj, index) => {
                      const sharePriceDecimals = fromWei(
                        obj.sharePrice,
                        tokens[data.hVaultId].decimals,
                        5,
                      )
                      vaultHData[index].sharePrice = sharePriceDecimals
                    })
                    sharePricesData[data.hVaultId] = vaultHData
                  } else {
                    sharePricesData[data.hVaultId] = {}
                  }
                }),
            )

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

            sharePricesData = adjustTimestamps(sharePricesData, token.id)

            setSharePriceData(sharePricesData)

            const lastMatchingTimestamp = findLastMatchingTimestamp(sharePricesData[token.id])
            setLastFarmingTimeStamp(lastMatchingTimestamp)

            if (isMounted && sharePricesData[token.id]?.length > 0) {
              setLoadComplete(true)
            }
          }
        } catch (error) {
          console.log('An error ocurred', error)
        }
      }
    }

    initData()

    return () => {
      isMounted = false
    }
  }, [address, chainId, account, token])

  return (
    <Container backColor={bgColorNew} borderColor={borderColorBox}>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare" color="#15B088">
                Share Price
              </TokenSymbol>
              <FlexDiv>
                <CurContent color={fontColor3}>
                  {curContent === '0' ? (
                    ''
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: `${curDate}&nbsp;<span>|</span>&nbsp;` }}
                    />
                  )}
                </CurContent>
                <CurContent color="#15B088">{curContent}</CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
        </Total>
      </Header>
      <ChartDiv className="advanced-price">
        <ApexChart
          token={token}
          loadComplete={loadComplete}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
          handleTooltipContent={handleTooltipContent}
          setFixedLen={setFixedLen}
          fixedLen={fixedLen}
          lastFarmingTimeStamp={lastFarmingTimeStamp}
          isInactive={token.inactive}
          sharePriceData={sharePriceData}
        />
      </ChartDiv>
    </Container>
  )
}
export default SharePricesData
