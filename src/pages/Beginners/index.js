import React, { useState, useEffect } from 'react'
import { find, get } from 'lodash'
import { Link } from 'react-router-dom'
import { BiRightArrowAlt } from 'react-icons/bi'
import BeginnersAPRSection from '../../components/BeginnersAPRSection'
import { useVaults } from '../../providers/Vault'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import ETH from '../../assets/images/logos/beginnershome/eth-icon.svg'
import USDC from '../../assets/images/logos/beginnershome/usdc-icon.svg'

import {
  Container,
  TopSection,
  TopContainer,
  Inner,
  UnitPart,
  HeaderTitle,
  HeaderDesc,
  HeaderBadge,
  CoinSection,
} from './style'

const IconAry = [
  { name: 'USDbC_base', img: USDC },
  { name: 'WETH_base', img: ETH },
]

const Home = () => {
  const { vaultsData } = useVaults()
  const { pools } = usePools()
  const { pageBackColor, fontColor } = useThemeContext()
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.has('utm_source') || queryParams.has('utm_medium')) {
      setShowBadge(true) // Don't show the Badge if the parameters are present
    }
  }, [])

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <TopSection>
        <TopContainer>
          <HeaderTitle>
            Welcome, Farmer
            <span aria-label="" role="img">
              👋
            </span>
          </HeaderTitle>
          <HeaderDesc>
            {showBadge
              ? 'Receive $10 in FARM for converting $5 or more in USDC or ETH into one of the following farms*.'
              : 'Get started with crypto farming with our easy-to-use USDC and ETH farms.'}
          </HeaderDesc>
          {showBadge && (
            <HeaderBadge>
              <div className="badge-text">
                *Only for participants of our Coinbase Quest campaign
              </div>
              <Link className="badge-btn" to="/faq">
                Read more
                <BiRightArrowAlt />
              </Link>
            </HeaderBadge>
          )}
        </TopContainer>
      </TopSection>
      <Inner>
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
