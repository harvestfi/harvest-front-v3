import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Panel,
  PanelSection,
  PanelHead,
  PanelTitle,
  RangeDesc,
  Row,
  BandEdges,
} from '../CLVault/style'
import HelpTip from './HelpTip'
import { LTVGaugeWrap, LTVGaugeTrack, LTVGaugeWarn, LTVTick, TagRow, TagBadge } from './style'

const fmtAmt = (n, d = 2) => {
  if (!n || n === 0) return '0'
  return n.toLocaleString(undefined, { maximumFractionDigits: d })
}

const fmtUsd = n => {
  if (!n || n === 0) return '$0'
  return `$${Math.round(n).toLocaleString()}`
}

const pct = n => `${(n * 100).toFixed(1)}%`

const ltvToPos = (ltv, min, max) => {
  const span = max - min
  if (!(span > 0) || ltv == null) return 50
  return Math.min(100, Math.max(0, ((ltv - min) / span) * 100))
}

const scaleBounds = (current, target, liquidation) => {
  const min = Math.max(0.5, Math.floor(Math.min(current, target, liquidation) * 10 - 1) / 10)
  const max = Math.min(0.99, Math.ceil(Math.max(current, target, liquidation) * 20) / 20)
  return { min, max: Math.max(max, min + 0.05) }
}

const PositionPanel = ({ data }) => {
  const { darkMode, bgColorNew, borderColorBox, fontColor1, fontColor3 } = useThemeContext()
  const { collateral, debt, protocol, position } = data
  const pos = position

  if (!pos) {
    return (
      <Panel $cardbg={bgColorNew} $border={borderColorBox}>
        <PanelHead $border={borderColorBox}>
          <PanelTitle $fontcolor={fontColor1}>Position</PanelTitle>
        </PanelHead>
        <PanelSection>
          <RangeDesc $muted={fontColor3}>Loading position…</RangeDesc>
        </PanelSection>
      </Panel>
    )
  }

  const collateralUsd = pos.collateralUsd ?? 0
  const debtUsd = pos.debtUsd ?? 0
  const netEquity = pos.netUsd ?? collateralUsd - debtUsd

  const { min: scaleMin, max: scaleMax } = scaleBounds(pos.ltv, pos.targetLtv, pos.liquidationLtv)

  const warnLeft = ltvToPos(pos.targetLtv, scaleMin, scaleMax)
  const warnWidth = Math.max(0, ltvToPos(pos.liquidationLtv, scaleMin, scaleMax) - warnLeft)

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>Position</PanelTitle>
      </PanelHead>

      <PanelSection>
        <TagRow>
          <TagBadge>E-mode</TagBadge>
          <TagBadge>Fold</TagBadge>
          {pos.leverage > 0 && (
            <TagBadge $bg="rgba(22, 82, 240, 0.1)" $color="#1652f0">
              {pos.leverage.toFixed(1)}× leverage
            </TagBadge>
          )}
        </TagRow>

        <RangeDesc $muted={fontColor3}>
          Looped collateral on {protocol}. Net equity grows from the carry between staking yield and
          borrow APR.
        </RangeDesc>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="0 0 10px">
          <HelpTip
            id="loop-pos-collateral"
            darkMode={darkMode}
            tip={`Total ${collateral.symbol} supplied as collateral on Aave.`}
          >
            Collateral ({collateral.symbol})
          </HelpTip>
          <b>
            {fmtAmt(pos.collateral)} {collateral.symbol} ({fmtUsd(collateralUsd)})
          </b>
        </Row>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="0 0 10px">
          <HelpTip
            id="loop-pos-debt"
            darkMode={darkMode}
            tip={`Total ${debt.symbol} borrowed against collateral.`}
          >
            Debt ({debt.symbol})
          </HelpTip>
          <b>
            {fmtAmt(pos.debt)} {debt.symbol} ({fmtUsd(debtUsd)})
          </b>
        </Row>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="0 0 10px">
          <HelpTip
            id="loop-pos-equity"
            darkMode={darkMode}
            tip="Collateral value minus debt — the vault's net equity."
          >
            Net equity
          </HelpTip>
          <b>{fmtUsd(netEquity)}</b>
        </Row>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="0 0 6px">
          <HelpTip
            id="loop-pos-ltv"
            darkMode={darkMode}
            tip="Loan-to-value: debt divided by collateral value."
          >
            LTV (loan-to-value)
          </HelpTip>
          <b>{pct(pos.ltv)}</b>
        </Row>

        <LTVGaugeWrap>
          <LTVGaugeTrack>
            <LTVGaugeWarn $left={warnLeft} $width={warnWidth} />
            <LTVTick $pos={ltvToPos(pos.ltv, scaleMin, scaleMax)} $color="#101828" $z={3} />
            <LTVTick $pos={ltvToPos(pos.targetLtv, scaleMin, scaleMax)} $color="#16a34a" $z={2} />
            <LTVTick
              $pos={ltvToPos(pos.liquidationLtv, scaleMin, scaleMax)}
              $color="#ef4444"
              $z={2}
            />
          </LTVGaugeTrack>
        </LTVGaugeWrap>

        <BandEdges $muted={fontColor3}>
          <span>{pct(scaleMin)}</span>
          <span>{pct(scaleMax)}</span>
        </BandEdges>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="0 0 6px">
          <HelpTip
            id="loop-pos-target-ltv"
            darkMode={darkMode}
            tip="Target loan-to-value the vault aims to maintain."
          >
            Target LTV
          </HelpTip>
          <b>{pct(pos.targetLtv)}</b>
        </Row>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0 0">
          <HelpTip
            id="loop-pos-liq-ltv"
            darkMode={darkMode}
            tip="LTV at which Aave liquidation is triggered."
          >
            Liquidation LTV
          </HelpTip>
          <b>{pct(pos.liquidationLtv)}</b>
        </Row>
      </PanelSection>
    </Panel>
  )
}

export default PositionPanel
