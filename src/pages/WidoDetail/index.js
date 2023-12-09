import BigNumber from 'bignumber.js'
import { find, get, isArray, isEqual, sumBy } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useMediaQuery } from 'react-responsive'
import { useHistory, useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import Chart from 'react-apexcharts'
import useEffectWithPrevious from 'use-effect-with-previous'
import { getSupportedTokens } from 'wido'
import { ethers } from 'ethers'
import tokenMethods from '../../services/web3/contracts/token/methods'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import APY from '../../assets/images/logos/earn/apy.svg'
import Back from '../../assets/images/logos/earn/back.svg'
import Daily from '../../assets/images/logos/earn/daily.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import TVL from '../../assets/images/logos/earn/tvl.svg'
import LSD from '../../assets/images/logos/lsd.svg'
import DESCI from '../../assets/images/logos/DeSci.svg'
import AnimatedDots from '../../components/AnimatedDots'
import FarmDetailChart from '../../components/DetailChart/FarmDetailChart'
import VaultPanelActionsFooter from '../../components/VaultComponents/VaultPanelActions/VaultPanelActionsFooter'
import DepositBase from '../../components/WidoComponents/Deposit/DepositBase'
import DepositFinalStep from '../../components/WidoComponents/Deposit/DepositFinalStep'
import DepositSelectToken from '../../components/WidoComponents/Deposit/DepositSelectToken'
import DepositStart from '../../components/WidoComponents/Deposit/DepositStart'
import DepositStartRoutes from '../../components/WidoComponents/Deposit/DepositStartRoutes'
import DepositStartSlippage from '../../components/WidoComponents/Deposit/DepositStartSlippage'
import PoolDepositBase from '../../components/WidoComponents/Deposit/PoolDepositBase'
import PoolDepositFinalStep from '../../components/WidoComponents/Deposit/PoolDepositFinalStep'
import PoolWithdrawBase from '../../components/WidoComponents/Withdraw/PoolWithdrawBase'
import WithdrawBase from '../../components/WidoComponents/Withdraw/WithdrawBase'
import WithdrawFinalStep from '../../components/WidoComponents/Withdraw/WithdrawFinalStep'
import WithdrawSelectToken from '../../components/WidoComponents/Withdraw/WithdrawSelectToken'
import WithdrawStart from '../../components/WidoComponents/Withdraw/WithdrawStart'
import WithdrawStartRoutes from '../../components/WidoComponents/Withdraw/WithdrawStartRoutes'
import WithdrawStartSlippage from '../../components/WidoComponents/Withdraw/WithdrawStartSlippage'
import {
  DECIMAL_PRECISION,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  ROUTES,
  SPECIAL_VAULTS,
} from '../../constants'
import { Divider } from '../../components/GlobalStyle'
import { fromWei, getExplorerLink, newContractInstance, getWeb3 } from '../../services/web3'
import { addresses } from '../../data'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { CHAIN_IDS } from '../../data/constants'
import PriceShareData from '../../components/lastPriceShareChart/PriceShareData'
import {
  displayAPY,
  formatNumber,
  getDetailText,
  getTotalApy,
  getLastHarvestInfo,
} from '../../utils'
import {
  BackArrow,
  BackBtnRect,
  BigDiv,
  ChainBack,
  DepositComponets,
  DescInfo,
  DetailView,
  FlexDiv,
  FlexMobileTopDiv,
  FlexTopDiv,
  HalfContent,
  HalfInfo,
  InfoIcon,
  InfoLabel,
  Inner,
  LogoImg,
  MobileTop,
  Name,
  NewLabel,
  RestContent,
  RestPart,
  RewardPart,
  RewardsContainer,
  SwitchModeMobile,
  SwitchTag,
  Tag,
  TagMobile,
  TooltipContent,
  TopDesc,
  TopPart,
  ValueShow,
  WithdrawComponents,
  DetailTopInfo,
  LastHarvestInfo,
  LPTokenBalance,
} from './style'
import { CHAIN_IDS } from '../../data/constants'
import { useEnso } from '../../providers/Enso'

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

const WidoDetail = () => {
  const { paramAddress } = useParams()
  // Switch Tag (Deposit/Withdraw)
  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE]
  const [activeDepo, setActiveDepo] = useState(true)

  // Switch Tag (Farm/Details in mobile)
  const [farmView, setFarmView] = useState(true)
  const [detailsView, setDetailsView] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const history = useHistory()
  const { push } = useHistory()

  const { loadingVaults, vaultsData } = useVaults()
  const { pools, userStats, fetchUserPoolStats } = usePools()
  const { account, balances, getWalletBalances } = useWallet()
  const { ensoBaseTokens, getEnsoBalances, getEnsoPrice } = useEnso()
  const { profitShareAPY } = useStats()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  /* eslint-enable global-require */

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
        vaultAddress: addresses.iFARM,
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

  // const isLPToken = token.tokenNames.length === 2
  // const isLPToken = token.tokenNames[0] === 'CNG' && token.tokenNames[1] === 'ETH'
  const isLPToken = false

  const lsdToken = get(token, 'tags') && token.tags.join(', ').toLowerCase().includes('lsd')
  const desciToken = get(token, 'tags') && token.tags.join(', ').toLowerCase().includes('desci')

  const { logoUrl } = token

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  const tokenVault = get(vaultsData, token.hodlVaultId || id)

  const vaultPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))

  const farmAPY = get(vaultPool, 'totalRewardAPY', 0)
  const tradingApy = get(vaultPool, 'tradingApy', 0)
  const boostedEstimatedAPY = get(tokenVault, 'boostedEstimatedAPY', 0)
  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const boostedRewardAPY = get(vaultPool, 'boostedRewardAPY', 0)

  const chain = token.chain || token.data.chain

  // Get Harvest Info (ex: 1 day ago)
  const [lastHarvest, setLastHarvest] = useState('')
  useEffect(() => {
    const getLastHarvest = async () => {
      const value = await getLastHarvestInfo(paramAddress, chain)
      setLastHarvest(value)
    }

    getLastHarvest()
  }, [paramAddress, chain])

  // Tooltip info in Last Harvest box
  const profitShare =
    chain === CHAIN_IDS.ETH_MAINNET ? '10' : chain === CHAIN_IDS.POLYGON_MAINNET ? '5' : '7'
  const harvestTreasury =
    chain === CHAIN_IDS.ETH_MAINNET ? '5' : chain === CHAIN_IDS.POLYGON_MAINNET ? '3' : '3'

  const [badgeId, setBadgeId] = useState(-1)

  const [loadComplete, setLoadComplete] = useState(false)
  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    setLoadComplete(true)
  }, [])

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

  const rewardTxt = getDetailText(
    token,
    vaultPool,
    tradingApy,
    farmAPY,
    totalApy,
    true,
    boostedEstimatedAPY,
    boostedRewardAPY,
  )

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
            <div>
              <RewardsContainer>
                {token.inactive ? 'Inactive' : <>{totalApy ? displayAPY(totalApy) : null}</>}
              </RewardsContainer>
            </div>
          ) : (
            <div>
              <AnimatedDots />
            </div>
          )
        ) : vaultPool.loaded && totalApy !== null && !loadingVaults ? (
          <div>
            <RewardsContainer>
              {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
                token.inactive || token.testInactive ? (
                  'Inactive'
                ) : null
              ) : (
                <>
                  {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                  &nbsp;
                </>
              )}
            </RewardsContainer>
          </div>
        ) : (
          <div>
            <AnimatedDots />
          </div>
        )}
      </>
    )
  }

  const [vaultValue, setVaultValue] = useState(null)

  useEffect(() => {
    setVaultValue(getVaultValue(token))
  }, [token])

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
            <RewardsContainer>
              {token.inactive ? 'Inactive' : <>{totalApy ? `${apyDaily}%` : null}</>}
            </RewardsContainer>
          ) : (
            <AnimatedDots />
          )
        ) : vaultPool.loaded && totalApy !== null && !loadingVaults ? (
          <RewardsContainer>
            {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
              token.inactive || token.testInactive ? (
                'Inactive'
              ) : null
            ) : (
              <>{apyDaily}% &nbsp;</>
            )}
          </RewardsContainer>
        ) : (
          <AnimatedDots />
        )}
      </>
    )
  }

  const useIFARM = id === FARM_TOKEN_SYMBOL
  const fAssetPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === tokens[id].vaultAddress)

  const [amountsToExecute, setAmountsToExecute] = useState([''])
  const tokenDecimals = token.decimals || tokens[id].decimals

  const totalStaked = get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)
  const lpTokenBalance = get(userStats, `[${fAssetPool.id}]['lpTokenBalance']`, 0)
  const lpTokenApprovedBalance = get(userStats, `[${fAssetPool.id}]['lpTokenApprovedBalance']`, 0)
  const totalRewardsEarned = get(userStats, `[${fAssetPool.id}]['totalRewardsEarned']`, 0)

  const totalAmountToExecute = useMemo(() => sumBy(amountsToExecute, amount => Number(amount)), [
    amountsToExecute,
  ])

  // Show/Hide Select Token Component
  const [selectTokenDepo, setSelectTokenDepo] = useState(false)

  // Show/Hide Deposit
  const [depositWido, setDepositWido] = useState(false)
  const [clickTokenIdDepo, setClickedTokenIdDepo] = useState(-1)
  const [balanceDepo, setBalanceDepo] = useState(0)
  const [pickedTokenDepo, setPickedTokenDepo] = useState({ symbol: 'Select Token' })
  const [depositFinalStep, setDepositFinalStep] = useState(false)
  const [startRoutesDepo, setStartRoutesDepo] = useState(false)
  const [startSlippageDepo, setStartSlippageDepo] = useState(false)
  const [slippagePercentDepo, setSlippagePercentDepo] = useState(0.005)
  const [inputAmountDepo, setInputAmountDepo] = useState(0)
  const [usdValue, setUsdValue] = useState(0)
  const [quoteValueDepo, setQuoteValueDepo] = useState(null)

  // For Withdraw
  const [pickedTokenWith, setPickedTokenWith] = useState({ symbol: 'Destination token' })
  const [selectTokenWith, setSelectTokenWith] = useState(false)
  const [clickTokenIdWith, setClickedTokenIdWith] = useState(-1)
  const [withdrawWido, setWithdrawWido] = useState(false)
  const [withdrawFinalStep, setWithdrawFinalStep] = useState(false)
  const [unstakeBalance, setUnstakeBalance] = useState('0')
  const [startRoutesWith, setStartRoutesWith] = useState(false)
  const [startSlippageWith, setStartSlippageWith] = useState(false)
  const [slippagePercentWith, setSlippagePercentWith] = useState(0.005)
  const [quoteValueWith, setQuoteValueWith] = useState(null)

  const [balanceList, setBalanceList] = useState([])
  const [supTokenList, setSupTokenList] = useState([])
  const [soonToSupList, setSoonToSupList] = useState([])

  const rewardSymbol = isSpecialVault ? id : token.apyTokenSymbols[0]
  const toTokenAddress = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
  useEffect(() => {
    const getTokenBalance = async () => {
      try {
        if (chain && account && Object.keys(balances).length !== 0) {
          const tokenAddress =
            token.tokenAddress !== undefined && token.tokenAddress.length !== 2
              ? token.tokenAddress
              : token.vaultAddress
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
          const ensoTokens = ensoBaseTokens[chain.toString()] || []
          const ensoRawBalances = await getEnsoBalances(account, chain.toString())
          const curBalances = (
            await Promise.all(
              ensoRawBalances.map(async balance => {
                if (!ethers.utils.isAddress(balance.token))
                  balance.token = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                const baseToken = ensoTokens.find(el => el.address === balance.token)
                const price = baseToken
                  ? await getEnsoPrice(chain.toString(), baseToken.address)
                  : 0
                const item = {
                  symbol: baseToken?.symbol,
                  address: baseToken?.address,
                  balance: balance.amount,
                  default: false,
                  usdValue: Number(fromWei(balance.amount, balance.decimals)) * price,
                  usdPrice: price,
                  logoURI: baseToken?.logoURI,
                  decimals: balance.decimals,
                  chainId: chain,
                }
                return item
              }),
            )
          ).filter(item => item.address)
          setBalanceList(curBalances)

          const soonSupList = []
          supList = supList.map(sup => {
            const supToken = curBalances.find(
              el => el.address.toLowerCase() === sup.address.toLowerCase(),
            )
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
          setSoonToSupList(soonSupList)
          setSupTokenList(supList)
        }
      } catch (err) {
        console.log('getTokenBalance: ', err)
      }
    }

    getTokenBalance()
  }, [account, chain, balances, ensoBaseTokens]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    backColor,
    pageBackColor,
    fontColor,
    borderColor,
    filterColor,
    widoDetailDividerColor,
    widoBackBtnBackColor,
    widoBackBtnBackHoverColor,
    widoBackIconColor,
    widoSwitchTagBorderColor,
    widoSwitchTagBackColor,
    widoTagBackColor,
    widoTagBoxShadow,
    widoTagFontColor,
    widoTagActiveFontColor,
    prevPage,
    setPrevPage,
  } = useThemeContext()

  const fAssetSymbol = isSpecialVault ? id : `f${id}`
  const [loadingFarmingBalance, setFarmingLoading] = useState(false)
  const [loadingLpStats, setLpStatsloading] = useState(false)
  const [withdrawMode, setWithdrawMode] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const loaded = true
  const setLoadingDots = (loadingFarm, loadingLp) => {
    setFarmingLoading(loadingFarm)
    setLpStatsloading(loadingLp)
  }
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

  const viewComponentProps = {
    token,
    id,
    tokenDecimals,
    fAssetPool,
    fAssetSymbol,
    amountsToExecute,
    multipleAssets,
    lpTokenBalance,
    lpTokenApprovedBalance,
    totalRewardsEarned,
    totalStaked,
    withdrawMode,
    pendingAction,
    useIFARM,
    setAmountsToExecute,
    setLoadingDots,
    setPendingAction,
    setWithdrawMode,
    loaded,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    isSpecialVault,
    totalAmountToExecute,
    rewardSymbol,
  }

  const [widoPartHeightDepo, setWidoPartHeightDepo] = useState(null)
  const [widoPartHeightWith, setWidoPartHeightWith] = useState(null)
  const [symbolDepo, setSymbolDepo] = useState('iFARM')
  const [symbolWith, setSymbolWith] = useState('iFARM')
  const [legacyStaking, setLegacyStaking] = useState(false)

  const [, setLoadData] = useState(true)

  const series = [44, 55]
  const options = {
    chart: {
      type: 'donut',
    },
    fill: {
      colors: ['#FFB753', '#FCD38C'],
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 100,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '55%',
        },
      },
    },
  }

  return (
    <DetailView pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <TopPart>
          <FlexTopDiv>
            <BackBtnRect
              onClick={() => {
                if (prevPage !== '') {
                  setPrevPage('')
                  history.goBack()
                } else {
                  push(ROUTES.ADVANCED)
                }
              }}
              backcolor={widoBackBtnBackColor}
              backhovercolor={widoBackBtnBackHoverColor}
            >
              <BackArrow src={Back} alt="" iconcolor={widoBackIconColor} />
            </BackBtnRect>
            {logoUrl.map((el, i) => (
              <LogoImg className="logo" src={el.slice(1, el.length)} key={i} height={32} alt="" />
            ))}
            <TopDesc weight={400} size="16px" height="21px" fontColor={fontColor}>
              {token.tokenNames.join(', ') || token.rewardSymbol}
            </TopDesc>
            <ChainBack>
              <img src={BadgeAry[badgeId]} width={11} height={15} alt="" />
            </ChainBack>
            {lsdToken ? <img className="tag" src={LSD} alt="" /> : null}
            {desciToken ? <img className="tag" src={DESCI} alt="" /> : null}
          </FlexTopDiv>
        </TopPart>
        <MobileTop borderColor={borderColor}>
          <FlexMobileTopDiv>
            <FlexTopDiv>
              <BackBtnRect
                onClick={() => {
                  const prevUrl = document.referrer
                  const filterUrl = window.location.origin
                  if (prevUrl.includes(filterUrl)) {
                    history.goBack()
                  } else {
                    push(ROUTES.ADVANCED)
                  }
                }}
                backcolor={widoBackBtnBackColor}
                backhovercolor={widoBackBtnBackHoverColor}
              >
                <BackArrow src={Back} alt="" iconcolor={widoBackIconColor} />
              </BackBtnRect>
              {logoUrl.map((el, i) => (
                <LogoImg className="logo" src={el.slice(1, el.length)} key={i} height={32} alt="" />
              ))}
            </FlexTopDiv>

            <div className="right-part">
              <ChainBack>
                <img src={BadgeAry[badgeId]} width={11} height={15} alt="" />
              </ChainBack>
              {lsdToken ? <img className="tag" src={LSD} alt="" /> : null}
              {desciToken ? <img className="tag" src={DESCI} alt="" /> : null}
            </div>
          </FlexMobileTopDiv>
          <div>
            <TopDesc weight={700} size="16px" height="21px" fontColor={fontColor}>
              {token.tokenNames.join(', ') || token.rewardSymbol}
            </TopDesc>
          </div>
        </MobileTop>
        <SwitchModeMobile>
          <TagMobile
            farm={farmView}
            borderColor={borderColor}
            onClick={() => {
              setFarmView(true)
              setDetailsView(false)
            }}
          >
            Deposit
          </TagMobile>
          <TagMobile
            details={detailsView}
            borderColor={borderColor}
            onClick={() => {
              setFarmView(false)
              setDetailsView(true)
            }}
          >
            Details
          </TagMobile>
        </SwitchModeMobile>
        <BigDiv>
          <HalfContent show={detailsView}>
            <HalfInfo
              padding={!isMobile ? '0px 20px' : '0px 25px'}
              display="flex"
              justifyContent="space-between"
              backColor={backColor}
              borderColor={borderColor}
            >
              <DetailTopInfo borderColor={widoDetailDividerColor}>
                <NewLabel
                  display="flex"
                  weight={700}
                  size={isMobile ? '12px' : '16px'}
                  height={isMobile ? '16px' : '21px'}
                  marginBottom="15px"
                  align="center"
                >
                  <img
                    className="icon"
                    src={APY}
                    width={isMobile ? 12 : 20}
                    height={isMobile ? 12 : 20}
                    alt=""
                  />
                  APY
                  <NewLabel display="flex" self="center">
                    <InfoIcon
                      className="info"
                      width={isMobile ? 10 : 16}
                      src={Info}
                      alt=""
                      data-tip
                      data-for="tooltip-apy"
                      filterColor={filterColor}
                    />
                    <ReactTooltip
                      id="tooltip-apy"
                      backgroundColor="black"
                      borderColor="black"
                      textColor="white"
                    >
                      <TooltipContent>
                        <Name>Annual Percentage Yield</Name>
                        {showAPY()}
                      </TooltipContent>
                    </ReactTooltip>
                  </NewLabel>
                </NewLabel>
                <ValueShow>{showAPY()}</ValueShow>
              </DetailTopInfo>

              <DetailTopInfo borderColor={widoDetailDividerColor}>
                <NewLabel
                  display="flex"
                  weight={700}
                  size={isMobile ? '12px' : '16px'}
                  height={isMobile ? '16px' : '21px'}
                  marginBottom="15px"
                  align="center"
                >
                  <img
                    className="icon"
                    src={Daily}
                    width={isMobile ? 12 : 20}
                    height={isMobile ? 12 : 20}
                    alt=""
                  />
                  Daily
                  <NewLabel display="flex" self="center">
                    <InfoIcon
                      className="info"
                      width={isMobile ? 10 : 16}
                      data-tip
                      data-for="tooltip-daily"
                      src={Info}
                      alt=""
                      filterColor={filterColor}
                    />
                    <ReactTooltip
                      id="tooltip-daily"
                      backgroundColor="black"
                      borderColor="black"
                      textColor="white"
                    >
                      <TooltipContent>
                        <Name>Daily APY</Name>
                        {showApyDaily()}
                      </TooltipContent>
                    </ReactTooltip>
                  </NewLabel>
                </NewLabel>
                <ValueShow>{showApyDaily()}</ValueShow>
              </DetailTopInfo>

              <DetailTopInfo>
                <NewLabel
                  display="flex"
                  weight={700}
                  size={isMobile ? '12px' : '16px'}
                  height={isMobile ? '16px' : '21px'}
                  marginBottom="15px"
                  align="center"
                >
                  <img
                    className="icon"
                    src={TVL}
                    width={isMobile ? 12 : 20}
                    height={isMobile ? 12 : 20}
                    alt=""
                  />
                  TVL
                  <NewLabel display="flex" self="center">
                    <InfoIcon
                      className="info"
                      width={isMobile ? 10 : 16}
                      src={Info}
                      alt=""
                      data-tip
                      data-for="tooltip-tvl"
                      filterColor={filterColor}
                    />
                    <ReactTooltip
                      id="tooltip-tvl"
                      backgroundColor="black"
                      borderColor="black"
                      textColor="white"
                    >
                      <TooltipContent>
                        <Name>Total Value Locked</Name>
                        {showTVL()}
                      </TooltipContent>
                    </ReactTooltip>
                  </NewLabel>
                </NewLabel>
                <ValueShow>{showTVL()}</ValueShow>
              </DetailTopInfo>
            </HalfInfo>
            <HalfInfo padding="25px 18px" backColor={backColor} borderColor={borderColor}>
              {loadComplete && (
                <FarmDetailChart
                  token={token}
                  vaultPool={vaultPool}
                  lastTVL={Number(vaultValue)}
                  lastAPY={Number(totalApy)}
                />
              )}
            </HalfInfo>
            <HalfInfo padding="0px" borderColor="none">
              <PriceShareData
                token={token}
                vaultPool={vaultPool}
                tokenSymbol={id}
                setLoadData={setLoadData}
              />
            </HalfInfo>
            <HalfInfo
              padding={!isMobile ? '20px' : '15px'}
              backColor={backColor}
              borderColor={borderColor}
            >
              <NewLabel weight={700} size="16px" height="21px">
                APY Breakdown
              </NewLabel>
              <div className="farm-detail-reward" dangerouslySetInnerHTML={{ __html: rewardTxt }} />
            </HalfInfo>
            <HalfInfo
              padding={!isMobile ? '24px 22px 44px 22px' : '15px'}
              backColor={backColor}
              borderColor={borderColor}
            >
              <NewLabel weight={700} size="16px" height="21px" marginBottom="12px">
                Farm Details
              </NewLabel>
              <DescInfo fontColor={fontColor}>
                {ReactHtmlParser(vaultPool.stakeAndDepositHelpMessage)}
              </DescInfo>
              <FlexDiv className="address" marginTop="15px">
                {token.vaultAddress && (
                  <InfoLabel
                    display="flex"
                    href={`${getExplorerLink(token.chain)}/address/${token.vaultAddress}`}
                    target="_blank"
                    onClick={e => e.stopPropagation()}
                    rel="noopener noreferrer"
                    weight={400}
                    size="12px"
                    height="16px"
                  >
                    <NewLabel size="12px" weight={isMobile ? 400 : 600} height="16px" self="center">
                      Vault Address
                    </NewLabel>
                  </InfoLabel>
                )}
                {vaultPool.autoStakePoolAddress && (
                  <InfoLabel
                    display="flex"
                    href={`${getExplorerLink(token.chain)}/address/${vaultPool.contractAddress}`}
                    target="_blank"
                    onClick={e => e.stopPropagation()}
                    rel="noopener noreferrer"
                    weight={400}
                    size="12px"
                    height="16px"
                  >
                    <NewLabel size="12px" weight={isMobile ? 400 : 600} height="16px" self="center">
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
                  weight={400}
                  size="12px"
                  height="16px"
                >
                  <NewLabel size="12px" weight={isMobile ? 400 : 600} height="16px" self="center">
                    Pool Address
                  </NewLabel>
                </InfoLabel>
              </FlexDiv>
            </HalfInfo>

            {isLPToken && (
              <HalfInfo
                padding={!isMobile ? '20px' : '15px'}
                backColor={backColor}
                borderColor={borderColor}
              >
                <NewLabel weight={700} size="16px" height="21px">
                  LP Token Composition
                </NewLabel>
                <NewLabel display="flex" justifyContent="space-between" marginTop="15px">
                  <NewLabel width="20%">
                    <Chart
                      options={options}
                      series={series}
                      type="donut"
                      height="100%"
                      width="100%"
                    />
                  </NewLabel>
                  <NewLabel width="-webkit-fill-available" marginRight="15px">
                    <ul>
                      <LPTokenBalance>
                        <span>
                          <span className="before">•</span>&nbsp;CNG
                        </span>
                        <span>19.04123 ($500)</span>
                      </LPTokenBalance>
                      <LPTokenBalance>
                        <span>
                          <span className="before">•</span>&nbsp;WETH
                        </span>
                        <span>0.12321 ($400)</span>
                      </LPTokenBalance>
                    </ul>
                  </NewLabel>
                </NewLabel>
              </HalfInfo>
            )}
          </HalfContent>
          <RestContent show={farmView}>
            <RestPart
              borderColor={borderColor}
              backColor={backColor}
              widoHeight={activeDepo ? widoPartHeightDepo : widoPartHeightWith}
            >
              <SwitchTag borderColor={widoSwitchTagBorderColor} backColor={widoSwitchTagBackColor}>
                <Tag
                  className="tag1"
                  backColor={widoTagBackColor}
                  shadow={widoTagBoxShadow}
                  fontColor={widoTagFontColor}
                  fontActiveColor={widoTagActiveFontColor}
                  active={activeDepo}
                  onClick={() => {
                    setActiveDepo(true)
                  }}
                >
                  Deposit
                </Tag>
                <Tag
                  className="tag2"
                  backColor={widoTagBackColor}
                  shadow={widoTagBoxShadow}
                  fontColor={widoTagFontColor}
                  fontActiveColor={widoTagActiveFontColor}
                  active={!activeDepo}
                  onClick={() => {
                    setActiveDepo(false)
                  }}
                >
                  Withdraw
                </Tag>
              </SwitchTag>

              {/* Components for Deposit */}
              <DepositComponets show={activeDepo}>
                {useIFARM ? (
                  <PoolDepositBase // for IFarm
                    selectTokenWido={selectTokenDepo}
                    setSelectTokenWido={setSelectTokenDepo}
                    startSlippage={startSlippageDepo}
                    depositWido={depositWido}
                    setDepositWido={setDepositWido}
                    finalStep={depositFinalStep}
                    setFinalStep={setDepositFinalStep}
                    balance={balanceDepo}
                    setBalance={setBalanceDepo}
                    usdValue={usdValue}
                    setUsdValue={setUsdValue}
                    pickedToken={pickedTokenDepo}
                    setPickedToken={setPickedTokenDepo}
                    inputAmount={inputAmountDepo}
                    setInputAmount={setInputAmountDepo}
                    token={token}
                    fAssetPool={fAssetPool}
                    symbol={symbolDepo}
                    setSymbol={setSymbolDepo}
                    balanceList={balanceList}
                    totalStaked={totalStaked}
                    lpTokenBalance={lpTokenBalance}
                    legacyStaking={legacyStaking}
                    setLegacyStaking={setLegacyStaking}
                  />
                ) : (
                  loadComplete && (
                    <DepositBase
                      selectTokenWido={selectTokenDepo}
                      setSelectTokenWido={setSelectTokenDepo}
                      startSlippage={startSlippageDepo}
                      depositWido={depositWido}
                      setDepositWido={setDepositWido}
                      finalStep={depositFinalStep}
                      balance={balanceDepo}
                      usdValue={usdValue}
                      setUsdValue={setUsdValue}
                      pickedToken={pickedTokenDepo}
                      inputAmount={inputAmountDepo}
                      setInputAmount={setInputAmountDepo}
                      symbol={id}
                      token={token}
                      totalStaked={totalStaked}
                      lpTokenBalance={lpTokenBalance}
                      setLoadingDots={setLoadingDots}
                      pendingAction={pendingAction}
                      setPendingAction={setPendingAction}
                      setAmountsToExecute={setAmountsToExecute}
                      lpTokenApprovedBalance={lpTokenApprovedBalance}
                      fAssetPool={fAssetPool}
                      multipleAssets={multipleAssets}
                      loaded={loaded}
                      loadingBalances={loadingLpStats || loadingFarmingBalance}
                      supTokenList={supTokenList}
                    />
                  )
                )}

                <DepositSelectToken
                  selectTokenWido={selectTokenDepo}
                  setSelectTokenWido={setSelectTokenDepo}
                  clickTokenId={clickTokenIdDepo}
                  setClickedTokenId={setClickedTokenIdDepo}
                  setPickedToken={setPickedTokenDepo}
                  setBalance={setBalanceDepo}
                  supTokenList={supTokenList}
                  soonToSupList={soonToSupList}
                  setWidoPartHeight={setWidoPartHeightDepo}
                />

                <DepositStart
                  pickedToken={pickedTokenDepo}
                  depositWido={depositWido}
                  setDepositWido={setDepositWido}
                  finalStep={depositFinalStep}
                  setFinalStep={setDepositFinalStep}
                  startRoutes={startRoutesDepo}
                  setStartRoutes={setStartRoutesDepo}
                  startSlippage={startSlippageDepo}
                  setStartSlippage={setStartSlippageDepo}
                  slippagePercentage={slippagePercentDepo}
                  inputAmount={inputAmountDepo}
                  token={token}
                  balanceList={balanceList}
                  useIFARM={useIFARM}
                  symbol={symbolDepo}
                  tokenSymbol={id}
                  quoteValue={quoteValueDepo}
                  setQuoteValue={setQuoteValueDepo}
                />

                <DepositStartRoutes
                  startRoutes={startRoutesDepo}
                  setStartRoutes={setStartRoutesDepo}
                />

                <DepositStartSlippage
                  startSlippage={startSlippageDepo}
                  setStartSlippage={setStartSlippageDepo}
                  setSlippagePercent={setSlippagePercentDepo}
                  setDepositWido={setDepositWido}
                />

                {useIFARM ? (
                  <PoolDepositFinalStep
                    finalStep={depositFinalStep}
                    setFinalStep={setDepositFinalStep}
                    setDepositWido={setDepositWido}
                    setSelectTokenWido={setSelectTokenDepo}
                    inputAmount={inputAmountDepo}
                    setInputAmount={setInputAmountDepo}
                    setUsdValue={setUsdValue}
                    setBalance={setBalanceDepo}
                    setClickedTokenId={setClickedTokenIdDepo}
                    pickedToken={pickedTokenDepo}
                    setPickedToken={setPickedTokenDepo}
                    slippagePercentage={slippagePercentDepo}
                    token={token}
                    tokenSymbol={id}
                    symbol={symbolDepo}
                    legacyStaking={legacyStaking}
                    fAssetPool={fAssetPool}
                    lpTokenApprovedBalance={lpTokenApprovedBalance}
                    setPendingAction={setPendingAction}
                    setLoadingDots={setLoadingDots}
                    quoteValue={quoteValueDepo}
                    multipleAssets={multipleAssets}
                  />
                ) : (
                  <DepositFinalStep
                    finalStep={depositFinalStep}
                    setFinalStep={setDepositFinalStep}
                    setDepositWido={setDepositWido}
                    setSelectTokenWido={setSelectTokenDepo}
                    inputAmount={inputAmountDepo}
                    setInputAmount={setInputAmountDepo}
                    setUsdValue={setUsdValue}
                    setBalance={setBalanceDepo}
                    setClickedTokenId={setClickedTokenIdDepo}
                    pickedToken={pickedTokenDepo}
                    setPickedToken={setPickedTokenDepo}
                    slippagePercentage={slippagePercentDepo}
                    token={token}
                    useIFARM={useIFARM}
                    symbol={symbolDepo}
                    tokenSymbol={id}
                    quoteValue={quoteValueDepo}
                    fAssetPool={fAssetPool}
                    setPendingAction={setPendingAction}
                    multipleAssets={multipleAssets}
                  />
                )}
              </DepositComponets>

              {/* Components for Withdraw */}
              <WithdrawComponents show={!activeDepo}>
                {useIFARM ? (
                  <PoolWithdrawBase
                    selectTokenWido={selectTokenWith}
                    setSelectTokenWido={setSelectTokenWith}
                    withdrawWido={withdrawWido}
                    setWithdrawWido={setWithdrawWido}
                    finalStep={withdrawFinalStep}
                    pickedToken={pickedTokenWith}
                    setPickedToken={setPickedTokenWith}
                    setUnstakeBalance={setUnstakeBalance}
                    fAssetPool={fAssetPool}
                    totalStaked={totalStaked}
                    lpTokenBalance={lpTokenBalance}
                    setPendingAction={setPendingAction}
                    multipleAssets={multipleAssets}
                    symbol={symbolWith}
                    setSymbol={setSymbolWith}
                    token={token}
                  />
                ) : (
                  <WithdrawBase
                    selectTokenWido={selectTokenWith}
                    setSelectTokenWido={setSelectTokenWith}
                    withdrawWido={withdrawWido}
                    setWithdrawWido={setWithdrawWido}
                    finalStep={withdrawFinalStep}
                    pickedToken={pickedTokenWith}
                    unstakeBalance={unstakeBalance}
                    setUnstakeBalance={setUnstakeBalance}
                    symbol={id}
                    fAssetPool={fAssetPool}
                    totalStaked={totalStaked}
                    lpTokenBalance={lpTokenBalance}
                    setPendingAction={setPendingAction}
                    multipleAssets={multipleAssets}
                    token={token}
                    supTokenList={supTokenList}
                  />
                )}

                <WithdrawSelectToken
                  selectTokenWido={selectTokenWith}
                  setSelectTokenWido={setSelectTokenWith}
                  clickTokenId={clickTokenIdWith}
                  setClickedTokenId={setClickedTokenIdWith}
                  pickedToken={pickedTokenWith}
                  setPickedToken={setPickedTokenWith}
                  supTokenList={supTokenList}
                  soonToSupList={soonToSupList}
                  setWidoPartHeight={setWidoPartHeightWith}
                />

                <WithdrawStart
                  withdrawWido={withdrawWido}
                  setWithdrawWido={setWithdrawWido}
                  pickedToken={pickedTokenWith}
                  finalStep={withdrawFinalStep}
                  setFinalStep={setWithdrawFinalStep}
                  startRoutes={startRoutesWith}
                  setStartRoutes={setStartRoutesWith}
                  startSlippage={startSlippageWith}
                  setStartSlippage={setStartSlippageWith}
                  token={token}
                  unstakeBalance={unstakeBalance}
                  slippagePercentage={slippagePercentWith}
                  balanceList={balanceList}
                  useIFARM={useIFARM}
                  symbol={symbolWith}
                  tokenSymbol={id}
                  quoteValue={quoteValueWith}
                  setQuoteValue={setQuoteValueWith}
                />

                <WithdrawStartRoutes
                  startRoutes={startRoutesWith}
                  setStartRoutes={setStartRoutesWith}
                />

                <WithdrawStartSlippage
                  startSlippage={startSlippageWith}
                  setStartSlippage={setStartSlippageWith}
                  slippagePercent={slippagePercentWith}
                  setSlippagePercent={setSlippagePercentWith}
                  setWithdrawWido={setWithdrawWido}
                />

                <WithdrawFinalStep
                  finalStep={withdrawFinalStep}
                  setFinalStep={setWithdrawFinalStep}
                  setWithdrawWido={setWithdrawWido}
                  setSelectTokenWith={setSelectTokenWith}
                  setClickedTokenId={setClickedTokenIdWith}
                  pickedToken={pickedTokenWith}
                  setPickedToken={setPickedTokenWith}
                  token={token}
                  unstakeBalance={unstakeBalance}
                  setUnstakeBalance={setUnstakeBalance}
                  slippagePercentage={slippagePercentWith}
                  useIFARM={useIFARM}
                  symbol={symbolWith}
                  tokenSymbol={id}
                  fAssetPool={fAssetPool}
                  quoteValue={quoteValueWith}
                  multipleAssets={multipleAssets}
                  setPendingAction={setPendingAction}
                />
              </WithdrawComponents>
            </RestPart>
            <LastHarvestInfo borderColor={borderColor} backColor={backColor}>
              <FlexDiv justifyContent="space-between">
                <NewLabel size="13px" weight="500" height="16px">
                  Deposit Fee
                </NewLabel>
                <NewLabel size="13px" weight="500" height="16px">
                  0%
                </NewLabel>
              </FlexDiv>
              <FlexDiv justifyContent="space-between" marginTop="12px">
                <NewLabel size="13px" weight="500" height="16px">
                  Withdrawal Fee
                </NewLabel>
                <NewLabel size="13px" weight="500" height="16px">
                  0%
                </NewLabel>
              </FlexDiv>
              <FlexDiv justifyContent="space-between" marginTop="12px">
                <NewLabel size="13px" weight="300" height="16px">
                  The shown APY already considers the performance fee taken only from generated
                  yield and not deposits.
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
                  >
                    <FlexDiv justifyContent="space-between">
                      <NewLabel weight="500" size="13px" height="16px">
                        Harvest Treasury
                      </NewLabel>
                      <NewLabel weight="500" size="13px" height="16px" marginLeft="20px">
                        {harvestTreasury}%
                      </NewLabel>
                    </FlexDiv>
                    <FlexDiv justifyContent="space-between" marginTop="12px">
                      <NewLabel weight="500" size="13px" height="16px">
                        Profit Sharing
                      </NewLabel>
                      <NewLabel weight="500" size="13px" height="16px" marginLeft="20px">
                        {profitShare}%
                      </NewLabel>
                    </FlexDiv>
                  </ReactTooltip>
                </NewLabel>
              </FlexDiv>

              <Divider height="1px" marginTop="12px" backColor="#e9e9e9" />

              <FlexDiv justifyContent="space-between" marginTop="12px">
                <NewLabel size="13px" weight="500" height="16px">
                  Last Harvest
                </NewLabel>
                <NewLabel size="13px" weight="500" height="16px">
                  {lastHarvest !== '' ? `${lastHarvest} ago` : '-'}
                </NewLabel>
              </FlexDiv>
            </LastHarvestInfo>
            {id === FARM_TOKEN_SYMBOL ? null : (
              <RewardPart borderColor={borderColor} backColor={backColor}>
                <VaultPanelActionsFooter {...viewComponentProps} />
              </RewardPart>
            )}
          </RestContent>
        </BigDiv>
      </Inner>
    </DetailView>
  )
}

export default WidoDetail
