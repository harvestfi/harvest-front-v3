import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
// import detectEthereumProvider from "@metamask/detect-provider";
// import { useWeb3React } from "@web3-react/core";
import { isArray, /*get, isUndefined, toString*/ } from 'lodash'
import { 
  // validateAccount, 
  validateChain } from './utils'
import { useContracts } from '../Contracts'
import {
  // getAccount,
  getChainName,
  hasValidUpdatedBalance,
  pollUpdatedBalance,
  mainWeb3,
  // isMobileWeb3,
  // getChainHexadecimal,
  // connectors
} from '../../services/web3'
import tokenMethods from '../../services/web3/contracts/token/methods'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../constants'
import { CHAINS_ID } from '../../data/constants'

const { tokens } = require('../../data')

const WalletContext = createContext()
const useWallet = () => useContext(WalletContext)

// const getChainAddParams = chainId => {
//   switch (chainId) {
//     case CHAINS_ID.ETH_MAINNET:
//       return [
//         {
//           chainId: getChainHexadecimal(CHAINS_ID.ETH_MAINNET),
//           chainName: 'ETH',
//           nativeCurrency: {
//             name: 'Ethereum',
//             symbol: 'ETH',
//             decimals: 18,
//           },
//           rpcUrls: ['https://mainnet.infura.io/v3/'],
//           blockExplorerUrls: ['https://etherscan.io'],
//         },
//       ]
//     case CHAINS_ID.BSC_MAINNET:
//       return [
//         {
//           chainId: getChainHexadecimal(CHAINS_ID.BSC_MAINNET),
//           chainName: 'BSC',
//           nativeCurrency: {
//             name: 'Binance',
//             symbol: 'BSC',
//             decimals: 18,
//           },
//           rpcUrls: ['https://bsc-dataseed.binance.org/'],
//           blockExplorerUrls: ['https://bscscan.com'],
//         },
//       ]
//     case CHAINS_ID.MATIC_MAINNET:
//       return [
//         {
//           chainId: getChainHexadecimal(CHAINS_ID.MATIC_MAINNET),
//           chainName: 'Polygon (Matic)',
//           nativeCurrency: {
//             name: 'Matic',
//             symbol: 'Matic',
//             decimals: 18,
//           },
//           rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
//           blockExplorerUrls: ['https://polygonscan.com/'],
//         },
//       ]
//     default:
//       console.log(`Params for the chain(${chainId}) switch request not found`)
//       return []
//   }
// }

