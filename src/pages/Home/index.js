import React, { useMemo } from 'react'
import { get, find } from 'lodash'
import { useHistory } from "react-router-dom"
import { useMediaQuery } from 'react-responsive'
import { FarmContainer, FarmContent, FarmCompInner, WelcomeBackPart, NavPart, NavText, BottomPart, 
  NavButton, ButtonDiv } from './style'
import HomeComponentInfo from '../../components/HomeComponentInfo'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../constants'
import Farm1 from '../../assets/images/logos/home/farmType/farm1.svg'
import Farm2 from '../../assets/images/logos/home/farmType/farm2.svg'
import Farm3 from '../../assets/images/logos/home/farmType/farm3.svg'
import Farm4 from '../../assets/images/logos/home/farmType/farm4.svg'
import Farm5 from '../../assets/images/logos/home/farmType/farm5.svg'
import Farm6 from '../../assets/images/logos/home/farmType/farm6.svg'
import Back1 from '../../assets/images/logos/home/most_supplied-min.png'
import Back2 from '../../assets/images/logos/home/stablecoin-min.png'
import Back3 from '../../assets/images/logos/home/collaboration-min.png'
import Back4 from '../../assets/images/logos/home/newest-min.png'
import Back5 from '../../assets/images/logos/home/highest-min.png'
import Back6 from '../../assets/images/logos/home/profit-min.png'

import WelcomeBack from '../../assets/images/logos/home/welcome_back_min.png'
import WelcomeBackMobile from '../../assets/images/logos/home/welcome_back_mobile_min.png'

const vaultList = [
  { compText: "Most-Supplied", textColor: "#2891F9", compIcon: Farm1, backImg: Back1, directUrl: "USDC" },
  { compText: "Stablecoin", textColor: "#1F2937", compIcon: Farm2, backImg: Back2, directUrl: "DAI" },
  { compText: "Collaboration", textColor: "#AB6AC2", compIcon: Farm3, backImg: Back3, directUrl: "notional_ETH" },
  { compText: "Newest Farm", textColor: "#FF9400", compIcon: Farm4, backImg: Back4, directUrl: "notional_WBTC" },
  { compText: "Highest APY", textColor: "#3B9683", compIcon: Farm5, backImg: Back5, directUrl: "LOOKS" },
  { compText: "Profit-Sharing", textColor: "#AB6AC2", compIcon: Farm6, backImg: Back6, directUrl: "FARM" },
]

const Home = () => {
  const { vaultsData } = useVaults()
  const { pools } = usePools()
  const { profitShareAPY } = useStats()
  const { pageBackColor, boxShadowColor } = useThemeContext()
  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
      },
    }),
    [
      profitShareAPY,
      farmProfitSharingPool,
    ],
  )  
  
  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const { push } = useHistory()

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  
  return (
    <FarmContainer pageBackColor={pageBackColor}>
      <FarmContent>
          <WelcomeBackPart isMobile={isMobile}>
            <img src={isMobile ? WelcomeBackMobile : WelcomeBack} width="100%" alt="" />
            <NavPart>
              {
                isMobile ? <NavText>Welcome back, Farmer.</NavText>
                : <NavText>Welcome back,<br/>Farmer.</NavText>
              }
              <ButtonDiv>
                <NavButton onClick={()=>{
                  push("/farm")
                }}>Explore Farms</NavButton>
              </ButtonDiv>
            </NavPart>
          </WelcomeBackPart>
        <BottomPart>
        {vaultList.map((vaultSymbol, i) => {
          const token = groupOfVaults[vaultSymbol.directUrl]
          if(!token) return <></>;
          const tokenVault = get(vaultsData, token.hodlVaultId || vaultSymbol.directUrl)
          const isSpecialVault = token.liquidityPoolVault || token.poolVault

          let vaultPool
          if (isSpecialVault) {
            vaultPool = token.data
          } else {
            vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
          }
          return (
            <FarmCompInner key={i} boxShadowColor={boxShadowColor}>
              <HomeComponentInfo
                data={vaultList[i].backImg}
                text={vaultList[i].compText} 
                textColor={vaultList[i].textColor}
                token={token}
                vaultPool={vaultPool}
                tokenVault={tokenVault}
                url={vaultList[i].directUrl}
                tokenSymbol={vaultSymbol.directUrl}
                headIcon={vaultList[i].compIcon} 
              />
            </FarmCompInner>)
        })}
        </BottomPart>
      </FarmContent>
    </FarmContainer>
  )
}

export default Home
