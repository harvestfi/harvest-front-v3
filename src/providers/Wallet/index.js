import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { isArray } from 'lodash'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import {
  getChainName,
  hasValidUpdatedBalance,
  mainWeb3,
  pollUpdatedBalance,
} from '../../services/web3'
import tokenMethods from '../../services/web3/contracts/token/methods'
import { useContracts } from '../Contracts'
import { validateChain } from './utils'

/* eslint-disable global-require */
const { tokens } = require('../../data')
/* eslint-enable global-require */

const WalletContext = createContext()
const useWallet = () => useContext(WalletContext)

const WalletProvider = _ref => {
  const { children, onboard } = _ref
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
  const { contracts } = useContracts()

  const disconnect = useCallback(async () => {
    const [primaryWallet] = onboard.state.get().wallets
    await onboard.disconnectWallet({ label: primaryWallet.label })
    setConnected(false)
    setAccount(null)
    setBalances({})
    setLogout(true)
  }, [onboard])

  const onNetworkChange = useCallback(
    newChain => {
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
    },
    [chainId],
  )
  useEffect(() => {
    let accountEmitter, networkEmitter

    if (web3Plugin && web3Plugin._provider.on && account) {
      // accountEmitter = web3Plugin._provider.on('accountsChanged', accountAddress =>
      //   validateAccount(accountAddress, setAccount),
      // )
      networkEmitter = web3Plugin._provider.on('chainChanged', onNetworkChange)
    }

    return () => {
      if (accountEmitter && networkEmitter) {
        accountEmitter.removeAllListeners('accountsChanged')
        networkEmitter.removeListener('chainChanged', onNetworkChange)
      }
    }
  }, [web3Plugin, chainId, account, onNetworkChange])

  const connect = useCallback(async () => {
    const wallets = await onboard.connectWallet()
    if (wallets.length === 0) {
      return
    }
    const chainNum = parseInt(wallets[0].chains[0].id, 16).toString()
    setAccount(wallets[0].accounts[0].address)
    setConnected(true)
    setChainId(chainNum)
    setLogout(false)
  }, [onboard])
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
        connect,
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
        disconnect,
        logout,
      },
    },
    children,
  )
}
export { WalletProvider, useWallet }
