import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Content, Label, /*Percent, TextInner*/ } from './style'

const ListItem = ({ weight, size, height, color, label, icon, percent, up, value }) => {
  const { fontColor/*, dashboardListItemPercentBack, dashboardListItemPercentColor*/ } = useThemeContext()
  return (
    <Container fontColor={fontColor}>
      { label ? 
          <Label>
            {
              icon && icon !== "" ? 
                <img src={`${icon.toLowerCase()}.svg`} width={"16px"} height={"16px"} alt="" /> : 
                <></>
            }
            
            <Content weight={weight} size={size} height={height} color={color}>{label}</Content>
            
            {/* { percent ? 
              <Percent dashboardBack={dashboardListItemPercentBack} dashboardColor={dashboardListItemPercentColor} up={up}>
                <TextInner>{percent}</TextInner>
              </Percent> : ""
            } */}
          </Label> :
          ""
      }
      { value ? 
      <Content weight={weight} size={size} height={height} color={color}>{value}</Content> : ""}
      
    </Container>
  )
}
export default ListItem
