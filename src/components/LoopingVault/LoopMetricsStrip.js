import React from 'react'
import { MetricsCover, MetricBox, MetricTitle, MetricValue } from './style'

const LoopMetricsStrip = ({ items = [], bgColor, borderColor, fontColor1, fontColor3 }) => (
  <MetricsCover $bordercolor={borderColor}>
    {items.map(({ title, value }, index) => (
      <MetricBox
        key={title}
        $backcolor={bgColor}
        $bordercolor={borderColor}
        $index={index}
        $count={items.length}
      >
        <MetricTitle $fontcolor={fontColor3}>{title}</MetricTitle>
        <MetricValue $fontcolor={fontColor1}>{value}</MetricValue>
      </MetricBox>
    ))}
  </MetricsCover>
)

export default LoopMetricsStrip
