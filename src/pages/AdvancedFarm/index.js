import BigNumber from 'bignumber.js'
import { find, get, isEqual, isArray, isNaN } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import ReactHtmlParser from 'react-html-parser'
import ReactTooltip from 'react-tooltip'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { getBalances, getSupportedTokens } from 'wido'
import { BiLeftArrowAlt } from 'react-icons/bi'
import tokenMethods from '../../services/web3/contracts/token/methods'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import InfoNewColor from '../../assets/images/logos/beginners/help-circle-new-color.svg'
import InfoBlack from '../../assets/images/logos/earn/help-circle.svg'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import Diamond from '../../assets/images/logos/beginners/diamond.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
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
import {
  COINGECKO_API_KEY,
  DECIMAL_PRECISION,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  ROUTES,
  SPECIAL_VAULTS,
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
  InfoIcon,
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
  ValueBox,
  BoxTitle,
  BoxValue,
  NetDetailTitle,
  NetDetailContent,
  NetDetailImg,
  InfoIconBlack,
  RewardValue,
} from './style'
import { CHAIN_IDS } from '../../data/constants'
// import { array } from 'prop-types'

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
        ? new BigNumber(token.underlyingBalanceWithInvestment)
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

const BASE_URL = 'https://pro-api.coingecko.com/api/v3/'

const getCoinListFromApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}coins/list`, {
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
    const response = await axios.get(`${BASE_URL}simple/price`, {
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
  const { paramAddress } = useParams()
  // Switch Tag (Deposit/Withdraw)
  const [activeDepo, setActiveDepo] = useState(true)

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
  /* eslint-enable global-require */

  const [apiData, setApiData] = useState([])

  const handleNetworkChange = () => {
    window.location.reload() // Reload the page when the network changes
  }

  useEffect(() => {
    if (window.ethereum) {
      // Listen for network changes
      window.ethereum.on('chainChanged', handleNetworkChange)

      return () => {
        // Cleanup: Remove the event listener when the component unmounts
        window.ethereum.removeListener('chainChanged', handleNetworkChange)
      }
    }
    return () => {}
  }, [])

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
  const pricePerFullShare = Number(
    fromWei(
      tempPricePerFullShare,
      useIFARM ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.decimals`, 0) : token.decimals,
    ),
  )

  const usdPrice =
    Number(token.vaultPrice) ||
    Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price) * pricePerFullShare
  const farmPrice = Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price)
  const underlyingPrice =
    Number(token.usdPrice) ||
    Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price)

  // Deposit
  const [depositStart, setDepositStart] = useState(false)
  const [selectTokenDepo, setSelectTokenDepo] = useState(false)
  const [balanceDepo, setBalanceDepo] = useState(0)
  const [pickedTokenDepo, setPickedTokenDepo] = useState({ symbol: 'Select Token' })
  const [quoteValueDepo, setQuoteValueDepo] = useState(null)
  const [inputAmountDepo, setInputAmountDepo] = useState(0)
  const [partHeightDepo, setPartHeightDepo] = useState(null)
  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')
  const [minReceiveAmountString, setMinReceiveAmountString] = useState('')
  const [convertSuccess, setConvertSuccess] = useState(false)

  // Withdraw
  const [withdrawStart, setWithdrawStart] = useState(false)
  const [selectTokenWith, setSelectTokenWith] = useState(false)
  const [pickedTokenWith, setPickedTokenWith] = useState({ symbol: 'Select' })
  const [unstakeBalance, setUnstakeBalance] = useState('0')
  const [partHeightWith, setPartHeightWith] = useState(null)
  const [quoteValueWith, setQuoteValueWith] = useState(null)
  const [revertFromInfoAmount, setRevertFromInfoAmount] = useState('')
  const [revertFromInfoUsdAmount, setRevertFromInfoUsdAmount] = useState('')
  const [revertMinReceivedAmount, setRevertMinReceivedAmount] = useState('')
  const [revertedAmount, setRevertedAmount] = useState('')
  const [unstakeInputValue, setUnstakeInputValue] = useState(0)

  // Stake
  const [stakeStart, setStakeStart] = useState(false)
  const [inputAmountStake, setInputAmountStake] = useState(0)
  const [stakeFinalStep, setStakeFinalStep] = useState(false)

  // Unstake
  const [unstakeStart, setUnstakeStart] = useState(false)
  const [inputAmountUnstake, setInputAmountUnstake] = useState(0)
  const [unstakeFinalStep, setUnstakeFinalStep] = useState(false)
  const [amountsToExecuteUnstake, setAmountsToExecuteUnstake] = useState('')

  const [yieldDaily, setYieldDaily] = useState(0)
  const [yieldMonthly, setYieldMonthly] = useState(0)
  const [convertMonthlyYieldUSD, setConvertMonthlyYieldUSD] = useState(0)
  const [convertDailyYieldUSD, setConvertDailyYieldUSD] = useState(0)

  const [balanceList, setBalanceList] = useState([])
  const [supTokenList, setSupTokenList] = useState([])
  const [supTokenNoBalanceList, setSupTokenNoBalanceList] = useState([])
  const [defaultToken, setDefaultToken] = useState({})
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

  const mainTags = [
    { name: 'Manage', img: Safe },
    { name: 'Rewards', img: Diamond },
    { name: 'Details', img: BarChart },
  ]

  const toTokenAddress = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
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
    setConvertMonthlyYieldUSD(convertMonthlyYieldValue)
    setConvertDailyYieldUSD(convertDailyYieldYieldValue)
  }, [minReceiveAmountString, usdPrice, totalApy])

  useEffect(() => {
    const getTokenBalance = async () => {
      try {
        if (chain && account && Object.keys(balances).length !== 0) {
          const curBalances = await getBalances(account, [chain.toString()])
          const curSortedBalances = curBalances.sort(function reducer(a, b) {
            return Number(fromWei(b.balance, b.decimals)) - Number(fromWei(a.balance, a.decimals))
          })
          setBalanceList(curSortedBalances)
          let supList = [],
            directInSup = {},
            directInBalance = {}
          try {
            supList = await getSupportedTokens({
              chainId: [chain],
              toToken: toTokenAddress,
              toChainId: chain,
            })
          } catch (err) {
            console.log('getSupportedTokens of Wido: ', err)
          }
          const tokenAddress =
            token.tokenAddress !== undefined && token.tokenAddress.length !== 2
              ? token.tokenAddress
              : token.vaultAddress

          supList = supList.map(sup => {
            const supToken = curBalances.find(el => el.address === sup.address)
            if (supToken) {
              sup.balance = supToken.balance
              sup.usdValue = supToken.balanceUsdValue
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
            return Number(fromWei(b.balance, b.decimals)) - Number(fromWei(a.balance, a.decimals))
          })

          for (let j = 0; j < curBalances.length; j += 1) {
            if (Object.keys(directInBalance).length === 0 && tokenAddress.length !== 2) {
              if (curBalances[j].address.toLowerCase() === tokenAddress.toLowerCase()) {
                directInBalance = curBalances[j]
              }
            }
          }

          const vaultId = Object.keys(groupOfVaults).find(
            key => groupOfVaults[key].tokenAddress === tokenAddress,
          )
          const directBalance = balances[vaultId]
          const directUsdPrice = token.usdPrice
          const directUsdValue =
            directUsdPrice && directBalance
              ? new BigNumber(directBalance)
                  .div(10 ** tokenDecimals)
                  .times(directUsdPrice)
                  .toFixed(4)
              : '0'

          if (!(Object.keys(directInSup).length === 0 && directInSup.constructor === Object)) {
            directInSup.balance = directBalance
            directInSup.usdPrice = directInSup.usdPrice > 0 ? directInSup.usdPrice : directUsdPrice
            directInSup.usdValue = directInSup.usdValue > 0 ? directInSup.usdValue : directUsdValue
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
            setDefaultToken(supList[0])
          }
          supList.shift()
          setSupTokenList(supList)

          const supNoBalanceList = []
          if (supList.length > 0) {
            for (let i = 0; i < supList.length; i += 1) {
              if (Number(supList[i].balance) === 0) {
                supNoBalanceList.push(supList[i])
              }
            }
          }
          setSupTokenNoBalanceList(supNoBalanceList)

          const soonSupList = []
          for (let j = 0; j < curBalances.length; j += 1) {
            const supToken = supList.find(el => el.address === curBalances[j].address)
            if (!supToken) {
              soonSupList.push(curBalances[j])
            }

            if (Object.keys(directInBalance).length === 0 && tokenAddress.length !== 2) {
              if (curBalances[j].address.toLowerCase() === tokenAddress.toLowerCase()) {
                directInBalance = curBalances[j]
              }
            }
          }
          setSoonToSupList(soonSupList)
        }
      } catch (err) {
        console.log('getTokenBalance: ', err)
      }
    }

    getTokenBalance()
  }, [account, chain, balances, convertSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (supTokenList.length > 0) {
      for (let i = 0; i < supTokenList.length; i += 1) {
        if (supTokenList[i].symbol === 'USDC') {
          setPickedTokenDepo(supTokenList[i])
          setBalanceDepo(
            fromWei(
              supTokenList[i].balance ? supTokenList[i].balance : 0,
              supTokenList[i].decimals,
            ),
          )
          return
        }
      }
    }
  }, [supTokenList])

  const { pageBackColor, fontColor, filterColor } = useThemeContext()

  const firstUserPoolsLoad = useRef(true)
  const firstWalletBalanceLoad = useRef(true)

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
  const totalRewardsEarned = get(userStats, `[${fAssetPool.id}]['totalRewardsEarned']`, 0)
  const rewardsEarned = get(userStats, `[${fAssetPool.id}]['rewardsEarned']`, 0)

  const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])

  useEffect(() => {
    const fetchData = async () => {
      let totalRewardSum = 0
      const usdPrices = []
      for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
        // eslint-disable-next-line one-var
        let rewardSymbol = rewardTokenSymbols[l].toUpperCase(),
          usdRewardPrice = 0,
          rewardDecimal = get(tokens[rewardTokenSymbols[l]], 'decimals', 18)

        if (rewardTokenSymbols.includes(FARM_TOKEN_SYMBOL)) {
          rewardSymbol = FARM_TOKEN_SYMBOL
        }

        const rewardToken = groupOfVaults[rewardSymbol]

        if (rewardToken) {
          usdRewardPrice =
            (rewardSymbol === FARM_TOKEN_SYMBOL
              ? rewardToken.data.lpTokenData && rewardToken.data.lpTokenData.price
              : rewardToken.usdPrice) || 0

          rewardDecimal =
            rewardToken.decimals ||
            (rewardToken.data &&
              rewardToken.data.lpTokenData &&
              rewardToken.data.lpTokenData.decimals)
        } else if (rewardTokenSymbols[l].substring(0, 1) === 'f') {
          let underlyingRewardSymbol
          if (rewardTokenSymbols[l].substring(0, 2) === 'fx') {
            underlyingRewardSymbol = rewardTokenSymbols[l].substring(2)
          } else {
            underlyingRewardSymbol = rewardTokenSymbols[l].substring(1)
          }
          // eslint-disable-next-line no-loop-func
          try {
            for (let ids = 0; ids < apiData.length; ids += 1) {
              const tempData = apiData[ids]
              const tempSymbol = tempData.symbol
              if (tempSymbol.toLowerCase() === underlyingRewardSymbol.toLowerCase()) {
                // eslint-disable-next-line no-await-in-loop
                const usdUnderlyingRewardPrice = await getTokenPriceFromApi(tempData.id)
                usdRewardPrice = Number(usdUnderlyingRewardPrice) * Number(pricePerFullShare)
                break
              }
            }
          } catch (error) {
            console.error('Error:', error)
          }
        } else {
          try {
            for (let ids = 0; ids < apiData.length; ids += 1) {
              const tempData = apiData[ids]
              const tempSymbol = tempData.symbol
              if (tempSymbol.toLowerCase() === rewardSymbol.toLowerCase()) {
                // eslint-disable-next-line no-await-in-loop
                usdRewardPrice = await getTokenPriceFromApi(tempData.id)
                break
              }
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }
        console.log('USD Price of ', rewardSymbol, ':', usdRewardPrice)

        const totalRewardUsd =
          rewardTokenSymbols.length === 1
            ? Number(
                totalRewardsEarned === undefined
                  ? 0
                  : fromWei(totalRewardsEarned, rewardDecimal, 4) * Number(usdRewardPrice),
              )
            : Number(
                rewardsEarned === undefined
                  ? 0
                  : fromWei(get(rewardsEarned, rewardTokenSymbols[l], 0), rewardDecimal, 4) *
                      Number(usdRewardPrice),
              )
        totalRewardSum += totalRewardUsd
        usdPrices.push(usdRewardPrice)
      }
      setTotalReward(totalRewardSum)
      setRewardTokenPrices(usdPrices)
    }

    fetchData()
    // eslint-disable-next-line
    }, [
    account,
    userStats,
    fAssetPool,
    apiData,
    pricePerFullShare,
    rewardTokenSymbols,
  ])

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
    <DetailView pageBackColor={pageBackColor} fontColor={fontColor}>
      <TopInner>
        <TopPart>
          <FlexTopDiv>
            <TopButton className="back-btn">
              <BackBtnRect
                onClick={() => {
                  if (isFromEarningPage) {
                    history.push(ROUTES.PORTFOLIO)
                  } else {
                    history.push(ROUTES.ADVANCED)
                  }
                }}
              >
                <BiLeftArrowAlt fontSize={16} />
                <BackText>Back</BackText>
              </BackBtnRect>
              {isMobile && (
                <MobileChain>
                  <NetDetailItem>
                    <NetDetailContent>{token.platform && token.platform[0]}</NetDetailContent>
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
                size={isMobile ? '19.7px' : '25px'}
                height={isMobile ? '45px' : '82px'}
                marginBottom={isMobile ? '5px' : '10px'}
              >
                {useIFARM ? `i${token.tokenNames.join(' • ')}` : token.tokenNames.join(' • ')}
              </TopDesc>
            </FlexDiv>
            <GuideSection>
              <GuidePart>
                {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                &nbsp;APY
              </GuidePart>
              <GuidePart>
                {showTVL()}
                &nbsp;TVL
              </GuidePart>
            </GuideSection>
            <TabRow>
              <MainTagPanel>
                {mainTags.map((tag, i) => (
                  <MainTag
                    key={i}
                    active={activeMainTag === i ? 'true' : 'false'}
                    useIFARM={useIFARM}
                    onClick={() => {
                      setActiveMainTag(i)
                      if (i !== 0) {
                        push(`${pathname}#${tag.name.toLowerCase()}`)
                      } else {
                        push(pathname)
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
                  <NetDetailTitle>Platform:</NetDetailTitle>
                  <NetDetailContent>
                    {useIFARM ? 'Harvest' : token.platform && token.platform[0]}
                  </NetDetailContent>
                </NetDetailItem>
                <NetDetailItem>
                  <NetDetailTitle>Network</NetDetailTitle>
                  <NetDetailImg>
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
            {activeMainTag === 2 && (
              <BoxCover>
                <ValueBox width="24%" className="balance-box">
                  <BoxTitle>APY</BoxTitle>
                  <BoxValue>{showAPY()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%" className="daily-apy-box">
                  <BoxTitle>Daily APY</BoxTitle>
                  <BoxValue>{showApyDaily()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%">
                  <BoxTitle>TVL</BoxTitle>
                  <BoxValue>{showTVL()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%" className="daily-yield-box">
                  <BoxTitle>Last Harvest</BoxTitle>
                  <BoxValue>
                    {useIFARM ? '-' : lastHarvest !== '' ? `${lastHarvest} ago` : '-'}
                  </BoxValue>
                </ValueBox>
              </BoxCover>
            )}
            <MainSection height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <>
                  <BoxCover>
                    <ValueBox width="32%" className="balance-box">
                      <BoxTitle>
                        {isMobile ? 'Balance' : 'My Balance'}
                        <InfoIcon
                          className="info"
                          width={isMobile ? 10 : 16}
                          src={Info}
                          alt=""
                          data-tip
                          data-for="tooltip-mybalance"
                          filterColor={filterColor}
                        />
                        <ReactTooltip
                          id="tooltip-mybalance"
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
                            {useIFARM
                              ? `It's the USD value of all iFARM tokens in your wallet. `
                              : `It's the USD value of your all staked and unstaked fTokens.`}
                          </NewLabel>
                        </ReactTooltip>
                      </BoxTitle>
                      <BoxValue>
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
                      </BoxValue>
                    </ValueBox>
                    <ValueBox width="32%" className="monthly-yield-box">
                      <BoxTitle>
                        Monthly Yield
                        <InfoIcon
                          className="info"
                          width={isMobile ? 10 : 16}
                          src={Info}
                          alt=""
                          data-tip
                          data-for="tooltip-monthly-yield"
                          filterColor={filterColor}
                        />
                        <ReactTooltip
                          id="tooltip-monthly-yield"
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
                            {useIFARM
                              ? `Calculated from the current USD value of iFARM. Note that this is subject to change with iFARM's price fluctuations and the number of all wallets entitled to Harvest's platform rewards.`
                              : `Calculated from the current USD value of underlying and reward tokens used in this farm. Note that this is subject to change with market prices and TVL fluctuations.`}
                          </NewLabel>
                        </ReactTooltip>
                      </BoxTitle>
                      <BoxValue>
                        {!connected
                          ? '$0.00'
                          : isNaN(yieldMonthly)
                          ? '$0.00'
                          : yieldMonthly === 0
                          ? '$0.00'
                          : yieldMonthly < 0.01
                          ? '<$0.01'
                          : `$${formatNumber(yieldMonthly, 2)}`}
                      </BoxValue>
                    </ValueBox>
                    <ValueBox width="32%" className="daily-yield-box">
                      <BoxTitle>
                        Daily Yield
                        <InfoIcon
                          className="info"
                          width={isMobile ? 10 : 16}
                          src={Info}
                          alt=""
                          data-tip
                          data-for="tooltip-monthly-yield"
                          filterColor={filterColor}
                        />
                      </BoxTitle>
                      <BoxValue>
                        {!connected
                          ? '$0.00'
                          : isNaN(yieldDaily)
                          ? '$0.00'
                          : yieldDaily === 0
                          ? '$0.00'
                          : yieldDaily < 0.01
                          ? '<$0.01'
                          : `$${formatNumber(yieldDaily, 2)}`}
                      </BoxValue>
                    </ValueBox>
                  </BoxCover>
                  {!isMobile && (
                    <UserBalanceData
                      token={token}
                      vaultPool={vaultPool}
                      tokenSymbol={id}
                      totalValue={totalValue}
                      useIFARM={useIFARM}
                      farmPrice={farmPrice}
                      underlyingPrice={underlyingPrice}
                    />
                  )}
                </>
              ) : activeMainTag === 1 ? (
                <>
                  <MyTotalReward marginBottom={isMobile ? '20px' : '25px'}>
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight="500"
                      height={isMobile ? '20px' : '20px'}
                      color="#6F78AA"
                    >
                      Rewards
                    </NewLabel>
                    <RewardValue>
                      <BoxValue>
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
                    <MyBalance marginBottom="25px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
                        color="#1F2937"
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
              ) : (
                <>
                  <HalfInfo padding="25px 18px" marginBottom={isMobile ? '20px' : '25px'}>
                    <FarmDetailChart
                      token={token}
                      vaultPool={vaultPool}
                      lastTVL={Number(vaultValue)}
                      lastAPY={Number(totalApy)}
                    />
                  </HalfInfo>
                  {!isMobile && (
                    <HalfInfo marginBottom="20px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight={isMobile ? '600' : '600'}
                        height={isMobile ? '20px' : '24px'}
                        color={isMobile ? '#1F2937' : '#1F2937'}
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        Source of Yield
                      </NewLabel>
                      <DescInfo>
                        {useIFARM ? (
                          <div>
                            <p>
                              This is the profit sharing vault of Harvest. When depositing into the
                              vault you obtain the yield-bearing token{' '}
                              <a
                                href="https://etherscan.io/token/0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                iFARM
                              </a>
                              . If you&apos;re holding{' '}
                              <a
                                href="https://etherscan.io/token/0xa0246c9032bC3A600820415aE600c6388619A14D"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                FARM
                              </a>{' '}
                              , it is recommended to convert it into interest-bearing{' '}
                              <a
                                href="https://etherscan.io/token/0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                iFARM
                              </a>{' '}
                              in order be entitled to Harvest&apos;s profit sharing.
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
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color="#15202b"
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
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color="#15202b"
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
                        >
                          <NewLabel
                            size="12px"
                            weight={isMobile ? 400 : 600}
                            height="16px"
                            self="center"
                            color="#15202b"
                          >
                            Pool Address
                          </NewLabel>
                        </InfoLabel>
                      </FlexDiv>
                    </HalfInfo>
                  )}
                </>
              )}
            </MainSection>
            <RestContent height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <FirstPartSection>
                  <MyBalance
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
                      color="#1F2937"
                      padding={isMobile ? '10px 15px' : '10px 15px'}
                      borderBottom="1px solid #F2F5FF"
                    >
                      <>{useIFARM ? `i${id}` : `f${id}`}</>
                      <InfoIconBlack
                        className="info"
                        width={isMobile ? 16 : 16}
                        src={InfoBlack}
                        alt=""
                        data-tip
                        data-for="tooltip-token-name"
                      />
                      <ReactTooltip
                        id="tooltip-token-name"
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
                            ? `Interest-bearing version of the FARM token. By simply holding iFARM, you are entitled to Harvest's profits.`
                            : 'The interest-bearing fToken. It entitles its holder to auto-compounded yield of this farm.'}
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
                        color="#6F78AA"
                      >
                        Balance
                        <InfoIcon
                          className="info"
                          width={isMobile ? 16 : 16}
                          src={Info}
                          alt=""
                          data-tip
                          data-for="tooltip-balance"
                          filterColor={filterColor}
                        />
                        <ReactTooltip
                          id="tooltip-balance"
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
                              ? `Sum of iFARM tokens in your wallet.`
                              : 'Sum of your staked and unstaked fTokens.'}
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="600"
                        color="#101828"
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
                        color="#6F78AA"
                        self="center"
                      >
                        Underlying Balance
                        <InfoIcon
                          className="info"
                          width={isMobile ? 16 : 16}
                          src={Info}
                          alt=""
                          data-tip
                          data-for="tooltip-underlying-balance"
                          filterColor={filterColor}
                        />
                        <ReactTooltip
                          id="tooltip-underlying-balance"
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
                            {useIFARM ? (
                              `Your iFARM denominated in FARM. Subject to change as iFARM accrues yield. `
                            ) : (
                              <>
                                Current amount of LP/Tokens represented by <span>f{id}</span>,
                                subject to auto-compounding mechanism at every harvest event
                              </>
                            )}
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <NewLabel
                        weight="600"
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        color="#101828"
                        self="center"
                      >
                        {!connected ? (
                          0
                        ) : lpTokenBalance ? (
                          totalValue === 0 ? (
                            '0.00'
                          ) : useIFARM ? (
                            `${totalValue * Number(pricePerFullShare)} ${id}`
                          ) : (
                            totalValue * Number(pricePerFullShare)
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  <HalfContent
                    marginBottom={isMobile ? '20px' : '0px'}
                    partHeight={activeDepo ? partHeightDepo : partHeightWith}
                    borderRadius={isMobile ? '12px' : '12px'}
                  >
                    <DepositSection isShow={activeDepo}>
                      <DepositBase
                        setSelectToken={setSelectTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        balance={balanceDepo}
                        pickedToken={pickedTokenDepo}
                        inputAmount={inputAmountDepo}
                        setInputAmount={setInputAmountDepo}
                        token={token}
                        supTokenList={supTokenList}
                        switchMethod={switchDepoMethod}
                        tokenSymbol={id}
                        useIFARM={useIFARM}
                        useBeginnersFarm={useBeginnersFarm}
                        balanceList={balanceList}
                        setQuoteValue={setQuoteValueDepo}
                        setFromInfoAmount={setFromInfoAmount}
                        setFromInfoUsdAmount={setFromInfoUsdAmount}
                        convertMonthlyYieldUSD={convertMonthlyYieldUSD}
                        convertDailyYieldUSD={convertDailyYieldUSD}
                        minReceiveAmountString={minReceiveAmountString}
                        setMinReceiveAmountString={setMinReceiveAmountString}
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
                        setPartHeight={setPartHeightDepo}
                      />
                      <DepositStart
                        pickedToken={pickedTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        inputAmount={inputAmountDepo}
                        setInputAmount={setInputAmountDepo}
                        token={token}
                        useIFARM={useIFARM}
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
                        multipleAssets={multipleAssets}
                        fromInfoAmount={fromInfoAmount}
                        fromInfoUsdAmount={fromInfoUsdAmount}
                        minReceiveAmountString={minReceiveAmountString}
                        quoteValue={quoteValueDepo}
                        setQuoteValue={setQuoteValueDepo}
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
                        quoteValue={quoteValueWith}
                        setQuoteValue={setQuoteValueWith}
                        useBeginnersFarm={useBeginnersFarm}
                        useIFARM={useIFARM}
                        setRevertFromInfoAmount={setRevertFromInfoAmount}
                        setRevertFromInfoUsdAmount={setRevertFromInfoUsdAmount}
                        setRevertMinReceivedAmount={setRevertMinReceivedAmount}
                        revertMinReceivedAmount={revertMinReceivedAmount}
                        setRevertedAmount={setRevertedAmount}
                      />
                      <WithdrawSelectToken
                        selectToken={selectTokenWith}
                        setSelectToken={setSelectTokenWith}
                        setPickedToken={setPickedTokenWith}
                        supTokenList={supTokenList}
                        supTokenNoBalanceList={supTokenNoBalanceList}
                        balanceList={balanceList}
                        defaultToken={defaultToken}
                        soonToSupList={soonToSupList}
                        setPartHeight={setPartHeightWith}
                      />
                      <WithdrawStart
                        withdrawStart={withdrawStart}
                        setWithdrawStart={setWithdrawStart}
                        pickedToken={pickedTokenWith}
                        setPickedToken={setPickedTokenWith}
                        token={token}
                        unstakeBalance={unstakeBalance}
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
                        multipleAssets={multipleAssets}
                        useIFARM={useIFARM}
                        depositedValueUSD={depositedValueUSD}
                        revertFromInfoAmount={revertFromInfoAmount}
                        revertFromInfoUsdAmount={revertFromInfoUsdAmount}
                        revertMinReceivedAmount={revertMinReceivedAmount}
                        revertedAmount={revertedAmount}
                        setUnstakeInputValue={setUnstakeInputValue}
                      />
                    </WithdrawSection>
                  </HalfContent>
                  {isMobile ? (
                    <UserBalanceData
                      token={token}
                      vaultPool={vaultPool}
                      tokenSymbol={id}
                      totalValue={totalValue}
                      useIFARM={useIFARM}
                      farmPrice={farmPrice}
                      underlyingPrice={underlyingPrice}
                    />
                  ) : (
                    <></>
                  )}
                </FirstPartSection>
              ) : activeMainTag === 1 ? (
                <SecondPartSection>
                  <MyBalance
                    height={isMobile ? 'unset' : useIFARM ? 'unset' : '120px'}
                    marginBottom={isMobile ? '20px' : '25px'}
                  >
                    <NewLabel
                      size={isMobile ? '12px' : '12px'}
                      weight="600"
                      height={isMobile ? '20px' : '20px'}
                      color="#1F2937"
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
                        color="#6F78AA"
                      >
                        Unstaked
                        <InfoIcon
                          className="info"
                          width={isMobile ? 16 : 16}
                          src={InfoNewColor}
                          alt=""
                          data-tip
                          data-for="tooltip-unstaked-desc"
                          filterColor={filterColor}
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
                        color={isMobile ? '#101828' : '#101828'}
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
                        <InfoIcon
                          className="info"
                          width={isMobile ? 16 : 16}
                          src={InfoNewColor}
                          alt=""
                          data-tip
                          data-for="tooltip-staked-desc"
                          filterColor={filterColor}
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
                            <InfoIcon
                              className="info"
                              width={isMobile ? 10 : 16}
                              src={Info}
                              alt=""
                              data-tip
                              data-for="tooltip-totalValue"
                              filterColor={filterColor}
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
                    <MyBalance marginBottom="20px">
                      <NewLabel
                        size={isMobile ? '14px' : '14px'}
                        weight="600"
                        height={isMobile ? '24px' : '24px'}
                        color="#344054"
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
              ) : (
                <RestInternal>
                  {!useIFARM && (
                    <MyBalance marginBottom={isMobile ? '20px' : '25px'}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
                        color="#1F2937"
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
                  <LastHarvestInfo>
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight={isMobile ? '600' : '600'}
                      height={isMobile ? '20px' : '24px'}
                      color={isMobile ? '#1F2937' : '#1F2937'}
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
                        color="#6F78AA"
                      >
                        Convert Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '24px' : '24px'}
                        color={isMobile ? '#101828' : '#101828'}
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
                        color="#6F78AA"
                      >
                        Revert Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '24px' : '24px'}
                        color={isMobile ? '#101828' : '#101828'}
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
                          color="#6F78AA"
                        >
                          The APY shown already considers the performance fee taken only from
                          generated yield and not deposits.
                        </NewLabel>
                        <NewLabel display="flex" self="center">
                          <InfoIcon
                            className="info"
                            width={isMobile ? 16 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-last-harvest"
                            filterColor={filterColor}
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
                    <HalfInfo marginBottom="20px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
                        color="#1F2937"
                        padding={isMobile ? '10px 15px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        Source of Yield
                      </NewLabel>
                      <DescInfo>{ReactHtmlParser(vaultPool.stakeAndDepositHelpMessage)}</DescInfo>
                      <FlexDiv className="address" padding="0 15px 20px">
                        {token.vaultAddress && (
                          <InfoLabel
                            display="flex"
                            href={`${getExplorerLink(token.chain)}/address/${token.vaultAddress}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            rel="noopener noreferrer"
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color="#15202b"
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
                          >
                            <NewLabel
                              size="12px"
                              weight={isMobile ? 600 : 600}
                              height="16px"
                              self="center"
                              color="#15202b"
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
                        >
                          <NewLabel
                            size="12px"
                            weight={isMobile ? 600 : 600}
                            height="16px"
                            self="center"
                            color="#15202b"
                          >
                            Pool Address
                          </NewLabel>
                        </InfoLabel>
                      </FlexDiv>
                    </HalfInfo>
                  )}
                </RestInternal>
              )}
            </RestContent>
          </InternalSection>
        </BigDiv>
      </Inner>
    </DetailView>
  )
}

export default AdvancedFarm
