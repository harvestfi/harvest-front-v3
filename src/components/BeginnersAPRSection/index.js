import React from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Percent, Section, TopSection, Network } from './style'
import { displayAPY, getTotalApy } from '../../utils'
import { DECIMAL_PRECISION } from '../../constants'
import DOT from '../../assets/images/logos/beginners/dot.svg'
import Bottom from '../../assets/images/logos/beginnershome/bottom.svg'
import Base from '../../assets/images/logos/beginnershome/base.svg'

const BeginnersAPRSection = ({ token, img, num, vaultPool, tokenVault }) => {
  const { push } = useHistory()
  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  return (
    <Container
      num={num}
      onClick={() => {
        const address = isSpecialVault
          ? token.data.collateralAddress
          : token.vaultAddress || token.tokenAddress
        push(`/beginner/${address}`)
      }}
    >
      <TopSection>
        <Network>
          <img src={Base} alt="" />
          Base
        </Network>
        <Percent>
          <img src={DOT} alt="" />
          {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
          &nbsp;APY
        </Percent>
      </TopSection>
      <Section>
        <img className="token-icon" width={240} height={240} src={img} alt="" />
      </Section>
      <img className="bottom" src={Bottom} alt="" />
    </Container>
  )
}

export default BeginnersAPRSection
