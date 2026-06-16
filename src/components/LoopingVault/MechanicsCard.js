import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Panel, PanelSection, PanelHead, PanelTitle, Row } from '../CLVault/style'
import { ProseDesc } from './style'

const MechanicsCard = ({ data }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3 } = useThemeContext()
  const { collateral, debt, protocol, mechanics } = data

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
      </PanelSection>

      <PanelSection $divider $border={borderColorBox}>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <span>Target LTV</span>
          <b>{mechanics.targetLtv}</b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <span>Rebalance trigger (HF)</span>
          <b>{mechanics.rebalanceTrigger}</b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <span>Slippage cap</span>
          <b>{mechanics.slippageCap}</b>
        </Row>
      </PanelSection>
    </Panel>
  )
}

export default MechanicsCard
