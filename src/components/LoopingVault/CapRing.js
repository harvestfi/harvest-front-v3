import React from 'react'
import { capColorForPct } from './loopHelpers'

const CapRing = ({ pct = 0, size = 16, stroke = 3, track = 'rgba(128,128,128,0.25)' }) => {
  const clamped = Math.max(0, Math.min(100, Number(pct) || 0))
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - clamped / 100)
  const half = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <circle cx={half} cy={half} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={half}
        cy={half}
        r={r}
        fill="none"
        stroke={capColorForPct(clamped)}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${half} ${half})`}
      />
    </svg>
  )
}

export default CapRing
