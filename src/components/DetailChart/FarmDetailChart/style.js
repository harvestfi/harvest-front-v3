import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  overflow: hidden;
  padding: 0px;
  transition: 0.25s;
  background: #fff;

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 400px;
  }
`

const Header = styled.div`
  font-size: 14px;

  @media screen and (max-width: 992px) {
    padding: 0 12px;
  }
`

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 992px) {
    align-items: start;
  }
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

  @media screen and (max-width: 992px) {
    margin-top: 15px;
    margin-bottom: 10px;
    width: 100%;
    justify-content: space-around;
  }
`

const ChartDiv = styled.div`
  height: 100%;
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

const CurDate = styled.div`
  font-size: 13px;
  line-height: normal;
  font-weight: 500;

  @media screen and (max-width: 992px) {
    font-size: 10px;
  }
`

const TooltipInfo = styled.div`
  margin-left: 10px;
  align-self: center;
`

const FlexDiv = styled.div`
  display: flex;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const LabelInfo = styled.div`
  display: flex;
  color: #1b1b1b;
  font-size: 13px;
  font-weight: 700;
  line-height: normal;

  @media screen and (max-width: 992px) {
    font-size: 10px;
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
  CurDate,
  TooltipInfo,
  FlexDiv,
  LabelInfo,
}
