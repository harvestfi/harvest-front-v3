import { BigNumber } from 'bignumber.js'
import useEffectWithPrevious from 'use-effect-with-previous'
import axios from 'axios'
import { find, get, isEmpty, orderBy, isEqual, isNaN } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FaRegSquare, FaRegSquareCheck } from 'react-icons/fa6'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Safe from '../../assets/images/logos/dashboard/safe.svg'
import Coin1 from '../../assets/images/logos/dashboard/coins-stacked-02.svg'
import Coin2 from '../../assets/images/logos/dashboard/coins-stacked-04.svg'
import Diamond from '../../assets/images/logos/dashboard/diamond-01.svg'
import Sort from '../../assets/images/logos/dashboard/sort.svg'
import ConnectDisableIcon from '../../assets/images/logos/sidebar/connect-disable.svg'
import VaultRow from '../../components/DashboardComponents/VaultRow'
import TotalValue from '../../components/TotalValue'
import {
  GECKO_URL,
  COINGECKO_API_KEY,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  MAX_DECIMALS,
  ROUTES,
} from '../../constants'
import { addresses } from '../../data'
import { CHAIN_IDS } from '../../data/constants'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { fromWei } from '../../services/web3'
import { parseValue, getTotalApy, isLedgerLive } from '../../utils'
import {
  Column,
  Container,
  EmptyInfo,
  EmptyPanel,
  ExploreFarm,
  ExploreContent,
  ExploreTitle,
  Header,
  Inner,
  SubPart,
  MobileSubPart,
  MobileDiv,
  DescInfo,
  // ThemeMode,
  TransactionDetails,
  Col,
  TableContent,
  ConnectButtonStyle,
  CheckBoxDiv,
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

const Portfolio = () => {
  const { push } = useHistory()
  const { connected, connectAction, account, balances, getWalletBalances, chainId } = useWallet()
  const { userStats, fetchUserPoolStats, totalPools, disableWallet } = usePools()
  const { profitShareAPY } = useStats()
  const { vaultsData, loadingVaults, farmingBalances, getFarmingBalances } = useVaults()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  const {
    // darkMode,
    pageBackColor,
    backColor,
    fontColor,
    borderColor,
    totalValueFontColor,
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
  const [filteredFarmList, setFilteredFarmList] = useState([])
  const [noFarm, setNoFarm] = useState(false)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [totalYieldDaily, setTotalYieldDaily] = useState(0)
  const [totalYieldMonthly, setTotalYieldMonthly] = useState(0)

  const [depositToken, setDepositToken] = useState([])

  const [sortOrder, setSortOrder] = useState(false)
  const [showDetail, setShowDetail] = useState(Array(farmTokenList.length).fill(false))
  const [showInactiveFarms, setShowInactiveFarms] = useState(false)

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
        let stakedVaults = [],
          totalBalanceUSD = 0,
          valueRewards = 0,
          totalDailyYield = 0,
          totalMonthlyYield = 0

        if (showInactiveFarms) {
          stakedVaults = Object.keys(userStats).filter(
            poolId =>
              new BigNumber(userStats[poolId].totalStaked).gt(0) ||
              new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
              (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
                new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
          )
        } else {
          const stakedVaultsTemp = Object.keys(userStats).filter(
            poolId =>
              new BigNumber(userStats[poolId].totalStaked).gt(0) ||
              new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
              (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
                new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
          )

          stakedVaults = stakedVaultsTemp.filter(
            poolId =>
              groupOfVaults[poolId] && // Check if the key exists in groupOfVaults
              groupOfVaults[poolId].inactive !== true,
          )
        }

        const symbols = stakedVaults.map(poolId =>
          poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID ? FARM_TOKEN_SYMBOL : poolId,
        )

        if (depositToken.length !== symbols.length) {
          setDepositToken(symbols)
        }

        const newStats = []

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
              iFARMBalance = 0,
              usdPrice = 1
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
            const tokenDecimals = useIFARM
              ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.decimals`, 0)
              : token.decimals
            const tempPricePerFullShare = useIFARM
              ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
              : get(token, `pricePerFullShare`, 0)
            const pricePerFullShare = fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals)
            if (token) {
              usdPrice =
                (symbol === FARM_TOKEN_SYMBOL
                  ? (token.data.lpTokenData && token.data.lpTokenData.price) * pricePerFullShare
                  : token.vaultPrice) || 1
            }
            const unstake = fromWei(
              get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
              MAX_DECIMALS,
            )
            stats.unstake = unstake
            if (isNaN(stats.unstake)) {
              stats.unstake = 0
            }
            const stakeTemp = get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0)
            if (useIFARM) {
              iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
            }
            const stake = fromWei(
              useIFARM ? iFARMBalance : stakeTemp,
              token.decimals || token.data.watchAsset.decimals,
              MAX_DECIMALS,
            )

            stats.stake = stake
            const finalBalance = Number(stake) + Number(unstake)
            if (useIFARM) {
              stats.balance = Number(stake) * usdPrice
            } else {
              stats.balance = finalBalance * usdPrice
            }
            if (isNaN(stats.stake)) {
              stats.stake = 0
            }
            const totalStk = parseFloat((isNaN(Number(stake)) ? 0 : parseValue(stake)) * usdPrice)
            const totalUnsk = parseFloat(
              (isNaN(Number(unstake)) ? 0 : parseValue(unstake)) * usdPrice,
            )
            totalBalanceUSD += totalStk + totalUnsk
            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])

            for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
              let rewardSymbol = rewardTokenSymbols[l].toUpperCase(),
                rewards,
                rewardToken,
                usdRewardPrice = 0,
                // rewardDecimal = 18
                rewardDecimal = get(tokens[symbol], 'decimals', 18)

              if (rewardTokenSymbols.includes(FARM_TOKEN_SYMBOL)) {
                rewardSymbol = FARM_TOKEN_SYMBOL
              }

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
              } else {
                rewardToken = groupOfVaults[rewardSymbol]
              }

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
                const usdUnderlyingRewardPrice =
                  (rewardSymbol === FARM_TOKEN_SYMBOL
                    ? rewardToken.data.lpTokenData && rewardToken.data.lpTokenData.price
                    : rewardToken.usdPrice) || 0
                const pricePerFullShareInVault = rewardToken.pricePerFullShare
                const decimalsInVault = rewardToken.decimals || 18

                usdRewardPrice =
                  rewardSymbol === FARM_TOKEN_SYMBOL || rewardSymbol === IFARM_TOKEN_SYMBOL
                    ? usdUnderlyingRewardPrice
                    : Number(usdUnderlyingRewardPrice) *
                      fromWei(pricePerFullShareInVault, decimalsInVault, decimalsInVault, true)

                rewardDecimal =
                  rewardToken.decimals ||
                  (rewardToken.data &&
                    rewardToken.data.lpTokenData &&
                    rewardToken.data.lpTokenData.decimals)
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
                      // console.log(`${rewardSymbol} - USD Price: ${usdRewardPrice}`)
                      break
                    }
                  }
                } catch (error) {
                  console.error('Error:', error)
                }
              }
              const rewardValues =
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal, rewardDecimal, true)
              stats.reward.push(Number(rewardValues))
              stats.totalRewardUsd += Number(rewardValues * Number(usdRewardPrice))
              valueRewards += Number(rewardValues * Number(usdRewardPrice))
              stats.rewardSymbol.push(rewardSymbol)
              // console.log(
              //   tokenName,
              //   ': ',
              //   rewardSymbol,
              //   ' ###### ',
              //   rewardValues,
              //   ' * ',
              //   usdRewardPrice,
              //   ' = ',
              //   Number(rewardValues * Number(usdRewardPrice)),
              // )

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

        setTotalDeposit(totalBalanceUSD)
        setTotalRewards(valueRewards)
        setTotalYieldDaily(totalDailyYield)
        setTotalYieldMonthly(totalMonthlyYield)
        const sortedTokenList = orderBy(newStats, ['balance'], ['desc'])
        setFarmTokenList(sortedTokenList)
        if (sortedTokenList.length === 0) {
          setNoFarm(true)
        }
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances, farmingBalances, showInactiveFarms]) // eslint-disable-line react-hooks/exhaustive-deps

  const sortCol = field => {
    const tokenList = orderBy(farmTokenList, [field], [sortOrder ? 'asc' : 'desc'])
    setFarmTokenList(tokenList)
    setSortOrder(!sortOrder)
  }

  useEffect(() => {
    const filteredVaultList = showInactiveFarms
      ? farmTokenList
      : farmTokenList.filter(farm => farm.status === 'Active')
    setFilteredFarmList(filteredVaultList)
  }, [showInactiveFarms, farmTokenList])

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
            {connected && farmTokenList.length > 0 ? (
              <>
                {showInactiveFarms
                  ? farmTokenList.map((el, i) => {
                      const info = farmTokenList[i]
                      return (
                        <VaultRow
                          key={i}
                          info={info}
                          lastElement={i === farmTokenList.length - 1 ? 'yes' : 'no'}
                          showDetail={showDetail}
                          setShowDetail={setShowDetail}
                          cKey={i}
                        />
                      )
                    })
                  : filteredFarmList.map((el, i) => {
                      const info = filteredFarmList[i]
                      return (
                        <VaultRow
                          key={i}
                          info={info}
                          lastElement={i === filteredFarmList.length - 1 ? 'yes' : 'no'}
                          showDetail={showDetail}
                          setShowDetail={setShowDetail}
                          cKey={i}
                        />
                      )
                    })}
              </>
            ) : (
              <EmptyPanel borderColor={borderColor}>
                {connected ? (
                  !noFarm ? (
                    <EmptyInfo weight={500} size={14} height={20} color="#475467">
                      Syncing positions...
                    </EmptyInfo>
                  ) : (
                    <EmptyInfo weight={500} size={14} height={20} color="#475467">
                      You&apos;re not farming anywhere. Let&apos;s put your assets to work!
                    </EmptyInfo>
                  )
                ) : (
                  <>
                    <EmptyInfo weight={500} size={14} height={20} color="#475467">
                      Connect wallet to see your positions.
                    </EmptyInfo>
                    <ConnectButtonStyle
                      color="connectwallet"
                      onClick={() => {
                        connectAction()
                      }}
                      minWidth="190px"
                      bordercolor={fontColor}
                      disabled={disableWallet}
                    >
                      <img src={ConnectDisableIcon} className="connect-wallet" alt="" />
                      Connect Wallet
                    </ConnectButtonStyle>
                  </>
                )}
              </EmptyPanel>
            )}
          </TableContent>
          {connected && farmTokenList.length > 0 && (
            <CheckBoxDiv>
              {showInactiveFarms ? (
                <FaRegSquareCheck onClick={() => setShowInactiveFarms(false)} color="#15B088" />
              ) : (
                <FaRegSquare onClick={() => setShowInactiveFarms(true)} color="#15B088" />
              )}
              <div>Show inactive positions</div>
            </CheckBoxDiv>
          )}
        </TransactionDetails>
        {connected && farmTokenList.length > 0? (
          <></>
        ) : (
          <EmptyInfo weight={500} size={16} height={21} marginTop="25px">
            {
              (!isLedgerLive() || (isLedgerLive() && chainId === CHAIN_IDS.BASE)) ? 
                <ExploreFarm
                  bgImage="first"
                  onClick={() => {
                    push(ROUTES.BEGINNERSFARM)
                  }}
                >
                  <ExploreContent>
                    <ExploreTitle>Farm for Beginners</ExploreTitle>
                    <div>Get started with a simple ETH farm on Base.</div>
                  </ExploreContent>
                </ExploreFarm>
                :
                <></>
            }
            <ExploreFarm
              bgImage="second"
              onClick={() => {
                push(ROUTES.TUTORIAL)
              }}
            >
              <ExploreContent>
                <ExploreTitle>New to Crypto Farming?</ExploreTitle>
                <div>Learn how to earn yield.</div>
              </ExploreContent>
            </ExploreFarm>
            <ExploreFarm
              bgImage="third"
              onClick={() => {
                push(ROUTES.ADVANCED)
              }}
            >
              <ExploreContent>
                <ExploreTitle>Advanced Farms</ExploreTitle>
                <div>Over 100 farms to explore.</div>
              </ExploreContent>
            </ExploreFarm>
          </EmptyInfo>
        )}
      </Inner>
    </Container>
  )
}

export default Portfolio
