import React from 'react'
import { find, get } from 'lodash'
import BeginnersAPRSection from '../../components/BeginnersAPRSection'
import { useVaults } from '../../providers/Vault'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import ETH from '../../assets/images/logos/beginnershome/eth-icon.svg'
import USDC from '../../assets/images/logos/beginnershome/usdc-icon.svg'

import { Container, Inner, UnitPart, HeaderTitle, HeaderDesc, CoinSection } from './style'

const IconAry = [
  { name: 'WETH_base', img: ETH },
  { name: 'USDC_base', img: USDC },
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
          Deposit any token from your wallet into one of the farms below to get started earning
          yield.
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
