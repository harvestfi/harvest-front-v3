// import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import BigNumber from 'bignumber.js'
import { BrowserProvider, MaxUint256 } from 'ethers'
import { mainnet, arbitrum, polygon, base, optimism, zksync } from 'viem/chains'
import { isNaN } from 'lodash'
import { createPublicClient, createWalletClient, http, custom, defineChain } from 'viem'
import {
  ARBISCAN_URL,
  ARBITRUM_URL,
  BASE_URL,
  ZKSYNC_URL,
  HYPEREVM_URL,
  BASESCAN_URL,
  ETHERSCAN_URL,
  ZKSYNCSCAN_URL,
  HYPEREVMSCAN_URL,
  INFURA_URL,
  MATICSCAN_URL,
  MATIC_URL,
  POLL_BALANCES_INTERVAL_MS,
} from '../../constants'
import { CHAIN_IDS } from '../../data/constants'
import {
  // isLedgerLive,
  isSafeApp,
} from '../../utilities/formats'
import contracts from './contracts'

export const getChainHexadecimal = chainId => `0x${Number(chainId).toString(16)}`

export const hyperevm = /*#__PURE__*/ defineChain({
  id: 999,
  name: 'HyperEVM',
  network: 'hyperevm',
  nativeCurrency: {
    decimals: 18,
    name: 'HyperEVM',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: ['https://hyperliquid.drpc.org'],
      webSocket: ['wss://hyperliquid.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperevmscan',
      url: 'https://hyperevmscan.io',
      apiUrl: 'https://api.hyperevmscan.io/api',
    },
  },
})

const SDK = new SafeAppsSDK()
export const infuraViem = createPublicClient({ transport: http(INFURA_URL), chain: mainnet })
export const maticVIem = createPublicClient({ transport: http(MATIC_URL), chain: polygon })
export const arbitrumViem = createPublicClient({ transport: http(ARBITRUM_URL), chain: arbitrum })
export const baseViem = createPublicClient({ transport: http(BASE_URL), chain: base })
export const zksyncViem = createPublicClient({ transport: http(ZKSYNC_URL), chain: zksync })
export const hyperevmViem = createPublicClient({ transport: http(HYPEREVM_URL), chain: hyperevm })
// export const ledgerProvider = new BrowserProvider(new IFrameEthereumProvider())
// export const ledgerWeb3 = new Web3(new IFrameEthereumProvider())
export const safeProvider = async () => {
  const safe = await SDK.safe.getInfo()
  return new BrowserProvider(new SafeAppProvider(safe, SDK))
}
export const safeViem = async () => {
  const safe = await SDK.safe.getInfo()
  return createPublicClient({ transport: http(new SafeAppProvider(safe, SDK)) })
}

export const mainViem = createPublicClient({
  transport: window.ethereum ? custom(window.ethereum) : http(INFURA_URL),
})

export const getContract = contractName => {
  return !!Object.keys(contracts).find(contractKey => contractKey === contractName)
}

export const fromWei = (wei, decimals, decimalsToDisplay = 2, format = false) => {
  let result = '0'

  try {
    if (wei != null) {
      const weiAmountInBN = new BigNumber(wei)

      if (!weiAmountInBN.isNaN() && weiAmountInBN.isGreaterThan(0)) {
        // Ensure decimalsToDisplay is a valid number
        const displayDecimals = parseInt(decimalsToDisplay, 10)
        if (!isNaN(displayDecimals)) {
          result = weiAmountInBN
            .div(new BigNumber(10).exponentiatedBy(decimals))
            .toFixed(displayDecimals)

          if (format) {
            result = parseFloat(result)
          }
        } else {
          console.error('Invalid value for decimalsToDisplay:', decimalsToDisplay)
        }
      }
    }
  } catch (error) {
    console.error('Error converting wei to decimal:', error)
  }

  return result
}

export const toWei = (token, decimals, decimalsToDisplay) => {
  if (token != null) {
    token = token.toString()
  }
  let tokenAmountInBN = new BigNumber(token)

  if (typeof decimals !== 'undefined' && tokenAmountInBN.isGreaterThan(0)) {
    tokenAmountInBN = tokenAmountInBN.multipliedBy(new BigNumber(10).exponentiatedBy(decimals))

    if (typeof decimalsToDisplay !== 'undefined') {
      tokenAmountInBN = tokenAmountInBN.decimalPlaces(decimalsToDisplay)
    }

    return tokenAmountInBN.toFixed()
  }
  return '0'
}

export const maxUint256 = () => {
  return MaxUint256
}

export const formatViemPluginErrorMessage = (error, customMessage) => {
  console.error(error)

  return (
    customMessage || 'Error submitting transaction, please make sure it was approved in your wallet'
  )
}

