import { BigNumber } from 'bignumber.js'
import { useWindowWidth } from '@react-hook/window-size'
import useEffectWithPrevious from 'use-effect-with-previous'
import ReactTooltip from 'react-tooltip'
import CoinGecko from 'coingecko-api'
import { find, get, isEmpty, orderBy, isEqual } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Safe from '../../assets/images/logos/dashboard/safe.svg'
import Coin1 from '../../assets/images/logos/dashboard/coins-stacked-02.svg'
import Coin2 from '../../assets/images/logos/dashboard/coins-stacked-04.svg'
import Diamond from '../../assets/images/logos/dashboard/diamond-01.svg'
import Sort from '../../assets/images/logos/dashboard/sort.svg'
import File from '../../assets/images/logos/dashboard/file-02.svg'
import Info from '../../assets/images/logos/earn/info.svg'
import ListItem from '../../components/DashboardComponents/ListItem'
import TotalValue from '../../components/TotalValue'
import {
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  POOL_BALANCES_DECIMALS,
  SPECIAL_VAULTS,
  directDetailUrl,
} from '../../constants'
import { addresses } from '../../data'
import { CHAIN_IDS } from '../../data/constants'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { fromWei } from '../../services/web3'
import {
  formatNumber,
  formatNumberWido,
  ceil10,
  getTotalApy,
  isLedgerLive,
  convertAmountToFARM,
  getUserVaultBalance,
} from '../../utils'
import {
  BadgeIcon,
  Column,
  Container,
  Content,
  DetailView,
  EmptyInfo,
  EmptyPanel,
  ExploreFarm,
  FlexDiv,
  Header,
  Inner,
  SubPart,
  // ThemeMode,
  TransactionDetails,
  LogoImg,
  Img,
  Col,
  ContentInner,
  TableContent,
  DescInfo,
  InfoIcon,
  NewLabel,
} from './style'

const getChainIcon = chain => {
  let chainLogo = ETHEREUM
  switch (chain) {
    case CHAIN_IDS.POLYGON_MAINNET:
      chainLogo = POLYGON
      break
    case CHAIN_IDS.ARBITRUM_ONE:
      chainLogo = ARBITRUM
      break
    case CHAIN_IDS.BASE:
      chainLogo = BASE
      break
    default:
      chainLogo = ETHEREUM
      break
  }
  return chainLogo
}

const chainList = isLedgerLive()
  ? [
      { id: 1, name: 'Ethereum', chainId: 1 },
      { id: 2, name: 'Polygon', chainId: 137 },
    ]
  : [
      { id: 1, name: 'Ethereum', chainId: 1 },
      { id: 2, name: 'Polygon', chainId: 137 },
      { id: 3, name: 'Arbitrum', chainId: 42161 },
    ]

const CoinGeckoClient = new CoinGecko()
const getCoinListFromApi = async () => {
  let data = []
  try {
    data = await CoinGeckoClient.coins.list()
    return data
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
    return []
  }
}
const getTokenPriceFromApi = async tokenID => {
  try {
    const data = await CoinGeckoClient.simple.price({
      ids: tokenID,
      // eslint-disable-next-line camelcase
      vs_currencies: 'usd',
    })
    return data.data[tokenID].usd
  } catch (err) {
    console.log('Fetch Chart Data error: ', err)
    return null
  }
}

