import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 50%;
  overflow: hidden;
  padding: 25px 18px;
  transition: 0.25s;
  border-radius: 10px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  background: #fff;

  @media screen and (max-width: 1368px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    margin-bottom: 0;
    width: 100%;
    height: unset;
    min-height: 400px;
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
  // margin: 0.8em 1em 0.25em auto;
  color: #fff;

  // button {
  //   padding: 0.1em 0.6em;
  //   margin-left: 0.5em;
  //   font-weight: 400;
  // }
`

const ChartDiv = styled.div`
  height: 335px;

  @media screen and (max-width: 1291px) {
    height: 353px;
  }

  @media screen and (max-width: 1262px) {
    height: 373px;
  }

  @media screen and (max-width: 1035px) {
    height: 393px;
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
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #000;

  @media screen and (max-width: 992px) {
    margin-top: 0.5rem;
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
}
