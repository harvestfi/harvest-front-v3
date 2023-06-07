import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
// eslint-disable-next-line import/no-unresolved
import axios from 'axios'
import isEqual from 'fast-deep-equal/react'
import { filter, get, map, sumBy } from 'lodash'
import { forEach } from 'promised-loops'
// eslint-disable-next-line import/no-unresolved
import { useInterval } from 'react-interval-hook'
import { toast } from 'react-toastify'
import useEffectWithPrevious from 'use-effect-with-previous'
import { POLL_POOL_DATA_INTERVAL_MS, POOLS_API_ENDPOINT, SPECIAL_VAULTS } from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import { getWeb3, getWeb3Local, newContractInstance } from '../../services/web3'
import poolContractData from '../../services/web3/contracts/pool/contract.json'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import tokenMethods from '../../services/web3/contracts/token/methods'
import { isLedgerLive, truncateNumberString } from '../../utils'
import { useContracts } from '../Contracts'
import { useWallet } from '../Wallet'
import { getLpTokenData, getUserStats, pollUpdatedUserStats } from './utils'

/* eslint-disable global-require */
const { pools: defaultPools, tokens } = require('../../data')
/* eslint-enable global-require */

const PoolsContext = createContext()
const usePools = () => useContext(PoolsContext)

const getReader = (selectedChain, contracts) => {
  switch (String(selectedChain)) {
    case CHAINS_ID.ARBITRUM_ONE:
      return contracts.readerArbitrum
    case CHAINS_ID.MATIC_MAINNET:
      return contracts.readerMatic
    default:
      return contracts.readerEth
  }
}