const WalletProvider = _ref => {
  const { children, accountAddress, connectedStatus, chainObj, openConnectModal, openChainModal, openAccountModal } = _ref
  const web3Plugin = mainWeb3
  const [account, setAccount] = useState(null)
  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(CHAINS_ID.ETH_MAINNET)
  const [selChain, setSelChain] = useState([CHAINS_ID.ETH_MAINNET, CHAINS_ID.BSC_MAINNET, CHAINS_ID.MATIC_MAINNET])
  const [balances, setBalances] = useState({})
  const [logout, setLogout] = useState(false)
  const [balancesToLoad, setBalancesToLoad] = useState([])
  const [approvedBalances, setApprovedBalances] = useState({})
  const { contracts } = useContracts()

  const [chainObject, setChainObject] = useState({})

  // const [provider, setProvider] = React.useState(null)
  // const { activate, deactivate, account, chainId } = useWeb3React()

  // React.useEffect(() => {
  //   detectEthereumProvider().then((provider) => {
  //     setProvider(provider)
  //   })
  // }, [])

  const disconnect = useCallback(
    () => {
      // deactivate()
      setConnected(false)
      setBalances({})
      setLogout(true)
    }, [
      // deactivate
    ]
  )

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

  useEffect(()=>{
      const getAuthInfo = () => {
        setAccount(accountAddress)
        setConnected(connectedStatus)
        setChainId(chainObj ? chainObj.id : CHAINS_ID.ETH_MAINNET)
        setChainObject(chainObj)
      }

    getAuthInfo()
  }, [accountAddress, connectedStatus, chainObj])

  const connect = useCallback(async () => {
    openConnectModal()
    // if (web3Plugin) {
    //   try {
    //     if (!provider) {
    //       console.error("Please install metamask or coinbase");
    //       // let connector
    //       // if(i === 1) {
    //         // connector = connectors.walletConnect
    //         // await activate(connector)
    //       // }
    //       // else if(i === 0) {
    //       //   window.location.href = "https://metamask.app.link/dapp/harvest-finance.netlify.app"
    //       // }
    //       // else {
    //       //   window.location.href = "https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fharvest-finance.netlify.app"
    //       // }
    //     }
    //     else {
    //       // const connector = i === 2 ? connectors.coinbaseWallet : i === 0 ? connectors.injected : connectors.walletConnect
    //       // await activate(connector).then(() => {
    //       // })
    //     }
    //     // const selectedChain = await connectWeb3()
    //     // const selectedChain =  (await web3Plugin.eth.net.getId()).toString()
    //     const selectedChain = chainId

    //     const hasOutdatedMetaMask = !isUndefined(
    //       get(web3Plugin, 'currentProvider.autoRefreshOnNetworkChange'),
    //     )
    //     // setAccount(account.toLowerCase())
    //     if (
    //       (get(web3Plugin, 'currentProvider.isMetaMask') ||
    //         get(web3Plugin, 'currentProvider.isCoinbaseWallet')) &&
    //       !hasOutdatedMetaMask &&
    //       !isMobileWeb3
    //     ) {
    //       try {
    //         await web3Plugin.currentProvider.request({ method: "eth_requestAccounts" });
    //       } catch (error) {
    //           toast.error("User denied account access");
    //           return false;
    //       }
    //       try {
    //         await web3Plugin.currentProvider.request({
    //           method: 'wallet_switchEthereumChain',
    //           params: [
    //             {
    //               chainId: getChainHexadecimal(selectedChain),
    //             },
    //           ],
    //         })
    //       } catch (switchError) {
    //         if (switchError.code === 4902) {
    //           try {
    //             await web3Plugin.currentProvider.request({
    //               method: 'wallet_addEthereumChain',
    //               params: getChainAddParams(selectedChain),
    //             })
    //           } catch (err) {
    //             toast.error(err)
    //           }
    //         }
    //       }
    //     }

    //     let selectedNetwork

    //     if (selectedChain === CHAINS_ID.BSC_MAINNET && window.BinanceChain && !window.coin98) {
    //       selectedNetwork = window.BinanceChain.chainId
    //     } else {
    //       selectedNetwork = parseInt(await web3Plugin.eth.net.getId(), 10)
    //     }

    //     if (isMobileWeb3) {
    //       // const selectedAccount = await getAccount()
    //       // setAccount(selectedAccount.toLowerCase())
    //       setChainId(toString(selectedNetwork))
    //       setConnected(true)
    //     } else {
    //       validateChain(
    //         selectedNetwork,
    //         selectedChain,
    //         async () => {
    //           // const selectedAccount = await getAccount()
    //           // setAccount(selectedAccount && selectedAccount.toLowerCase())
    //           setChainId(selectedChain)
    //           setConnected(true)
    //         },
    //         () => {
    //           toast.error(
    //             `Selected chain (${getChainName(
    //               selectedChain,
    //             )}) doesn't match to network selected in your wallet (${getChainName(
    //               selectedNetwork,
    //             )}).\nSwitch to the correct chain in your wallet`,
    //           )
    //         },
    //       )
    //     }
    //   } catch (error) {
    //     if (get(error, 'data.method') === 'wallet_addEthereumChain') {
    //       toast.error(
    //         'It seems that your MetaMask is outdated. We recommend upgrading it to >=9.1.0',
    //       )
    //     } else {
    //       toast.error(error ? error.message : 'User denied wallet connection')
    //     }
    //   }
    // } else {
    //   toast.error('Web3 extension not detected.')
    // }
    setLogout(false)
    // handleClose()
  }, [
    // web3Plugin, 
    openConnectModal,
    // activate, provider, chainId
  ])
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
                ? await tokenMethods.getApprovedAmount(account, vaultAddress, approvalContract.instance)
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
        account: account,
        setAccount: setAccount,
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
        // chainId,
        openChainModal,
        openAccountModal,
        logout,
        chainObject
      },
    },
    children,
  )
}
export { WalletProvider, useWallet }
