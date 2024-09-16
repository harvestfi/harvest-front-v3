import React from 'react'
import { Container, Label } from './style'
import AnimatedDots from '../../AnimatedDots'

const ListItem = ({
  value,
  marginTop,
  weight,
  size,
  color,
  platform,
  chain,
  backColor,
  borderRadius,
  padding,
}) => {
  return (
    <Container marginTop={marginTop} fontWeight={weight} fontSize={size} fontColor={color}>
      <Label backColor={backColor} borderRadius={borderRadius} padding={padding}>
        {value === 'InfinityT%' || value === undefined ? <AnimatedDots /> : value}
        {platform ? ` (${platform})` : ''}
        {chain ? <img src={chain} width="12px" height="12px" alt="" /> : <></>}
      </Label>
    </Container>
  )
}

export default ListItem
