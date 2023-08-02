import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Percent } from './style'
import { displayAPY, getTotalApy } from '../../utils'
import { DECIMAL_PRECISION } from '../../constants'
import DOT from '../../assets/images/logos/beginners/dot.svg'

const BeginnersAPRSection = ({ token, img, vaultPool, tokenVault }) => {
  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const { fontColor, backColor, borderColor } = useThemeContext()

  return (
    <Container backColor={backColor} borderColor={borderColor}>
      <img src={img} alt="" />
      <Percent fontColor={fontColor}>
        <img src={DOT} alt="" />
        {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
        &nbsp;APY
      </Percent>
    </Container>
  )
}

export default BeginnersAPRSection
