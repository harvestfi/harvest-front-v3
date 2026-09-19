import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../providers/useThemeContext'
import { Panel, PanelSection, PanelHead, PanelTitle } from '../CLVault/style'
import { LoadingSpinner, SkeletonRow, SkeletonGauge } from './style'

const PanelLoading = ({ title, rows = 5 }) => {
  const { bgColorNew, borderColorBox, fontColor1, fontColor3, darkMode, highlightColor } =
    useThemeContext()
  const baseColor = darkMode ? '#2a2f36' : '#ECECEC'

  return (
    <Panel $cardbg={bgColorNew} $border={borderColorBox}>
      <PanelHead $border={borderColorBox}>
        <PanelTitle $fontcolor={fontColor1}>{title}</PanelTitle>
        <LoadingSpinner $color={fontColor3} aria-label="Loading" />
      </PanelHead>
      <PanelSection>
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
          <Skeleton height={12} width="85%" style={{ marginBottom: 14 }} />
          <SkeletonGauge>
            <Skeleton height={16} borderRadius={999} />
          </SkeletonGauge>
          <Skeleton height={10} width="40%" style={{ marginBottom: 16 }} />
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i}>
              <Skeleton height={12} width="42%" />
              <Skeleton height={12} width="28%" />
            </SkeletonRow>
          ))}
        </SkeletonTheme>
      </PanelSection>
    </Panel>
  )
}

export default PanelLoading
