import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Panel, PanelSection, PanelHead, PanelTitle, BulletList, Row } from './style'

const MechanicsCard = ({ data }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3 } = useThemeContext()
  const { token0, token1, feeTier } = data

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>How this vault works</PanelTitle>
      </PanelHead>
      <PanelSection>
        <BulletList $muted={fontColor3} $fontcolor={fontColor1}>
          <li>
            Deposits are placed into a{' '}
            <b>concentrated liquidity position around the current price</b>, so your capital earns
            trading fees only within the active range.
          </li>
          <li>
            <b>AERO emissions auto-compound</b> back into the position — there is nothing to claim
            or re-stake manually.
          </li>
          <li>
            When the price drifts beyond the <b>deviation trigger</b>, the vault automatically
            <b> re-centers the range</b> around the new price.
          </li>
          <li>
            Rebalances are <b>TWAP-gated</b>, comparing spot against a time-weighted average price
            to prevent sandwich attacks and price manipulation.
          </li>
        </BulletList>
      </PanelSection>

      <PanelSection $divider $border={borderColorBox}>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="6px 0">
          <span>
            {token0.symbol}/{token1.symbol} fee tier
          </span>
          <b>{feeTier}</b>
        </Row>
      </PanelSection>
    </Panel>
  )
}

export default MechanicsCard
