import React from 'react'
import { useMeasure } from 'react-use'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import styled from 'styled-components'
import { format } from 'date-fns'
import Legend from './Legend'
import { useIpor } from '../../providers/Ipor'
import { generateColor } from '../../utilities/parsers'
import usePlasmaVaultHistoryQuery from '../../providers/Ipor/usePlasmaVaultHistoryQuery'
import { useVaults } from '../../providers/Vault'
import ProtocolLabel from './ProtocolLabel'

// Styled Components for Tooltip
const TooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1px;
  border-radius: 5px;
  font-size: 12px;
`

const TooltipTotal = styled.p`
  margin: 0;
  font-weight: bold;
`

const TooltipContent = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: #15191c;
  padding: 8px;
  font-size: 12px;
  color: white;
`

const ProtocolEntry = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ color }) => color};
`

const formatTooltipDate = date => format(new Date(date ?? new Date()), 'dd/MM/yyyy HH:mm')

// Styled Component for Chart Container
const ChartContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
  margin-top: 50px;
  opacity: 1; /* Ensures full opacity */
`

const AOTChart = ({ chainId, vaultAddress, iporHvaultsLFAPY }) => {
  const { vaultsData } = useVaults()
  const { data } = usePlasmaVaultHistoryQuery(chainId, vaultAddress.toLowerCase())
  const { getAllocationOvertimeData, getMarketDataKeys } = useIpor()
  const protocolDataKeys = getMarketDataKeys(data)

  const renderTooltipContent = o => {
    const { payload, label } = o

    return (
      <TooltipContainer>
        <TooltipContent>
          <TooltipTotal>{formatTooltipDate(label)}</TooltipTotal>
          {payload
            .filter(entry => entry.value !== 0 && entry.value !== null)
            .map((entry, index) => {
              const regex = /0x[a-fA-F0-9]{40}/ // Regular expression to match Ethereum address format
              const address = entry.dataKey.match(regex)[0] ?? ''
              const value = entry.value || 0

              if (value <= 0) return null

              const vaultKey = Object.entries(vaultsData).find(
                ([, vault]) => vault.vaultAddress.toLowerCase() === address.toLowerCase(),
              )?.[0]
              return (
                <ProtocolEntry
                  key={`item-${index}`}
                  color={generateColor(iporHvaultsLFAPY, vaultKey)}
                >
                  <ProtocolLabel vaultKey={vaultKey} /> {entry.value.toFixed(2)}%
                </ProtocolEntry>
              )
            })}
        </TooltipContent>
      </TooltipContainer>
    )
  }

  const dataPoints = getAllocationOvertimeData(data)
  if (dataPoints?.length > 0) {
    dataPoints.forEach(item => {
      if (item.marketsSum !== 0) {
        Object.keys(item.markets).forEach(key => {
          item.markets[key] = item.markets[key] === null ? 0 : item.markets[key]
          item.markets[key] = (item.markets[key] / item.marketsSum) * 100
        })
        // Normalize marketsSum to 100
        item.marketsSum = 100
      }
    })
  }

  // Responsive width and height
  const [containerRef, { width }] = useMeasure()
  const chartHeight = width * 0.5 // Maintain 2:1 aspect ratio

  if (dataPoints === undefined) return null

  return (
    <ChartContainer ref={containerRef}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <AreaChart data={dataPoints}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-Axis with custom date format */}
          <XAxis
            dataKey="date"
            tickFormatter={tick => {
              const date = new Date(tick)
              return `${date.getMonth() + 1}/${date.getDate()}` // Format as M/D
            }}
            ticks={
              dataPoints.length > 0
                ? dataPoints
                    .filter((_, index) => index % Math.ceil(dataPoints.length / 5) === 0)
                    .map(item => item.date)
                : []
            }
          />
          {/* Y-Axis with range from 0 to 100% */}
          <YAxis
            domain={[0, 100]} // Set Y-axis to show from 0 to 100%
            tickFormatter={tick => `${tick}%`} // Format Y-axis ticks as percentages
            ticks={Array.from({ length: 6 }, (_, index) => index * 20)} // Generates 6 ticks: [0, 20, 40, 60, 80, 100]
            interval={0} // Show every tick (we are specifying the ticks array manually)
          />
          <Tooltip content={renderTooltipContent} />
          {protocolDataKeys?.map(protocolDataKey => {
            const vaultAddr = protocolDataKey.marketId
            const vaultKey = Object.entries(vaultsData).find(
              ([, vault]) =>
                vault.chain === chainId &&
                vault.vaultAddress.toLowerCase() === vaultAddr.toLowerCase(),
            )?.[0]

            return (
              <Area
                key={protocolDataKey.key}
                type="monotone"
                dataKey={`markets.${protocolDataKey.key}`}
                stackId="1"
                stroke={generateColor(iporHvaultsLFAPY, vaultKey)}
                fill={generateColor(iporHvaultsLFAPY, vaultKey)}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
      <Legend
        marketDataKeys={protocolDataKeys}
        chainId={chainId}
        iporHvaultsLFAPY={iporHvaultsLFAPY}
      />
    </ChartContainer>
  )
}

export default AOTChart
