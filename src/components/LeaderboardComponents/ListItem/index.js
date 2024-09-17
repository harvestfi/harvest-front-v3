import React from 'react'
import { Container, Label, ChainImage } from './style'
import AnimatedDots from '../../AnimatedDots'

const ListItem = ({
  value,
  marginTop,
  marginRight,
  weight,
  size,
  color,
  platform,
  chain,
  backColor,
  borderRadius,
  padding,
  textDecoration,
  imgMargin,
}) => {
  return (
    <Container
      marginTop={marginTop}
      fontWeight={weight}
      fontSize={size}
      fontColor={color}
      marginRight={marginRight}
    >
      <Label
        backColor={backColor}
        borderRadius={borderRadius}
        padding={padding}
        textDecoration={textDecoration}
      >
        {value === 'InfinityT%' || value === undefined || value === 'NaN%' || value === 'Here' ? (
          <AnimatedDots />
        ) : (
          value
        )}
        {platform ? ` (${platform})` : ''}
        {chain ? (
          <ChainImage src={chain} imgMargin={imgMargin} className="chainImage" alt="" />
        ) : (
          <></>
        )}
      </Label>
    </Container>
  )
}

export default ListItem
