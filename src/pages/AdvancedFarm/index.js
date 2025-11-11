import BigNumber from 'bignumber.js'
import { find, get, isEqual, isArray, isNaN } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Tooltip } from 'react-tooltip'
import { RxCross2 } from 'react-icons/rx'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { isAddress } from 'ethers'
import { BiLeftArrowAlt, BiInfoCircle } from 'react-icons/bi'
import { PiQuestion } from 'react-icons/pi'
import tokenMethods from '../../services/viem/contracts/token/methods'
import tokenContract from '../../services/viem/contracts/token/contract.json'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import ZKSYNC from '../../assets/images/chains/zksync.svg'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import Diamond from '../../assets/images/logos/beginners/diamond.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
import History from '../../assets/images/logos/beginners/history.svg'
import Benchmark from '../../assets/images/logos/beginners/benchmark.svg'
import TickIcon from '../../assets/images/logos/tick-icon.svg'
import TickCross from '../../assets/images/logos/tick-cross.svg'
import BaseAutopilotUSDC from '../../assets/images/logos/advancedfarm/BaseAutopilotUSDC.svg'
import BaseAutopilotcbBTC from '../../assets/images/logos/advancedfarm/BaseAutopilotcbBTC.svg'
import BaseAutopilotwETH from '../../assets/images/logos/advancedfarm/BaseAutopilotwETH.svg'
import MorphoIcon from '../../assets/images/ui/morpho.svg'
import AnimatedDots from '../../components/AnimatedDots'
import DepositBase from '../../components/AdvancedFarmComponents/Deposit/DepositBase'
import DepositSelectToken from '../../components/AdvancedFarmComponents/Deposit/DepositSelectToken'
import DepositStart from '../../components/AdvancedFarmComponents/Deposit/DepositStart'
import WithdrawBase from '../../components/AdvancedFarmComponents/Withdraw/WithdrawBase'
import WithdrawSelectToken from '../../components/AdvancedFarmComponents/Withdraw/WithdrawSelectToken'
import WithdrawStart from '../../components/AdvancedFarmComponents/Withdraw/WithdrawStart'
import FarmDetailChart from '../../components/DetailChart/FarmDetailChart'
import UserBalanceData from '../../components/UserBalanceChart/UserBalanceData'
import SharePricesData from '../../components/SharePricesChart/SharePricesData'
import AOTData from '../../components/AOTChart/AOTData'
import PerformanceChart from '../../components/PerformanceChart/PerformanceChart'
import VaultPanelActionsFooter from '../../components/AdvancedFarmComponents/Rewards/VaultPanelActionsFooter'
import StakeBase from '../../components/AdvancedFarmComponents/Stake/StakeBase'
import StakeStart from '../../components/AdvancedFarmComponents/Stake/StakeStart'
import StakeResult from '../../components/AdvancedFarmComponents/Stake/StakeResult'
import UnstakeBase from '../../components/AdvancedFarmComponents/Unstake/UnstakeBase'
import UnstakeStart from '../../components/AdvancedFarmComponents/Unstake/UnstakeStart'
import UnstakeResult from '../../components/AdvancedFarmComponents/Unstake/UnstakeResult'
import EarningsHistory from '../../components/EarningsHistory/HistoryData'
import RewardsHistory from '../../components/RewardsHistory/RewardsData'
import {
  DECIMAL_PRECISION,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  ROUTES,
  USD_BALANCES_DECIMALS,
  POOL_BALANCES_DECIMALS,
  MAX_DECIMALS,
  feeList,
  chainList,
  historyTags,
} from '../../constants'
import { fromWei, newContractInstance, getViem } from '../../services/viem'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { useRate } from '../../providers/Rate'
import {
  displayAPY,
  formatFrequency,
  formatNumber,
  formatNumberWido,
  showTokenBalance,
  showUsdValue,
  showUsdValueCurrency,
} from '../../utilities/formats'
import {
  getChainName,
  handleToggle,
  getChainNamePortals,
  generateColor,
} from '../../utilities/parsers'
import { getAdvancedRewardText } from '../../utilities/html'
import {
  getCoinListFromApi,
  getLastHarvestInfo,
  getTokenPriceFromApi,
  initBalanceAndDetailData,
  getIPORLastHarvestInfo,
} from '../../utilities/apiCalls'
import {
  BackBtnRect,
  BackText,
  BigDiv,
  DetailView,
  FlexDiv,
  FlexTopDiv,
  HalfContent,
  Inner,
  TopInner,
  TopButton,
  LogoImg,
  NewLabel,
  RestContent,
  TopDesc,
  TopLogo,
  TopPart,
  MyBalance,
  TotalRewardBox,
  GuideSection,
  GuidePart,
  DepositSection,
  WithdrawSection,
  MainSection,
  ChainBack,
  MainTag,
  InternalSection,
  WelcomeBox,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
  WelcomeBottom,
  WelcomeKnow,
  WelcomeTicket,
  WelcomeClose,
  HalfInfo,
  LastHarvestInfo,
  RestInternal,
  RestInternalBenchmark,
  StakeSection,
  UnstakeSection,
  MainTagPanel,
  FirstPartSection,
  SecondPartSection,
  TabRow,
  MobileChain,
  NetDetail,
  NetDetailItem,
  BoxCover,
  ManageBoxWrapper,
  EarningsBadge,
  ValueBox,
  BoxTitle,
  BoxValue,
  NetDetailTitle,
  NetDetailContent,
  NetDetailImg,
  RewardValue,
  ThemeMode,
  SwitchMode,
  Tip,
  IconPart,
  TipTop,
  CrossDiv,
  SwitchTabTag,
  MorphoBadge,
  BadgeRow,
} from './style'
import { CHAIN_IDS } from '../../data/constants'
import { usePortals } from '../../providers/Portals'
import SourceOfYield from '../../components/AdvancedFarmComponents/SourceOfYield'
import TopBadge from '../../components/AdvancedFarmComponents/TopBadge'

