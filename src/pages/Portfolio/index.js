import { BigNumber } from 'bignumber.js'
import { useWindowWidth } from '@react-hook/window-size'
import useEffectWithPrevious from 'use-effect-with-previous'
import { find, get, isEmpty, orderBy, isEqual } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import BASE from '../../assets/images/chains/base.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Safe from '../../assets/images/logos/dashboard/safe.svg'
import Coin1 from '../../assets/images/logos/dashboard/coins-stacked-02.svg'
import Coin2 from '../../assets/images/logos/dashboard/coins-stacked-04.svg'
import Diamond from '../../assets/images/logos/dashboard/diamond-01.svg'
import Sort from '../../assets/images/logos/dashboard/sort.svg'
import ListItem from '../../components/DashboardComponents/ListItem'
import TotalValue from '../../components/TotalValue'
import {
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  POOL_BALANCES_DECIMALS,
  SPECIAL_VAULTS,
  DECIMAL_PRECISION,
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
  displayAPY,
  getTotalApy,
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
  } = useThemeContext()

  // const [switchBalance, setSwitchBalance] = useState(false)

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

  // const switchBalanceStyle = () => {
  //   setSwitchBalance(!switchBalance)
  // }
  const [farmTokenList, setFarmTokenList] = useState([])
  // const [countList, setCountList] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)

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
          valueRewards = 0
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
            let tokenName = ''
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
                  : totalApy
                  ? displayAPY(totalApy)
                  : null
                : '-'
              : vaultPool.loaded && totalApy !== null && !loadingVaults
              ? token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched
                ? token.inactive || token.testInactive
                  ? 'Inactive'
                  : null
                : displayAPY(totalApy, DECIMAL_PRECISION, 10)
              : '-'
            stats.apy = showAPY
            newStats.push(stats)
          }
        }
        setTotalDeposit(formatNumber(totalStake, 2))
        setTotalRewards(formatNumber(valueRewards, 2))
        setFarmTokenList(newStats)
        // setCountList(newStats.length)
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances, farmingBalances]) // eslint-disable-line react-hooks/exhaustive-deps
  // }, [account, userStats, balances, farmingBalances, switchBalance]) // eslint-disable-line react-hooks/exhaustive-deps

  // const [loadComplete, setLoadComplete] = useState(false)
  // useEffect(() => {
  //   setLoadComplete(true)
  // }, [])

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
          <TotalValue icon={Safe} content="Total Balance" price={totalDeposit} />
          <TotalValue icon={Coin1} content="Monthly Yield" price="0" />
          <TotalValue icon={Coin2} content="Daily Yield" price="0" />
          <TotalValue icon={Diamond} content="Rewards" price={totalRewards} />
          {/* <Div mobileView={isMobile}>{loadComplete && <ProfitSharing height="100%" />}</Div> */}
        </SubPart>

        <DescInfo>Preview farms with your active deposits below.</DescInfo>

        <TransactionDetails backColor={backColor}>
          {/* <FarmTitle borderColor={borderColor}>
            <MyFarm fontColor={fontColor}>
              My Farms
              <Counter count={countList}>{countList > 0 ? countList : ''}</Counter>
              &nbsp;
            </MyFarm>
            <ThemeMode
              mode={switchBalance ? 'usd' : 'token'}
              backColor={toggleBackColor}
              borderColor={borderColor}
            >
              <div id="theme-switch">
                <div className="switch-track">
                  <div className="switch-thumb" />
                </div>

                <input
                  type="checkbox"
                  checked={switchBalance}
                  onChange={switchBalanceStyle}
                  aria-label="Switch between dark and light mode"
                />
              </div>
            </ThemeMode>
          </FarmTitle> */}
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
              <Column width={isMobile ? '12%' : '13%'} color={totalValueFontColor}>
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
                <Col>
                  Monthly Yield
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '11%'}>
                <Col>
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
              <Column width={isMobile ? '20%' : '3%'} color={totalValueFontColor}>
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
                      background={showDetail[i] ? 'rgba(147, 228, 181, 0.13)' : 'unset'}
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
                              weight={500}
                              size={isMobile ? 12 : 14}
                              height={isMobile ? 16 : 20}
                              value={info.symbol}
                              marginBottom={isMobile ? 10 : 0}
                              color="#101828"
                            />
                            <ListItem
                              weight={400}
                              size={isMobile ? 10 : 14}
                              height={isMobile ? 13 : 20}
                              value={info.platform}
                              color="#475467"
                            />
                          </ContentInner>
                        </Content>
                        <Content width={isMobile ? '12%' : '13%'}>
                          <ListItem
                            color="#101828"
                            weight={400}
                            size={14}
                            height={20}
                            value={`${formatNumberWido(info.apy, 6)}`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem weight={400} size={14} height={20} color="#101828" value="$0" />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem weight={400} size={14} height={20} color="#101828" value="$0" />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem
                            weight={400}
                            size={14}
                            height={20}
                            color="#101828"
                            value={`$ ${formatNumber(info.balance, 2)}`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '11%'}>
                          <ListItem
                            weight={400}
                            size={14}
                            height={20}
                            color="#101828"
                            label={`$ ${formatNumberWido(info.totalRewardUsd, 6)}`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '3%'} cursor="pointer">
                          <BiDotsVerticalRounded
                            onClick={() => {
                              const updatedShowDetail = [...showDetail]
                              updatedShowDetail[i] = !updatedShowDetail[i]
                              setShowDetail(updatedShowDetail)
                            }}
                            color="#98A2B3"
                          />
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
                                weight={500}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 16 : 20}
                                value="Unstaked"
                                marginBottom={isMobile ? 10 : 0}
                                color="#101828"
                              />
                              <ListItem
                                weight={400}
                                size={isMobile ? 10 : 14}
                                height={isMobile ? 13 : 20}
                                value={`${formatNumberWido(info.unstake, 6)}`}
                                color="#475467"
                              />
                            </ContentInner>
                            <ContentInner width="50%" marginLeft={isMobile ? '0px' : '11px'}>
                              <ListItem
                                weight={500}
                                size={isMobile ? 12 : 14}
                                height={isMobile ? 16 : 20}
                                value="Staked"
                                marginBottom={isMobile ? 10 : 0}
                                color="#101828"
                              />
                              <ListItem
                                weight={400}
                                size={isMobile ? 10 : 14}
                                height={isMobile ? 13 : 20}
                                value={`${formatNumberWido(info.stake, 6)}`}
                                color="#475467"
                              />
                            </ContentInner>
                          </Content>
                          <Content width={isMobile ? '12%' : '13%'}>
                            <ListItem
                              weight={500}
                              size={isMobile ? 12 : 14}
                              height={isMobile ? 16 : 20}
                              value="Rewards"
                              marginBottom={isMobile ? 10 : 0}
                              color="#101828"
                            />
                            <ListItem
                              weight={500}
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
                                  weight={400}
                                  size={isMobile ? 10 : 14}
                                  height={isMobile ? 13 : 20}
                                  value={`${formatNumberWido(info.reward[key], 5)}`}
                                  color="#475467"
                                />
                                <ListItem
                                  weight={400}
                                  size={isMobile ? 10 : 14}
                                  height={isMobile ? 13 : 20}
                                  value={`$ ${formatNumberWido(info.rewardUSD[key], 2)}`}
                                  color="#101828"
                                />
                              </div>
                            </Content>
                          ))}
                          <Content width={isMobile ? '20%' : '3%'} />
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
