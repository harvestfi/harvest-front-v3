import styled from 'styled-components'

const ChartWrapper = styled.div`
  .bottom-chart {
    border-radius: 5px;

    .recharts-wrapper {
      .recharts-reference-area {
        path {
          stroke: ${props => props.$bgcolorchart};
          fill: ${props => props.$bgcolorchart};
        }
      }
    }
  }

  .chart-slider-wrapper {
    width: 100%;
    margin-top: 10px;

    .chart-slider {
      margin: 0px auto 25px auto;

      .rc-slider-track {
        background-color: #15b088;
      }

      .rc-slider-step {
        .rc-slider-dot-active {
          border-color: #15b088;
        }
      }

      .rc-slider-handle {
        border-color: #15b088;
      }

      .rc-slider-mark {
        .rc-slider-mark-text {
          width: 100%;
        }
        .rc-slider-mark-text-active {
          color: #15b088;
        }
      }
    }
  }
`

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
  color: ${props => props.$fontcolor};
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

  @media screen and (max-width: 400px) {
    width: 260px;
  }
`

const FakeChartWrapper = styled.div`
  width: 100%;
  position: relative;
  filter: blur(4px);
`

const LoaderWrapper = styled.div`
  height: ${props => props.$height};
  display: flex;
  justify-content: center;
  align-items: center;
`

const ChartPlaceholder = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.$height || '346px'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
  background: ${props => (props.$darkmode ? '#212933' : props.$bgcolor || '#fff')};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(52, 211, 153, 0.08) 0%,
      rgba(52, 211, 153, 0.03) 30%,
      rgba(52, 211, 153, 0.02) 60%,
      rgba(52, 211, 153, 0.1) 100%
    );
    z-index: 1;
  }
`

const PlaceholderChartWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(8px);
  opacity: 0.3;
  z-index: 0;
`

const PlaceholderText = styled.div`
  position: relative;
  z-index: 2;
  color: ${props => props.$fontcolor || '#ffffff'};
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 20px;
  line-height: 1.5;

  @media screen and (max-width: 992px) {
    font-size: 14px;
  }
`

export {
  ChartWrapper,
  LoadingDiv,
  NoData,
  FakeChartWrapper,
  LoaderWrapper,
  ChartPlaceholder,
  PlaceholderChartWrapper,
  PlaceholderText,
}
