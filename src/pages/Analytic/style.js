import styled from 'styled-components'

const Container = styled.div`
  // margin-left: 320px;
  width: 100%;
  min-height: 100vh;

  background: ${props => props.pageBackColor};
  transition: 0.25s;
  @media screen and (min-width: 1921px) {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 992px) {
    margin: 0;
  }
`

const Content = styled.div`
  padding: 70px 76px 50px 76px;

  @media screen and (max-width: 992px) {
    padding: 16px 10px;
  }
`

const FarmStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;

  @media screen and (max-width: 992px) {
    flex-direction: column;
    margin: 0;
  }
`

const FarmSubTitle = styled.h2`
  position: relative;

  font-size: ${props => (props.size ? props.size : '16px')};
  font-weight: ${props => (props.bold ? 'bold' : '700')};
  line-height: ${props => (props.lineHeight ? props.lineHeight : 'auto')};
  height: ${props => (props.height ? props.height : 'auto')};

  margin: 0 30px;

  a {
    color: black;
  }
`

const EmissionsCountdownText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 17.07px;
  margin-bottom: 10px;
  width: 100%;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: ${props => props.fontColor};
  transition: 0.25s;
`

const StatsBoxTitle = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  // margin-bottom: 10px;
  margin: 20px 30px 10px 30px;
`

const StatsBox = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  justify-content: start;
  position: relative;
  align-items: ${props => props.align || 'center'};

  ${props =>
    props.compNum === 1
      ? `
    background: linear-gradient(239.37deg, rgba(252, 172, 61, 0.8) 0%, rgba(255, 168, 47, 0.66) 98%) !important;
    color: white !important;
  `
      : props.compNum === 2
      ? `
      // background: #ffffff; 
      color: black;
    `
      : props.compNum === 3
      ? `
      background: linear-gradient(223.19deg, #27AE60 2.14%, rgba(39, 174, 96, 0.66) 78.85%) !important;
      color: white !important;
    `
      : ``}
  transition: 0.25s;
  // box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.borderColor};
  color: ${props => props.fontColor};
  background: ${props => props.backColor};

  border-radius: 12px 12px 10px 10px;
  // padding-top: 20px;
  margin-bottom: 10px;
  width: ${props => props.width || '-webkit-fill-available'};
  height: ${props => props.height || '152px'};
  min-height: ${props => props.minHeight || '152px'};
  margin: ${props => props.margin || 'unset'};

  img.effect {
    position: absolute;
    bottom: -1px;
    left: -2px;
    border-radius: 0 0 10px 10px;
    width: 100.5%;
  }

  .emission-header {
    background: linear-gradient(47.48deg, #ffa599 0.85%, #ffdd59 83.16%);
    width: 100%;
    height: 70%;
    border-radius: 10px 10px 0 0;
    position: relative;
    margin-bottom: 70px;

    .rect {
      position: absolute;
      bottom: -60px;
      left: calc(50% - 60px);
      width: 120px;
      min-height: 120px;
      display: flex;
    }
  }

  h2 {
    text-align: left;
  }

  @media screen and (max-width: 992px) {
    order: ${props => props.mobileOrder || 'unset'};
  }

  @media screen and (min-width: 1921px) {
    min-width: 440px;
    width: 440px;
  }
`

const StatsContainerRow = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  text-align: left;
  margin: ${props => props.margin || '20px 30px 10px 30px'};

  div:first-child {
    width: ${props => props.width || '135px'};
    // margin-right: 38px;
  }

  &:not(:first-child) {
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    margin-left: 0;
    padding-left: 30px;
  }

  @media screen and (max-width: 992px) {
    flex-direction: column;
    align-items: baseline;

    div:first-child {
      // margin-right: 0;
    }

    &:not(:first-child) {
      padding-left: 15px;
    }
  }
`

const BigStats = styled.div`
  font-size: 21px !important;
  font-weight: 700 !important;
  line-height: 27px !important;

  @media screen and (max-width: 992px) {
    font-weight: 700 !important;
    font-size: 14px !important;
    line-height: 18px !important;
  }
`

const BigStatsSubheader = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 30px !important;

  img {
    margin-right: 10px;
  }

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;

  span {
    text-align: left;
    margin-bottom: 10px;

    b {
      font-size: 14px;
      line-height: 17px;
    }
  }

  b {
    text-align: start;
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 840px) {
    span {
      margin-bottom: 5px;
    }

    b {
      line-height: unset;
    }
  }
`

const StatsTooltip = styled.div`
  text-align: left;
`

const ImgList = styled.div`
  display: flex;
  // margin-top: 20px;
  a {
    margin-right: 10px;
  }
`

const DataSource = styled.div`
  background: ${props => props.background || 'none'};
  color: ${props => props.color || 'black'};

  padding: 15px 20px;
  display: flex;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;

  border-radius: 10px;
  align-items: center;
  position: relative;

  &:hover {
    box-shadow: 0px 4px 4px ${props => props.boxShadowColor};
  }

  .avatar {
    width: 40px !important;
    margin-right: 20px;
    text-align: right;
  }

  .soon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: 500;
    font-size: 7px;
    line-height: 9px;
    color: rgba(31, 41, 55, 0.47);
  }

  @media screen and (max-width: 992px) {
    .soon {
      right: 140px;
    }
  }
`

const DataSourceInner = styled(StatsContainer)`
  width: 100%;
`

const StatsValue = styled(StatsBox)`
  @media screen and (min-width: 1921px) {
    min-width: 850px;
    width: 850px;
  }
`

const StatsExchange = styled(StatsBox)`
  @media screen and (min-width: 1921px) {
    min-width: 500px;
    width: 500px;
  }
`

const StatsChart = styled(StatsBox)`
  @media screen and (min-width: 1921px) {
    min-width: 1000px;
    width: 1000px;
  }
`

const StatsExternal = styled(StatsBox)`
  @media screen and (min-width: 1921px) {
    min-width: 350px;
    width: 350px;
  }
`

const DataSourceDirect = styled.a`
  text-decoration: none;
  margin-bottom: 20px;
  div.back {
    background: white;
    border-radius: 10px;
  }
`

const BigStatsExchange = styled(BigStatsSubheader)`
  @media screen and (max-width: 992px) {
    font-weight: 700;
    font-size: 16px;
    line-height: 21px;
  }
`

export {
  Container,
  Content,
  FarmStatsContainer,
  FarmSubTitle,
  StatsBox,
  StatsContainer,
  StatsTooltip,
  EmissionsCountdownText,
  StatsBoxTitle,
  StatsContainerRow,
  BigStats,
  BigStatsSubheader,
  ImgList,
  DataSource,
  DataSourceInner,
  StatsValue,
  StatsExchange,
  StatsChart,
  StatsExternal,
  DataSourceDirect,
  BigStatsExchange,
}
