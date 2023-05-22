import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal'
import { loadConnectKit } from '@ledgerhq/connect-kit-loader'
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import WalletConnectProvider from '@walletconnect/web3-provider'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import mobile from 'is-mobile'
import { get } from 'lodash'
import Web3 from 'web3'
import arbitrumLogo from '../../assets/images/logos/arbitrum.svg'
import ethLogo from '../../assets/images/logos/eth.png'
import maticLogo from '../../assets/images/logos/matic.svg'
import {
  ARBISCAN_URL,
  ARBITRUM_URL,
  ETHERSCAN_URL,
  ETH_URL,
  INFURA_URL,
  isDebugMode,
  MATICSCAN_URL,
  MATIC_URL,
  POLL_BALANCES_INTERVAL_MS,
} from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import { formatNumber, isLedgerLive } from '../../utils'
import contracts from './contracts'

export const providerOptions = {
  injected: {
    package: null,
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Harvest Finance',
      rpc: {
        [CHAINS_ID.ETH_MAINNET]: INFURA_URL,
        [CHAINS_ID.ARBITRUM_ONE]: ARBITRUM_URL,
        [CHAINS_ID.MATIC_MAINNET]: MATIC_URL,
      },
    },
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        [CHAINS_ID.ETH_MAINNET]: INFURA_URL,
        [CHAINS_ID.MATIC_MAINNET]: MATIC_URL,
        [CHAINS_ID.ARBITRUM_ONE]: ARBITRUM_URL,
      },
    },
  },
  ledger: {
    package: loadConnectKit,
    options: {
      rpc: {
        [CHAINS_ID.ETH_MAINNET]: INFURA_URL,
        [CHAINS_ID.MATIC_MAINNET]: MATIC_URL,
        [CHAINS_ID.ARBITRUM_ONE]: ARBITRUM_URL,
      },
    },
  },
}

const chains = {
  [CHAINS_ID.ETH_MAINNET]: {
    name: 'Ethereum',
    logo: ethLogo,
  },
  [CHAINS_ID.MATIC_MAINNET]: {
    name: 'Polygon (Matic)',
    logo: maticLogo,
  },
  [CHAINS_ID.ARBITRUM_ONE]: {
    name: 'Arbitrum',
    logo: arbitrumLogo,
  },
}

export const getChainHexadecimal = chainId => `0x${Number(chainId).toString(16)}`

export const web3Modal = new SafeAppWeb3Modal({
  network: 'mainnet',
  cacheProvider: false,
  disableInjectedProvider: false,
  providerOptions,
  chains,
})
const SDK = new SafeAppsSDK()
export const infuraWeb3 = new Web3(INFURA_URL)
export const maticWeb3 = new Web3(MATIC_URL)
export const ethWeb3 = new Web3(ETH_URL)
export const arbitrumWeb3 = new Web3(ARBITRUM_URL)
export const ledgerProvider = new ethers.providers.Web3Provider(new IFrameEthereumProvider())
export const ledgerWeb3 = new Web3(new IFrameEthereumProvider())
export const safeProvider = async () => {
  const safe = await SDK.safe.getInfo()
  return new ethers.providers.Web3Provider(new SafeAppProvider(safe, SDK))
}
export const safeWeb3Provider = async () => {
  const safe = await SDK.safe.getInfo()
  return new SafeAppProvider(safe, SDK)
}
export const safeWeb3 = async () => {
  const safe = await SDK.safe.getInfo()
  return new Web3(new SafeAppProvider(safe, SDK))
}

export const mainWeb3 = isLedgerLive() ? ledgerWeb3 : new Web3(window.ethereum || INFURA_URL)

export const getContract = contractName => {
  return !!Object.keys(contracts).find(contractKey => contractKey === contractName)
}

export const newContractInstance = async (contractName, address, customAbi, web3Provider) => {
  const contractAddress = getContract(contractName)
    ? contracts[contractName].contract.address
    : address
  const contractAbi = getContract(contractName) ? contracts[contractName].contract.abi : customAbi

  if (contractAddress) {
    const web3Instance = web3Provider || mainWeb3
    return new web3Instance.eth.Contract(contractAbi, contractAddress)
  }
  return null
}

export const fromWei = (wei, decimals, decimalsToDisplay = 2, format = false, radix = 10) => {
  const weiAmountInBN = new BigNumber(wei)
  let result = '0'

  if (typeof decimals !== 'undefined' && weiAmountInBN.isGreaterThan(0)) {
    result = weiAmountInBN.div(new BigNumber(10).exponentiatedBy(decimals)).toString(radix)

    if (format) {
      result = formatNumber(result, decimalsToDisplay)
    }
  }
  return result
}

export const toWei = (token, decimals, decimalsToDisplay) => {
  let tokenAmountInBN = new BigNumber(token)

  if (typeof decimals !== 'undefined' && tokenAmountInBN.isGreaterThan(0)) {
    tokenAmountInBN = tokenAmountInBN.multipliedBy(new BigNumber(10).exponentiatedBy(decimals))

    if (typeof decimalsToDisplay !== 'undefined') {
      tokenAmountInBN = tokenAmountInBN.decimalPlaces(decimalsToDisplay)
    }

    return tokenAmountInBN.toString(10)
  }
  return '0'
}

export const maxUint256 = () => {
  return ethers.constants.MaxUint256
}

export const formatWeb3PluginErrorMessage = (error, customMessage) => {
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
    case Number(CHAINS_ID.ARBITRUM_ONE):
    case getChainHexadecimal(CHAINS_ID.ARBITRUM_ONE):
      return 'Arbitrum One'
    case Number(CHAINS_ID.ETH_MAINNET):
    case getChainHexadecimal(CHAINS_ID.ETH_MAINNET):
      return 'Ethereum Mainnet'
    case Number(CHAINS_ID.ETH_ROPSTEN):
    case getChainHexadecimal(CHAINS_ID.ETH_ROPSTEN):
      return 'Ethereum Ropsten'
    case Number(CHAINS_ID.MATIC_MAINNET):
    case getChainHexadecimal(CHAINS_ID.MATIC_MAINNET):
      return 'Polygon (Matic)'
    default:
      return `Unknown(${chainId})`
  }
}

export const getWeb3 = (chainId, account) => {
  if (isLedgerLive()) {
    return ledgerWeb3
  }

  if (account) {
    return mainWeb3
  }

  if (chainId === CHAINS_ID.ETH_MAINNET) {
    return ethWeb3
  }

  if (chainId === CHAINS_ID.MATIC_MAINNET) {
    return maticWeb3
  }

  if (chainId === CHAINS_ID.ARBITRUM_ONE) {
    return arbitrumWeb3
  }

  return infuraWeb3
}

export const getWeb3Local = () => {
  return isLedgerLive() ? ledgerWeb3 : mainWeb3
}

export const getExplorerLink = chainId => {
  switch (chainId) {
    case CHAINS_ID.MATIC_MAINNET:
      return MATICSCAN_URL
    case CHAINS_ID.ARBITRUM_ONE:
      return ARBISCAN_URL
    default:
      return ETHERSCAN_URL
  }
}

export const isMobileWeb3 = get(window, 'ethereum') && mobile()

export const handleWeb3ReadMethod = (methodName, params, instance) => {
  if (isDebugMode) {
    console.debug(`
Provider: ${get(instance, 'currentProvider.host') ? 'Infura/HttpProvider' : 'Injected web3'}
Contract address: ${get(instance, '_address')}
Method: ${methodName}
Params: ${params}
    `)
  }

  const contractMethod = instance.methods[methodName]
  return contractMethod(...params).call()
}
