import styled from 'styled-components'

const LoadingDiv = styled.div`
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`

const NoData = styled.div`
  color: ${props => props.$fontcolor};
`

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

const DottedUnderline = styled.span`
  text-decoration: underline dotted;
`

export {
  LoadingDiv,
  NoData,
  TooltipContainer,
  TooltipTotal,
  TooltipContent,
  ProtocolEntry,
  DottedUnderline,
}
