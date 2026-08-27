import React, { useState } from 'react'
import { PiArrowsLeftRightBold } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { handleToggle } from '../../utilities/parsers'
import {
  Panel,
  PanelSection,
  PanelHead,
  PanelHeadTools,
  PanelTitle,
  Badge,
  UnitToggle,
  RangeDesc,
  BandWrap,
  BandTrack,
  BandMarker,
  BandEdges,
  RangeSummary,
  RangeFooter,
} from './style'

const decimalsFor = (lower, upper) => {
  const span = Math.abs(upper - lower)
  if (!(span > 0)) return 4
  return Math.min(8, Math.max(3, Math.ceil(-Math.log10(span)) + 2))
}

const positive = n => Number.isFinite(n) && n > 0

const ActiveRange = ({ data }) => {
  const {
    darkMode,
    bgColorNew,
    bgColorButton,
    borderColorBox,
    inputBorderColor,
    fontColor1,
    fontColor3,
    hoverColorButton,
  } = useThemeContext()
  const { price, inRange, lastRebalance, token0, token1, depositIndex } = data
  const [flipped, setFlipped] = useState(false)

  if (!price) {
    return (
      <Panel $cardbg={bgColorNew} $border={borderColorBox}>
        <PanelHead $border={borderColorBox}>
          <PanelTitle $fontcolor={fontColor1}>Active Range</PanelTitle>
        </PanelHead>
        <PanelSection>
          <RangeDesc $muted={fontColor3}>Loading range…</RangeDesc>
        </PanelSection>
      </Panel>
    )
  }

  const { lower, upper, current } = price

  // clData always quotes token0 in token1. This panel prices the vault's own
  // deposit token instead, so it inverts whenever that token is token1; the
  // toggle flips base and quote back the other way.
  const invertible = positive(lower) && positive(upper) && positive(current)
  const baseIsToken0 = invertible ? (depositIndex !== 1) !== flipped : true

  // Inverting reverses the axis, so the bounds swap places to stay ascending.
  const view = baseIsToken0
    ? { lower, upper, current }
    : { lower: 1 / upper, upper: 1 / lower, current: 1 / current }

  const base = baseIsToken0 ? token0 : token1
  const quote = baseIsToken0 ? token1 : token0
  const unit = `${base.symbol}/${quote.symbol}`

  const decimals = decimalsFor(view.lower, view.upper)
  const fmt = (n, withUnit = false) => {
    const s = n.toFixed(decimals)
    return withUnit ? `${s} ${unit}` : s
  }

  const span = view.upper - view.lower
  const markerPos = span > 0 ? ((view.current - view.lower) / span) * 100 : 50
  const rangeOk = inRange === true

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>Active Range</PanelTitle>
        <PanelHeadTools>
          {invertible && (
            <UnitToggle
              type="button"
              onClick={handleToggle(setFlipped)}
              title={`Show prices as ${quote.symbol}/${base.symbol}`}
              aria-label={`Show prices as ${quote.symbol}/${base.symbol}`}
              $border={inputBorderColor}
              $bg={darkMode ? bgColorButton : '#F0F4FF'}
              $fontcolor={fontColor1}
              $hoverbg={hoverColorButton}
            >
              <PiArrowsLeftRightBold />
              {unit}
            </UnitToggle>
          )}
          <Badge $ok={rangeOk}>{rangeOk ? 'in range' : 'out of range'}</Badge>
        </PanelHeadTools>
      </PanelHead>
      <PanelSection>
        <RangeDesc $muted={fontColor3}>
          Position is concentrated within these price bounds.
        </RangeDesc>

        <BandWrap>
          <BandTrack $inrange={rangeOk} />
          <BandMarker
            $pos={Math.min(100, Math.max(0, markerPos))}
            $fontcolor={fontColor1}
            $cardbg={bgColorNew}
          />
        </BandWrap>

        <BandEdges $muted={fontColor3}>
          <span>{fmt(view.lower)}</span>
          <span>{fmt(view.upper)}</span>
        </BandEdges>

        <RangeSummary $muted={fontColor3} $fontcolor={fontColor1}>
          <b>
            {fmt(view.lower)} – {fmt(view.upper, true)}
          </b>{' '}
          currently <b>{fmt(view.current)}</b>
        </RangeSummary>

        <RangeFooter $muted={fontColor3}>Last rebalance: {lastRebalance}</RangeFooter>
      </PanelSection>
    </Panel>
  )
}

export default ActiveRange
