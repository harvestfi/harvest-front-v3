import { useConnectWallet } from '@web3-onboard/react'
import { isArray } from 'lodash'
import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { createWalletClient, custom } from 'viem'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../constants'
import { CHAIN_IDS } from '../../data/constants'
import {
  getChainName,
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
import { useContracts } from '../Contracts'
import { validateChain } from './utils'

const { tokens } = require('../../data')

const WalletContext = createContext()
const useWallet = () => useContext(WalletContext)

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
  ])
  const [balances, setBalances] = useState({})
  const [logout, setLogout] = useState(false)
  const [balancesToLoad, setBalancesToLoad] = useState([])
  const [approvedBalances, setApprovedBalances] = useState({})
  const [walletLocked, setWalletLocked] = useState(false)
  const { contracts } = useContracts()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const walletLockCheckIntervalRef = useRef(null)

  const checkWalletLock = useCallback(async () => {
    if (!isSafeApp() && wallet?.provider) {
      try {
        const accounts = await wallet.provider.request({ method: 'eth_accounts' })

        if (!accounts || accounts.length === 0) {
          if (connected) {
            setConnected(false)
            setAccount(null)
            setWalletLocked(true)
          }
        } else if (!connected && accounts.length > 0) {
          setAccount(accounts[0].toLowerCase())
          setConnected(true)

          if (walletLocked) {
            setWalletLocked(false)
          }
        } else if (connected && accounts.length > 0) {
          if (walletLocked) {
            setWalletLocked(false)
          }
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
  }, [wallet, connected, walletLocked])

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
  }, [checkWalletLock, wallet])

  useEffect(() => {
    const fetchData = async () => {
      // if (isLedgerLive()) {
      //   const selectedChain = await ledgerProvider.getNetwork()
      //   setChainId(selectedChain.chainId.toString())
      //   const selectedAccount = await ledgerProvider.getSigner().getAddress()
      //   setAccount(selectedAccount && selectedAccount.toLowerCase())
      //   setConnected(true)
      // }
      if (isSafeApp()) {
        const safeAppProvider = await safeProvider()
        const selectedChain = await safeAppProvider.getNetwork()
        setChainId(selectedChain.chainId.toString())
        const selectedAccount = await safeAppProvider.getSigner().getAddress()
        setAccount(selectedAccount && selectedAccount.toLowerCase())
        setConnected(true)
      }
    }
    fetchData()

    if (!connecting) {
      if (
        window &&
        window.ethereum &&
        window.ethereum.isCoinbaseWallet &&
        window.ethereum.isCoinbaseBrowser
      )
        connect({ autoSelect: { label: 'Coinbase Wallet', disableModals: true } })
    }
  }, [connect, connecting])

  const disconnectAction = useCallback(async () => {
    if (!isLedgerLive()) {
      disconnect({ label: wallet.label })
    }
  }, [disconnect, wallet])

  const onNetworkChange = useCallback(
    newChain => {
      if (!isLedgerLive()) {
        validateChain(
          newChain,
          chainId,
          async () => {
            window.location.reload()
            setConnected(true)
            const chainNew = parseInt(newChain, 16).toString()
            setChainId(chainNew)
            setSelChain([chainNew])
          },
          () => {
            window.location.reload()
            setConnected(true)
            const chainNew = parseInt(newChain, 16).toString()
            setChainId(chainNew)
          },
          () => {
            toast.error(
              `App network (${getChainName(
                chainId,
              )}) doesn't match to network selected in your wallet (${getChainName(
                newChain,
              )}).\nSwitch to the correct chain in your wallet`,
            )
            setConnected(false)
          },
        )
      } else {
        // validateChain(
        //   newChain,
        //   chainId,
        //   async () => {
        //     window.location.href = '/?ledgerLive=true'
        //     setConnected(true)
        //     const chainNew = parseInt(newChain, 16).toString()
        //     setChainId(chainNew)
        //     const selectedAccount = await ledgerProvider.getSigner().getAddress()
        //     setAccount(selectedAccount && selectedAccount.toLowerCase())
        //     setConnected(true)
        //   },
        //   () => {
        //     toast.error(
        //       `App network (${getChainName(
        //         chainId,
        //       )}) doesn't match to network selected in your wallet (${getChainName(
        //         newChain,
        //       )}).\nSwitch to the correct chain in your wallet`,
        //     )
        //     setConnected(false)
        //   },
        // )
      }
    },
    [chainId],
  )
  useEffect(() => {
    let accountEmitter, networkEmitter
    const fetchData = async () => {
      // if (isLedgerLive()) {
      //   if (ledgerProvider && ledgerProvider.provider.on) {
      //     networkEmitter = ledgerProvider.provider.on('chainChanged', onNetworkChange)
      //     accountEmitter = ledgerProvider.provider.on('accountsChanged', accountAddress => {
      //       setAccount(accountAddress[0].toLowerCase())
      //       setConnected(true)
      //     })
      //   }
      //   return () => {
      //     if (accountEmitter && networkEmitter) {
      //       accountEmitter.removeAllListeners('accountsChanged')
      //       networkEmitter.removeListener('chainChanged', onNetworkChange)
      //     }
      //   }
      // }
      if (isSafeApp()) {
        const safeViemProvider = await safeProvider()
        if (safeViemProvider && safeViemProvider.provider.on) {
          networkEmitter = safeViemProvider.provider.on('chainChanged', onNetworkChange)
          accountEmitter = safeViemProvider.provider.on('accountsChanged', accountAddress => {
            setAccount(accountAddress[0].toLowerCase())
            setConnected(true)
          })
        }
        return () => {
          if (accountEmitter && networkEmitter) {
            accountEmitter.removeAllListeners('accountsChanged')
            networkEmitter.removeListener('chainChanged', onNetworkChange)
          }
        }
      }

      if (wallet?.provider && wallet.provider.on) {
        networkEmitter = wallet.provider.on('chainChanged', onNetworkChange)
        accountEmitter = wallet.provider.on('accountsChanged', accountAddress => {
          if (accountAddress && accountAddress.length > 0) {
            setAccount(accountAddress[0].toLowerCase())
            setConnected(true)
          } else {
            setAccount(null)
            setConnected(false)
          }
        })
      }

      return () => {
        if (accountEmitter && networkEmitter && wallet?.provider) {
          if (accountEmitter.removeAllListeners) {
            accountEmitter.removeAllListeners('accountsChanged')
          }
          if (networkEmitter.removeListener) {
            networkEmitter.removeListener('chainChanged', onNetworkChange)
          }
        }
      }
    }
    fetchData()
  }, [wallet, chainId, account, onNetworkChange, setAccount])

  useEffect(() => {
    if (!isSafeApp()) {
      if (wallet) {
        const chainNum = parseInt(wallet.chains[0].id, 16).toString()
        setAccount(wallet.accounts[0].address.toLowerCase())
        setChainId(chainNum)
        if (wallet?.provider) {
          const chain = getChainObject(wallet.chains[0].id)
          const walletClient = createWalletClient({
            transport: custom(wallet.provider),
            chain,
          })

          setViem(walletClient)
        }
        setConnected(true)
        setLogout(false)
      } else {
        setConnected(false)
        setAccount(null)
        setBalances({})
        setLogout(true)
      }
    }
  }, [wallet])

  const connectAction = useCallback(async () => {
    await connect()
  }, [connect])

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
    [setBalances, contracts, account, approvedBalances, balances],
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
