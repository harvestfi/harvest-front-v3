import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { MyBalance, NewLabel } from '../../pages/AdvancedFarm/style'
import { BreakdownRow } from './style'
import { fmtInteractionCosts } from './loopHelpers'

const LoopFeesPanel = ({ data, isMobile }) => {
  const { darkMode, bgColorNew, borderColorBox, fontColor1, fontColor3, fontColor4 } =
    useThemeContext()
  const fees = data?.fees || {}
  const entryExit = fmtInteractionCosts(fees.entryCostBps30d, fees.exitCostBps30d)
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
    {
      label: (
        <>
          Typical interaction cost
          <PiQuestion
            className="question"
            data-tip
            id="loop-typical-interaction-cost"
            style={{ marginLeft: 4, flexShrink: 0 }}
          />
          <Tooltip
            id="loop-typical-interaction-cost"
            anchorSelect="#loop-typical-interaction-cost"
            backgroundColor={darkMode ? 'white' : '#101828'}
            borderColor={darkMode ? 'white' : 'black'}
            textColor={darkMode ? 'black' : 'white'}
            place={isMobile ? 'left' : 'top'}
            style={{ maxWidth: 280, lineHeight: 1.45 }}
          >
            Rolling 30-day median swap and fold overhead from real deposits and withdrawals — not
            gas fees.
          </Tooltip>
        </>
      ),
      value: entryExit,
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
