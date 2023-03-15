import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Div, Price } from './style'

const TotalValue = ({ icon, content, price }) => {
  const { borderColor } = useThemeContext()
  return (
    <Container borderColor={borderColor}>
      <Div>
        <img src={icon} alt="" />
        {content}
      </Div>
      <Price>$&nbsp;{price}</Price>
    </Container>
  )
}

export default TotalValue
