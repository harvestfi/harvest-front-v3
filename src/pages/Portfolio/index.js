import { BigNumber } from 'bignumber.js'
import useEffectWithPrevious from 'use-effect-with-previous'
import axios from 'axios'
import { find, get, isEmpty, orderBy, isEqual, isNaN } from 'lodash'
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
import MobileFile from '../../assets/images/logos/dashboard/file-01.svg'
import ListItem from '../../components/DashboardComponents/ListItem'
import TotalValue from '../../components/TotalValue'
import {
  COINGECKO_API_KEY,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  MAX_DECIMALS,
  ROUTES,
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
  parseValue,
  formatNumber,
  formatNumberWido,
  // ceil10,
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
  MobileSubPart,
  MobileDiv,
  DescInfo,
  // ThemeMode,
  TransactionDetails,
  LogoImg,
  Img,
  Col,
  ContentInner,
  TableContent,
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
      { id: 4, name: 'Base', chainId: 8453 },
    ]

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

const Portfolio = () => {
  const { push } = useHistory()
  const { connected, account, balances, getWalletBalances } = useWallet()
  const { userStats, fetchUserPoolStats, totalPools } = usePools()
  const { profitShareAPY } = useStats()
  const { vaultsData, loadingVaults, farmingBalances, getFarmingBalances } = useVaults()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  const {
    // darkMode,
    switchMode,
    pageBackColor,
    backColor,
    fontColor,
    borderColor,
    totalValueFontColor,
  } = useThemeContext()

  const handleNetworkChange = () => {
    window.location.reload() // Reload the page when the network changes
  }

  useEffect(() => {
    // Listen for network changes
    window.ethereum.on('chainChanged', handleNetworkChange)

    return () => {
      // Cleanup: Remove the event listener when the component unmounts
      window.ethereum.removeListener('chainChanged', handleNetworkChange)
    }
  }, [])

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

        const symbols = stakedVaults.map(poolId =>
          poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID ? FARM_TOKEN_SYMBOL : poolId,
        )

        if (depositToken.length !== symbols.length) {
          setDepositToken(symbols)
        }

        const newStats = []
        let totalBalanceUSD = 0,
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
              totalRewardAPRByPercent = 0,
              farmBalance = 0
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
              MAX_DECIMALS,
            )
            stats.unstake = unstake
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(stats.unstake)) {
              stats.unstake = 0
            }
            const stakeTemp = get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0)
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
              MAX_DECIMALS,
            )

            stats.stake = stake
            const finalBalance = Number(stake) + Number(unstake)
            stats.balance = finalBalance * usdPrice
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(stats.stake)) {
              stats.stake = 0
            }
            // eslint-disable-next-line no-restricted-globals
            const totalStk = parseFloat((isNaN(Number(stake)) ? 0 : parseValue(stake)) * usdPrice)
            // eslint-disable-next-line no-restricted-globals
            const totalUnsk = parseFloat(
              (isNaN(Number(unstake)) ? 0 : parseValue(unstake)) * usdPrice,
            )
            totalBalanceUSD += totalStk + totalUnsk
            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])
            const tempPricePerFullShare = useIFARM
              ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
              : get(token, `pricePerFullShare`, 0)
            const pricePerFullShare = fromWei(
              tempPricePerFullShare,
              useIFARM ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.decimals`, 0) : token.decimals,
            )

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
                rewardDecimal = get(tokens[symbol], 'decimals', 18)

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
              } else if (rewardTokenSymbols[l].substring(0, 1) === 'f') {
                let underlyingRewardSymbol
                if (rewardTokenSymbols[l].substring(0, 2) === 'fx') {
                  underlyingRewardSymbol = rewardTokenSymbols[l].substring(2)
                } else {
                  underlyingRewardSymbol = rewardTokenSymbols[l].substring(1)
                }
                try {
                  // const id = getTokenIdBySymbolInApiData(underlyingRewardSymbol, apiData)
                  // await getTokenPriceFromApi(id)
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
                      console.log(`${rewardSymbol} - USD Price: ${usdRewardPrice}`)
                      break
                    }
                  }
                } catch (error) {
                  console.error('Error:', error)
                }
              }
              const rewardValues =
                rewards === undefined
                  ? 0
                  : fromWei(Number(rewards), Number(rewardDecimal), MAX_DECIMALS, true)
              stats.reward.push(Number(rewardValues))
              stats.totalRewardUsd += Number(rewardValues * Number(usdRewardPrice))
              valueRewards += Number(rewardValues * Number(usdRewardPrice))
              stats.rewardSymbol.push(rewardSymbol)

              const rewardPriceUSD = rewardValues * Number(usdRewardPrice)
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

            const swapFeeAPRYearly = Number(fAssetPool.tradingApy) / 100
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

        setTotalDeposit(formatNumber(totalBalanceUSD, 2))
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
            toolTip="Sum of your wallet's staked and unstaked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
          <TotalValue
            icon={Coin1}
            content="Est. Monthly Yield"
            price={totalYieldMonthly}
            toolTipTitle="tt-monthly-yield"
            toolTip="Estimated monthly yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
          <TotalValue
            icon={Coin2}
            content="Est. Daily Yield"
            price={totalYieldDaily}
            toolTipTitle="tt-daily-yield"
            toolTip="Estimated daily yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
          <TotalValue
            icon={Diamond}
            content="Rewards"
            price={totalRewards}
            toolTipTitle="tt-rewards"
            toolTip="Accrued rewards on all your staked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
          />
        </SubPart>

        <MobileSubPart>
          <MobileDiv>
            <TotalValue
              icon={Safe}
              content="Total Balance"
              price={totalDeposit}
              toolTipTitle="tt-total-balance"
              toolTip="Sum of your wallet's staked and unstaked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
            />
            <TotalValue
              icon={Diamond}
              content="Rewards"
              price={totalRewards}
              toolTipTitle="tt-rewards"
              toolTip="Accrued rewards on all your staked fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
            />
          </MobileDiv>
          <MobileDiv>
            <TotalValue
              icon={Coin1}
              content="Est. Monthly Yield"
              price={totalYieldMonthly}
              toolTipTitle="tt-monthly-yield"
              toolTip="Estimated monthly yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
            />
            <TotalValue
              icon={Coin2}
              content="Est. Daily Yield"
              price={totalYieldDaily}
              toolTipTitle="tt-daily-yield"
              toolTip="Estimated daily yield on all your fTokens, denominated in USD. Note that displayed amounts are subject to change due to the live pricing of underlying tokens."
            />
          </MobileDiv>
        </MobileSubPart>

        <DescInfo borderColor={borderColor}>
          Preview farms with your active deposits below.
        </DescInfo>

        <TransactionDetails backColor={backColor}>
          <TableContent count={farmTokenList.length}>
            <Header borderColor={borderColor} backColor={backColor}>
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
              <Column width={isMobile ? '20%' : '11%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('balance')
                  }}
                >
                  My Balance
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
                      borderColor={borderColor}
                      key={i}
                      mode={switchMode}
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
                      <FlexDiv padding={isMobile ? '10px' : '0'}>
                        <Content
                          width={isMobile ? '100%' : '40%'}
                          display={isMobile ? 'block' : 'flex'}
                        >
                          <ContentInner
                            width={isMobile ? '100%' : '50%'}
                            display={isMobile ? 'block' : 'flex'}
                          >
                            <BadgeIcon
                              borderColor={info.status === 'Active' ? '#29ce84' : 'orange'}
                              className="network-badge"
                            >
                              <img src={info.chain} width="15px" height="15px" alt="" />
                            </BadgeIcon>
                            {info.logos.length > 0 &&
                              info.logos.map((elem, index) => (
                                <LogoImg
                                  key={index}
                                  className="coin"
                                  marginLeft={index === 0 ? '' : '-7px'}
                                  src={elem}
                                  alt=""
                                />
                              ))}
                          </ContentInner>
                          <ContentInner
                            width={isMobile ? '100%' : '50%'}
                            marginLeft={isMobile ? '0px' : '11px'}
                          >
                            <ListItem
                              weight={600}
                              size={isMobile ? 14 : 14}
                              height={isMobile ? 20 : 20}
                              value={info.symbol}
                              marginTop={isMobile ? 15 : 0}
                              color="#101828"
                            />
                            <ListItem
                              weight={500}
                              size={isMobile ? 14 : 14}
                              height={isMobile ? 20 : 20}
                              value={info.platform}
                              color="#475467"
                            />
                          </ContentInner>
                        </Content>
                        <Content
                          width={isMobile ? '33%' : '11%'}
                          marginTop={isMobile ? '15px' : 'unset'}
                        >
                          {isMobile && (
                            <ListItem
                              color="#475467"
                              weight={500}
                              size={12}
                              height={18}
                              value="APY"
                            />
                          )}
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
                        {isMobile && (
                          <>
                            <Content
                              width={isMobile ? '33%' : '11%'}
                              marginTop={isMobile ? '15px' : 'unset'}
                            >
                              <ListItem
                                color="#475467"
                                weight={500}
                                size={12}
                                height={18}
                                value="My Balance"
                              />
                              <ListItem
                                weight={500}
                                size={14}
                                height={20}
                                color="#101828"
                                value={`${
                                  info.balance === 0
                                    ? '$0.00'
                                    : info.balance < 0.01
                                    ? '<$0.01'
                                    : `$${formatNumber(info.balance, 2)}`
                                }`}
                              />
                            </Content>
                            <Content
                              width={isMobile ? '33%' : '11%'}
                              marginTop={isMobile ? '15px' : 'unset'}
                            >
                              <ListItem
                                color="#475467"
                                weight={500}
                                size={12}
                                height={18}
                                value="Rewards"
                              />
                              <ListItem
                                weight={500}
                                size={14}
                                height={20}
                                color="#101828"
                                value={`${
                                  info.totalRewardUsd === 0
                                    ? '$0.00'
                                    : info.totalRewardUsd < 0.01
                                    ? '<$0.01'
                                    : `$${formatNumberWido(info.totalRewardUsd, 2)}`
                                }`}
                              />
                            </Content>
                          </>
                        )}
                        {!isMobile && (
                          <Content width={isMobile ? '33%' : '11%'}>
                            <ListItem
                              weight={500}
                              size={14}
                              height={20}
                              color="#101828"
                              value={`${
                                info.balance === 0
                                  ? '$0.00'
                                  : info.balance < 0.01
                                  ? '<$0.01'
                                  : `$${formatNumber(info.balance, 2)}`
                              }`}
                            />
                          </Content>
                        )}
                        <Content
                          width={isMobile ? '33%' : '11%'}
                          marginTop={isMobile ? '15px' : 'unset'}
                        >
                          {isMobile && (
                            <ListItem
                              color="#475467"
                              weight={500}
                              size={12}
                              height={18}
                              value="Monthly Yield"
                            />
                          )}
                          <ListItem
                            weight={500}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`${
                              info.monthlyYield === 0
                                ? '$0.00'
                                : info.monthlyYield < 0.01
                                ? '<$0.01'
                                : `$${formatNumber(info.monthlyYield, 2)}`
                            }`}
                          />
                        </Content>
                        <Content
                          width={isMobile ? '33%' : '11%'}
                          marginTop={isMobile ? '15px' : 'unset'}
                        >
                          {isMobile && (
                            <ListItem
                              color="#475467"
                              weight={500}
                              size={12}
                              height={18}
                              value="Daily Yield"
                            />
                          )}
                          <ListItem
                            weight={500}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`${
                              info.dailyYield === 0
                                ? '$0.00'
                                : info.dailyYield < 0.01
                                ? '<$0.01'
                                : `$${formatNumber(info.dailyYield, 2)}`
                            }`}
                          />
                        </Content>
                        {!isMobile && (
                          <Content width={isMobile ? '33%' : '11%'}>
                            <ListItem
                              weight={500}
                              size={14}
                              height={20}
                              color="#101828"
                              // value={`$${formatNumber(info.totalRewardUsd, 9)}`}
                              value={`${
                                info.totalRewardUsd === 0
                                  ? '$0.00'
                                  : info.totalRewardUsd < 0.01
                                  ? '<$0.01'
                                  : `$${formatNumber(info.totalRewardUsd, 2)}`
                              }`}
                            />
                          </Content>
                        )}
                        <Content
                          onClick={event => {
                            event.stopPropagation()
                            const updatedShowDetail = [...showDetail]
                            updatedShowDetail[i] = !updatedShowDetail[i]
                            setShowDetail(updatedShowDetail)
                          }}
                          width={isMobile ? '5%' : '5%'}
                          cursor="pointer"
                          className={isMobile && 'mobile-extender'}
                        >
                          {showDetail[i] ? (
                            <img
                              src={isMobile ? MobileFile : File}
                              className="active-file-icon"
                              alt="file"
                            />
                          ) : (
                            <img
                              src={isMobile ? MobileFile : File}
                              className="file-icon"
                              alt="file"
                            />
                          )}
                        </Content>
                      </FlexDiv>
                      {showDetail[i] && (
                        <FlexDiv padding={isMobile ? '0px 10px 10px' : '16px 0'}>
                          <Content
                            width={isMobile ? '100%' : '40%'}
                            display={isMobile ? 'flex' : 'flex'}
                          >
                            <ContentInner width={isMobile ? '33%' : '50%'}>
                              <ListItem
                                weight={600}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 18 : 20}
                                value="Unstaked"
                                marginTop={isMobile ? 10 : 0}
                                color="#101828"
                              />
                              <ListItem
                                weight={500}
                                size={isMobile ? 14 : 14}
                                height={isMobile ? 20 : 20}
                                value={
                                  info.unstake === 0
                                    ? '0.00'
                                    : `${formatNumberWido(info.unstake, 6)}`
                                }
                                color="#475467"
                              />
                            </ContentInner>
                            <ContentInner
                              width={isMobile ? '33%' : '50%'}
                              marginLeft={isMobile ? '0px' : '11px'}
                            >
                              <ListItem
                                weight={600}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 18 : 20}
                                value="Staked"
                                marginTop={isMobile ? 10 : 0}
                                color="#101828"
                              />
                              <ListItem
                                weight={500}
                                size={isMobile ? 14 : 14}
                                height={isMobile ? 20 : 20}
                                value={
                                  info.stake === 0 ? '0.00' : `${formatNumberWido(info.stake, 6)}`
                                }
                                color="#475467"
                              />
                            </ContentInner>
                          </Content>
                          {isMobile && (
                            <Content
                              width={isMobile ? '100%' : '11%'}
                              display={isMobile ? 'flex' : 'block'}
                            >
                              <ListItem
                                weight={600}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 18 : 20}
                                value={isMobile ? 'Rewards Breakdown' : 'Rewards'}
                                marginTop={isMobile ? 15 : 0}
                                color="#101828"
                              />
                            </Content>
                          )}
                          {info.reward.map((rw, key) => (
                            <Content
                              key={key}
                              width={isMobile ? '35%' : '15%'}
                              display="flex"
                              marginTop={isMobile ? '15px' : 'unset'}
                            >
                              <Img
                                src={`/icons/${info.rewardSymbol[key].toLowerCase()}.svg`}
                                alt="jeur"
                              />
                              <div>
                                <ListItem
                                  weight={500}
                                  size={isMobile ? 14 : 14}
                                  height={isMobile ? 20 : 20}
                                  value={`${
                                    info.reward[key] === 0
                                      ? '0.00'
                                      : `${info.reward[key].toFixed(6)}`
                                  }`}
                                  color="#475467"
                                />
                                <ListItem
                                  weight={500}
                                  size={isMobile ? 14 : 14}
                                  height={isMobile ? 20 : 20}
                                  value={`${
                                    info.rewardUSD[key] === 0
                                      ? '$0.00'
                                      : info.rewardUSD[key] < 0.01
                                      ? '<$0.01'
                                      : `$${formatNumber(info.rewardUSD[key], 2)}`
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
                <EmptyPanel borderColor={borderColor}>
                  <EmptyInfo weight={500} size={14} height={20} color="#475467">
                    You&apos;re not farming anywhere. Let&apos;s put your assets to work!
                  </EmptyInfo>

                  <EmptyInfo weight={500} size={16} height={21} marginTop="15px">
                    <ExploreFarm
                      backColor="#15b088"
                      hoverColor="#2ccda4"
                      activeColor="#4fdfbb"
                      fontColor="#fff"
                      onClick={() => {
                        push(ROUTES.BEGINNERS)
                      }}
                    >
                      Farms for Beginners
                    </ExploreFarm>
                    <ExploreFarm
                      backColor="#F2F5FF"
                      hoverColor="#e8edff"
                      activeColor="#e0e7ff"
                      fontColor="#000"
                      onClick={() => {
                        push(ROUTES.ADVANCED)
                      }}
                    >
                      Advanced Farms
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
