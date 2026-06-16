import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { getExplorerLink } from '../../services/viem'
import { Panel, PanelSection, PanelHead, PanelTitle } from '../CLVault/style'
import { ProseDesc, AddressRow, AddressLink } from './style'

const SourceOfYieldPanel = ({ data }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3, hoverColorSide } = useThemeContext()
  const { collateral, debt, protocol, vaultAddress, strategyAddress, chainId, loopConfig } = data
  const explorer = getExplorerLink(chainId)
  const aavePool = loopConfig?.aavePool

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>Source of Yield</PanelTitle>
      </PanelHead>
      <PanelSection>
        <ProseDesc $muted={fontColor3} $fontcolor={fontColor1}>
          <p>
            The vault supplies <b>{collateral.symbol}</b> as collateral on <b>{protocol}</b> in{' '}
            <b>E-mode</b>, then borrows <b>{debt.symbol}</b> and folds the loop. The carry between{' '}
            <b>{collateral.symbol} staking yield</b> and the <b>{debt.symbol} borrow APR</b>{' '}
            compounds into share price each block. The fold magnifies the spread by the leverage
            multiple; the same multiple is applied to liquidation risk, which is bounded by the
            rebalance trigger and the slippage cap.
          </p>
        </ProseDesc>

        <AddressRow>
          {vaultAddress && (
            <AddressLink
              href={`${explorer}/address/${vaultAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              $border={borderColorBox}
              $bg={bgColorNew}
              $fontcolor={fontColor1}
              $hover={hoverColorSide}
            >
              Vault Address
            </AddressLink>
          )}
          {strategyAddress && (
            <AddressLink
              href={`${explorer}/address/${strategyAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              $border={borderColorBox}
              $bg={bgColorNew}
              $fontcolor={fontColor1}
              $hover={hoverColorSide}
            >
              Strategy Address
            </AddressLink>
          )}
          {aavePool && (
            <AddressLink
              href={`${explorer}/address/${aavePool}`}
              target="_blank"
              rel="noopener noreferrer"
              $border={borderColorBox}
              $bg={bgColorNew}
              $fontcolor={fontColor1}
              $hover={hoverColorSide}
            >
              Aave Market
            </AddressLink>
          )}
        </AddressRow>
      </PanelSection>
    </Panel>
  )
}

export default SourceOfYieldPanel
