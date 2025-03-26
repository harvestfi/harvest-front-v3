import React, { createContext, useContext } from 'react'

import { getErc4626MarketBalances, getErc4626MarketKeys } from './markets/erc4626'

const IporContext = createContext()
const useIpor = () => useContext(IporContext)

const IporProvider = ({ children }) => {
  const getAllocationOvertimeData = data => {
    if (!data) return undefined

    return data.history.map(({ blockTimestamp, marketBalances, tvl, blockNumber }) => {
      const erc4626 = getErc4626MarketBalances(marketBalances)
      const marketsSum = erc4626.sum
      const unallocatedMaybe = +tvl - marketsSum
      const unallocated = unallocatedMaybe <= 0.01 ? null : unallocatedMaybe

      return {
        date: blockTimestamp,
        blockNumber,
        markets: { ...erc4626.markets },
        marketsSum,
        unallocated,
      }
    })
  }

  const getMarketDataKeys = data => {
    if (!data) return undefined

    const marketsKeys = data.history.flatMap(({ marketBalances }) => {
      return getErc4626MarketKeys(marketBalances)
    })

    return Array.from(new Map(marketsKeys.map(keyData => [keyData.key, keyData])).values())
  }

  const getMapChartData = ({ dataPoints, marketDataKeys }) => {
    if (!marketDataKeys) return []

    return dataPoints.map(point => ({
      ...point,
      ...marketDataKeys.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]: point.markets[key] ?? 0,
        }),
        {},
      ),
    }))
  }

  return (
    <IporContext.Provider
      value={{
        getAllocationOvertimeData,
        getMarketDataKeys,
        getMapChartData,
      }}
    >
      {children}
    </IporContext.Provider>
  )
}

export { IporProvider, useIpor }
