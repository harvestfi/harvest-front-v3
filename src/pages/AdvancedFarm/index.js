import BigNumber from 'bignumber.js'
import { find, get, isEqual, isArray, isNaN } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import ReactHtmlParser from 'react-html-parser'
import ReactTooltip from 'react-tooltip'
import { RxCross2 } from 'react-icons/rx'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { ethers } from 'ethers'
import { BiLeftArrowAlt, BiInfoCircle } from 'react-icons/bi'
import { PiQuestion } from 'react-icons/pi'
import tokenMethods from '../../services/web3/contracts/token/methods'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import Diamond from '../../assets/images/logos/beginners/diamond.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
import History from '../../assets/images/logos/beginners/history.svg'
import AnimatedDots from '../../components/AnimatedDots'
import DepositBase from '../../components/AdvancedFarmComponents/Deposit/DepositBase'
import DepositSelectToken from '../../components/AdvancedFarmComponents/Deposit/DepositSelectToken'
import DepositStart from '../../components/AdvancedFarmComponents/Deposit/DepositStart'
import WithdrawBase from '../../components/AdvancedFarmComponents/Withdraw/WithdrawBase'
import WithdrawSelectToken from '../../components/AdvancedFarmComponents/Withdraw/WithdrawSelectToken'
import WithdrawStart from '../../components/AdvancedFarmComponents/Withdraw/WithdrawStart'
import FarmDetailChart from '../../components/DetailChart/FarmDetailChart'
import UserBalanceData from '../../components/UserBalanceChart/UserBalanceData'
import VaultPanelActionsFooter from '../../components/AdvancedFarmComponents/Rewards/VaultPanelActionsFooter'
import StakeBase from '../../components/AdvancedFarmComponents/Stake/StakeBase'
import StakeStart from '../../components/AdvancedFarmComponents/Stake/StakeStart'
import StakeResult from '../../components/AdvancedFarmComponents/Stake/StakeResult'
import UnstakeBase from '../../components/AdvancedFarmComponents/Unstake/UnstakeBase'
import UnstakeStart from '../../components/AdvancedFarmComponents/Unstake/UnstakeStart'
import UnstakeResult from '../../components/AdvancedFarmComponents/Unstake/UnstakeResult'
import EarningsHistory from '../../components/EarningsHistory/HistoryData'
import {
  AVRList,
  GECKO_URL,
  COINGECKO_API_KEY,
  DECIMAL_PRECISION,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  ROUTES,
  SPECIAL_VAULTS,
  BEGINNERS_BALANCES_DECIMALS,
  POOL_BALANCES_DECIMALS,
  MAX_DECIMALS,
  WIDO_BALANCES_DECIMALS,
} from '../../constants'
import { fromWei, newContractInstance, getWeb3, getExplorerLink } from '../../services/web3'
import { addresses } from '../../data'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import {
  displayAPY,
  getTotalApy,
  formatNumber,
  formatNumberWido,
  getAdvancedRewardText,
  getLastHarvestInfo,
} from '../../utils'
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
  MyTotalReward,
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
  InfoLabel,
  DescInfo,
  LastHarvestInfo,
  RestInternal,
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
  ValueBox,
  BoxTitle,
  BoxValue,
  NetDetailTitle,
  NetDetailContent,
  NetDetailImg,
  RewardValue,
} from './style'
import { CHAIN_IDS } from '../../data/constants'
// import { array } from 'prop-types'
import { usePortals } from '../../providers/Portals'

const chainList = [
  { id: 1, name: 'Ethereum', chainId: 1 },
  { id: 2, name: 'Polygon', chainId: 137 },
  { id: 3, name: 'Arbitrum', chainId: 42161 },
  { id: 4, name: 'Base', chainId: 8453 },
]

