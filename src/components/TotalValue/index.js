import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Div, Price, InfoIcon, NewLabel } from './style'
import Info from '../../assets/images/logos/earn/help-circle.svg'

const TotalValue = ({ icon, content, price, toolTipTitle, toolTip }) => {
  const { borderColor, backColor, totalValueFontColor } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  return (
    <Container borderColor={borderColor} backColor={backColor}>
      <img src={icon} alt="" />
      <Div fontColor={totalValueFontColor}>
        {content}
        <InfoIcon
          className="info"
          width={isMobile ? 10 : 16}
          src={Info}
          alt=""
          data-tip
          data-for={toolTipTitle}
        />
        <ReactTooltip
          id={toolTipTitle}
          backgroundColor="black"
          borderColor="black"
          textColor="white"
        >
          <NewLabel
            size={isMobile ? '10px' : '12px'}
            height={isMobile ? '15px' : '18px'}
            weight="600"
            color="white"
          >
            {toolTip}
          </NewLabel>
        </ReactTooltip>
      </Div>
      <Price>$&nbsp;{price}</Price>
    </Container>
  )
}

export default TotalValue
