import { defineChain } from 'thirdweb'
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useAutoConnect,
  useConnectModal,
  useDisconnect,
} from 'thirdweb/react' // eslint-disable-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved
import { EIP1193, createWallet } from 'thirdweb/wallets'
import { isArray } from 'lodash'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import { createWalletClient, custom } from 'viem'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../constants'
import { CHAIN_IDS } from '../../data/constants'
import {
  hasValidUpdatedBalance,
  // ledgerProvider,
  mainViem,
  pollUpdatedBalance,
  getChainObject,
  safeProvider,
  getViem,
} from '../../services/viem'
import tokenMethods from '../../services/viem/contracts/token/methods'
import { isLedgerLive, isSafeApp } from '../../utilities/formats'
import { sendWalletConnection } from '../../utilities/apiCalls'
import { useContracts } from '../Contracts'
import { thirdwebClient } from '../thirdweb'

const { tokens } = require('../../data')

const WalletContext = createContext()
const useWallet = () => useContext(WalletContext)

const WALLETCONNECT_PROJECT_ID = '6931eace1272646ed84e46c55fac0311'

const THIRDWEB_APP_METADATA = {
  name: 'Harvest',
  url: 'https://app.harvest.finance',
  description: 'Home to Yield Farming',
  logoUrl: 'https://app.harvest.finance/static/media/ifarm.ffb37908.svg',
}

const THIRDWEB_SUPPORTED_CHAINS = [
  CHAIN_IDS.ETH_MAINNET,
  CHAIN_IDS.POLYGON_MAINNET,
  CHAIN_IDS.ARBITRUM_ONE,
  CHAIN_IDS.BASE,
  CHAIN_IDS.ZKSYNC,
  CHAIN_IDS.HYPEREVM,
].map(chain => defineChain(Number(chain)))

const THIRDWEB_WALLETS = [
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  createWallet('io.zerion.wallet'),
  createWallet('com.okex.wallet'),
]

const getInjectedProviderCandidates = () => {
  if (!window.ethereum) return []
  const providers = Array.isArray(window.ethereum.providers) ? window.ethereum.providers : []
  return [...new Set([window.ethereum, ...providers])]
}

const isMetaMaskProvider = provider =>
  provider?.isMetaMask && !provider?.isRabby && !provider?.isBraveWallet

const isProviderMatchForWalletId = (walletId, provider) => {
  switch (walletId) {
    case 'io.metamask':
      return isMetaMaskProvider(provider)
    case 'com.coinbase.wallet':
      return provider?.isCoinbaseWallet
    case 'io.rabby':
      return provider?.isRabby
    case 'io.zerion.wallet':
      return provider?.isZerion
    case 'com.okex.wallet':
      return provider?.isOkxWallet || provider?.isOKExWallet || provider?.isOkexWallet
    default:
      return false
  }
}

const getInjectedProviderByWalletId = (walletId, providers) =>
  providers.find(provider => isProviderMatchForWalletId(walletId, provider))

const getPrioritizedInjectedProviders = (providers, walletId) => {
  const walletIdProvider = getInjectedProviderByWalletId(walletId, providers)
  const uniqueProviders = [...new Set(providers)]
  return uniqueProviders.sort((providerA, providerB) => {
    const priority = provider => {
      let score = 0
      if (walletIdProvider && provider === walletIdProvider) score += 300
      if ((walletId === 'io.metamask' || walletId === 'injected') && isMetaMaskProvider(provider)) {
        score += 200
      }
      if (isMetaMaskProvider(provider)) score += 100
      return score
    }
    return priority(providerB) - priority(providerA)
  })
}

const normalizeChainToHex = chain => {
  if (typeof chain === 'string') {
    return chain.startsWith('0x') ? chain : `0x${Number(chain).toString(16)}`
  }
  if (typeof chain === 'number') {
    return `0x${chain.toString(16)}`
  }
  if (chain && typeof chain === 'object' && chain.id !== undefined) {
    return `0x${Number(chain.id).toString(16)}`
  }
  return null
}

const useSendWalletConnection = lastSentRef => {
  return useCallback(walletAddress => {
    if (!walletAddress) return

    const normalizedAddress = walletAddress.toLowerCase()
    if (lastSentRef.current !== normalizedAddress) {
      lastSentRef.current = normalizedAddress
      sendWalletConnection(normalizedAddress)
    }
  }, [])
}

