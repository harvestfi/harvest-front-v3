import React from 'react'
import { PiInfo } from 'react-icons/pi'
import { useThemeContext } from '../../../providers/useThemeContext'
import { EQUITY_MARKET_HOURS_NOTICE, equityMarketHoursInKindNotice } from '../../../constants'
import { NoticeBox, NoticeText } from './style'

// Blue, like the notice IPOR shows on its own app, so the warning reads the same in both.
const TINTS = {
  light: { back: '#EFF8FF', border: '#B2DDFF', icon: '#1570EF', font: '#1849A9' },
  dark: {
    back: 'rgba(46, 144, 250, 0.10)',
    border: 'rgba(46, 144, 250, 0.40)',
    icon: '#53B1FD',
    font: '#D1E9FF',
  },
}

// inKindSymbol: the strategy token symbol when Revert in kind is active on the vault.
const MarketHoursNotice = ({ margin, inKindSymbol }) => {
  const { darkMode } = useThemeContext()
  const tint = TINTS[darkMode ? 'dark' : 'light']

  return (
    <NoticeBox
      role="note"
      $backcolor={tint.back}
      $bordercolor={tint.border}
      $iconcolor={tint.icon}
      $margin={margin}
    >
      <PiInfo className="notice-icon" aria-hidden="true" />
      <NoticeText $fontcolor={tint.font}>
        {inKindSymbol ? equityMarketHoursInKindNotice(inKindSymbol) : EQUITY_MARKET_HOURS_NOTICE}
      </NoticeText>
    </NoticeBox>
  )
}

export default MarketHoursNotice
