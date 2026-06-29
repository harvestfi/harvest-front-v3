import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Panel,
  PanelSection,
  PanelHead,
  PanelTitle,
  Badge,
  RangeDesc,
  Row,
  BandEdges,
} from '../CLVault/style'
import HelpTip from './HelpTip'
import { HFGaugeWrap, HFGaugeTrack, HFGaugeDanger, HFTick, HFFooter } from './style'

const LIQUIDATION_HF = 1.0
const GAUGE_MAX_HF = 1.2

const fmtHf = (n, d = 3) => {
  if (n == null || !Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

const hfToPos = (hf, min = LIQUIDATION_HF, max = GAUGE_MAX_HF) => {
  if (hf == null || !Number.isFinite(hf)) return 50
  const span = max - min
  if (!(span > 0)) return 50
  return Math.min(100, Math.max(0, ((hf - min) / span) * 100))
}

const HealthFactorPanel = ({ data }) => {
  const { darkMode, bgColorNew, borderColorBox, fontColor1, fontColor3 } = useThemeContext()
  const { position, lastRebalance } = data
  const pos = position

  if (!pos) {
    return (
      <Panel $cardbg={bgColorNew} $border={borderColorBox}>
        <PanelHead $border={borderColorBox}>
          <PanelTitle $fontcolor={fontColor1}>Health Factor</PanelTitle>
        </PanelHead>
        <PanelSection>
          <RangeDesc $muted={fontColor3}>Loading health factor…</RangeDesc>
        </PanelSection>
      </Panel>
    )
  }

  const currentHf = pos.healthFactor
  const targetHf = pos.targetHealth
  const rebalanceTrigger = pos.rebalanceTrigger
  const forcedDeleverage = pos.forcedDeleverage

  const healthOk = currentHf != null && rebalanceTrigger != null && currentHf >= rebalanceTrigger

  const dangerPct = hfToPos(forcedDeleverage ?? 1.015)

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>
          Health Factor
          <PiQuestion
            className="question"
            data-tip
            id="loop-hf-title"
            style={{ cursor: 'help', marginLeft: 6, fontSize: 14 }}
          />
          <Tooltip
            id="loop-hf-title"
            anchorSelect="#loop-hf-title"
            backgroundColor={darkMode ? 'white' : '#101828'}
            borderColor={darkMode ? 'white' : 'black'}
            textColor={darkMode ? 'black' : 'white'}
            place="bottom"
            style={{ maxWidth: 300, textAlign: 'left', lineHeight: 1.45 }}
          >
            <div>
              Aave V3&apos;s safety ratio: (collateral × liquidation threshold) ÷ debt.
              <br />
              Liquidation at 1.000; higher is safer.
            </div>
          </Tooltip>
        </PanelTitle>
        {currentHf != null && <Badge $ok={healthOk}>HF {fmtHf(currentHf)}</Badge>}
      </PanelHead>

      <PanelSection>
        <RangeDesc $muted={fontColor3}>
          Liquidation at HF {fmtHf(LIQUIDATION_HF)}. Vault deleverages when HF dips below the
          trigger.
        </RangeDesc>

        <HFGaugeWrap>
          <HFGaugeTrack>
            <HFGaugeDanger $pct={dangerPct} />
            {forcedDeleverage != null && (
              <HFTick $pos={hfToPos(forcedDeleverage)} $color="#ef4444" $z={2} />
            )}
            {rebalanceTrigger != null && (
              <HFTick $pos={hfToPos(rebalanceTrigger)} $color="#f97316" $z={2} />
            )}
            {currentHf != null && <HFTick $pos={hfToPos(currentHf)} $color="#101828" $z={3} />}
            {targetHf != null && <HFTick $pos={hfToPos(targetHf)} $color="#16a34a" $z={2} />}
          </HFGaugeTrack>
        </HFGaugeWrap>

        <BandEdges $muted={fontColor3}>
          <span>{fmtHf(LIQUIDATION_HF)} (liquidation)</span>
          <span>{fmtHf(GAUGE_MAX_HF)}</span>
        </BandEdges>

        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <HelpTip
            id="loop-hf-current"
            darkMode={darkMode}
            tip="Current vault health factor on Aave."
          >
            Current HF
          </HelpTip>
          <b>{fmtHf(currentHf)}</b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <HelpTip
            id="loop-hf-target"
            darkMode={darkMode}
            tip="Target health factor the vault aims to maintain."
          >
            Target HF
          </HelpTip>
          <b>{fmtHf(targetHf)}</b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <HelpTip
            id="loop-hf-rebalance"
            darkMode={darkMode}
            tip="When HF falls below this level, the vault rebalances leverage back toward target."
          >
            Rebalance trigger
          </HelpTip>
          <b>{rebalanceTrigger != null ? `< ${fmtHf(rebalanceTrigger)}` : '—'}</b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0 0">
          <HelpTip
            id="loop-hf-deleverage"
            darkMode={darkMode}
            tip="Emergency deleverage threshold — vault aggressively reduces leverage below this HF."
          >
            Forced deleverage
          </HelpTip>
          <b>{forcedDeleverage != null ? `< ${fmtHf(forcedDeleverage)}` : '—'}</b>
        </Row>
        {lastRebalance && lastRebalance !== '—' && (
          <HFFooter $muted={fontColor3}>Last rebalance: {lastRebalance}.</HFFooter>
        )}
      </PanelSection>
    </Panel>
  )
}

export default HealthFactorPanel
