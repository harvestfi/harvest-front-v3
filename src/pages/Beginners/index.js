import React from 'react'
import { find, get } from 'lodash'
import BeginnersAPRSection from '../../components/BeginnersAPRSection'
import { useVaults } from '../../providers/Vault'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import DAI from '../../assets/images/logos/beginnershome/dai-icon.svg'
import ETH from '../../assets/images/logos/beginnershome/eth-icon.svg'
import USDT from '../../assets/images/logos/beginnershome/usdt-icon.svg'
import USDC from '../../assets/images/logos/beginnershome/usdc-icon.svg'
import DAIBottom from '../../assets/images/logos/beginnershome/dai-bottom.svg'
import ETHBottom from '../../assets/images/logos/beginnershome/eth-bottom.svg'
import USDTBottom from '../../assets/images/logos/beginnershome/usdt-bottom.svg'
import USDCBottom from '../../assets/images/logos/beginnershome/usdc-bottom.svg'

import { Container, Inner, UnitPart, HeaderTitle, HeaderDesc, CoinSection } from './style'

const IconAry = [
  { name: 'DAI', img: DAI, bottomImg: DAIBottom },
  { name: 'WETH', img: ETH, bottomImg: ETHBottom },
  { name: 'USDT', img: USDT, bottomImg: USDTBottom },
  { name: 'USDC', img: USDC, bottomImg: USDCBottom },
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
              <UnitPart key={i}>
                <BeginnersAPRSection
                  token={token}
                  img={el.img}
                  bottomImg={el.bottomImg}
                  num={i}
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
