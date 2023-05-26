import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useConnectWallet } from '@web3-onboard/react'
import { isArray } from 'lodash'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import {
  getChainName,
  hasValidUpdatedBalance,
  mainWeb3,
  pollUpdatedBalance,
  ledgerProvider,
  safeWeb3Provider,
  safeProvider,
} from '../../services/web3'
import tokenMethods from '../../services/web3/contracts/token/methods'
import { useContracts } from '../Contracts'
import { validateChain } from './utils'
import { isLedgerLive, isSafeApp } from '../../utils'

/* eslint-disable global-require */
const { tokens } = require('../../data')
/* eslint-enable global-require */

const WalletContext = createContext()
const useWallet = () => useContext(WalletContext)

const WalletProvider = _ref => {
  const { children } = _ref
  const web3Plugin = mainWeb3
  const [account, setAccount] = useState(null)
  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(CHAINS_ID.ETH_MAINNET)
  const [selChain, setSelChain] = useState([
    CHAINS_ID.ETH_MAINNET,
    CHAINS_ID.MATIC_MAINNET,
    CHAINS_ID.ARBITRUM_ONE,
  ])
  const [balances, setBalances] = useState({})
  const [logout, setLogout] = useState(false)
  const [balancesToLoad, setBalancesToLoad] = useState([])
  const [approvedBalances, setApprovedBalances] = useState({})
  const [directApprovedBalances, setDirectApprovedBalances] = useState({})
  const { contracts } = useContracts()
  const [{ wallet }, connect, disconnect] = useConnectWallet()

  useEffect(() => {
    const fetchData = async () => {
      if (isLedgerLive()) {
        const selectedChain = await ledgerProvider.getNetwork()
        setChainId(selectedChain.chainId.toString())
        const selectedAccount = await ledgerProvider.getSigner().getAddress()
        setAccount(selectedAccount && selectedAccount.toLowerCase())
        setConnected(true)
      }
      if (isSafeApp()) {
        const safeAppProvider = await safeProvider()
        const selectedChain = await safeAppProvider.getNetwork()
        const provider = await safeWeb3Provider()
        web3Plugin.setProvider(provider)
        setChainId(selectedChain.chainId.toString())
        const selectedAccount = await safeAppProvider.getSigner().getAddress()
        setAccount(selectedAccount && selectedAccount.toLowerCase())
        setConnected(true)
      }
    }
    fetchData()
  }, [web3Plugin])

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
          () => {
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
        validateChain(
          newChain,
          chainId,
          async () => {
            setConnected(true)
            const chainNew = parseInt(newChain, 16).toString()
            setChainId(chainNew)
            const selectedAccount = await ledgerProvider.getSigner().getAddress()
            setAccount(selectedAccount && selectedAccount.toLowerCase())
            setConnected(true)
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
      }
    },
    [chainId],
  )
  useEffect(() => {
    let accountEmitter, networkEmitter
    if (!isLedgerLive()) {
      if (web3Plugin && web3Plugin._provider.on && account) {
        networkEmitter = web3Plugin._provider.on('chainChanged', onNetworkChange)
      }

      return () => {
        if (accountEmitter && networkEmitter) {
          accountEmitter.removeAllListeners('accountsChanged')
          networkEmitter.removeListener('chainChanged', onNetworkChange)
        }
      }
    }
    if (ledgerProvider && ledgerProvider.provider.on) {
      accountEmitter = ledgerProvider.provider.on('accountsChanged', accountAddress => {
        setAccount(accountAddress[0].toLowerCase())
        setConnected(true)
      })
      networkEmitter = ledgerProvider.provider.on('chainChanged', onNetworkChange)
    }
    return () => {
      if (accountEmitter && networkEmitter) {
        accountEmitter.removeAllListeners('accountsChanged')
        networkEmitter.removeListener('chainChanged', onNetworkChange)
      }
    }
  }, [web3Plugin, chainId, account, onNetworkChange, setAccount])

  useEffect(() => {
    if (wallet) {
      const chainNum = parseInt(wallet.chains[0].id, 16).toString()
      setAccount(wallet.accounts[0].address)
      setConnected(true)
      setChainId(chainNum)
      setLogout(false)
    } else {
      setConnected(false)
      setAccount(null)
      setBalances({})
      setLogout(true)
    }
  }, [wallet])

  const connectAction = useCallback(async () => {
    await connect()
  }, [connect])
  const getWalletBalances = useCallback(
    // eslint-disable-next-line func-names
    async function (selectedTokens, newAccount, fresh) {
      // eslint-disable-next-line no-void
      if (fresh === void 0) {
        fresh = false
      }

      if (account && selectedTokens && selectedTokens.length) {
        const fetchedBalances = {}
        const fetchedApprovedBalances = {}
        const fetchedDirectApprovedBalances = {}
        setBalancesToLoad(selectedTokens)
        await Promise.all(
          selectedTokens
            .filter(token => !isArray(tokens[token].tokenAddress))
            .map(async token => {
              const { methods, instance } = contracts[token]
              const vaultAddress =
                token === IFARM_TOKEN_SYMBOL
                  ? tokens[token].tokenAddress
                  : tokens[token].vaultAddress
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

              const tokenAddress = tokens[token].tokenAddress
              const direcApprovalContract =
                contracts[token === IFARM_TOKEN_SYMBOL ? FARM_TOKEN_SYMBOL : token]
              const currDirectApprovedAssetBalance = approvedBalances[token]
              const newDirectApprovedAssetBalance = tokenAddress
                ? await tokenMethods.getApprovedAmount(
                    account,
                    tokenAddress,
                    direcApprovalContract.instance,
                  )
                : '0'

              if (
                hasValidUpdatedBalance(
                  newDirectApprovedAssetBalance,
                  currDirectApprovedAssetBalance,
                  fresh,
                )
              ) {
                fetchedDirectApprovedBalances[token] = newDirectApprovedAssetBalance
              } else {
                await pollUpdatedBalance(
                  tokenMethods.getApprovedAmount(
                    account,
                    tokenAddress,
                    direcApprovalContract.instance,
                  ),
                  currDirectApprovedAssetBalance,
                  () => {
                    fetchedDirectApprovedBalances[token] = newDirectApprovedAssetBalance
                  },
                  fetchedBalance => {
                    fetchedDirectApprovedBalances[token] = fetchedBalance
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
        setDirectApprovedBalances(currApprovedBalances => ({
          ...(newAccount ? {} : currApprovedBalances),
          ...fetchedDirectApprovedBalances,
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
        balances,
        approvedBalances,
        getWalletBalances,
        balancesToLoad,
        setChainId,
        selChain,
        setSelChain,
        disconnectAction,
        logout,
        directApprovedBalances,
      },
    },
    children,
  )
}
export { WalletProvider, useWallet }
