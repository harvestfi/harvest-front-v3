import React from 'react'
import styled from 'styled-components'
import ProtocolLabel from '../ProtocolLabel'
import { generateColor } from '../../../utilities/parsers'
import { useVaults } from '../../../providers/Vault'

// Styled Components
const LegendContainer = styled.div`
  display: flex;
  width: 100%; // Make it responsive
  max-width: 100%;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-start; // Align items properly
  margin-top: 12px;
  margin-bottom: 20px;
  padding: 20px;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const ColorDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`

const Label = styled.div`
  font-size: 12px;
  color: var(--text-muted); // Assumes CSS variable for muted text
`

const Legend = ({ marketDataKeys, chainId }) => {
  const { vaultsData } = useVaults()

  return (
    <LegendContainer>
      {marketDataKeys?.map((dataKey, index) => {
        const vaultAddr = dataKey.marketId
        const vaultKey = Object.entries(vaultsData).find(([, vault]) => {
          return (
            vault.chain === chainId && vault.vaultAddress.toLowerCase() === vaultAddr.toLowerCase()
          )
        })?.[0]

        return (
          <LegendItem key={index}>
            <ColorDot color={generateColor(vaultKey ?? '')} />
            <Label>
              <ProtocolLabel vaultKey={vaultKey} />
            </Label>
          </LegendItem>
        )
      })}
    </LegendContainer>
  )
}

export default Legend
