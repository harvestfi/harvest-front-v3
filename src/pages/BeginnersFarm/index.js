import BigNumber from 'bignumber.js'
import { find, get, isEqual, isEmpty, isArray, isNaN } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import { useHistory, useLocation } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { ethers } from 'ethers'
import { BiRightArrowAlt } from 'react-icons/bi'
import { RxCross2 } from 'react-icons/rx'
import { PiQuestion } from 'react-icons/pi'
import tokenMethods from '../../services/web3/contracts/token/methods'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import logoNew from '../../assets/images/logos/sidebar/ifarm.svg'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
import FarmerAvatar from '../../assets/images/logos/sidebar/connectavatar.png'
import AnimatedDots from '../../components/AnimatedDots'
import DepositBase from '../../components/AdvancedFarmComponents/Deposit/DepositBase'
import DepositSelectToken from '../../components/AdvancedFarmComponents/Deposit/DepositSelectToken'
import DepositStart from '../../components/AdvancedFarmComponents/Deposit/DepositStart'
import WithdrawBase from '../../components/AdvancedFarmComponents/Withdraw/WithdrawBase'
import WithdrawSelectToken from '../../components/AdvancedFarmComponents/Withdraw/WithdrawSelectToken'
import WithdrawStart from '../../components/AdvancedFarmComponents/Withdraw/WithdrawStart'
import FarmDetailChart from '../../components/DetailChart/FarmDetailChart'
import UserBalanceData from '../../components/UserBalanceChart/UserBalanceData'
import {
  DECIMAL_PRECISION,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  POOL_BALANCES_DECIMALS,
  MAX_BALANCES_DECIMALS,
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
  getAdvancedRewardText,
  getLastHarvestInfo,
} from '../../utils'
import {
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
  TopPart,
  MyBalance,
  GuideSection,
  GuidePart,
  DepositSection,
  WithdrawSection,
  MainSection,
  ChainBack,
  MainTag,
  InternalSection,
  WelcomeBox,
  WelcomeTop,
  FarmerImage,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
  WelcomeClose,
  HeaderBadge,
  HalfInfo,
  InfoLabel,
  DescInfo,
  LastHarvestInfo,
  RestInternal,
  MainTagPanel,
  FirstPartSection,
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
  MobileChain,
  LinksContainer,
  Logo,
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

const mainTags = [
  { name: 'Start Farming', img: Safe },
  { name: 'Farm Details', img: BarChart },
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

const BeginnersFarm = () => {
  const {
    darkMode,
    bgColor,
    hoverColor,
    fontColor,
    fontColor1,
    fontColor3,
    fontColor4,
    fontColor6,
    borderColor,
    bgColorTooltip,
    backColor,
  } = useThemeContext()

  const paramAddress = '0x0B0193fAD49DE45F5E2B0A9f5D6Bc3BB7D281688'

  const {
    getPortalsBaseTokens,
    getPortalsEstimate,
    getPortalsBalances,
    SUPPORTED_TOKEN_LIST,
  } = usePortals()

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const { push } = useHistory()

  const { pathname } = useLocation()

  const { vaultsData, loadingVaults } = useVaults()
  const { pools, userStats, fetchUserPoolStats } = usePools()
  const { connected, account, balances, getWalletBalances } = useWallet()
  const { profitShareAPY } = useStats()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')

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

  const useBeginnersFarm = true
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

  const tempPricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)
  const pricePerFullShare = Number(fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals))

  const usdPrice =
    Number(token.vaultPrice) ||
    Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price) * pricePerFullShare
  const farmPrice = Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price)
  const underlyingPrice =
    Number(token.usdPrice) ||
    Number(token.data && token.data.lpTokenData && token.data.lpTokenData.price)

  // Switch Tag (Deposit/Withdraw)
  const [activeDepo, setActiveDepo] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState(true)
  const [showBadge, setShowBadge] = useState(false)
  const [supportedVault, setSupportedVault] = useState(true)

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
  const [lastHarvest, setLastHarvest] = useState('')

  const [totalValue, setTotalValue] = useState(0)
  const [underlyingValue, setUnderlyingValue] = useState(0)
  const [depositedValueUSD, setDepositUsdValue] = useState(0)
  const [balanceAmount, setBalanceAmount] = useState(0)
  const firstUnderlyingBalance = useRef(true)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.has('utm_source') || queryParams.has('utm_medium')) {
      setShowBadge(true) // Don't show the Badge if the parameters are present
    }
  }, [])

  useEffect(() => {
    const staked =
      totalStaked &&
      fromWei(totalStaked, fAssetPool.lpTokenData.decimals, MAX_BALANCES_DECIMALS, true)

    const unstaked =
      lpTokenBalance &&
      fromWei(lpTokenBalance, fAssetPool.lpTokenData.decimals, MAX_BALANCES_DECIMALS, true)
    const total = Number(staked) + Number(unstaked)
    const amountBalanceUSD = total * usdPrice
    setTotalValue(total)
    setBalanceAmount(amountBalanceUSD)

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
      Number(unstaked) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
    const monthlyYield =
      Number(staked) * usdPrice * (vaultAPRMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
      Number(unstaked) * usdPrice * (vaultAPRMonthly + swapFeeAPRMonthly)
    setYieldDaily(dailyYield)
    setYieldMonthly(monthlyYield)
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

          setBalanceList(curSortedBalances)

          let supList = [],
            directInSup = {},
            directInBalance = {}

          supList = [...curBalances, ...curNoBalances]

          const tokenAddress =
            token.tokenAddress !== undefined && token.tokenAddress.length !== 2
              ? token.tokenAddress
              : token.vaultAddress

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
        }
      } catch (err) {
        console.log('getTokenBalance: ', err)
      }
    }
    console.debug('convert status', convertSuccess)
    console.debug('revert status', revertSuccess)
    getTokenBalance()
  }, [account, chain, balances, convertSuccess, revertSuccess, useIFARM]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function fetchData() {
      if (supTokenList.length > 0) {
        const fromToken = supTokenList[1].address
        const toToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
        const amount = '1000000'
        const slippage = 0.5 // Default slippage Percent

        const portalsEstimate = await getPortalsEstimate({
          chainId: token.chain,
          tokenIn: fromToken,
          inputAmount: amount,
          tokenOut: toToken,
          slippage,
          sender: null,
        })

        if (portalsEstimate.res.message === 'outputToken not found') {
          setSupportedVault(false)
        } else {
          setSupportedVault(true)
        }
      }
    }

    fetchData()
    // eslint-disable-next-line
  }, [supTokenList])

  useEffect(() => {
    if (supTokenList.length > 0) {
      for (let i = 0; i < supTokenList.length; i += 1) {
        if (supTokenList[i].symbol === 'ETH') {
          setPickedTokenWith(supTokenList[i])
          return
        }
      }
    }
  }, [supTokenList])

  useEffect(() => {
    if (balanceList.length > 0 && defaultToken !== null) {
      let tokenToSet = null

      // Check if defaultToken is present in the balanceList
      if (defaultToken.balance !== '0' || !supportedVault) {
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
      if (!tokenToSet) {
        tokenToSet = balanceList.reduce((prevToken, currentToken) =>
          prevToken.usdValue > currentToken.usdValue ? prevToken : currentToken,
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
  }, [balanceList, supTokenList, defaultToken, chain, SUPPORTED_TOKEN_LIST, supportedVault])

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
    if (curUrl.includes('#farm%20details')) {
      setActiveMainTag(1)
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

  return (
    <DetailView bgColor={bgColor} fontColor={fontColor}>
      <TopInner>
        <TopPart>
          <FlexTopDiv>
            <TopButton className="back-btn">
              {isMobile && (
                <LinksContainer showBadge={showBadge ? 'flex' : 'none'}>
                  <Logo
                    className="logo"
                    onClick={() => {
                      push('/')
                    }}
                  >
                    <img src={logoNew} width={52} height={52} alt="Harvest" />
                  </Logo>
                  <MobileChain>
                    {!showBadge && (
                      <NetDetailItem>
                        <NetDetailContent>{token.platform && token.platform[0]}</NetDetailContent>
                      </NetDetailItem>
                    )}
                    <ChainBack>
                      <img src={BadgeAry[badgeId]} alt="" />
                    </ChainBack>
                  </MobileChain>
                </LinksContainer>
              )}
            </TopButton>
            <FlexDiv className="farm-symbol">
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
            <GuideSection>
              <GuidePart>
                <span role="img" aria-label="thumb" aria-labelledby="thumb">
                  👍
                </span>{' '}
                For Beginners
              </GuidePart>
              <GuidePart>
                {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                &nbsp;APY
              </GuidePart>
              <GuidePart>Revert anytime</GuidePart>
            </GuideSection>
            <TabRow>
              <MainTagPanel>
                {mainTags.map((tag, i) => (
                  <MainTag
                    fontColor4={fontColor4}
                    bgColor={bgColor}
                    key={i}
                    active={activeMainTag === i ? 'true' : 'false'}
                    mode={darkMode ? 'dark' : 'light'}
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
                  <NetDetailContent>{token.platform && token.platform[0]}</NetDetailContent>
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
            {activeMainTag === 0 ? (
              welcomeMessage &&
              (isMobile ? (
                <WelcomeBox bgColorTooltip={bgColorTooltip} borderColor={borderColor}>
                  <WelcomeTop>
                    <FarmerImage src={FarmerAvatar} alt="avatar" />
                    <WelcomeTitle>
                      Welcome, Farmer{' '}
                      <span role="img" aria-label="hand" aria-labelledby="hand">
                        👋
                      </span>
                    </WelcomeTitle>
                    <WelcomeClose>
                      <RxCross2 onClick={() => setWelcomeMessage(false)} />
                    </WelcomeClose>
                  </WelcomeTop>
                  <WelcomeContent fontColor={fontColor}>
                    {showBadge ? (
                      <WelcomeText>
                        Earn $10 in{' '}
                        <a
                          href="https://harvest-front-v3.netlify.app/ethereum/0xa0246c9032bC3A600820415aE600c6388619A14D"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          FARM
                        </a>{' '}
                        into your wallet for converting at least $5 worth of ETH or USDC into
                        interest-bearing token. Get started via the Convert box below.
                        <br />
                        <br />
                        If you need any help, see our{' '}
                        <a
                          href="https://harvest-front-v3.netlify.app/get-started"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          tutorial
                        </a>{' '}
                        or visit{' '}
                        <a
                          href="https://discord.gg/gzWAG3Wx7Y"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Discord channel
                        </a>
                        .
                        <br />
                        <a
                          className="badge-body"
                          href="/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <HeaderBadge>
                            <div className="badge-text">
                              Only for participants of our Base Quest campaign
                            </div>
                            <div className="badge-btn">
                              Read more
                              <BiRightArrowAlt />
                            </div>
                          </HeaderBadge>
                        </a>
                      </WelcomeText>
                    ) : (
                      <WelcomeText>
                        Begin yield farming in under two minutes by simply converting any token in
                        your wallet into interest-bearing fmoonwell_WETH. Start by connecting your
                        wallet, selecting the token you wish to convert, and then clicking on
                        &apos;Preview & Convert&apos; to finalize the action. Ensure that you are
                        connected to the Base Network to proceed with farming. If you need any help,
                        head over to our{' '}
                        <a
                          href="https://discord.gg/gzWAG3Wx7Y"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Discord channel
                        </a>
                        .
                      </WelcomeText>
                    )}
                  </WelcomeContent>
                </WelcomeBox>
              ) : (
                <WelcomeBox bgColorTooltip={bgColorTooltip} borderColor={borderColor}>
                  <FarmerImage src={FarmerAvatar} alt="avatar" />
                  <WelcomeContent>
                    <WelcomeTitle fontColor1={fontColor1}>
                      Welcome, Farmer{' '}
                      <span role="img" aria-label="hand" aria-labelledby="hand">
                        👋
                      </span>
                    </WelcomeTitle>
                    {showBadge ? (
                      <WelcomeText showBadge={showBadge} fontColor={fontColor}>
                        Earn $10 in{' '}
                        <a
                          href="https://harvest-front-v3.netlify.app/ethereum/0xa0246c9032bC3A600820415aE600c6388619A14D"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          FARM
                        </a>{' '}
                        into your wallet for converting at least $5 worth of ETH or USDC into
                        interest-bearing token. Get started via the Convert box below.
                        <br />
                        <br />
                        If you need any help, see our{' '}
                        <a
                          href="https://harvest-front-v3.netlify.app/get-started"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          tutorial
                        </a>{' '}
                        or visit{' '}
                        <a
                          href="https://discord.gg/gzWAG3Wx7Y"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Discord channel
                        </a>
                        .
                        <br />
                        <a
                          className="badge-body"
                          href="/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <HeaderBadge>
                            <div className="badge-text">
                              Only for participants of our Base Quest campaign
                            </div>
                            <div className="badge-btn">
                              Read more
                              <BiRightArrowAlt />
                            </div>
                          </HeaderBadge>
                        </a>
                      </WelcomeText>
                    ) : (
                      <WelcomeText showBadge={showBadge} fontColor={fontColor}>
                        Begin yield farming in under two minutes by simply converting any token in
                        your wallet into interest-bearing fmoonwell_WETH. Start by connecting your
                        wallet, selecting the token you wish to convert, and then clicking on
                        &apos;Preview & Convert&apos; to finalize the action. Ensure that you are
                        connected to the Base Network to proceed with farming. If you need any help,
                        head over to our{' '}
                        <a
                          href="https://discord.gg/gzWAG3Wx7Y"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Discord channel
                        </a>
                        .
                      </WelcomeText>
                    )}
                  </WelcomeContent>
                  <WelcomeClose>
                    <RxCross2 onClick={() => setWelcomeMessage(false)} />
                  </WelcomeClose>
                </WelcomeBox>
              ))
            ) : (
              <BoxCover borderColor={borderColor}>
                <ValueBox
                  width="24%"
                  className="balance-box"
                  backColor={backColor}
                  borderColor={borderColor}
                >
                  <BoxTitle>APY</BoxTitle>
                  <BoxValue>{showAPY()}</BoxValue>
                </ValueBox>
                <ValueBox
                  width="24%"
                  className="daily-apy-box"
                  backColor={backColor}
                  borderColor={borderColor}
                >
                  <BoxTitle>Daily APY</BoxTitle>
                  <BoxValue>{showApyDaily()}</BoxValue>
                </ValueBox>
                <ValueBox width="24%" backColor={backColor} borderColor={borderColor}>
                  <BoxTitle>TVL</BoxTitle>
                  <BoxValue>{showTVL()}</BoxValue>
                </ValueBox>
                <ValueBox
                  width="24%"
                  className="daily-yield-box"
                  backColor={backColor}
                  borderColor={borderColor}
                >
                  <BoxTitle>Last Harvest</BoxTitle>
                  <BoxValue>{lastHarvest !== '' ? `${lastHarvest} ago` : '-'}</BoxValue>
                </ValueBox>
              </BoxCover>
            )}
            <MainSection height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <>
                  <BoxCover borderColor={borderColor}>
                    <ValueBox
                      width="32%"
                      className="balance-box"
                      backColor={backColor}
                      borderColor={borderColor}
                    >
                      <BoxTitle fontColor3={fontColor3}>
                        {isMobile ? 'Balance' : 'My Balance'}
                        <PiQuestion className="question" data-tip data-for="tooltip-mybalance" />
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
                            It&apos;s the USD value of your total f{id} balance.
                          </NewLabel>
                        </ReactTooltip>
                      </BoxTitle>
                      <BoxValue fontColor1={fontColor1}>
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
                    <ValueBox
                      width="32%"
                      className="monthly-yield-box"
                      backColor={backColor}
                      borderColor={borderColor}
                    >
                      <BoxTitle>
                        Est. Monthly Yield
                        <PiQuestion
                          className="question"
                          data-tip
                          data-for="tooltip-monthly-yield"
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
                            Calculated from the current USD value of tokens used in this farm.
                            Please note that this is subject to change with market fluctuations.
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
                    <ValueBox
                      width="32%"
                      className="daily-yield-box"
                      backColor={backColor}
                      borderColor={borderColor}
                    >
                      <BoxTitle>
                        Est. Daily Yield
                        <PiQuestion className="question" data-tip data-for="tooltip-daily-yield" />
                        <ReactTooltip
                          id="tooltip-daily-yield"
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
                            Calculated from the current USD value of tokens used in this farm.
                            Please note that this is subject to change with market fluctuations.
                          </NewLabel>
                        </ReactTooltip>
                      </BoxTitle>
                      <BoxValue fontColor1={fontColor1}>
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
                      pricePerFullShare={pricePerFullShare}
                    />
                  )}
                </>
              ) : (
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
                        weight={700}
                        size="14px"
                        height="24px"
                        color={fontColor4}
                        padding="10px 15px"
                        borderBottom="1px solid #F3F6FF"
                      >
                        Source of Yield
                      </NewLabel>
                      <DescInfo fontColor6={fontColor6} fontColor3={fontColor3}>
                        <div>
                          <p>
                            This farm supplies{' '}
                            <a
                              href="https://basescan.org/token/0x4200000000000000000000000000000000000006"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WETH
                            </a>{' '}
                            to Moonwell, a robust lending platform, earning{' '}
                            <a
                              href="https://basescan.org/token/0xFF8adeC2221f9f4D8dfbAFa6B9a297d17603493D"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WELL
                            </a>{' '}
                            and{' '}
                            <a
                              href="https://basescan.org/token/0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              USDC
                            </a>{' '}
                            from lending activities. At every harvest, the earned rewards are
                            converted into more{' '}
                            <a
                              href="https://basescan.org/token/0x4200000000000000000000000000000000000006"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WETH
                            </a>
                            .
                          </p>
                        </div>
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
                              hoverColor={hoverColor}
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
                </>
              )}
            </MainSection>
            <RestContent height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                <FirstPartSection>
                  <MyBalance
                    backColor={backColor}
                    borderColor={borderColor}
                    marginBottom={isMobile ? '20px' : '25px'}
                    marginTop={isMobile ? '0px' : '0px'}
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
                      <>{`f${id}`}</>
                      <PiQuestion className="question" data-tip data-for="tooltip-token-name" />
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
                          The interest-bearing fToken. It entitles its holder to auto-compounded
                          yield of this farm.
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
                        Balance
                        <PiQuestion className="question" data-tip data-for="tooltip-balance" />
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
                            Sum of your f{id}.
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        weight="600"
                        color={fontColor1}
                      >
                        {!connected ? (
                          0
                        ) : lpTokenBalance ? (
                          totalValue === 0 ? (
                            '0.00'
                          ) : (
                            totalValue.toFixed(8)
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
                        Underlying Balance
                        <PiQuestion
                          className="question"
                          data-tip
                          data-for="tooltip-underlying-balance"
                        />
                        <ReactTooltip
                          id="tooltip-underlying-balance"
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
                            Current amount of underlying tokens you&apos;re entitled to for your f
                            {id}.
                          </NewLabel>
                        </ReactTooltip>
                      </NewLabel>
                      <NewLabel
                        weight="600"
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '24px' : '24px'}
                        color={fontColor1}
                        self="center"
                      >
                        {!connected ? (
                          0
                        ) : lpTokenBalance ? (
                          totalValue === 0 ? (
                            `0.00 ${token.tokenNames.join(' • ')}`
                          ) : (
                            `${totalValue * pricePerFullShare} ${token.tokenNames.join(' • ')}`
                          )
                        ) : (
                          <AnimatedDots />
                        )}
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
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
                        supportedVault={supportedVault}
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
                    <UserBalanceData
                      token={token}
                      vaultPool={vaultPool}
                      tokenSymbol={id}
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
              ) : (
                <RestInternal>
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
                  <LastHarvestInfo backColor={backColor} borderColor={borderColor}>
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight="600"
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
                        height={isMobile ? '20px' : '24px'}
                        color={fontColor3}
                      >
                        Convert Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
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
                        height={isMobile ? '20px' : '24px'}
                        color={fontColor3}
                      >
                        Revert Fee
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '20px' : '24px'}
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
                        size={isMobile ? '13px' : '13px'}
                        weight="300"
                        height="normal"
                        color={fontColor3}
                      >
                        The APY shown already considers the performance fee taken only from
                        generated yield and not deposits.
                      </NewLabel>
                      <NewLabel display="flex" self="center">
                        <PiQuestion className="question" data-tip data-for="tooltip-last-harvest" />
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
                  </LastHarvestInfo>
                  {isMobile && (
                    <HalfInfo marginBottom="20px" backColor={backColor} borderColor={borderColor}>
                      <NewLabel
                        weight={700}
                        size="14px"
                        height="24px"
                        padding="10px 15px"
                        borderBottom="1px solid #F3F6FF"
                      >
                        Source of Yield
                      </NewLabel>
                      <DescInfo fontColor6={fontColor6} fontColor3={fontColor3}>
                        <div>
                          <p>
                            This farm supplies{' '}
                            <a
                              href="https://basescan.org/token/0x4200000000000000000000000000000000000006"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WETH
                            </a>{' '}
                            to Moonwell, a robust lending platform, earning{' '}
                            <a
                              href="https://basescan.org/token/0xFF8adeC2221f9f4D8dfbAFa6B9a297d17603493D"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WELL
                            </a>{' '}
                            and{' '}
                            <a
                              href="https://basescan.org/token/0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              USDC
                            </a>{' '}
                            from lending activities. At every harvest, the earned rewards are
                            converted into more{' '}
                            <a
                              href="https://basescan.org/token/0x4200000000000000000000000000000000000006"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WETH
                            </a>
                            .
                          </p>
                        </div>
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
              )}
            </RestContent>
          </InternalSection>
        </BigDiv>
      </Inner>
    </DetailView>
  )
}

export default BeginnersFarm
