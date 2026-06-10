import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Panel, PanelSection, PanelHead, PanelTitle, WeightBar, WeightSeg, Row } from './style'

const COMPOSITION_COLORS = ['#B8A4F8', '#4F6AF5']

const pct = n => `${(n * 100).toFixed(0)}%`

const fmt = (n, d = 2) => {
  if (!n || n === 0) return (0).toFixed(d)
  if (n < 10 ** -d) {
    const sigFigs = Math.max(d, Math.ceil(-Math.log10(n)) + 2)
    return n.toLocaleString(undefined, { maximumFractionDigits: Math.min(sigFigs, 10) })
  }
  return n.toLocaleString(undefined, { maximumFractionDigits: d })
}

const PositionComposition = ({ data }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3 } = useThemeContext()
  const { token0, token1, weights, amounts, position } = data
  const pos = position || { vaultShares: 0, underlying0: 0, underlying1: 0 }

  if (!weights || !amounts) {
    return (
      <Panel $cardbg={bgColorNew} $border={borderColorBox}>
        <PanelHead $border={borderColorBox}>
          <PanelTitle $fontcolor={fontColor1}>Position Composition</PanelTitle>
        </PanelHead>
        <PanelSection>
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="2px 0">
            <span>Loading composition…</span>
          </Row>
        </PanelSection>
      </Panel>
    )
  }

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>Position Composition</PanelTitle>
      </PanelHead>
      <PanelSection>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="0 0 8px">
          <b>
            {pct(weights.token0)} {token0.symbol}
          </b>
          <b>
            {pct(weights.token1)} {token1.symbol}
          </b>
        </Row>

        <WeightBar style={{ marginTop: 0 }}>
          <WeightSeg $pct={weights.token0 * 100} $color={COMPOSITION_COLORS[0]} />
          <WeightSeg $pct={weights.token1 * 100} $color={COMPOSITION_COLORS[1]} />
        </WeightBar>

        <Row
          $muted={fontColor3}
          $fontcolor={fontColor1}
          $divider
          $border={borderColorBox}
          $pad="12px 0 6px"
        >
          <span>Vault holdings ({token0.symbol})</span>
          <b>{fmt(amounts.token0)}</b>
        </Row>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <span>Vault holdings ({token1.symbol})</span>
          <b>{fmt(amounts.token1)}</b>
        </Row>

        <Row
          $muted={fontColor3}
          $fontcolor={fontColor1}
          $divider
          $border={borderColorBox}
          $pad="12px 0 6px"
        >
          <span>Your slice (shares)</span>
          <b>{fmt(pos.vaultShares)}</b>
        </Row>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <span>
            Your slice ({token0.symbol} / {token1.symbol})
          </span>
          <b>
            {fmt(pos.underlying0)} / {fmt(pos.underlying1)}
          </b>
        </Row>
      </PanelSection>
    </Panel>
  )
}

export default PositionComposition
