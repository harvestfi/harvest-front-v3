import React, { useCallback, useMemo } from 'react'

import { scaleTime, scaleLinear } from '@visx/scale'
import { max, extent, bisector } from '@visx/vendor/d3-array'
import { Group } from '@visx/group'
import { AreaStack, Bar } from '@visx/shape'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { format } from 'date-fns'
import { Grid } from '@visx/grid'
import { curveStep } from '@visx/curve'
import { localPoint } from '@visx/event'
import { formatNumberDisplay } from '../../../utilities/formats'
import { useIpor } from '../../../providers/Ipor'
import { useThemeContext } from '../../../providers/useThemeContext'

const textColorDark = 'rgba(255,255,255, 0.5)'
const textColorLight = 'rgba(0, 0, 0, 0.7)'
const tickLineColor = '#364867'
const gridLineColor = '#21273E'
const tickStyleDark = {
  fill: textColorDark,
  fontSize: '11px',
}
const tickStyleLight = {
  fill: textColorLight,
  fontSize: '11px',
}
const MARGIN = { top: 8, bottom: 34, left: 50, right: 10 }

const getDate = d => new Date(d.date)
const bisectDate = bisector(d => new Date(d.date)).left
const getStockValue = d => d.marketsSum

const MainChart = ({
  filteredDataPoints,
  width,
  height,
  hideTooltip,
  showTooltip,
  marketDataKeys,
}) => {
  const { getMapChartData } = useIpor()
  const { darkMode } = useThemeContext()
  const data = getMapChartData({ dataPoints: filteredDataPoints, marketDataKeys })
  const dataKeys = marketDataKeys.map(({ key }) => key)

  const chartHeight = height
  const boundWidth = width - MARGIN.left - MARGIN.right
  const boundHeight = chartHeight - MARGIN.top - MARGIN.bottom

  const xMax = Math.max(boundWidth, 0)
  const yMax = Math.max(boundHeight, 0)

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(filteredDataPoints, getDate),
      }),
    [xMax, filteredDataPoints],
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(filteredDataPoints, getStockValue) || 0],
        nice: true,
      }),
    [yMax, filteredDataPoints],
  )

  const handleTooltip = useCallback(
    event => {
      const { x, y } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x - MARGIN.left)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      let d = d0
      if (d1 && d0) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0
      }
      showTooltip({ tooltipData: d, tooltipLeft: x, tooltipTop: y })
    },
    [showTooltip, data, xScale],
  )

  if (width < 10 || dataKeys.length <= 0) return null

  return (
    <Group left={MARGIN.left} top={MARGIN.top}>
      <Grid
        xScale={xScale}
        yScale={yScale}
        width={boundWidth}
        height={boundHeight}
        strokeDasharray="5"
        numTicksRows={5}
        numTicksColumns={5}
        stroke={gridLineColor}
      />
      <AreaStack
        keys={dataKeys}
        data={data}
        x={d => xScale(getDate(d.data))}
        y0={d => yScale(d[0])}
        y1={d => yScale(d[1])}
        curve={curveStep}
      >
        {({ stacks, path }) =>
          stacks.map(stack => (
            <path
              key={`stack-${stack.key}`}
              d={path(stack) || ''}
              fill={`url(#allocation-over-time-${stack.key})`}
            />
          ))
        }
      </AreaStack>
      <AxisBottom
        top={boundHeight}
        scale={xScale}
        tickFormat={value => format(new Date(value), 'M/d')}
        stroke={tickLineColor}
        tickLineProps={{ stroke: tickLineColor }}
        tickLabelProps={{ style: darkMode ? tickStyleDark : tickStyleLight }}
        numTicks={7}
      />
      <AxisLeft
        scale={yScale}
        tickFormat={value => `${formatNumberDisplay(value, false)}%`}
        numTicks={5}
        stroke={tickLineColor}
        tickLineProps={{ stroke: tickLineColor }}
        tickLabelProps={{ style: darkMode ? tickStyleDark : tickStyleLight }}
      />
      <Bar
        x={0}
        y={0}
        width={boundWidth}
        height={boundHeight}
        fill="transparent"
        onTouchStart={handleTooltip}
        onTouchMove={handleTooltip}
        onMouseMove={handleTooltip}
        onMouseLeave={hideTooltip}
      />
    </Group>
  )
}

export default MainChart
