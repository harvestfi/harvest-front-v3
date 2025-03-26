import { ERC4626_PROTOCOLS } from './type'

const filterByProtocol = v => {
  return ERC4626_PROTOCOLS.includes(v.protocol)
}

const getErc4626MarketKey = (protocol, marketId) => {
  return `${protocol}-${marketId}`
}

export const getErc4626MarketKeys = marketBalances => {
  return marketBalances.filter(filterByProtocol).map(({ protocol, marketId }) => {
    marketId = marketId || ''
    return {
      marketType: 'erc4626',
      protocol,
      key: getErc4626MarketKey(protocol, marketId),
      marketId,
    }
  })
}

export const getErc4626MarketBalances = marketBalances => {
  return marketBalances.filter(filterByProtocol).reduce(
    (acc, { protocol, balanceUsd, marketId }) => {
      const balanceLessThanOneCent = Number(balanceUsd) <= 0.01
      const marketBalance = balanceLessThanOneCent ? null : Number(balanceUsd)
      const key = getErc4626MarketKey(protocol, marketId || '')

      return {
        markets: {
          ...acc.markets,
          [key]: marketBalance,
        },
        sum: acc.sum + Number(balanceUsd),
      }
    },
    {
      markets: {},
      sum: 0,
    },
  )
}
