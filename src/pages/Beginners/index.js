import React from 'react'
import { find, get } from 'lodash'
import BeginnersAPRSection from '../../components/BeginnersAPRSection'
import { useVaults } from '../../providers/Vault'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import DAI from '../../assets/images/logos/beginners/dai.svg'
import ETH from '../../assets/images/logos/beginners/eth.svg'
import USDT from '../../assets/images/logos/beginners/usdt.svg'
import USDC from '../../assets/images/logos/beginners/usdc.svg'

import { Container, Inner, UnitPart, HeaderTitle, HeaderDesc, CoinSection } from './style'

const IconAry = [
  { name: 'DAI', img: DAI },
  { name: 'WETH', img: ETH },
  { name: 'USDT', img: USDT },
  { name: 'USDC', img: USDC },
]

const Home = () => {
  const { vaultsData } = useVaults()
  const { pools } = usePools()
  const { pageBackColor, fontColor } = useThemeContext()

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <HeaderTitle>
          Welcome, Farmer
          <span aria-label="" role="img">
            👋
          </span>
        </HeaderTitle>
        <HeaderDesc>
          Choose among the four popular farms to get started your farming journey.
        </HeaderDesc>
        <CoinSection>
          {IconAry.map((el, i) => {
            const token = vaultsData[el.name]
            if (!token) return <></>

            const tokenVault = get(vaultsData, token.hodlVaultId || el.name)
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
              <UnitPart key={i} num={i}>
                <BeginnersAPRSection
                  token={token}
                  img={el.img}
                  vaultPool={vaultPool}
                  tokenVault={tokenVault}
                />
              </UnitPart>
            )
          })}
        </CoinSection>
      </Inner>
    </Container>
  )
}

export default Home
