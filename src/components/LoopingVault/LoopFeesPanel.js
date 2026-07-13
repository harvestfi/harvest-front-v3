import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { MyBalance, NewLabel, FlexDiv } from '../../pages/AdvancedFarm/style'
import { fmtInteractionCosts } from './loopHelpers'

const LoopFeesPanel = ({ data, isMobile }) => {
  const { darkMode, bgColorNew, borderColorBox, fontColor1, fontColor3, fontColor4 } =
    useThemeContext()
  const fees = data?.fees || {}

  const entryExit = fmtInteractionCosts(fees.entryCostBps30d, fees.exitCostBps30d)

  const rowStyle = index => ({
    borderBottom: index < 2 ? `1px solid ${borderColorBox}` : undefined,
  })

  return (
    <MyBalance
      $marginbottom={isMobile ? '20px' : '25px'}
      $backcolor={bgColorNew}
      $bordercolor={borderColorBox}
    >
      <NewLabel
        $size={isMobile ? '12px' : '14px'}
        $weight="600"
        $height={isMobile ? '20px' : '24px'}
        $fontcolor={fontColor4}
        $padding={isMobile ? '10px 15px' : '10px 15px'}
        $borderbottom={`1px solid ${borderColorBox}`}
      >
        Fees
      </NewLabel>

      <FlexDiv
        $justifycontent="space-between"
        $padding={isMobile ? '10px 15px' : '10px 15px'}
        style={rowStyle(0)}
      >
        <NewLabel $size={isMobile ? '12px' : '14px'} $weight="500" $fontcolor={fontColor3}>
          Entry / Exit fee
        </NewLabel>
        <NewLabel $size={isMobile ? '12px' : '14px'} $weight="600" $fontcolor={fontColor1}>
          {fees.entryFee || '0%'} / {fees.exitFee || '0%'}
        </NewLabel>
      </FlexDiv>

      <FlexDiv
        $justifycontent="space-between"
        $padding={isMobile ? '10px 15px' : '10px 15px'}
        style={rowStyle(1)}
      >
        <NewLabel $size={isMobile ? '12px' : '14px'} $weight="500" $fontcolor={fontColor3}>
          Profit share
        </NewLabel>
        <NewLabel $size={isMobile ? '12px' : '14px'} $weight="600" $fontcolor={fontColor1}>
          {fees.profitSharePct != null ? `${fees.profitSharePct}%` : '10%'}
        </NewLabel>
      </FlexDiv>

      <FlexDiv
        $justifycontent="space-between"
        $padding={isMobile ? '10px 15px' : '10px 15px'}
        style={rowStyle(2)}
      >
        <NewLabel
          $size={isMobile ? '12px' : '14px'}
          $weight="500"
          $fontcolor={fontColor3}
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          Typical interaction cost
          <PiQuestion className="question" data-tip id="loop-typical-interaction-cost" />
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
        </NewLabel>
        <NewLabel
          $size={isMobile ? '12px' : '14px'}
          $weight="600"
          $fontcolor={fontColor1}
          style={{ textAlign: 'right', maxWidth: '55%' }}
        >
          {entryExit}
        </NewLabel>
      </FlexDiv>
    </MyBalance>
  )
}

export default LoopFeesPanel
