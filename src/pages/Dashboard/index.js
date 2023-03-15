import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from "react-router-dom"
import { BigNumber } from "bignumber.js"
import { get, isEmpty, find } from 'lodash'
import { Container, SubPart, TotalValueRow, SecondaryPart, TransactionDetails, DetailView, FarmTitle, 
  FlexDiv, MyFarm, Inner, EmptyPanel, EmptyInfo, EmptyImg, ExploreFarm, ThemeMode,
  FirstPart, FirstContent, SecondPart, SecondContent, BadgeIcon } from './style'
import { useThemeContext } from '../../providers/useThemeContext'
import Chart from '../../components/DashboardComponents/Chart'
import TotalValue from '../../components/DashboardComponents/TotalValue'
import Porto from '../../components/DashboardComponents/Porto'
import ListItem from '../../components/DashboardComponents/ListItem'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import { useStats } from '../../providers/Stats'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL, SPECIAL_VAULTS, FARM_USDC_TOKEN_SYMBOL, FARM_WETH_TOKEN_SYMBOL, 
  FARM_GRAIN_TOKEN_SYMBOL, POOL_BALANCES_DECIMALS} from '../../constants'
import { CHAINS_ID, VAULT_CATEGORIES_IDS } from '../../data/constants'
import { fromWei } from '../../services/web3'
import { formatNumber } from '../../utils'
import { addresses } from '../../data'
import DashboardTVL from '../../assets/images/logos/common/tvl.svg'
import DashboardClaim from '../../assets/images/logos/common/apy.svg'
import MyFarmIcon from '../../assets/images/logos/dashboard/myfarm.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import EmptyIcon from '../../assets/images/logos/dashboard/empty.svg'
import exploreFarm from '../../assets/images/logos/dashboard/exploreFarm.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import BNB from '../../assets/images/chains/bnb.svg'