const AdvancedFarm = () => {
  const {
    darkMode,
    backColor,
    bgColorNew,
    borderColor,
    borderColorBox,
    bgColorTooltip,
    fontColorTooltip,
    fontColor,
    fontColor1,
    fontColor2,
    fontColor3,
    fontColor4,
    linkColorTooltip,
    linkColorOnHover,
    activeColorNew,
    boxShadowColor2,
  } = useThemeContext()

  const { paramAddress } = useParams()
  const { getPortalsBaseTokens, getPortalsBalances, getPortalsSupport, SUPPORTED_TOKEN_LIST } =
    usePortals()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const isSmallScreen = useMediaQuery({ query: '(max-width: 1200px)' })

  const navigate = useNavigate()
  const history = useNavigate()

  const { pathname } = useLocation()
  const location = useLocation()
  const isFromEarningPage = location.search.includes('from=portfolio')

  const { vaultsData, loadingVaults, allVaultsData } = useVaults()
  const { pools, userStats, fetchUserPoolStats } = usePools()
  const { connected, account, balances, getWalletBalances } = useWallet()

  const { tokens } = require('../../data')

  const [apiData, setApiData] = useState([])
  const [chartData, setChartData] = useState([])

  // Switch Tag (Convert/Revert)
  const [activeDepo, setActiveDepo] = useState(true)
  const [showLatestEarnings, setShowLatestEarnings] = useState(false)
  const [showApyHistory, setShowApyHistory] = useState(true)
  const [showIFARMInfo, setShowIFARMInfo] = useState(false)
  const [showSiloUSDCInfo, setShowSiloUSDCInfo] = useState(true)
  const [supportedVault, setSupportedVault] = useState(false)
  const [hasPortalsError, setHasPortalsError] = useState(true)
  const [badgeId, setBadgeId] = useState(-1)

  // Deposit
  const [depositStart, setDepositStart] = useState(false)
  const [selectTokenDepo, setSelectTokenDepo] = useState(false)
  const [balanceDepo, setBalanceDepo] = useState('0')
  const [pickedTokenDepo, setPickedTokenDepo] = useState({ symbol: 'Select Token' })
  const [inputAmountDepo, setInputAmountDepo] = useState('')
  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')
  const [minReceiveAmountString, setMinReceiveAmountString] = useState('')
  const [minReceiveUsdAmount, setMinReceiveUsdAmount] = useState('')
  const [convertSuccess, setConvertSuccess] = useState(false)
  const [hasErrorOccurredConvert, setHasErrorOccurredConvert] = useState(0)
  const [failureCountConvert, setFailureCountConvert] = useState(0)
  const [fromTokenList, setFromTokenList] = useState(false)

  // Withdraw
  const [withdrawStart, setWithdrawStart] = useState(false)
  const [selectTokenWith, setSelectTokenWith] = useState(false)
  const [unstakeBalance, setUnstakeBalance] = useState('0')
  const [pickedTokenWith, setPickedTokenWith] = useState({ symbol: 'Select' })
  const [unstakeInputValue, setUnstakeInputValue] = useState('')
  const [revertFromInfoAmount, setRevertFromInfoAmount] = useState('')
  const [revertFromInfoUsdAmount, setRevertFromInfoUsdAmount] = useState('')
  const [revertMinReceivedAmount, setRevertMinReceivedAmount] = useState('')
  const [revertMinReceivedUsdAmount, setRevertMinReceivedUsdAmount] = useState('')
  const [revertSuccess, setRevertSuccess] = useState(false)
  const [hasErrorOccurredRevert, setHasErrorOccurredRevert] = useState(0)

  // Stake
  const [stakeStart, setStakeStart] = useState(false)
  const [inputAmountStake, setInputAmountStake] = useState('')
  const [stakeFinalStep, setStakeFinalStep] = useState(false)

  // Unstake
  const [unstakeStart, setUnstakeStart] = useState(false)
  const [inputAmountUnstake, setInputAmountUnstake] = useState('')
  const [unstakeFinalStep, setUnstakeFinalStep] = useState(false)
  const [amountsToExecuteUnstake, setAmountsToExecuteUnstake] = useState('')

  const [yieldDaily, setYieldDaily] = useState(0)
  const [yieldMonthly, setYieldMonthly] = useState(0)
  const [convertYearlyYieldUSD, setConvertYearlyYieldUSD] = useState('0')
  const [convertMonthlyYieldUSD, setConvertMonthlyYieldUSD] = useState('0')
  const [convertDailyYieldUSD, setConvertDailyYieldUSD] = useState('0')

  const [balanceList, setBalanceList] = useState([])
  const [supTokenList, setSupTokenList] = useState([])
  const [supTokenNoBalanceList, setSupTokenNoBalanceList] = useState([])
  const [defaultToken, setDefaultToken] = useState(null)
  const [soonToSupList, setSoonToSupList] = useState([])

  const [vaultValue, setVaultValue] = useState(null)
  const [loadingFarmingBalance, setFarmingLoading] = useState(false)
  const [loadingLpStats, setLpStatsloading] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const loaded = true
  const [lastHarvest, setLastHarvest] = useState('')
  const [activeStake, setActiveStake] = useState(true)

  const [totalValue, setTotalValue] = useState(0)
  const [depositedValueUSD, setDepositUsdValue] = useState(0)
  const [balanceAmount, setBalanceAmount] = useState(0)
  const [totalReward, setTotalReward] = useState(0)
  const [rewardTokenPrices, setRewardTokenPrices] = useState([])
  const [stakedAmount, setStakedAmount] = useState(0)
  const [unstakedAmount, setUnstakedAmount] = useState(0)
  const [underlyingEarnings, setUnderlyingEarnings] = useState(0)
  const [underlyingEarningsLatest, setUnderlyingEarningsLatest] = useState(0)
  const [usdEarnings, setUsdEarnings] = useState(0)
  const [usdEarningsLatest, setUsdEarningsLatest] = useState(0)

  // Chart & Table API data
  const [activeHarvests, setActiveHarvests] = useState(true)
  const [historyData, setHistoryData] = useState([])
  const [sevenDApy, setSevenDApy] = useState('')
  const [thirtyDApy, setThirtyDApy] = useState('')
  const [oneEightyDApy, setOneEightyDApy] = useState('')
  const [threeSixtyDApy, setThreeSixtyDApy] = useState('')
  const [lifetimeApy, setLifetimeApy] = useState('')
  const [vaultBirthday, setVaultBirthday] = useState('')
  const [vaultTotalPeriod, setVaultTotalPeriod] = useState('')
  const [latestSharePrice, setLatestSharePrice] = useState('')

  const [sevenDHarvest, setSevenDHarvest] = useState('')
  const [thirtyDHarvest, setThirtyDHarvest] = useState('')
  const [oneEightyDHarvest, setOneEightyDHarvest] = useState('')
  const [threeSixtyDHarvest, setThreeSixtyDHarvest] = useState('')
  const [harvestFrequency, setHarvestFrequency] = useState('')
  const [noRewardsData, setNoRewardsData] = useState(false)

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyName, setCurrencyName] = useState('USD')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [showTip, setShowTip] = useState(true)
  const [showRewardsTab, setShowRewardsTab] = useState(false)
  const [sharePricesData, setSharePricesData] = useState({})
  const [iporHvaultsLFAPY, setIPORHvaultsLFAPY] = useState({})

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyName(rates.currency.symbol)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    const getCoinList = async () => {
      const data = await getCoinListFromApi()
      setApiData(data)
    }

    getCoinList()
  }, [])

  const groupOfVaults = { ...vaultsData }
  const vaultsKey = Object.keys(groupOfVaults)

  const vaultIds = vaultsKey.filter(vaultId => {
    const tokenAddress = groupOfVaults[vaultId].tokenAddress || groupOfVaults[vaultId].vaultAddress

    if (typeof tokenAddress === 'string') {
      return (
        groupOfVaults[vaultId].vaultAddress.toLowerCase() === paramAddress.toLowerCase() ||
        tokenAddress.toLowerCase() === paramAddress.toLowerCase()
      )
    }

    if (typeof tokenAddress === 'object' && tokenAddress !== null) {
      const tokenAddresses = Object.values(tokenAddress)
      return (
        groupOfVaults[vaultId].vaultAddress.toLowerCase() === paramAddress.toLowerCase() ||
        tokenAddresses.some(address => address.toLowerCase() === paramAddress.toLowerCase())
      )
    }

    return false
  })
  const id = vaultIds[0]
  const token = groupOfVaults[id]
  const tokenSym = token.isIPORVault ? token.vaultSymbol : id
  const fTokenName = token.isIPORVault ? tokenSym : `f${tokenSym}`

  const { logoUrl } = token

  const vaultPool = find(pools, pool => pool.collateralAddress === get(token, `vaultAddress`))

  const estimatedApy = get(token, `estimatedApy`, 0)
  const rewardApy = get(vaultPool, 'totalRewardAPY', 0)
  const tradingApy = get(vaultPool, 'tradingApy', 0)
  const totalApy = Number(estimatedApy) + Number(rewardApy) + Number(tradingApy)

  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE, ZKSYNC]
  const tokenChain = token.chain || token.data.chain

  let chainName = getChainName(tokenChain).toLowerCase()
  if (chainName === 'ethereum') {
    chainName = 'eth'
  } else if (chainName === 'polygon') {
    chainName = 'matic'
  }

  useEffect(() => {
    const getBadge = () => {
      chainList.forEach((el, i) => {
        if (el.chainId === Number(tokenChain)) {
          setBadgeId(i)
        }
      })
    }
    getBadge()
  }, [tokenChain])

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  const multipleAssets = useMemo(
    () =>
      isArray(tokens[id].tokenAddress) &&
      tokens[id].tokenAddress.map(address => {
        const selectedSymbol = Object.keys(tokens).find(
          symbol =>
            !isArray(tokens[symbol].tokenAddress) &&
            tokens[symbol].tokenAddress.toLowerCase() === address.toLowerCase(),
        )
        return selectedSymbol
      }),
    [id, tokens],
  )

  const tokenDecimals = token.decimals || tokens[id].decimals

  const lpTokenBalance = token.id
    ? get(userStats, `[${token.id}]['lpTokenBalance']`, 0)
    : get(userStats, `[${vaultPool.id}]['lpTokenBalance']`, 0)
  const totalStaked = token.id
    ? get(userStats, `[${token.id}]['totalStaked']`, 0)
    : get(userStats, `[${vaultPool.id}]['totalStaked']`, 0)
  const lpTokenApprovedBalance = token.id
    ? 0
    : get(userStats, `[${vaultPool.id}]['lpTokenApprovedBalance']`, 0)

  const tempPricePerFullShare = get(token, `pricePerFullShare`, 0)
  const pricePerFullShare = fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals)

  const usdPrice =
    Number(token.vaultPrice) || Number(token.usdPrice) * Number(pricePerFullShare) || 0
  const underlyingPrice = get(token, 'usdPrice', 0)

  const mainTags = [
    { name: 'Manage', img: Safe },
    { name: 'Rewards', img: Diamond },
    { name: 'Details', img: BarChart },
    { name: 'History', img: History },
    { name: 'Benchmark', img: Benchmark },
  ]

  // Show vault info badge when platform is 'Seamless' or 'Harvest' and first visit
  useEffect(() => {
    const firstViewIFarm = localStorage.getItem('firstViewIFarm')

    if (token.id === IFARM_TOKEN_SYMBOL && (firstViewIFarm === null || firstViewIFarm === 'true')) {
      localStorage.setItem('firstViewIFarm', true)
      setShowIFARMInfo(true)
    }
  }, [token.id])

  const closeIFARMBadge = () => {
    setShowIFARMInfo(false)
    localStorage.setItem('firstViewIFarm', 'false')
  }

  const closeSiloUSDCBadge = () => {
    setShowSiloUSDCInfo(false)
    localStorage.setItem(`siloInfoClosed_${id}`, 'true')
  }

  useEffect(() => {
    if (id === 'silo_VM_USDC' || id === 'silo_sUSDX_USDC' || id === 'IPOR_USDC_arbitrum') {
      const siloInfoClosed = localStorage.getItem(`siloInfoClosed_${id}`)
      if (siloInfoClosed === 'true') {
        setShowSiloUSDCInfo(false)
      }
    }
  }, [id])

  useEffect(() => {
    async function fetchPortalsSupport() {
      const tokenAddress = token.vaultAddress || token.tokenAddress

      const portalsToken = await getPortalsSupport(tokenChain, tokenAddress)

      if (portalsToken === undefined || portalsToken.status !== 200) {
        setHasPortalsError(true)
      } else if (portalsToken.status === 200) {
        setHasPortalsError(false)
        if (portalsToken.data.totalItems === 0) {
          setSupportedVault(false)
        } else {
          setSupportedVault(true)
        }
      }
    }

    fetchPortalsSupport()
  }, [token, tokenChain])

  useEffect(() => {
    let staked, unstaked, total, amountBalanceUSD
    staked =
      totalStaked && fromWei(totalStaked, token.vaultDecimals || token.decimals, MAX_DECIMALS, true)

    unstaked =
      lpTokenBalance &&
      fromWei(lpTokenBalance, token.vaultDecimals || token.decimals, MAX_DECIMALS, true)

    total = Number(staked) + Number(unstaked)
    amountBalanceUSD = total * usdPrice * Number(currencyRate)
    setStakedAmount(Number(staked))
    setUnstakedAmount(Number(unstaked))
    setTotalValue(total)
    setBalanceAmount(amountBalanceUSD)

    const vaultAPRDaily = (1 + estimatedApy / 100) ** (1 / 365) - 1
    const vaultAPYMonthly = (1 + vaultAPRDaily) ** (365 / 12) - 1

    const totalRewardAPR = rewardApy / 100
    const poolAPRDaily = totalRewardAPR / 365
    const poolAPRMonthly = totalRewardAPR / 12

    const swapFeeAPRYearly = tradingApy / 100
    const swapFeeAPRDaily = swapFeeAPRYearly / 365
    const swapFeeAPRMonthly = swapFeeAPRYearly / 12

    const dailyYield =
      (Number(staked) * usdPrice * (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily) +
        Number(unstaked) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)) *
      Number(currencyRate)
    const monthlyYield =
      (Number(staked) * usdPrice * (vaultAPYMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
        Number(unstaked) * usdPrice * (vaultAPYMonthly + swapFeeAPRMonthly)) *
      Number(currencyRate)
    setYieldDaily(dailyYield)
    setYieldMonthly(monthlyYield)

    const convertMonthlyYieldValue =
      Number(minReceiveAmountString) *
      Number(usdPrice) *
      Number(currencyRate) *
      (vaultAPYMonthly + poolAPRMonthly + swapFeeAPRMonthly)
    const convertDailyYieldYieldValue =
      Number(minReceiveAmountString) *
      Number(usdPrice) *
      Number(currencyRate) *
      (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily)
    const convertYearlyYieldYieldValue =
      (Number(minReceiveAmountString) *
        Number(usdPrice) *
        Number(currencyRate) *
        (estimatedApy + totalRewardAPR + swapFeeAPRYearly)) /
      100
    setConvertMonthlyYieldUSD(convertMonthlyYieldValue.toString())
    setConvertDailyYieldUSD(convertDailyYieldYieldValue.toString())
    setConvertYearlyYieldUSD(convertYearlyYieldYieldValue.toString())
  }, [
    token,
    usdPrice,
    lpTokenBalance,
    totalStaked,
    minReceiveAmountString,
    currencyRate,
    estimatedApy,
    rewardApy,
    tradingApy,
  ])

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const getTokenBalance = async () => {
        try {
          if (tokenChain && account && Object.keys(balances).length !== 0) {
            if (!hasPortalsError) {
              let supList = [],
                directInSup = {},
                directInBalance = {}

              const [portalsRawBalances, portalsBaseTokens] = await Promise.all([
                getPortalsBalances(account, tokenChain.toString()),
                getPortalsBaseTokens(tokenChain.toString()),
              ])
              const curNoBalances = portalsBaseTokens
                .map(baseToken => {
                  const balToken = portalsRawBalances.find(
                    el => el.address.toLowerCase() === baseToken.address.toLowerCase(),
                  )
                  if (balToken === undefined) {
                    const item = {
                      symbol: baseToken.symbol,
                      address: baseToken.address,
                      balance: 0,
                      default: false,
                      usdValue: 0,
                      usdPrice: baseToken.price,
                      logoURI: baseToken.image
                        ? baseToken.image
                        : baseToken.images
                          ? baseToken.images[0]
                          : 'https://etherscan.io/images/main/empty-token.png',
                      decimals: baseToken.decimals,
                      chainId: tokenChain,
                    }
                    return item
                  }

                  return null
                })
                .filter(item => item !== null)

              const curBalances = portalsRawBalances
                .map(balance => {
                  if (!isAddress(balance.address))
                    balance.address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                  const item = {
                    symbol: balance.symbol,
                    address: balance.address,
                    balance: new BigNumber(balance.rawBalance)
                      .div(10 ** balance.decimals)
                      .toFixed(),
                    rawBalance: balance.rawBalance,
                    default: false,
                    usdValue: balance.balanceUSD,
                    usdPrice: balance.price,
                    logoURI:
                      balance.symbol === 'bAutopilot_wETH'
                        ? BaseAutopilotwETH
                        : balance.symbol === 'bAutopilot_USDC'
                          ? BaseAutopilotUSDC
                          : balance.symbol === 'bAutopilot_cbBTC'
                            ? BaseAutopilotcbBTC
                            : balance.image
                              ? balance.image
                              : balance.images
                                ? balance.images[0]
                                : 'https://etherscan.io/images/main/empty-token.png',
                    decimals: balance.decimals,
                    chainId: tokenChain,
                  }
                  return item
                })
                .filter(item => item.address)

              const tokenAddress = token.tokenAddress ? token.tokenAddress : token.vaultAddress

              const fTokenAddr = token.vaultAddress ? token.vaultAddress : token.tokenAddress
              const curSortedBalances = curBalances
                .sort(function reducer(a, b) {
                  return b.usdValue - a.usdValue
                })
                .filter(item => item.address.toLowerCase() !== fTokenAddr.toLowerCase())

              setBalanceList(curSortedBalances)

              supList = [...curBalances, ...curNoBalances]

              supList = supList.map(sup => {
                const supToken = curBalances.find(el => el.address === sup.address)
                if (supToken) {
                  sup.balance = supToken.balance
                  sup.usdValue = supToken.usdValue
                  sup.usdPrice = supToken.usdPrice
                } else {
                  sup.balance = '0'
                  sup.usdValue = '0'
                }
                sup.default = false

                if (Object.keys(directInSup).length === 0 && tokenAddress) {
                  if (sup.address.toLowerCase() === tokenAddress.toLowerCase()) {
                    directInSup = sup
                  }
                }
                return sup
              })

              supList = supList.sort(function reducer(a, b) {
                return b.usdValue - a.usdValue
              })
              const cl = curBalances.length
              for (let j = 0; j < cl; j += 1) {
                if (Object.keys(directInBalance).length === 0 && tokenAddress) {
                  if (curBalances[j].address.toLowerCase() === tokenAddress.toLowerCase()) {
                    directInBalance = curBalances[j]
                  }
                }
              }

              const directData = curBalances.find(
                el => el.address.toLowerCase() === tokenAddress.toLowerCase(),
              )

              const directBalance = directData
                ? directData.balance
                : id === IFARM_TOKEN_SYMBOL
                  ? new BigNumber(balances[FARM_TOKEN_SYMBOL]).div(10 ** token.decimals).toFixed()
                  : balances[id]
                    ? new BigNumber(balances[id]).div(10 ** token.decimals).toFixed()
                    : '0'
              const directUsdPrice = token.usdPrice
              const directUsdValue = new BigNumber(directBalance).times(directUsdPrice).toFixed()

              if (!(Object.keys(directInSup).length === 0 && directInSup.constructor === Object)) {
                directInSup.balance = directBalance
                directInSup.usdPrice =
                  directInSup.usdPrice > 0 ? directInSup.usdPrice : directUsdPrice
                directInSup.usdValue =
                  directInSup.usdValue > 0 ? directInSup.usdValue : directUsdValue
                supList = supList.sort(function result(x, y) {
                  return x === directInSup ? -1 : y === directInSup ? 1 : 0
                })
                supList[0].default = true
              } else if (
                !(
                  Object.keys(directInBalance).length === 0 &&
                  directInBalance.constructor === Object
                )
              ) {
                directInBalance.balance = directBalance || '0'
                directInBalance.usdPrice =
                  directInBalance.usdPrice > 0 ? directInBalance.usdPrice : directUsdPrice
                directInBalance.usdValue =
                  directInBalance.usdValue > 0 ? directInBalance.usdValue : directUsdValue
                supList.unshift(directInBalance)
                supList[0].default = true
              } else {
                const viemClient = await getViem(tokenChain, null)
                const { getSymbol } = tokenMethods
                const lpInstance = await newContractInstance(
                  id,
                  tokenAddress,
                  tokenContract.abi,
                  viemClient,
                )
                const lpSymbol = await getSymbol(lpInstance)
                const logoUri =
                  token.logoUrl && token.logoUrl.length > 1
                    ? 'https://etherscan.io/images/main/empty-token.png'
                    : token.logoUrl[0].substring(1)
                const direct = {
                  symbol: lpSymbol,
                  address: tokenAddress,
                  balance: directBalance || '0',
                  default: true,
                  usdPrice: directUsdPrice || '0',
                  usdValue: directUsdValue || '0',
                  logoURI: logoUri,
                  decimals: tokenDecimals,
                  chainId: parseInt(tokenChain, 0),
                }
                supList.unshift(direct)
              }

              if (supList[0].default) {
                if (supList[0].balance === '0' && balances[supList[0].symbol]) {
                  const defaultBalance = fromWei(
                    balances[supList[0].symbol],
                    supList[0].decimals,
                    supList[0].decimals,
                  )
                  const defaultUsdBalance = formatNumber(
                    Number(supList[0].usdPrice) * Number(defaultBalance),
                    2,
                  )
                  supList[0].balance = defaultBalance
                  supList[0].usdValue = defaultUsdBalance
                }
                setDefaultToken(supList[0])
              } else {
                setDefaultToken({})
              }
              // supList.shift()
              setSupTokenList(supList)

              const supNoBalanceList = [],
                sl = supList.length
              if (sl > 0) {
                for (let i = 0; i < sl; i += 1) {
                  if (Number(supList[i].balance) === 0) {
                    supNoBalanceList.push(supList[i])
                  }
                }
              }
              supNoBalanceList.shift()
              setSupTokenNoBalanceList(supNoBalanceList)

              setSoonToSupList({})
            } else {
              let tokenSymbol

              const decimals = token.decimals
              tokenSymbol = id === IFARM_TOKEN_SYMBOL ? FARM_TOKEN_SYMBOL : id
              if (tokenSymbol && tokenSymbol.substring(0, 1) === 'f') {
                tokenSymbol = tokenSymbol.substring(1)
              }

              const tokenAddress = token.tokenAddress
              const tokenBalance = fromWei(
                balances[id === IFARM_TOKEN_SYMBOL ? FARM_TOKEN_SYMBOL : id] || '0',
                decimals,
                decimals,
              )
              const tokenPrice = token.usdPrice
              const usdValue = formatNumberWido(
                Number(tokenBalance) * Number(tokenPrice),
                USD_BALANCES_DECIMALS,
              )
              const logoURI =
                token.logoUrl.length === 1
                  ? token.logoUrl[0].substring(1)
                  : 'https://etherscan.io/images/main/empty-token.png'

              const defaultTokenData = {
                symbol: tokenSymbol,
                address: tokenAddress,
                balance: tokenBalance,
                default: true,
                usdValue,
                usdPrice: tokenPrice,
                logoURI,
                decimals,
                chainId: tokenChain,
              }
              setDefaultToken(defaultTokenData)
            }
          }
        } catch (err) {
          console.log('getTokenBalance: ', err)
        }
      }
      console.debug('convert status', convertSuccess)
      console.debug('revert status', revertSuccess)
      getTokenBalance()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [
    account,
    tokenChain,
    balances,
    hasPortalsError,
    convertSuccess,
    revertSuccess,
    getPortalsBalances,
    getPortalsBaseTokens,
    id,
    token,
    tokenDecimals,
  ])

  // To calculate Est. values again when input token is changed
  useEffect(() => {
    setFailureCountConvert(0)
  }, [pickedTokenDepo])

  useEffect(() => {
    if (sharePricesData && token.isIPORVault) {
      let avgAPYData = {}
      Object.keys(sharePricesData).forEach(key => {
        if (sharePricesData[key]) {
          const priceData = sharePricesData[key]
          const firstItem = priceData.find(item => Number(item.sharePrice) <= 1)
          const startTime = firstItem
            ? Number(firstItem.timestamp)
            : priceData[priceData.length - 1].timestamp

          const totalPeriodBasedOnApy =
            (Number(priceData[0].timestamp) - startTime) / (24 * 3600) + 1

          const sharePriceVal = priceData[0].sharePrice ?? 1
          const lifetimeApyValue = (
            ((sharePriceVal - 1) / (totalPeriodBasedOnApy / 365)) *
            100
          ).toFixed(2)

          avgAPYData[key] = lifetimeApyValue
        }
      })
      const sortedEntries = Object.entries(avgAPYData).sort(
        ([, a], [, b]) => parseFloat(b) - parseFloat(a),
      )

      avgAPYData = Object.fromEntries(sortedEntries)
      setIPORHvaultsLFAPY(avgAPYData)
    }
  }, [sharePricesData, token])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (defaultToken !== null) {
        let tokenToSet = null

        setPickedTokenWith(defaultToken)

        // Check if defaultToken is present in the balanceList
        if (defaultToken.balance !== '0' || !supportedVault || hasPortalsError) {
          if (!fromTokenList) {
            setPickedTokenDepo(defaultToken)
            setBalanceDepo(defaultToken.balance)
            return
          }
        }

        // If defaultToken is not found, find the token with the highest USD value among those in the SUPPORTED_TOKEN_LIST and balanceList
        const supportedTokens = balanceList.filter(
          balancedToken => SUPPORTED_TOKEN_LIST[tokenChain][balancedToken.symbol],
        )
        if (supportedTokens.length > 0) {
          tokenToSet = supportedTokens.reduce((prevToken, currentToken) =>
            prevToken.usdValue > currentToken.usdValue ? prevToken : currentToken,
          )
        }

        // If no token is found in SUPPORTED_TOKEN_LIST, set the token with the highest USD value in balanceList
        if (!tokenToSet && balanceList.length > 0) {
          tokenToSet = balanceList.reduce(
            (prevToken, currentToken) =>
              prevToken.usdValue > currentToken.usdValue ? prevToken : currentToken,
            balanceList[0], // Providing the first element as the initial value
          )
        }

        // Set the pickedTokenDepo and balanceDepo based on the determined tokenToSet
        if (tokenToSet) {
          if (!fromTokenList) {
            setPickedTokenDepo(tokenToSet)
            setBalanceDepo(
              fromWei(
                tokenToSet.rawBalance ? tokenToSet.rawBalance : 0,
                tokenToSet.decimals,
                tokenToSet.decimals,
              ),
            )
          }
        }
      } else if (supTokenList.length !== 0) {
        if (!fromTokenList) {
          setPickedTokenDepo(supTokenList.find(coin => coin.symbol === 'USDC'))
          setBalanceDepo('0')
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [
    balanceList,
    supTokenList,
    defaultToken,
    tokenChain,
    SUPPORTED_TOKEN_LIST,
    supportedVault,
    hasPortalsError,
    fromTokenList,
  ])

  const firstUserPoolsLoad = useRef(true)
  const firstWalletBalanceLoad = useRef(true)

  const totalRewardsEarned = get(userStats, `[${vaultPool?.id}]['totalRewardsEarned']`, 0)
  const rewardsEarned = get(userStats, `[${vaultPool?.id}]['rewardsEarned']`, 0)

  const rewardTokenSymbols = get(vaultPool, 'rewardTokenSymbols', [])

  useEffect(() => {
    if ((vaultPool && rewardApy) || totalStaked || totalRewardsEarned) {
      if (rewardApy > 0 || totalStaked > 0 || totalRewardsEarned > 0) {
        setShowRewardsTab(true)
      } else {
        setShowRewardsTab(false)
      }
    }
  }, [vaultPool, rewardApy, totalStaked, totalRewardsEarned])

  useEffect(() => {
    const fetchTokenPrices = async () => {
      const usdPrices = [],
        rl = rewardTokenSymbols.length

      for (let l = 0; l < rl; l += 1) {
        let usdRewardPrice = 0,
          rewardToken
        const rewardSymbol = rewardTokenSymbols[l].toUpperCase()

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
        } else if (rewardSymbol === FARM_TOKEN_SYMBOL) {
          rewardToken = groupOfVaults[IFARM_TOKEN_SYMBOL]
        } else {
          rewardToken = groupOfVaults[rewardSymbol]
        }

        if (rewardToken) {
          const usdUnderlyingRewardPrice = rewardToken.usdPrice || 0
          const pricePerFullShareInVault =
            rewardSymbol === FARM_TOKEN_SYMBOL
              ? new BigNumber(1e18).toFixed()
              : rewardToken.pricePerFullShare
          const decimalsInVault = rewardToken.decimals || 18
          usdRewardPrice =
            Number(usdUnderlyingRewardPrice) *
            fromWei(pricePerFullShareInVault, decimalsInVault, decimalsInVault, true)
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
                    : rewardSymbol === 'GENOME'
                      ? tempSymbol.toLowerCase() === 'genome'
                      : rewardSymbol.toLowerCase() === tempSymbol.toLowerCase()
              ) {
                usdRewardPrice = await getTokenPriceFromApi(tempData.id)
                break
              }
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }
        usdPrices.push(usdRewardPrice)
        setRewardTokenPrices(usdPrices)
      }
    }

    fetchTokenPrices()
  }, [apiData, vaultPool, rewardTokenSymbols])

  useEffect(() => {
    const calculateTotalReward = () => {
      let totalRewardSum = 0
      const rl = rewardTokenSymbols.length
      for (let l = 0; l < rl; l += 1) {
        const rewardDecimal = get(tokens[rewardTokenSymbols[l]], 'decimals', 18)

        const totalRewardUsd =
          rl === 1
            ? Number(
                totalRewardsEarned === undefined
                  ? 0
                  : fromWei(totalRewardsEarned, rewardDecimal, rewardDecimal, true) *
                      Number(rewardTokenPrices[l]),
              )
            : Number(
                rewardsEarned === undefined
                  ? 0
                  : fromWei(
                      get(rewardsEarned, rewardTokenSymbols[l], 0),
                      rewardDecimal,
                      rewardDecimal,
                      true,
                    ) * Number(rewardTokenPrices[l]),
              )

        totalRewardSum += totalRewardUsd
      }
      setTotalReward(totalRewardSum * currencyRate)
    }

    calculateTotalReward()
  }, [
    account,
    userStats,
    vaultPool,
    rewardsEarned,
    totalRewardsEarned,
    rewardTokenSymbols,
    currencyRate,
  ])

  useEffectWithPrevious(
    ([prevAccount, prevUserStats, prevBalances]) => {
      const hasSwitchedAccount = account !== prevAccount && account

      if (
        hasSwitchedAccount ||
        firstUserPoolsLoad.current ||
        (userStats && !isEqual(userStats, prevUserStats))
      ) {
        const loadUserPoolsStats = async () => {
          firstUserPoolsLoad.current = false
          const poolsToLoad = [vaultPool]
          await fetchUserPoolStats(poolsToLoad, account, userStats)
        }
        loadUserPoolsStats()
      }

      if (
        hasSwitchedAccount ||
        firstWalletBalanceLoad.current ||
        (balances && !isEqual(balances, prevBalances))
      ) {
        const getBalance = async () => {
          firstWalletBalanceLoad.current = false
          await getWalletBalances([IFARM_TOKEN_SYMBOL, FARM_TOKEN_SYMBOL, id], false, true)
        }

        getBalance()
      }
    },
    [account, userStats, balances],
  )

  // Deposit / Stake / Details
  const [activeMainTag, setActiveMainTag] = useState(0)

  const curUrl = document.location.href
  useEffect(() => {
    if (curUrl.includes('#rewards')) {
      setActiveMainTag(1)
    } else if (curUrl.includes('#details')) {
      setActiveMainTag(2)
    } else if (curUrl.includes('#history')) {
      setActiveMainTag(3)
    } else if (curUrl.includes('#benchmark')) {
      setActiveMainTag(4)
    }
  }, [curUrl])

  useEffect(() => {
    const getLastHarvest = async () => {
      const value = token.isIPORVault
        ? await getIPORLastHarvestInfo(paramAddress.toLowerCase(), tokenChain)
        : await getLastHarvestInfo(paramAddress, tokenChain)
      setLastHarvest(value)
    }

    getLastHarvest()
  }, [paramAddress, tokenChain, token.isIPORVault])

  useEffect(() => {
    setVaultValue(new BigNumber(get(token, 'totalValueLocked', 0)))
  }, [token])

  useEffect(() => {
    const depositUsdValue = formatNumber(
      fromWei(lpTokenBalance, token.decimals, POOL_BALANCES_DECIMALS, true) * usdPrice,
      POOL_BALANCES_DECIMALS,
    )
    setDepositUsdValue(depositUsdValue)
  }, [lpTokenBalance, token.decimals, usdPrice])

  useEffect(() => {
    const initData = async () => {
      if (account && token && id) {
        const address = token.vaultAddress
        const iporVFlag = token.isIPORVault ?? false
        const {
          bFlag,
          vHFlag,
          sumNetChange,
          sumNetChangeUsd,
          sumLatestNetChange,
          sumLatestNetChangeUsd,
          enrichedData,
          uniqueVaultHData,
        } = await initBalanceAndDetailData(
          address,
          tokenChain,
          account,
          token.decimals,
          iporVFlag,
          token.vaultDecimals,
        )

        if (bFlag && vHFlag && !loadingVaults) {
          setUnderlyingEarnings(sumNetChange)
          setUsdEarnings(sumNetChangeUsd)
          setUnderlyingEarningsLatest(sumLatestNetChange)
          setUsdEarningsLatest(sumLatestNetChangeUsd)
          const enrichedDataWithSymbol = enrichedData.map(data => ({
            ...data,
            tokenSymbol: tokenSym,
          }))
          setHistoryData(enrichedDataWithSymbol)
          setChartData(uniqueVaultHData)
        }
        if (token.isIPORVault && vHFlag && !loadingVaults) {
          setChartData(uniqueVaultHData)
        }
      }
    }

    initData()
  }, [account, loadingVaults])

  const apyDaily = totalApy
    ? (((Number(totalApy) / 100 + 1) ** (1 / 365) - 1) * 100).toFixed(3)
    : null

  const showAPY = () => {
    return (
      <>
        {totalApy !== null && !loadingVaults ? (
          <div>
            {token?.inactive || token?.testInactive || !token?.dataFetched ? (
              token?.inactive || token?.testInactive ? (
                'Inactive'
              ) : null
            ) : (
              <>{displayAPY(totalApy, DECIMAL_PRECISION, 10)}</>
            )}
          </div>
        ) : (
          <div>
            <AnimatedDots />
          </div>
        )}
      </>
    )
  }

  const showTVL = () => {
    return (
      <>
        {vaultValue ? (
          <>{`${currencySym}${formatNumber(Number(vaultValue) * Number(currencyRate), 2)}`}</>
        ) : (
          <AnimatedDots />
        )}
      </>
    )
  }

  const showApyDaily = () => {
    return (
      <>
        {apyDaily !== null && !loadingVaults ? (
          <div>
            {token.inactive || token.testInactive || !token.dataFetched ? (
              token.inactive || token.testInactive ? (
                'Inactive'
              ) : null
            ) : (
              <>{apyDaily}%</>
            )}
          </div>
        ) : (
          <AnimatedDots />
        )}
      </>
    )
  }

  const detailBoxes = [
    { title: 'Live APY', showValue: showAPY, className: 'balance-box' },
    { title: 'Daily APY', showValue: showApyDaily, className: 'daily-apy-box' },
    { title: 'TVL', showValue: showTVL },
    {
      title: 'Last Harvest',
      showValue: () => (lastHarvest !== '' ? `${lastHarvest} ago` : '-'),
      className: 'daily-yield-box',
    },
  ]

  const apyPeriods = [
    { label: 'Live', value: showAPY() },
    { label: '7d', value: sevenDApy },
    { label: '30d', value: thirtyDApy },
    { label: '180d', value: oneEightyDApy },
    { label: '365d', value: threeSixtyDApy },
    { label: 'Lifetime', value: lifetimeApy },
  ]

  const harvestFrequencies = [
    {
      label: 'Latest',
      value: lastHarvest !== '' ? `${lastHarvest} ago` : '-',
    },
    { label: '7d', value: formatFrequency(sevenDHarvest) },
    { label: '30d', value: formatFrequency(thirtyDHarvest) },
    { label: '180d', value: formatFrequency(oneEightyDHarvest) },
    { label: '365d', value: formatFrequency(threeSixtyDHarvest) },
    { label: 'Lifetime', value: formatFrequency(harvestFrequency) },
  ]

  const rewardTxt = getAdvancedRewardText(token, vaultPool, tradingApy, rewardApy)

  const profitShare =
    tokenChain === CHAIN_IDS.ETH_MAINNET
      ? '10'
      : tokenChain === CHAIN_IDS.POLYGON_MAINNET
        ? '5'
        : '7'
  const harvestTreasury =
    tokenChain === CHAIN_IDS.ETH_MAINNET
      ? '5'
      : tokenChain === CHAIN_IDS.POLYGON_MAINNET
        ? '3'
        : '3'

  const setLoadingDots = (loadingFarm, loadingLp) => {
    setFarmingLoading(loadingFarm)
    setLpStatsloading(loadingLp)
  }

  const viewComponentProps = {
    token,
    tokenDecimals,
    vaultPool,
    rewardTokenPrices,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    pendingAction,
    setLoadingDots,
    setPendingAction,
    loaded,
    totalRewardsEarned,
  }

  return (
    <DetailView $backcolor={bgColorNew} $fontcolor={fontColor}>
      <TopInner $darkmode={darkMode}>
        <TopPart>
          <FlexTopDiv>
            <TopButton className="back-btn">
              <BackBtnRect
                $fontcolor={fontColor}
                onClick={() => {
                  if (isFromEarningPage) {
                    history(ROUTES.PORTFOLIO)
                  } else {
                    history(`${ROUTES.ADVANCED}${location.search}`)
                  }
                }}
              >
                <BiLeftArrowAlt fontSize={16} />
                <BackText $fontcolor={fontColor}>Back</BackText>
              </BackBtnRect>
              {isMobile && (
                <MobileChain>
                  <NetDetailItem>
                    <NetDetailContent $fontcolor={fontColor}>
                      {token.platform && token.platform[0].includes('Autopilot - MORPHO') ? (
                        <BadgeRow>
                          <span>Autopilot</span>
                          <MorphoBadge>
                            <img src={MorphoIcon} width="12" height="12" alt="" />
                            <span>Morpho</span>
                            <PiQuestion
                              className="question"
                              data-tip
                              id="tooltip-morpho-only-mobile"
                            />
                            <Tooltip
                              id="tooltip-morpho-only-mobile"
                              anchorSelect="#tooltip-morpho-only-mobile"
                              backgroundColor="#101828"
                              borderColor="black"
                              textColor="white"
                              place="top"
                              style={{ width: '300px' }}
                            >
                              <span>
                                {`This Autopilot only supplies liquidity to curated ${token.tokenNames[0]} vaults on Morpho, Base Network.`}
                              </span>
                            </Tooltip>
                          </MorphoBadge>
                        </BadgeRow>
                      ) : (
                        token.platform && token.platform[0]
                      )}
                    </NetDetailContent>
                  </NetDetailItem>
                  <ChainBack>
                    <img src={BadgeAry[badgeId]} alt="" />
                  </ChainBack>
                </MobileChain>
              )}
            </TopButton>
            <FlexDiv className="farm-symbol">
              <TopLogo>
                {logoUrl.map((el, i) => (
                  <LogoImg className="logo" src={el.slice(1, el.length)} key={i} alt="" />
                ))}
              </TopLogo>
              <TopDesc
                $weight={600}
                $fontcolor2={fontColor2}
                $size={isMobile ? '19.7px' : '25px'}
                $height={isMobile ? '45px' : '82px'}
                $marginbottom={isMobile ? '5px' : '10px'}
              >
                {token.tokenNames.join(' • ')}
              </TopDesc>
            </FlexDiv>
            <GuideSection>
              <GuidePart $fontcolor4={fontColor4}>
                {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                &nbsp;APY
              </GuidePart>
              <GuidePart $fontcolor4={fontColor4}>
                {showTVL()}
                &nbsp;TVL
              </GuidePart>
              {token.platform && token.platform[0].includes('Autopilot') && <TopBadge />}
            </GuideSection>
            <TabRow>
              <MainTagPanel>
                {mainTags.map((tag, i) =>
                  (i === 1 && !showRewardsTab) || (i === 4 && !token.isIPORVault) ? null : (
                    <MainTag
                      key={i}
                      $fontcolor3={fontColor3}
                      $fontcolor4={fontColor4}
                      $backcolor={bgColorNew}
                      $active={activeMainTag === i ? 'true' : 'false'}
                      $mode={darkMode ? 'dark' : 'light'}
                      $threetabs={!showRewardsTab && !token.isIPORVault}
                      onClick={() => {
                        setActiveMainTag(i)
                        if (i !== 0) {
                          navigate(`${pathname}${location.search}#${tag.name.toLowerCase()}`)
                        } else {
                          navigate(`${pathname}${location.search}`)
                        }
                      }}
                    >
                      <img src={tag.img} alt="logo" />
                      <p>{activeMainTag !== i && isMobile ? '' : tag.name}</p>
                    </MainTag>
                  ),
                )}
              </MainTagPanel>
              <NetDetail>
                <NetDetailItem>
                  <NetDetailTitle $fontcolor={fontColor}>Platform:</NetDetailTitle>
                  <NetDetailContent $fontcolor={fontColor}>
                    {token.platform && token.platform[0].includes('Autopilot - MORPHO') ? (
                      <BadgeRow>
                        <span>Autopilot</span>
                        <MorphoBadge>
                          <img src={MorphoIcon} width="12" height="12" alt="" />
                          <span>{isSmallScreen ? 'Morpho' : 'Morpho-Only'}</span>
                          <PiQuestion
                            className="question"
                            data-tip
                            id="tooltip-morpho-only-advanced"
                          />
                          <Tooltip
                            id="tooltip-morpho-only-advanced"
                            anchorSelect="#tooltip-morpho-only-advanced"
                            backgroundColor="#101828"
                            borderColor="black"
                            textColor="white"
                            place="top"
                            style={{ width: '300px' }}
                          >
                            <span>
                              {`This Autopilot only supplies liquidity to curated ${token.tokenNames[0]} vaults on Morpho, Base Network.`}
                            </span>
                          </Tooltip>
                        </MorphoBadge>
                      </BadgeRow>
                    ) : (
                      token.platform && token.platform[0]
                    )}
                  </NetDetailContent>
                </NetDetailItem>
                <NetDetailItem>
                  <NetDetailTitle $fontcolor={fontColor}>Network</NetDetailTitle>
                  <NetDetailImg $fontcolor={fontColor}>
                    <img src={BadgeAry[badgeId]} alt="" />
                  </NetDetailImg>
                </NetDetailItem>
              </NetDetail>
            </TabRow>
          </FlexTopDiv>
        </TopPart>
      </TopInner>
      <Inner $backcolor={bgColorNew}>
        <BigDiv>
          {(id === 'silo_VM_USDC' || id === 'silo_sUSDX_USDC') && showSiloUSDCInfo && (
            <WelcomeBox
              $bgcolortooltip={bgColorTooltip}
              $fontcolortooltip={fontColorTooltip}
              $bordercolor={borderColor}
            >
              <BiInfoCircle className="info-circle" fontSize={20} />
              <WelcomeContent>
                <WelcomeTitle>Vault Notice</WelcomeTitle>
                <WelcomeText>
                  This vault's distribution process has been completed. All affected positions have{' '}
                  been returned on-chain through receipt tokens representing users' proportional{' '}
                  holdings within the Silo protocol.{' '}
                  <WelcomeTicket
                    className="useIFARM"
                    href="https://discord.com/channels/748967094745563176/748969913489817720/1436000240812425306"
                    target="_blank"
                    rel="noopener noreferrer"
                    $linkcolor={linkColorTooltip}
                    $linkcoloronhover={linkColorOnHover}
                  >
                    Read the announcement here.
                  </WelcomeTicket>
                </WelcomeText>
              </WelcomeContent>
              <WelcomeClose>
                <RxCross2 onClick={closeSiloUSDCBadge} />
              </WelcomeClose>
            </WelcomeBox>
          )}
          {id === 'IPOR_USDC_arbitrum' && showSiloUSDCInfo && (
            <WelcomeBox
              $bgcolortooltip={bgColorTooltip}
              $fontcolortooltip={fontColorTooltip}
              $bordercolor={borderColor}
            >
              <BiInfoCircle className="info-circle" fontSize={20} />
              <WelcomeContent>
                <WelcomeTitle>Vault Notice</WelcomeTitle>
                <WelcomeText>
                  This Autopilot has been unpaused and is now fully operational, with the sharePrice
                  adjusted to reflect liquid USDC. The affected 'Silo – sUSDX' and 'Silo –
                  Varlamore' subvaults have been disconnected. Receipt tokens for these markets will
                  be distributed directly to user wallets. Follow the #announcements channel on
                  Discord for the latest updates.
                </WelcomeText>
              </WelcomeContent>
              <WelcomeClose>
                <RxCross2 onClick={closeSiloUSDCBadge} />
              </WelcomeClose>
            </WelcomeBox>
          )}
          <InternalSection>
            {activeMainTag === 0 ? (
              <>
                {showIFARMInfo ? (
                  <WelcomeBox
                    $bgcolortooltip={bgColorTooltip}
                    $fontcolortooltip={fontColorTooltip}
                    $bordercolor={borderColor}
                  >
                    <BiInfoCircle className="info-circle" fontSize={20} />
                    <WelcomeContent>
                      <WelcomeTitle>Vault Note</WelcomeTitle>
                      <WelcomeText>
                        Legacy FARM staking is currently available in the previous app version{' '}
                        <WelcomeTicket
                          className="useIFARM"
                          href="https://v3.harvest.finance/ethereum/0xa0246c9032bC3A600820415aE600c6388619A14D"
                          target="_blank"
                          rel="noopener noreferrer"
                          $linkcolor={linkColorTooltip}
                          $linkcoloronhover={linkColorOnHover}
                        >
                          under this link
                        </WelcomeTicket>
                        .
                        <WelcomeBottom>
                          <WelcomeKnow onClick={closeIFARMBadge}>Alright, got it!</WelcomeKnow>
                        </WelcomeBottom>
                      </WelcomeText>
                    </WelcomeContent>
                    <WelcomeClose>
                      <RxCross2 onClick={closeIFARMBadge} />
                    </WelcomeClose>
                  </WelcomeBox>
                ) : (
                  <></>
                )}
                <ManageBoxWrapper>
                  <MyBalance
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                    $marginbottom={isMobile ? '20px' : '25px'}
                    $margintop={isMobile ? '0px' : '0'}
                    $height={isMobile ? 'unset' : '120px'}
                  >
                    <NewLabel
                      $display="flex"
                      $justifycontent="space-between"
                      $size={isMobile ? '12px' : '12px'}
                      $weight="600"
                      $height={isMobile ? '20px' : '20px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      <FlexDiv>
                        {showLatestEarnings ? 'Latest Yield' : 'Lifetime Yield'}
                        <EarningsBadge>Beta</EarningsBadge>
                        <PiQuestion
                          className="question"
                          data-tip
                          id={
                            showLatestEarnings
                              ? 'tooltip-latest-earning'
                              : 'tooltip-lifetime-earning'
                          }
                        />
                        <Tooltip
                          id={
                            showLatestEarnings
                              ? 'tooltip-latest-earning'
                              : 'tooltip-lifetime-earning'
                          }
                          anchorSelect={
                            showLatestEarnings
                              ? '#tooltip-latest-earning'
                              : '#tooltip-lifetime-earning'
                          }
                          backgroundColor={darkMode ? 'white' : '#101828'}
                          borderColor={darkMode ? 'white' : 'black'}
                          textColor={darkMode ? 'black' : 'white'}
                        >
                          <NewLabel
                            $size={isMobile ? '12px' : '12px'}
                            $height={isMobile ? '18px' : '18px'}
                            $weight="500"
                          >
                            {showLatestEarnings ? (
                              <>
                                Your latest yield in this farm since the last interaction (revert or
                                convert).
                                <br />
                                <br />
                                USD value is subject to market fluctuations. Claimable rewards are
                                not part of this estimation.
                                <br />
                                <br />
                                Underlying is subject to auto-compounding events.
                              </>
                            ) : (
                              <>
                                Your lifetime yield in this farm expressed in USD and Underlying
                                token. USD value is subject to market fluctuations. Claimable
                                rewards are not part of this estimation.
                                <br />
                                <br />
                                Underlying is subject to auto-compounding events.
                              </>
                            )}
                          </NewLabel>
                        </Tooltip>
                      </FlexDiv>
                      <ThemeMode $mode={showLatestEarnings ? 'latest' : 'lifetime'}>
                        <div id="theme-switch">
                          <div className="switch-track">
                            <div className="switch-thumb" />
                          </div>

                          <input
                            type="checkbox"
                            checked={showLatestEarnings}
                            onChange={handleToggle(setShowLatestEarnings)}
                            aria-label="Switch between lifetime and latest yields"
                          />
                        </div>
                      </ThemeMode>
                    </NewLabel>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $display="flex"
                        $size={isMobile ? '12px' : '12px'}
                        $weight="500"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor3}
                      >
                        in {`${currencyName}`}
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="600"
                        $fontcolor={fontColor1}
                      >
                        {showUsdValueCurrency(
                          showLatestEarnings ? usdEarningsLatest : usdEarnings,
                          currencySym,
                          currencyRate,
                        )}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="500"
                        $fontcolor={fontColor3}
                        $self="center"
                      >
                        Underlying
                      </NewLabel>
                      <NewLabel
                        $weight="600"
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor1}
                        $self="center"
                        $fontcolor2={fontColor2}
                        $position="relative"
                        $align="right"
                        $marginbottom={isMobile ? '12px' : '0px'}
                      >
                        <div data-tip id="earnings-underlying">
                          {showLatestEarnings
                            ? showTokenBalance(underlyingEarningsLatest)
                            : showTokenBalance(underlyingEarnings)}
                        </div>
                        <Tooltip
                          id="earnings-underlying"
                          backgroundColor={darkMode ? 'white' : '#101828'}
                          borderColor={darkMode ? 'white' : 'black'}
                          textColor={darkMode ? 'black' : 'white'}
                          place="top"
                          effect="solid"
                          anchorSelect="#earnings-underlying"
                        >
                          <NewLabel
                            $size={isMobile ? '10px' : '10px'}
                            $height={isMobile ? '14px' : '14px'}
                            $weight="500"
                          >
                            {showLatestEarnings ? underlyingEarningsLatest : underlyingEarnings}
                          </NewLabel>
                        </Tooltip>
                        <span className="symbol">{token.tokenNames[0]}</span>
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  <MyBalance
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                    $marginbottom={isMobile ? '20px' : '25px'}
                    $margintop={isMobile ? '0px' : '0'}
                    $height={isMobile ? 'unset' : '120px'}
                  >
                    <NewLabel
                      $display="flex"
                      $justifycontent="space-between"
                      $size={isMobile ? '12px' : '12px'}
                      $weight="600"
                      $height={isMobile ? '20px' : '20px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      Total Balance
                      <PiQuestion className="question" data-tip id="tooltip-total-balance" />
                      <Tooltip
                        id="tooltip-total-balance"
                        anchorSelect="#tooltip-total-balance"
                        backgroundColor={darkMode ? 'white' : '#101828'}
                        borderColor={darkMode ? 'white' : 'black'}
                        textColor={darkMode ? 'black' : 'white'}
                      >
                        <NewLabel
                          $size={isMobile ? '12px' : '12px'}
                          $height={isMobile ? '18px' : '18px'}
                          $weight="500"
                        >
                          Total Balance reflects the fTokens in connected wallet, alongside their
                          USD value, which can change with the market.
                          <br />
                          <br />
                          The fToken count stays the same unless you revert or convert more crypto
                          in the farm.
                        </NewLabel>
                      </Tooltip>
                    </NewLabel>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $display="flex"
                        $size={isMobile ? '12px' : '12px'}
                        $weight="500"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor3}
                      >
                        in {`${currencyName}`}
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="600"
                        $fontcolor={fontColor1}
                      >
                        {!connected ? (
                          `${currencySym}0.00`
                        ) : userStats.length === 0 ? (
                          <AnimatedDots />
                        ) : (
                          showUsdValue(balanceAmount, currencySym)
                        )}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="500"
                        $fontcolor={fontColor3}
                        $self="center"
                      >
                        fToken
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="600"
                        $fontcolor={fontColor1}
                        $fontcolor2={fontColor2}
                        $position="relative"
                        $align="right"
                        $marginbottom={isMobile ? '12px' : '0px'}
                      >
                        <div className="question" data-tip id="fToken-total-balance">
                          {!connected ? (
                            0
                          ) : userStats.length === 0 ? (
                            <AnimatedDots />
                          ) : (
                            showTokenBalance(totalValue)
                          )}
                        </div>
                        <Tooltip
                          id="fToken-total-balance"
                          backgroundColor={darkMode ? 'white' : '#101828'}
                          borderColor={darkMode ? 'white' : 'black'}
                          textColor={darkMode ? 'black' : 'white'}
                          place="top"
                          effect="solid"
                          anchorSelect="#fToken-total-balance"
                        >
                          <NewLabel
                            $size={isMobile ? '10px' : '10px'}
                            $height={isMobile ? '14px' : '14px'}
                            $weight="500"
                          >
                            {totalValue}
                          </NewLabel>
                        </Tooltip>
                        <span className="symbol">{fTokenName}</span>
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  <MyBalance
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                    $marginbottom={isMobile ? '20px' : '25px'}
                    $margintop={isMobile ? '0px' : '0'}
                    $height={isMobile ? 'unset' : '120px'}
                  >
                    <NewLabel
                      $display="flex"
                      $justifycontent="space-between"
                      $size={isMobile ? '12px' : '12px'}
                      $weight="600"
                      $height={isMobile ? '20px' : '20px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      Yield Estimates
                      <PiQuestion className="question" data-tip id="tooltip-yield-estimate" />
                      <Tooltip
                        id="tooltip-yield-estimate"
                        anchorSelect="#tooltip-yield-estimate"
                        backgroundColor={darkMode ? 'white' : '#101828'}
                        borderColor={darkMode ? 'white' : 'black'}
                        textColor={darkMode ? 'black' : 'white'}
                      >
                        <NewLabel
                          $size={isMobile ? '12px' : '12px'}
                          $height={isMobile ? '18px' : '18px'}
                          $weight="500"
                        >
                          Estimated yield on your fTokens of this farm based on live APY,
                          denominated in USD. Subject to market fluctuations.
                          <br />
                          Note: frequency of auto-compounding events vary, so take these numbers as
                          rough guides, not exact figures.
                        </NewLabel>
                      </Tooltip>
                    </NewLabel>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $display="flex"
                        $size={isMobile ? '12px' : '12px'}
                        $weight="500"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor3}
                      >
                        Daily
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="600"
                        $fontcolor={fontColor1}
                      >
                        {!connected
                          ? `${currencySym}0`
                          : isNaN(yieldDaily)
                            ? `${currencySym}0`
                            : showUsdValue(yieldDaily, currencySym)}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="500"
                        $fontcolor={fontColor3}
                        $self="center"
                      >
                        Monthly
                      </NewLabel>
                      <NewLabel
                        $weight="600"
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor1}
                        $self="center"
                      >
                        {!connected
                          ? `${currencySym}0.00`
                          : isNaN(yieldMonthly)
                            ? `${currencySym}0.00`
                            : showUsdValue(yieldMonthly, currencySym)}
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                </ManageBoxWrapper>
              </>
            ) : activeMainTag === 2 ? (
              <BoxCover $bordercolor={borderColorBox}>
                {detailBoxes.map(({ title, showValue, className }, index) => (
                  <ValueBox
                    key={index}
                    $width="24%"
                    className={className}
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                  >
                    <BoxTitle $fontcolor3={fontColor3}>{title}</BoxTitle>
                    <BoxValue $fontcolor1={fontColor1}>{showValue()}</BoxValue>
                  </ValueBox>
                ))}
              </BoxCover>
            ) : activeMainTag === 3 ? (
              <>
                <NewLabel
                  $backcolor={darkMode ? '#373737' : '#ebebeb'}
                  $width={isMobile ? '100%' : '40%'}
                  $size={isMobile ? '16px' : '16px'}
                  $height={isMobile ? '24px' : '24px'}
                  $weight="600"
                  $fontcolor={fontColor1}
                  $display={token.isIPORVault ? 'none' : 'flex'}
                  $justifycontent="center"
                  $marginbottom="13px"
                  $borderradius="8px"
                  $transition="0.25s"
                >
                  {historyTags.map((tag, i) => (
                    <SwitchTabTag
                      key={i}
                      onClick={() => {
                        if ((i === 0 && !activeHarvests) || (i === 1 && activeHarvests))
                          setActiveHarvests(prev => !prev)
                      }}
                      $fontcolor={
                        (i === 0 && activeHarvests) || (i === 1 && !activeHarvests)
                          ? fontColor4
                          : fontColor3
                      }
                      $backcolor={
                        (i === 0 && activeHarvests) || (i === 1 && !activeHarvests)
                          ? activeColorNew
                          : ''
                      }
                      $boxshadow={
                        (i === 0 && activeHarvests) || (i === 1 && !activeHarvests)
                          ? boxShadowColor2
                          : ''
                      }
                    >
                      <p>{tag.name}</p>
                    </SwitchTabTag>
                  ))}
                </NewLabel>
                {activeHarvests ? (
                  <EarningsHistory historyData={historyData} isDashboard={false} noData />
                ) : (
                  <RewardsHistory
                    account={account}
                    token={token}
                    isDashboard={false}
                    noData={noRewardsData}
                    setNoData={setNoRewardsData}
                  />
                )}
              </>
            ) : activeMainTag === 4 && token.isIPORVault ? (
              <>
                <FlexDiv $marginbottom="20px" $width="100%">
                  Performance comparison between Autopilot and its sub-vaults.
                </FlexDiv>
                <MainSection $height={activeMainTag === 0 ? '100%' : 'fit-content'}>
                  <SharePricesData
                    chainName={chainName}
                    token={token}
                    setSharePricesData={setSharePricesData}
                    iporHvaultsLFAPY={iporHvaultsLFAPY}
                  />
                  <AOTData
                    chainName={chainName}
                    token={token}
                    iporHvaultsLFAPY={iporHvaultsLFAPY}
                  />
                </MainSection>
                <RestInternalBenchmark>
                  <LastHarvestInfo $backcolor={backColor} $bordercolor={borderColor}>
                    <NewLabel
                      $size={isMobile ? '12px' : '14px'}
                      $weight={isMobile ? '600' : '600'}
                      $height={isMobile ? '20px' : '24px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom="1px solid #F3F6FF"
                    >
                      Lifetime avg. APY
                    </NewLabel>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                    >
                      <NewLabel
                        $size="13.4px"
                        $height="20px"
                        $weight="500"
                        cursor="pointer"
                        $borderbottom="0.5px dotted white"
                        $fontcolor="#5dcf46"
                        onClick={() => {}}
                      >
                        Autopilot {token.tokenNames[0]}
                      </NewLabel>
                      <NewLabel $size="13.4px" $height="20px" $weight="500" $fontcolor="#5dcf46">
                        {iporHvaultsLFAPY && iporHvaultsLFAPY[token.id]
                          ? `${iporHvaultsLFAPY[token.id]}%`
                          : '-'}
                      </NewLabel>
                    </FlexDiv>
                    {iporHvaultsLFAPY ? (
                      Object.keys(iporHvaultsLFAPY)
                        .filter(key => key !== token.id)
                        .map(apyKey => {
                          const vaultParts = apyKey
                            .split('_')
                            .map((part, index) =>
                              index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
                            )
                          let lifetimeApyValue = '-',
                            vaultName = vaultParts
                              .filter(part => !part.toLowerCase().includes(chainName.toLowerCase()))
                              .join(' ')
                          if (vaultName === 'USDC' && chainName == 'base')
                            vaultName = 'Compound V3 USDC'
                          if (vaultName === 'USDC' && chainName == 'eth')
                            vaultName = 'Morpho GF USDC'
                          if (vaultName === 'WETH' && chainName == 'base')
                            vaultName = 'Compound V3 WETH'

                          lifetimeApyValue = `${iporHvaultsLFAPY[apyKey]}%`
                          return (
                            <FlexDiv
                              key={apyKey}
                              $justifycontent="space-between"
                              $padding={isMobile ? '10px 15px' : '10px 15px'}
                              onClick={() => {
                                const lcChainName = getChainNamePortals(tokenChain)
                                return allVaultsData[apyKey]?.vaultAddress
                                  ? window.open(
                                      `https://app.harvest.finance/${lcChainName}/${allVaultsData[apyKey]?.vaultAddress}`,
                                      '_blank',
                                    )
                                  : null
                              }}
                            >
                              <NewLabel
                                $size="13.4px"
                                $height="20px"
                                $weight="500"
                                cursor="pointer"
                                $borderbottom="0.5px dotted white"
                                $fontcolor={generateColor(iporHvaultsLFAPY, apyKey)}
                              >
                                {vaultName}
                              </NewLabel>
                              <NewLabel
                                $size="13.4px"
                                $height="20px"
                                $weight="500"
                                $fontcolor={generateColor(iporHvaultsLFAPY, apyKey)}
                              >
                                {lifetimeApyValue}
                              </NewLabel>
                            </FlexDiv>
                          )
                        })
                    ) : (
                      <></>
                    )}
                  </LastHarvestInfo>
                </RestInternalBenchmark>
              </>
            ) : (
              <></>
            )}
            <MainSection $height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                !isMobile && (
                  <UserBalanceData
                    token={token}
                    totalValue={totalValue}
                    underlyingPrice={underlyingPrice}
                    lpTokenBalance={lpTokenBalance}
                    chartData={chartData}
                    showRewardsTab={showRewardsTab}
                  />
                )
              ) : activeMainTag === 1 ? (
                <>
                  <TotalRewardBox
                    $marginbottom={isMobile ? '20px' : '25px'}
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                  >
                    <BoxTitle $fontcolor3={fontColor3}>Rewards</BoxTitle>
                    <RewardValue>
                      <BoxValue $fontcolor1={fontColor1}>
                        {!connected ? (
                          `${currencySym}0`
                        ) : userStats ? (
                          showUsdValue(totalReward, currencySym)
                        ) : (
                          <AnimatedDots />
                        )}
                      </BoxValue>
                    </RewardValue>
                  </TotalRewardBox>
                  {!isMobile && (
                    <MyBalance
                      $marginbottom="25px"
                      $backcolor={bgColorNew}
                      $bordercolor={borderColorBox}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight="600"
                        $height={isMobile ? '20px' : '24px'}
                        $fontcolor={fontColor4}
                        $padding={isMobile ? '10px 15px' : '10px 15px'}
                        $borderbottom={`1px solid ${borderColorBox}`}
                      >
                        My Token Rewards
                      </NewLabel>
                      <FlexDiv>
                        <VaultPanelActionsFooter {...viewComponentProps} />
                      </FlexDiv>
                    </MyBalance>
                  )}
                </>
              ) : activeMainTag === 2 ? (
                <>
                  <HalfInfo
                    $padding="25px 18px"
                    $marginbottom={isMobile ? '20px' : '25px'}
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                  >
                    <FarmDetailChart
                      token={token}
                      vaultPool={vaultPool}
                      lastTVL={Number(vaultValue)}
                      lastAPY={Number(totalApy)}
                      set7DApy={setSevenDApy}
                      set30DApy={setThirtyDApy}
                      set180DApy={setOneEightyDApy}
                      set360DApy={setThreeSixtyDApy}
                      setLifetimeApy={setLifetimeApy}
                      setVaultBirthday={setVaultBirthday}
                      setVaultTotalPeriod={setVaultTotalPeriod}
                      setLatestSharePrice={setLatestSharePrice}
                      set7DHarvest={setSevenDHarvest}
                      set30DHarvest={setThirtyDHarvest}
                      set180DHarvest={setOneEightyDHarvest}
                      set360DHarvest={setThreeSixtyDHarvest}
                      setHarvestFrequency={setHarvestFrequency}
                    />
                  </HalfInfo>
                  {!isMobile && <SourceOfYield token={token} vaultPool={vaultPool} />}
                </>
              ) : (
                <></>
              )}
            </MainSection>
            <RestContent $height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <FirstPartSection>
                  <HalfContent
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                    $marginbottom={isMobile ? '20px' : '0px'}
                    $borderradius={isMobile ? '12px' : '12px'}
                  >
                    <DepositSection $isshow={activeDepo}>
                      <DepositBase
                        setSelectToken={setSelectTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        balance={balanceDepo}
                        pickedToken={pickedTokenDepo}
                        defaultToken={defaultToken}
                        inputAmount={inputAmountDepo}
                        pricePerFullShare={pricePerFullShare}
                        setInputAmount={setInputAmountDepo}
                        token={token}
                        supTokenList={supTokenList}
                        switchMethod={handleToggle(setActiveDepo)}
                        tokenSymbol={tokenSym}
                        balanceList={balanceList}
                        setFromInfoAmount={setFromInfoAmount}
                        setFromInfoUsdAmount={setFromInfoUsdAmount}
                        fromInfoUsdAmount={fromInfoUsdAmount}
                        convertYearlyYieldUSD={convertYearlyYieldUSD}
                        convertMonthlyYieldUSD={convertMonthlyYieldUSD}
                        convertDailyYieldUSD={convertDailyYieldUSD}
                        minReceiveAmountString={minReceiveAmountString}
                        setMinReceiveAmountString={setMinReceiveAmountString}
                        minReceiveUsdAmount={minReceiveUsdAmount}
                        setMinReceiveUsdAmount={setMinReceiveUsdAmount}
                        setConvertYearlyYieldUSD={setConvertYearlyYieldUSD}
                        setConvertMonthlyYieldUSD={setConvertMonthlyYieldUSD}
                        setConvertDailyYieldUSD={setConvertDailyYieldUSD}
                        hasErrorOccurred={hasErrorOccurredConvert}
                        setHasErrorOccurred={setHasErrorOccurredConvert}
                        failureCount={failureCountConvert}
                        setFailureCount={setFailureCountConvert}
                        supportedVault={supportedVault}
                        setSupportedVault={setSupportedVault}
                      />
                      <DepositSelectToken
                        selectToken={selectTokenDepo}
                        setSelectToken={setSelectTokenDepo}
                        setPickedToken={setPickedTokenDepo}
                        setBalance={setBalanceDepo}
                        supTokenNoBalanceList={supTokenNoBalanceList}
                        balanceList={balanceList}
                        defaultToken={defaultToken}
                        soonToSupList={soonToSupList}
                        supportedVault={supportedVault}
                        hasPortalsError={hasPortalsError}
                        setFromTokenList={setFromTokenList}
                      />
                      <DepositStart
                        pickedToken={pickedTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        defaultToken={defaultToken}
                        inputAmount={inputAmountDepo}
                        setInputAmount={setInputAmountDepo}
                        token={token}
                        tokenSymbol={tokenSym}
                        vaultPool={vaultPool}
                        multipleAssets={multipleAssets}
                        fromInfoAmount={fromInfoAmount}
                        fromInfoUsdAmount={fromInfoUsdAmount}
                        minReceiveAmountString={minReceiveAmountString}
                        minReceiveUsdAmount={minReceiveUsdAmount}
                        setSelectToken={setSelectTokenDepo}
                        setConvertSuccess={setConvertSuccess}
                      />
                    </DepositSection>
                    <WithdrawSection $isshow={!activeDepo}>
                      <WithdrawBase
                        unstakeInputValue={unstakeInputValue}
                        setUnstakeInputValue={setUnstakeInputValue}
                        setSelectToken={setSelectTokenWith}
                        setWithdrawStart={setWithdrawStart}
                        defaultToken={defaultToken}
                        pricePerFullShare={pricePerFullShare}
                        pickedToken={pickedTokenWith}
                        unstakeBalance={unstakeBalance}
                        setUnstakeBalance={setUnstakeBalance}
                        balanceList={balanceList}
                        tokenSymbol={tokenSym}
                        vaultPool={vaultPool}
                        lpTokenBalance={lpTokenBalance}
                        stakedAmount={stakedAmount}
                        token={token}
                        supTokenList={supTokenList}
                        switchMethod={handleToggle(setActiveDepo)}
                        setRevertFromInfoAmount={setRevertFromInfoAmount}
                        revertFromInfoUsdAmount={revertFromInfoUsdAmount}
                        setRevertFromInfoUsdAmount={setRevertFromInfoUsdAmount}
                        setRevertMinReceivedAmount={setRevertMinReceivedAmount}
                        revertMinReceivedAmount={revertMinReceivedAmount}
                        revertMinReceivedUsdAmount={revertMinReceivedUsdAmount}
                        setRevertMinReceivedUsdAmount={setRevertMinReceivedUsdAmount}
                        hasErrorOccurred={hasErrorOccurredRevert}
                        setHasErrorOccurred={setHasErrorOccurredRevert}
                      />
                      <WithdrawSelectToken
                        selectToken={selectTokenWith}
                        setSelectToken={setSelectTokenWith}
                        setPickedToken={setPickedTokenWith}
                        supTokenNoBalanceList={supTokenNoBalanceList}
                        balanceList={balanceList}
                        defaultToken={defaultToken}
                        soonToSupList={soonToSupList}
                        supportedVault={supportedVault}
                        hasPortalsError={hasPortalsError}
                      />
                      <WithdrawStart
                        groupOfVaults={groupOfVaults}
                        unstakeInputValue={unstakeInputValue}
                        withdrawStart={withdrawStart}
                        setWithdrawStart={setWithdrawStart}
                        defaultToken={defaultToken}
                        pickedToken={pickedTokenWith}
                        setPickedToken={setPickedTokenWith}
                        token={token}
                        unstakeBalance={unstakeBalance}
                        tokenSymbol={tokenSym}
                        vaultPool={vaultPool}
                        multipleAssets={multipleAssets}
                        depositedValueUSD={depositedValueUSD}
                        setRevertFromInfoAmount={setRevertFromInfoAmount}
                        revertFromInfoAmount={revertFromInfoAmount}
                        revertFromInfoUsdAmount={revertFromInfoUsdAmount}
                        revertMinReceivedAmount={revertMinReceivedAmount}
                        revertMinReceivedUsdAmount={revertMinReceivedUsdAmount}
                        setUnstakeInputValue={setUnstakeInputValue}
                        setRevertSuccess={setRevertSuccess}
                      />
                    </WithdrawSection>
                  </HalfContent>
                  {isMobile ? (
                    <PerformanceChart
                      token={token}
                      vaultPool={vaultPool}
                      totalValue={totalValue}
                      underlyingPrice={underlyingPrice}
                      lpTokenBalance={lpTokenBalance}
                      chartData={chartData}
                    />
                  ) : (
                    <></>
                  )}
                </FirstPartSection>
              ) : activeMainTag === 1 ? (
                <SecondPartSection>
                  <MyBalance
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                    $height={isMobile ? 'unset' : '120px'}
                    $marginbottom={isMobile ? '20px' : '25px'}
                  >
                    <NewLabel
                      $size={isMobile ? '12px' : '12px'}
                      $weight="600"
                      $height={isMobile ? '20px' : '20px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      {fTokenName}
                    </NewLabel>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight="500"
                        $fontcolor={fontColor3}
                      >
                        Unstaked
                        <PiQuestion className="question" data-tip id="tooltip-unstaked-desc" />
                        <Tooltip
                          id="tooltip-unstaked-desc"
                          backgroundColor={darkMode ? 'white' : '#101828'}
                          borderColor={darkMode ? 'white' : 'black'}
                          textColor={darkMode ? 'black' : 'white'}
                          anchorSelect="#tooltip-unstaked-desc"
                        >
                          <NewLabel
                            $size={isMobile ? '12px' : '12px'}
                            $height={isMobile ? '18px' : '18px'}
                            $weight="500"
                          >
                            The number of fTokens you hold, which are not entitled to extra token
                            rewards.
                          </NewLabel>
                        </Tooltip>
                      </NewLabel>
                      <NewLabel
                        $weight="600"
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor1}
                      >
                        {!connected ? (
                          0
                        ) : userStats.length === 0 ? (
                          <AnimatedDots />
                        ) : unstakedAmount === 0 ? (
                          '0.00'
                        ) : (
                          unstakedAmount
                        )}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        $display="flex"
                        $size={isMobile ? '12px' : '12px'}
                        $weight="500"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor="#15B088"
                      >
                        Staked
                        <PiQuestion className="question" data-tip id="tooltip-staked-desc" />
                        <Tooltip
                          id="tooltip-staked-desc"
                          backgroundColor={darkMode ? 'white' : '#101828'}
                          borderColor={darkMode ? 'white' : 'black'}
                          textColor={darkMode ? 'black' : 'white'}
                          anchorSelect="#tooltip-staked-desc"
                        >
                          <NewLabel
                            $size={isMobile ? '12px' : '12px'}
                            $height={isMobile ? '18px' : '18px'}
                            $weight="500"
                          >
                            The number of fTokens you hold, which are entitled to extra token
                            rewards.
                          </NewLabel>
                        </Tooltip>
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '24px' : '24px'}
                        $weight={isMobile ? '600' : '600'}
                        $fontcolor={isMobile ? '#15B088' : '#15B088'}
                      >
                        {!connected ? (
                          0
                        ) : userStats.length === 0 ? (
                          <AnimatedDots />
                        ) : stakedAmount === 0 ? (
                          '0.00'
                        ) : (
                          stakedAmount
                        )}
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  {isMobile && (
                    <MyBalance
                      $marginbottom="20px"
                      $backcolor={bgColorNew}
                      $bordercolor={borderColorBox}
                    >
                      <NewLabel
                        $size={isMobile ? '14px' : '14px'}
                        $weight="600"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor4}
                        $padding={isMobile ? '10px 15px' : '10px 15px'}
                        $borderbottom={`1px solid ${borderColorBox}`}
                      >
                        My Token Rewards
                      </NewLabel>
                      <FlexDiv>
                        <VaultPanelActionsFooter {...viewComponentProps} />
                      </FlexDiv>
                    </MyBalance>
                  )}
                  <HalfContent
                    $backcolor={bgColorNew}
                    $bordercolor={borderColorBox}
                    $marginbottom={isMobile ? '20px' : '0px'}
                    $borderradius={isMobile ? '12px' : '12px'}
                  >
                    <StakeSection $isshow={activeStake}>
                      <StakeBase
                        setStakeStart={setStakeStart}
                        inputAmount={inputAmountStake}
                        setInputAmount={setInputAmountStake}
                        token={token}
                        switchMethod={handleToggle(setActiveStake)}
                        tokenSymbol={tokenSym}
                        lpTokenBalance={lpTokenBalance}
                        vaultPool={vaultPool}
                      />
                      <StakeStart
                        stakeStart={stakeStart}
                        setStakeStart={setStakeStart}
                        inputAmount={inputAmountStake}
                        setInputAmount={setInputAmountStake}
                        token={token}
                        tokenSymbol={tokenSym}
                        vaultPool={vaultPool}
                        lpTokenBalance={lpTokenBalance}
                        lpTokenApprovedBalance={lpTokenApprovedBalance}
                        setPendingAction={setPendingAction}
                        multipleAssets={multipleAssets}
                        setLoadingDots={setLoadingDots}
                      />
                      <StakeResult
                        finalStep={stakeFinalStep}
                        setFinalStep={setStakeFinalStep}
                        inputAmount={inputAmountStake}
                        tokenSymbol={tokenSym}
                      />
                    </StakeSection>
                    <UnstakeSection $isshow={!activeStake}>
                      <UnstakeBase
                        setUnstakeStart={setUnstakeStart}
                        finalStep={unstakeFinalStep}
                        inputAmount={inputAmountUnstake}
                        setInputAmount={setInputAmountUnstake}
                        token={token}
                        switchMethod={handleToggle(setActiveStake)}
                        tokenSymbol={tokenSym}
                        totalStaked={totalStaked}
                        vaultPool={vaultPool}
                        multipleAssets={multipleAssets}
                        amountsToExecute={amountsToExecuteUnstake}
                        setAmountsToExecute={setAmountsToExecuteUnstake}
                      />
                      <UnstakeStart
                        unstakeStart={unstakeStart}
                        setUnstakeStart={setUnstakeStart}
                        setFinalStep={setUnstakeFinalStep}
                        inputAmount={inputAmountUnstake}
                        setInputAmount={setInputAmountUnstake}
                        token={token}
                        switchMethod={handleToggle(setActiveStake)}
                        tokenSymbol={tokenSym}
                        totalStaked={totalStaked}
                        vaultPool={vaultPool}
                        setPendingAction={setPendingAction}
                        multipleAssets={multipleAssets}
                        amountsToExecute={amountsToExecuteUnstake}
                      />
                      <UnstakeResult
                        finalStep={unstakeFinalStep}
                        setFinalStep={setUnstakeFinalStep}
                        inputAmount={inputAmountUnstake}
                        setInputAmount={setInputAmountUnstake}
                        tokenSymbol={tokenSym}
                      />
                    </UnstakeSection>
                  </HalfContent>
                </SecondPartSection>
              ) : activeMainTag === 2 ? (
                <RestInternal>
                  <LastHarvestInfo $backcolor={bgColorNew} $bordercolor={borderColorBox}>
                    <NewLabel
                      $size={isMobile ? '12px' : '14px'}
                      $weight={isMobile ? '600' : '600'}
                      $height={isMobile ? '20px' : '24px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      Info
                    </NewLabel>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight="500"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor3}
                      >
                        Operating since
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight="600"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor1}
                      >
                        {vaultBirthday === '' ? <AnimatedDots /> : vaultBirthday}{' '}
                        {vaultTotalPeriod !== '' && (
                          <span className="total-days">({vaultTotalPeriod} days)</span>
                        )}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      $justifycontent="space-between"
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight="500"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor3}
                      >
                        SharePrice
                      </NewLabel>
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight="600"
                        $height={isMobile ? '24px' : '24px'}
                        $fontcolor={fontColor1}
                      >
                        <div className="question" data-tip id="tooltip-sharePrice">
                          {latestSharePrice === '' ? (
                            <AnimatedDots />
                          ) : latestSharePrice === '-' ? (
                            '-'
                          ) : (
                            Number(latestSharePrice).toFixed(5)
                          )}
                        </div>
                        <Tooltip
                          id="tooltip-sharePrice"
                          backgroundColor={darkMode ? 'white' : '#101828'}
                          borderColor={darkMode ? 'white' : 'black'}
                          textColor={darkMode ? 'black' : 'white'}
                          place="top"
                          anchorSelect="#tooltip-sharePrice"
                        >
                          <NewLabel
                            $size={isMobile ? '12px' : '12px'}
                            $height={isMobile ? '18px' : '18px'}
                            $weight="500"
                          >
                            {latestSharePrice}
                          </NewLabel>
                        </Tooltip>
                      </NewLabel>
                    </FlexDiv>
                    <NewLabel
                      $display="flex"
                      $justifycontent="space-between"
                      $size={isMobile ? '12px' : '14px'}
                      $weight={isMobile ? '600' : '600'}
                      $height={isMobile ? '20px' : '24px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      {showApyHistory ? 'APY - Live & Historical Average' : 'Harvest Frequency'}
                      <SwitchMode $mode={showApyHistory ? 'apy' : 'harvest'}>
                        <div id="theme-switch">
                          <div className="switch-track">
                            <div className="switch-thumb" />
                          </div>
                          <input
                            type="checkbox"
                            checked={showApyHistory}
                            onChange={handleToggle(setShowApyHistory)}
                            aria-label="Switch between APY and Harvest frequency"
                          />
                        </div>
                      </SwitchMode>
                    </NewLabel>
                    {showApyHistory
                      ? apyPeriods.map((period, index) => (
                          <FlexDiv
                            key={index}
                            $justifycontent="space-between"
                            $padding={isMobile ? '10px 15px' : '10px 15px'}
                          >
                            <NewLabel
                              $size={isMobile ? '12px' : '14px'}
                              $weight="500"
                              $height={isMobile ? '24px' : '24px'}
                              $fontcolor={fontColor3}
                            >
                              {period.label}
                            </NewLabel>
                            <NewLabel
                              $size={isMobile ? '12px' : '14px'}
                              $weight="600"
                              $height={isMobile ? '24px' : '24px'}
                              $fontcolor={fontColor1}
                            >
                              {period.value === '' ? <AnimatedDots /> : period.value}
                            </NewLabel>
                          </FlexDiv>
                        ))
                      : harvestFrequencies.map((period, index) => (
                          <FlexDiv
                            key={index}
                            $justifycontent="space-between"
                            $padding={isMobile ? '10px 15px' : '10px 15px'}
                          >
                            <NewLabel
                              $size={isMobile ? '12px' : '14px'}
                              $weight="500"
                              $height={isMobile ? '24px' : '24px'}
                              $fontcolor={fontColor3}
                            >
                              {period.label}
                            </NewLabel>
                            <NewLabel
                              $size={isMobile ? '12px' : '14px'}
                              $weight="600"
                              $height={isMobile ? '24px' : '24px'}
                              $fontcolor={fontColor1}
                            >
                              {period.value === '' ? <AnimatedDots /> : period.value}
                            </NewLabel>
                          </FlexDiv>
                        ))}
                  </LastHarvestInfo>
                  {
                    <MyBalance
                      $marginbottom={isMobile ? '20px' : '25px'}
                      $backcolor={bgColorNew}
                      $bordercolor={borderColorBox}
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight="600"
                        $height={isMobile ? '20px' : '24px'}
                        $fontcolor={fontColor4}
                        $padding={isMobile ? '10px 15px' : '10px 15px'}
                        $borderbottom={`1px solid ${borderColorBox}`}
                      >
                        APY Breakdown
                      </NewLabel>
                      <NewLabel $padding={isMobile ? '0px 15px 10px' : '0px 15px 10px'}>
                        <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
                      </NewLabel>
                      <Tip $display={showTip ? 'block' : 'none'}>
                        <TipTop>
                          <IconPart>
                            <img src={TickIcon} alt="tick icon" style={{ marginRight: '5px' }} />
                            <NewLabel
                              $size="14px"
                              $weight="600"
                              $height="20px"
                              $fontcolor="#027A48"
                            >
                              Tip
                            </NewLabel>
                          </IconPart>
                          <CrossDiv
                            onClick={() => {
                              setShowTip(false)
                            }}
                          >
                            <img src={TickCross} alt="tick cross" />
                          </CrossDiv>
                        </TipTop>
                        <NewLabel $size="14px" $height="20px" $weight="400" $fontcolor="#027A48">
                          For a quick guide on tracking yield sources in your Portfolio, check out
                          our 5-minute article &quot;
                          <a
                            href="https://docs.harvest.finance/general-info/yield-sources-on-harvest-how-to-get-and-track-them"
                            style={{ fontWeight: '600', color: '#027A48' }}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Yield Sources on Harvest &ndash; How to Track Them.
                          </a>
                          &quot;
                        </NewLabel>
                      </Tip>
                    </MyBalance>
                  }
                  <LastHarvestInfo $backcolor={bgColorNew} $bordercolor={borderColorBox}>
                    <NewLabel
                      $size={isMobile ? '12px' : '14px'}
                      $weight={isMobile ? '600' : '600'}
                      $height={isMobile ? '20px' : '24px'}
                      $fontcolor={fontColor4}
                      $padding={isMobile ? '10px 15px' : '10px 15px'}
                      $borderbottom={`1px solid ${borderColorBox}`}
                    >
                      Fees
                    </NewLabel>
                    {feeList.map((feeItem, index) => (
                      <FlexDiv
                        key={index}
                        $justifycontent="space-between"
                        $padding={isMobile ? '10px 15px' : '10px 15px'}
                      >
                        <NewLabel
                          $size={isMobile ? '12px' : '14px'}
                          $weight="500"
                          $height={isMobile ? '24px' : '24px'}
                          $fontcolor={fontColor3}
                        >
                          {feeItem.label}
                        </NewLabel>
                        <NewLabel
                          $size={isMobile ? '12px' : '14px'}
                          $weight="600"
                          $height={isMobile ? '24px' : '24px'}
                          $fontcolor={fontColor1}
                        >
                          {feeItem.value}
                        </NewLabel>
                      </FlexDiv>
                    ))}
                    {
                      <FlexDiv
                        $justifycontent="space-between"
                        $padding={isMobile ? '10px 15px' : '10px 15px'}
                      >
                        <NewLabel
                          $size={isMobile ? '13px' : '13px'}
                          $weight="300"
                          $height="normal"
                          $fontcolor={fontColor3}
                        >
                          The APY shown already considers the performance fee taken only from
                          generated yield and not deposits.
                        </NewLabel>
                        <NewLabel $display="flex" $self="center">
                          <PiQuestion className="question" data-tip id="tooltip-last-harvest" />
                          <Tooltip
                            id="tooltip-last-harvest"
                            anchorSelect="#tooltip-last-harvest"
                            backgroundColor={darkMode ? 'white' : '#101828'}
                            borderColor={darkMode ? 'white' : 'black'}
                            textColor={darkMode ? 'black' : 'white'}
                            place={isMobile ? 'left' : 'top'}
                          >
                            <NewLabel
                              $weight="500"
                              $size={isMobile ? '13px' : '13px'}
                              $height={isMobile ? '16px' : '16px'}
                            >
                              <FlexDiv $gap="15px" $justifycontent="space-between">
                                <div>Harvest Treasury</div>
                                <div>{token.isIPORVault ? '0' : harvestTreasury}%</div>
                              </FlexDiv>
                              <FlexDiv
                                $gap="15px"
                                $justifycontent="space-between"
                                $margintop="12px"
                              >
                                <div>Profit Sharing</div>
                                <div>{token.isIPORVault ? '0' : profitShare}%</div>
                              </FlexDiv>
                            </NewLabel>
                          </Tooltip>
                        </NewLabel>
                      </FlexDiv>
                    }
                  </LastHarvestInfo>
                  {token.isIPORVault && (
                    <LastHarvestInfo $backcolor={backColor} $bordercolor={borderColor}>
                      <NewLabel
                        $size={isMobile ? '12px' : '14px'}
                        $weight={isMobile ? '600' : '600'}
                        $height={isMobile ? '20px' : '24px'}
                        $fontcolor={fontColor4}
                        $padding={isMobile ? '10px 15px' : '10px 15px'}
                        $borderbottom="1px solid #F3F6FF"
                      >
                        Allocation
                      </NewLabel>
                      {token.allocPointData && token.allocPointData.length > 0 ? (
                        token.allocPointData.map((data, index) => {
                          let vaultName
                          if (data.hVaultId === 'Not invested') {
                            vaultName = `Deployment Buffer`
                          } else {
                            const vaultParts = data.hVaultId
                              .split('_')
                              .map((part, i) =>
                                i === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
                              )
                            vaultName = vaultParts
                              .filter(part => !part.toLowerCase().includes(chainName.toLowerCase()))
                              .join(' ')
                            if (vaultName === 'USDC' && chainName == 'base')
                              vaultName = 'Compound V3 USDC'
                            if (vaultName === 'USDC' && chainName == 'eth')
                              vaultName = 'Morpho GF USDC'
                            if (vaultName === 'WETH' && chainName == 'base')
                              vaultName = 'Compound V3 WETH'
                          }
                          return (
                            <FlexDiv
                              key={index}
                              $justifycontent="space-between"
                              $padding={isMobile ? '10px 15px' : '10px 15px'}
                            >
                              <NewLabel
                                $size="13.4px"
                                $height="20px"
                                $weight="500"
                                cursor="pointer"
                                $borderbottom="0.5px dotted white"
                                onClick={() => {
                                  const lcChainName = getChainNamePortals(tokenChain)
                                  return allVaultsData[data.hVaultId]?.vaultAddress
                                    ? window.open(
                                        `https://app.harvest.finance/${lcChainName}/${
                                          allVaultsData[data.hVaultId]?.vaultAddress
                                        }`,
                                        '_blank',
                                      )
                                    : null
                                }}
                              >
                                {vaultName}
                              </NewLabel>
                              <NewLabel $size="13.4px" $height="20px" $weight="500">
                                {Number(data.allocPoint).toFixed(2)}%
                              </NewLabel>
                            </FlexDiv>
                          )
                        })
                      ) : (
                        <></>
                      )}
                    </LastHarvestInfo>
                  )}
                  {isMobile && <SourceOfYield token={token} vaultPool={vaultPool} />}
                </RestInternal>
              ) : (
                <></>
              )}
            </RestContent>
          </InternalSection>
        </BigDiv>
      </Inner>
    </DetailView>
  )
}

export default AdvancedFarm
