import styled from 'styled-components'

export const HelpRowLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export const ProseDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.55;
    color: ${props => props.$muted};
  }

  b {
    color: ${props => props.$fontcolor};
    font-weight: 600;
  }
`

export const AddressRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`

export const AddressLink = styled.a`
  flex: 1;
  min-width: 120px;
  text-align: center;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid ${props => props.$border};
  background: ${props => props.$bg};
  color: ${props => props.$fontcolor};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.$hover || props.$bg};
    color: ${props => props.$fontcolor};
    text-decoration: none;
  }
`

export const LTVGaugeWrap = styled.div`
  position: relative;
  margin: 8px 0 6px;
  overflow: visible;
`

export const LTVGaugeTrack = styled.div`
  position: relative;
  height: 16px;
  border-radius: 999px;
  /* left = safer lower LTV, right = liquidation risk */
  background: linear-gradient(
    90deg,
    #2f9e2f 0%,
    #5dcf46 22%,
    #7ee06a 42%,
    #fbbf24 68%,
    #f97316 84%,
    #ef4444 100%
  );
`

export const LTVTick = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.$pos}%;
  width: 2px;
  height: ${props => (props.$primary ? '24px' : '22px')};
  border-radius: 1px;
  background: ${props => props.$color || '#101828'};
  transform: translate(-50%, -50%);
  z-index: ${props => props.$z || 1};
  pointer-events: none;
`

export const MetricsCover = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 25px;

  @media screen and (max-width: 992px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    border-radius: 12px;
    border: 2px solid ${props => props.$bordercolor};
    margin-bottom: 20px;
    overflow: hidden;
  }
`

export const MetricBox = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  border: 2px solid ${props => props.$bordercolor};
  background: ${props => props.$backcolor};
  padding: 24px;
  height: 120px;

  @media screen and (max-width: 1320px) {
    padding: 16px;
  }

  @media screen and (max-width: 992px) {
    height: 70px;
    padding: 8px 13px;
    border-radius: 0;
    border: none;

    ${props => {
      const i = props.$index
      const cols = 2
      const isLeft = i % cols === 0
      const isTop = i < cols
      const rules = []
      if (isLeft) rules.push(`border-right: 2px solid ${props.$bordercolor};`)
      if (isTop) rules.push(`border-bottom: 2px solid ${props.$bordercolor};`)
      return rules.join(' ')
    }}
  }
`

export const MetricTitle = styled.div`
  color: ${props => props.$fontcolor};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  @media screen and (max-width: 1170px) {
    font-size: 12px;
  }
`

export const MetricValue = styled.div`
  color: ${props => props.$fontcolor};
  font-weight: 600;
  letter-spacing: -0.6px;
  font-size: 22px;
  line-height: 32px;

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 22px;
  }
`

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`

export const TagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.$bg || 'rgba(93, 207, 70, 0.12)'};
  color: ${props => props.$color || '#2f9e2f'};
`

export const FlowDiagram = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$muted};

  span.node {
    padding: 6px 10px;
    border-radius: 8px;
    background: ${props => props.$nodebg || '#f0f4ff'};
    color: ${props => props.$fontcolor};
  }

  span.arrow {
    opacity: 0.6;
  }
`

export const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$fontcolor};
  margin: 16px 0 8px;
`

export const OutputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  @media screen and (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const OutputCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: ${props => props.$bg};
`

export const OutputTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$muted};
  margin-bottom: 6px;
`

export const OutputValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$fontcolor};
  line-height: 1.2;
`

export const OutputSub = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$muted};
  margin-top: 4px;
`

export const DetailsBox = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.$bg};
`

export const DetailsTitle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$muted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: ${props => (props.$open ? '8px' : '0')};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
    transform: rotate(${props => (props.$open ? '180deg' : '0deg')});
  }
`

export const DetailsBody = styled.div`
  display: ${props => (props.$open ? 'block' : 'none')};
`

export const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: ${props => props.$padding || '10px 15px'};
  border-bottom: ${props => props.$border || 'none'};

  .breakdown-label {
    flex: 1 1 auto;
    min-width: 0;
    font-size: ${props => props.$size || '14px'};
    font-weight: 500;
    line-height: 1.45;
    color: ${props => props.$muted};
    word-break: break-word;
  }

  .breakdown-value {
    flex: 0 1 auto;
    max-width: 48%;
    text-align: right;
    font-size: ${props => props.$size || '14px'};
    font-weight: 600;
    line-height: 1.45;
    color: ${props => props.$fontcolor};
    word-break: break-word;
  }
`

export const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${props => props.$color || '#6F78AA'};
  border-top-color: transparent;
  animation: loop-panel-spin 0.7s linear infinite;
  flex-shrink: 0;

  @keyframes loop-panel-spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const SkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SkeletonGauge = styled.div`
  margin: 8px 0 6px;
`
