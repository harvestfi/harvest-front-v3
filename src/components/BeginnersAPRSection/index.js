import React from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Percent, Section } from './style'
import { displayAPY, getTotalApy } from '../../utils'
import { DECIMAL_PRECISION } from '../../constants'
import DOT from '../../assets/images/logos/beginners/dot.svg'

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
      <Section>
        <img src={img} alt="" />
        <Percent>
          <img src={DOT} alt="" />
          {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
          &nbsp;APY
        </Percent>
      </Section>
    </Container>
  )
}

export default BeginnersAPRSection
