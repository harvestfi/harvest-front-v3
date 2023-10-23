import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 15px 18px 25px;
  transition: 0.25s;
  border-radius: 10px;
  border: 2px solid #f2f5ff;
  background: #fff;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    margin-bottom: 24px;
  }
`

const Header = styled.div`
  font-size: 14px;
`

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MoreBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 0.8em 0.5em;
  margin: 1em;
  background: rgba(223, 0, 0, 0.06);
  border-radius: 1em;
  height: 15px;
  color: #df0000;
  border: none;

  img {
    margin-right: 0.25em;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: #fff;
  justify-content: end;

  @media screen and (max-width: 992px) {
    margin-top: 14px;
    margin-bottom: 9px;
    width: 100%;
    justify-content: space-around;
  }
`

const ChartDiv = styled.div`
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
    height: 100%;
  }
`

const FilterGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`

const PriceShow = styled.div`
  display: flex;

  h2 {
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    padding: 0;
    margin: 0 10px 0 0;
  }

  @media screen and (max-width: 992px) {
    margin-bottom: 1rem;
  }
`

const FilterName = styled.div`
  text-align: right;
  margin-top: 1rem;

  @media screen and (max-width: 992px) {
    margin-top: 0.5rem;
  }
`

const TokenSymbol = styled.div`
  font-size: 16px;
  line-height: 28px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #101828;

  img {
    padding-left: 5px;
    margin-top: -3px;
  }

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 18px;
  }
`

const TooltipInfo = styled.div`
  align-self: center;
`

const FlexDiv = styled.div`
  display: flex;
`

const CurContent = styled.div`
  color: ${props => props.color};
  font-size: 13px;
  font-weight: 500;

  span {
    color: #ced3e6;
  }

  @media screen and (max-width: 992px) {
    font-size: 10px;
  }
`

const ChartInfo = styled.div`
  border-radius: 12px;
  border: 1px solid #6ce9a6;
  background: #f6fef9;
  display: flex;
  gap: 12px;
  padding: 16px;
  margin-top: 22px;
`

const ChartHeaderDiv = styled.div`
  color: #027a48;
  margin-top: 3px;
  margin-bottom: 3px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`

const ChartDescText = styled.div`
  color: #027a48;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`

const ChartBottom = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
`

const ChartBottomAction = styled.div`
  border: none;
  color: #039855;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  text-decoration-line: underline;
  cursor: pointer;
`

const ChartBottomHide = styled.div`
  color: #027a48;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`

const ChartClose = styled.div`
  cursor: pointer;
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
  ${props =>
    props.borderBottom
      ? `
    border-bottom: ${props.borderBottom};
  `
      : ''}

  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  ${props =>
    props.position
      ? `
    position: ${props.position};
  `
      : ''}
  ${props =>
    props.align
      ? `
    text-align: ${props.align};
  `
      : ''}
  ${props =>
    props.justifyContent
      ? `
    justify-content: ${props.justifyContent};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  ${props =>
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
  `
      : ''}
  ${props =>
    props.marginRight
      ? `
    margin-right: ${props.marginRight};
  `
      : ''}
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ''}
  ${props =>
    props.items
      ? `
    align-items: ${props.items};
  `
      : ''}
  ${props =>
    props.self
      ? `
    align-self: ${props.self};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
  ${props =>
    props.borderRadius
      ? `
    border-radius: ${props.borderRadius};
    `
      : ``}
  img.icon {
    margin-right: 10px;
  }

  img.thumbs-up {
    margin-right: 10px;
  }

  img.info-icon {
    margin-left: 15px;
  }

  #info .tooltip-inner {
    background: black;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }

    img.thumbs-up {
      margin-right: 5px;
      width: 11px;
    }
  }

  p {
    font-weight: 600;
    margin-bottom: 0px;
  }

  p.priceShareText {
    font-weight: 500;
    color: #667085;
    padding-top: 5px;
  }

  span {
    color: #036666;
    padding-left: 5px;
  }
`

export {
  Container,
  Header,
  Total,
  MoreBtn,
  ButtonGroup,
  ChartDiv,
  FilterGroup,
  PriceShow,
  FilterName,
  TokenSymbol,
  TooltipInfo,
  FlexDiv,
  CurContent,
  ChartInfo,
  ChartHeaderDiv,
  ChartDescText,
  ChartBottom,
  ChartBottomAction,
  ChartBottomHide,
  ChartClose,
  NewLabel,
}
