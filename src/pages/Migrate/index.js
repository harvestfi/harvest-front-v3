import React, { useMemo, useEffect, useState, useRef } from 'react'
import { isEmpty, find, get, isNaN, orderBy, isEqual } from 'lodash'
import BigNumber from 'bignumber.js'
// eslint-disable-next-line import/no-extraneous-dependencies
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { useMediaQuery } from 'react-responsive'
import { useVaults } from '../../providers/Vault'
import { useStats } from '../../providers/Stats'
import { fromWei } from '../../services/web3'
import MigrateDown from '../../assets/images/ui/migrate-down.svg'
import ChevronDown from '../../assets/images/ui/chevron-down.svg'
import ETHEREUM from '../../assets/images/logos/badge/ethereum.svg'
import EXPANDED from '../../assets/images/ui/minus.svg'
import COLLAPSED from '../../assets/images/ui/plus.svg'
import { usePools } from '../../providers/Pools'
import { addresses } from '../../data'
import { useWallet } from '../../providers/Wallet'
import { getChainIcon, getTotalApy, getHighestApy } from '../../utilities/parsers'
import { useThemeContext } from '../../providers/useThemeContext'
import { useRate } from '../../providers/Rate'
import AnimatedDots from '../../components/AnimatedDots'
import { formatNumber } from '../../utilities/formats'
import PositionModal from '../../components/MigrateComponents/PositionModal'
import VaultModal from '../../components/MigrateComponents/VaultModal'
import { NewLabel } from '../../components/MigrateComponents/PositionModal/style'
import Accordian from '../../components/MigrateComponents/Accordian'
import {
  getTokenPriceFromApi,
  getUserBalanceVaults,
  initBalanceAndDetailData,
  getCoinListFromApi,
} from '../../utilities/apiCalls'
import {
  FARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  IFARM_TOKEN_SYMBOL,
  MAX_DECIMALS,
  boostedVaults,
  chainList,
} from '../../constants'
import {
  Container,
  Inner,
  MigrateTop,
  PageIntro,
  PageTitle,
  SpaceLine,
  MigrateBox,
  VaultBox,
  BoxTitle,
  MigrateIcon,
  Button,
  ButtonDiv,
  Content,
  InfoText,
  BadgeToken,
  BadgeIcon,
  Token,
  ApyDownIcon,
} from './style'

const totalNetProfitKey = 'TOTAL_NET_PROFIT'
const totalHistoryDataKey = 'TOTAL_HISTORY_DATA'
const vaultProfitDataKey = 'VAULT_LIFETIME_YIELD'

