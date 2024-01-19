import React, { createContext, useContext } from 'react'
import axios from 'axios'
import { getChainNamePortals } from '../../utils'
import { PORTALS_FI_API_URL } from '../../constants'

const PortalsContext = createContext()
const usePortals = () => useContext(PortalsContext)

const authToken = process.env.REACT_APP_PORTALS_API_KEY

const PortalsProvider = _ref => {
  const { children } = _ref
  // const [portalsBaseTokens, setPortalsBaseTokens] = useState({})

  const getPortalsBalances = async (address, chainId) => {
    try {
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/account`, {
        params: {
          owner: address,
          networks: getChainNamePortals(chainId),
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      return response.data.balances
    } catch (error) {
      console.error('Error fetching balances:', error)
      return []
    }
  }

  const getPortalsBaseTokens = async chainId => {
    try {
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/tokens`, {
        params: {
          networks: getChainNamePortals(chainId),
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      const totalItems = parseInt(response.data?.totalItems, 10)
      const length = Math.ceil(totalItems / 250)
      const tokens = []
      const promises = Array.from({ length }, async (_, i) => {
        const res = await axios.get(`${PORTALS_FI_API_URL}/v2/tokens`, {
          params: {
            networks: getChainNamePortals(chainId),
            limit: 250,
            page: i,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        return res.data.tokens
      })

      const tokenArrays = await Promise.all(promises)
      tokens.push(...tokenArrays.flat())

      return tokens
    } catch (error) {
      console.error('Error fetching base tokens:', error)
      return []
    }
  }

  const getPortalsPrice = async (chainId, tokenAddress) => {
    try {
      const addresses = `${getChainNamePortals(chainId)}:${tokenAddress}`
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/tokens`, {
        params: {
          addresses,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      return response.data?.tokens[0]?.price
    } catch (error) {
      console.error('Error fetching base tokens:', error)
      return []
    }
  }

  const getPortalsApproval = async (chainId, fromAddress, tokenAddress) => {
    try {
      const inputToken = `${getChainNamePortals(chainId)}:${tokenAddress}`
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/approval`, {
        params: { sender: fromAddress, inputToken, inputAmount: 0 },
      })
      return response.data.context
    } catch (error) {
      console.error('Error fetching approvals:', error)
      return {}
    }
  }

  const portalsApprove = async (chainId, fromAddress, tokenAddress, inputAmount) => {
    try {
      const inputToken = `${getChainNamePortals(chainId)}:${tokenAddress}`
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/approval`, {
        params: { sender: fromAddress, inputToken, inputAmount },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching approve data:', error)
      return {}
    }
  }

  const getPortals = async ({ chainId, sender, tokenIn, inputAmount, tokenOut, slippage }) => {
    try {
      const inputToken = `${getChainNamePortals(chainId)}:${tokenIn}`
      const outputToken = `${getChainNamePortals(chainId)}:${tokenOut}`
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/portal`, {
        params: {
          sender,
          inputToken,
          inputAmount,
          outputToken,
          slippageTolerancePercentage: slippage,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching routes:', error)
      return {}
    }
  }

  const getPortalsEstimate = async ({ chainId, tokenIn, inputAmount, tokenOut, slippage }) => {
    const inputToken = `${getChainNamePortals(chainId)}:${tokenIn}`
    const outputToken = `${getChainNamePortals(chainId)}:${tokenOut}`
    try {
      const response = await axios.get(`${PORTALS_FI_API_URL}/v2/portal/estimate`, {
        params: {
          inputToken,
          inputAmount,
          outputToken,
          slippageTolerancePercentage: slippage,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching balances:', error)
      return {}
    }
  }

  return React.createElement(
    PortalsContext.Provider,
    {
      value: {
        // portalsBaseTokens,
        getPortalsBaseTokens,
        getPortalsBalances,
        getPortalsPrice,
        getPortalsApproval,
        portalsApprove,
        getPortals,
        getPortalsEstimate,
      },
    },
    children,
  )
}
export { PortalsProvider, usePortals }
