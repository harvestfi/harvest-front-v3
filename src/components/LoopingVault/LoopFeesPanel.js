import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { MyBalance, NewLabel } from '../../pages/AdvancedFarm/style'
import { BreakdownRow } from './style'

const LoopFeesPanel = ({ data, isMobile }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3, fontColor4 } = useThemeContext()
  const fees = data?.fees || {}
  const size = isMobile ? '12px' : '14px'
  const pad = isMobile ? '10px 15px' : '10px 15px'

  const rows = [
    {
      label: 'Entry / Exit fee',
      value: `${fees.entryFee || '0%'} / ${fees.exitFee || '0%'}`,
    },
    {
      label: 'Profit share',
      value: fees.profitSharePct != null ? `${fees.profitSharePct}%` : '10%',
    },
  ]

  return (
    <MyBalance
      $marginbottom={isMobile ? '28px' : '40px'}
      $backcolor={bgColorNew}
      $bordercolor={borderColorBox}
    >
      <NewLabel
        $size={size}
        $weight="600"
        $height={isMobile ? '20px' : '24px'}
        $fontcolor={fontColor4}
        $padding={pad}
        $borderbottom={`1px solid ${borderColorBox}`}
      >
        Fees
      </NewLabel>

      {rows.map((row, index) => (
        <BreakdownRow
          key={index}
          $size={size}
          $muted={fontColor3}
          $fontcolor={fontColor1}
          $padding={pad}
          $border={index < rows.length - 1 ? `1px solid ${borderColorBox}` : 'none'}
        >
          <div className="breakdown-label" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {row.label}
          </div>
          <div className="breakdown-value">{row.value}</div>
        </BreakdownRow>
      ))}
    </MyBalance>
  )
}

export default LoopFeesPanel
