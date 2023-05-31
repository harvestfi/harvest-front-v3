import { BigNumber } from 'bignumber.js'
import { useWindowWidth } from '@react-hook/window-size'
import useEffectWithPrevious from 'use-effect-with-previous'
import { find, get, isEmpty, orderBy, isEqual } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import Rating from '../../assets/images/logos/dashboard/dashboard_rating.svg'
import EmptyIcon from '../../assets/images/logos/dashboard/empty.svg'
import exploreFarm from '../../assets/images/logos/dashboard/exploreFarm.svg'
import DotIcon from '../../assets/images/logos/sidebar/connect-success.svg'
import ListItem from '../../components/DashboardComponents/ListItem'
import TotalValue from '../../components/DashboardComponents/TotalValue'
import ProfitSharing from '../../components/ProfitSharing'
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
import { CHAINS_ID } from '../../data/constants'
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
  isLedgerLive,
  convertAmountToFARM,
  getUserVaultBalance,
} from '../../utils'
import {
  BadgeIcon,
  Column,
  Container,
  Content,
  Counter,
  DetailView,
  Div,
  EmptyImg,
  EmptyInfo,
  EmptyPanel,
  ExploreFarm,
  FarmTitle,
  FlexDiv,
  Header,
  Inner,
  MyFarm,
  Status,
  SubPart,
  ThemeMode,
  TransactionDetails,
  LogoImg,
  Col,
  ContentInner,
  TableContent,
} from './style'

