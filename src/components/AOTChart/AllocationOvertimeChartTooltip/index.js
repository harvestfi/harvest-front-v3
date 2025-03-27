import React from 'react'
import { format } from 'date-fns'
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip'
import styled from 'styled-components'
import ProtocolLabel from '../ProtocolLabel'
import { generateColor } from '../../../utilities/parsers'
import { useVaults } from '../../../providers/Vault'

// Styled Components
const TooltipContainer = styled(TooltipWithBounds)`
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0px !important;
`

const TooltipContent = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: #15191c;
  padding: 8px;
  font-size: 12px;
  color: white;
`

const TooltipText = styled.p`
  margin-bottom: 4px;
  color: #ffffff;
`

const ProtocolEntry = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ color }) => color};
`

// Utility Functions
const formatTooltipDate = date => format(new Date(date), 'dd/MM/yyyy HH:mm')

const ChartTooltip = ({ tooltipLeft, tooltipTop, children }) => {
  return (
    <TooltipContainer top={tooltipTop} left={tooltipLeft} style={defaultStyles}>
      <TooltipContent>{children}</TooltipContent>
    </TooltipContainer>
  )
}

const AllocationOvertimeChartTooltip = ({
  tooltipData,
  tooltipTop,
  tooltipLeft,
  marketDataKeys,
}) => {
  const { vaultsData } = useVaults()

  return (
    <ChartTooltip tooltipTop={tooltipTop} tooltipLeft={tooltipLeft}>
      <TooltipText>{formatTooltipDate(tooltipData.date)}</TooltipText>
      <TooltipText>Block: {tooltipData.blockNumber}</TooltipText>
      {marketDataKeys?.map(dataKey => {
        const { key, marketId } = dataKey
        const value = tooltipData.markets[key] || 0
        const sum = tooltipData.marketsSum || 0
        if (value <= 0) return null

        const vaultKey = Object.entries(vaultsData).find(
          ([, vault]) => vault.vaultAddress.toLowerCase() === marketId.toLowerCase(),
        )?.[0]

        const percentage = sum === 0 ? 0 : ((value / tooltipData.marketsSum) * 100).toFixed(2)

        return (
          <ProtocolEntry key={key} color={generateColor(vaultKey)}>
            <ProtocolLabel vaultKey={vaultKey} /> {percentage}%
          </ProtocolEntry>
        )
      })}
    </ChartTooltip>
  )
}

export default AllocationOvertimeChartTooltip
