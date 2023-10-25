import BigNumber from 'bignumber.js'
import { find, get, isEqual, isEmpty, isArray, isNaN } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import ReactHtmlParser from 'react-html-parser'
import ReactTooltip from 'react-tooltip'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { getBalances, getSupportedTokens } from 'wido'
import tokenMethods from '../../services/web3/contracts/token/methods'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Back from '../../assets/images/logos/earn/back-arrow.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import InfoNewColor from '../../assets/images/logos/beginners/help-circle-new-color.svg'
import InfoBlack from '../../assets/images/logos/earn/help-circle.svg'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import Treasure from '../../assets/images/logos/beginners/treasure-box.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
import DOT from '../../assets/images/logos/beginners/dot.svg'
import AnimatedDots from '../../components/AnimatedDots'
import DepositBase from '../../components/AdvancedFarmComponents/Deposit/DepositBase'
import DepositSelectToken from '../../components/AdvancedFarmComponents/Deposit/DepositSelectToken'
// import DepositStart from '../../components/AdvancedFarmComponents/Deposit/DepositStart'
import DepositApprove from '../../components/AdvancedFarmComponents/Deposit/DepositApprove'
// import DepositResult from '../../components/AdvancedFarmComponents/Deposit/DepositResult'
// import DepositSuccess from '../../components/AdvancedFarmComponents/Deposit/DepositSuccess'
import WithdrawBase from '../../components/AdvancedFarmComponents/Withdraw/WithdrawBase'
import WithdrawSelectToken from '../../components/AdvancedFarmComponents/Withdraw/WithdrawSelectToken'
import WithdrawStart from '../../components/AdvancedFarmComponents/Withdraw/WithdrawStart'
import WithdrawResult from '../../components/AdvancedFarmComponents/Withdraw/WithdrawResult'
import FarmDetailChart from '../../components/DetailChart/FarmDetailChart'
import PriceShareData from '../../components/PriceShareChart/PriceShareData'
import VaultPanelActionsFooter from '../../components/AdvancedFarmComponents/Rewards/VaultPanelActionsFooter'
import StakeBase from '../../components/AdvancedFarmComponents/Stake/StakeBase'
import StakeResult from '../../components/AdvancedFarmComponents/Stake/StakeResult'
import UnstakeBase from '../../components/AdvancedFarmComponents/Unstake/UnstakeBase'
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
  BackArrow,
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
  TopPart,
  MyBalance,
  FarmInfo,
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
  APRValueShow,
  TabRow,
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

