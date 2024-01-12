import styled from 'styled-components'

const LoadingDiv = styled.div`
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`

const NoData = styled.div`
  position: absolute;
  font-size: 14px;
  color: ${props => props.fontColor};
`

const FakeChartWrapper = styled.div`
  width: 100%;
  position: relative;
  filter: blur(4px);
`

export { LoadingDiv, NoData, FakeChartWrapper }