export const hasValidUpdatedBalance = (newBalance, currentBalance, fresh) =>
  fresh ||
  newBalance === 'error' ||
  new BigNumber(newBalance).eq(0) ||
  !new BigNumber(newBalance).eq(new BigNumber(currentBalance))

export const pollUpdatedBalance = (method, currentBalance, onTimeout, onSuccess, maxRetries = 2) =>
  new Promise((resolve, reject) => {
    let retries = 0
    const pollBalance = setInterval(() => {
      if (retries >= maxRetries) {
        clearInterval(pollBalance)
        resolve(onTimeout())
      }

      retries += 1

      method
        .then(fetchedBalance => {
          if (hasValidUpdatedBalance(fetchedBalance, currentBalance)) {
            resolve(onSuccess(fetchedBalance))
            clearInterval(pollBalance)
          }
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    }, POLL_BALANCES_INTERVAL_MS)
  })

export const getChainName = chainId => {
  switch (Number(chainId)) {
    case Number(CHAIN_IDS.ARBITRUM_ONE):
    case getChainHexadecimal(CHAIN_IDS.ARBITRUM_ONE):
      return 'Arbitrum One'
    case getChainHexadecimal(CHAIN_IDS.BASE):
      return 'Base'
    case getChainHexadecimal(CHAIN_IDS.ZKSYNC):
      return 'Zksync Era'
    case Number(CHAIN_IDS.ETH_MAINNET):
    case getChainHexadecimal(CHAIN_IDS.ETH_MAINNET):
      return 'Ethereum Mainnet'
    case Number(CHAIN_IDS.ETH_ROPSTEN):
    case getChainHexadecimal(CHAIN_IDS.ETH_ROPSTEN):
      return 'Ethereum Ropsten'
    case Number(CHAIN_IDS.POLYGON_MAINNET):
    case getChainHexadecimal(CHAIN_IDS.POLYGON_MAINNET):
      return 'Polygon (Matic)'
    case Number(CHAIN_IDS.HYPEREVM):
    case getChainHexadecimal(CHAIN_IDS.HYPEREVM):
      return 'HyperEVM'
    default:
      return `Unknown(${chainId})`
  }
}

export const getChainObject = chainIdHex => {
  try {
    const chainIdNum = parseInt(chainIdHex, 16)

    switch (chainIdNum) {
      case 1:
        return mainnet
      case 42161:
        return arbitrum
      case 137:
        return polygon
      case 8453:
        return base
      case 10:
        return optimism
      case 324:
        return zksync
      case 999:
        return hyperevm
      default:
        return mainnet
    }
  } catch (error) {
    console.error('Error getting chain ID:', error)
    return mainnet
  }
}

export const getViem = async (chainId, account, viem = null) => {
  if (account) {
    if (isSafeApp()) {
      const safeViem = await safeViem()
      return safeViem
    }
    // if (isLedgerLive()) {
    //   return ledgerWeb3
    // }

    if (window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })

        const chain = getChainObject(chainIdHex)

        const walletClient = createWalletClient({
          transport: custom(window.ethereum),
          chain,
        })

        return walletClient
      } catch (error) {
        console.error('Error creating wallet client:', error)
      }
    }

    return viem || mainViem
  }

  const getChainSpecificClient = async chainIdStr => {
    if (chainIdStr === CHAIN_IDS.POLYGON_MAINNET) {
      return maticVIem
    }

    if (chainIdStr === CHAIN_IDS.ARBITRUM_ONE) {
      return arbitrumViem
    }

    if (chainIdStr === CHAIN_IDS.BASE) {
      return baseViem
    }

    if (chainIdStr === CHAIN_IDS.ZKSYNC) {
      return zksyncViem
    }

    if (chainIdStr === CHAIN_IDS.HYPEREVM) {
      return hyperevmViem
    }

    return infuraViem
  }

  return getChainSpecificClient(chainId)
}

export const newContractInstance = async (contractName, address, customAbi, publicClient) => {
  let walletClient = null
  const contractAddress = getContract(contractName)
    ? contracts[contractName].contract.address
    : address
  const contractAbi = getContract(contractName) ? contracts[contractName].contract.abi : customAbi

  if (contractAddress) {
    const client = publicClient || mainViem

    if (window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })

        const chain = getChainObject(chainIdHex)

        walletClient = createWalletClient({
          transport: custom(window.ethereum),
          chain,
        })
      } catch (error) {
        console.error('Error creating wallet client:', error)
      }
    }

    const contract = createViemContract({
      address: contractAddress,
      abi: contractAbi,
      publicClient: client,
      walletClient,
    })

    return contract
  }
  return null
}

export const newIPORContractInstance = async (address, abi, publicClient) => {
  let walletClient = null
  if (window.ethereum) {
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })

      const chain = getChainObject(chainIdHex)

      walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain,
      })
    } catch (error) {
      console.error('Error creating wallet client:', error)
    }
  }
  return createViemContract({
    address,
    abi,
    publicClient,
    walletClient,
  })
}

