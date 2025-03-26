import React from 'react'
import { useMeasure } from 'react-use'
import { useTooltip } from '@visx/tooltip'
import { Line } from '@visx/shape'
import styled from 'styled-components'
import AllocationOvertimeChartTooltip from './AllocationOvertimeChartTooltip'
import MainChart from './MainChart'
import Legend from './Legend'
import { useIpor } from '../../providers/Ipor'
import { generateColor } from '../../utilities/parsers'
import usePlasmaVaultHistoryQuery from '../../providers/Ipor/usePlasmaVaultHistoryQuery'
import { useVaults } from '../../providers/Vault'

// Styled Components
const ChartContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
  margin-top: 50px;
`

const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
`

const AOTChart = ({ chainId, vaultAddress }) => {
  const { vaultsData } = useVaults()
  const { data } = usePlasmaVaultHistoryQuery(chainId, vaultAddress.toLowerCase())
  const { getAllocationOvertimeData, getMarketDataKeys } = useIpor()
  const protocolDataKeys = getMarketDataKeys(data)

  const dataPoints = getAllocationOvertimeData(data)

  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip()

  // Responsive width and height
  const [containerRef, { width }] = useMeasure()
  const chartHeight = width * 0.5 // Maintain 2:1 aspect ratio

  if (dataPoints === undefined) return null

  return (
    <ChartContainer ref={containerRef}>
      <SvgContainer width={width} height={chartHeight}>
        <defs>
          {protocolDataKeys?.map(protocolDataKey => {
            const vaultAddr = protocolDataKey.marketId
            const vaultKey = Object.entries(vaultsData).find(
              ([, vault]) =>
                vault.chain === chainId &&
                vault.vaultAddress.toLowerCase() === vaultAddr.toLowerCase(),
            )?.[0]

            return (
              <linearGradient
                key={protocolDataKey.key}
                id={`allocation-over-time-${protocolDataKey.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={generateColor(vaultKey)} stopOpacity={1} />
                <stop offset="100%" stopColor={generateColor(vaultKey)} stopOpacity={0.8} />
              </linearGradient>
            )
          })}
          <linearGradient id="allocation-over-time-unallocated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#808080" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#353535" stopOpacity={0} />
          </linearGradient>
        </defs>
        <MainChart
          filteredDataPoints={dataPoints}
          width={width}
          height={chartHeight}
          hideTooltip={hideTooltip}
          showTooltip={showTooltip}
          marketDataKeys={protocolDataKeys}
        />
        {tooltipData && (
          <Line
            from={{ x: tooltipLeft, y: 0 }}
            to={{ x: tooltipLeft, y: chartHeight - 34 }}
            stroke="white"
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="5,2"
          />
        )}
      </SvgContainer>
      <Legend marketDataKeys={protocolDataKeys} chainId={chainId} />
      {tooltipOpen && tooltipData && (
        <AllocationOvertimeChartTooltip
          tooltipData={tooltipData}
          tooltipTop={tooltipTop}
          tooltipLeft={tooltipLeft}
          marketDataKeys={protocolDataKeys}
        />
      )}
    </ChartContainer>
  )
}

export default AOTChart
