import BigNumber from 'bignumber.js'
import { find, get, isArray, isEqual, sumBy } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useMediaQuery } from 'react-responsive'
import { useHistory, useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import useEffectWithPrevious from 'use-effect-with-previous'
import { getBalances, getSupportedTokens } from 'wido'
import tokenMethods from '../../services/web3/contracts/token/methods'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import APY from '../../assets/images/logos/earn/apy.svg'
import Back from '../../assets/images/logos/earn/back.svg'
import Daily from '../../assets/images/logos/earn/daily.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import TVL from '../../assets/images/logos/earn/tvl.svg'
import AnimatedDots from '../../components/AnimatedDots'
import FarmDetailChart from '../../components/FarmDetailChart'
import VaultPanelActionsFooter from '../../components/VaultComponents/VaultPanelActions/VaultPanelActionsFooter'
import WidoDepositBase from '../../components/WidoComponents/WidoDepositBase'
import WidoDepositFinalStep from '../../components/WidoComponents/WidoDepositFinalStep'
import WidoDepositSelectToken from '../../components/WidoComponents/WidoDepositSelectToken'
import WidoDepositStart from '../../components/WidoComponents/WidoDepositStart'
import WidoDepositStartRoutes from '../../components/WidoComponents/WidoDepositStartRoutes'
import WidoDepositStartSlippage from '../../components/WidoComponents/WidoDepositStartSlippage'
import WidoPoolDepositBase from '../../components/WidoComponents/WidoPoolDepositBase'
import WidoPoolDepositFinalStep from '../../components/WidoComponents/WidoPoolDepositFinalStep'
import WidoPoolWithdrawBase from '../../components/WidoComponents/WidoPoolWithdrawBase'
import WidoWithdrawBase from '../../components/WidoComponents/WidoWithdrawBase'
import WidoWithdrawFinalStep from '../../components/WidoComponents/WidoWithdrawFinalStep'
import WidoWithdrawSelectToken from '../../components/WidoComponents/WidoWithdrawSelectToken'
import WidoWithdrawStart from '../../components/WidoComponents/WidoWithdrawStart'
import WidoWithdrawStartRoutes from '../../components/WidoComponents/WidoWithdrawStartRoutes'
import WidoWithdrawStartSlippage from '../../components/WidoComponents/WidoWithdrawStartSlippage'
import {
  DECIMAL_PRECISION,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
} from '../../constants'
import { fromWei, getExplorerLink, newContractInstance, getWeb3 } from '../../services/web3'
import { addresses } from '../../data'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'

import { displayAPY, formatNumber, getDetailText, getTotalApy } from '../../utils'
import {
  BackArrow,
  BackBtnRect,
  BigDiv,
  ChainBack,
  DepositComponets,
  DescInfo,
  DetailView,
  DivideBar,
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
} from './style'

const chainList = [
  { id: 1, name: 'Ethereum', chainId: 1 },
  { id: 2, name: 'Polygon', chainId: 137 },
  { id: 4, name: 'Arbitrum', chainId: 42161 },
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
  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM]
  const [active1, setActive1] = useState(true)
  const [active2, setActive2] = useState(false)

  // Switch Tag (Farm/Details in mobile)
  const [farmView, setFarmView] = useState(true)
  const [detailsView, setDetailsView] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const { push } = useHistory()

  const { loadingVaults, vaultsData } = useVaults()
  const { pools, userStats, fetchUserPoolStats } = usePools()
  const { account, balances, getWalletBalances } = useWallet()
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
        isNew: tokens[IFARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[IFARM_TOKEN_SYMBOL].newDetails,
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
        isNew: tokens[FARM_WETH_TOKEN_SYMBOL].isNew,
        balance: 'FARM_WETH_LP',
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, GRAIN'], // 'FARM/GRAIN',
        platform: ['Uniswap'],
        data: farmGrainPool,
        vaultAddress: addresses.FARM_GRAIN_LP,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_GRAIN_TOKEN_SYMBOL].isNew,
        balance: 'FARM_GRAIN_LP',
      },
    }),
    [tokens, farmGrainPool, farmWethPool, farmProfitSharingPool, profitShareAPY],
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
  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const boostedRewardAPY = get(vaultPool, 'boostedRewardAPY', 0)

  const chain = token.chain || token.data.chain
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

  const [useIFARM, setIFARM] = useState(id === FARM_TOKEN_SYMBOL)
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
  const [, setClickedVaultIdDepo] = useState(-1)
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
        if (chain && account) {
          const curBalances = await getBalances(account, [chain.toString()])
          setBalanceList(curBalances)
          let supList = [],
            directInSup = {},
            directInBalance = {},
            supportedList = [],
            vaultId
          try {
            supList = await getSupportedTokens({
              chainId: [chain],
              toToken: toTokenAddress,
              toChainId: chain,
            })
          } catch (err) {
            console.log('getSupportedTokens of Wido: ', err)
          }
          const tokenAddress = token.tokenAddress

          const soonSupList = []
          for (let i = 0; i < supList.length; i += 1) {
            const supToken = curBalances.find(el => el.address === supList[i].address)
            if (supToken) {
              supList[i].balance = supToken.balance
              supList[i].usdValue = supToken.balanceUsdValue
              supList[i].usdPrice = supToken.usdPrice
            } else {
              supList[i].balance = '0'
              supList[i].usdValue = '0'
            }
            supList[i].default = false
            supportedList.push(supList[i])

            if (tokenAddress.length !== 2) {
              if (supList[i].address.toLowerCase() === tokenAddress.toLowerCase()) {
                directInSup = supList[i]
              }
            }
          }

          supportedList = supportedList.sort(function reducer(a, b) {
            return Number(fromWei(b.balance, b.decimals)) - Number(fromWei(a.balance, a.decimals))
          })

          for (let j = 0; j < curBalances.length; j += 1) {
            const supToken = supList.find(el => el.address === curBalances[j].address)
            if (!supToken) {
              soonSupList.push(curBalances[j])
            }

            if (tokenAddress.length !== 2) {
              if (curBalances[j].address.toLowerCase() === tokenAddress.toLowerCase()) {
                directInBalance = curBalances[j]
              }
            }
          }

          vaultId = Object.keys(vaultsData).find(
            key => vaultsData[key].tokenAddress === tokenAddress,
          )
          if (!vaultId) {
            vaultId = Object.keys(poolVaults).find(
              key => poolVaults[key].tokenAddress === tokenAddress,
            )
          }
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
            supportedList = supportedList.sort(function result(x, y) {
              return x === directInSup ? -1 : y === directInSup ? 1 : 0
            })
            if (supportedList.length === 0) {
              supportedList.push(directInSup)
            }
            supportedList[0].default = true
          } else if (
            !(Object.keys(directInBalance).length === 0 && directInBalance.constructor === Object)
          ) {
            directInBalance.balance = directBalance || '0'
            directInBalance.usdPrice =
              directInBalance.usdPrice > 0 ? directInBalance.usdPrice : directUsdPrice
            directInBalance.usdValue =
              directInBalance.usdValue > 0 ? directInBalance.usdValue : directUsdValue
            supportedList = [directInBalance].push(supportedList)
            if (supportedList.length === 0) {
              supportedList.push(directInBalance)
            }
            supportedList[0].default = true
          } else {
            const web3Client = await getWeb3(chain, null)
            const { getSymbol } = tokenMethods
            const lpInstance = await newContractInstance(id, tokenAddress, null, web3Client)
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
            }
            if (supportedList.length > 0) {
              supportedList = [direct].push(supportedList)
            } else {
              supportedList.push(direct)
            }
          }
          setSoonToSupList(soonSupList)
          setSupTokenList(supportedList)
        }
      } catch (err) {
        console.log('getTokenBalance: ', err)
      }
    }

    getTokenBalance()
  }, [account, chain, toTokenAddress, token, id, tokenDecimals, balances, poolVaults, vaultsData])

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
    setIFARM,
    setWithdrawMode,
    loaded,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    isSpecialVault,
    totalAmountToExecute,
    rewardSymbol,
  }

  const [widoPartHeight, setWidoPartHeight] = useState(null)
  const [symbolDepo, setSymbolDepo] = useState('iFARM')
  const [symbolWith, setSymbolWith] = useState('iFARM')
  const [legacyStaking, setLegacyStaking] = useState(false)

  return (
    <DetailView pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <TopPart>
          <FlexTopDiv>
            <BackBtnRect
              onClick={() => {
                push('/')
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
          </FlexTopDiv>
        </TopPart>
        <MobileTop borderColor={borderColor}>
          <FlexMobileTopDiv>
            <FlexTopDiv>
              <BackBtnRect
                onClick={() => {
                  push('/')
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

            <ChainBack>
              <img src={BadgeAry[badgeId]} width={11} height={15} alt="" />
            </ChainBack>
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
              padding={!isMobile ? '20px 30px' : '20px 25px'}
              display="flex"
              justifyContent={isMobile ? 'space-between' : 'space-around'}
              backColor={backColor}
              borderColor={borderColor}
            >
              <div>
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
                      backgroundColor="white"
                      borderColor="black"
                      border
                      textColor="black"
                    >
                      <TooltipContent>
                        <Name>APY</Name>
                        {showAPY()}
                      </TooltipContent>
                    </ReactTooltip>
                  </NewLabel>
                </NewLabel>
                <ValueShow>{showAPY()}</ValueShow>
              </div>

              <DivideBar height="50px" backcolor={widoDetailDividerColor} />

              <div>
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
                      backgroundColor="white"
                      borderColor="black"
                      border
                      textColor="black"
                    >
                      <TooltipContent>
                        <Name>Daily</Name>
                        {showApyDaily()}
                      </TooltipContent>
                    </ReactTooltip>
                  </NewLabel>
                </NewLabel>
                <ValueShow>{showApyDaily()}</ValueShow>
              </div>

              <DivideBar height="50px" backcolor={widoDetailDividerColor} />

              <div>
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
                      backgroundColor="white"
                      borderColor="black"
                      border
                      textColor="black"
                    >
                      <TooltipContent>
                        <Name>TVL</Name>
                        {showTVL()}
                      </TooltipContent>
                    </ReactTooltip>
                  </NewLabel>
                </NewLabel>
                <ValueShow>{showTVL()}</ValueShow>
              </div>
            </HalfInfo>
            <HalfInfo
              padding={!isMobile ? '10px 20px' : '15px'}
              backColor={backColor}
              borderColor={borderColor}
            >
              {loadComplete && (
                <FarmDetailChart
                  token={token}
                  vaultPool={vaultPool}
                  lastTVL={Number(vaultValue)}
                  lastAPY={Number(totalApy)}
                />
              )}
            </HalfInfo>
            <HalfInfo
              padding={!isMobile ? '20px' : '15px'}
              backColor={backColor}
              borderColor={borderColor}
            >
              <NewLabel weight={700} size="16px" height="21px">
                APY Breakdown
              </NewLabel>
              <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
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
                    {/* <img className="icon" src={VaultIcon} alt="" /> */}
                    <NewLabel size="12px" weight={isMobile ? 400 : 600} height="16px" self="center">
                      Vault Address
                    </NewLabel>
                    {/* <img className="external-link" src={ExternalLink} alt="" /> */}
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
                    {/* <img className="icon" src={StrategyIcon} alt="" /> */}
                    <NewLabel size="12px" weight={isMobile ? 400 : 600} height="16px" self="center">
                      Strategy Address
                    </NewLabel>
                    {/* <img className="external-link" src={ExternalLink} alt="" /> */}
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
                  {/* <img className="icon" src={VaultIcon} alt="" /> */}
                  <NewLabel size="12px" weight={isMobile ? 400 : 600} height="16px" self="center">
                    Pool Address
                  </NewLabel>
                  {/* <img className="external-link" src={ExternalLink} alt="" /> */}
                </InfoLabel>
              </FlexDiv>
            </HalfInfo>
          </HalfContent>
          <RestContent show={farmView}>
            <RestPart borderColor={borderColor} backColor={backColor} widoHeight={widoPartHeight}>
              <SwitchTag borderColor={widoSwitchTagBorderColor} backColor={widoSwitchTagBackColor}>
                <Tag
                  className="tag1"
                  backColor={widoTagBackColor}
                  shadow={widoTagBoxShadow}
                  fontColor={widoTagFontColor}
                  fontActiveColor={widoTagActiveFontColor}
                  active={active1}
                  onClick={() => {
                    setActive1(true)
                    setActive2(false)
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
                  active={active2}
                  onClick={() => {
                    setActive1(false)
                    setActive2(true)
                  }}
                >
                  Withdraw
                </Tag>
              </SwitchTag>

              {/* Components for Deposit */}
              <DepositComponets show={active1}>
                {useIFARM ? (
                  <WidoPoolDepositBase // for IFarm
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
                    <WidoDepositBase
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

                <WidoDepositSelectToken
                  selectTokenWido={selectTokenDepo}
                  setSelectTokenWido={setSelectTokenDepo}
                  clickTokenId={clickTokenIdDepo}
                  setClickedTokenId={setClickedTokenIdDepo}
                  setPickedToken={setPickedTokenDepo}
                  setBalance={setBalanceDepo}
                  supTokenList={supTokenList}
                  soonToSupList={soonToSupList}
                  setWidoPartHeight={setWidoPartHeight}
                />

                <WidoDepositStart
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

                <WidoDepositStartRoutes
                  startRoutes={startRoutesDepo}
                  setStartRoutes={setStartRoutesDepo}
                />

                <WidoDepositStartSlippage
                  startSlippage={startSlippageDepo}
                  setStartSlippage={setStartSlippageDepo}
                  setSlippagePercent={setSlippagePercentDepo}
                  setDepositWido={setDepositWido}
                />

                {useIFARM ? (
                  <WidoPoolDepositFinalStep
                    finalStep={depositFinalStep}
                    setFinalStep={setDepositFinalStep}
                    setDepositWido={setDepositWido}
                    setSelectTokenWido={setSelectTokenDepo}
                    inputAmount={inputAmountDepo}
                    setInputAmount={setInputAmountDepo}
                    setUsdValue={setUsdValue}
                    setBalance={setBalanceDepo}
                    setClickedTokenId={setClickedTokenIdDepo}
                    setClickedVaultId={setClickedVaultIdDepo}
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
                  <WidoDepositFinalStep
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
              <WithdrawComponents show={active2}>
                {useIFARM ? (
                  <WidoPoolWithdrawBase
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
                  <WidoWithdrawBase
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

                <WidoWithdrawSelectToken
                  selectTokenWido={selectTokenWith}
                  setSelectTokenWido={setSelectTokenWith}
                  clickTokenId={clickTokenIdWith}
                  setClickedTokenId={setClickedTokenIdWith}
                  pickedToken={pickedTokenWith}
                  setPickedToken={setPickedTokenWith}
                  supTokenList={supTokenList}
                  soonToSupList={soonToSupList}
                  setWidoPartHeight={setWidoPartHeight}
                />

                <WidoWithdrawStart
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

                <WidoWithdrawStartRoutes
                  startRoutes={startRoutesWith}
                  setStartRoutes={setStartRoutesWith}
                />

                <WidoWithdrawStartSlippage
                  startSlippage={startSlippageWith}
                  setStartSlippage={setStartSlippageWith}
                  slippagePercent={slippagePercentWith}
                  setSlippagePercent={setSlippagePercentWith}
                  setWithdrawWido={setWithdrawWido}
                />

                <WidoWithdrawFinalStep
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