const WalletProvider = _ref => {
  const { children } = _ref
  const [account, setAccount] = useState(null)
  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(CHAIN_IDS.ETH_MAINNET)
  const [viem, setViem] = useState(mainViem)
  const [selChain, setSelChain] = useState([
    CHAIN_IDS.ETH_MAINNET,
    CHAIN_IDS.POLYGON_MAINNET,
    CHAIN_IDS.ARBITRUM_ONE,
    CHAIN_IDS.BASE,
    CHAIN_IDS.ZKSYNC,
    CHAIN_IDS.HYPEREVM,
  ])
  const [balances, setBalances] = useState({})
  const [logout, setLogout] = useState(false)
  const [balancesToLoad, setBalancesToLoad] = useState([])
  const [approvedBalances, setApprovedBalances] = useState({})
  const [walletLocked, setWalletLocked] = useState(false)
  const { contracts } = useContracts()

  const activeAccount = useActiveAccount()
  const activeWallet = useActiveWallet()
  const activeWalletChain = useActiveWalletChain()
  const connectionStatus = useActiveWalletConnectionStatus()
  const { connect } = useConnectModal()
  const { disconnect } = useDisconnect()

  useAutoConnect({
    client: thirdwebClient,
    appMetadata: THIRDWEB_APP_METADATA,
    timeout: 15000,
  })

  const walletLockCheckIntervalRef = useRef(null)
  const lastSentWalletAddressRef = useRef(null)
  const sendWalletConnectionOnce = useSendWalletConnection(lastSentWalletAddressRef)

  const thirdwebAccount = activeAccount?.address?.toLowerCase() ?? null
  const thirdwebChainId = activeWalletChain?.id ? String(activeWalletChain.id) : null
  const activeWalletId = activeWallet?.id

  const activeProvider = useMemo(() => {
    if (!activeWallet || !activeWalletChain?.id) return null
    try {
      return EIP1193.toProvider({
        wallet: activeWallet,
        chain: defineChain(Number(activeWalletChain.id)),
        client: thirdwebClient,
      })
    } catch (error) {
      console.error('Error creating thirdweb EIP-1193 provider:', error)
      return null
    }
  }, [activeWallet, activeWalletChain])

  const getInjectedProviderForWalletAccount = useCallback(
    async walletAccount => {
      const providers = getInjectedProviderCandidates()
      if (!providers.length) return null

      const providerCandidates = getPrioritizedInjectedProviders(providers, activeWalletId)
      const providerForWalletId = getInjectedProviderByWalletId(activeWalletId, providerCandidates)

      if (!walletAccount) {
        return providerCandidates.find(provider => typeof provider?.request === 'function') || null
      }

      const normalizedWalletAccount = walletAccount.toLowerCase()
      for (const provider of providerCandidates) {
        if (!provider || typeof provider.request !== 'function') continue
        try {
          const accounts = await provider.request({ method: 'eth_accounts' })
          const normalizedAccounts = Array.isArray(accounts)
            ? accounts.map(account => account.toLowerCase())
            : []
          if (normalizedAccounts.includes(normalizedWalletAccount)) {
            return provider
          }
        } catch (error) {
          // Ignore provider read failures and continue checking other providers.
        }
      }

      return providerForWalletId || null
    },
    [activeWalletId],
  )

  const getConnectedInjectedAccount = useCallback(async injectedProvider => {
    const provider = injectedProvider || window.ethereum
    if (!provider || typeof provider.request !== 'function') return null
    try {
      const accounts = await provider.request({ method: 'eth_accounts' })
      if (!Array.isArray(accounts) || !accounts[0]) return null
      return accounts[0].toLowerCase()
    } catch (error) {
      console.error('Error reading injected accounts:', error)
      return null
    }
  }, [])

  const getInjectedChainForAccount = useCallback(
    async walletAccount => {
      if (!walletAccount) return { chainId: null, provider: null }

      const injectedProvider = await getInjectedProviderForWalletAccount(walletAccount)
      if (!injectedProvider || typeof injectedProvider.request !== 'function') {
        return { chainId: null, provider: null }
      }

      const injectedAccount = await getConnectedInjectedAccount(injectedProvider)
      if (injectedAccount && injectedAccount !== walletAccount.toLowerCase()) {
        return { chainId: null, provider: injectedProvider }
      }

      try {
        const chainHex = await injectedProvider.request({ method: 'eth_chainId' })
        const normalized = normalizeChainToHex(chainHex)
        if (!normalized) return { chainId: null, provider: injectedProvider }
        const chainNew = parseInt(normalized, 16).toString()
        if (Number.isNaN(Number(chainNew))) return { chainId: null, provider: injectedProvider }
        return { chainId: chainNew, provider: injectedProvider }
      } catch (error) {
        console.error('Error reading chain from injected wallet:', error)
        return { chainId: null, provider: injectedProvider }
      }
    },
    [getConnectedInjectedAccount, getInjectedProviderForWalletAccount],
  )

  const checkWalletLock = useCallback(async () => {
    if (!isSafeApp() && activeProvider) {
      try {
        const accounts = await activeProvider.request({ method: 'eth_accounts' })

        if (!accounts || accounts.length === 0) {
          if (connected) {
            setConnected(false)
            setAccount(null)
            setWalletLocked(true)
          }
        } else {
          const walletAddress = accounts[0].toLowerCase()
          setAccount(walletAddress)
          setConnected(true)
          setWalletLocked(false)
          sendWalletConnectionOnce(walletAddress)
        }
      } catch (error) {
        console.error('Error checking wallet lock status:', error)
        if (connected) {
          setConnected(false)
          setAccount(null)
          setWalletLocked(true)
        }
      }
    }
  }, [activeProvider, connected, sendWalletConnectionOnce])

  useEffect(() => {
    checkWalletLock()
    walletLockCheckIntervalRef.current = setInterval(() => {
      checkWalletLock()
    }, 15000)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkWalletLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      if (walletLockCheckIntervalRef.current) {
        clearInterval(walletLockCheckIntervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [checkWalletLock])

  useEffect(() => {
    const fetchSafeData = async () => {
      if (isSafeApp()) {
        const safeAppProvider = await safeProvider()
        const selectedChain = await safeAppProvider.getNetwork()
        setChainId(selectedChain.chainId.toString())
        const selectedAccount = await safeAppProvider.getSigner().getAddress()
        const walletAddress = selectedAccount && selectedAccount.toLowerCase()
        setAccount(walletAddress)
        setConnected(true)
        if (walletAddress) {
          sendWalletConnectionOnce(walletAddress)
        }
      }
    }

    fetchSafeData()
  }, [sendWalletConnectionOnce])

  useEffect(() => {
    if (isSafeApp()) return
    if (!thirdwebChainId) return

    let isCancelled = false

    const syncChainId = async () => {
      if (thirdwebAccount) {
        for (let i = 0; i < 3; i += 1) {
          const { chainId: injectedChainId } = await getInjectedChainForAccount(thirdwebAccount)
          if (injectedChainId) {
            if (!isCancelled) {
              setChainId(injectedChainId)
            }
            return
          }
          await new Promise(resolve => {
            setTimeout(resolve, 250)
          })
        }
      }

      if (!isCancelled) {
        setChainId(thirdwebChainId)
      }
    }

    syncChainId()
    return () => {
      isCancelled = true
    }
  }, [thirdwebChainId, thirdwebAccount, getInjectedChainForAccount])

  useEffect(() => {
    if (isSafeApp()) return

    if (thirdwebAccount) {
      setAccount(thirdwebAccount)
      setConnected(true)
      setLogout(false)
      sendWalletConnectionOnce(thirdwebAccount)
      return
    }

    if (connectionStatus === 'disconnected') {
      setConnected(false)
      setAccount(null)
      setBalances({})
      setLogout(true)
      lastSentWalletAddressRef.current = null
      setViem(mainViem)
    }
  }, [thirdwebAccount, connectionStatus, sendWalletConnectionOnce])

  useEffect(() => {
    if (isSafeApp()) return
    if (!thirdwebChainId) return

    let isCancelled = false

    const syncWalletClient = async () => {
      let providerToUse = activeProvider,
        chainHex = normalizeChainToHex(thirdwebChainId)

      const { chainId: injectedChainId, provider: injectedProvider } =
        await getInjectedChainForAccount(thirdwebAccount)
      if (injectedChainId && injectedProvider) {
        providerToUse = injectedProvider
        chainHex = normalizeChainToHex(injectedChainId)
      }

      if (!providerToUse || !chainHex) {
        if (!isCancelled) {
          setViem(mainViem)
        }
        return
      }

      try {
        const chain = getChainObject(chainHex)
        const walletClient = createWalletClient({
          transport: custom(providerToUse),
          chain,
        })
        if (!isCancelled) {
          setViem(walletClient)
        }
      } catch (error) {
        console.error('Error creating viem wallet client from provider:', error)
        if (!isCancelled) {
          setViem(mainViem)
        }
      }
    }

    syncWalletClient()

    return () => {
      isCancelled = true
    }
  }, [activeProvider, thirdwebChainId, thirdwebAccount, getInjectedChainForAccount])

  const onNetworkChange = useCallback(newChain => {
    const normalizedNewChain = normalizeChainToHex(newChain)
    if (!normalizedNewChain) return

    if (!isLedgerLive()) {
      const chainNew = parseInt(normalizedNewChain, 16).toString()
      if (!Number.isNaN(Number(chainNew))) {
        setConnected(true)
        setChainId(chainNew)
      }
    }
  }, [])

  useEffect(() => {
    if (isSafeApp()) return

    let chainListenerProviders = [],
      isCancelled = false

    const syncInjectedChain = async () => {
      const { chainId: injectedChainId } = await getInjectedChainForAccount(thirdwebAccount)
      if (isCancelled) return
      if (injectedChainId) {
        setChainId(injectedChainId)
      }
    }

    const onInjectedChainChanged = async () => {
      await syncInjectedChain()
    }

    const subscribeToInjectedProviders = () => {
      const providerCandidates = getPrioritizedInjectedProviders(
        getInjectedProviderCandidates(),
        activeWalletId,
      )
      chainListenerProviders = providerCandidates.filter(
        provider => typeof provider?.on === 'function',
      )
      chainListenerProviders.forEach(provider => {
        provider.on('chainChanged', onInjectedChainChanged)
      })
    }

    syncInjectedChain()
    subscribeToInjectedProviders()

    return () => {
      isCancelled = true
      chainListenerProviders.forEach(provider => {
        provider.removeListener?.('chainChanged', onInjectedChainChanged)
      })
      chainListenerProviders = []
    }
  }, [
    onNetworkChange,
    connectionStatus,
    thirdwebAccount,
    activeWalletId,
    getInjectedChainForAccount,
  ])

  useEffect(() => {
    let removeSafeNetworkListener,
      removeSafeAccountsListener,
      unsubscribeChainChanged,
      unsubscribeAccountsChanged

    const setupSafeListeners = async () => {
      if (isSafeApp()) {
        const safeViemProvider = await safeProvider()
        if (safeViemProvider && safeViemProvider.provider.on) {
          removeSafeNetworkListener = safeViemProvider.provider.on('chainChanged', onNetworkChange)
          removeSafeAccountsListener = safeViemProvider.provider.on(
            'accountsChanged',
            accountAddress => {
              const walletAddress = accountAddress[0].toLowerCase()
              setAccount(walletAddress)
              setConnected(true)
              sendWalletConnectionOnce(walletAddress)
            },
          )
        }
      }
    }

    setupSafeListeners()

    if (!isSafeApp() && activeWallet?.subscribe) {
      unsubscribeChainChanged = activeWallet.subscribe('chainChanged', chain => {
        onNetworkChange(chain)
      })

      unsubscribeAccountsChanged = activeWallet.subscribe('accountsChanged', accountAddress => {
        if (accountAddress && accountAddress.length > 0) {
          const walletAddress = accountAddress[0].toLowerCase()
          setAccount(walletAddress)
          setConnected(true)
          sendWalletConnectionOnce(walletAddress)
        } else {
          setAccount(null)
          setConnected(false)
        }
      })
    }

    return () => {
      if (typeof removeSafeAccountsListener?.removeAllListeners === 'function') {
        removeSafeAccountsListener.removeAllListeners('accountsChanged')
      }
      if (typeof removeSafeNetworkListener?.removeListener === 'function') {
        removeSafeNetworkListener.removeListener('chainChanged', onNetworkChange)
      }
      if (typeof unsubscribeChainChanged === 'function') {
        unsubscribeChainChanged()
      }
      if (typeof unsubscribeAccountsChanged === 'function') {
        unsubscribeAccountsChanged()
      }
    }
  }, [activeWallet, onNetworkChange, sendWalletConnectionOnce])

  const connectAction = useCallback(async () => {
    try {
      await connect({
        client: thirdwebClient,
        chains: THIRDWEB_SUPPORTED_CHAINS,
        wallets: THIRDWEB_WALLETS,
        walletConnect: {
          projectId: WALLETCONNECT_PROJECT_ID,
        },
        appMetadata: THIRDWEB_APP_METADATA,
        termsOfServiceUrl: 'https://docs.harvest.finance/legal/terms-and-conditions',
        privacyPolicyUrl: 'https://docs.harvest.finance/legal/privacy-policy',
      })
      return true
    } catch (error) {
      // thirdweb rejects without a reason when the modal is closed (X or backdrop).
      if (error == null) {
        return false
      }

      const errorMessage = typeof error === 'string' ? error : error?.message || ''
      const isUserCancelled = /(closed|cancelled|canceled|rejected|aborted)/i.test(errorMessage)
      if (isUserCancelled) {
        return false
      }

      console.error('Error connecting wallet:', error)
      toast.error('Unable to connect wallet. Please try again.')
      return false
    }
  }, [connect])

  const disconnectAction = useCallback(async () => {
    if (!isLedgerLive() && activeWallet) {
      disconnect(activeWallet)
    }
  }, [disconnect, activeWallet])

  const getWalletBalances = useCallback(
    async function (selectedTokens, newAccount, fresh) {
      if (fresh === void 0) {
        fresh = false
      }

      if (account && selectedTokens && selectedTokens.length) {
        const fetchedBalances = {}
        const fetchedApprovedBalances = {}
        setBalancesToLoad(selectedTokens)
        await Promise.all(
          selectedTokens
            .filter(token => !isArray(tokens[token]?.tokenAddress))
            .filter(token => token !== undefined)
            .map(async token => {
              const { methods, instance } = contracts[token]
              const viemInstance = await getViem(false, account, viem)
              if (instance && typeof instance.setProvider === 'function') {
                instance.setProvider(viemInstance)
              }
              if (viemInstance.walletClient && instance) {
                instance.walletClient = viemInstance.walletClient
                if (viemInstance.writeContract) {
                  instance.writeContract = viemInstance.writeContract
                }
              }
              const vaultAddress = tokens[token].vaultAddress
              const currAssetBalance = balances[token]
              const newAssetBalance = await tokenMethods.getBalance(account, instance)

              if (hasValidUpdatedBalance(newAssetBalance, currAssetBalance, fresh)) {
                fetchedBalances[token] = newAssetBalance
              } else {
                await pollUpdatedBalance(
                  methods.getBalance(account, instance),
                  currAssetBalance,
                  () => {
                    fetchedBalances[token] = '0'
                  },
                  fetchedBalance => {
                    fetchedBalances[token] = fetchedBalance
                  },
                )
              }

              const approvalContract =
                contracts[token === IFARM_TOKEN_SYMBOL ? FARM_TOKEN_SYMBOL : token]

              if (
                approvalContract.instance &&
                typeof approvalContract.instance.setProvider === 'function'
              ) {
                approvalContract.instance.setProvider(viemInstance)
              }
              if (viemInstance.walletClient && approvalContract.instance) {
                approvalContract.instance.walletClient = viemInstance.walletClient
                if (viemInstance.writeContract) {
                  approvalContract.instance.writeContract = viemInstance.writeContract
                }
              }
              const currApprovedAssetBalance = approvedBalances[token]
              const newApprovedAssetBalance = vaultAddress
                ? await tokenMethods.getApprovedAmount(
                    account,
                    vaultAddress,
                    approvalContract.instance,
                  )
                : '0'

              if (
                hasValidUpdatedBalance(newApprovedAssetBalance, currApprovedAssetBalance, fresh)
              ) {
                fetchedApprovedBalances[token] = newApprovedAssetBalance
              } else {
                await pollUpdatedBalance(
                  tokenMethods.getApprovedAmount(account, vaultAddress, approvalContract.instance),
                  currApprovedAssetBalance,
                  () => {
                    fetchedApprovedBalances[token] = newApprovedAssetBalance
                  },
                  fetchedBalance => {
                    fetchedApprovedBalances[token] = fetchedBalance
                  },
                )
              }
            }),
        )

        setBalancesToLoad([])
        setBalances(currBalances => ({ ...(newAccount ? {} : currBalances), ...fetchedBalances }))
        setApprovedBalances(currApprovedBalances => ({
          ...(newAccount ? {} : currApprovedBalances),
          ...fetchedApprovedBalances,
        }))
      }
    },
    [setBalances, contracts, account, approvedBalances, balances, viem],
  )

  return React.createElement(
    WalletContext.Provider,
    {
      value: {
        connectAction,
        account,
        setAccount,
        connected,
        setConnected,
        chainId,
        viem,
        balances,
        approvedBalances,
        getWalletBalances,
        balancesToLoad,
        setChainId,
        selChain,
        setSelChain,
        disconnectAction,
        logout,
        walletLocked,
        setWalletLocked,
      },
    },
    children,
  )
}
export { WalletProvider, useWallet }
