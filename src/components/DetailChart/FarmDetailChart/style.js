import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  overflow: hidden;
  padding: 0px;
  transition: 0.25s;
  background: #fff;

  // @media screen and (max-width: 992px) {
  //   width: 100%;
  //   height: 400px;
  // }
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
  justify-content: end;
  padding-top: 25px;
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
    height: 365px;
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
`

const FilterName = styled.div`
  text-align: right;
  margin-top: 1rem;
`

const CurDate = styled.div`
  color: #1b1b1b;
  display: flex;
  font-size: 13px;
  font-weight: 500;

  span {
    color: #ced3e6;
  }

  p {
    color: #15b088;
    font-weight: 500;
    margin-bottom: 0px;
  }
`

const TooltipInfo = styled.div`
  margin-left: 10px;
  align-self: center;
`

const FlexDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const LabelInfo = styled.div`
  color: #101828;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
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
