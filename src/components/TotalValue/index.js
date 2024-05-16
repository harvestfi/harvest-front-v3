import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { formatNumber } from '../../utilities/formats'
import { useThemeContext } from '../../providers/useThemeContext'
import AnimatedDots from '../AnimatedDots'
import { Container, Div, Price, NewLabel } from './style'
import { useRate } from '../../providers/Rate'

const TotalValue = ({ content, price, toolTipTitle, toolTip, connected, farmTokenListLength }) => {
  const { borderColor, backColor, fontColor1, fontColor3 } = useThemeContext()
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])
  return (
    <Container
      borderColor={borderColor}
      backColor={backColor}
      isNetProfit={content === 'Total Net Profit' ? 'true' : 'false'}
    >
      <Div fontColor3={fontColor3}>
        {content}
        <PiQuestion className="question" data-tip data-for={toolTipTitle} />
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
      <Price fontColor1={content === 'Total Net Profit' ? '#00D26B' : fontColor1}>
        {!connected ? (
          `${currencySym}0.00`
        ) : farmTokenListLength === 0 ? (
          `${currencySym}0.00`
        ) : parseFloat(price) === 0 ? (
          content === 'Rewards' ? (
            `${currencySym}0.00`
          ) : (
            <AnimatedDots />
          )
        ) : content === 'Total Net Profit' && parseFloat(price) === -1 ? (
          `${currencySym}0.00`
        ) : parseFloat(price) < 0.01 ? (
          `<${currencySym}0.01`
        ) : (
          `${currencySym}${formatNumber(price * Number(currencyRate), 2)}`
        )}
      </Price>
    </Container>
  )
}

export default TotalValue
