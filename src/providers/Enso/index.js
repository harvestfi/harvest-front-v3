import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const EnsoContext = createContext()
const useEnso = () => useContext(EnsoContext)

const EnsoProvider = _ref => {
  const { children } = _ref
  const [ensoBaseTokens, setEnsoBaseTokens] = useState({})

  const getEnsoBalances = async (address, chainId) => {
    try {
      const response = await axios.get('https://api.enso.finance/api/v1/wallet/balances', {
        params: {
          chainId,
          eoaAddress: address,
          useEoa: true,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching balances:', error)
      return []
    }
  }

  const getEnsoBaseTokens = async chainId => {
    try {
      const response = await axios.get('https://api.enso.finance/api/v1/baseTokens', {
        params: {
          chainId,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching base tokens:', error)
      return []
    }
  }

  const getEnsoPrice = async (chainId, address) => {
    try {
      const response = await axios.get(
        `https://api.enso.finance/api/v1/prices/${chainId}/${address}`,
      )
      return response.data.price
    } catch (error) {
      console.error('Error fetching base tokens:', error)
      return []
    }
  }

  const getEnsoApprovals = async (chainId, fromAddress) => {
    try {
      const response = await axios.get('https://api.enso.finance/api/v1/wallet/approvals', {
        params: { chainId, fromAddress, routingStrategy: 'router' },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching approvals:', error)
      return {}
    }
  }

  const ensoApprove = async (chainId, fromAddress, tokenAddress, amount) => {
    try {
      const response = await axios.get('https://api.enso.finance/api/v1/wallet/approve', {
        params: { chainId, fromAddress, tokenAddress, amount, routingStrategy: 'router' },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching approve data:', error)
      return {}
    }
  }

  const getEnsoRoute = async ({ chainId, fromAddress, amountIn, slippage, tokenIn, tokenOut }) => {
    try {
      const response = await axios.get('https://api.enso.finance/api/v1/shortcuts/route', {
        params: {
          chainId,
          fromAddress,
          receiver: fromAddress,
          spender: fromAddress,
          amountIn,
          slippage,
          tokenIn,
          tokenOut,
          routingStrategy: 'router',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching routes:', error)
      return {}
    }
  }

  const getEnsoQuote = async params => {
    try {
      const response = await axios.get('https://api.enso.finance/api/v1/shortcuts/quote', {
        params: { ...params, routingStrategy: 'router' },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching balances:', error)
      return {}
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const chainIds = ['1', '137', '42161']
      const baseTokens = {}
      await Promise.all(
        chainIds.map(async chainId => {
          const tokens = await getEnsoBaseTokens(chainId)
          baseTokens[chainId] = tokens
        }),
      )
      setEnsoBaseTokens(baseTokens)
    }
    fetchData()
  }, [])

  return React.createElement(
    EnsoContext.Provider,
    {
      value: {
        ensoBaseTokens,
        getEnsoBalances,
        getEnsoPrice,
        getEnsoApprovals,
        ensoApprove,
        getEnsoRoute,
        getEnsoQuote,
      },
    },
    children,
  )
}
export { EnsoProvider, useEnso }