const getChainIcon = chain => {
  let chainLogo = ETHEREUM
  switch (chain) {
    case CHAINS_ID.MATIC_MAINNET:
      chainLogo = POLYGON
      break
    case CHAINS_ID.ARBITRUM_ONE:
      chainLogo = ARBITRUM
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

const Portfolio = () => {
  const { push } = useHistory()
  const { connected, balances, account, getWalletBalances } = useWallet()
  const { userStats, fetchUserPoolStats, pools } = usePools()
  const { profitShareAPY } = useStats()
  const { vaultsData, farmingBalances, getFarmingBalances } = useVaults()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  /* eslint-enable global-require */
  const {
    darkMode,
    switchMode,
    pageBackColor,
    backColor,
    fontColor,
    borderColor,
    badgeIconBackColor,
    toggleBackColor,
    vaultPanelHoverColor,
    totalValueFontColor,
  } = useThemeContext()

  const [switchBalance, setSwitchBalance] = useState(false)

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
        tokenAddress: addresses.iFARM,
        rewardSymbol: 'iFarm',
        isNew: tokens[IFARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[IFARM_TOKEN_SYMBOL].newDetails,
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

  const switchBalanceStyle = () => {
    setSwitchBalance(!switchBalance)
  }
  const [farmTokenList, setFarmTokenList] = useState([])
  const [countList, setCountList] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)

  const [depositToken, setDepositToken] = useState([])

  const [sortOrder, setSortOrder] = useState(false)
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
              : find(pools, pool => pool.id === depositToken[i])

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
  }, [account, pools, depositToken]) // eslint-disable-line react-hooks/exhaustive-deps

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
              : find(pools, pool => pool.id === symbol)

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
            stats.unstake = unstake * (switchBalance ? usdPrice : 1)
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

            stats.stake = stake * (switchBalance ? usdPrice : 1)
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
              let usdRewardPrice = 1,
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
                    : rewardToken.usdPrice) || 1

                rewardDecimal =
                  rewardToken.decimals ||
                  (rewardToken.data &&
                    rewardToken.data.lpTokenData &&
                    rewardToken.data.lpTokenData.decimals)
              }

              // eslint-disable-next-line one-var
              let rewardValues = rewards === undefined ? 0 : fromWei(rewards, rewardDecimal)
              if (switchBalance) {
                rewardValues *= usdRewardPrice
              }
              stats.reward.push(Number(rewardValues).toFixed(POOL_BALANCES_DECIMALS))

              stats.totalRewardUsd += Number(
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal) * usdRewardPrice,
              )
              valueRewards += Number(
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal) * usdRewardPrice,
              )
              stats.rewardSymbol.push(rewardSymbol)
            }
            newStats.push(stats)
          }
        }
        setTotalDeposit(formatNumber(totalStake, 2))
        setTotalRewards(formatNumber(valueRewards, 2))
        setFarmTokenList(newStats)
        setCountList(newStats.length)
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances, farmingBalances, switchBalance]) // eslint-disable-line react-hooks/exhaustive-deps

  const [loadComplete, setLoadComplete] = useState(false)
  useEffect(() => {
    setLoadComplete(true)
  }, [])

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
          <TotalValue icon={Rating} content="Deposits" price={totalDeposit} />
          <TotalValue icon={Rating} content="Claimable Rewards" price={totalRewards} />
          <Div mobileView={isMobile}>{loadComplete && <ProfitSharing height="100%" />}</Div>
        </SubPart>

        <TransactionDetails backColor={backColor} borderColor={borderColor}>
          <FarmTitle borderColor={borderColor}>
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
          </FarmTitle>
          <TableContent count={farmTokenList.length}>
            <Header borderColor={borderColor} backColor={backColor} width={ceilWidth}>
              <Column width="5%" />
              <Column width={isMobile ? '23%' : '35%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('symbol')
                  }}
                >
                  Name
                </Col>
              </Column>
              <Column width={isMobile ? '12%' : '15%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('status')
                  }}
                >
                  Status
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '15%'} color="#FF9400">
                <Col
                  onClick={() => {
                    sortCol('unstake')
                  }}
                >
                  Unstaked
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '15%'} color="#129c3d">
                <Col
                  onClick={() => {
                    sortCol('stake')
                  }}
                >
                  Staked
                </Col>
              </Column>
              <Column width={isMobile ? '20%' : '15%'} color={totalValueFontColor}>
                <Col
                  onClick={() => {
                    sortCol('totalRewardUsd')
                  }}
                >
                  Rewards
                </Col>
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
                      hoverColor={vaultPanelHoverColor}
                      width={ceilWidth}
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
                        push(`${directDetailUrl + network}/${address}`)
                      }}
                    >
                      <FlexDiv>
                        <Content width="5%" firstColumn>
                          <BadgeIcon badgeBack={badgeIconBackColor}>
                            <img src={info.chain} width="10px" height="10px" alt="" />
                          </BadgeIcon>
                        </Content>
                        <Content
                          width={isMobile ? '23%' : '35%'}
                          display={isMobile ? 'block' : 'flex'}
                        >
                          <ContentInner width="40%">
                            {info.logos.length > 0 &&
                              info.logos.map((elem, index) => (
                                <LogoImg
                                  key={index}
                                  className="coin"
                                  width={isMobile ? 19 : 37}
                                  src={elem}
                                  alt=""
                                />
                              ))}
                          </ContentInner>
                          <ContentInner width="55%" marginLeft={isMobile ? '0px' : '11px'}>
                            <ListItem
                              weight={700}
                              size={isMobile ? 12 : 16}
                              height={isMobile ? 16 : 21}
                              value={info.symbol}
                              marginBottom={isMobile ? 10 : 0}
                            />
                            <ListItem
                              weight={400}
                              size={isMobile ? 10 : 12}
                              height={isMobile ? 13 : 16}
                              value={info.platform}
                            />
                          </ContentInner>
                        </Content>
                        <Content width={isMobile ? '12%' : '15%'}>
                          <Status status={info.status} darkMode={darkMode}>
                            <img src={DotIcon} width={8} height={8} alt="" />
                            {isMobile ? '' : info.status}
                          </Status>
                        </Content>
                        <Content width={isMobile ? '20%' : '15%'}>
                          <ListItem
                            weight={400}
                            size={12}
                            height={16}
                            value={`${switchBalance ? '$' : ''}${formatNumber(
                              info.unstake,
                              switchBalance ? 2 : 6,
                            )}`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '15%'}>
                          <ListItem
                            weight={400}
                            size={12}
                            height={16}
                            value={`${switchBalance ? '$' : ''}${formatNumber(
                              info.stake,
                              switchBalance ? 2 : 6,
                            )}`}
                          />
                        </Content>
                        <Content width={isMobile ? '20%' : '15%'}>
                          {info.reward.map((rw, key) => (
                            <ListItem
                              weight={400}
                              size={12}
                              height={16}
                              key={key}
                              marginBottom={5}
                              label={`${switchBalance ? '$' : ''}${formatNumberWido(
                                rw,
                                switchBalance ? 2 : 6,
                              )}`}
                              icon={`/icons/${info.rewardSymbol[key]}`}
                            />
                          ))}
                        </Content>
                      </FlexDiv>
                    </DetailView>
                  )
                })}
              </>
            ) : (
              <>
                <EmptyPanel>
                  <FlexDiv>
                    <EmptyImg src={EmptyIcon} alt="Empty" />
                  </FlexDiv>
                  <EmptyInfo weight={700} size={18} height={24} color={fontColor} marginTop="18px">
                    You’re not farming anywhere.
                  </EmptyInfo>
                  <EmptyInfo weight={400} size={12} height={16} color="#888E8F" marginTop="5px">
                    Let’s put your assets to work!
                  </EmptyInfo>

                  <EmptyInfo weight={500} size={16} height={21} marginTop="45px">
                    <ExploreFarm
                      borderColor={borderColor}
                      onClick={() => {
                        push('/')
                      }}
                    >
                      <img src={exploreFarm} alt="" />
                      Explore Farms
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
