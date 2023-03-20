import BigNumber from 'bignumber.js'
import { find, get, isArray, isEmpty, sumBy } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useMediaQuery } from 'react-responsive'
import { useHistory, useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import APY from '../../assets/images/logos/earn/apy.svg'
import Back from '../../assets/images/logos/earn/back.svg'
import CollaboBack from '../../assets/images/logos/earn/collabo-back.svg'
import Collaboration from '../../assets/images/logos/earn/collaboration.svg'
import Daily from '../../assets/images/logos/earn/daily.svg'
import ExternalLink from '../../assets/images/logos/earn/externallink.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import StrategyIcon from '../../assets/images/logos/earn/strategyicon.svg'
import TVL from '../../assets/images/logos/earn/tvl.svg'
import Uniswap from '../../assets/images/logos/earn/uniswap.svg'
import VaultIcon from '../../assets/images/logos/earn/vaulticon.svg'
import AnimatedDots from '../../components/AnimatedDots'
import FarmDetailChart from '../../components/FarmDetailChart'
import NumberInput from '../../components/NumberInput'
import VaultPanelActions from '../../components/VaultComponents/VaultPanelActions'
import VaultPanelActionsFooter from '../../components/VaultComponents/VaultPanelActions/VaultPanelActionsFooter'
import {
  DECIMAL_PRECISION,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_USDC_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  PANEL_ACTIONS_TYPE,
  SPECIAL_VAULTS,
  UNIV3_POOL_ID_REGEX,
} from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { fromWei, getExplorerLink, newContractInstance, toWei } from '../../services/web3'
import tokenContractData from '../../services/web3/contracts/token/contract.json'
import tokenContractMethods from '../../services/web3/contracts/token/methods'
import uniStatusViewerContractData from '../../services/web3/contracts/unistatus-viewer/contract.json'
import uniStatusViewerContractMethods from '../../services/web3/contracts/unistatus-viewer/methods'
import {
  displayAPY,
  formatNumber,
  getDetailText,
  getTotalApy,
  hasAmountLessThanOrEqualTo,
  hasRequirementsForInteraction,
  hasValidAmountForInputAndMaxButton,
} from '../../utils'
import {
  BackArrow,
  BackBtnRect,
  BalanceItem,
  BigDiv,
  ChainBack,
  CollaboButton,
  DescInfo,
  DetailView,
  DivFlex,
  FlexDiv,
  FlexTopDiv,
  HalfContent,
  HalfInfo,
  InfoIcon,
  InfoLabel,
  Inner,
  LogoImg,
  MigrationLabel,
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

const FarmDetail = () => {
  const { id } = useParams()
  const { loadingVaults, vaultsData } = useVaults()
  const { account, balances, chain, connected } = useWallet()

  const { pools, fetchUserPoolStats, userStats } = usePools()

  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM]

  const { profitShareAPY } = useStats()

  // Switch Tag (Deposit/Withdraw)
  const [active1, setActive1] = useState(true)
  const [active2, setActive2] = useState(false)

  // Switch Tag (Farm/Details in mobile)
  const [farmView, setFarmView] = useState(false)
  const [detailsView, setDetailsView] = useState(true)

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  /* eslint-enable global-require */

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmUsdcPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_USDC_POOL_ID)
  const farmWethPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        tokenNames: ['FARM'],
        isNew: tokens[FARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[FARM_TOKEN_SYMBOL].newDetails,
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, ETH'], // 'FARM/ETH',
        platform: ['Uniswap'],
        data: farmWethPool,
        logoUrl: ['./icons/farm.svg', './icons/weth.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_WETH_TOKEN_SYMBOL].isNew,
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, GRAIN'], // 'FARM/GRAIN',
        platform: ['Uniswap'],
        data: farmGrainPool,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_GRAIN_TOKEN_SYMBOL].isNew,
      },
      [FARM_USDC_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        inactive: true,
        tokenNames: ['FARM', 'USDC'],
        platform: ['Uniswap'],
        data: farmUsdcPool,
        logoUrl: ['./icons/farm.svg', './icons/usdc.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_USDC_TOKEN_SYMBOL].isNew,
      },
    }),
    [tokens, farmGrainPool, farmWethPool, farmUsdcPool, farmProfitSharingPool, profitShareAPY],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const [useIFARM, setIFARM] = useState(id === FARM_TOKEN_SYMBOL)
  const token = groupOfVaults[id]
  const logoUrl = useIFARM ? tokens[IFARM_TOKEN_SYMBOL].logoUrl : token.logoUrl

  // show chart only about one token for temp
  const tokenChart = groupOfVaults.FARM
  const vaultPoolChart = tokenChart.data

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  const tokenVault = get(vaultsData, token.hodlVaultId || id)

  let vaultPool

  if (isSpecialVault) {
    vaultPool = token.data
  } else {
    vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
  }
  const farmAPY = get(vaultPool, 'totalRewardAPY', 0)
  const tradingApy = get(vaultPool, 'tradingApy', 0)
  const boostedEstimatedAPY = get(tokenVault, 'boostedEstimatedAPY', 0)
  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const boostedRewardAPY = get(vaultPool, 'boostedRewardAPY', 0)

  const chainId = token.chain || token.data.chain
  const [badgeId, setBadgeId] = useState(-1)

  useEffect(() => {
    const getBadge = () => {
      chainList.forEach((el, i) => {
        if (el.chainId === Number(chainId)) {
          setBadgeId(i)
        }
      })
    }
    getBadge()
  }, [chainId])
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
  const { push } = useHistory()
  const [autoUnStake, setUnAutoStake] = useState(true)
  const [zap, selectZapMode] = useState(!token.disableAutoSwap)
  const [amountsForPosition, setAmountsForPosition] = useState(null)
  const [amountsToExecute, setAmountsToExecute] = useState([''])
  const fAssetPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === tokens[id].vaultAddress)

  const isUniV3ManagedVault = !!(
    token.uniswapV3ManagedData?.capToken && token.uniswapV3ManagedData.capToken !== ''
  )

  const lpTokenBalance = get(userStats, `[${fAssetPool.id}]['lpTokenBalance']`, 0)
  const maxAssetsAmountToDisplay = useRef([])
  const userBalance = get(balances, id, 0)
  const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
  const tokenDecimals = token.decimals || tokens[id].decimals
  const totalStaked = get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)
  const lpTokenApprovedBalance = get(userStats, `[${fAssetPool.id}]['lpTokenApprovedBalance']`, 0)
  const totalRewardsEarned = get(userStats, `[${fAssetPool.id}]['totalRewardsEarned']`, 0)
  const totalBalanceToWithdraw = new BigNumber(totalStaked).plus(lpTokenBalance)

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

  const fAssetSymbol = isSpecialVault ? id : token.apyTokenSymbols[0]
  const [loadingFarmingBalance, setFarmingLoading] = useState(false)
  const [loadingLpStats, setLpStatsloading] = useState(false)
  const [autoStake, setAutoStake] = useState(true)
  const [withdrawMode, setWithdrawMode] = useState(false)
  const [oldLpTokenBalance, setOldLpTokenBalance] = useState(null)
  const [oldAmountToExecute, setOldAmountToExecute] = useState(null)

  const totalAmountToExecute = useMemo(() => sumBy(amountsToExecute, amount => Number(amount)), [
    amountsToExecute,
  ])

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
          <>{formatNumber(vaultValue, 2)}</>
        ) : (
          <AnimatedDots />
        )}
      </>
    )
  }

  const setUniV3AssetRatio = useCallback(
    (assetChangedIdx, newAmountsToExecute) => {
      if (!zap) {
        const assetToChangeIdx = !assetChangedIdx ? 1 : 0
        const { amount0, amount1 } = amountsForPosition
        const amountsToInsert = [...newAmountsToExecute]

        const amount0InEther = fromWei(amount0, tokens[multipleAssets[0]].decimals)
        const amount1InEther = fromWei(amount1, tokens[multipleAssets[1]].decimals)

        amountsToInsert[assetToChangeIdx] = new BigNumber(newAmountsToExecute[assetChangedIdx])
          .multipliedBy(!assetChangedIdx ? amount1InEther : amount0InEther)
          .div(!assetChangedIdx ? amount0InEther : amount1InEther)
          .toFixed()
        setAmountsToExecute(amountsToInsert)
      }
    },
    [amountsForPosition, zap, multipleAssets, tokens],
  )
  useEffect(() => {
    if (multipleAssets && !withdrawMode) {
      maxAssetsAmountToDisplay.current = []
      multipleAssets.forEach(symbol => {
        maxAssetsAmountToDisplay.current = [
          ...maxAssetsAmountToDisplay.current,
          get(balances, symbol, 0),
        ]
      })
    } else if (!withdrawMode) {
      maxAssetsAmountToDisplay.current = [
        fromWei(isSpecialVault ? lpTokenBalance : userBalance, tokenDecimals),
      ]
    } else if (isSpecialVault) {
      maxAssetsAmountToDisplay.current = [
        fromWei(useIFARM ? iFARMBalance : totalStaked, tokenDecimals),
      ]
    } else {
      maxAssetsAmountToDisplay.current = [
        fromWei(autoUnStake ? totalBalanceToWithdraw : lpTokenBalance, tokenDecimals),
      ]
    }
  }, [
    withdrawMode,
    isSpecialVault,
    autoUnStake,
    iFARMBalance,
    totalStaked,
    tokenDecimals,
    totalBalanceToWithdraw,
    lpTokenBalance,
    useIFARM,
    userBalance,
    multipleAssets,
    balances,
  ])
  const [pendingAction, setPendingAction] = useState(null)
  const loaded = true
  const setLoadingDots = (loadingFarm, loadingLp) => {
    setFarmingLoading(loadingFarm)
    setLpStatsloading(loadingLp)
  }

  useEffect(() => {
    const fetchAmountsForPosition = async () => {
      const viewerContractInstance = await newContractInstance(
        null,
        uniStatusViewerContractData.address,
        uniStatusViewerContractData.abi,
      )
      const amounts = await uniStatusViewerContractMethods.getAmountsForPosition(
        token.uniswapV3PositionId,
        viewerContractInstance,
      )

      setAmountsForPosition(amounts)
    }

    if (multipleAssets && connected && chain === CHAINS_ID.ETH_MAINNET) {
      fetchAmountsForPosition()
    }
  }, [multipleAssets, token, chain, connected, id])

  useEffect(() => {
    const fetchUserPositions = async () => {
      if (token.migrationInfo) {
        const { lpTokenAddress, lpTokenDecimals } = token.migrationInfo

        const tokenInstance = await newContractInstance(null, lpTokenAddress, tokenContractData.abi)

        const fetchedOldLpTokenBalance = await tokenContractMethods.getBalance(
          account,
          tokenInstance,
        )

        setOldLpTokenBalance(fromWei(fetchedOldLpTokenBalance, lpTokenDecimals))
        setOldAmountToExecute(fromWei(fetchedOldLpTokenBalance, lpTokenDecimals))
      }
    }

    if (multipleAssets && connected && chain === CHAINS_ID.ETH_MAINNET) {
      fetchUserPositions()
    }
  }, [totalAmountToExecute, multipleAssets, token, chain, account, connected])

  useEffect(() => {
    if (account && fAssetPool && fAssetPool.lpTokenData && !isEmpty(userStats)) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = [fAssetPool]
        const hodlVaultId = get(vaultsData, `[${id}].hodlVaultId`)

        if (hodlVaultId) {
          const hodlVaultData = get(vaultsData, hodlVaultId)
          const hodlPool = find(
            pools,
            selectedPool => selectedPool.collateralAddress === hodlVaultData.vaultAddress,
          )

          poolsToLoad.push(hodlPool)
        }

        await fetchUserPoolStats(poolsToLoad, account, userStats)
      }
      loadUserPoolsStats()
    }
  }, [account, fAssetPool, fetchUserPoolStats, pools, vaultsData, id, userStats])

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
    autoStake,
    autoUnStake,
    useIFARM,
    setAmountsToExecute,
    setLoadingDots,
    setPendingAction,
    setAutoStake,
    setUnAutoStake,
    setIFARM,
    setWithdrawMode,
    loaded,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    isSpecialVault,
    totalAmountToExecute,
    zap,
    selectZapMode,
  }

  const {
    backColor,
    pageBackColor,
    fontColor,
    borderColor,
    filterColor,
    widoBackIconColor,
    widoBackBtnBackColor,
    widoBackBtnBackHoverColor,
  } = useThemeContext()

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
          <RewardsContainer>
            {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
              token.inactive || token.testInactive ? (
                'Inactive'
              ) : null
            ) : (
              <>
                <b>
                  {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                  &nbsp;
                </b>
              </>
            )}
          </RewardsContainer>
        ) : (
          <div>
            <AnimatedDots />
          </div>
        )}
      </>
    )
  }

  const apyDaily = totalApy
    ? (((Number(totalApy) / 100 + 1) ** (1 / 365) - 1) * 100).toFixed(3)
    : null
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
              <b>{apyDaily}% &nbsp;</b>
            )}
          </RewardsContainer>
        ) : (
          <AnimatedDots />
        )}
      </>
    )
  }

  return (
    <DetailView pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <TopPart>
          <FlexTopDiv>
            <BackBtnRect
              onClick={() => {
                push('/farm')
              }}
              backcolor={widoBackBtnBackColor}
              backhovercolor={widoBackBtnBackHoverColor}
            >
              <BackArrow src={Back} alt="" iconcolor={widoBackIconColor} />
            </BackBtnRect>
            {logoUrl.map((el, i) => (
              <LogoImg
                className="logo"
                zIndex={100 - i}
                src={el.slice(1, el.length)}
                key={i}
                height={32}
                alt=""
              />
            ))}
            <TopDesc weight={400} size="16px" height="21px">
              {token.tokenNames.join(', ') || token.rewardSymbol}
            </TopDesc>
            <ChainBack>
              <img src={BadgeAry[badgeId]} width={11} height={15} alt="" />
            </ChainBack>
          </FlexTopDiv>
        </TopPart>
        <MobileTop>
          <BackBtnRect
            onClick={() => {
              push('/farm')
            }}
            backcolor={widoBackBtnBackColor}
            backhovercolor={widoBackBtnBackHoverColor}
          >
            <BackArrow src={Back} alt="" iconcolor={widoBackIconColor} />
          </BackBtnRect>
          <FlexTopDiv>
            <img src={logoUrl} height={32} alt="" />
            <TopDesc weight={700} size="24px" height="31px" color="#FFF">
              {token.tokenNames.join(', ')}
            </TopDesc>
            <img src={Uniswap} width={20} alt="" />
          </FlexTopDiv>
          <NewLabel size="30px" weight={700} height="39px" color="#FFF" marginBottom="15px">
            25.43%
          </NewLabel>
          <NewLabel size="16px" weight={700} height="21px" color="#FFF" marginBottom="10px">
            Uniswap v3
          </NewLabel>
          <NewLabel size="16px" weight={700} height="21px" color="#FFF" marginBottom="10px">
            752.49%
          </NewLabel>
          <CollaboButton>
            <img src={Collaboration} alt="" />
            Collaboration
          </CollaboButton>
          <img className="collabo-back" src={CollaboBack} alt="" />
        </MobileTop>
        <SwitchModeMobile>
          <TagMobile
            farm={farmView}
            onClick={() => {
              setFarmView(true)
              setDetailsView(false)
            }}
          >
            Farm
          </TagMobile>
          <TagMobile
            details={detailsView}
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
              padding={!isMobile ? '25px' : '15px'}
              display="flex"
              justifyContent="space-between"
              backColor={backColor}
              borderColor={borderColor}
            >
              <div>
                <NewLabel
                  display="flex"
                  weight={700}
                  size="16px"
                  height="21px"
                  marginBottom="30px"
                  align="center"
                >
                  <img className="icon" src={APY} width={20} height={20} alt="" />
                  APY
                  <NewLabel display="flex" self="center">
                    <InfoIcon
                      className="info"
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

              <div>
                <NewLabel weight={700} size="16px" height="21px" marginBottom="30px" display="flex">
                  <img className="icon" src={Daily} width={20} height={20} alt="" />
                  Daily
                  <NewLabel display="flex" self="center">
                    <InfoIcon
                      className="info"
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

              <div>
                <NewLabel
                  weight={700}
                  size="16px"
                  height="21px"
                  marginBottom="30px"
                  display="flex"
                  justifyContent="center"
                >
                  <img className="icon" src={TVL} width={20} height={20} alt="" />
                  TVL
                  <NewLabel display="flex" self="center">
                    <InfoIcon
                      className="info"
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
              <FarmDetailChart token={tokenChart} vaultPool={vaultPoolChart} />
            </HalfInfo>
            <HalfInfo
              padding={!isMobile ? '20px' : '15px 20px'}
              backColor={backColor}
              borderColor={borderColor}
            >
              <NewLabel weight={700} size="16px" height="21px">
                APY Breakdown
              </NewLabel>
              {/* eslint-disable react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: rewardTxt }} />
            </HalfInfo>
            <HalfInfo
              padding={!isMobile ? '24px 22px 44px 22px' : '15px 20px'}
              backColor={backColor}
              borderColor={borderColor}
            >
              <NewLabel weight={700} size="16px" height="21px">
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
                    <img className="icon" src={VaultIcon} alt="" />
                    <NewLabel size="12px" weight={600} height="16px" self="center">
                      Vault Address
                    </NewLabel>
                    <img className="external-link" src={ExternalLink} alt="" />
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
                    <img className="icon" src={StrategyIcon} alt="" />
                    <NewLabel size="12px" weight={600} height="16px" self="center">
                      Strategy Address
                    </NewLabel>
                    <img className="external-link" src={ExternalLink} alt="" />
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
                  <img className="icon" src={VaultIcon} alt="" />
                  <NewLabel size="12px" weight={600} height="16px" self="center">
                    Pool Address
                  </NewLabel>
                  <img className="external-link" src={ExternalLink} alt="" />
                </InfoLabel>
              </FlexDiv>
            </HalfInfo>
          </HalfContent>
          <RestContent show={farmView}>
            <RestPart borderColor={borderColor} backColor={backColor}>
              <SwitchTag borderColor={borderColor}>
                <Tag
                  className="tag1"
                  active1={active1}
                  onClick={() => {
                    setActive1(true)
                    setActive2(false)
                  }}
                >
                  Deposit
                </Tag>
                <Tag
                  className="tag2"
                  filterColor={filterColor}
                  active2={active2}
                  onClick={() => {
                    setActive1(false)
                    setActive2(true)
                  }}
                >
                  Withdraw
                </Tag>
              </SwitchTag>
              <div>
                {isUniV3ManagedVault && (
                  <VaultPanelActions
                    type={PANEL_ACTIONS_TYPE.UNIV3MANAGED}
                    {...viewComponentProps}
                  />
                )}
                <div>
                  {!withdrawMode && multipleAssets ? (
                    multipleAssets.map((symbol, symbolIdx) => {
                      const symbolToDisplay = withdrawMode ? fAssetSymbol : symbol
                      const maxBalanceToDisplay = get(
                        maxAssetsAmountToDisplay.current,
                        symbolIdx,
                        0,
                      )
                      const priceInUsd = get(
                        vaultsData,
                        `[${id}].uniswapV3UnderlyingTokenPrices[${symbolIdx}]`,
                      )

                      return (
                        <BalanceItem key={symbolIdx} borderColor={borderColor}>
                          <DivFlex width="100%" key={symbolToDisplay}>
                            <NumberInput
                              data-tip=""
                              data-for={`input----${symbolToDisplay}`}
                              width="100%"
                              label={`${symbolToDisplay}`}
                              secondaryLabel={`${fromWei(
                                maxBalanceToDisplay,
                                tokens[symbol].decimals,
                              )} ${
                                priceInUsd
                                  ? `($${formatNumber(
                                      new BigNumber(
                                        fromWei(maxBalanceToDisplay, tokens[symbol].decimals),
                                      ).multipliedBy(priceInUsd),
                                      9,
                                    )})`
                                  : ''
                              }`}
                              onChange={e => {
                                const newAmountsToExecute = amountsToExecute.slice()
                                newAmountsToExecute[symbolIdx] = e.target.value

                                setAmountsToExecute(newAmountsToExecute)

                                if (
                                  fAssetPool &&
                                  new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id)
                                ) {
                                  setUniV3AssetRatio(symbolIdx, newAmountsToExecute)
                                }
                              }}
                              value={amountsToExecute[symbolIdx]}
                              disabled={
                                !hasRequirementsForInteraction(
                                  true,
                                  null,
                                  vaultsData,
                                  loadingLpStats || loadingFarmingBalance,
                                ) ||
                                !hasValidAmountForInputAndMaxButton(
                                  get(balances, symbol, 0),
                                  null,
                                  null,
                                  symbol,
                                )
                              }
                              onClick={() => {
                                const newAmountsToExecute = amountsToExecute.slice()
                                newAmountsToExecute[symbolIdx] = fromWei(
                                  get(balances, symbol, 0),
                                  tokens[symbol].decimals,
                                )
                                setAmountsToExecute(newAmountsToExecute)

                                if (
                                  fAssetPool &&
                                  new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id)
                                ) {
                                  setUniV3AssetRatio(symbolIdx, newAmountsToExecute)
                                }
                              }}
                              invalidAmount={
                                new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id) &&
                                !hasAmountLessThanOrEqualTo(
                                  amountsToExecute[symbolIdx],
                                  fromWei(get(balances, symbol, 0), tokens[symbol].decimals),
                                )
                              }
                              placeholder="0"
                            />
                          </DivFlex>
                        </BalanceItem>
                      )
                    })
                  ) : (
                    <BalanceItem borderColor={borderColor}>
                      {token.logoUrl.map((el, i) => (
                        <NumberInput
                          width="100%"
                          key={i}
                          label={`${
                            withdrawMode
                              ? fAssetPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
                                useIFARM
                                ? 'iFARM'
                                : fAssetSymbol
                              : id
                          }`}
                          secondaryLabel={`${get(maxAssetsAmountToDisplay.current, '[0]', '-')}`}
                          logo={`${el.slice(1, el.length)}`}
                          onChange={e => setAmountsToExecute([e.target.value])}
                          value={amountsToExecute[0]}
                          disabled={
                            !hasRequirementsForInteraction(
                              true,
                              null,
                              vaultsData,
                              loadingLpStats || loadingFarmingBalance,
                            ) ||
                            !hasValidAmountForInputAndMaxButton(
                              userBalance,
                              lpTokenBalance,
                              totalStaked,
                              id,
                              withdrawMode,
                              isSpecialVault,
                              iFARMBalance,
                              useIFARM,
                            )
                          }
                          onClick={() => {
                            let amount
                            if (!withdrawMode) {
                              amount = fromWei(
                                isSpecialVault ? lpTokenBalance : userBalance,
                                tokenDecimals,
                              )
                            } else if (isSpecialVault) {
                              amount = fromWei(useIFARM ? iFARMBalance : totalStaked, tokenDecimals)
                            } else {
                              amount = fromWei(
                                autoUnStake ? totalBalanceToWithdraw : lpTokenBalance,
                                tokenDecimals,
                              )
                            }

                            setAmountsToExecute([amount])
                          }}
                          placeholder="0"
                        />
                      ))}
                    </BalanceItem>
                  )}
                  <VaultPanelActions type={PANEL_ACTIONS_TYPE.HEAD} {...viewComponentProps} />
                </div>
                {multipleAssets &&
                !withdrawMode &&
                tokens[id].migrationInfo &&
                new BigNumber(oldLpTokenBalance).gt(0) ? (
                  <BalanceItem borderColor={borderColor}>
                    <DivFlex width="100%">
                      <MigrationLabel>Migrate liquidity from Uniswap V2</MigrationLabel>
                      <NumberInput
                        data-tip=""
                        data-for="input-migrate"
                        width="100%"
                        label={`Balance <b>${tokens[id].migrationInfo.lpTokenName}</b>`}
                        secondaryLabel={`${oldLpTokenBalance} ${
                          get(vaultsData, `[${id}].usdPrice`)
                            ? `($${formatNumber(
                                new BigNumber(oldLpTokenBalance).multipliedBy(
                                  get(vaultsData, `[${id}].usdPrice`),
                                ),
                                9,
                              )})`
                            : ''
                        }`}
                        onChange={e => {
                          setOldAmountToExecute(e.target.value)
                        }}
                        value={oldAmountToExecute}
                        disabled={
                          !hasRequirementsForInteraction(
                            loaded,
                            pendingAction,
                            vaultsData,
                            loadingLpStats || loadingFarmingBalance,
                          ) ||
                          !hasValidAmountForInputAndMaxButton(oldLpTokenBalance, null, null, id)
                        }
                        placeholder="0"
                        onClick={() => setOldAmountToExecute(oldLpTokenBalance)}
                      />
                    </DivFlex>
                    <VaultPanelActions
                      type={PANEL_ACTIONS_TYPE.MIGRATE}
                      migrationInfo={token.migrationInfo}
                      lpAmount={toWei(oldAmountToExecute, 18)}
                      {...viewComponentProps}
                    />
                  </BalanceItem>
                ) : null}
                <VaultPanelActions {...viewComponentProps} />
              </div>
            </RestPart>
            <RewardPart borderColor={borderColor} backColor={backColor}>
              <VaultPanelActionsFooter {...viewComponentProps} />
            </RewardPart>
          </RestContent>
        </BigDiv>
      </Inner>
    </DetailView>
  )
}

export default FarmDetail
