import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import ListItem from '../ListItem'
import { useRate } from '../../../providers/Rate'
import { useThemeContext } from '../../../providers/useThemeContext'
import { formatAge, formatDateTime, formatNumber } from '../../../utilities/formats'
import { Content, DetailView, FlexDiv, NewLabel } from './style'

const ActionRow = ({ info }) => {
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const {
    darkMode,
    switchMode,
    backColor,
    borderColorTable,
    hoverColorRow,
    fontColor,
  } = useThemeContext()

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  return (
    <DetailView
      className="latest-yield-row"
      borderColor={borderColorTable}
      hoverColor={hoverColorRow}
      mode={switchMode}
      background={backColor}
    >
      <FlexDiv padding={isMobile ? '15px 25px' : '0'}>
        <Content width="30%" color={fontColor} paddingRight={isMobile ? '8px' : '0px'}>
          <div className="timestamp" data-tip data-for={`tooltip-latest-yield-${info.timestamp}`}>
            {formatAge(info.timestamp)} ago
          </div>
          <ReactTooltip
            id={`tooltip-latest-yield-${info.timestamp}`}
            backgroundColor={darkMode ? 'white' : '#101828'}
            borderColor={darkMode ? 'white' : 'black'}
            textColor={darkMode ? 'black' : 'white'}
            place="top"
          >
            <NewLabel size="10px" height="14px" weight="600">
              <div dangerouslySetInnerHTML={formatDateTime(info.timestamp)} />
            </NewLabel>
          </ReactTooltip>
        </Content>
        <Content width="57%">
          <ListItem
            weight={600}
            size={12}
            height={20}
            color="#5FCF76"
            justifyContent="end"
            value={`${
              info.netChangeUsd < 0.01
                ? `<${currencySym}0.01`
                : `≈${currencySym}${formatNumber(info.netChangeUsd * Number(currencyRate), 2)}`
            }`}
          />
          <ListItem
            weight={500}
            size={10}
            height={20}
            color="#6988FF"
            justifyContent="end"
            value={info.tokenSymbol}
          />
        </Content>
      </FlexDiv>
    </DetailView>
  )
}
export default ActionRow