const getChainIcon = (chain) => {
  let chainLogo = ETHEREUM
  switch(chain) {
    case CHAINS_ID.MATIC_MAINNET:
      chainLogo = POLYGON
      break
    case CHAINS_ID.BSC_MAINNET:
      chainLogo = BNB
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
  const { tokens } = require('../../data')
  const { switchMode, pageBackColor, backColor, fontColor, borderColor, badgeIconBackColor, 
    toggleBackColor, switchBalance, setSwitchBalance } = useThemeContext()
  
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
        rewardSymbol: "iFarm",
        isNew: tokens[IFARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[IFARM_TOKEN_SYMBOL].newDetails,
        category: VAULT_CATEGORIES_IDS.GENERAL,
        balance: 'FARM',
        subLabel: 'Harvest'
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        displayName: 'FARM, ETH', //'FARM/ETH',
        subLabel: 'Uniswap',
        data: farmWethPool,
        vaultAddress: addresses.FARM_WETH_LP,
        logoUrl: ['./icons/farm.svg', './icons/weth.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_WETH_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.LIQUIDITY,
        balance: 'FARM_WETH_LP'
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        displayName: 'FARM, GRAIN', //'FARM/GRAIN',
        subLabel: 'Uniswap',
        data: farmGrainPool,
        vaultAddress: addresses.FARM_GRAIN_LP,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_GRAIN_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.LIQUIDITY,
        balance: 'FARM_GRAIN_LP'
      },
      [FARM_USDC_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        inactive: true,
        displayName: 'FARM/USDC',
        data: farmUsdcPool,
        logoUrl: ['./icons/farm.svg', './icons/usdc.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_USDC_TOKEN_SYMBOL].isNew,
      },
    }),
    [
      tokens,
      farmGrainPool,
      farmWethPool,
      farmUsdcPool,
      farmProfitSharingPool,
      profitShareAPY,
    ],
  )
  
  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const switchBalanceStyle = () => {
    setSwitchBalance(!switchBalance)
  }
  const [farmTokenList, setFarmTokenList] = useState([])
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)

  const [depositToken, setDepositToken] = useState([])

  useEffect(() => {
    if(!connected) {
      setTotalDeposit(0)
      setTotalRewards(0)
    }
  }, [connected])

  useEffect(() => {
    if (
      account &&
      !isEmpty(userStats) &&
      !isEmpty(depositToken)
    ) {
      const loadUserPoolsStats = async () => {
        for(let i = 0; i < depositToken.length; i++) {
          let fAssetPool = depositToken[i] === FARM_TOKEN_SYMBOL ? groupOfVaults[depositToken[i]].data :
          find(pools, pool => pool.id === depositToken[i])
          
          const token = find(groupOfVaults, vault => (vault.vaultAddress === fAssetPool.collateralAddress) || 
            (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress))
          if(token !== undefined) {
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if(isSpecialVault) {
              fAssetPool = token.data
            }
            const poolsToLoad = [fAssetPool]
            await fetchUserPoolStats(poolsToLoad, account, userStats)
          }
        }
      }
      loadUserPoolsStats()
    }
  }, [// eslint-disable-line react-hooks/exhaustive-deps
    account, fetchUserPoolStats, pools, tokens, depositToken 
  ])

  useEffect(()=>{
    if(!isEmpty(userStats) && account) {
      const getFarmTokenInfo = async () => {
        const stakedVaults = Object.keys(userStats)
        .filter(
          poolId =>
            new BigNumber(userStats[poolId].totalStaked).gt(0) ||
            new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
            (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
              new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
        )

        let symbols = []
        for(let i = 0; i < stakedVaults.length; i++) {
          let symbol = ""
          if(stakedVaults[i] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          }
          else {
            symbol = stakedVaults[i]
          }
          symbols.push(symbol)
        }
        if(depositToken.length !== symbols.length) {
          setDepositToken(symbols)
        }

        let newStats = []
        let totalStake = 0, valueRewards = 0
        for(let i = 0; i < stakedVaults.length; i++) {
          let stats = {chain: "", symbol: "", logos: [], platform: "", balance: "", unstake: "", stake: "", reward: 0, rewardSymbol: ""}
          let symbol = ""
          if(stakedVaults[i] === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
            symbol = FARM_TOKEN_SYMBOL
          }
          else {
            symbol = stakedVaults[i]
          }
          let fAssetPool = symbol === FARM_TOKEN_SYMBOL ? groupOfVaults[symbol].data :
          find(pools, pool => pool.id === symbol)
          
          const token = find(groupOfVaults, vault => (vault.vaultAddress === fAssetPool.collateralAddress) || 
            (vault.data && vault.data.collateralAddress === fAssetPool.collateralAddress))
          if(token !== undefined) {
            const useIFARM = symbol === FARM_TOKEN_SYMBOL
            stats["symbol"] = symbol
            stats["logos"] = token.logoUrl
            stats["chain"] = getChainIcon(token.chain)
            stats["platform"] = useIFARM ? tokens[IFARM_TOKEN_SYMBOL].subLabel : token.subLabel || ""
            stats["balance"] = token.balance
            
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            if(isSpecialVault) {
              fAssetPool = token.data
            }
            let usdPrice = 1
            if(token !== undefined) {
              usdPrice = (symbol === FARM_TOKEN_SYMBOL ? token.data.lpTokenData && token.data.lpTokenData.price : token.usdPrice) || 1
            }
            const unstake = fromWei(
              get(userStats, `[${stakedVaults[i]}]['lpTokenBalance']`, 0),
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
              POOL_BALANCES_DECIMALS,
              true,
            ) * usdPrice
            stats["unstake"] = formatNumber(unstake, POOL_BALANCES_DECIMALS)
  
            const stake = fromWei(
              get(userStats, `[${stakedVaults[i]}]['totalStaked']`, 0),
              (fAssetPool && fAssetPool.lpTokenData && fAssetPool.lpTokenData.decimals) || 18,
              POOL_BALANCES_DECIMALS,
              true,
            ) * usdPrice
            stats["stake"] = formatNumber(stake, POOL_BALANCES_DECIMALS)
            totalStake += (parseFloat(stake) + parseFloat(unstake))
            
            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])

            const rewardToken = groupOfVaults[rewardTokenSymbols[0]]
            let usdRewardPrice = 1
            if(rewardToken !== undefined) {
              usdRewardPrice = (rewardTokenSymbols[0] === FARM_TOKEN_SYMBOL ? rewardToken.data.lpTokenData && rewardToken.data.lpTokenData.price : rewardToken.usdPrice) || 1
            }

            let rewards = userStats[stakedVaults[i]].totalRewardsEarned
            stats["reward"] = rewards === "0" ? 0 : fromWei(rewards, tokens[rewardTokenSymbols[0]].decimals) * usdRewardPrice
            stats["reward"] = formatNumber(stats["reward"], POOL_BALANCES_DECIMALS)
            valueRewards += Number(stats["reward"])
            stats["rewardSymbol"] = rewardTokenSymbols[0]
          }

          newStats.push(stats)
        }
        setTotalDeposit(formatNumber(totalStake, POOL_BALANCES_DECIMALS))
        setTotalRewards(formatNumber(valueRewards, POOL_BALANCES_DECIMALS))
        setFarmTokenList(newStats)
      }

      getFarmTokenInfo()
    }
  }, [account, userStats, balances]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <SubPart>
          <SecondaryPart>
            <TotalValueRow backColor={backColor} borderColor={borderColor}>
              <TotalValue icon={DashboardTVL} content={"Deposits"} price={totalDeposit} />
              <TotalValue icon={DashboardClaim} content={"Claimable Rewards"} price={totalRewards} />
            </TotalValueRow>
            <Porto />
          </SecondaryPart>
          <Chart />
        </SubPart>
        <FarmTitle>
          <MyFarm>
            <img src={MyFarmIcon} alt="" />
            My Farms
          </MyFarm>
          <ThemeMode mode={switchBalance ? "usd" : "token"} backColor={toggleBackColor} borderColor={borderColor}>
            <div id="theme-switch">
              <div className="switch-track">
                <div className="switch-thumb"></div>
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
        <TransactionDetails backColor={backColor} borderColor={borderColor} >
          {
          connected ? 
            <>
              {
                farmTokenList.map((el, i) => {
                  const info = farmTokenList[i]
                  return (
                    <DetailView key={i} lastElement={i === farmTokenList.length-1 ? "yes" : "no" } mode={switchMode}>
                      <FlexDiv display="block">
                        <BadgeIcon badgeBack={badgeIconBackColor}>
                          <img src={info.chain} width={"10"} height={"10"} alt="" />
                        </BadgeIcon>
                        <FirstPart>
                          <FirstContent width="40%" display="flex">
                            {
                              info.logos.length > 0 && info.logos.map((el, i) => (
                                <img key={i} className="coin" width={37} src={el} alt="" />
                              ))
                            }
                            
                          </FirstContent>
                          <FirstContent width="60%">
                            <ListItem weight={400} size={16} height={21} value={info.symbol} />
                            <ListItem weight={400} size={12} height={16} value={info.platform} />
                            <ListItem weight={400} size={12} height={16} color={"#27AE60"} value={info.balance} />
                          </FirstContent>
                        </FirstPart>
                        <SecondPart>
                          <SecondContent>
                            <ListItem weight={700} size={16} height={21} label={"Unstaked"} percent={"5%"} up={true} />
                            <ListItem weight={400} size={12} height={16} value={`$${info.unstake}`} />
                            <ListItem weight={700} size={16} height={21} label={"Staked"} percent={"5%"} up={true} />
                            <ListItem weight={400} size={12} height={16} value={`$${info.stake}`} />
                          </SecondContent>
                          <SecondContent>
                            <ListItem weight={700} size={16} height={21} label={"Rewards"} />
                            <ListItem weight={400} size={12} height={16} label={`$${info.reward}`} icon={`/icons/${info.rewardSymbol}`} />
                          </SecondContent>
                        </SecondPart>
                      </FlexDiv>
                    </DetailView>
                )})
              }
            </>
          : 
            <>
              <EmptyPanel>
                <FlexDiv>
                  <EmptyImg src={EmptyIcon} alt="Empty" />
                </FlexDiv>
                <EmptyInfo weight={700} size={18} height={24} color={fontColor} marginTop={"18px"}>You’re not farming anywhere.</EmptyInfo>
                <EmptyInfo weight={400} size={12} height={16} color={"#888E8F"} marginTop={"5px"}>Let’s put your assets to work!</EmptyInfo>

                <EmptyInfo weight={700} size={16} height={21} marginTop={"45px"}>
                  <ExploreFarm onClick={()=>{
                    push("/farm")
                  }}>
                    <img src={exploreFarm} alt="" />
                    Explore Farms
                  </ExploreFarm>
                </EmptyInfo>
              </EmptyPanel>
            </>
          }
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

export default Dashboard
