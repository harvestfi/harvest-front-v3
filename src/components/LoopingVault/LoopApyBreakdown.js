import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  MyBalance,
  NewLabel,
  Tip,
  TipTop,
  IconPart,
  CrossDiv,
} from '../../pages/AdvancedFarm/style'
import TickIcon from '../../assets/images/logos/tick-icon.svg'
import TickCross from '../../assets/images/logos/tick-cross.svg'
import { BreakdownRow } from './style'
import { fmtPct } from './loopHelpers'

const LoopApyBreakdown = ({ data, isMobile, showTip, onCloseTip }) => {
  const {
    bgColorNew,
    borderColorBox,
    fontColor1,
    fontColor3,
    fontColor4,
    darkMode,
    highlightColor,
  } = useThemeContext()
  const rows = data?.apy?.breakdown || []
  const loading = !data?.live
  const baseColor = darkMode ? '#2a2f36' : '#ECECEC'
  const size = isMobile ? '12px' : '14px'

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
        $padding={isMobile ? '10px 15px' : '10px 15px'}
        $borderbottom={`1px solid ${borderColorBox}`}
      >
        APY Breakdown
      </NewLabel>

      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {rows.map((row, index) => (
          <BreakdownRow
            key={row.label}
            $size={size}
            $muted={fontColor3}
            $fontcolor={fontColor1}
            $padding={isMobile ? '10px 15px' : '10px 15px'}
            $border={index < rows.length - 1 ? `1px solid ${borderColorBox}` : 'none'}
          >
            <div className="breakdown-label">{row.label}</div>
            <div className="breakdown-value">
              {row.value != null ? (
                fmtPct(row.value)
              ) : loading ? (
                <Skeleton height={12} width={56} />
              ) : (
                '—'
              )}
            </div>
          </BreakdownRow>
        ))}
      </SkeletonTheme>

      <Tip $display={showTip ? 'block' : 'none'}>
        <TipTop>
          <IconPart>
            <img src={TickIcon} alt="tick icon" style={{ marginRight: '5px' }} />
            <NewLabel $size="14px" $weight="600" $height="20px" $fontcolor="#027A48">
              Tip
            </NewLabel>
          </IconPart>
          <CrossDiv onClick={onCloseTip}>
            <img src={TickCross} alt="tick cross" />
          </CrossDiv>
        </TipTop>
        <NewLabel $size="14px" $height="20px" $weight="400" $fontcolor="#027A48">
          For a quick guide on tracking yield sources in your Portfolio, check out our 5-minute
          article &quot;
          <a
            href="https://docs.harvest.finance/general-info/yield-sources-on-harvest-how-to-get-and-track-them"
            style={{ fontWeight: '600', color: '#027A48' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            Yield Sources on Harvest &ndash; How to Track Them.
          </a>
          &quot;
        </NewLabel>
      </Tip>
    </MyBalance>
  )
}

export default LoopApyBreakdown
