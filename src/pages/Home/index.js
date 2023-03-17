import React, { useMemo } from 'react'
import { get, find } from 'lodash'
import {
  FarmContainer,
  FarmContent,
  FarmCompInner,
  BottomPart,
  FarmHeader,
  Title,
  Desc,
  ProfitShare,
} from './style'
import HomeComponentInfo from '../../components/HomeComponentInfo'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS, directDetailUrl } from '../../constants'
import ProfitSharingContainer from '../../components/ProfitSharing'

const vaultList = [
  { compText: 'Stablecoin', directUrl: 'notional_DAI' },
  { compText: 'Blue Chip', directUrl: 'convex_cvxCRV' },
  { compText: 'LSD', directUrl: 'crvSTETH' },
  { compText: 'NFT', directUrl: 'LOOKS' },
]

const Home = () => {
  const { vaultsData } = useVaults()
  const { pools } = usePools()
  const { profitShareAPY } = useStats()
  const { pageBackColor } = useThemeContext()
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
    [profitShareAPY, farmProfitSharingPool],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }

  return (
    <FarmContainer pageBackColor={pageBackColor}>
      <FarmHeader>
        <Title>Welcome home, farmer.</Title>
        <Desc>Browse our latest earning opportunities.</Desc>
      </FarmHeader>
      <FarmContent>
        <BottomPart>
          {vaultList.map((vaultSymbol, i) => {
            const token = groupOfVaults[vaultSymbol.directUrl]
            if (!token) return <></>
            const tokenVault = get(vaultsData, token.hodlVaultId || vaultSymbol.directUrl)
            const isSpecialVault = token.liquidityPoolVault || token.poolVault

            let vaultPool
            if (isSpecialVault) {
              vaultPool = token.data
            } else {
              vaultPool = find(
                pools,
                pool => pool.collateralAddress === get(tokenVault, `vaultAddress`),
              )
            }
            return (
              <FarmCompInner key={i}>
                <HomeComponentInfo
                  text={vaultList[i].compText}
                  token={token}
                  vaultPool={vaultPool}
                  tokenVault={tokenVault}
                  url={vaultList[i].directUrl}
                />
              </FarmCompInner>
            )
          })}
        </BottomPart>
        <ProfitShare>
          <ProfitSharingContainer height={"100%"} />
        </ProfitShare>
      </FarmContent>
    </FarmContainer>
  )
}

export default Home
