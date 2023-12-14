import BigNumber from 'bignumber.js'
import { find, get, isEqual, isEmpty, isArray } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactHtmlParser from 'react-html-parser'
import ReactTooltip from 'react-tooltip'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import getBalances from '../../services/enso'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Back from '../../assets/images/logos/earn/back-arrow.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import WithdrawAnytime from '../../assets/images/logos/beginners/check-circle.svg'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import Diamond from '../../assets/images/logos/beginners/diamond-01.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
import DOT from '../../assets/images/logos/beginners/dot.svg'
import BottomEffect from '../../assets/images/logos/beginners/Top Banner.svg'
import AnimatedDots from '../../components/AnimatedDots'
import DepositBase from '../../components/AdvancedFarmComponents/SpecDeposit/DepositBase'
import DepositSelectToken from '../../components/AdvancedFarmComponents/SpecDeposit/DepositSelectToken'
import DepositStart from '../../components/AdvancedFarmComponents/SpecDeposit/DepositStart'
import DepositResult from '../../components/AdvancedFarmComponents/SpecDeposit/DepositResult'
import WithdrawBase from '../../components/AdvancedFarmComponents/SpecWithdraw/WithdrawBase'
import WithdrawSelectToken from '../../components/AdvancedFarmComponents/SpecWithdraw/WithdrawSelectToken'
import WithdrawStart from '../../components/AdvancedFarmComponents/SpecWithdraw/WithdrawStart'
import WithdrawResult from '../../components/AdvancedFarmComponents/SpecWithdraw/WithdrawResult'
import FarmDetailChart from '../../components/DetailChart/FarmDetailChart'
import PriceShareData from '../../components/lastPriceShareChart/PriceShareData'
import VaultPanelActionsFooter from '../../components/AdvancedFarmComponents/Rewards/VaultPanelActionsFooter'
import StakeBase from '../../components/AdvancedFarmComponents/Stake/StakeBase'
import StakeResult from '../../components/AdvancedFarmComponents/Stake/StakeResult'
import UnstakeBase from '../../components/AdvancedFarmComponents/Unstake/UnstakeBase'
import UnstakeResult from '../../components/AdvancedFarmComponents/Unstake/UnstakeResult'
import {
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
import { fromWei, getExplorerLink } from '../../services/web3'
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
  TopBtnInner,
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
  MainDescText,
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
  BorderBottomDiv,
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
  { name: 'Deposit', img: Safe },
  { name: 'Rewards', img: Diamond },
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

  const [balanceList, setBalanceList] = useState([])

  useEffect(() => {
    const getTokenBalance = async () => {
      try {
        if (chain && account && Object.keys(balances).length !== 0) {
          const curSortedBalances = await getBalances(account, Number(chain))
          setBalanceList(curSortedBalances)
        }
      } catch (err) {
        console.log('getTokenBalance: ', err)
      }
    }

    getTokenBalance()
  }, [account, chain, balances]) // eslint-disable-line react-hooks/exhaustive-deps

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
    if (curUrl.includes('#stake')) {
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
    const total =
      Number(
        fromWei(
          totalStaked,
          fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals,
          WIDO_BALANCES_DECIMALS,
        ),
      ) +
      Number(
        fromWei(
          lpTokenBalance,
          fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals,
          WIDO_BALANCES_DECIMALS,
        ),
      )
    setTotalValue(total)
  }, [totalStaked, lpTokenBalance, fAssetPool])

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
    <DetailView pageBackColor={pageBackColor} fontColor={fontColor}>
      {!isMobile && (
        <TopBtnInner>
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
        </TopBtnInner>
      )}
      <TopInner>
        <TopPart>
          <FlexTopDiv>
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
                <ChainBack>
                  <img src={BadgeAry[badgeId]} width={10} height={15} alt="" />
                </ChainBack>
              </FlexDiv>
            )}
            <TopDesc
              weight={600}
              size={isMobile ? '19.7px' : '25px'}
              height={isMobile ? '45px' : '82px'}
              marginBottom={isMobile ? '5px' : '10px'}
            >
              {token.tokenNames.join(' • ')}
            </TopDesc>
            <GuideSection>
              <GuidePart fontWeight="600">
                <img src={DOT} alt="" />
                {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                &nbsp;APR
              </GuidePart>
              <GuidePart fontWeight="500">
                <img className="icon" src={WithdrawAnytime} alt="" />
                Withdraw Anytime
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
          </FlexTopDiv>
          <img className="bottom" src={BottomEffect} alt="" />
          <BorderBottomDiv />
        </TopPart>
      </TopInner>
      <Inner>
        <BigDiv>
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
          {activeMainTag === 0 ? (
            <MainDescText>
              {useIFARM
                ? 'Turn any token from your wallet into interest-bearing iFARM to earn Harvest’s platform rewards.'
                : 'Turn any token from your wallet into auto-compounding fToken to start farming.'}
            </MainDescText>
          ) : activeMainTag === 1 ? (
            <MainDescText>
              Receive token rewards by staking your deposit, effectively maximizing your APY.
            </MainDescText>
          ) : (
            <MainDescText>
              Preview live data, APY breakdown and source of yield to make informed farming
              decisions.
            </MainDescText>
          )}
          <InternalSection height={activeMainTag === 0 ? '500px' : 'unset'}>
            <MainSection height={activeMainTag === 0 ? '100%' : 'fit-content'}>
              {activeMainTag === 0 ? (
                loadData ? (
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
                )
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
                  <MyBalance marginBottom="23px">
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight="600"
                      height={isMobile ? '18px' : '24px'}
                      color="#344054"
                      padding={isMobile ? '9px 13px' : '10px 15px'}
                      borderBottom="1px solid #EBEBEB"
                    >
                      My Rewards
                    </NewLabel>
                    <FlexDiv>
                      <VaultPanelActionsFooter {...viewComponentProps} />
                    </FlexDiv>
                  </MyBalance>
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
                        borderBottom="1px solid #EBEBEB"
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
                        borderBottom="1px solid #EBEBEB"
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
                      marginBottom={isMobile ? '0' : '23px'}
                      marginTop={isMobile ? '0px' : '0'}
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #EBEBEB"
                      >
                        Deposit Balance
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
                          {`f${id}`}
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
                              This fToken represents your share in this farm.
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
                          Est. USD Value
                        </NewLabel>
                        <NewLabel
                          weight="500"
                          size={isMobile ? '10px' : '14px'}
                          height={isMobile ? '18px' : '24px'}
                          color="black"
                          self="center"
                        >
                          ${!connected ? 0 : lpTokenBalance ? depositedValueUSD : <AnimatedDots />}
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
                        selectToken={selectTokenDepo}
                        setSelectToken={setSelectTokenDepo}
                        deposit={depositStart}
                        setDeposit={setDepositStart}
                        finalStep={depositFinalStep}
                        balance={balanceDepo}
                        pickedToken={pickedTokenDepo}
                        inputAmount={inputAmountDepo}
                        setInputAmount={setInputAmountDepo}
                        token={token}
                        switchMethod={switchDepoMethod}
                        tokenSymbol={id}
                        useIFARM={useIFARM}
                      />
                      <DepositSelectToken
                        selectToken={selectTokenDepo}
                        setSelectToken={setSelectTokenDepo}
                        // clickTokenId={clickTokenIdDepo}
                        // setClickedTokenId={setClickedTokenIdDepo}
                        setPickedToken={setPickedTokenDepo}
                        setBalance={setBalanceDepo}
                        balanceList={balanceList}
                        setPartHeight={setPartHeightDepo}
                      />
                      <DepositStart
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
                      />
                      <DepositResult
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
                      />
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
                        switchMethod={switchDepoMethod}
                        useIFARM={useIFARM}
                      />
                      <WithdrawSelectToken
                        selectToken={selectTokenWith}
                        setSelectToken={setSelectTokenWith}
                        // clickTokenId={clickTokenIdWith}
                        // setClickedTokenId={setClickedTokenIdWith}
                        setPickedToken={setPickedTokenWith}
                        balanceList={balanceList}
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
                        borderBottom="1px solid #EBEBEB"
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
                    <>
                      <MyBalance marginBottom={isMobile ? '0' : '23px'}>
                        <NewLabel
                          size={isMobile ? '12px' : '14px'}
                          weight="600"
                          height={isMobile ? '18px' : '24px'}
                          color="#344054"
                          padding={isMobile ? '7px 11px' : '10px 15px'}
                          borderBottom="1px solid #EBEBEB"
                        >
                          Stake Balance
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
                            {useIFARM ? 'iFARM' : `f${id}`}
                          </NewLabel>
                          <NewLabel
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            weight={isMobile ? '500' : '700'}
                            color={isMobile ? '#15202b' : '#00D26B'}
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
                        <FlexDiv
                          justifyContent="space-between"
                          padding={isMobile ? '7px 11px' : '10px 15px'}
                        >
                          <NewLabel
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            weight="500"
                            color="#344054"
                          >
                            Est. USD Value
                          </NewLabel>
                          <NewLabel
                            weight="500"
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            color={isMobile ? '#15202b' : 'black'}
                          >
                            $
                            {!connected ? (
                              0
                            ) : totalStaked ? (
                              formatNumber(
                                fromWei(
                                  totalStaked,
                                  fAssetPool.lpTokenData.decimals,
                                  POOL_BALANCES_DECIMALS,
                                  true,
                                ) * usdPrice,
                                POOL_BALANCES_DECIMALS,
                              )
                            ) : (
                              <AnimatedDots />
                            )}
                          </NewLabel>
                        </FlexDiv>
                      </MyBalance>
                      <MyBalance marginBottom={isMobile ? '24px' : '23px'}>
                        <NewLabel
                          size={isMobile ? '12px' : '14px'}
                          weight="600"
                          height={isMobile ? '18px' : '24px'}
                          color="#344054"
                          padding={isMobile ? '7px 11px' : '10px 15px'}
                          borderBottom="1px solid #EBEBEB"
                        >
                          Deposit Available to Stake
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
                            {useIFARM ? 'iFARM' : `f${id}`}
                          </NewLabel>
                          <NewLabel
                            size={isMobile ? '10px' : '14px'}
                            height={isMobile ? '18px' : '24px'}
                            weight={isMobile ? '500' : '700'}
                            color="#15202b"
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
                      </MyBalance>
                    </>
                  )}
                  {isMobile && (
                    <MyBalance marginBottom="24px">
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="600"
                        height={isMobile ? '18px' : '24px'}
                        color="#000"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                        borderBottom="1px solid #EBEBEB"
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
                        borderBottom="1px solid #EBEBEB"
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
                  <MyBalance marginBottom={isMobile ? '24px' : '20px'}>
                    <NewLabel
                      size={isMobile ? '12px' : '14px'}
                      weight={isMobile ? '600' : '700'}
                      height={isMobile ? '18px' : '24px'}
                      color={isMobile ? 'black' : '#344054'}
                      padding={isMobile ? '7px 11px' : '10px 15px'}
                      borderBottom="1px solid #EBEBEB"
                    >
                      Overview
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
                        APY
                      </NewLabel>
                      <NewLabel
                        size={isMobile ? '10px' : '14px'}
                        height={isMobile ? '18px' : '24px'}
                        weight="500"
                        color={isMobile ? '#15202B' : '#000'}
                      >
                        {showAPY()}
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
                      >
                        Daily APY
                      </NewLabel>
                      <NewLabel
                        weight="500"
                        size={isMobile ? '10px' : '14px'}
                        height={isMobile ? '18px' : '24px'}
                        color={isMobile ? '#15202B' : '#000'}
                      >
                        {showApyDaily()}
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
                      >
                        TVL
                      </NewLabel>
                      <NewLabel
                        weight="500"
                        size={isMobile ? '10px' : '14px'}
                        height={isMobile ? '18px' : '24px'}
                        color={isMobile ? '#15202B' : '#000'}
                      >
                        {showTVL()}
                      </NewLabel>
                    </FlexDiv>
                  </MyBalance>
                  {!isMobile && loadData && (
                    <MyBalance marginBottom={isMobile ? '24px' : '20px'}>
                      <NewLabel
                        size={isMobile ? '12px' : '14px'}
                        weight="700"
                        height={isMobile ? '18px' : '24px'}
                        color="#344054"
                        padding={isMobile ? '9px 13px' : '10px 15px'}
                        borderBottom="1px solid #EBEBEB"
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
                      borderBottom="1px solid #EBEBEB"
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
                  {!useIFARM && (
                    <MyBalance>
                      <FlexDiv
                        justifyContent="space-between"
                        padding={isMobile ? '7px 11px' : '10px 15px'}
                      >
                        <NewLabel
                          size={isMobile ? '12px' : '14px'}
                          height={isMobile ? '18px' : '24px'}
                          weight="600"
                          color={isMobile ? '#000' : '#344054'}
                        >
                          Last Harvest
                        </NewLabel>
                        {isMobile ? (
                          <NewLabel size="10px" height="18px" weight="500" color="#15202B">
                            {lastHarvest !== '' ? `${lastHarvest} ago` : '-'}
                          </NewLabel>
                        ) : (
                          <NewLabel size="14px" height="24px" weight="500" color="#000">
                            {lastHarvest !== '' ? `${lastHarvest} ago` : '-'}
                          </NewLabel>
                        )}
                      </FlexDiv>
                    </MyBalance>
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