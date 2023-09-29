import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Div, Price } from './style'

const TotalValue = ({ icon, content, price }) => {
  const { borderColor, backColor, totalValueFontColor } = useThemeContext()
  return (
    <Container borderColor={borderColor} backColor={backColor}>
      <img src={icon} alt="" />
      <Div fontColor={totalValueFontColor}>{content}</Div>
      <Price>$&nbsp;{price}</Price>
    </Container>
  )
}

export default TotalValue
