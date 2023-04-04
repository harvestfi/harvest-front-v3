import { BigNumber } from 'bignumber.js'
import { find, get, isEmpty } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
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
  FARM_USDC_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  MIFARM_TOKEN_SYMBOL,
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
import { formatNumber } from '../../utils'
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
  SelField,
  Status,
  SubPart,
  ThemeMode,
  TransactionDetails,
  LogoImg,
  Direct,
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

const Dashboard = () => {
  const { push } = useHistory()
  const { connected, balances, account } = useWallet()
  const { userStats, fetchUserPoolStats, pools } = usePools()
  const { profitShareAPY } = useStats()
  const { vaultsData } = useVaults()
  /* eslint-disable global-require */
  const { tokens } = require('../../data')
  /* eslint-enable global-require */
  const {
    switchMode,
    pageBackColor,
    backColor,
    fontColor,
    borderColor,
    badgeIconBackColor,
    toggleBackColor,
  } = useThemeContext()

  const [switchBalance, setSwitchBalance] = useState(false)

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

  const switchBalanceStyle = () => {
    setSwitchBalance(!switchBalance)
  }
  const [farmTokenList, setFarmTokenList] = useState([])
  const [countList, setCountList] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)

  const [depositToken, setDepositToken] = useState([])

  useEffect(() => {
    if (!connected) {
      setTotalDeposit(0)
      setTotalRewards(0)
    }
  }, [connected])

  useEffect(() => {
    if (account && !isEmpty(userStats) && !isEmpty(depositToken)) {
      const loadUserPoolsStats = async () => {
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
            const poolsToLoad = [fAssetPool]
            await fetchUserPoolStats(poolsToLoad, account, userStats)
          }
        }
        /* eslint-enable no-await-in-loop */
      }
      loadUserPoolsStats()
    }
  }, [account, fetchUserPoolStats, pools, depositToken]) // eslint-disable-line react-hooks/exhaustive-deps

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
        for (let i = 0; i < stakedVaults.length; i += 1) {
          let symbol = ''
          if (stakedVaults[i] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          } else {
            symbol = stakedVaults[i]
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
            reward: 0,
            rewardSymbol: '',
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
            stats.symbol = symbol
            stats.logos = token.logoUrl
            stats.chain = getChainIcon(token.chain)
            stats.platform = useIFARM ? 'Harvest' : token.subLabel || ''
            stats.status = token.inactive ? 'Inactive' : 'Active'
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if (isSpecialVault) {
              fAssetPool = token.data
            }
            let usdPrice = 1
            if (token) {
              usdPrice =
                (symbol === FARM_TOKEN_SYMBOL
                  ? token.data.lpTokenData && token.data.lpTokenData.price
                  : token.usdPrice) || 1
            }
            const unstake =
              fromWei(
                get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
                (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
                POOL_BALANCES_DECIMALS,
                true,
              ) * (switchBalance ? usdPrice : 1)
            stats.unstake = formatNumber(unstake, POOL_BALANCES_DECIMALS)

            const stake =
              fromWei(
                get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0),
                (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
                POOL_BALANCES_DECIMALS,
                true,
              ) * (switchBalance ? usdPrice : 1)
            stats.stake = formatNumber(stake, POOL_BALANCES_DECIMALS)
            totalStake +=
              parseFloat(
                fromWei(
                  get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0),
                  (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
                  POOL_BALANCES_DECIMALS,
                  true,
                ) * usdPrice,
              ) +
              parseFloat(
                fromWei(
                  get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
                  (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
                  POOL_BALANCES_DECIMALS,
                  true,
                ) * usdPrice,
              )

            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])
            // eslint-disable-next-line one-var
            let rewardSymbol = rewardTokenSymbols[0].toUpperCase()
            if (
              rewardTokenSymbols.includes(FARM_TOKEN_SYMBOL) ||
              rewardTokenSymbols.includes(MIFARM_TOKEN_SYMBOL)
            ) {
              rewardSymbol = FARM_TOKEN_SYMBOL
            }

            const rewardToken = groupOfVaults[rewardSymbol]
            // eslint-disable-next-line one-var
            let usdRewardPrice = 1
            if (rewardToken) {
              usdRewardPrice =
                (rewardSymbol === FARM_TOKEN_SYMBOL
                  ? rewardToken.data.lpTokenData && rewardToken.data.lpTokenData.price
                  : rewardToken.usdPrice) || 1
            }

            const rewards = userStats[stakedVaults[i]].totalRewardsEarned
            stats.reward =
              rewards === '0'
                ? 0
                : fromWei(
                    rewards,
                    (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
                  ) * (switchBalance ? usdRewardPrice : 1)
            stats.reward = formatNumber(stats.reward, POOL_BALANCES_DECIMALS)
            valueRewards += Number(
              rewards === '0'
                ? 0
                : fromWei(
                    rewards,
                    (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
                  ) * usdRewardPrice,
            )
            stats.rewardSymbol = rewardSymbol
            newStats.push(stats)
          }
        }
        setTotalDeposit(formatNumber(totalStake, POOL_BALANCES_DECIMALS))
        setTotalRewards(formatNumber(valueRewards, POOL_BALANCES_DECIMALS))
        setFarmTokenList(newStats)
        setCountList(newStats.length)
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances, switchBalance]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <SubPart>
          <TotalValue icon={Rating} content="Deposits" price={totalDeposit} />
          <TotalValue icon={Rating} content="Claimable Rewards" price={totalRewards} />
          <Div>
            <ProfitSharing height="100%" />
          </Div>
        </SubPart>

        <TransactionDetails backColor={backColor} borderColor={borderColor}>
          <FarmTitle borderColor={borderColor}>
            <MyFarm>
              My Farms
              <Counter count={countList}>{countList > 0 ? countList : ''}</Counter>&nbsp;
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
          <Header borderColor={borderColor}>
            <Column width="5%">
              <SelField />
            </Column>
            <Column width="30%">Farm Name</Column>
            <Column width="10%">Status</Column>
            <Column width="15%" color="#FF9400">
              Unstaked
            </Column>
            <Column width="15%" color="#129C3D">
              Staked
            </Column>
            <Column width="15%">Rewards</Column>
            <Column width="10%" />
          </Header>
          {connected ? (
            <>
              {farmTokenList.map((el, i) => {
                const info = farmTokenList[i]
                return (
                  <Direct key={i} href={directDetailUrl + info.symbol}>
                    <DetailView
                      lastElement={i === farmTokenList.length - 1 ? 'yes' : 'no'}
                      mode={switchMode}
                    >
                      <FlexDiv display="block">
                        <Content width="5%">
                          <BadgeIcon badgeBack={badgeIconBackColor}>
                            <img src={info.chain} width="14px" height="14px" alt="" />
                          </BadgeIcon>
                        </Content>
                        <Content width="30%" display="flex">
                          {info.logos.length > 0 &&
                            info.logos.map((elem, index) => (
                              <LogoImg key={index} className="coin" width={37} src={elem} alt="" />
                            ))}
                          <Content marginLeft="11px">
                            <ListItem weight={600} size={12} height={17} value={info.symbol} />
                            <ListItem weight={400} size={12} height={16} value={info.platform} />
                          </Content>
                        </Content>
                        <Content width="10%">
                          <Status status={info.status}>
                            <img src={DotIcon} width={8} height={8} alt="" />
                            {info.status}
                          </Status>
                        </Content>
                        <Content width="15%">
                          <ListItem
                            weight={400}
                            size={12}
                            height={16}
                            value={`${switchBalance ? '$' : ''}${info.unstake}`}
                          />
                        </Content>
                        <Content width="15%">
                          <ListItem
                            weight={400}
                            size={12}
                            height={16}
                            value={`${switchBalance ? '$' : ''}${info.stake}`}
                          />
                        </Content>
                        <Content width="25%">
                          <ListItem
                            weight={400}
                            size={12}
                            height={16}
                            label={`${switchBalance ? '$' : ''}${info.reward}`}
                            icon={`/icons/${info.rewardSymbol}`}
                          />
                        </Content>
                      </FlexDiv>
                    </DetailView>
                  </Direct>
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

                <EmptyInfo weight={700} size={16} height={21} marginTop="45px">
                  <ExploreFarm
                    onClick={() => {
                      push('/farm')
                    }}
                  >
                    <img src={exploreFarm} alt="" />
                    Explore Farms
                  </ExploreFarm>
                </EmptyInfo>
              </EmptyPanel>
            </>
          )}
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

export default Dashboard
