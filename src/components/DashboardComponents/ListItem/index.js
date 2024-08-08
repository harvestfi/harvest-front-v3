import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Content, Label } from './style'
import ARBball from '../../../assets/images/chains/ARBball.svg'

const ListItem = ({
  weight,
  size,
  height,
  color,
  label,
  icon,
  value,
  marginBottom,
  marginTop,
  boostedToken,
}) => {
  const { fontColor } = useThemeContext()
  return (
    <Container fontColor={fontColor} marginBottom={marginBottom} marginTop={marginTop}>
      {label ? (
        <Label>
          {icon && icon !== '' ? (
            <img src={`${icon.toLowerCase()}.svg`} width="16px" height="16px" alt="" />
          ) : (
            <></>
          )}
          <Content weight={weight} size={size} height={height} color={color}>
            {label}
          </Content>
        </Label>
      ) : (
        ''
      )}
      {value ? (
        boostedToken ? (
          <Content weight={weight} size={size} height={height} color={color}>
            {value}
            <img src={ARBball} className="boost-img" alt="" />
          </Content>
        ) : (
          <Content weight={weight} size={size} height={height} color={color}>
            {value}
          </Content>
        )
      ) : (
        ''
      )}
    </Container>
  )
}
export default ListItem