const mainTags = [
  { name: 'Manage', img: Safe },
  { name: 'Rewards', img: Treasure },
  { name: 'Details', img: BarChart },
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

  const usdPrice =
    token.usdPrice || (token.data && token.data.lpTokenData && token.data.lpTokenData.price)

  // Deposit
  const [depositStart, setDepositStart] = useState(false)
  const [selectTokenDepo, setSelectTokenDepo] = useState(false)
  // const [clickTokenIdDepo, setClickedTokenIdDepo] = useState(-1)
  const [balanceDepo, setBalanceDepo] = useState(0)
  const [pickedTokenDepo, setPickedTokenDepo] = useState({ symbol: 'Select Token' })
  const [depositFinalStep, setDepositFinalStep] = useState(false)
  const [quoteValueDepo, setQuoteValueDepo] = useState(null)
  const [inputAmountDepo, setInputAmountDepo] = useState(0)
  const [partHeightDepo, setPartHeightDepo] = useState(null)
  const [price, setPrice] = useState(0)
  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')
  const [minReceiveAmountString, setMinReceiveAmountString] = useState('')

  // Withdraw
  const [withdrawStart, setWithdrawStart] = useState(false)
  const [selectTokenWith, setSelectTokenWith] = useState(false)
  const [pickedTokenWith, setPickedTokenWith] = useState({ symbol: 'Select' })
  const [withdrawFinalStep, setWithdrawFinalStep] = useState(false)
  const [unstakeBalance, setUnstakeBalance] = useState('0')
  // const [clickTokenIdWith, setClickedTokenIdWith] = useState(-1)
  const [partHeightWith, setPartHeightWith] = useState(null)
  const [quoteValueWith, setQuoteValueWith] = useState(null)

  // Stake
  const [inputAmountStake, setInputAmountStake] = useState(0)
  const [stakeFinalStep, setStakeFinalStep] = useState(false)

  // Unstake
  const [inputAmountUnstake, setInputAmountUnstake] = useState(0)
  const [unstakeFinalStep, setUnstakeFinalStep] = useState(false)

  const [yieldDaily, setYieldDaily] = useState(0)
  const [yieldMonthly, setYieldMonthly] = useState(0)
  const [convertMonthlyYieldUSD, setConvertMonthlyYieldUSD] = useState(0)
  const [convertDailyYieldUSD, setConvertDailyYieldUSD] = useState(0)

  const [balanceList, setBalanceList] = useState([])
  const [supTokenList, setSupTokenList] = useState([])
  const [supTokenNoBalanceList, setSupTokenNoBalanceList] = useState([])
  const [defaultToken, setDefaultToken] = useState({})
  const [soonToSupList, setSoonToSupList] = useState([])

  const toTokenAddress = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
  useEffect(() => {
    const staked =
      totalStaked &&
      fromWei(totalStaked, fAssetPool.lpTokenData.decimals, POOL_BALANCES_DECIMALS, true)

    const unstake =
      lpTokenBalance &&
      fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals, POOL_BALANCES_DECIMALS, true)
    const estimatedApyByPercent = get(tokenVault, `estimatedApy`, 0)
    const estimatedApy = estimatedApyByPercent / 100
    const vaultAPR = ((1 + estimatedApy) ** (1 / 365) - 1) * 365
    const vaultAPRDaily = vaultAPR / 365
    const vaultAPRMonthly = vaultAPR / 12

    let totalRewardAPRByPercent = 0
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
      Number(unstake) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
    const monthlyYield =
      Number(staked) * usdPrice * (vaultAPRMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
      Number(unstake) * usdPrice * (vaultAPRMonthly + swapFeeAPRMonthly)
    setYieldDaily(dailyYield)
    setYieldMonthly(monthlyYield)
  }, [fAssetPool, tokenVault, usdPrice, lpTokenBalance, totalStaked])

  useEffect(() => {
    const convertMonthlyYieldValue =
      (Number(minReceiveAmountString) * Number(usdPrice) * Number(totalApy)) / 12
    const convertDailyYieldYieldValue =
      (Number(minReceiveAmountString) * Number(usdPrice) * Number(totalApy)) / 365
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
  }, [account, chain, balances]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const { fontColor, filterColor } = useThemeContext()

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

  // Count of users that used token
  // const [holderCount, setHolderCount] = useState(0)
  // useEffect(() => {
  //   const getTokenHolder = async () => {
  //     const chainName =
  //       chain === CHAIN_IDS.ETH_MAINNET
  //         ? 'eth'
  //         : chain === CHAIN_IDS.ARBITRUM_ONE
  //         ? 'arbitrum'
  //         : chain === CHAIN_IDS.POLYGON_MAINNET
  //         ? 'polygon'
  //         : ''

  //     const options = {
  //       method: 'POST',
  //       url:
  //         'https://rpc.ankr.com/multichain/79258ce7f7ee046decc3b5292a24eb4bf7c910d7e39b691384c7ce0cfb839a01/',
  //       // eslint-disable-next-line camelcase
  //       params: { ankr_getTokenHolders: '' },
  //       headers: { accept: 'application/json', 'content-type': 'application/json' },
  //       data: {
  //         jsonrpc: '2.0',
  //         method: 'ankr_getTokenHolders',
  //         params: {
  //           blockchain: chainName,
  //           contractAddress: paramAddress,
  //         },
  //         id: 1,
  //       },
  //     }

  //     axios
  //       .request(options)
  //       .then(response => {
  //         if (response.data.result === undefined) {
  //           return
  //         }
  //         setHolderCount(response.data.result.holdersCount)
  //       })
  //       .catch(error => {
  //         console.error(error)
  //       })
  //   }

  //   getTokenHolder()
  // }, [paramAddress, chain, token])

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

  const [vaultValue, setVaultValue] = useState(null)
  const [loadingFarmingBalance, setFarmingLoading] = useState(false)
  const [loadingLpStats, setLpStatsloading] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const loaded = true
  const [lastHarvest, setLastHarvest] = useState('')
  const [activeStake, setActiveStake] = useState(true)
  const switchStakeMethod = () => setActiveStake(prev => !prev)

  const [loadData, setLoadData] = useState(true)
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

  const [totalValue, setTotalValue] = useState(0)
  const [underlyingValue, setUnderlyingValue] = useState(0)
  const [depositedValueUSD, setDepositUsdValue] = useState(0)
  const [balanceAmount, setBalanceAmount] = useState(0)
  const [totalReward, setTotalReward] = useState(0)
  const firstUnderlyingBalance = useRef(true)

  const getPrice = async data => {
    try {
      const result = Number(get(data, `${IFARM_TOKEN_SYMBOL}.usdPrice`, 0)).toFixed(2)
      return result
    } catch (e) {
      return 0
    }
  }

  useEffect(() => {
    const getPriceValue = async () => {
      const value = await getPrice(vaultsData)
      setPrice(value)
    }

    getPriceValue()
  }, [vaultsData])

  useEffect(() => {
    const staked =
      totalStaked &&
      fromWei(totalStaked, fAssetPool.lpTokenData.decimals, POOL_BALANCES_DECIMALS, true)

    const unstake =
      lpTokenBalance &&
      fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals, POOL_BALANCES_DECIMALS, true)

    const total = Number(staked) + Number(unstake)
    const amountBalance = total * usdPrice
    setBalanceAmount(amountBalance)
    setTotalValue(total)
  }, [totalStaked, lpTokenBalance, fAssetPool, usdPrice])

  useEffect(() => {
    const depositUsdValue = formatNumber(
      fromWei(lpTokenBalance, fAssetPool?.lpTokenData?.decimals, POOL_BALANCES_DECIMALS, true) *
        usdPrice,
      POOL_BALANCES_DECIMALS,
    )
    setDepositUsdValue(depositUsdValue)
  }, [lpTokenBalance, fAssetPool, usdPrice])

  useEffect(() => {
    const hasZeroValue = underlyingValue === 0
    if (account && hasZeroValue && (firstUnderlyingBalance.current || !isEmpty(vaultsData))) {
      const getUnderlyingBalance = async () => {
        firstUnderlyingBalance.current = false
        const val = Number(
          fromWei(
            get(vaultsData, `${IFARM_TOKEN_SYMBOL}.underlyingBalanceWithInvestmentForHolder`, 0),
            tokens[IFARM_TOKEN_SYMBOL].decimals,
            WIDO_BALANCES_DECIMALS,
          ),
        )
        setUnderlyingValue(val)
      }

      getUnderlyingBalance()
    }
  }, [account, vaultsData, underlyingValue, tokens])

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

  const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])
  const tempPricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)
  const pricePerFullShare = fromWei(
    tempPricePerFullShare,
    useIFARM ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.decimals`, 0) : token.decimals,
  )
  useEffect(() => {
    for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
      // eslint-disable-next-line one-var
      let rewardSymbol = rewardTokenSymbols[l].toUpperCase(),
        usdRewardPrice = 0,
        rewardDecimal = 18

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
      } else if (rewardSymbol.substring(0, 1) === 'f') {
        let underlyingRewardSymbol
        if (rewardSymbol.substring(0, 2) === 'fx') {
          underlyingRewardSymbol = rewardSymbol.substring(2)
        } else {
          underlyingRewardSymbol = rewardSymbol.substring(1)
        }
        // eslint-disable-next-line no-loop-func
        const fetchData = async () => {
          try {
            for (let ids = 0; ids < apiData.length; ids += 1) {
              const tempData = apiData[ids]
              const tempSymbol = tempData.symbol
              if (tempSymbol.toLowerCase() === underlyingRewardSymbol.toLowerCase()) {
                // eslint-disable-next-line no-await-in-loop
                const usdUnderlyingRewardPrice = await getTokenPriceFromApi(tempData.id)
                usdRewardPrice = Number(usdUnderlyingRewardPrice) * Number(pricePerFullShare)
                console.log(
                  `${underlyingRewardSymbol} - USD Price of reward token: ${usdRewardPrice}`,
                )
                return
              }
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }

        fetchData()
      } else {
        const fetchData = async () => {
          try {
            for (let ids = 0; ids < apiData.length; ids += 1) {
              const tempData = apiData[ids]
              const tempSymbol = tempData.symbol
              if (tempSymbol.toLowerCase() === rewardSymbol.toLowerCase()) {
                // eslint-disable-next-line no-await-in-loop
                usdRewardPrice = await getTokenPriceFromApi(tempData.id)
                console.log(`${rewardSymbol} - USD Price: ${usdRewardPrice}`)
                return
              }
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }

        fetchData()
      }

      const totalRewardUsd = Number(
        totalRewardsEarned === undefined
          ? 0
          : fromWei(totalRewardsEarned, rewardDecimal) * usdRewardPrice,
      )
      setTotalReward(totalRewardUsd)
    }
  }, [
    userStats,
    fAssetPool,
    apiData,
    groupOfVaults,
    pricePerFullShare,
    rewardTokenSymbols,
    totalRewardsEarned,
  ])

  const viewComponentProps = {
    token,
    tokenDecimals,
    fAssetPool,
    totalRewardsEarned,
    pendingAction,
    setLoadingDots,
    setPendingAction,
    loaded,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    isSpecialVault,
  }

  return (
    <DetailView fontColor={fontColor}>
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
                <BackArrow src={Back} alt="" />
                <BackText>Back</BackText>
              </BackBtnRect>
            </TopButton>
            {isMobile && (
              <FlexDiv>
                {logoUrl.map((el, i) => (
                  <LogoImg className="logo" src={el.slice(1, el.length)} key={i} alt="" />
                ))}
                <ChainBack>
                  <img src={BadgeAry[badgeId]} width={6} height={10} alt="" />
                </ChainBack>
              </FlexDiv>
            )}
            {!isMobile && (
              <FlexDiv>
                {logoUrl.map((el, i) => (
                  <LogoImg className="logo" src={el.slice(1, el.length)} key={i} alt="" />
                ))}
                <TopDesc
                  weight={600}
                  size={isMobile ? '19.7px' : '25px'}
                  height={isMobile ? '45px' : '82px'}
                  marginBottom={isMobile ? '5px' : '10px'}
                >
                  {token.tokenNames.join(' • ')}
                </TopDesc>
              </FlexDiv>
            )}
            <GuideSection>
              <GuidePart>
                {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                &nbsp;APR
              </GuidePart>
              <GuidePart>
                {showTVL()}
                &nbsp;TVL
              </GuidePart>
            </GuideSection>
            {/* <NewLabel
              weight={700}
              size={isMobile ? '9px' : '18px'}
              height={isMobile ? '14px' : '26px'}
              color="white"
            >
              <img className="thumbs-up" src={Thumbsup} alt="" />
              Currently used by {holderCount} users.
            </NewLabel> */}
            <TabRow>
              <MainTagPanel>
                {mainTags.map((tag, i) => (
                  <MainTag
                    key={i}
                    active={activeMainTag === i ? 'true' : 'false'}
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
                  <NetDetailContent>{token.platform[0]}</NetDetailContent>
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
                <ValueBox width="24%">
                  <BoxTitle>APY</BoxTitle>
                  <BoxValue>{showAPY()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%">
                  <BoxTitle>Daily APY</BoxTitle>
                  <BoxValue>{showApyDaily()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%">
                  <BoxTitle>TVL</BoxTitle>
                  <BoxValue>{showTVL()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%">
                  <BoxTitle>Last Harvest</BoxTitle>
                  <BoxValue>{lastHarvest !== '' ? `${lastHarvest} ago` : '-'}</BoxValue>
                </ValueBox>
              </BoxCover>
            )}
            <MainSection height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <>
                  <BoxCover>
                    <ValueBox height="120px" width="32%">
                      <BoxTitle>My Balance</BoxTitle>
                      <BoxValue>
                        ${' '}
                        {!connected ? (
                          0
                        ) : lpTokenBalance ? (
                          formatNumber(balanceAmount, 2)
                        ) : (
                          <AnimatedDots />
                        )}
                      </BoxValue>
                    </ValueBox>
                    <ValueBox height="120px" width="32%">
                      <BoxTitle>Monthly Yield</BoxTitle>
                      <BoxValue>
                        $ {!connected ? 0 : isNaN(yieldMonthly) ? 0 : formatNumber(yieldMonthly, 2)}
                      </BoxValue>
                    </ValueBox>
                    <ValueBox height="120px" width="32%">
                      <BoxTitle>Daily Yield</BoxTitle>
                      <BoxValue>
                        $ {!connected ? 0 : isNaN(yieldDaily) ? 0 : formatNumber(yieldDaily, 2)}
                      </BoxValue>
                    </ValueBox>
                  </BoxCover>
                  <div>
                    {loadData ? (
                      <PriceShareData
                        token={token}
                        vaultPool={vaultPool}
                        tokenSymbol={id}
                        setLoadData={setLoadData}
                      />
                    ) : (
                      <HalfInfo padding="25px 18px" marginBottom="0">
                        <FarmDetailChart
                          token={token}
                          vaultPool={vaultPool}
                          lastTVL={Number(vaultValue)}
                          lastAPY={Number(totalApy)}
                        />
                      </HalfInfo>
                    )}
                  </div>
                </>
              ) : activeMainTag === 1 ? (
                useIFARM ? (
                  <HalfInfo marginBottom="20px">
                    <NewLabel
                      weight={700}
                      size="14px"
                      height="24px"
                      padding="10px 15px"
                      borderRadius="15px 15px 0 0"
                    >
                      Staking details
                    </NewLabel>
                    <DescInfo>
                      In this module you can only stake FARM to be entitled to platform profits,
                      paid out in FARM. You cannot stake iFARM as it’s an interest-bearing token,
                      which is also entitled to platform rewards by simply holding it in your
                      wallet.
                    </DescInfo>
                  </HalfInfo>
                ) : (
                  <>
                    <MyBalance height="120px" marginBottom="23px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="500"
                        height={isMobile ? '18px' : '20px'}
                        color="#6F78AA"
                        padding={isMobile ? '9px 13px' : '24px 24px 0px 24px'}
                      >
                        Rewards
                      </NewLabel>
                      <RewardValue>
                        <BoxValue>
                          ${' '}
                          {!connected ? (
                            0
                          ) : userStats ? (
                            formatNumber(totalReward, 2)
                          ) : (
                            <AnimatedDots />
                          )}
                        </BoxValue>
                      </RewardValue>
                    </MyBalance>
                    <MyBalance marginBottom="23px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '9px 13px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        My Token Rewards
                      </NewLabel>
                      <FlexDiv>
                        <VaultPanelActionsFooter {...viewComponentProps} />
                      </FlexDiv>
                    </MyBalance>
                  </>
                )
              ) : (
                <>
                  {loadData && (
                    <HalfInfo padding="25px 18px" marginBottom="23px">
                      <FarmDetailChart
                        token={token}
                        vaultPool={vaultPool}
                        lastTVL={Number(vaultValue)}
                        lastAPY={Number(totalApy)}
                      />
                    </HalfInfo>
                  )}
                  <HalfInfo marginBottom="20px">
                    <NewLabel
                      weight={700}
                      size="14px"
                      height="24px"
                      padding="10px 15px"
                      borderRadius="15px 15px 0 0"
                    >
                      Source of Yield
                    </NewLabel>
                    <DescInfo>
                      {useIFARM ? (
                        <div>
                          <p>
                            When you supply{' '}
                            <a
                              href="https://etherscan.io/token/0xa0246c9032bC3A600820415aE600c6388619A14D"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              FARM
                            </a>{' '}
                            you will be rewarded with a share of the profits of the platform paid
                            out in{' '}
                            <a
                              href="https://etherscan.io/token/0xa0246c9032bC3A600820415aE600c6388619A14D"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              FARM
                            </a>{' '}
                            rewards. When depositing into the vault you obtain the yield-bearing
                            yield-bearing token{' '}
                            <a
                              href="https://etherscan.io/token/0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              iFARM
                            </a>
                            . You can swap iFARM for the underlying FARM at any time.
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
                            weight={isMobile ? 400 : 600}
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
                            weight={isMobile ? 400 : 600}
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
                  {!isMobile && !loadData && (
                    <MyBalance marginBottom={isMobile ? '24px' : '20px'}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="700"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '9px 13px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        APY Breakdown
                      </NewLabel>
                      <NewLabel padding={isMobile ? '9px 13px' : '0px 15px 10px'}>
                        <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
                      </NewLabel>
                    </MyBalance>
                  )}
                </>
              )}
            </MainSection>
            <RestContent height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <FirstPartSection>
                  {useIFARM ? (
                    <FarmInfo
                      marginBottom={isMobile ? '0' : '23px'}
                      marginTop={isMobile ? '0px' : '0'}
                    >
                      <NewLabel
                        display="flex"
                        justifyContent="space-between"
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        iFarm
                      </NewLabel>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                      >
                        <NewLabel
                          display="flex"
                          size={isMobile ? '10px' : '14px'}
                          weight="500"
                          height={isMobile ? '18px' : '24px'}
                          color="#344054"
                        >
                          Balance
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-balance"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-balance"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              The number of iFARM tokens on your wallet.
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                        <NewLabel
                          size={isMobile ? '10px' : '14px'}
                          height={isMobile ? '18px' : '24px'}
                          weight="700"
                          color="#00D26B"
                        >
                          {!connected ? (
                            0
                          ) : lpTokenBalance ? (
                            formatNumberWido(
                              fromWei(
                                get(balances, IFARM_TOKEN_SYMBOL, 0),
                                tokens[IFARM_TOKEN_SYMBOL].decimals,
                                WIDO_BALANCES_DECIMALS,
                              ),
                              WIDO_BALANCES_DECIMALS,
                            )
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
                          Underlying Balance
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-underlying-balance"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-underlying-balance"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              Your iFARM earnings denominated in underlying FARM.
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
                          {!connected ? (
                            0
                          ) : isEmpty(vaultsData) ? (
                            <AnimatedDots />
                          ) : (
                            formatNumberWido(underlyingValue, WIDO_BALANCES_DECIMALS)
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
                          iFARM Price
                        </NewLabel>
                        <NewLabel
                          weight="500"
                          size={isMobile ? '10px' : '14px'}
                          height={isMobile ? '18px' : '24px'}
                          color="black"
                          self="center"
                        >
                          {!account ? '' : price ? `$${price}` : <AnimatedDots />}
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
                            data-for="tooltip-total-value"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-total-value"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              Total value in USD of your iFARM holdings.
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
                          ) : get(balances, IFARM_TOKEN_SYMBOL, 0) && token.data.lpTokenData ? (
                            `$${formatNumberWido(
                              fromWei(
                                get(balances, IFARM_TOKEN_SYMBOL, 0),
                                tokens[IFARM_TOKEN_SYMBOL].decimals,
                                WIDO_BALANCES_DECIMALS,
                              ) * price,
                              2,
                            )}`
                          ) : (
                            <AnimatedDots />
                          )}
                        </NewLabel>
                      </FlexDiv>
                    </FarmInfo>
                  ) : (
                    <MyBalance
                      marginBottom={isMobile ? '0' : '25px'}
                      marginTop={isMobile ? '0px' : '0'}
                      height={isMobile ? 'unset' : '120px'}
                    >
                      <NewLabel
                        display="flex"
                        justifyContent="space-between"
                        size={isMobile ? '12px' : '12px'}
                        weight="600"
                        height={isMobile ? '18px' : '20px'}
                        color="#1F2937"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #F2F5FF"
                      >
                        <>{`f${id}`}</>
                        <InfoIconBlack
                          className="info"
                          width={isMobile ? 10 : 16}
                          src={InfoBlack}
                          alt=""
                          data-tip
                          data-for="tooltip-token-name"
                        />
                        <ReactTooltip
                          id="tooltip-token-name"
                          backgroundColor="black"
                          borderColor="black"
                          textColor="white"
                        >
                          <NewLabel
                            size={isMobile ? '10px' : '12px'}
                            height={isMobile ? '15px' : '18px'}
                            weight="600"
                            color="white"
                          >
                            The interest-bearing fToken. It entitles its holder to auto-compounded
                            yield of this farm.
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '5px 15px'}
                      >
                        <NewLabel
                          display="flex"
                          size={isMobile ? '10px' : '12px'}
                          weight="500"
                          height={isMobile ? '18px' : '24px'}
                          color="#6F78AA"
                        >
                          Balance
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-balance"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-balance"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              This f{id} represents your share in this farm.
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                        <NewLabel
                          size={isMobile ? '10px' : '12px'}
                          height={isMobile ? '18px' : '24px'}
                          weight="500"
                          color="#6F78AA"
                        >
                          {!connected ? (
                            0
                          ) : lpTokenBalance ? (
                            fromWei(
                              lpTokenBalance,
                              fAssetPool.lpTokenData.decimals,
                              POOL_BALANCES_DECIMALS,
                              true,
                            )
                          ) : (
                            <AnimatedDots />
                          )}
                        </NewLabel>
                      </FlexDiv>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '5px 15px'}
                      >
                        <NewLabel
                          size={isMobile ? '10px' : '12px'}
                          height={isMobile ? '18px' : '24px'}
                          weight="500"
                          color="#6F78AA"
                          self="center"
                        >
                          Underlying Balance
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-underlying-balance"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-underlying-balance"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              This f{id} represents your share in this farm.
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                        <NewLabel
                          weight="500"
                          size={isMobile ? '10px' : '12px'}
                          height={isMobile ? '18px' : '24px'}
                          color="#6F78AA"
                          self="center"
                        >
                          {!connected ? 0 : lpTokenBalance ? totalValue : <AnimatedDots />}
                        </NewLabel>
                      </FlexDiv>
                    </MyBalance>
                  )}
                  <HalfContent
                    marginBottom={isMobile ? '24px' : '0px'}
                    partHeight={activeDepo ? partHeightDepo : partHeightWith}
                    borderRadius={isMobile ? '9px' : '12px'}
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
                        // clickTokenId={clickTokenIdDepo}
                        // setClickedTokenId={setClickedTokenIdDepo}
                        // supTokenList={supTokenList}
                        setPickedToken={setPickedTokenDepo}
                        setBalance={setBalanceDepo}
                        supTokenNoBalanceList={supTokenNoBalanceList}
                        balanceList={balanceList}
                        defaultToken={defaultToken}
                        soonToSupList={soonToSupList}
                        setPartHeight={setPartHeightDepo}
                      />
                      <DepositApprove
                        pickedToken={pickedTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        finalStep={depositFinalStep}
                        setFinalStep={setDepositFinalStep}
                        inputAmount={inputAmountDepo}
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
                      />
                      {/* <DepositStart
                        pickedToken={pickedTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        finalStep={depositFinalStep}
                        setFinalStep={setDepositFinalStep}
                        inputAmount={inputAmountDepo}
                        token={token}
                        balanceList={balanceList}
                        useIFARM={useIFARM}
                        tokenSymbol={id}
                        setQuoteValue={setQuoteValueDepo}
                        fAssetPool={fAssetPool}
                        multipleAssets={multipleAssets}
                      /> */}
                      {/* <DepositResult
                        pickedToken={pickedTokenDepo}
                        finalStep={depositFinalStep}
                        setFinalStep={setDepositFinalStep}
                        setSelectToken={setSelectTokenDepo}
                        setDeposit={setDepositStart}
                        inputAmount={inputAmountDepo}
                        token={token}
                        useIFARM={useIFARM}
                        tokenSymbol={id}
                        quoteValue={quoteValueDepo}
                        setQuoteValue={setQuoteValueDepo}
                      /> */}
                      {/* <DepositSuccess
                        pickedToken={pickedTokenDepo}
                        finalStep={depositFinalStep}
                        setFinalStep={setDepositFinalStep}
                        setSelectToken={setSelectTokenDepo}
                        setDeposit={setDepositStart}
                        inputAmount={inputAmountDepo}
                        token={token}
                        useIFARM={useIFARM}
                        tokenSymbol={id}
                        quoteValue={quoteValueDepo}
                        setQuoteValue={setQuoteValueDepo}
                      /> */}
                    </DepositSection>
                    <WithdrawSection isShow={!activeDepo}>
                      <WithdrawBase
                        selectToken={selectTokenWith}
                        setSelectToken={setSelectTokenWith}
                        withdrawStart={withdrawStart}
                        setWithdrawStart={setWithdrawStart}
                        finalStep={withdrawFinalStep}
                        pickedToken={pickedTokenWith}
                        unstakeBalance={unstakeBalance}
                        setUnstakeBalance={setUnstakeBalance}
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
                        lpTokenBalance={lpTokenBalance}
                        token={token}
                        supTokenList={supTokenList}
                        switchMethod={switchDepoMethod}
                        useIFARM={useIFARM}
                      />
                      <WithdrawSelectToken
                        selectToken={selectTokenWith}
                        setSelectToken={setSelectTokenWith}
                        // clickTokenId={clickTokenIdWith}
                        // setClickedTokenId={setClickedTokenIdWith}
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
                        finalStep={withdrawFinalStep}
                        setFinalStep={setWithdrawFinalStep}
                        token={token}
                        unstakeBalance={unstakeBalance}
                        balanceList={balanceList}
                        tokenSymbol={id}
                        fAssetPool={fAssetPool}
                        multipleAssets={multipleAssets}
                        useIFARM={useIFARM}
                        setQuoteValue={setQuoteValueWith}
                        depositedValueUSD={depositedValueUSD}
                      />
                      <WithdrawResult
                        pickedToken={pickedTokenWith}
                        finalStep={withdrawFinalStep}
                        setFinalStep={setWithdrawFinalStep}
                        setWithdraw={setWithdrawStart}
                        unstakeBalance={unstakeBalance}
                        token={token}
                        tokenSymbol={id}
                        quoteValue={quoteValueWith}
                        useIFARM={useIFARM}
                      />
                    </WithdrawSection>
                  </HalfContent>
                  {isMobile ? (
                    loadData ? (
                      <PriceShareData
                        token={token}
                        vaultPool={vaultPool}
                        tokenSymbol={id}
                        setLoadData={setLoadData}
                      />
                    ) : (
                      <HalfInfo padding="25px 18px" marginBottom="23px">
                        <FarmDetailChart
                          token={token}
                          vaultPool={vaultPool}
                          lastTVL={Number(vaultValue)}
                          lastAPY={Number(totalApy)}
                        />
                      </HalfInfo>
                    )
                  ) : (
                    <></>
                  )}
                </FirstPartSection>
              ) : activeMainTag === 1 ? (
                <SecondPartSection>
                  {useIFARM ? (
                    <FarmInfo
                      marginBottom={isMobile ? '0' : '23px'}
                      marginTop={isMobile ? '0px' : '0'}
                    >
                      <NewLabel
                        display="flex"
                        justifyContent="space-between"
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        Farm (Legacy)
                      </NewLabel>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                      >
                        <NewLabel
                          display="flex"
                          size={isMobile ? '10px' : '14px'}
                          weight="500"
                          height={isMobile ? '18px' : '24px'}
                          color="#344054"
                        >
                          Unstaked
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-unstaked"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-unstaked"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              The number of FARM holdings in your wallet which you can stake.
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                        <NewLabel
                          size={isMobile ? '10px' : '14px'}
                          height={isMobile ? '18px' : '24px'}
                          weight="700"
                          color="#00D26B"
                        >
                          {!connected ? (
                            0
                          ) : lpTokenBalance ? (
                            fromWei(
                              lpTokenBalance,
                              fAssetPool.lpTokenData.decimals,
                              POOL_BALANCES_DECIMALS,
                              true,
                            )
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
                          Staked
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={Info}
                            alt=""
                            data-tip
                            data-for="tooltip-staked"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-staked"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              The number of staked FARM earning you more FARM from platform&apos;s
                              profit sharing pool.
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
                          ) : totalStaked ? (
                            fromWei(
                              totalStaked,
                              tokens[FARM_TOKEN_SYMBOL].decimals,
                              WIDO_BALANCES_DECIMALS,
                              true,
                            )
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
                          iFARM Price
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
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
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
                    </FarmInfo>
                  ) : (
                    <MyBalance height="120px" marginBottom={isMobile ? '0' : '23px'}>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        weight="600"
                        height={isMobile ? '18px' : '20px'}
                        color="#1F2937"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #F2F5FF "
                      >
                        {useIFARM ? 'iFARM' : `f${id}`}
                      </NewLabel>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '5px 15px'}
                      >
                        <NewLabel
                          size={isMobile ? '10px' : '12px'}
                          height={isMobile ? '18px' : '24px'}
                          weight="500"
                          color="#6F78AA"
                        >
                          Unstaked
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={InfoNewColor}
                            alt=""
                            data-tip
                            data-for="tooltip-unstaked-desc"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-unstaked-desc"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              The number of f{id} you hold, but not entitled to extra token rewards.
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                        <NewLabel
                          weight="500"
                          size={isMobile ? '10px' : '12px'}
                          height={isMobile ? '18px' : '24px'}
                          color={isMobile ? '#15202b' : '#6F78AA'}
                        >
                          {!connected ? (
                            0
                          ) : lpTokenBalance ? (
                            fromWei(
                              lpTokenBalance,
                              fAssetPool.lpTokenData.decimals,
                              POOL_BALANCES_DECIMALS,
                              true,
                            )
                          ) : (
                            <AnimatedDots />
                          )}
                        </NewLabel>
                      </FlexDiv>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '5px 15px'}
                      >
                        <NewLabel
                          display="flex"
                          size={isMobile ? '10px' : '12px'}
                          weight="500"
                          height={isMobile ? '18px' : '24px'}
                          color="#15B088"
                        >
                          Staked
                          <InfoIcon
                            className="info"
                            width={isMobile ? 10 : 16}
                            src={InfoNewColor}
                            alt=""
                            data-tip
                            data-for="tooltip-staked-desc"
                            filterColor={filterColor}
                          />
                          <ReactTooltip
                            id="tooltip-staked-desc"
                            backgroundColor="black"
                            borderColor="black"
                            textColor="white"
                          >
                            <NewLabel
                              size={isMobile ? '10px' : '12px'}
                              height={isMobile ? '15px' : '18px'}
                              weight="600"
                              color="white"
                            >
                              The number of staked f{id}, which are entitled to all token rewards.
                            </NewLabel>
                          </ReactTooltip>
                        </NewLabel>
                        <NewLabel
                          size={isMobile ? '10px' : '12px'}
                          height={isMobile ? '18px' : '24px'}
                          weight={isMobile ? '500' : '500'}
                          color={isMobile ? '#15202b' : '#15B088'}
                        >
                          {!connected ? (
                            0
                          ) : totalStaked ? (
                            fromWei(
                              totalStaked,
                              fAssetPool.lpTokenData.decimals,
                              POOL_BALANCES_DECIMALS,
                              true,
                            )
                          ) : (
                            <AnimatedDots />
                          )}
                        </NewLabel>
                      </FlexDiv>
                    </MyBalance>
                  )}
                  {isMobile && (
                    <MyBalance marginBottom="24px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#000"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        My Extra Rewards
                      </NewLabel>
                      <FlexDiv>
                        <VaultPanelActionsFooter {...viewComponentProps} />
                      </FlexDiv>
                    </MyBalance>
                  )}
                  <HalfContent
                    marginBottom={isMobile ? '24px' : '0px'}
                    borderRadius={isMobile ? '9px' : '12px'}
                  >
                    <StakeSection isShow={activeStake}>
                      <StakeBase
                        finalStep={stakeFinalStep}
                        setFinalStep={setStakeFinalStep}
                        inputAmount={inputAmountStake}
                        setInputAmount={setInputAmountStake}
                        token={token}
                        switchMethod={switchStakeMethod}
                        tokenSymbol={id}
                        lpTokenBalance={lpTokenBalance}
                        fAssetPool={fAssetPool}
                        lpTokenApprovedBalance={lpTokenApprovedBalance}
                        setPendingAction={setPendingAction}
                        multipleAssets={multipleAssets}
                        setLoadingDots={setLoadingDots}
                        useIFARM={useIFARM}
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
                        finalStep={unstakeFinalStep}
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
                  {isMobile && (
                    <MyBalance marginBottom={isMobile ? '24px' : '0'}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight={isMobile ? '600' : '700'}
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding="10px 15px"
                        borderBottom="1px solid #F3F6FF"
                        display="flex"
                        justifyContent="space-between"
                      >
                        APY Breakdown
                        <APRValueShow>
                          <img src={DOT} alt="" />
                          {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                          &nbsp;APR
                        </APRValueShow>
                      </NewLabel>
                      <NewLabel padding={isMobile ? '0' : '10px 15px'}>
                        <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
                      </NewLabel>
                    </MyBalance>
                  )}
                  {!isMobile && loadData && (
                    <MyBalance marginBottom={isMobile ? '24px' : '20px'}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '9px 13px' : '10px 15px'}
                        borderBottom="1px solid #F3F6FF"
                      >
                        APY Breakdown
                      </NewLabel>
                      <NewLabel padding={isMobile ? '9px 13px' : '0px 15px 10px'}>
                        <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
                      </NewLabel>
                    </MyBalance>
                  )}
                  <LastHarvestInfo>
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight={isMobile ? '600' : '700'}
                      height={isMobile ? '18px' : '24px'}
                      color={isMobile ? '#000' : '#344054'}
                      padding={isMobile ? '7px 11px' : '10px 15px'}
                      borderBottom="1px solid #F3F6FF"
                    >
                      Fees
                    </NewLabel>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '7px 11px' : '10px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '10px' : '14px'}
                        weight="500"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                      >
                        Deposit Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '10px' : '14px'}
                        weight="500"
                        height={isMobile ? '18px' : '24px'}
                        color={isMobile ? '#15202B' : '#000'}
                      >
                        0%
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '7px 11px' : '10px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '10px' : '14px'}
                        weight="500"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                      >
                        Withdrawal Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '10px' : '14px'}
                        weight="500"
                        height={isMobile ? '18px' : '24px'}
                        color={isMobile ? '#15202B' : '#000'}
                      >
                        0%
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv
                      justifyContent="space-between"
                      padding={isMobile ? '7px 11px' : '10px 15px'}
                    >
                      <NewLabel
                        size={isMobile ? '8px' : '13px'}
                        weight="300"
                        height="normal"
                        color="#15202b"
                      >
                        The APY shown already considers the performance fee taken only from
                        generated yield and not deposits.
                      </NewLabel>
                      <NewLabel display="flex" self="center">
                        <InfoIcon
                          className="info"
                          width={isMobile ? 10 : 16}
                          src={Info}
                          alt=""
                          data-tip
                          data-for="tooltip-last-harvest"
                          filterColor={filterColor}
                        />
                        <ReactTooltip
                          id="tooltip-last-harvest"
                          backgroundColor="black"
                          borderColor="black"
                          textColor="white"
                          place={isMobile ? 'left' : 'top'}
                        >
                          <NewLabel
                            weight="500"
                            size={isMobile ? '10px' : '13px'}
                            height={isMobile ? '12px' : '16px'}
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
                  </LastHarvestInfo>
                  {isMobile && (
                    <>
                      {loadData && (
                        <HalfInfo padding="25px 18px" marginBottom="23px">
                          <FarmDetailChart
                            token={token}
                            vaultPool={vaultPool}
                            lastTVL={Number(vaultValue)}
                            lastAPY={Number(totalApy)}
                          />
                        </HalfInfo>
                      )}
                      <HalfInfo marginBottom="24px">
                        <NewLabel
                          weight={700}
                          size="12px"
                          height="18px"
                          padding="7px 11px"
                          color="#000"
                        >
                          Source of Yield
                        </NewLabel>
                        <DescInfo>{ReactHtmlParser(vaultPool.stakeAndDepositHelpMessage)}</DescInfo>
                      </HalfInfo>
                    </>
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
