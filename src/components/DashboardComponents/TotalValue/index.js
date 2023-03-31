import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Div, Price } from './style'

const TotalValue = ({ icon, content, price }) => {
  const { borderColor } = useThemeContext()
  return (
    <Container borderColor={borderColor}>
      <img src={icon} alt="" />
      <Div>{content}</Div>
      <Price>$&nbsp;{price}</Price>
    </Container>
  )
}

export default TotalValue
