import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // width: 53%;
  height: 400px;
  overflow: hidden;
  padding: 0px;
  transition: 0.25s;
  background: ${props => props.backColor};
  color: ${props => props.fontColor};

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 400px;
    margin-bottom: 15px;
  }
`

const Header = styled.div`
  font-size: 14px;
  padding: 1em 5px 0 5px;
`

const Title = styled.h5`
  font-size: 16px;
  line-height: 21px;
  font-weight: bold;
  width: 100%;
  margin-bottom: 1rem;

  img {
    margin-right: 5px;
  }
`

const Total = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 1250px) {
    display: block;
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
  margin: 0.8em 1em 0.25em auto;
  color: #fff;

  button {
    // border: none;
    padding: 0.1em 0.6em;
    // border-radius: .4em;
    // background: #F6F6F6;
    margin-left: 0.5em;
    font-weight: 400;
  }
`

const ChartDiv = styled.div`
  // display: flex;
  height: 100%;
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: 0;

  @media screen and (max-width: 1250px) {
    margin-top: 15px;
  }
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
`

export {
  Container,
  Title,
  Header,
  Total,
  MoreBtn,
  ButtonGroup,
  ChartDiv,
  FilterGroup,
  PriceShow,
  FilterName,
}