const getVaultValue = token => {
  const poolId = get(token, 'data.id')

  switch (poolId) {
    case SPECIAL_VAULTS.FARM_WETH_POOL_ID:
      return get(token, 'data.lpTokenData.liquidity')
    case SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID: {
      if (!get(token, 'data.lpTokenData.price')) {
        return null
      }

      return new BigNumber(get(token, 'data.totalValueLocked', 0))
    }
    case SPECIAL_VAULTS.FARM_GRAIN_POOL_ID:
    case SPECIAL_VAULTS.FARM_USDC_POOL_ID:
      return get(token, 'data.totalValueLocked')
    default:
      return token.usdPrice
        ? new BigNumber(token.underlyingBalanceWithInvestment.toString())
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

const getCoinListFromApi = async () => {
  try {
    const response = await axios.get(`${GECKO_URL}coins/list`, {
      headers: {
        'x-cg-pro-api-key': COINGECKO_API_KEY,
      },
    })
    return response.data
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
    return []
  }
}
const getTokenPriceFromApi = async tokenID => {
  try {
    const response = await axios.get(`${GECKO_URL}simple/price`, {
      params: {
        ids: tokenID,
        // eslint-disable-next-line camelcase
        vs_currencies: 'usd',
      },
      headers: {
        'x-cg-pro-api-key': COINGECKO_API_KEY,
      },
    })
    return response.data[tokenID].usd
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
    return null
  }
}

const AdvancedFarm = () => {
  const {
    darkMode,
    backColor,
    bgColor,
    borderColor,
    bgColorTooltip,
    fontColorTooltip,
    fontColor,
    fontColor1,
    fontColor2,
    fontColor3,
    fontColor4,
    fontColor6,
    linkColorTooltip,
    linkColorOnHover,
    hoverColor,
    bgColorFarm,
  } = useThemeContext()

  const { paramAddress } = useParams()
  const {
    getPortalsBaseTokens,
    getPortalsBalances,
    getPortalsSupport,
    SUPPORTED_TOKEN_LIST,
  } = usePortals()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const { push } = useHistory()
  const history = useHistory()

  const { pathname } = useLocation()
  const location = useLocation()
  const isFromEarningPage = location.search.includes('from=portfolio')

  const { vaultsData, loadingVaults } = useVaults()
  const { pools, userStats, fetchUserPoolStats } = usePools()
  const { connected, account, balances, getWalletBalances } = useWallet()
  const { profitShareAPY } = useStats()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')

  const [apiData, setApiData] = useState([])
  const [altVaultData, setAltVaultData] = useState({})

  useEffect(() => {
    const getCoinList = async () => {
      const data = await getCoinListFromApi()
      setApiData(data)
    }

    getCoinList()
  }, [])

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmWethPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        tokenAddress: addresses.FARM,
        vaultAddress: addresses.FARM,
        rewardSymbol: 'iFarm',
        tokenNames: ['FARM'],
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, ETH'], // 'FARM/ETH',
        platform: ['Uniswap'],
        data: farmWethPool,
        vaultAddress: addresses.FARM_WETH_LP,
        logoUrl: ['./icons/farm.svg', './icons/eth.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, GRAIN'], // 'FARM/GRAIN',
        platform: ['Uniswap'],
        data: farmGrainPool,
        vaultAddress: addresses.FARM_GRAIN_LP,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
      },
    }),
    [farmGrainPool, farmWethPool, farmProfitSharingPool, profitShareAPY],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }
  const vaultsKey = Object.keys(groupOfVaults)
  const vaultIds = vaultsKey.filter(
    vaultId =>
      groupOfVaults[vaultId].vaultAddress === paramAddress ||
      groupOfVaults[vaultId].tokenAddress === paramAddress,
  )
  const id = vaultIds[0]
  const token = groupOfVaults[id]

  const { logoUrl } = token

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  const tokenVault = get(vaultsData, token.hodlVaultId || id)

  const vaultPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))

  const farmAPY = get(vaultPool, 'totalRewardAPY', 0)
  const tradingApy = get(vaultPool, 'tradingApy', 0)
  const boostedEstimatedAPY = get(tokenVault, 'boostedEstimatedAPY', 0)
  const boostedRewardAPY = get(vaultPool, 'boostedRewardAPY', 0)
  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const chain = token.chain || token.data.chain

  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE]

  const [badgeId, setBadgeId] = useState(-1)
  useEffect(() => {
    const getBadge = () => {
      chainList.forEach((el, i) => {
        if (el.chainId === Number(chain)) {
          setBadgeId(i)
        }
      })
    }
    getBadge()
  }, [chain])

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const AVRVaultAddress = AVRList[paramAddress]

    if (AVRVaultAddress) {
      const matchingVault = Object.values(groupOfVaults).find(
        vault => vault.vaultAddress.toLowerCase() === AVRVaultAddress.toLowerCase(),
      )

      if (matchingVault) {
        setAltVaultData(matchingVault)
      }
    }
  }, [groupOfVaults, paramAddress])

  const useBeginnersFarm = false
  const useIFARM = id === FARM_TOKEN_SYMBOL
  const fAssetPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === tokens[id].vaultAddress)
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
  const lpTokenBalance = get(userStats, `[${fAssetPool.id}]['lpTokenBalance']`, 0)
  const totalStaked = get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)
  const lpTokenApprovedBalance = get(userStats, `[${fAssetPool.id}]['lpTokenApprovedBalance']`, 0)

  const tempPricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)
  const pricePerFullShare = fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals)

  const usdPrice =
    Number(token.vaultPrice) ||
    Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price) *
      Number(pricePerFullShare)
  const farmPrice = token.data && token.data.lpTokenData && token.data.lpTokenData.price
  const underlyingPrice =
    token.usdPrice || (token.data && token.data.lpTokenData && token.data.lpTokenData.price)

  // Switch Tag (Convert/Revert)
  const [activeDepo, setActiveDepo] = useState(true)
  const [showLodestarVaultInfo, setShowLodestarVaultInfo] = useState(false)
  const [showSeamlessVaultInfo, setShowSeamlessVaultInfo] = useState(false)
  const [showIFARMInfo, setShowIFARMInfo] = useState(false)
  const [supportedVault, setSupportedVault] = useState(false)
  const [hasPortalsError, setHasPortalsError] = useState(true)

  // Deposit
  const [depositStart, setDepositStart] = useState(false)
  const [selectTokenDepo, setSelectTokenDepo] = useState(false)
  const [balanceDepo, setBalanceDepo] = useState('0')
  const [pickedTokenDepo, setPickedTokenDepo] = useState({ symbol: 'Select Token' })
  const [inputAmountDepo, setInputAmountDepo] = useState('0')
  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')
  const [minReceiveAmountString, setMinReceiveAmountString] = useState('')
  const [minReceiveUsdAmount, setMinReceiveUsdAmount] = useState('')
  const [convertSuccess, setConvertSuccess] = useState(false)
  const [hasErrorOccurredConvert, setHasErrorOccurredConvert] = useState(0)
  const [failureCountConvert, setFailureCountConvert] = useState(0)

  // Withdraw
  const [withdrawStart, setWithdrawStart] = useState(false)
  const [selectTokenWith, setSelectTokenWith] = useState(false)
  const [unstakeBalance, setUnstakeBalance] = useState('0')
  const [pickedTokenWith, setPickedTokenWith] = useState({ symbol: 'Select' })
  const [unstakeInputValue, setUnstakeInputValue] = useState('0')
  const [revertFromInfoAmount, setRevertFromInfoAmount] = useState('')
  const [revertFromInfoUsdAmount, setRevertFromInfoUsdAmount] = useState('')
  const [revertMinReceivedAmount, setRevertMinReceivedAmount] = useState('')
  const [revertMinReceivedUsdAmount, setRevertMinReceivedUsdAmount] = useState('')
  const [revertSuccess, setRevertSuccess] = useState(false)
  const [hasErrorOccurredRevert, setHasErrorOccurredRevert] = useState(0)

  // Stake
  const [stakeStart, setStakeStart] = useState(false)
  const [inputAmountStake, setInputAmountStake] = useState('0')
  const [stakeFinalStep, setStakeFinalStep] = useState(false)

  // Unstake
  const [unstakeStart, setUnstakeStart] = useState(false)
  const [inputAmountUnstake, setInputAmountUnstake] = useState('0')
  const [unstakeFinalStep, setUnstakeFinalStep] = useState(false)
  const [amountsToExecuteUnstake, setAmountsToExecuteUnstake] = useState('')

  const [yieldDaily, setYieldDaily] = useState(0)
  const [yieldMonthly, setYieldMonthly] = useState(0)
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
  const switchStakeMethod = () => setActiveStake(prev => !prev)

  const [totalValue, setTotalValue] = useState(0)
  const [depositedValueUSD, setDepositUsdValue] = useState(0)
  const [balanceAmount, setBalanceAmount] = useState(0)
  const [totalReward, setTotalReward] = useState(0)
  const [rewardTokenPrices, setRewardTokenPrices] = useState([])
  const [stakedAmount, setStakedAmount] = useState(0)
  const [unstakedAmount, setUnstakedAmount] = useState(0)
  const [underlyingEarnings, setUnderlyingEarnings] = useState('0')
  const [usdEarnings, setUsdEarnings] = useState('0')

  const mainTags = [
    { name: 'Manage', img: Safe },
    { name: 'Rewards', img: Diamond },
    { name: 'Details', img: BarChart },
    { name: 'History', img: History },
  ]

  // Show vault info badge when platform is 'Lodestar' or 'Harvest' and first visit
  useEffect(() => {
    const platform = useIFARM ? 'Harvest' : token.platform?.[0]?.toLowerCase() ?? ''
    const firstViewIFarm = localStorage.getItem('firstViewIFarm')
    const firstViewLodestar = localStorage.getItem('firstViewLodestar')
    const firstViewSeamless = localStorage.getItem('firstViewSeamless')
    if (platform === 'Harvest' && (firstViewIFarm === null || firstViewIFarm === 'true')) {
      localStorage.setItem('firstViewIFarm', true)
      setShowIFARMInfo(true)
    } else if (
      platform.includes('lodestar') &&
      (firstViewLodestar === null || firstViewLodestar === 'true')
    ) {
      localStorage.setItem('firstViewLodestar', true)
      setShowLodestarVaultInfo(true)
    } else if (
      platform.includes('seamless') &&
      (firstViewSeamless === null || firstViewSeamless === 'true')
    ) {
      localStorage.setItem('firstViewSeamless', true)
      setShowSeamlessVaultInfo(true)
    }
  }, [token.platform, useIFARM])

  const closeIFARMBadge = () => {
    setShowIFARMInfo(false)
    localStorage.setItem('firstViewIFarm', 'false')
  }
  const closeBadgeLodestar = () => {
    setShowLodestarVaultInfo(false)
    localStorage.setItem('firstViewLodestar', 'false')
  }

  const closeBadgeSeamless = () => {
    setShowSeamlessVaultInfo(false)
    localStorage.setItem('firstViewSeamless', 'false')
  }

  useEffect(() => {
    async function fetchData() {
      const tokenAddress = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
      const chainId = token.chain

      const portalsToken = await getPortalsSupport(chainId, tokenAddress)

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

    fetchData()
    // eslint-disable-next-line
  }, [token])

  useEffect(() => {
    let staked,
      unstaked,
      total,
      amountBalanceUSD,
      totalRewardAPRByPercent = 0
    if (useIFARM) {
      staked = Number(
        fromWei(
          get(balances, IFARM_TOKEN_SYMBOL, 0),
          tokens[IFARM_TOKEN_SYMBOL].decimals,
          MAX_DECIMALS,
          true,
        ),
      )
      unstaked = Number(
        fromWei(
          get(balances, FARM_TOKEN_SYMBOL, 0),
          tokens[FARM_TOKEN_SYMBOL].decimals,
          MAX_DECIMALS,
          true,
        ),
      )
      total = staked
      amountBalanceUSD = total * usdPrice
    } else {
      staked =
        totalStaked && fromWei(totalStaked, fAssetPool.lpTokenData.decimals, MAX_DECIMALS, true)

      unstaked =
        lpTokenBalance &&
        fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals, MAX_DECIMALS, true)

      total = Number(staked) + Number(unstaked)
      amountBalanceUSD = total * usdPrice
    }
    setStakedAmount(Number(staked))
    setUnstakedAmount(Number(unstaked))
    setTotalValue(total)
    setBalanceAmount(amountBalanceUSD)

    const estimatedApyByPercent = get(tokenVault, `estimatedApy`, 0)
    const estimatedApy = estimatedApyByPercent / 100
    const vaultAPR = ((1 + estimatedApy) ** (1 / 365) - 1) * 365
    const vaultAPRDaily = vaultAPR / 365
    const vaultAPRMonthly = vaultAPR / 12

    for (let j = 0; j < fAssetPool.rewardAPR?.length; j += 1) {
      totalRewardAPRByPercent += Number(fAssetPool.rewardAPR[j])
    }
    const totalRewardAPR = totalRewardAPRByPercent / 100
    const poolAPRDaily = totalRewardAPR / 365
    const poolAPRMonthly = totalRewardAPR / 12

    const swapFeeAPRYearly = (fAssetPool.tradingApy ? fAssetPool.tradingApy : 0) / 100
    const swapFeeAPRDaily = swapFeeAPRYearly / 365
    const swapFeeAPRMonthly = swapFeeAPRYearly / 12

    const dailyYield =
      Number(staked) * usdPrice * (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily) +
      Number(unstaked) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
    const monthlyYield =
      Number(staked) * usdPrice * (vaultAPRMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
      Number(unstaked) * usdPrice * (vaultAPRMonthly + swapFeeAPRMonthly)
    setYieldDaily(dailyYield)
    setYieldMonthly(monthlyYield)
    // eslint-disable-next-line
  }, [fAssetPool, tokenVault, usdPrice, lpTokenBalance, totalStaked])

  useEffect(() => {
    const convertMonthlyYieldValue =
      (Number(minReceiveAmountString) * Number(usdPrice) * (Number(totalApy) / 100)) / 12
    const convertDailyYieldYieldValue =
      (Number(minReceiveAmountString) * Number(usdPrice) * (Number(totalApy) / 100)) / 365
    setConvertMonthlyYieldUSD(convertMonthlyYieldValue.toString())
    setConvertDailyYieldUSD(convertDailyYieldYieldValue.toString())
  }, [minReceiveAmountString, usdPrice, totalApy])

  useEffect(() => {
    const getTokenBalance = async () => {
      try {
        if (chain && account && Object.keys(balances).length !== 0) {
          if (!hasPortalsError) {
            let supList = [],
              directInSup = {},
              directInBalance = {}

            const portalsRawBalances = await getPortalsBalances(account, chain.toString())
            const portalsBaseTokens = await getPortalsBaseTokens(chain.toString())
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
                    chainId: chain,
                  }
                  return item
                }

                return null
              })
              .filter(item => item !== null)

            const curBalances = portalsRawBalances
              .map(balance => {
                if (!ethers.utils.isAddress(balance.address))
                  balance.address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                const item = {
                  symbol: balance.symbol,
                  address: balance.address,
                  balance: new BigNumber(balance.rawBalance).div(10 ** balance.decimals).toFixed(),
                  rawBalance: balance.rawBalance,
                  default: false,
                  usdValue: balance.balanceUSD,
                  usdPrice: balance.price,
                  logoURI: balance.image
                    ? balance.image
                    : balance.images
                    ? balance.images[0]
                    : 'https://etherscan.io/images/main/empty-token.png',
                  decimals: balance.decimals,
                  chainId: chain,
                }
                return item
              })
              .filter(item => item.address)

            const tokenAddress =
              token.tokenAddress !== undefined && token.tokenAddress.length !== 2
                ? token.tokenAddress
                : token.vaultAddress

            const fTokenAddr = useIFARM
              ? addresses.iFARM
              : token.vaultAddress
              ? token.vaultAddress
              : token.tokenAddress
            const curSortedBalances = curBalances
              .sort(function reducer(a, b) {
                return b.usdValue - a.usdValue
              })
              .filter(item => item.address.toLowerCase() !== fTokenAddr.toLowerCase())

            // setBalanceList(
            //   curSortedBalances.filter(
            //     item => item.address.toLowerCase() !== tokenAddress.toLowerCase(),
            //   ),
            // )
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

              if (Object.keys(directInSup).length === 0 && tokenAddress.length !== 2) {
                if (sup.address.toLowerCase() === tokenAddress.toLowerCase()) {
                  directInSup = sup
                }
              }
              return sup
            })

            supList = supList.sort(function reducer(a, b) {
              return b.usdValue - a.usdValue
            })
            for (let j = 0; j < curBalances.length; j += 1) {
              if (Object.keys(directInBalance).length === 0 && tokenAddress.length !== 2) {
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
              : balances[id]
              ? new BigNumber(balances[id]).div(10 ** token.decimals).toFixed()
              : '0'
            const directUsdPrice = token.usdPrice
            const directUsdValue = directData
              ? directData.usdValue
              : new BigNumber(directBalance).times(directUsdPrice).toFixed()

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
              !(Object.keys(directInBalance).length === 0 && directInBalance.constructor === Object)
            ) {
              directInBalance.balance = directBalance || '0'
              directInBalance.usdPrice =
                directInBalance.usdPrice > 0 ? directInBalance.usdPrice : directUsdPrice
              directInBalance.usdValue =
                directInBalance.usdValue > 0 ? directInBalance.usdValue : directUsdValue
              supList.unshift(directInBalance)
              supList[0].default = true
            } else {
              const web3Client = await getWeb3(chain, null)
              const { getSymbol } = tokenMethods
              const lpInstance = await newContractInstance(
                id,
                tokenAddress,
                tokenContract.abi,
                web3Client,
              )
              const lpSymbol = await getSymbol(lpInstance)
              const direct = {
                symbol: lpSymbol,
                address: tokenAddress,
                balance: directBalance || '0',
                default: true,
                usdPrice: directUsdPrice || '0',
                usdValue: directUsdValue || '0',
                logoURI: 'https://etherscan.io/images/main/empty-token.png',
                decimals: tokenDecimals,
                chainId: parseInt(chain, 0),
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

            const supNoBalanceList = []
            if (supList.length > 0) {
              for (let i = 0; i < supList.length; i += 1) {
                if (Number(supList[i].balance) === 0) {
                  supNoBalanceList.push(supList[i])
                }
              }
            }
            supNoBalanceList.shift()
            setSupTokenNoBalanceList(supNoBalanceList)

            // const soonSupList = []
            // for (let j = 0; j < curBalances.length; j += 1) {
            //   const supToken = supList.find(el => el.address === curBalances[j].address)
            //   if (!supToken) {
            //     soonSupList.push(curBalances[j])
            //   }

            //   if (Object.keys(directInBalance).length === 0 && tokenAddress.length !== 2) {
            //     if (curBalances[j].address.toLowerCase() === tokenAddress.toLowerCase()) {
            //       directInBalance = curBalances[j]
            //     }
            //   }
            // }
            // setSoonToSupList(soonSupList)
            setSoonToSupList({}) // TODO: remove soonToSupList once confirmed
          } else {
            let tokenSymbol,
              decimals = 18

            decimals = useIFARM ? token.data?.watchAsset?.decimals : token.decimals
            tokenSymbol = useIFARM ? token.tokenNames[0] : token?.pool?.lpTokenData?.symbol
            if (tokenSymbol && tokenSymbol.substring(0, 1) === 'f') {
              tokenSymbol = tokenSymbol.substring(1)
            }
            // const tokenAddress = useIFARM ? addresses.iFARM : token.tokenAddress
            const tokenAddress = token.tokenAddress
            const tokenId = token?.pool?.id
            const tokenBalance = fromWei(
              balances[useIFARM ? tokenSymbol : tokenId],
              decimals,
              decimals,
            )
            const tokenPrice = useIFARM ? token?.data?.lpTokenData?.price : token.usdPrice
            const usdValue = formatNumberWido(
              Number(tokenBalance) * Number(tokenPrice),
              BEGINNERS_BALANCES_DECIMALS,
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
              chainId: useIFARM ? token.data.chain : token.chain,
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
  }, [
    account,
    chain,
    balances,
    hasPortalsError,
    convertSuccess,
    revertSuccess,
    getPortalsBalances,
    getPortalsBaseTokens,
    id,
    token,
    tokenDecimals,
    useIFARM,
  ])

  // To calculate Est. values again when input token is changed
  useEffect(() => {
    setFailureCountConvert(0)
  }, [pickedTokenDepo])

  useEffect(() => {
    if (defaultToken !== null) {
      let tokenToSet = null

      // Check if defaultToken is present in the balanceList
      if (defaultToken.balance !== '0' || !supportedVault || hasPortalsError) {
        setPickedTokenDepo(defaultToken)
        setBalanceDepo(defaultToken.balance)
        return
      }

      // If defaultToken is not found, find the token with the highest USD value among those in the SUPPORTED_TOKEN_LIST and balanceList
      const supportedTokens = balanceList.filter(
        balancedToken => SUPPORTED_TOKEN_LIST[chain][balancedToken.symbol],
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
        setPickedTokenDepo(tokenToSet)
        setBalanceDepo(
          fromWei(
            tokenToSet.rawBalance ? tokenToSet.rawBalance : 0,
            tokenToSet.decimals,
            tokenToSet.decimals,
          ),
        )
      }
    } else if (supTokenList.length !== 0) {
      setPickedTokenDepo(supTokenList.find(coin => coin.symbol === 'USDC'))
      setBalanceDepo('0')
    }
  }, [
    balanceList,
    supTokenList,
    defaultToken,
    chain,
    SUPPORTED_TOKEN_LIST,
    supportedVault,
    hasPortalsError,
  ])

  const firstUserPoolsLoad = useRef(true)
  const firstWalletBalanceLoad = useRef(true)

  const totalRewardsEarned = get(userStats, `[${fAssetPool.id}]['totalRewardsEarned']`, 0)
  const rewardsEarned = get(userStats, `[${fAssetPool.id}]['rewardsEarned']`, 0)

  const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])

  useEffect(() => {
    const fetchTokenPrices = async () => {
      const usdPrices = []

      for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
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
          // Let us get usdPrice of FARM from IFARM, for when no lpTokenData in FARM vault data(when reloading in Advanced farm)
          rewardToken = groupOfVaults[IFARM_TOKEN_SYMBOL]
        } else {
          rewardToken = groupOfVaults[rewardSymbol]
        }

        if (rewardToken) {
          const usdUnderlyingRewardPrice = rewardToken.usdPrice || 0
          const pricePerFullShareInVault = rewardToken.pricePerFullShare
          const decimalsInVault = rewardToken.decimals || 18
          usdRewardPrice =
            rewardSymbol === IFARM_TOKEN_SYMBOL
              ? Number(usdUnderlyingRewardPrice)
              : rewardSymbol === FARM_TOKEN_SYMBOL
              ? Number(usdUnderlyingRewardPrice) /
                fromWei(pricePerFullShareInVault, decimalsInVault, decimalsInVault, true)
              : Number(usdUnderlyingRewardPrice) *
                fromWei(pricePerFullShareInVault, decimalsInVault, decimalsInVault, true)
        } else {
          try {
            for (let ids = 0; ids < apiData.length; ids += 1) {
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
        // console.log('USD Vault Price of ', rewardSymbol, ':', usdRewardPrice)
        usdPrices.push(usdRewardPrice)

        setRewardTokenPrices(usdPrices)
      }
    }

    fetchTokenPrices()
    // eslint-disable-next-line
  }, [apiData, pricePerFullShare, rewardTokenSymbols])

  useEffect(() => {
    const calculateTotalReward = () => {
      let totalRewardSum = 0
      for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
        const rewardDecimal = get(tokens[rewardTokenSymbols[l]], 'decimals', 18)

        const totalRewardUsd =
          rewardTokenSymbols.length === 1
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
      setTotalReward(totalRewardSum)
    }

    calculateTotalReward()
    // eslint-disable-next-line
  }, [account, userStats, fAssetPool, rewardsEarned, totalRewardsEarned, rewardTokenSymbols])

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
          const poolsToLoad = [fAssetPool]
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

  // Switch Deposit / Withdraw
  const switchDepoMethod = () => setActiveDepo(prev => !prev)

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
    }
  }, [curUrl])

  useEffect(() => {
    const getLastHarvest = async () => {
      const value = await getLastHarvestInfo(paramAddress, chain)
      setLastHarvest(value)
    }

    getLastHarvest()
  }, [paramAddress, chain])

  useEffect(() => {
    setVaultValue(getVaultValue(token))
  }, [token])

  useEffect(() => {
    const depositUsdValue = formatNumber(
      fromWei(lpTokenBalance, fAssetPool?.lpTokenData?.decimals, POOL_BALANCES_DECIMALS, true) *
        usdPrice,
      POOL_BALANCES_DECIMALS,
    )
    setDepositUsdValue(depositUsdValue)
  }, [lpTokenBalance, fAssetPool, usdPrice])

  const apyDaily = totalApy
    ? (((Number(totalApy) / 100 + 1) ** (1 / 365) - 1) * 100).toFixed(3)
    : null

  const showAPY = () => {
    return (
      <>
        {isSpecialVault ? (
          token.data &&
          token.data.loaded &&
          (token.data.dataFetched === false || totalApy !== null) ? (
            <div>{token.inactive ? 'Inactive' : <>{totalApy ? displayAPY(totalApy) : null}</>}</div>
          ) : (
            <div>
              <AnimatedDots />
            </div>
          )
        ) : vaultPool.loaded && totalApy !== null && !loadingVaults ? (
          <div>
            {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
              token.inactive || token.testInactive ? (
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
        {token.excludeVaultStats ? (
          'N/A'
        ) : vaultValue ? (
          <>${formatNumber(vaultValue, 2)}</>
        ) : (
          <AnimatedDots />
        )}
      </>
    )
  }

  const showApyDaily = () => {
    return (
      <>
        {isSpecialVault ? (
          token.data &&
          token.data.loaded &&
          (token.data.dataFetched === false || totalApy !== null) ? (
            <div>{token.inactive ? 'Inactive' : <>{totalApy ? `${apyDaily}%` : null}</>}</div>
          ) : (
            <AnimatedDots />
          )
        ) : vaultPool.loaded && totalApy !== null && !loadingVaults ? (
          <div>
            {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
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
      showValue: () => (useIFARM ? '-' : lastHarvest !== '' ? `${lastHarvest} ago` : '-'),
      className: 'daily-yield-box',
    },
  ]

  const rewardTxt = getAdvancedRewardText(
    token,
    vaultPool,
    tradingApy,
    farmAPY,
    totalApy,
    true,
    boostedEstimatedAPY,
    boostedRewardAPY,
  )

  const profitShare =
    chain === CHAIN_IDS.ETH_MAINNET ? '10' : chain === CHAIN_IDS.POLYGON_MAINNET ? '5' : '7'
  const harvestTreasury =
    chain === CHAIN_IDS.ETH_MAINNET ? '5' : chain === CHAIN_IDS.POLYGON_MAINNET ? '3' : '3'

  const setLoadingDots = (loadingFarm, loadingLp) => {
    setFarmingLoading(loadingFarm)
    setLpStatsloading(loadingLp)
  }

  const viewComponentProps = {
    token,
    tokenDecimals,
    isSpecialVault,
    fAssetPool,
    rewardTokenPrices,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    pendingAction,
    setLoadingDots,
    setPendingAction,
    loaded,
    totalRewardsEarned,
  }

  return (
    <DetailView bgColor={bgColor} fontColor={fontColor}>
      <TopInner bgColorFarm={bgColorFarm}>
        <TopPart>
          <FlexTopDiv>
            <TopButton className="back-btn">
              <BackBtnRect
                fontColor={fontColor}
                onClick={() => {
                  if (isFromEarningPage) {
                    history.push(ROUTES.PORTFOLIO)
                  } else {
                    history.push(`${ROUTES.ADVANCED}${location.search}`)
                  }
                }}
              >
                <BiLeftArrowAlt fontSize={16} />
                <BackText fontColor={fontColor}>Back</BackText>
              </BackBtnRect>
              {isMobile && (
                <MobileChain>
                  <NetDetailItem>
                    <NetDetailContent fontColor={fontColor}>
                      {useIFARM ? 'Harvest' : token.platform && token.platform[0]}
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
                weight={600}
                fontColor2={fontColor2}
                size={isMobile ? '19.7px' : '25px'}
                height={isMobile ? '45px' : '82px'}
                marginBottom={isMobile ? '5px' : '10px'}
              >
                {useIFARM ? `i${token.tokenNames.join(' • ')}` : token.tokenNames.join(' • ')}
              </TopDesc>
            </FlexDiv>
            <GuideSection>
              <GuidePart fontColor4={fontColor4}>
                {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                &nbsp;APY
              </GuidePart>
              <GuidePart fontColor4={fontColor4}>
                {showTVL()}
                &nbsp;TVL
              </GuidePart>
            </GuideSection>
            <TabRow>
              <MainTagPanel>
                {mainTags.map((tag, i) => (
                  <MainTag
                    key={i}
                    fontColor3={fontColor3}
                    fontColor4={fontColor4}
                    bgColor={bgColor}
                    bgColorFarm={bgColorFarm}
                    active={activeMainTag === i ? 'true' : 'false'}
                    mode={darkMode ? 'dark' : 'light'}
                    useIFARM={useIFARM}
                    onClick={() => {
                      setActiveMainTag(i)
                      if (i !== 0) {
                        push(`${pathname}${location.search}#${tag.name.toLowerCase()}`)
                      } else {
                        push(`${pathname}${location.search}`)
                      }
                    }}
                  >
                    <img src={tag.img} alt="logo" />
                    <p>{tag.name}</p>
                  </MainTag>
                ))}
              </MainTagPanel>
              <NetDetail>
                <NetDetailItem>
                  <NetDetailTitle fontColor={fontColor}>Platform:</NetDetailTitle>
                  <NetDetailContent fontColor={fontColor}>
                    {useIFARM ? 'Harvest' : token.platform && token.platform[0]}
                  </NetDetailContent>
                </NetDetailItem>
                <NetDetailItem>
                  <NetDetailTitle fontColor={fontColor}>Network</NetDetailTitle>
                  <NetDetailImg fontColor={fontColor}>
                    <img src={BadgeAry[badgeId]} alt="" />
                  </NetDetailImg>
                </NetDetailItem>
              </NetDetail>
            </TabRow>
          </FlexTopDiv>
        </TopPart>
      </TopInner>
      <Inner>
        <BigDiv>
          <InternalSection>
            {activeMainTag === 0 ? (
              <>
                {showLodestarVaultInfo ? (
                  <WelcomeBox
                    bgColorTooltip={bgColorTooltip}
                    fontColorTooltip={fontColorTooltip}
                    borderColor={borderColor}
                  >
                    <BiInfoCircle className="info-circle" fontSize={20} />
                    <WelcomeContent>
                      <WelcomeTitle>Vault Note</WelcomeTitle>
                      <WelcomeText>
                        The Lodestar team replenishes their markets with ARB incentives weekly,
                        using random snapshots, until March 31, 2024. We have recently updated the
                        ARB reward distribution for Lodestar strategies, transitioning to a linear
                        liquidation of rewards throughout the week. This shift prevents
                        disproportional gain through short-term deposits and ensures a fair, steady
                        distribution of rewards for all farmers.
                        <WelcomeBottom>
                          <WelcomeKnow onClick={closeBadgeLodestar}>Got it!</WelcomeKnow>
                          <WelcomeTicket
                            href="https://discord.com/invite/gzWAG3Wx7Y"
                            target="_blank"
                            rel="noopener noreferrer"
                            linkColor={linkColorTooltip}
                            linkColorOnHover={linkColorOnHover}
                          >
                            Still having questions? Open Discord ticket.
                          </WelcomeTicket>
                        </WelcomeBottom>
                      </WelcomeText>
                    </WelcomeContent>
                    <WelcomeClose>
                      <RxCross2 onClick={closeBadgeLodestar} />
                    </WelcomeClose>
                  </WelcomeBox>
                ) : showSeamlessVaultInfo ? (
                  <WelcomeBox
                    bgColorTooltip={bgColorTooltip}
                    fontColorTooltip={fontColorTooltip}
                    borderColor={borderColor}
                  >
                    <BiInfoCircle className="info-circle" fontSize={20} />
                    <WelcomeContent>
                      <WelcomeTitle>Vault Note</WelcomeTitle>
                      <WelcomeText>
                        <p>
                          Due to new tokenomics introduced by the Seamless project after the launch
                          of this farm, Harvest is not able to maintain it. We have deactivated the
                          vault and Harvest has covered the value of the locked esSEAM tokens for
                          all users of this vault. Farmers can revert funds at any time. More info
                          can be found in our Discord&apos;s #vault-updates.
                        </p>
                        <p>
                          Looking for alternatives? Check out these single-asset{' '}
                          <WelcomeTicket
                            href="https://app.harvest.finance/farms?search=moonwell"
                            target="_self"
                            rel="noopener noreferrer"
                            linkColor={linkColorTooltip}
                            linkColorOnHover={linkColorOnHover}
                          >
                            Moonwell farms
                          </WelcomeTicket>
                          , which are on Base and have similar reward rates.
                        </p>
                        <WelcomeBottom>
                          <WelcomeKnow onClick={closeBadgeSeamless}>Got it!</WelcomeKnow>
                          <WelcomeTicket
                            href="https://discord.com/invite/gzWAG3Wx7Y"
                            target="_blank"
                            rel="noopener noreferrer"
                            linkColor={linkColorTooltip}
                            linkColorOnHover={linkColorOnHover}
                          >
                            Still having questions? Open Discord ticket.
                          </WelcomeTicket>
                        </WelcomeBottom>
                      </WelcomeText>
                    </WelcomeContent>
                    <WelcomeClose>
                      <RxCross2 onClick={closeBadgeSeamless} />
                    </WelcomeClose>
                  </WelcomeBox>
                ) : showIFARMInfo ? (
                  <WelcomeBox
                    bgColorTooltip={bgColorTooltip}
                    fontColorTooltip={fontColorTooltip}
                    borderColor={borderColor}
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
                          linkColor={linkColorTooltip}
                          linkColorOnHover={linkColorOnHover}
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
                    backColor={backColor}
                    borderColor={borderColor}
                    marginBottom={isMobile ? '20px' : '25px'}
                    marginTop={isMobile ? '0px' : '0'}
                    height={isMobile ? 'unset' : '120px'}
                  >
                    <NewLabel
                      display="flex"
                      justifyContent="space-between"
                      size={isMobile ? '12px' : '12px'}
                      weight="600"
                      height={isMobile ? '20px' : '20px'}
                      color={fontColor4}
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                      borderBottom="1px solid #F2F5FF"
                    >
                      Lifetime Earnings
                      <PiQuestion
                        className="question"
                        data-tip
                        data-for="tooltip-lifetime-earning"
                      />
                      <ReactTooltip
                        id="tooltip-lifetime-earning"
                        backgroundColor="#101828"
                        borderColor="black"
                        textColor="white"
                      >
                        <NewLabel
                          size={isMobile ? '12px' : '12px'}
                          height={isMobile ? '18px' : '18px'}
                          weight="500"
                          color="white"
                        >
                          Your lifetime earnings in this farm expressed in USD and Underlying token.
                          USD value is subject to market fluctuations. Claimable rewards are not
                          part of this estimation.
                          <br />
                          <br />
                          Underlying is subject to auto-compounding events.
                        </NewLabel>
                      </ReactTooltip>
                    </NewLabel>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        display="flex"
                        size={isMobile ? '12px' : '12px'}
                        weight="500"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor3}
                      >
                        in USD
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="600"
                        color={fontColor1}
                      >
                        ${usdEarnings}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="500"
                        color={fontColor3}
                        self="center"
                      >
                        Underlying
                      </NewLabel>
                      <NewLabel
                        weight="600"
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor1}
                        self="center"
                        fontColor2={fontColor2}
                        position="relative"
                        align="right"
                        marginBottom={isMobile ? '12px' : '0px'}
                      >
                        {underlyingEarnings}
                        <br />
                        <span className="symbol">{id}</span>
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  <MyBalance
                    backColor={backColor}
                    borderColor={borderColor}
                    marginBottom={isMobile ? '20px' : '25px'}
                    marginTop={isMobile ? '0px' : '0'}
                    height={isMobile ? 'unset' : '120px'}
                  >
                    <NewLabel
                      display="flex"
                      justifyContent="space-between"
                      size={isMobile ? '12px' : '12px'}
                      weight="600"
                      height={isMobile ? '20px' : '20px'}
                      color={fontColor4}
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                      borderBottom="1px solid #F2F5FF"
                    >
                      Total Balance
                      <PiQuestion className="question" data-tip data-for="tooltip-total-balance" />
                      <ReactTooltip
                        id="tooltip-total-balance"
                        backgroundColor="#101828"
                        borderColor="black"
                        textColor="white"
                      >
                        <NewLabel
                          size={isMobile ? '12px' : '12px'}
                          height={isMobile ? '18px' : '18px'}
                          weight="500"
                          color="white"
                        >
                          Total Balance reflects the fTokens in connected wallet, alongside their
                          USD value, which can change with the market.
                          <br />
                          <br />
                          The fToken count stays the same unless you revert or convert more crypto
                          in the farm.
                        </NewLabel>
                      </ReactTooltip>
                    </NewLabel>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        display="flex"
                        size={isMobile ? '12px' : '12px'}
                        weight="500"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor3}
                      >
                        in USD
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="600"
                        color={fontColor1}
                      >
                        {!connected ? (
                          '$0.00'
                        ) : lpTokenBalance ? (
                          balanceAmount === 0 ? (
                            '$0.00'
                          ) : balanceAmount < 0.01 ? (
                            '<$0.01'
                          ) : (
                            `$${formatNumber(balanceAmount, 2)}`
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="500"
                        color={fontColor3}
                        self="center"
                      >
                        fToken
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="600"
                        color={fontColor1}
                        fontColor2={fontColor2}
                        position="relative"
                        align="right"
                        marginBottom={isMobile ? '12px' : '0px'}
                      >
                        {!connected ? (
                          0
                        ) : lpTokenBalance ? (
                          totalValue === 0 ? (
                            '0.00'
                          ) : (
                            totalValue
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                        <br />
                        <span className="symbol">{useIFARM ? `i${id}` : `f${id}`}</span>
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  <MyBalance
                    backColor={backColor}
                    borderColor={borderColor}
                    marginBottom={isMobile ? '20px' : '25px'}
                    marginTop={isMobile ? '0px' : '0'}
                    height={isMobile ? 'unset' : '120px'}
                  >
                    <NewLabel
                      display="flex"
                      justifyContent="space-between"
                      size={isMobile ? '12px' : '12px'}
                      weight="600"
                      height={isMobile ? '20px' : '20px'}
                      color={fontColor4}
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                      borderBottom="1px solid #F2F5FF"
                    >
                      Yield Estimates
                      <PiQuestion className="question" data-tip data-for="tooltip-yield-estimate" />
                      <ReactTooltip
                        id="tooltip-yield-estimate"
                        backgroundColor="#101828"
                        borderColor="black"
                        textColor="white"
                      >
                        <NewLabel
                          size={isMobile ? '12px' : '12px'}
                          height={isMobile ? '18px' : '18px'}
                          weight="500"
                          color="white"
                        >
                          Estimated yield on your fTokens of this farm, denominated in USD. Subject
                          to market fluctuations.
                          <br />
                          Note: frequency of auto-compounding events vary, so take these numbers as
                          rough guides, not exact figures.
                        </NewLabel>
                      </ReactTooltip>
                    </NewLabel>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        display="flex"
                        size={isMobile ? '12px' : '12px'}
                        weight="500"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor3}
                      >
                        Daily
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="600"
                        color={fontColor1}
                      >
                        {!connected
                          ? '$0.00'
                          : isNaN(yieldDaily)
                          ? '$0.00'
                          : yieldDaily === 0
                          ? '$0.00'
                          : yieldDaily < 0.01
                          ? '<$0.01'
                          : `$${formatNumber(yieldDaily, 2)}`}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="500"
                        color={fontColor3}
                        self="center"
                      >
                        Monthly
                      </NewLabel>
                      <NewLabel
                        weight="600"
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor1}
                        self="center"
                      >
                        {!connected
                          ? '$0.00'
                          : isNaN(yieldMonthly)
                          ? '$0.00'
                          : yieldMonthly === 0
                          ? '$0.00'
                          : yieldMonthly < 0.01
                          ? '<$0.01'
                          : `$${formatNumber(yieldMonthly, 2)}`}
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                </ManageBoxWrapper>
              </>
            ) : activeMainTag === 2 ? (
              <BoxCover borderColor={borderColor}>
                {detailBoxes.map(({ title, showValue, className }, index) => (
                  <ValueBox
                    key={index}
                    width="24%"
                    className={className}
                    backColor={backColor}
                    borderColor={borderColor}
                  >
                    <BoxTitle fontColor3={fontColor3}>{title}</BoxTitle>
                    <BoxValue fontColor1={fontColor1}>{showValue()}</BoxValue>
                  </ValueBox>
                ))}
              </BoxCover>
            ) : activeMainTag === 3 ? (
              <EarningsHistory
                token={token}
                tokenSymbol={id}
                vaultPool={vaultPool}
                setUnderlyingEarnings={setUnderlyingEarnings}
                setUsdEarnings={setUsdEarnings}
              />
            ) : (
              <></>
            )}
            <MainSection height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                !isMobile && (
                  <UserBalanceData
                    token={token}
                    vaultPool={vaultPool}
                    totalValue={totalValue}
                    useIFARM={useIFARM}
                    farmPrice={farmPrice}
                    underlyingPrice={underlyingPrice}
                    pricePerFullShare={pricePerFullShare}
                  />
                )
              ) : activeMainTag === 1 ? (
                <>
                  <MyTotalReward
                    marginBottom={isMobile ? '20px' : '25px'}
                    backColor={backColor}
                    borderColor={borderColor}
                  >
                    <BoxTitle fontColor3={fontColor3}>Rewards</BoxTitle>
                    <RewardValue>
                      <BoxValue fontColor1={fontColor1}>
                        {!connected ? (
                          0
                        ) : userStats ? (
                          totalReward === 0 ? (
                            '$0.00'
                          ) : totalReward < 0.01 ? (
                            '<$0.01'
                          ) : (
                            `$${formatNumber(totalReward, 2)}`
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                      </BoxValue>
                    </RewardValue>
                  </MyTotalReward>
                  {!isMobile && (
                    <MyBalance marginBottom="25px" backColor={backColor} borderColor={borderColor}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
                        color={fontColor4}
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
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
                    padding="25px 18px"
                    marginBottom={isMobile ? '20px' : '25px'}
                    backColor={backColor}
                    borderColor={borderColor}
                  >
                    <FarmDetailChart
                      token={token}
                      vaultPool={vaultPool}
                      lastTVL={Number(vaultValue)}
                      lastAPY={Number(totalApy)}
                    />
                  </HalfInfo>
                  {!isMobile && (
                    <HalfInfo marginBottom="20px" backColor={backColor} borderColor={borderColor}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight={isMobile ? '600' : '600'}
                        height={isMobile ? '20px' : '24px'}
                        color={fontColor4}
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        Source of Yield
                      </NewLabel>
                      <DescInfo fontColor6={fontColor6} fontColor3={fontColor3}>
                        {useIFARM ? (
                          <div>
                            <p>
                              This vault enables users to convert their assets into{' '}
                              <a
                                href="https://etherscan.io/token/0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                iFARM
                              </a>
                              . In doing so, they benefit from a portion of the fees collected by
                              Harvest.
                            </p>
                          </div>
                        ) : (
                          ReactHtmlParser(vaultPool.stakeAndDepositHelpMessage)
                        )}
                      </DescInfo>
                      <FlexDiv className="address" padding="0 15px 20px">
                        {token.vaultAddress && (
                          <InfoLabel
                            display="flex"
                            href={`${getExplorerLink(token.chain)}/address/${token.vaultAddress}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            rel="noopener noreferrer"
                            bgColor={bgColor}
                            hoverColor={hoverColor}
                            borderColor={borderColor}
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color={fontColor1}
                            >
                              Vault Address
                            </NewLabel>
                          </InfoLabel>
                        )}
                        {token.strategyAddress && (
                          <InfoLabel
                            display="flex"
                            href={`${getExplorerLink(token.chain)}/address/${
                              token.strategyAddress
                            }`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            rel="noopener noreferrer"
                            bgColor={bgColor}
                            hoverColor={hoverColor}
                            borderColor={borderColor}
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color={fontColor1}
                            >
                              Strategy Address
                            </NewLabel>
                          </InfoLabel>
                        )}
                        <InfoLabel
                          display="flex"
                          href={`${getExplorerLink(token.chain)}/address/${
                            vaultPool.autoStakePoolAddress || vaultPool.contractAddress
                          }`}
                          onClick={e => e.stopPropagation()}
                          rel="noopener noreferrer"
                          target="_blank"
                          bgColor={bgColor}
                          hoverColor={hoverColor}
                          borderColor={borderColor}
                        >
                          <NewLabel
                            size="12px"
                            weight={isMobile ? 400 : 600}
                            height="16px"
                            self="center"
                            color={fontColor1}
                          >
                            Pool Address
                          </NewLabel>
                        </InfoLabel>
                        {vaultPool.liquidityUrl && (
                          <InfoLabel
                            display="flex"
                            href={`${vaultPool.liquidityUrl}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            rel="noopener noreferrer"
                            bgColor={bgColor}
                            hoverColor={hoverColor}
                            borderColor={borderColor}
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color={fontColor1}
                            >
                              Add Liquidity
                            </NewLabel>
                          </InfoLabel>
                        )}
                      </FlexDiv>
                    </HalfInfo>
                  )}
                </>
              ) : (
                <></>
              )}
            </MainSection>
            <RestContent height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <FirstPartSection>
                  <HalfContent
                    backColor={backColor}
                    borderColor={borderColor}
                    marginBottom={isMobile ? '20px' : '0px'}
                    borderRadius={isMobile ? '12px' : '12px'}
                  >
                    <DepositSection isShow={activeDepo}>
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
                        switchMethod={switchDepoMethod}
                        tokenSymbol={id}
                        useIFARM={useIFARM}
                        useBeginnersFarm={useBeginnersFarm}
                        balanceList={balanceList}
                        setFromInfoAmount={setFromInfoAmount}
                        setFromInfoUsdAmount={setFromInfoUsdAmount}
                        fromInfoUsdAmount={fromInfoUsdAmount}
                        convertMonthlyYieldUSD={convertMonthlyYieldUSD}
                        convertDailyYieldUSD={convertDailyYieldUSD}
                        minReceiveAmountString={minReceiveAmountString}
                        setMinReceiveAmountString={setMinReceiveAmountString}
                        setMinReceiveUsdAmount={setMinReceiveUsdAmount}
                        setConvertMonthlyYieldUSD={setConvertMonthlyYieldUSD}
                        setConvertDailyYieldUSD={setConvertDailyYieldUSD}
                        hasErrorOccurred={hasErrorOccurredConvert}
                        setHasErrorOccurred={setHasErrorOccurredConvert}
                        failureCount={failureCountConvert}
                        setFailureCount={setFailureCountConvert}
                        supportedVault={supportedVault}
                        setSupportedVault={setSupportedVault}
                        hasPortalsError={hasPortalsError}
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
                      />
                      <DepositStart
                        pickedToken={pickedTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        defaultToken={defaultToken}
                        inputAmount={inputAmountDepo}
                        setInputAmount={setInputAmountDepo}
                        token={token}
                        tokenSymbol={id}
                        useIFARM={useIFARM}
                        fAssetPool={fAssetPool}
                        multipleAssets={multipleAssets}
                        fromInfoAmount={fromInfoAmount}
                        fromInfoUsdAmount={fromInfoUsdAmount}
                        minReceiveAmountString={minReceiveAmountString}
                        minReceiveUsdAmount={minReceiveUsdAmount}
                        setSelectToken={setSelectTokenDepo}
                        setConvertSuccess={setConvertSuccess}
                      />
                    </DepositSection>
                    <WithdrawSection isShow={!activeDepo}>
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
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
                        lpTokenBalance={lpTokenBalance}
                        stakedAmount={stakedAmount}
                        token={token}
                        supTokenList={supTokenList}
                        switchMethod={switchDepoMethod}
                        useIFARM={useIFARM}
                        setRevertFromInfoAmount={setRevertFromInfoAmount}
                        revertFromInfoUsdAmount={revertFromInfoUsdAmount}
                        setRevertFromInfoUsdAmount={setRevertFromInfoUsdAmount}
                        setRevertMinReceivedAmount={setRevertMinReceivedAmount}
                        revertMinReceivedAmount={revertMinReceivedAmount}
                        setRevertMinReceivedUsdAmount={setRevertMinReceivedUsdAmount}
                        hasErrorOccurred={hasErrorOccurredRevert}
                        setHasErrorOccurred={setHasErrorOccurredRevert}
                        hasPortalsError={hasPortalsError}
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
                        unstakeInputValue={unstakeInputValue}
                        withdrawStart={withdrawStart}
                        setWithdrawStart={setWithdrawStart}
                        defaultToken={defaultToken}
                        pickedToken={pickedTokenWith}
                        setPickedToken={setPickedTokenWith}
                        token={token}
                        unstakeBalance={unstakeBalance}
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
                        multipleAssets={multipleAssets}
                        useIFARM={useIFARM}
                        depositedValueUSD={depositedValueUSD}
                        setRevertFromInfoAmount={setRevertFromInfoAmount}
                        revertFromInfoAmount={revertFromInfoAmount}
                        revertFromInfoUsdAmount={revertFromInfoUsdAmount}
                        revertMinReceivedAmount={revertMinReceivedAmount}
                        revertMinReceivedUsdAmount={revertMinReceivedUsdAmount}
                        setUnstakeInputValue={setUnstakeInputValue}
                        setRevertSuccess={setRevertSuccess}
                        altVaultData={altVaultData}
                      />
                    </WithdrawSection>
                  </HalfContent>
                  {isMobile ? (
                    <UserBalanceData
                      token={token}
                      vaultPool={vaultPool}
                      totalValue={totalValue}
                      useIFARM={useIFARM}
                      farmPrice={farmPrice}
                      underlyingPrice={underlyingPrice}
                      pricePerFullShare={pricePerFullShare}
                    />
                  ) : (
                    <></>
                  )}
                </FirstPartSection>
              ) : activeMainTag === 1 ? (
                <SecondPartSection>
                  <MyBalance
                    backColor={backColor}
                    borderColor={borderColor}
                    height={isMobile ? 'unset' : useIFARM ? 'unset' : '120px'}
                    marginBottom={isMobile ? '20px' : '25px'}
                  >
                    <NewLabel
                      size={isMobile ? '12px' : '12px'}
                      weight="600"
                      height={isMobile ? '20px' : '20px'}
                      color={fontColor4}
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                      borderBottom="1px solid #F2F5FF "
                    >
                      {useIFARM ? 'Farm (Legacy)' : `f${id}`}
                    </NewLabel>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="500"
                        color={fontColor3}
                      >
                        Unstaked
                        <PiQuestion
                          className="question"
                          data-tip
                          data-for="tooltip-unstaked-desc"
                        />
                        <ReactTooltip
                          id="tooltip-unstaked-desc"
                          backgroundColor="#101828"
                          borderColor="black"
                          textColor="white"
                        >
                          <NewLabel
                            size={isMobile ? '12px' : '12px'}
                            height={isMobile ? '18px' : '18px'}
                            weight="500"
                            color="white"
                          >
                            {useIFARM
                              ? `The number of i${id} you hold, but not entitled to extra token rewards.`
                              : `The number of fTokens you hold, which are not entitled to extra token rewards.`}
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <NewLabel
                        weight="600"
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor1}
                      >
                        {!connected ? (
                          0
                        ) : lpTokenBalance ? (
                          unstakedAmount === 0 ? (
                            '0.00'
                          ) : (
                            unstakedAmount
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '5px 15px' : '5px 15px'}
                    >
                      <NewLabel
                        display="flex"
                        size={isMobile ? '12px' : '12px'}
                        weight="500"
                        height={isMobile ? '24px' : '24px'}
                        color="#15B088"
                      >
                        Staked
                        <PiQuestion
                          className="question"
                          data-tip
                          data-for="tooltip-unstaked-desc"
                        />
                        <ReactTooltip
                          id="tooltip-staked-desc"
                          backgroundColor="#101828"
                          borderColor="black"
                          textColor="white"
                        >
                          <NewLabel
                            size={isMobile ? '12px' : '12px'}
                            height={isMobile ? '18px' : '18px'}
                            weight="500"
                            color="white"
                          >
                            {useIFARM
                              ? `The number of staked i${id}, which are entitled to all token rewards.`
                              : `The number of staked fTokens, which entitle you to extra token rewards.`}
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight={isMobile ? '600' : '600'}
                        color={isMobile ? '#15B088' : '#15B088'}
                      >
                        {!connected ? (
                          0
                        ) : totalStaked ? (
                          stakedAmount === 0 ? (
                            '0.00'
                          ) : (
                            stakedAmount
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                      </NewLabel>
                    </FlexDiv>
                    {useIFARM && (
                      <>
                        <FlexDiv
                          justifyContent="space-between"
                          padding={isMobile ? '7px 11px' : '10px 15px'}
                        >
                          <NewLabel
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            weight="500"
                            color="#344054"
                            self="center"
                          >
                            FARM Price
                          </NewLabel>
                          <NewLabel
                            weight="500"
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            color="black"
                            self="center"
                          >
                            {!account ? (
                              ''
                            ) : token.data.lpTokenData ? (
                              `$${token.data.lpTokenData.price}`
                            ) : (
                              <AnimatedDots />
                            )}
                          </NewLabel>
                        </FlexDiv>
                        <FlexDiv
                          justifyContent="space-between"
                          padding={isMobile ? '7px 11px' : '10px 15px'}
                        >
                          <NewLabel
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            weight="500"
                            color="#344054"
                            self="center"
                          >
                            Total Value
                            <PiQuestion
                              className="question"
                              data-tip
                              data-for="tooltip-totalValue"
                            />
                            <ReactTooltip
                              id="tooltip-totalValue"
                              backgroundColor="#101828"
                              borderColor="black"
                              textColor="white"
                            >
                              <NewLabel
                                size={isMobile ? '10px' : '12px'}
                                height={isMobile ? '15px' : '18px'}
                                weight="500"
                                color="white"
                              >
                                Total Value of your Staked and Unstaked FARM
                              </NewLabel>
                            </ReactTooltip>
                          </NewLabel>
                          <NewLabel
                            weight="500"
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            color="black"
                            self="center"
                          >
                            {!account ? (
                              ''
                            ) : totalValue ? (
                              `$${formatNumberWido(
                                totalValue * token.data.lpTokenData.price,
                                WIDO_BALANCES_DECIMALS,
                              )}`
                            ) : (
                              <AnimatedDots />
                            )}
                          </NewLabel>
                        </FlexDiv>
                      </>
                    )}
                  </MyBalance>
                  {isMobile && (
                    <MyBalance marginBottom="20px" backColor={backColor} borderColor={borderColor}>
                      <NewLabel
                        size={isMobile ? '14px' : '14px'}
                        weight="600"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor4}
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        My Token Rewards
                      </NewLabel>
                      <FlexDiv>
                        <VaultPanelActionsFooter {...viewComponentProps} />
                      </FlexDiv>
                    </MyBalance>
                  )}
                  <HalfContent
                    backColor={backColor}
                    borderColor={borderColor}
                    marginBottom={isMobile ? '20px' : '0px'}
                    borderRadius={isMobile ? '12px' : '12px'}
                  >
                    <StakeSection isShow={activeStake}>
                      <StakeBase
                        setStakeStart={setStakeStart}
                        inputAmount={inputAmountStake}
                        setInputAmount={setInputAmountStake}
                        token={token}
                        switchMethod={switchStakeMethod}
                        tokenSymbol={id}
                        lpTokenBalance={lpTokenBalance}
                        fAssetPool={fAssetPool}
                      />
                      <StakeStart
                        stakeStart={stakeStart}
                        setStakeStart={setStakeStart}
                        inputAmount={inputAmountStake}
                        setInputAmount={setInputAmountStake}
                        token={token}
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
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
                        tokenSymbol={id}
                      />
                    </StakeSection>
                    <UnstakeSection isShow={!activeStake}>
                      <UnstakeBase
                        setUnstakeStart={setUnstakeStart}
                        finalStep={unstakeFinalStep}
                        inputAmount={inputAmountUnstake}
                        setInputAmount={setInputAmountUnstake}
                        token={token}
                        switchMethod={switchStakeMethod}
                        tokenSymbol={id}
                        totalStaked={totalStaked}
                        fAssetPool={fAssetPool}
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
                        switchMethod={switchStakeMethod}
                        tokenSymbol={id}
                        totalStaked={totalStaked}
                        fAssetPool={fAssetPool}
                        setPendingAction={setPendingAction}
                        multipleAssets={multipleAssets}
                        amountsToExecute={amountsToExecuteUnstake}
                      />
                      <UnstakeResult
                        finalStep={unstakeFinalStep}
                        setFinalStep={setUnstakeFinalStep}
                        inputAmount={inputAmountUnstake}
                        setInputAmount={setInputAmountUnstake}
                        tokenSymbol={id}
                      />
                    </UnstakeSection>
                  </HalfContent>
                </SecondPartSection>
              ) : activeMainTag === 2 ? (
                <RestInternal>
                  {!useIFARM && (
                    <MyBalance
                      marginBottom={isMobile ? '20px' : '25px'}
                      backColor={backColor}
                      borderColor={borderColor}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
                        color={fontColor4}
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        APY Breakdown
                      </NewLabel>
                      <NewLabel padding={isMobile ? '0px 15px 10px' : '0px 15px 10px'}>
                        <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
                      </NewLabel>
                    </MyBalance>
                  )}
                  <LastHarvestInfo backColor={backColor} borderColor={borderColor}>
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight={isMobile ? '600' : '600'}
                      height={isMobile ? '20px' : '24px'}
                      color={fontColor4}
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                      borderBottom="1px solid #F3F6FF"
                    >
                      Fees
                    </NewLabel>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="500"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor3}
                      >
                        Convert Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor1}
                      >
                        0%
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="500"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor3}
                      >
                        Revert Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor1}
                      >
                        0%
                      </NewLabel>
                    </FlexDiv>
                    {!useIFARM && (
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                      >
                        <NewLabel
                          size={isMobile ? '13px' : '13px'}
                          weight="300"
                          height="normal"
                          color={fontColor3}
                        >
                          The APY shown already considers the performance fee taken only from
                          generated yield and not deposits.
                        </NewLabel>
                        <NewLabel display="flex" self="center">
                          <PiQuestion
                            className="question"
                            data-tip
                            data-for="tooltip-last-harvest"
                          />
                          <ReactTooltip
                            id="tooltip-last-harvest"
                            backgroundColor="#101828"
                            borderColor="black"
                            textColor="white"
                            place={isMobile ? 'left' : 'top'}
                          >
                            <NewLabel
                              weight="500"
                              size={isMobile ? '13px' : '13px'}
                              height={isMobile ? '16px' : '16px'}
                            >
                              <FlexDiv gap="15px" justifyContent="space-between">
                                <div>Harvest Treasury</div>
                                <div>{harvestTreasury}%</div>
                              </FlexDiv>
                              <FlexDiv gap="15px" justifyContent="space-between" marginTop="12px">
                                <div>Profit Sharing</div>
                                <div>{profitShare}%</div>
                              </FlexDiv>
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                      </FlexDiv>
                    )}
                  </LastHarvestInfo>
                  {isMobile && (
                    <HalfInfo marginBottom="20px" backColor={backColor} borderColor={borderColor}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
                        color={fontColor4}
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        Source of Yield
                      </NewLabel>
                      <DescInfo fontColor6={fontColor6} fontColor3={fontColor3}>
                        {ReactHtmlParser(vaultPool.stakeAndDepositHelpMessage)}
                      </DescInfo>
                      <FlexDiv className="address" padding="0 15px 20px">
                        {token.vaultAddress && (
                          <InfoLabel
                            display="flex"
                            href={`${getExplorerLink(token.chain)}/address/${token.vaultAddress}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            rel="noopener noreferrer"
                            bgColor={bgColor}
                            hoverColor={hoverColor}
                            borderColor={borderColor}
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color={fontColor1}
                            >
                              Vault Address
                            </NewLabel>
                          </InfoLabel>
                        )}
                        {vaultPool.autoStakePoolAddress && (
                          <InfoLabel
                            display="flex"
                            href={`${getExplorerLink(token.chain)}/address/${
                              vaultPool.contractAddress
                            }`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            rel="noopener noreferrer"
                            bgColor={bgColor}
                            hoverColor={hoverColor}
                            borderColor={borderColor}
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color={fontColor1}
                            >
                              Strategy Address
                            </NewLabel>
                          </InfoLabel>
                        )}
                        <InfoLabel
                          display="flex"
                          href={`${getExplorerLink(token.chain)}/address/${
                            vaultPool.autoStakePoolAddress || vaultPool.contractAddress
                          }`}
                          onClick={e => e.stopPropagation()}
                          rel="noopener noreferrer"
                          target="_blank"
                          bgColor={bgColor}
                          hoverColor={hoverColor}
                          borderColor={borderColor}
                        >
                          <NewLabel
                            size="12px"
                            weight={isMobile ? 600 : 600}
                            height="16px"
                            self="center"
                            color={fontColor1}
                          >
                            Pool Address
                          </NewLabel>
                        </InfoLabel>
                      </FlexDiv>
                    </HalfInfo>
                  )}
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