const PoolsProvider = _ref => {
  const { children } = _ref
  const { account, selChain, chainId, balances: walletBalances, logout } = useWallet()
  const { contracts } = useContracts()
  const [pools, setPools] = useState(defaultPools)
  const [totalPools, setTotalPools] = useState(defaultPools)
  const [userStats, setUserStats] = useState([])
  const [vaultLoading, setVaultLoading] = useState(true)
  const [loadingUserPoolStats, setLoadingUserPoolStats] = useState(false)
  const [disableWallet, setDisableWallet] = useState(true)
  const loadedUserPoolsWeb3Provider = useRef(false)
  const loadedInitialStakedAndUnstakedBalances = useRef(false)
  const loadedPools = useMemo(() => filter(pools, pool => selChain.includes(pool.chain)), [
    selChain,
    pools,
  ])
  const [finishPool, setFinishPool] = useState(false) // set true when getPoolsData success
  const formatPoolsData = useCallback(
    async apiData => {
      let formattedPools = await Promise.all(
        defaultPools.map(async pool => {
          if (!isLedgerLive() || (isLedgerLive() && pool.chain !== CHAINS_ID.ARBITRUM_ONE)) {
            const web3Client = getWeb3(pool.chain, account)
            const web3ClientLocal = getWeb3Local()
            let rewardAPY = ['0'],
              rewardAPR = ['0'],
              autoStakeContractInstance = null,
              autoStakeContractLocalInstance = null,
              lpTokenData,
              rewardPerToken = ['0'],
              totalSupply = '0',
              finishTime = '0',
              totalValueLocked = '0',
              tradingApy = '0',
              boostedRewardAPY = '0',
              lpTokenInstance = null,
              lpTokenLocalInstance = null,
              amountToStakeForBoost = null,
              dataFetched = null
            const contractInstance = await newContractInstance(
              null,
              pool.contractAddress,
              poolContractData.abi,
              web3Client,
            )
            const contractLocalInstance = await newContractInstance(
              null,
              pool.contractAddress,
              poolContractData.abi,
              web3ClientLocal,
            )
            const apiPool =
              apiData && apiData.find(fetchedPool => fetchedPool && fetchedPool.id === pool.id)

            if (apiPool) {
              // eslint-disable-next-line prefer-destructuring
              rewardAPY = map(apiPool.rewardAPY, apy => truncateNumberString(apy))
              rewardAPR = map(apiPool.rewardAPR, apr => truncateNumberString(apr))
              tradingApy = truncateNumberString(apiPool.tradingApy)
              lpTokenData = apiPool.lpTokenData
              rewardPerToken = apiPool.rewardPerToken
              totalSupply = apiPool.totalSupply
              finishTime = apiPool.finishTime
              totalValueLocked = apiPool.totalValueLocked
              boostedRewardAPY = apiPool.boostedRewardAPY
              amountToStakeForBoost = apiPool.amountToStakeForBoost
              lpTokenInstance = await newContractInstance(
                null,
                apiPool.lpTokenData.address,
                tokenContract.abi,
                web3Client,
              )
              lpTokenLocalInstance = await newContractInstance(
                null,
                apiPool.lpTokenData.address,
                tokenContract.abi,
                web3ClientLocal,
              )
              dataFetched = true
            } else if (!pool.breadPage && !pool.fake) {
              lpTokenData = await getLpTokenData(contractInstance, web3Client)
              lpTokenInstance = await newContractInstance(
                null,
                lpTokenData.address,
                tokenContract.abi,
                web3Client,
              )
              lpTokenLocalInstance = await newContractInstance(
                null,
                lpTokenData.address,
                tokenContract.abi,
                web3ClientLocal,
              )
              dataFetched = false
            }

            if (pool.autoStakePoolAddress) {
              autoStakeContractInstance = await newContractInstance(
                null,
                pool.autoStakePoolAddress,
                poolContractData.abi,
                web3Client,
              )
              autoStakeContractLocalInstance = await newContractInstance(
                null,
                pool.autoStakePoolAddress,
                poolContractData.abi,
                web3ClientLocal,
              )
            }

            return {
              ...pool,
              rewardAPY,
              amountToStakeForBoost,
              totalRewardAPY: sumBy(rewardAPY, apy => Number(apy)),
              rewardAPR,
              tradingApy,
              contractInstance,
              contractLocalInstance,
              autoStakeContractInstance,
              autoStakeContractLocalInstance,
              lpTokenData: {
                ...lpTokenData,
                instance: lpTokenInstance,
                localInstance: lpTokenLocalInstance,
              },
              rewardPerToken,
              totalSupply,
              finishTime,
              totalValueLocked,
              loaded: true,
              boostedRewardAPY,
              dataFetched,
            }
          }
          return null
        }),
      )
      formattedPools = formattedPools.filter(pool => pool !== null)
      // if (account) {
      loadedUserPoolsWeb3Provider.current = true
      // }

      return formattedPools
    },
    [account],
  )
  const getPoolsData = useCallback(async () => {
    let newPools = []

    try {
      const apiResponse = await axios.get(POOLS_API_ENDPOINT)
      const apiData = get(apiResponse, 'data')
      if (isLedgerLive()) {
        newPools = await formatPoolsData([...apiData.eth, ...apiData.matic])
      } else {
        newPools = await formatPoolsData([...apiData.eth, ...apiData.matic, ...apiData.arbitrum])
      }
      setDisableWallet(false)
    } catch (err) {
      console.error(err)

      if (!toast.isActive('pool-api-error')) {
        toast.error(
          'FARM APYs are temporarily unavailable. Also, please check your internet connection',
          {
            toastId: 'pool-api-error',
          },
        )
      }

      newPools = await formatPoolsData()
    }

    setPools(newPools)
    setTotalPools(newPools)
    setFinishPool(true)
  }, [formatPoolsData])

  useEffect(() => {
    if (logout) {
      setUserStats([])
    }
  }, [logout])

  useEffectWithPrevious(
    _ref2 => {
      const [prevAccount] = _ref2

      if (
        account !== prevAccount &&
        account &&
        !loadedUserPoolsWeb3Provider.current &&
        finishPool &&
        !isLedgerLive()
      ) {
        const setCurrentPoolsWithUserProvider = async () => {
          const poolsWithUpdatedProvider = await formatPoolsData(pools)
          setPools(poolsWithUpdatedProvider)
        }

        setCurrentPoolsWithUserProvider()
      } else if (
        account !== prevAccount &&
        account &&
        !loadedUserPoolsWeb3Provider.current &&
        finishPool &&
        isLedgerLive()
      ) {
        const udpatePoolsData = async () => {
          await getPoolsData()
        }
        udpatePoolsData()
      }
    },
    [account, pools],
  )
  useEffectWithPrevious(
    _ref3 => {
      const [prevChainId, prevAccount] = _ref3
      const hasSwitchedChain = chainId !== prevChainId
      const hasSwitchedAccount = account !== prevAccount && account

      if (
        (hasSwitchedChain ||
          hasSwitchedAccount ||
          !loadedInitialStakedAndUnstakedBalances.current) &&
        loadedUserPoolsWeb3Provider.current &&
        account
      ) {
        const loadInitialStakedAndUnstakedBalances = async () => {
          loadedInitialStakedAndUnstakedBalances.current = true
          const stats = {}
          const chains = isLedgerLive()
            ? [CHAINS_ID.ETH_MAINNET, CHAINS_ID.MATIC_MAINNET]
            : selChain
          // selChain.forEach( async (ch)=> {
          /* eslint-disable no-await-in-loop */
          for (let i = 0; i < chains.length; i += 1) {
            const ch = chains[i]
            const readerType = getReader(ch, contracts)
            const poolAddresses = []
            const vaultAddresses = []
            const chLoadedPools = []
            loadedPools.forEach(pool => {
              if (pool.chain === ch) {
                poolAddresses.push(pool.contractAddress)
                chLoadedPools.push(pool)
              }

              if (!Object.values(SPECIAL_VAULTS).includes(pool.id) && pool.chain === ch) {
                vaultAddresses.push(pool.lpTokenData.address)
              }
            })
            const readerInstance = readerType.instance
            const readerMethods = readerType.methods
            const balances = await readerMethods.getAllInformation(
              account,
              vaultAddresses,
              poolAddresses,
              readerInstance,
            )
            // const stats = {}
            await forEach(chLoadedPools, async (pool, index) => {
              let lpTokenBalance
              const isSpecialVault = !vaultAddresses.includes(pool.lpTokenData.address)

              if (isSpecialVault) {
                const lpSymbol = Object.keys(tokens).filter(
                  symbol => tokens[symbol].tokenAddress === pool.lpTokenData.address,
                )

                const instance = await newContractInstance(
                  lpSymbol[0],
                  null,
                  null,
                  getWeb3(ch, false),
                )

                lpTokenBalance = !walletBalances[lpSymbol]
                  ? await tokenMethods.getBalance(account, instance)
                  : walletBalances[lpSymbol]
              } else {
                const lpTokenBalanceIdx = vaultAddresses.findIndex(
                  address => address === pool.lpTokenData.address,
                )
                lpTokenBalance = balances[0][lpTokenBalanceIdx]
              }

              stats[pool.id] = {
                lpTokenBalance,
                totalStaked: balances[1][index],
              }
            })
          }
          /* eslint-enable no-await-in-loop */
          // })
          setUserStats(currStats => ({ ...currStats, ...stats }))
        }

        loadInitialStakedAndUnstakedBalances()
      }
    },
    [chainId, account, loadedPools, contracts, walletBalances],
  )
  useInterval(() => getPoolsData(), POLL_POOL_DATA_INTERVAL_MS, {
    immediate: true,
  })
  // eslint-disable-next-line func-names
  const fetchUserPoolStats = useCallback(async function (
    selectedPools,
    selectedAccount,
    currentStats,
  ) {
    // eslint-disable-next-line no-void
    if (currentStats === void 0) {
      currentStats = []
    }

    const stats = {}

    if (loadedUserPoolsWeb3Provider.current) {
      setLoadingUserPoolStats(true)
      await Promise.all(
        selectedPools.map(async pool => {
          const web3Client = getWeb3(pool.chain, null)
          const contractInstance = await newContractInstance(
            null,
            pool.contractAddress,
            poolContractData.abi,
            web3Client,
          )
          const autoStakeContractInstance = await newContractInstance(
            null,
            pool.autoStakePoolAddress,
            poolContractData.abi,
            web3Client,
          )
          // const lpSymbol = Object.keys(tokens).filter(
          //   symbol => tokens[symbol].tokenAddress === pool.lpTokenData.address || tokens[symbol].vaultAddress === pool.lpTokenData.address,
          // )
          // if(lpSymbol.length !== 0) {
          const tokenInstance = await newContractInstance(
            null,
            pool.lpTokenData.address,
            poolContractData.abi,
            web3Client,
          )

          const fetchedStats = await getUserStats(
            contractInstance,
            tokenInstance,
            pool.contractAddress,
            pool.autoStakePoolAddress,
            selectedAccount,
            autoStakeContractInstance,
          )

          if (!isEqual(fetchedStats, currentStats[pool.id])) {
            stats[pool.id] = fetchedStats
          } else {
            await pollUpdatedUserStats(
              getUserStats(
                contractInstance,
                tokenInstance,
                pool.contractAddress,
                pool.autoStakePoolAddress,
                selectedAccount,
                autoStakeContractInstance,
              ),
              currentStats,
              () => {
                console.error(`Something went wrong during the fetching of ${pool.id} user stats`)
              },
              updatedStats => {
                stats[pool.id] = updatedStats
              },
            )
          }
          // }
        }),
      )
      setUserStats(currStats => ({ ...currStats, ...stats }))
      setLoadingUserPoolStats(false)
    }

    return stats
  },
  [])
  return React.createElement(
    PoolsContext.Provider,
    {
      value: {
        pools: loadedPools,
        fetchUserPoolStats,
        userStats,
        loadedUserPoolsWeb3Provider: loadedUserPoolsWeb3Provider.current,
        loadingUserPoolStats,
        vaultLoading,
        setVaultLoading,
        disableWallet,
        totalPools,
      },
    },
    children,
  )
}

export { PoolsProvider, usePools }
