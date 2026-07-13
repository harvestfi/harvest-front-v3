import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../providers/useThemeContext'
import { Panel, PanelSection, PanelHead, PanelTitle, Row } from '../CLVault/style'
import { ProseDesc, FlowDiagram } from './style'

const ValueOrSkeleton = ({ value, loading }) => {
  if (value != null && value !== '—') return <b>{value}</b>
  if (loading) return <Skeleton height={12} width={56} />
  return <b>—</b>
}

const MechanicsCard = ({ data }) => {
  const { darkMode, bgColorNew, borderColorBox, fontColor1, fontColor3, highlightColor } =
    useThemeContext()
  const { collateral, debt, protocol, mechanics } = data
  const loading = !data?.live
  const baseColor = darkMode ? '#2a2f36' : '#ECECEC'

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>How this vault works</PanelTitle>
      </PanelHead>
      <PanelSection>
        <ProseDesc $muted={fontColor3} $fontcolor={fontColor1}>
          <p>
            Incoming <b>{debt.symbol}</b> is routed into <b>{collateral.symbol}</b> and supplied as
            collateral to <b>{protocol}</b> in <b>E-mode</b>. The vault borrows <b>{debt.symbol}</b>
            , re-supplies it as more <b>{collateral.symbol}</b>, and folds the loop until the target
            LTV is reached. The carry between staking yield and borrow APR compounds into share
            price. No claim or re-supply action is required.
          </p>
          <p>
            When the health factor approaches the rebalance trigger, the vault deleverages by
            selling collateral, repaying debt, and reverting to target LTV. Swaps are TWAP-gated and
            capped to limit price impact.
          </p>
        </ProseDesc>

        <FlowDiagram
          $muted={fontColor3}
          $fontcolor={fontColor1}
          $nodebg={darkMode ? '#1a2035' : '#f0f4ff'}
        >
          <span className="node">{debt.symbol}</span>
          <span className="arrow">→</span>
          <span className="node">{collateral.symbol}</span>
          <span className="arrow">→</span>
          <span className="node">Supply</span>
          <span className="arrow">→</span>
          <span className="node">Borrow</span>
          <span className="arrow">↻</span>
        </FlowDiagram>
      </PanelSection>

      <PanelSection $divider $border={borderColorBox}>
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
            <span>Target LTV</span>
            <ValueOrSkeleton value={mechanics.targetLtv} loading={loading} />
          </Row>
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
            <span>Rebalance trigger (HF)</span>
            <ValueOrSkeleton value={mechanics.rebalanceTrigger} loading={loading} />
          </Row>
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
            <span>Slippage cap</span>
            <b>{mechanics.slippageCap}</b>
          </Row>
        </SkeletonTheme>
      </PanelSection>
    </Panel>
  )
}

export default MechanicsCard
