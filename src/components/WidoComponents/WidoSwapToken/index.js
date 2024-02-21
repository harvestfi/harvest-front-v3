import React from 'react'
import AnimatedDots from '../../AnimatedDots'
import { Container, Text, Vault } from './style'

const WidoSwapToken = ({ img, name, value }) => {
  return (
    <Container>
      <img src={img} width={22} height={22} alt="" />
      <Vault>
        {name !== '' ? (
          <Text color="#027A48" size="12px" height="18px" weight={700}>
            {name}
          </Text>
        ) : (
          <AnimatedDots />
        )}
        <Text color="#027948" size="12px" height="16px" weight={500}>
          {value}
        </Text>
      </Vault>
    </Container>
  )
}
export default WidoSwapToken
