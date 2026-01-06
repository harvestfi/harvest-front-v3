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
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  height: 346px;

  @media screen and (max-width: 1291px) {
    height: 365px;
  }

  @media screen and (max-width: 1262px) {
    height: 365px;
  }

  @media screen and (max-width: 1035px) {
    height: 365px;
  }

  @media screen and (max-width: 992px) {
    height: 365px;
  }
`

const NoData = styled.div`
  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 18px;
  }
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
  background: #212933;

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
  color: #ffffff;
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
  ChartPlaceholder,
  PlaceholderChartWrapper,
  PlaceholderText,
}