const Migrate = () => {
  const location = useLocation()
  const { search } = useLocation()

  const { vaultsData, getFarmingBalances } = useVaults()
  const { profitShareAPY } = useStats()
  const { account, balances, getWalletBalances } = useWallet()
  const { userStats, fetchUserPoolStats, totalPools, pools } = usePools()
  const { rates } = useRate()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  const { darkMode, bgColor } = useThemeContext()
  const networkNames = ['ethereum', 'polygon', 'arbitrum', 'base', 'zksync']

  const [currencySym, setCurrencySym] = useState('$')
  const [, setCurrencyRate] = useState(1)
  const [apiData, setApiData] = useState([])
  const [farmTokenList, setFarmTokenList] = useState([])
  const [filteredFarmList, setFilteredFarmList] = useState([])
  const [, setNoFarm] = useState(false)
  const [, setVaultNetChangeList] = useState([])
  const [depositToken, setDepositToken] = useState([])
  const [showInactiveFarms] = useState(false)
  const [highestPosition, setHighestPosition] = useState()
  const [positionVaultAddress, setPositionVaultAddress] = useState('')
  const [highestVaultAddress, setHighestVaultAddress] = useState('')
  const [chainId, setChainId] = useState()
  const [highestApyVault, setHighestApyVault] = useState()
  const [fromVault, setFromVault] = useState()
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [showVaultModal, setShowVaultModal] = useState(false)
  const [isFromModal, setIsFromModal] = useState(false)
  const [matchedVault, setMatchedVault] = useState()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const isFromAdvanced = location.search.includes('from=')

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    const getCoinList = async () => {
      const data = await getCoinListFromApi()
      setApiData(data)
    }

    getCoinList()

    const prevVaultProfitData = JSON.parse(localStorage.getItem(vaultProfitDataKey) || '[]')
    setVaultNetChangeList(prevVaultProfitData)
  }, [])

  const farmProfitSharingPool = totalPools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        tokenAddress: addresses.iFARM,
        rewardSymbol: 'iFarm',
        tokenNames: ['FARM'],
        platform: ['Harvest'],
        decimals: 18,
      },
    }),
    [farmProfitSharingPool, profitShareAPY],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const firstWalletBalanceLoad = useRef(true)
  useEffectWithPrevious(
    ([prevAccount, prevBalances]) => {
      const hasSwitchedAccount = account !== prevAccount && account
      if (
        hasSwitchedAccount ||
        firstWalletBalanceLoad.current ||
        (balances && !isEqual(balances, prevBalances))
      ) {
        const getBalance = async () => {
          firstWalletBalanceLoad.current = false
          await getWalletBalances([IFARM_TOKEN_SYMBOL, FARM_TOKEN_SYMBOL], false, true)
        }

        getBalance()
      }
    },
    [account, balances],
  )

  useEffect(() => {
    const setBoostedVaults = async () => {
      if (groupOfVaults) {
        const vaultsKey = Object.keys(groupOfVaults)
        vaultsKey.map(async symbol => {
          // Add 'boosted' item to vaults that participate in campaign
          for (let i = 0; i < boostedVaults.length; i += 1) {
            if (symbol === boostedVaults[i]) {
              groupOfVaults[symbol].boosted = true
              return
            }
          }
        })
      }
    }

    setBoostedVaults()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (account && !isEmpty(userStats) && !isEmpty(depositToken)) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = [],
          dl = depositToken.length
        for (let i = 0; i < dl; i += 1) {
          let fAssetPool =
            depositToken[i] === FARM_TOKEN_SYMBOL
              ? groupOfVaults[depositToken[i]].data
              : find(totalPools, pool => pool.id === depositToken[i])

          const token = find(
            groupOfVaults,
            vault =>
              vault.vaultAddress === fAssetPool.collateralAddress ||
              (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress),
          )
          if (token) {
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if (isSpecialVault) {
              fAssetPool = token.data
            }
            poolsToLoad.push(fAssetPool)
          }
        }
        await fetchUserPoolStats(poolsToLoad, account, userStats)
        await getFarmingBalances(depositToken)
      }
      loadUserPoolsStats()
    }
  }, [account, totalPools, depositToken]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEmpty(userStats) && account) {
      const getFarmTokenInfo = async () => {
        let stakedVaults = [],
          sortedTokenList

        if (showInactiveFarms) {
          stakedVaults = Object.keys(userStats).filter(
            poolId =>
              new BigNumber(userStats[poolId].totalStaked).gt(0) ||
              new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
              (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
                new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
          )
        } else {
          const stakedVaultsTemp = Object.keys(userStats).filter(
            poolId =>
              new BigNumber(userStats[poolId].totalStaked).gt(0) ||
              new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
              (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
                new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
          )

          stakedVaults = stakedVaultsTemp.filter(
            poolId =>
              groupOfVaults[poolId === 'profit-sharing-farm' ? 'IFARM' : poolId] &&
              groupOfVaults[poolId === 'profit-sharing-farm' ? 'IFARM' : poolId].inactive !== true,
          )
        }

        const symbols = stakedVaults.map(poolId =>
          poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID ? FARM_TOKEN_SYMBOL : poolId,
        )

        if (depositToken.length !== symbols.length) {
          setDepositToken(symbols)
        }

        const newStats = [],
          sl = stakedVaults.length

        for (let i = 0; i < sl; i += 1) {
          const stats = {
            chain: '',
            symbol: '',
            logos: [],
            status: '',
            platform: '',
            unstake: '',
            stake: '',
            reward: [],
            rewardSymbol: [],
            rewardUSD: [],
            totalRewardUsd: 0,
            token: {},
          }
          let symbol = '',
            fAssetPool = {}

          if (stakedVaults[i] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          } else {
            symbol = stakedVaults[i]
          }

          fAssetPool =
            symbol === FARM_TOKEN_SYMBOL
              ? groupOfVaults[symbol].data
              : find(totalPools, pool => pool.id === symbol)

          const token = find(
            groupOfVaults,
            vault =>
              vault.vaultAddress === fAssetPool.collateralAddress ||
              (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress),
          )

          if (token) {
            const useIFARM = symbol === FARM_TOKEN_SYMBOL
            let tokenName = '',
              totalRewardAPRByPercent = 0,
              iFARMBalance = 0,
              usdPrice = 1

            const ttl = token.tokenNames.length
            for (let k = 0; k < ttl; k += 1) {
              tokenName += token.tokenNames[k]
              if (k !== ttl - 1) {
                tokenName += ', '
              }
            }
            stats.boosted = token.boosted
            stats.token = token
            stats.symbol = tokenName
            stats.logos = token.logoUrl
            stats.chain = getChainIcon(token.chain)
            stats.platform = useIFARM
              ? tokens[IFARM_TOKEN_SYMBOL].subLabel
                ? `${tokens[IFARM_TOKEN_SYMBOL].platform[0]} - ${tokens[IFARM_TOKEN_SYMBOL].subLabel}`
                : tokens[IFARM_TOKEN_SYMBOL].platform[0]
              : token.subLabel
              ? token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
              : token.platform[0] && token.platform[0]
            stats.status = token.inactive ? 'Inactive' : 'Active'
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if (isSpecialVault) {
              fAssetPool = token.data
            }

            const tokenDecimals = useIFARM
              ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.decimals`, 0)
              : token.decimals
            const tempPricePerFullShare = useIFARM
              ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
              : get(token, `pricePerFullShare`, 0)
            const pricePerFullShare = fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals)
            usdPrice =
              (symbol === FARM_TOKEN_SYMBOL
                ? (token.data.lpTokenData && token.data.lpTokenData.price) *
                  Number(pricePerFullShare)
                : token.vaultPrice) || 1

            const unstake = fromWei(
              get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
              MAX_DECIMALS,
            )
            stats.unstake = unstake
            if (isNaN(stats.unstake)) {
              stats.unstake = 0
            }
            const stakeTemp = get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0)
            if (useIFARM) {
              iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
            }
            const stake = fromWei(
              useIFARM ? iFARMBalance : stakeTemp,
              token.decimals || token.data.watchAsset.decimals,
              MAX_DECIMALS,
            )

            stats.stake = stake
            const finalBalance = Number(stake) + Number(unstake)
            if (useIFARM) {
              stats.balance = Number(stake) * usdPrice
            } else {
              stats.balance = finalBalance * usdPrice
            }
            if (isNaN(stats.stake)) {
              stats.stake = 0
            }
            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])

            for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
              let rewardSymbol = rewardTokenSymbols[l].toUpperCase(),
                rewards,
                rewardToken,
                usdRewardPrice = 0,
                rewardDecimal = get(tokens[rewardSymbol], 'decimals', 18)

              if (rewardTokenSymbols.includes(FARM_TOKEN_SYMBOL)) {
                rewardSymbol = FARM_TOKEN_SYMBOL
              }

              if (rewardTokenSymbols[l].substring(0, 1) === 'f') {
                if (rewardTokenSymbols[l] === 'fLODE') {
                  rewardToken = groupOfVaults.lodestar_LODE
                } else if (rewardTokenSymbols[l] === 'fSUSHI') {
                  rewardToken = groupOfVaults.SUSHI_HODL
                } else if (rewardTokenSymbols[l] === 'fDEN_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DEN_4EUR
                } else if (rewardTokenSymbols[l] === 'fDEN2_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DEN2_4EUR
                } else if (rewardTokenSymbols[l] === 'fDENMAY22_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DENMAY22_4EUR
                } else if (rewardTokenSymbols[l] === 'fDENJUL22_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DENJUL22_4EUR
                } else if (rewardTokenSymbols[l] === 'fAURFEB22_USDC') {
                  rewardToken = groupOfVaults.jarvis_AUR_USDC_V2
                } else if (
                  rewardTokenSymbols[l] === 'fQUI_2CAD' ||
                  rewardTokenSymbols[l] === 'fSES_2JPY' ||
                  rewardTokenSymbols[l] === 'fJRTMAY22_USDC' ||
                  rewardTokenSymbols[l] === 'fJRTJUL22_USDC' ||
                  rewardTokenSymbols[l] === 'fJRTSEP22_USDC' ||
                  rewardTokenSymbols[l] === 'fJRTNOV22_USDC' ||
                  rewardTokenSymbols[l] === 'fAURAPR22_USDC'
                ) {
                  rewardToken = groupOfVaults.jarvis_AUR_USDC_V2
                } else {
                  const underlyingRewardSymbol = rewardTokenSymbols[l].substring(1)
                  rewardToken = groupOfVaults[underlyingRewardSymbol]
                }
              } else {
                rewardToken = groupOfVaults[rewardSymbol]
              }

              if (rewardTokenSymbols.length > 1) {
                const rewardsEarned = userStats[stakedVaults[i]].rewardsEarned
                if (
                  rewardsEarned !== undefined &&
                  !(Object.keys(rewardsEarned).length === 0 && rewardsEarned.constructor === Object)
                ) {
                  rewards = rewardsEarned[rewardTokenSymbols[l]]
                }
              } else {
                rewards = userStats[stakedVaults[i]].totalRewardsEarned
              }

              if (rewardToken) {
                const usdUnderlyingRewardPrice =
                  (rewardSymbol === FARM_TOKEN_SYMBOL
                    ? rewardToken.data.lpTokenData && rewardToken.data.lpTokenData.price
                    : rewardToken.usdPrice) || 0
                const pricePerFullShareInVault = rewardToken.pricePerFullShare
                const decimalsInVault = rewardToken.decimals || 18

                usdRewardPrice =
                  rewardSymbol === FARM_TOKEN_SYMBOL || rewardSymbol === IFARM_TOKEN_SYMBOL
                    ? usdUnderlyingRewardPrice
                    : Number(usdUnderlyingRewardPrice) *
                      fromWei(pricePerFullShareInVault, decimalsInVault, decimalsInVault, true)

                rewardDecimal =
                  rewardToken.decimals ||
                  (rewardToken.data &&
                    rewardToken.data.lpTokenData &&
                    rewardToken.data.lpTokenData.decimals)
              } else {
                try {
                  const al = apiData.length
                  for (let ids = 0; ids < al; ids += 1) {
                    const tempData = apiData[ids]
                    const tempSymbol = tempData.symbol
                    if (
                      rewardSymbol === 'ECOCNG'
                        ? tempSymbol.toLowerCase() === 'cng'
                        : rewardSymbol === 'GENE'
                        ? tempSymbol.toLowerCase() === '$gene'
                        : rewardSymbol.toLowerCase() === tempSymbol.toLowerCase()
                    ) {
                      // eslint-disable-next-line no-await-in-loop
                      usdRewardPrice = await getTokenPriceFromApi(tempData.id)
                      break
                    }
                  }
                } catch (error) {
                  console.error('Error:', error)
                }
              }
              const rewardValues =
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal, rewardDecimal, true)
              stats.reward.push(Number(rewardValues))
              stats.totalRewardUsd += Number(rewardValues * Number(usdRewardPrice))
              stats.rewardSymbol.push(rewardSymbol)

              const rewardPriceUSD = rewardValues * Number(usdRewardPrice)
              stats.rewardUSD.push(rewardPriceUSD)
            }

            const vaultsKey = Object.keys(groupOfVaults)
            const paramAddress = isSpecialVault
              ? token.data.collateralAddress
              : token.vaultAddress || token.tokenAddress
            const vaultIds = vaultsKey.filter(
              vaultId =>
                groupOfVaults[vaultId].vaultAddress === paramAddress ||
                groupOfVaults[vaultId].tokenAddress === paramAddress,
            )
            const id = vaultIds[0]
            const tokenVault = get(vaultsData, token.hodlVaultId || id)
            const vaultPool = isSpecialVault
              ? token.data
              : find(totalPools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))

            const totalApy = isSpecialVault
              ? getTotalApy(null, token, true)
              : getTotalApy(vaultPool, tokenVault)

            const showAPY = isSpecialVault
              ? token.data &&
                token.data.loaded &&
                // !loadingVaults &&
                (token.data.dataFetched === false || totalApy !== null)
                ? token.inactive
                  ? 'Inactive'
                  : totalApy || null
                : '-'
              : vaultPool.loaded && totalApy !== null
              ? token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched
                ? token.inactive || token.testInactive
                  ? 'Inactive'
                  : null
                : totalApy
              : '-'
            if (showAPY === 'Inactive' || showAPY === null) {
              stats.apy = Number(-1)
            } else {
              stats.apy = Number(showAPY)
            }

            const estimatedApyByPercent = get(tokenVault, `estimatedApy`, 0)
            const estimatedApy = estimatedApyByPercent / 100
            const vaultAPR = ((1 + estimatedApy) ** (1 / 365) - 1) * 365
            const vaultAPRDaily = vaultAPR / 365
            const vaultAPRMonthly = vaultAPR / 12
            const frl = fAssetPool.rewardAPR.length

            for (let j = 0; j < frl; j += 1) {
              totalRewardAPRByPercent += Number(fAssetPool.rewardAPR[j])
            }
            const totalRewardAPR = totalRewardAPRByPercent / 100
            const poolAPRDaily = totalRewardAPR / 365
            const poolAPRMonthly = totalRewardAPR / 12

            const swapFeeAPRYearly = Number(fAssetPool.tradingApy) / 100
            const swapFeeAPRDaily = swapFeeAPRYearly / 365
            const swapFeeAPRMonthly = swapFeeAPRYearly / 12

            const dailyYield =
              Number(stake) * usdPrice * (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily) +
              Number(unstake) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
            const monthlyYield =
              Number(stake) * usdPrice * (vaultAPRMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
              Number(unstake) * usdPrice * (vaultAPRMonthly + swapFeeAPRMonthly)

            stats.dailyYield = dailyYield
            stats.monthlyYield = monthlyYield

            newStats.push(stats)
          }
        }

        const storedSortingDashboard = localStorage.getItem('sortingDashboard')
        if (storedSortingDashboard && JSON.parse(storedSortingDashboard) !== 'lifetimeYield') {
          sortedTokenList = orderBy(newStats, [JSON.parse(storedSortingDashboard)], ['desc'])
        } else {
          sortedTokenList = orderBy(newStats, ['balance'], ['desc'])
        }
        setFarmTokenList(sortedTokenList)
        if (sortedTokenList.length === 0) {
          setNoFarm(true)
        }
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances, showInactiveFarms]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEmpty(userStats) && account) {
      const getNetProfitValue = async () => {
        let totalNetProfitUSD = 0,
          combinedEnrichedData = []

        const { userBalanceVaults } = await getUserBalanceVaults(account)
        const stakedVaults = []
        const ul = userBalanceVaults.length
        for (let j = 0; j < ul; j += 1) {
          Object.keys(groupOfVaults).forEach(key => {
            const isSpecialVaultAll =
              groupOfVaults[key].liquidityPoolVault || groupOfVaults[key].poolVault
            const paramAddressAll = isSpecialVaultAll
              ? groupOfVaults[key].data.collateralAddress
              : groupOfVaults[key].vaultAddress || groupOfVaults[key].tokenAddress

            if (userBalanceVaults[j] === paramAddressAll.toLowerCase()) {
              stakedVaults.push(key)
            }
          })
        }

        const vaultNetChanges = []
        const promises = stakedVaults.map(async stakedVault => {
          let symbol = '',
            fAssetPool = {}

          if (stakedVault === IFARM_TOKEN_SYMBOL) {
            symbol = FARM_TOKEN_SYMBOL
          } else {
            symbol = stakedVault
          }

          fAssetPool =
            symbol === FARM_TOKEN_SYMBOL
              ? groupOfVaults[symbol].data
              : find(totalPools, pool => pool.id === symbol)

          const token = find(
            groupOfVaults,
            vault =>
              vault.vaultAddress === fAssetPool?.collateralAddress ||
              (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress),
          )

          if (token) {
            const useIFARM = symbol === FARM_TOKEN_SYMBOL
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if (isSpecialVault) {
              fAssetPool = token.data
            }

            const paramAddress = isSpecialVault
              ? token.data.collateralAddress
              : token.vaultAddress || token.tokenAddress

            const { sumNetChangeUsd, enrichedData } = await initBalanceAndDetailData(
              paramAddress,
              useIFARM ? token.data.chain : token.chain,
              account,
              token.decimals,
            )

            vaultNetChanges.push({ id: symbol, sumNetChangeUsd })
            const enrichedDataWithSymbol = enrichedData.map(data => ({
              ...data,
              tokenSymbol: symbol,
            }))
            combinedEnrichedData = combinedEnrichedData.concat(enrichedDataWithSymbol)
            totalNetProfitUSD += sumNetChangeUsd
          }
        })

        await Promise.all(promises)

        totalNetProfitUSD = totalNetProfitUSD === 0 ? -1 : totalNetProfitUSD
        localStorage.setItem(totalNetProfitKey, totalNetProfitUSD.toString())

        setVaultNetChangeList(vaultNetChanges)
        localStorage.setItem(vaultProfitDataKey, JSON.stringify(vaultNetChanges))

        combinedEnrichedData.sort((a, b) => b.timestamp - a.timestamp)
        localStorage.setItem(totalHistoryDataKey, JSON.stringify(combinedEnrichedData))
      }

      getNetProfitValue()
    } else {
      localStorage.setItem(totalNetProfitKey, '0')
      setVaultNetChangeList([])
      localStorage.setItem(vaultProfitDataKey, JSON.stringify([]))
      localStorage.setItem(totalHistoryDataKey, JSON.stringify([]))
    }
  }, [account, userStats, balances, showInactiveFarms]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filteredVaultList = showInactiveFarms
      ? farmTokenList
      : farmTokenList.filter(farm => farm.status === 'Active')
    setFilteredFarmList(filteredVaultList)

    if (!isFromModal && isFromAdvanced && filteredFarmList.length > 0) {
      const values = queryString.parse(search)
      // eslint-disable-next-line array-callback-return, consistent-return
      const selectedPosition = filteredFarmList.filter(vault => {
        const oneVaultAddress = vault.token.data
          ? vault.token.tokenAddress
          : vault.token.vaultAddress
        if (oneVaultAddress && values) {
          if (oneVaultAddress.toLowerCase() === values.from.toLowerCase()) {
            return vault
          }
        }
      })

      setFromVault(selectedPosition[0])

      if (fromVault) {
        setHighestPosition(fromVault)
        if (fromVault.token.data) {
          setPositionVaultAddress(fromVault.token.tokenAddress)
        } else if (fromVault.token.vaultAddress) {
          setPositionVaultAddress(fromVault.token.vaultAddress)
        }
      }

      if (highestPosition && highestPosition.token.poolVault) {
        setChainId(Number(highestPosition.token.data.chain))
      } else if (highestPosition) {
        setChainId(Number(highestPosition.token.chain))
      }
    }

    if (!isFromModal && !isFromAdvanced && filteredFarmList.length > 0) {
      setHighestPosition(filteredFarmList[0])
      if (highestPosition && highestPosition.token.data) {
        setPositionVaultAddress(highestPosition.token.tokenAddress)
      } else if (highestPosition) {
        setPositionVaultAddress(highestPosition.token.vaultAddress)
      }

      if (highestPosition && highestPosition.token.poolVault) {
        setChainId(Number(highestPosition.token.data.chain))
      } else if (highestPosition) {
        setChainId(Number(highestPosition.token.chain))
      }
    }

    if (chainId) {
      setHighestApyVault(getHighestApy(groupOfVaults, chainId, vaultsData, pools))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showInactiveFarms,
    farmTokenList,
    highestPosition,
    pools,
    vaultsData,
    chainId,
    fromVault,
    isFromAdvanced,
    search,
  ])

  useEffect(() => {
    if (highestApyVault) {
      setHighestVaultAddress(highestApyVault.vault.vaultAddress)
    }
  }, [highestApyVault])

  useEffect(() => {
    let isFound = false
    if (filteredFarmList && highestVaultAddress) {
      filteredFarmList.map(stakedVault => {
        const eachTokenAddress = stakedVault.token.data
          ? stakedVault.token.tokenAddress.toLowerCase()
          : stakedVault.token.vaultAddress.toLowerCase()
        if (eachTokenAddress === highestVaultAddress.toLowerCase()) {
          setMatchedVault(stakedVault)
          isFound = true
          return true
        }
        if (!isFound && eachTokenAddress !== highestVaultAddress.toLowerCase()) {
          setMatchedVault()
          return true
        }
        return false
      })
    }
  }, [highestVaultAddress]) // eslint-disable-line react-hooks/exhaustive-deps

  const getBadgeId = vaultAddress => {
    const vaultData = Object.values(groupOfVaults).find(vault => {
      if (vault.vaultAddress && vaultAddress) {
        return vault.vaultAddress.toLowerCase() === vaultAddress.toLowerCase()
      }
      return false
    })
    const chain = vaultData ? vaultData.chain : ''

    for (let i = 0; i < chainList.length; i += 1) {
      if (chainList[i].chainId === Number(chain)) {
        return i
      }
    }
    return -1
  }

  const stopPropagation = event => {
    event.stopPropagation()
  }

  const accordianText = [
    {
      question: <>What is the Migrate tool about?</>,
      answer: (
        <>The migrate pool allows you to switch between Harvest strategies in just a few clicks.</>
      ),
    },
    {
      question: <>If I don&apos;t like the new strategy, can I exit at any time?</>,
      answer: (
        <>
          Yes, you can switch back to your original strategy or another at any time without any
          platform fees.
        </>
      ),
    },
    {
      question: <>What should I know about the new APY that I&apos;ll be getting?</>,
      answer: (
        <>
          APYs vary between strategies because each one carries different risks and exposures.
          Before migrating, it&apos;s good to learn about the new strategy&apos;s mechanics. For
          example, some strategies might offer a higher APY but involve assets with more price
          fluctuations. Our Migrate tool provides this flexibility, but remember that APYs can
          change based on market conditions and strategy performance.
        </>
      ),
    },
    {
      question: <>What is the cost of migrating?</>,
      answer: (
        <>The migrate pool allows you to switch between Harvest strategies in just a few clicks.</>
      ),
    },
    {
      question: <>What is the Migrate tool about?</>,
      answer: (
        <>
          There are no platform fees associated with using the Migrate tool. However, gas fees may
          still apply depending on the network.
        </>
      ),
    },
    {
      question: <>What happens when I click on &apos;Preview & Migrate&apos;?</>,
      answer: (
        <>
          You&apos;ll be prompted with a preview of the fToken conversion between the involved
          strategies.
        </>
      ),
    },
    {
      question: <>I can&apos;t find a strategy on the &apos;Migrate to&apos; list.</>,
      answer: (
        <>
          If a strategy you&apos;re looking for is not listed, it might be on a different network or
          not yet supported by the Migrate tool.
        </>
      ),
    },
    {
      question: <>Encountering issues?</>,
      answer: <>Please open a Discord ticket and we&apos;ll help.</>,
    },
  ]

  return (
    <Container bgColor={bgColor}>
      <Inner marginBottom="55px">
        <MigrateTop>
          <PageTitle color={darkMode ? '#ffffff' : '"#101828"'}>Migrate</PageTitle>
        </MigrateTop>
        <PageIntro color={darkMode ? '#ffffff' : '#475467'}>
          Find alternatives for your existing positions and migrate in once click.
        </PageIntro>
        <SpaceLine />
      </Inner>
      <Inner display="flex" justifyContent="center" alignItems="flex-start">
        <MigrateBox className="migrate-box">
          <BoxTitle color={darkMode ? '#ffffff' : '#475467'}>My existing position</BoxTitle>
          <VaultBox
            bgColor="#f4f6ff"
            border="2px solid #7f9bff"
            onClick={() => {
              setShowPositionModal(true)
            }}
          >
            <Content alignItems="start">
              <InfoText fontSize="10px" fontWeight="500" color="#5fCf76">
                {highestPosition ? (
                  `${currencySym}${formatNumber(highestPosition.balance)}`
                ) : (
                  <AnimatedDots />
                )}
              </InfoText>
              <BadgeToken>
                <BadgeIcon>
                  {highestPosition ? (
                    <img src={highestPosition.chain ? highestPosition.chain : ETHEREUM} alt="" />
                  ) : (
                    <AnimatedDots />
                  )}
                </BadgeIcon>
                <Token
                  href={`${window.location.origin}/${
                    networkNames[getBadgeId(positionVaultAddress)]
                  }/${positionVaultAddress}`}
                  onClick={stopPropagation}
                >
                  {highestPosition ? highestPosition.token.tokenNames.join(', ') : <AnimatedDots />}
                </Token>
              </BadgeToken>
            </Content>
            <ApyDownIcon>
              <Content alignItems="end">
                <InfoText fontSize="10px" fontWeight="700" color="#5fCf76">
                  {highestPosition ? `${highestPosition.apy}% Live APY` : <AnimatedDots />}
                </InfoText>
                <InfoText fontSize="10px" fontWeight="500" color="#6988ff">
                  {highestPosition ? (
                    `${currencySym}${formatNumber(highestPosition.apy / 100)}/yr per $1 allocated`
                  ) : (
                    <AnimatedDots />
                  )}
                </InfoText>
              </Content>
              <img
                src={ChevronDown}
                alt="Chevron Down"
                style={{
                  marginLeft: '20px',
                }}
              />
            </ApyDownIcon>
          </VaultBox>
          <PositionModal
            showPositionModal={showPositionModal}
            setShowPositionModal={setShowPositionModal}
            networkName={networkNames[getBadgeId(positionVaultAddress)]}
            setPositionVaultAddress={setPositionVaultAddress}
            filteredFarmList={filteredFarmList}
            chainId={chainId}
            isMobile={isMobile}
            currencySym={currencySym}
            setHighestPosition={setHighestPosition}
            setIsFromModal={setIsFromModal}
            stopPropagation={stopPropagation}
          />
          <MigrateIcon>
            <img
              src={MigrateDown}
              alt="migrate down"
              style={{
                filter: darkMode
                  ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(352deg) brightness(101%) contrast(104%)'
                  : '',
              }}
            />
          </MigrateIcon>
          <BoxTitle color={darkMode ? '#ffffff' : '#475467'}>Migrate to</BoxTitle>
          <VaultBox
            className="from-vault"
            bgColor="#f8fffc"
            onClick={() => {
              setShowVaultModal(true)
            }}
          >
            <Content alignItems="start">
              <InfoText fontSize="10px" fontWeight="500" color="#5fCf76">
                {matchedVault ? `${currencySym}${formatNumber(matchedVault.balance)}` : '-'}
              </InfoText>
              <BadgeToken>
                <BadgeIcon>
                  {highestPosition ? (
                    <img src={highestPosition.chain ? highestPosition.chain : ETHEREUM} alt="" />
                  ) : (
                    <AnimatedDots />
                  )}
                </BadgeIcon>
                <Token
                  href={`${window.location.origin}/${
                    networkNames[getBadgeId(highestVaultAddress)]
                  }/${highestVaultAddress}`}
                  onClick={stopPropagation}
                >
                  {highestApyVault ? (
                    `${highestApyVault.vault.tokenNames.join(
                      ', ',
                    )} (${highestApyVault.vault.platform.join(', ')})`
                  ) : (
                    <AnimatedDots />
                  )}
                </Token>
              </BadgeToken>
            </Content>
            <ApyDownIcon>
              <Content alignItems="end">
                <InfoText fontSize="10px" fontWeight="700" color="#5fCf76">
                  {highestApyVault ? `${highestApyVault.vaultApy}% Live APY` : <AnimatedDots />}
                </InfoText>
                <InfoText fontSize="10px" fontWeight="500" color="#6988ff">
                  {highestApyVault ? (
                    `${currencySym}${formatNumber(
                      highestApyVault.vaultApy / 100,
                    )}/yr per $1 allocated`
                  ) : (
                    <AnimatedDots />
                  )}
                </InfoText>
              </Content>
              <img
                src={ChevronDown}
                alt="Chevron Down"
                style={{
                  marginLeft: '20px',
                }}
              />
            </ApyDownIcon>
          </VaultBox>
          <VaultModal
            showVaultModal={showVaultModal}
            setShowVaultModal={setShowVaultModal}
            networkName={networkNames[getBadgeId(positionVaultAddress)]}
            setHighestApyVault={setHighestApyVault}
            setHighestVaultAddress={setHighestVaultAddress}
            filteredFarmList={filteredFarmList}
            chainId={chainId}
            isMobile={isMobile}
            currencySym={currencySym}
            setIsFromModal={setIsFromModal}
            stopPropagation={stopPropagation}
            groupOfVaults={groupOfVaults}
            vaultsData={vaultsData}
            pools={pools}
          />
          <NewLabel
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
            marginBottom="20px"
          >
            <NewLabel
              weight="600"
              size="14px"
              height="24px"
              marginBottom="10px"
              color={darkMode ? '#ffffff' : '#344054'}
            >
              Migration details
            </NewLabel>
            <NewLabel display="flex" justifyContent="space-between" marginBottom="10px">
              <NewLabel
                display="flex"
                justifyContent="start"
                size="14px"
                weight="400"
                height="24px"
                color={darkMode ? '#ffffff' : '#344054'}
              >
                APY change
              </NewLabel>
              <NewLabel
                display="flex"
                justifyContent="end"
                size="14px"
                weight="600"
                height="24px"
                color={darkMode ? '#ffffff' : '#344054'}
              >
                {highestPosition ? `${highestPosition.apy}%` : <AnimatedDots />}{' '}
                <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                  {highestPosition ? '→' : ''}
                </span>
                <span style={{ color: '#5fCf76' }}>
                  {highestApyVault ? `${highestApyVault.vaultApy}%` : <AnimatedDots />}
                </span>
              </NewLabel>
            </NewLabel>
            <NewLabel display="flex" justifyContent="space-between" marginBottom="10px">
              <NewLabel
                display="flex"
                justifyContent="start"
                size="14px"
                weight="400"
                height="24px"
                color={darkMode ? '#ffffff' : '#344054'}
              >
                Platform Fees
              </NewLabel>
              <NewLabel
                display="flex"
                justifyContent="end"
                size="14px"
                weight="600"
                height="24px"
                color={darkMode ? '#ffffff' : '#344054'}
              >{`${currencySym}0.00`}</NewLabel>
            </NewLabel>
          </NewLabel>
          <ButtonDiv>
            <Button>Preview & Migrate</Button>
          </ButtonDiv>
        </MigrateBox>
        <NewLabel marginLeft="32px" width="100%">
          {accordianText.map((text, i) => {
            return (
              <Accordian
                key={i}
                text={text}
                EXPANDED={EXPANDED}
                COLLAPSED={COLLAPSED}
                darkMode={darkMode}
              />
            )
          })}
        </NewLabel>
      </Inner>
    </Container>
  )
}

export default Migrate
