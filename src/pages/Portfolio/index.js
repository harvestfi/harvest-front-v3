import React, { useRef, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import useEffectWithPrevious from 'use-effect-with-previous'
import { find, get, isEmpty, orderBy, isEqual, isNaN } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { Dropdown, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { IoArrowUpCircleOutline, IoCheckmark } from 'react-icons/io5'
import 'react-loading-skeleton/dist/skeleton.css'
import VaultRow from '../../components/DashboardComponents/VaultRow'
import LifetimeYieldData from '../../components/LifetimeYieldChart/LifetimeYieldData'
import Safe from '../../assets/images/logos/dashboard/safe.svg'
import Coin1 from '../../assets/images/logos/dashboard/coins-stacked-02.svg'
import Coin2 from '../../assets/images/logos/dashboard/coins-stacked-04.svg'
import Diamond from '../../assets/images/logos/dashboard/diamond-01.svg'
import Sort from '../../assets/images/logos/dashboard/sort.svg'
import DropDownIcon from '../../assets/images/logos/advancedfarm/drop-down.svg'
import AdvancedImg from '../../assets/images/logos/sidebar/advanced.svg'
import Eye from '../../assets/images/logos/eye-icon.svg'
import ClosedEye from '../../assets/images/logos/eye_closed.svg'
import SkeletonLoader from '../../components/DashboardComponents/SkeletonLoader'
import EarningsHistoryLatest from '../../components/EarningsHistoryLatest/HistoryDataLatest'
import TotalValue from '../../components/TotalValue'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'
import MobileBackImage from '../../assets/images/logos/portfolio-mobile-background.png'
import PhoneLogo from '../../assets/images/logos/farm-icon.svg'
import {
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  ROUTES,
  supportedCurrencies,
} from '../../constants'
import { addresses } from '../../data'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { useRate } from '../../providers/Rate'
import { fromWei } from '../../services/web3'
import {
  parseValue,
  isSpecialApp,
  formatAddress,
  formatNumber,
  showUsdValueCurrency,
} from '../../utilities/formats'
import { getCoinListFromApi, getTokenPriceFromApi } from '../../utilities/apiCalls'
import {
  fetchAndParseVaultData,
  getChainIcon,
  getTotalApy,
  handleToggle,
  totalHistoryDataKey,
  totalNetProfitKey,
  vaultProfitDataKey,
} from '../../utilities/parsers'
import {
  Column,
  Container,
  EmptyInfo,
  EmptyPanel,
  Header,
  Inner,
  SubPart,
  TransactionDetails,
  Col,
  TableContent,
  ConnectButtonStyle,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
  HeaderWrap,
  HeaderTitle,
  HeaderButton,
  TableWrap,
  PositionTable,
  YieldTable,
  ContentBox,
  ExploreButtonStyle,
  MobileSwitch,
  SwitchBtn,
  MobileHeader,
  HeaderTop,
  LifetimeValue,
  LifetimeSub,
  LogoDiv,
  Address,
  GreenBox,
  ChartSection,
  ChartBox,
} from './style'

const Portfolio = () => {
  const { push } = useHistory()
  const { connected, connectAction, account, balances, getWalletBalances } = useWallet()
  const { userStats, fetchUserPoolStats, totalPools, disableWallet } = usePools()
  const { profitShareAPY } = useStats()
  const { vaultsData, getFarmingBalances } = useVaults()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  const {
    showInactiveFarms,
    darkMode,
    bgColorNew,
    hoverColor,
    hoverColorNew,
    filterColor,
    backColor,
    fontColor,
    fontColor1,
    fontColor2,
    borderColor,
    borderColorBox,
    inputBorderColor,
    btnHoverColor,
    btnColor,
  } = useThemeContext()

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { rates, updateCurrency } = useRate()
  const [curCurrency, setCurCurrency] = useState(supportedCurrencies[0])
  const [apiData, setApiData] = useState([])
  const [farmTokenList, setFarmTokenList] = useState([])
  const [filteredFarmList, setFilteredFarmList] = useState([])
  const [noFarm, setNoFarm] = useState(false)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [totalYieldDaily, setTotalYieldDaily] = useState(0)
  const [totalYieldMonthly, setTotalYieldMonthly] = useState(0)
  const [totalYieldYearly, setTotalYieldYearly] = useState(0)
  const [depositToken, setDepositToken] = useState([])
  const [sortOrder, setSortOrder] = useState(false)
  const [showLatestYield, setShowLatestYield] = useState(false)
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [oneDayYield, setOneDayYield] = useState(0)
  const [showAddress, setShowAddress] = useState(true)
  const [onceRun, setOnceRun] = useState(false)
  const [safeFlag, setSafeFlag] = useState(true)
  const [, setNoHarvestsData] = useState(false)
  const [, setNoRewardsData] = useState(false)
  const [totalNetProfit, setTotalNetProfit] = useState(() => {
    return Number(localStorage.getItem(totalNetProfitKey) || '0')
  })
  const [vaultNetChangeList, setVaultNetChangeList] = useState(() => {
    return JSON.parse(localStorage.getItem(vaultProfitDataKey) || '[]')
  })
  const [totalHistoryData, setTotalHistoryData] = useState(() => {
    return JSON.parse(localStorage.getItem(totalHistoryDataKey) || '[]')
  })

  useEffect(() => {
    const getCoinList = async () => {
      const data = await getCoinListFromApi()
      setApiData(data)
    }
    getCoinList()
  }, [])

  useEffect(() => {
    if (connected && (totalDeposit !== 0 || totalNetProfit !== 0)) {
      setIsLoading(false)
    }
  }, [totalNetProfit, connected, totalDeposit, totalYieldMonthly, totalYieldDaily]) // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    setCurCurrency(supportedCurrencies[rates.currency.id])
  }, [rates])

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
    if (!connected) {
      setTotalDeposit(0)
      setTotalRewards(0)
      setTotalYieldDaily(0)
      setTotalYieldMonthly(0)
      setTotalYieldYearly(0)
    }
  }, [connected])

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
              vault.vaultAddress === fAssetPool?.collateralAddress ||
              (vault.data && vault.data.collateralAddress === fAssetPool?.collateralAddress),
          )
          if (token) {
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if (isSpecialVault) {
              fAssetPool = token.data
            }
            if (!token.isIPORVault) poolsToLoad.push(fAssetPool)
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
          totalBalanceUSD = 0,
          valueRewards = 0,
          totalDailyYield = 0,
          totalMonthlyYield = 0,
          totalYearlyYield = 0,
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
            fAssetPool = {},
            token = null

          if (stakedVaults[i] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          } else {
            symbol = stakedVaults[i]
          }

          fAssetPool =
            symbol === FARM_TOKEN_SYMBOL
              ? groupOfVaults[symbol].data
              : find(totalPools, pool => pool.id === symbol)

          if (symbol.includes('IPOR_')) {
            token = groupOfVaults[symbol]
          } else {
            token = find(
              groupOfVaults,
              vault =>
                vault.vaultAddress === fAssetPool.collateralAddress ||
                (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress),
            )
          }

          if (token) {
            const useIFARM = symbol === FARM_TOKEN_SYMBOL
            let tokenName = '',
              totalRewardAPRByPercent = 0,
              iFARMBalance = 0,
              usdPrice = 1,
              showAPY = null

            const ttl = token.tokenNames.length
            for (let k = 0; k < ttl; k += 1) {
              tokenName += token.tokenNames[k]
              if (k !== ttl - 1) {
                tokenName += ' - '
              }
            }
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
                : token.isIPORVault
                ? token.usdPrice
                : token.vaultPrice) || 1

            const unstake = fromWei(
              get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
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
              token.decimals || token.data.watchAsset.decimals,
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
            const totalStk = parseFloat((isNaN(Number(stake)) ? 0 : parseValue(stake)) * usdPrice)
            const totalUnsk = parseFloat(
              (isNaN(Number(unstake)) || useIFARM ? 0 : parseValue(unstake)) * usdPrice,
            )
            totalBalanceUSD += totalStk + totalUnsk
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
              valueRewards += Number(rewardValues * Number(usdRewardPrice))
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
              : token.isIPORVault
              ? token.estimatedApy
              : getTotalApy(vaultPool, tokenVault)

            if (token.isIPORVault) {
              showAPY = totalApy
            } else {
              showAPY = isSpecialVault
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
            }
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
            if (!token.isIPORVault) {
              const frl = fAssetPool.rewardAPR.length

              for (let j = 0; j < frl; j += 1) {
                totalRewardAPRByPercent += Number(fAssetPool.rewardAPR[j])
              }
            }
            const totalRewardAPR = totalRewardAPRByPercent / 100
            const poolAPRDaily = totalRewardAPR / 365
            const poolAPRMonthly = totalRewardAPR / 12

            const swapFeeAPRYearly = token.isIPORVault ? 0 : Number(fAssetPool.tradingApy) / 100
            const swapFeeAPRDaily = swapFeeAPRYearly / 365
            const swapFeeAPRMonthly = swapFeeAPRYearly / 12

            const dailyYield =
              Number(stake) * usdPrice * (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily) +
              Number(unstake) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
            const monthlyYield =
              Number(stake) * usdPrice * (vaultAPRMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
              Number(unstake) * usdPrice * (vaultAPRMonthly + swapFeeAPRMonthly)
            const yearlyYield =
              Number(stake) * usdPrice * (vaultAPR + totalRewardAPR + swapFeeAPRYearly) +
              Number(unstake) * usdPrice * (vaultAPR + swapFeeAPRYearly)

            stats.dailyYield = dailyYield
            stats.monthlyYield = monthlyYield

            totalDailyYield += dailyYield
            totalMonthlyYield += monthlyYield
            totalYearlyYield += yearlyYield
            newStats.push(stats)
          }
        }

        setTotalDeposit(totalBalanceUSD)
        setTotalRewards(valueRewards)
        setTotalYieldDaily(totalDailyYield)
        setTotalYieldMonthly(totalMonthlyYield)
        setTotalYieldYearly(totalYearlyYield)

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
    const totalNetProfitValue = localStorage.getItem(totalNetProfitKey)

    if (
      Number(totalNetProfitValue) === 0 ||
      totalNetProfitValue === null ||
      Number(totalNetProfitValue) === -1
    ) {
      if (!isEmpty(userStats) && account && !onceRun) {
        setOnceRun(true)
        const getNetProfitValue = async () => {
          const {
            vaultNetChanges,
            sortedCombinedEnrichedArray,
            totalNetProfitUSD,
            stakedVaults,
            rewardsAPIDataLength,
          } = await fetchAndParseVaultData({
            account,
            groupOfVaults,
            totalPools,
            setSafeFlag,
          })

          if (stakedVaults.length === 0) {
            setNoHarvestsData(true)
          }

          if (rewardsAPIDataLength === 0) {
            setNoRewardsData(true)
          }

          setTotalNetProfit(totalNetProfitUSD)
          localStorage.setItem(totalNetProfitKey, totalNetProfitUSD.toString())

          setVaultNetChangeList(vaultNetChanges)
          localStorage.setItem(vaultProfitDataKey, JSON.stringify(vaultNetChanges))

          setTotalHistoryData(sortedCombinedEnrichedArray)
          localStorage.setItem(totalHistoryDataKey, JSON.stringify(sortedCombinedEnrichedArray))
        }

        getNetProfitValue()
      } else {
        setTotalNetProfit(0)
        localStorage.setItem(totalNetProfitKey, '0')
        setVaultNetChangeList([])
        localStorage.setItem(vaultProfitDataKey, JSON.stringify([]))
        setTotalHistoryData([])
        localStorage.setItem(totalHistoryDataKey, JSON.stringify([]))
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, userStats, connected, safeFlag])

  const sortCol = field => {
    if (field === 'lifetimeYield') {
      const sortedVaultList = orderBy(
        vaultNetChangeList,
        ['sumNetChangeUsd'],
        [sortOrder ? 'asc' : 'desc'],
      )

      const idIndexMap = {}
      sortedVaultList.forEach((vault, index) => {
        idIndexMap[vault.id] = index
      })

      const sortedFarmTokenList = [...farmTokenList].sort((a, b) => {
        const aIndex = a.token.data
          ? idIndexMap[a.symbol]
          : idIndexMap[a.token.pool.id] !== undefined
          ? idIndexMap[a.token.pool.id]
          : Infinity

        const bIndex = b.token.data
          ? idIndexMap[b.symbol]
          : idIndexMap[b.token.pool.id] !== undefined
          ? idIndexMap[b.token.pool.id]
          : Infinity

        return aIndex - bIndex
      })

      setFarmTokenList(sortedFarmTokenList)
      setSortOrder(!sortOrder)
    } else {
      const tokenList = orderBy(farmTokenList, [field], [sortOrder ? 'asc' : 'desc'])
      setFarmTokenList(tokenList)
      setSortOrder(!sortOrder)
    }
    localStorage.setItem('sortingDashboard', JSON.stringify(field))
  }

  useEffect(() => {
    const filteredVaultList = showInactiveFarms
      ? farmTokenList
      : farmTokenList.filter(farm => farm.status === 'Active')
    setFilteredFarmList(filteredVaultList)
  }, [showInactiveFarms, farmTokenList])

  const positionHeader = [
    { width: isMobile ? '23%' : '40%', sort: 'symbol', name: 'Farm' },
    { width: isMobile ? '20%' : '15%', sort: 'balance', name: 'Balance', img: Sort },
    { width: isMobile ? '20%' : '15%', sort: 'lifetimeYield', name: 'Lifetime Yield', img: Sort },
    { width: isMobile ? '20%' : '15%', sort: 'totalRewardUsd', name: 'Rewards', img: Sort },
    { width: isMobile ? '12%' : '15%', sort: 'apy', name: 'Live APY', img: Sort },
  ]

  const TopBoxData = [
    {
      icon: Safe,
      content: 'Total Balance',
      price: totalDeposit,
      toolTipTitle: 'tt-total-balance',
      toolTip:
        "Sum of your wallet's staked and unstaked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.",
    },
    {
      icon: Safe,
      content: 'Lifetime Yield',
      price: totalNetProfit,
      toolTipTitle: 'tt-total-profit',
      toolTip: (
        <>
          This metric represents your wallet&apos;s total lifetime yield from Harvest, including
          both &apos;harvest&apos; events and claimed rewards.
          <br />
          <br />
          Note: Yield from Liquidity Provision activities is not included in this metric or its
          associated chart.
        </>
      ),
    },
    {
      icon: Diamond,
      content: 'Claimable Rewards',
      price: totalRewards,
      toolTipTitle: 'tt-rewards',
      toolTip:
        'Accrued rewards on all your staked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.',
    },
    {
      icon: Coin1,
      content: 'Monthly Yield Forecast',
      price: totalYieldMonthly,
      toolTipTitle: 'tt-monthly-yield',
      toolTip:
        'Estimated monthly yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.',
    },
    {
      icon: Coin2,
      content: 'Daily Yield Forecast',
      price: totalYieldDaily,
      toolTipTitle: 'tt-daily-yield',
      toolTip:
        'Estimated daily yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.',
    },
  ]

  const MobileTopBoxData = [
    {
      icon: Safe,
      content: 'Balance',
      price: totalDeposit,
      toolTipTitle: 'tt-total-balance',
      toolTip:
        "Sum of your wallet's staked and unstaked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.",
    },
    {
      icon: Diamond,
      content: 'Rewards',
      price: totalRewards,
      toolTipTitle: 'tt-rewards',
      toolTip:
        'Accrued rewards on all your staked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.',
    },
    {
      icon: Safe,
      content: 'Yearly Forecast',
      price: totalYieldYearly,
      toolTipTitle: 'tt-yearly-yield',
      toolTip:
        'Estimated yearly yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens.',
    },
  ]

  return (
    <Container bgColor={bgColorNew} fontColor={fontColor}>
      <Inner>
        <HeaderWrap backImg={MobileBackImage} padding="25px" borderColor={borderColorBox}>
          {!isMobile && (
            <HeaderTitle fontColor={fontColor} fontColor1={fontColor1}>
              <div className="title">Overview</div>
              <div className="desc">Displaying data from across all networks.</div>
            </HeaderTitle>
          )}
          {isMobile && (
            <MobileHeader>
              <HeaderTop>
                <LogoDiv>
                  <img src={PhoneLogo} alt="harvest logo" />
                  <div style={{ marginLeft: '10px', fontWeight: '700', fontSize: '16px' }}>
                    Harvest
                  </div>
                </LogoDiv>
                {connected && (
                  <LogoDiv bgColor="#F8F8F8" borderRadius="16px" padding="3px 8px">
                    <img src={ConnectSuccessIcon} alt="connect success" width={6} height={6} />
                    <Address>{showAddress ? formatAddress(account) : '**********'}</Address>
                    <div
                      onClick={handleToggle(setShowAddress)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggle(setShowAddress)
                        }
                      }}
                      style={{ cursor: 'pointer', alignItems: 'center', display: 'flex' }}
                      aria-label="Toggle address visibility"
                      role="button"
                      tabIndex="0"
                    >
                      <img
                        src={showAddress ? Eye : ClosedEye}
                        alt="Toggle address visibility"
                        style={{ marginLeft: '5px' }}
                      />
                    </div>
                  </LogoDiv>
                )}
              </HeaderTop>
              <LifetimeValue
                isLoading={isLoading}
                noFarm={noFarm}
                connected={connected}
                color={fontColor1}
              >
                {!connected || noFarm ? (
                  `${currencySym}0.00`
                ) : isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    style={{ width: '2rem', height: '2rem' }}
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  showUsdValueCurrency(totalNetProfit, currencySym, currencyRate)
                )}
              </LifetimeValue>
              <LifetimeSub color={fontColor1}>
                Lifetime Yield
                <GreenBox>
                  <IoArrowUpCircleOutline color="#5dcf46" fontSize={14} />
                  {!connected || noFarm
                    ? `${currencySym}0.00`
                    : oneDayYield === 0
                    ? `${currencySym}0.00`
                    : oneDayYield * currencyRate >= 0.01
                    ? `${currencySym}${formatNumber(oneDayYield * currencyRate)} (24h)`
                    : `<${currencySym}0.01 (24h)`}
                </GreenBox>
              </LifetimeSub>
            </MobileHeader>
          )}
          <HeaderButton>
            {!isMobile && (
              <Dropdown>
                <CurrencyDropDown
                  id="dropdown-basic"
                  bgcolor={bgColorNew}
                  fontcolor2={fontColor2}
                  hovercolor={hoverColorNew}
                  style={{ padding: 0 }}
                >
                  {curCurrency ? (
                    <CurrencySelect
                      backColor={backColor}
                      fontcolor2={fontColor2}
                      hovercolor={hoverColor}
                    >
                      <img
                        className={darkMode ? 'logo-dark' : 'logo'}
                        src={curCurrency.imgPath}
                        width={16}
                        height={16}
                        alt=""
                      />
                      <span>{curCurrency.symbol}</span>
                      <img className="dropdown-icon" src={DropDownIcon} alt="" />
                    </CurrencySelect>
                  ) : (
                    <></>
                  )}
                </CurrencyDropDown>
                {!isSpecialApp ? (
                  <CurrencyDropDownMenu backcolor={bgColorNew}>
                    {supportedCurrencies.map(elem => {
                      return (
                        <CurrencyDropDownItem
                          onClick={() => {
                            updateCurrency(elem.id)
                          }}
                          fontcolor={fontColor}
                          filtercolor={filterColor}
                          hovercolor={hoverColorNew}
                          key={elem.id}
                        >
                          <img
                            className={darkMode ? 'logo-dark' : 'logo'}
                            src={elem.imgPath}
                            width={14}
                            height={14}
                            alt=""
                          />
                          <span>{elem.symbol}</span>
                          {curCurrency.id === elem.id ? (
                            <IoCheckmark className="check-icon" />
                          ) : (
                            <></>
                          )}
                        </CurrencyDropDownItem>
                      )
                    })}
                  </CurrencyDropDownMenu>
                ) : (
                  <></>
                )}
              </Dropdown>
            )}
          </HeaderButton>
        </HeaderWrap>

        <div>
          <ChartSection>
            <ChartBox
              align="flex-start"
              direction="row"
              fontColor={fontColor}
              backColor={backColor}
              borderColor={borderColor}
            >
              <LifetimeYieldData noFarm={noFarm} totalHistoryData={totalHistoryData} />
            </ChartBox>
            {!isMobile && (
              <YieldTable display={showLatestYield ? 'block' : 'none'}>
                <div className="table-title">Latest Yield</div>
                <EarningsHistoryLatest
                  historyData={totalHistoryData}
                  noFarm={noFarm}
                  setOneDayYield={setOneDayYield}
                />
              </YieldTable>
            )}
          </ChartSection>
          <SubPart>
            {!isMobile
              ? TopBoxData.map((data, index) => (
                  <TotalValue
                    key={index}
                    icon={data.icon}
                    content={data.content}
                    price={data.price}
                    toolTipTitle={data.toolTipTitle}
                    toolTip={data.toolTip}
                    connected={connected}
                    isLoading={isLoading}
                    farmTokenListLength={farmTokenList.length}
                  />
                ))
              : MobileTopBoxData.map((data, index) => (
                  <TotalValue
                    key={index}
                    icon={data.icon}
                    content={data.content}
                    price={data.price}
                    toolTipTitle={data.toolTipTitle}
                    toolTip={data.toolTip}
                    connected={connected}
                    isLoading={isLoading}
                    farmTokenListLength={farmTokenList.length}
                  />
                ))}
          </SubPart>
        </div>

        <TableWrap fontColor1={fontColor1}>
          {isMobile && (
            <MobileSwitch darkMode={darkMode}>
              <SwitchBtn
                color={
                  darkMode
                    ? showLatestYield
                      ? '#fff'
                      : '#15191C'
                    : showLatestYield
                    ? '#15191C'
                    : '#fff'
                }
                backColor={showLatestYield ? 'unset' : '#5DCF46'}
                boxShadow={
                  showLatestYield
                    ? 'none'
                    : '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)'
                }
                onClick={() => setShowLatestYield(false)}
              >
                Positions
              </SwitchBtn>
              <SwitchBtn
                color={
                  darkMode
                    ? showLatestYield
                      ? '#15191C'
                      : '#fff'
                    : showLatestYield
                    ? '#fff'
                    : '#15191C'
                }
                backColor={showLatestYield ? '#5DCF46' : 'unset'}
                boxShadow={
                  showLatestYield
                    ? '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)'
                    : 'none'
                }
                onClick={() => setShowLatestYield(true)}
              >
                Latest Yield
              </SwitchBtn>
            </MobileSwitch>
          )}
          <PositionTable display={showLatestYield ? 'none' : 'block'}>
            <div className="table-title">Positions</div>
            <TransactionDetails>
              <TableContent count={farmTokenList.length}>
                <Header borderColor={borderColorBox} backColor={bgColorNew}>
                  {positionHeader.map((data, index) => (
                    <Column key={index} width={data.width} color={fontColor}>
                      <Col
                        onClick={() => {
                          sortCol(data.sort)
                        }}
                      >
                        {data.name}
                      </Col>
                    </Column>
                  ))}
                </Header>
                {connected && farmTokenList.length > 0 ? (
                  <ContentBox borderColor={borderColorBox}>
                    {showInactiveFarms
                      ? farmTokenList.map((el, i) => {
                          const info = farmTokenList[i]
                          let lifetimeYield = -1
                          if (vaultNetChangeList.length > 0) {
                            let found = false
                            vaultNetChangeList.some(item => {
                              if (
                                (item.id === FARM_TOKEN_SYMBOL && item.id === info.symbol) ||
                                item.id === info.token?.pool?.id ||
                                (info.token?.isIPORVault && item.id === info.token?.id)
                              ) {
                                lifetimeYield = item.sumNetChangeUsd
                                found = true
                                return true
                              }
                              return false
                            })
                            if (!found) {
                              lifetimeYield = 0
                            }
                          }
                          return (
                            <VaultRow
                              key={i}
                              info={info}
                              lifetimeYield={lifetimeYield}
                              lastElement={i === farmTokenList.length - 1 ? 'yes' : 'no'}
                              cKey={i}
                              darkMode={darkMode}
                            />
                          )
                        })
                      : filteredFarmList.map((el, i) => {
                          const info = filteredFarmList[i]
                          let lifetimeYield = -1
                          if (vaultNetChangeList.length > 0) {
                            let found = false
                            vaultNetChangeList.some(item => {
                              if (
                                (item.id === FARM_TOKEN_SYMBOL && item.id === info.symbol) ||
                                item.id === info.token?.pool?.id ||
                                (info.token?.isIPORVault && item.id === info.token?.id)
                              ) {
                                lifetimeYield = item.sumNetChangeUsd
                                found = true
                                return true
                              }
                              return false
                            })
                            if (!found) {
                              lifetimeYield = 0
                            }
                          }
                          return (
                            <VaultRow
                              key={i}
                              info={info}
                              lifetimeYield={lifetimeYield}
                              lastElement={i === filteredFarmList.length - 1 ? 'yes' : 'no'}
                              cKey={i}
                              darkMode={darkMode}
                            />
                          )
                        })}
                  </ContentBox>
                ) : connected ? (
                  !noFarm ? (
                    <SkeletonLoader isPosition="true" />
                  ) : (
                    <EmptyPanel borderColor={borderColorBox} height="400px">
                      <EmptyInfo
                        height="100%"
                        weight={500}
                        size={14}
                        lineHeight={20}
                        flexFlow="column"
                        color={fontColor}
                        gap="0px"
                      >
                        <div>
                          Looks like you are not farming anywhere. Let&apos;s put your assets to
                          work!
                        </div>
                        <ExploreButtonStyle
                          onClick={() => {
                            push(ROUTES.ADVANCED)
                          }}
                          minWidth="190px"
                          inputBorderColor={inputBorderColor}
                          bordercolor={fontColor}
                          disabled={disableWallet}
                          backColor={btnColor}
                          hoverColor={btnHoverColor}
                        >
                          <img src={AdvancedImg} className="explore-farms" alt="" />
                          Explore Farms
                        </ExploreButtonStyle>
                      </EmptyInfo>
                    </EmptyPanel>
                  )
                ) : (
                  <EmptyPanel borderColor={borderColorBox} height="400px">
                    <EmptyInfo height="100%" flexFlow="column" gap="0px">
                      <EmptyInfo weight={500} size={14} lineHeight={20} color={fontColor}>
                        Connect wallet to see your positions.
                      </EmptyInfo>
                      <ConnectButtonStyle
                        onClick={() => {
                          connectAction()
                        }}
                        minWidth="190px"
                        inputBorderColor={inputBorderColor}
                        bordercolor={fontColor}
                        disabled={disableWallet}
                        hoverColor={btnHoverColor}
                        backColor={btnColor}
                      >
                        Connect
                      </ConnectButtonStyle>
                    </EmptyInfo>
                  </EmptyPanel>
                )}
              </TableContent>
            </TransactionDetails>
          </PositionTable>
          {isMobile && (
            <YieldTable display={showLatestYield ? 'block' : 'none'}>
              <div className="table-title">Latest Yield</div>
              <EarningsHistoryLatest
                historyData={totalHistoryData}
                isDashboard="true"
                noData={noFarm}
                setOneDayYield={setOneDayYield}
                isLoading={isLoading}
              />
            </YieldTable>
          )}
        </TableWrap>
      </Inner>
    </Container>
  )
}

export default Portfolio
