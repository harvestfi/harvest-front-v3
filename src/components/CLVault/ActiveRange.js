import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Panel,
  PanelSection,
  PanelHead,
  PanelTitle,
  Badge,
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

const ActiveRange = ({ data }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3 } = useThemeContext()
  const { price, inRange, lastRebalance } = data

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

  const { lower, upper, current, unit } = price
  const decimals = decimalsFor(lower, upper)
  const fmt = (n, withUnit = false) => {
    const s = n.toFixed(decimals)
    return withUnit ? `${s} ${unit}` : s
  }

  const span = upper - lower
  const markerPos = span > 0 ? ((current - lower) / span) * 100 : 50
  const rangeOk = inRange === true

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>Active Range</PanelTitle>
        <Badge $ok={rangeOk}>{rangeOk ? 'in range' : 'out of range'}</Badge>
      </PanelHead>
      <PanelSection>
        <RangeDesc $muted={fontColor3}>
          Position is concentrated within these price bounds.
        </RangeDesc>

        <BandWrap>
          <BandTrack $inrange={rangeOk} />
          <BandMarker $pos={markerPos} $fontcolor={fontColor1} $cardbg={bgColorNew} />
        </BandWrap>

        <BandEdges $muted={fontColor3}>
          <span>{fmt(lower)}</span>
          <span>{fmt(upper)}</span>
        </BandEdges>

        <RangeSummary $muted={fontColor3} $fontcolor={fontColor1}>
          <b>
            {fmt(lower)} – {fmt(upper, true)}
          </b>{' '}
          currently <b>{fmt(current)}</b>
        </RangeSummary>

        <RangeFooter $muted={fontColor3}>Last rebalance: {lastRebalance}</RangeFooter>
      </PanelSection>
    </Panel>
  )
}

export default ActiveRange
