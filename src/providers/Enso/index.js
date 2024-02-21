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
      },
    },
    children,
  )
}
export { EnsoProvider, useEnso }
