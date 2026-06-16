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

export const HFGaugeWrap = styled.div`
  position: relative;
  margin: 8px 0 6px;
  padding-top: 4px;
`

export const HFGaugeTrack = styled.div`
  position: relative;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e8f5e4;
`

export const HFGaugeDanger = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.$pct}%;
  border-radius: 999px 0 0 999px;
  background: linear-gradient(90deg, #fca5a5 0%, #fdba74 100%);
`

export const HFTick = styled.div`
  position: absolute;
  top: -2px;
  left: ${props => props.$pos}%;
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: ${props => props.$color || '#101828'};
  transform: translateX(-50%);
  z-index: ${props => props.$z || 1};
`

export const HFEdges = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$muted};
  margin-bottom: 14px;
`

export const HFFooter = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$muted};
  margin-top: 4px;
`

export const LTVGaugeWrap = styled.div`
  position: relative;
  margin: 8px 0 6px;
  padding-top: 4px;
`

export const LTVGaugeTrack = styled.div`
  position: relative;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e8edf5;
`

export const LTVGaugeWarn = styled.div`
  position: absolute;
  left: ${props => props.$left}%;
  top: 0;
  height: 100%;
  width: ${props => props.$width}%;
  background: linear-gradient(90deg, #fde8d8 0%, #fecaca 100%);
`

export const LTVTick = styled.div`
  position: absolute;
  top: -2px;
  left: ${props => props.$pos}%;
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: ${props => props.$color || '#101828'};
  transform: translateX(-50%);
  z-index: ${props => props.$z || 1};
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
