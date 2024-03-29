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
  width: 400px;

  @media screen and (max-width: 1262px) {
    width: 330px;
  }

  @media screen and (max-width: 992px) {
    width: 400px;
    font-size: 12px;
  }

  @media screen and (max-width: 556px) {
    width: 330px;
  }
`

const FakeChartWrapper = styled.div`
  width: 100%;
  position: relative;
  filter: blur(4px);
`

export { LoadingDiv, NoData, FakeChartWrapper }