export const getExplorerLink = chainId => {
  switch (chainId) {
    case CHAIN_IDS.POLYGON_MAINNET:
      return MATICSCAN_URL
    case CHAIN_IDS.ARBITRUM_ONE:
      return ARBISCAN_URL
    case CHAIN_IDS.BASE:
      return BASESCAN_URL
    case CHAIN_IDS.ZKSYNC:
      return ZKSYNCSCAN_URL
    case CHAIN_IDS.HYPEREVM:
      return HYPEREVMSCAN_URL
    default:
      return ETHERSCAN_URL
  }
}

export const handleViemReadMethod = async (methodName, args = [], instance) => {
  if (!instance) {
    console.error(`Contract instance is undefined when calling ${methodName}`)
    throw new Error(`Contract instance is undefined when calling ${methodName}`)
  }

  if (instance.read && typeof instance.read[methodName] === 'function') {
    return await instance.read[methodName](args)
  }

  if (instance.methods && instance.methods[methodName]) {
    return await instance.methods[methodName](...args).call()
  }

  if (instance.abi) {
    const methodAbi = instance.abi.find(
      item => item.name === methodName && (item.type === 'function' || item.constant !== undefined),
    )

    if (methodAbi) {
      const address = instance.address || instance.options?.address
      const publicClient = instance.publicClient || instance.client || mainViem

      return await publicClient.readContract({
        address,
        abi: [methodAbi],
        functionName: methodName,
        args,
      })
    }
  }

  if (instance.read || instance.methods) {
    const methods = instance.read || instance.methods
    const methodKeys = Object.keys(methods)

    const matchingMethod = methodKeys.find(key => key.toLowerCase() === methodName.toLowerCase())

    if (matchingMethod) {
      if (instance.read) {
        return await instance.read[matchingMethod](args)
      } else {
        return await instance.methods[matchingMethod](...args).call()
      }
    }
  }
}

export const checkNativeToken = pickedToken => {
  if (
    pickedToken.symbol &&
    ((pickedToken.symbol === 'ETH' && pickedToken.chainId !== '137') ||
      (pickedToken.symbol === 'MATIC' && pickedToken.chainId === '137'))
  )
    return true
  return false
}

export const createViemContract = ({ address, abi, publicClient, walletClient }) => {
  if (!address || !abi || !publicClient) {
    console.error('Missing required parameters for createViemContract')
    return null
  }

  try {
    const contract = {
      address,
      abi,
      publicClient,
      walletClient,

      read: {},

      write: walletClient ? {} : undefined,

      setProvider: newProvider => {
        if (newProvider) {
          contract.publicClient = newProvider

          if (newProvider.readContract) {
            if (Array.isArray(abi)) {
              abi.forEach(item => {
                if ((item.type === 'function' || item.constant !== undefined) && item.name) {
                  if (
                    item.constant === true ||
                    item.stateMutability === 'view' ||
                    item.stateMutability === 'pure'
                  ) {
                    contract.read[item.name] = async (args = []) => {
                      return await newProvider.readContract({
                        address,
                        abi: [item],
                        functionName: item.name,
                        args: Array.isArray(args) ? args : [args],
                      })
                    }
                  }
                }
              })
            }
          }

          if (newProvider.writeContract) {
            contract.walletClient = newProvider

            if (Array.isArray(abi) && contract.write) {
              abi.forEach(item => {
                if ((item.type === 'function' || item.constant !== undefined) && item.name) {
                  if (
                    item.constant !== true &&
                    item.stateMutability !== 'view' &&
                    item.stateMutability !== 'pure'
                  ) {
                    contract.write[item.name] = async (args = [], options = {}) => {
                      return await newProvider.writeContract({
                        address,
                        abi: [item],
                        functionName: item.name,
                        args: Array.isArray(args) ? args : [args],
                        account: options.account,
                      })
                    }
                  }
                }
              })
            }
          }
        }

        return contract
      },
    }

    if (Array.isArray(abi)) {
      abi.forEach(item => {
        if ((item.type === 'function' || item.constant !== undefined) && item.name) {
          if (
            item.constant === true ||
            item.stateMutability === 'view' ||
            item.stateMutability === 'pure'
          ) {
            contract.read[item.name] = async (args = []) => {
              return await publicClient.readContract({
                address,
                abi: [item],
                functionName: item.name,
                args: Array.isArray(args) ? args : [args],
              })
            }
          } else if (walletClient) {
            contract.write[item.name] = async (args = [], options = {}) => {
              return await walletClient.writeContract({
                address,
                abi: [item],
                functionName: item.name,
                args: Array.isArray(args) ? args : [args],
                account: options.account,
              })
            }
          }
        }
      })
    }

    return contract
  } catch (error) {
    console.error('Error creating Viem contract:', error)
    return null
  }
}
