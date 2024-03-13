import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import { formatNumber } from '../../utils'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Div, Price, InfoIcon, NewLabel } from './style'
import Info from '../../assets/images/logos/earn/info.svg'

const TotalValue = ({ content, price, toolTipTitle, toolTip }) => {
  const { borderColor, backColor, totalValueFontColor } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  return (
    <Container borderColor={borderColor} backColor={backColor}>
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
          backgroundColor="#101828"
          borderColor="black"
          textColor="white"
          place="bottom"
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
      <Price>
        {parseFloat(price) === 0
          ? '$0.00'
          : parseFloat(price) < 0.01
          ? '<$0.01'
          : `$${formatNumber(price, 2)}`}
      </Price>
    </Container>
  )
}

export default TotalValue