const Portfolio = () => {
  const { push } = useHistory()
  const { connected, balances, account, getWalletBalances } = useWallet()
  const { userStats, fetchUserPoolStats, totalPools } = usePools()
  const { profitShareAPY } = useStats()
  const { vaultsData, loadingVaults, farmingBalances, getFarmingBalances } = useVaults()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  /* eslint-enable global-require */
  const {
    // darkMode,
    switchMode,
    pageBackColor,
    backColor,
    fontColor,
    borderColor,
    totalValueFontColor,
    filterColor,
  } = useThemeContext()

  const [apiData, setApiData] = useState([])

  useEffect(() => {
    const getCoinList = async () => {
      const data = await getCoinListFromApi()
      setApiData(data)
    }

    getCoinList()
  }, [])

  const farmProfitSharingPool = totalPools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmWethPool = totalPools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = totalPools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)
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

  const [farmTokenList, setFarmTokenList] = useState([])
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [totalYieldDaily, setTotalYieldDaily] = useState(0)
  const [totalYieldMonthly, setTotalYieldMonthly] = useState(0)

  const [depositToken, setDepositToken] = useState([])

  const [sortOrder, setSortOrder] = useState(false)
  const [showDetail, setShowDetail] = useState(Array(farmTokenList.length).fill(false))
  // get window width
  const onlyWidth = useWindowWidth()
  const ceilWidth = ceil10(onlyWidth, onlyWidth.toString().length - 1)

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
    }
  }, [connected])

  useEffect(() => {
    if (account && !isEmpty(userStats) && !isEmpty(depositToken)) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = []
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < depositToken.length; i += 1) {
          let fAssetPool =
            depositToken[i] === FARM_TOKEN_SYMBOL
              ? groupOfVaults[depositToken[i]].data
              : find(totalPools, pool => pool.id === depositToken[i])

          const token = find(
            groupOfVaults,
            vault =>
              vault.vaultAddress === fAssetPool.collateralAddress ||
              (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress),
          )
          if (token) {
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if (isSpecialVault) {
              fAssetPool = token.data
            }
            poolsToLoad.push(fAssetPool)
          }
        }
        await fetchUserPoolStats(poolsToLoad, account, userStats)
        await getFarmingBalances(depositToken)
        /* eslint-enable no-await-in-loop */
      }
      loadUserPoolsStats()
    }
  }, [account, totalPools, depositToken]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEmpty(userStats) && account) {
      const getFarmTokenInfo = async () => {
        const stakedVaults = Object.keys(userStats).filter(
          poolId =>
            new BigNumber(userStats[poolId].totalStaked).gt(0) ||
            new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
            (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
              new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
        )

        const symbols = []
        for (let j = 0; j < stakedVaults.length; j += 1) {
          let symbol = ''
          if (stakedVaults[j] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          } else {
            symbol = stakedVaults[j]
          }
          symbols.push(symbol)
        }
        if (depositToken.length !== symbols.length) {
          setDepositToken(symbols)
        }

        const newStats = []
        let totalStake = 0,
          valueRewards = 0,
          totalDailyYield = 0,
          totalMonthlyYield = 0
        for (let i = 0; i < stakedVaults.length; i += 1) {
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
          let symbol = ''
          if (stakedVaults[i] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          } else {
            symbol = stakedVaults[i]
          }
          // eslint-disable-next-line one-var
          let fAssetPool =
            symbol === FARM_TOKEN_SYMBOL
              ? groupOfVaults[symbol].data
              : find(totalPools, pool => pool.id === symbol)

          const token = find(
            groupOfVaults,
            vault =>
              vault.vaultAddress === fAssetPool.collateralAddress ||
              (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress),
          )
          if (token) {
            const useIFARM = symbol === FARM_TOKEN_SYMBOL
            let tokenName = '',
              totalRewardAPRByPercent = 0
            for (let k = 0; k < token.tokenNames.length; k += 1) {
              tokenName += token.tokenNames[k]
              if (k !== token.tokenNames.length - 1) {
                tokenName += ', '
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
            // eslint-disable-next-line one-var
            let usdPrice = 1
            if (token) {
              usdPrice =
                (symbol === FARM_TOKEN_SYMBOL
                  ? token.data.lpTokenData && token.data.lpTokenData.price
                  : token.vaultPrice) || 1
            }
            const unstake = fromWei(
              get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
              POOL_BALANCES_DECIMALS,
            )
            stats.unstake = unstake
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(stats.unstake)) {
              stats.unstake = 0
            }
            const stakeTemp = get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0)
            // eslint-disable-next-line one-var
            let farmBalance = 0
            if (useIFARM) {
              const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
              farmBalance = convertAmountToFARM(
                IFARM_TOKEN_SYMBOL,
                iFARMBalance,
                tokens[FARM_TOKEN_SYMBOL].decimals,
                vaultsData,
              )
            }
            const finalStake = getUserVaultBalance(symbol, farmingBalances, stakeTemp, farmBalance)
            const stake = fromWei(
              useIFARM ? finalStake : stakeTemp,
              token.decimals || token.data.watchAsset.decimals,
              4,
            )

            stats.stake = stake
            const finalBalance = Number(stake) + Number(unstake)
            stats.balance = finalBalance * usdPrice
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(stats.stake)) {
              stats.stake = 0
            }
            // eslint-disable-next-line no-restricted-globals
            const totalStk = parseFloat((isNaN(Number(stake)) ? 0 : stake) * usdPrice)
            // eslint-disable-next-line no-restricted-globals
            const totalUnsk = parseFloat((isNaN(Number(unstake)) ? 0 : unstake) * usdPrice)
            totalStake += totalStk + totalUnsk
            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])
            for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
              // eslint-disable-next-line one-var
              let rewardSymbol = rewardTokenSymbols[l].toUpperCase(),
                rewards

              if (rewardTokenSymbols.includes(FARM_TOKEN_SYMBOL)) {
                rewardSymbol = FARM_TOKEN_SYMBOL
              }

              const rewardToken = groupOfVaults[rewardSymbol]
              // eslint-disable-next-line one-var
              let usdRewardPrice = 0,
                rewardDecimal = 18

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
                usdRewardPrice =
                  (rewardSymbol === FARM_TOKEN_SYMBOL
                    ? rewardToken.data.lpTokenData && rewardToken.data.lpTokenData.price
                    : rewardToken.usdPrice) || 0

                rewardDecimal =
                  rewardToken.decimals ||
                  (rewardToken.data &&
                    rewardToken.data.lpTokenData &&
                    rewardToken.data.lpTokenData.decimals)
              } else {
                const fetchData = async () => {
                  try {
                    for (let ids = 0; ids < apiData.data.length; ids += 1) {
                      const tempData = apiData.data[ids]
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

              // eslint-disable-next-line one-var
              const rewardValues = rewards === undefined ? 0 : fromWei(rewards, rewardDecimal)
              stats.reward.push(Number(rewardValues).toFixed(POOL_BALANCES_DECIMALS))

              stats.totalRewardUsd += Number(
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal) * usdRewardPrice,
              )
              valueRewards += Number(
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal) * usdRewardPrice,
              )
              stats.rewardSymbol.push(rewardSymbol)

              const rewardPriceUSD =
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal) * usdRewardPrice
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
              : getTotalApy(vaultPool, tokenVault)

            const showAPY = isSpecialVault
              ? token.data &&
                token.data.loaded &&
                (token.data.dataFetched === false || totalApy !== null)
                ? token.inactive
                  ? 'Inactive'
                  : totalApy || null
                : '-'
              : vaultPool.loaded && totalApy !== null && !loadingVaults
              ? token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched
                ? token.inactive || token.testInactive
                  ? 'Inactive'
                  : null
                : totalApy
              : '-'
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

            for (let j = 0; j < fAssetPool.rewardAPR.length; j += 1) {
              totalRewardAPRByPercent += Number(fAssetPool.rewardAPR[j])
            }
            const totalRewardAPR = totalRewardAPRByPercent / 100
            const poolAPRDaily = totalRewardAPR / 365
            const poolAPRMonthly = totalRewardAPR / 12

            const swapFeeAPRYearly = fAssetPool.tradingApy / 100
            const swapFeeAPRDaily = swapFeeAPRYearly / 365
            const swapFeeAPRMonthly = swapFeeAPRYearly / 12

            const dailyYield =
              Number(stake) * usdPrice * (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily) +
              Number(unstake) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
            const monthlyYield =
              Number(stake) * usdPrice * (vaultAPRMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
              Number(unstake) * usdPrice * (vaultAPRMonthly + swapFeeAPRMonthly)

            stats.dailyYield = dailyYield
            stats.monthlyYield = monthlyYield

            totalDailyYield += dailyYield
            totalMonthlyYield += monthlyYield
            newStats.push(stats)
          }
        }
        setTotalDeposit(formatNumber(totalStake, 2))
        setTotalRewards(formatNumber(valueRewards, 2))
        setTotalYieldDaily(formatNumber(totalDailyYield, 2))
        setTotalYieldMonthly(formatNumber(totalMonthlyYield, 2))
        const sortedTokenList = orderBy(newStats, ['balance'], ['desc'])
        setFarmTokenList(sortedTokenList)
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances, farmingBalances]) // eslint-disable-line react-hooks/exhaustive-deps

  const sortCol = field => {
    const tokenList = orderBy(farmTokenList, [field], [sortOrder ? 'asc' : 'desc'])
    setFarmTokenList(tokenList)
    setSortOrder(!sortOrder)
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <SubPart>
          <TotalValue
            icon={Safe}
            content="Total Balance"
            price={totalDeposit}
            toolTipTitle="tt-total-balance"
            toolTip="Sum of your wallet’s staked and unstaked tokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
          <TotalValue
            icon={Coin1}
            content="Est. Monthly Yield"
            price={totalYieldMonthly}
            toolTipTitle="tt-monthly-yield"
            toolTip="Estimated monthly earnings on all your deposits, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
          <TotalValue
            icon={Coin2}
            content="Est. Daily Yield"
            price={totalYieldDaily}
            toolTipTitle="tt-daily-yield"
            toolTip="Estimated daily earnings on all your deposits, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
          <TotalValue
            icon={Diamond}
            content="Rewards"
            price={totalRewards}
            toolTipTitle="tt-rewards"
            toolTip="Accrued rewards on all your staked deposits, denominated in USD.  Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
        </SubPart>

        <DescInfo>Track your funds across farms and know how much yield you earn.</DescInfo>

        <TransactionDetails backColor={backColor}>
          <TableContent count={farmTokenList.length}>
            <Header borderColor={borderColor} backColor={backColor} width={ceilWidth}>
              <Column width={isMobile ? '23%' : '40%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('symbol')
                  }}
                >
                  Farm
                </Col>
              </Column>
              <Column width={isMobile ? '12%' : '11%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('apy')
                  }}
                >
                  APY
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '11%'}>
                <Col
                  onClick={() => {
                    sortCol('monthlyYield')
                  }}
                >
                  Monthly Yield
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '11%'}>
                <Col
                  onClick={() => {
                    sortCol('dailyYield')
                  }}
                >
                  Daily Yield
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '11%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('balance')
                  }}
                >
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
                      Sum of staked and unstaked tokens of a specific farm, denominated in USD. Note
                      that displayed amounts are subject to change due to the live pricing of
                      underlying tokens.
                    </NewLabel>
                  </ReactTooltip>
                  My Balance
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '11%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('totalRewardUsd')
                  }}
                >
                  Rewards
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '5%'} color={totalValueFontColor}>
                <Col />
              </Column>
            </Header>
            {connected || farmTokenList.length > 0 ? (
              <>
                {farmTokenList.map((el, i) => {
                  const info = farmTokenList[i]
                  return (
                    <DetailView
                      lastElement={i === farmTokenList.length - 1 ? 'yes' : 'no'}
                      key={i}
                      mode={switchMode}
                      width={ceilWidth}
                      background={showDetail[i] ? 'rgba(234, 241, 255, 0.53)' : 'unset'}
                      onClick={() => {
                        let badgeId = -1
                        const token = info.token
                        const chain = token.chain || token.data.chain
                        chainList.forEach((obj, j) => {
                          if (obj.chainId === Number(chain)) {
                            badgeId = j
                          }
                        })
                        const isSpecialVault = token.liquidityPoolVault || token.poolVault
                        const network = chainList[badgeId].name.toLowerCase()
                        const address = isSpecialVault
                          ? token.data.collateralAddress
                          : token.vaultAddress || token.tokenAddress
                        push(
                          `${`${directDetailUrl}advanced`}${
                            directDetailUrl + network
                          }/${address}?from=portfolio`,
                        )
                      }}
                    >
                      <FlexDiv padding={isMobile ? '15px' : '0'}>
                        <Content
                          width={isMobile ? '23%' : '40%'}
                          display={isMobile ? 'block' : 'flex'}
                        >
                          <ContentInner width="50%" display="flex">
                            <BadgeIcon
                              borderColor={info.status === 'Active' ? '#29ce84' : 'orange'}
                            >
                              <img src={info.chain} width="15px" height="15px" alt="" />
                            </BadgeIcon>
                            {info.logos.length > 0 &&
                              info.logos.map((elem, index) => (
                                <LogoImg
                                  key={index}
                                  className="coin"
                                  width={isMobile ? 30 : 37}
                                  src={elem}
                                  alt=""
                                />
                              ))}
                          </ContentInner>
                          <ContentInner width="50%" marginLeft={isMobile ? '0px' : '11px'}>
                            <ListItem
                              weight={600}
                              size={isMobile ? 12 : 14}
                              height={isMobile ? 16 : 20}
                              value={info.symbol}
                              marginBottom={isMobile ? 10 : 0}
                              color="#101828"
                            />
                            <ListItem
                              weight={500}
                              size={isMobile ? 10 : 14}
                              height={isMobile ? 13 : 20}
                              value={info.platform}
                              color="#475467"
                            />
                          </ContentInner>
                        </Content>
                        <Content width={isMobile ? '12%' : '11%'}>
                          <ListItem
                            color="#101828"
                            weight={500}
                            size={14}
                            height={20}
                            value={
                              info.apy === -1
                                ? 'Inactive'
                                : Number.isNaN(info.apy)
                                ? '-'
                                : `${formatNumberWido(info.apy, 2)}%`
                            }
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem
                            weight={500}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`${
                              info.monthlyYield < 0.01
                                ? '<$0.01'
                                : `$ ${formatNumber(info.monthlyYield, 4)}`
                            }`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem
                            weight={500}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`${
                              info.dailyYield < 0.01
                                ? '<$0.01'
                                : `$ ${formatNumber(info.dailyYield, 4)}`
                            }`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem
                            weight={500}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`${
                              info.balance < 0.01 ? '<$0.01' : `$ ${formatNumber(info.balance, 2)}`
                            }`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem
                            weight={500}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`${
                              info.totalRewardUsd < 0.01
                                ? '<$0.01'
                                : `$ ${formatNumberWido(info.totalRewardUsd, 6)}`
                            }`}
                          />
                        </Content>
                        <Content
                          onClick={event => {
                            event.stopPropagation()
                            const updatedShowDetail = [...showDetail]
                            updatedShowDetail[i] = !updatedShowDetail[i]
                            setShowDetail(updatedShowDetail)
                          }}
                          width={isMobile ? '20%' : '5%'}
                          cursor="pointer"
                        >
                          {showDetail[i] ? (
                            <img src={File} className="active-file-icon" alt="file" />
                          ) : (
                            <img src={File} className="file-icon" alt="file" />
                          )}
                        </Content>
                      </FlexDiv>
                      {showDetail[i] && (
                        <FlexDiv padding={isMobile ? '15px' : '16px 0'}>
                          <Content
                            width={isMobile ? '23%' : '40%'}
                            display={isMobile ? 'block' : 'flex'}
                          >
                            <ContentInner width="50%">
                              <ListItem
                                weight={600}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 16 : 20}
                                value="Unstaked"
                                marginBottom={isMobile ? 10 : 0}
                                color="#101828"
                              />
                              <ListItem
                                weight={500}
                                size={isMobile ? 10 : 14}
                                height={isMobile ? 13 : 20}
                                value={`${formatNumberWido(info.unstake, 9)}`}
                                color="#475467"
                              />
                            </ContentInner>
                            <ContentInner width="50%" marginLeft={isMobile ? '0px' : '11px'}>
                              <ListItem
                                weight={600}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 16 : 20}
                                value="Staked"
                                marginBottom={isMobile ? 10 : 0}
                                color="#101828"
                              />
                              <ListItem
                                weight={500}
                                size={isMobile ? 10 : 14}
                                height={isMobile ? 13 : 20}
                                value={`${formatNumberWido(info.stake, 9)}`}
                                color="#475467"
                              />
                            </ContentInner>
                          </Content>
                          <Content width={isMobile ? '12%' : '11%'}>
                            <ListItem
                              weight={600}
                              size={isMobile ? 12 : 14}
                              height={isMobile ? 16 : 20}
                              value="Rewards"
                              marginBottom={isMobile ? 10 : 0}
                              color="#101828"
                            />
                            <ListItem
                              weight={600}
                              size={isMobile ? 12 : 14}
                              height={isMobile ? 16 : 20}
                              value="Breakdown"
                              marginBottom={isMobile ? 10 : 0}
                              color="#101828"
                            />
                          </Content>
                          {info.reward.map((rw, key) => (
                            <Content key={key} width={isMobile ? '20%' : '11%'} display="flex">
                              <Img
                                src={`/icons/${info.rewardSymbol[key].toLowerCase()}.svg`}
                                alt="jeur"
                              />
                              <div>
                                <ListItem
                                  weight={500}
                                  size={isMobile ? 10 : 14}
                                  height={isMobile ? 13 : 20}
                                  value={`${formatNumberWido(info.reward[key], 5)}`}
                                  color="#475467"
                                />
                                <ListItem
                                  weight={500}
                                  size={isMobile ? 10 : 14}
                                  height={isMobile ? 13 : 20}
                                  value={`${
                                    info.rewardUSD[key] < 0.01
                                      ? '<$0.01'
                                      : `$ ${formatNumberWido(info.rewardUSD[key], 2)}`
                                  }`}
                                  color="#101828"
                                />
                              </div>
                            </Content>
                          ))}
                          <Content width={isMobile ? '20%' : '5%'} />
                        </FlexDiv>
                      )}
                    </DetailView>
                  )
                })}
              </>
            ) : (
              <>
                <EmptyPanel>
                  <EmptyInfo weight={600} size={16} height={24} color="#101828">
                    Looks like you’re not farming anywhere.
                  </EmptyInfo>
                  <EmptyInfo weight={400} size={14} height={20} color="#475467" marginTop="4px">
                    Let’s put your assets to work!
                  </EmptyInfo>

                  <EmptyInfo weight={500} size={16} height={21} marginTop="25px">
                    <ExploreFarm
                      borderColor={borderColor}
                      onClick={() => {
                        push('/ADVANCED')
                      }}
                    >
                      View all Farms
                    </ExploreFarm>
                  </EmptyInfo>
                </EmptyPanel>
              </>
            )}
          </TableContent>
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

export default Portfolio
