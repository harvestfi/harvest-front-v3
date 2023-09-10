import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  color: ${props => props.fontColor};

  background: ${props => props.pageBackColor};
  transition: 0.25s;
  position: relative;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: Inter;

  @media screen and (min-width: 1921px) {
    flex-direction: row;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 100%;
    margin: 0;
    justify-content: start;
  }
`

const Inner = styled.div`
  padding: 0px 41px;
  width: 100%;
  min-height: 765px;

  @media screen and (min-width: 1921px) {
    width: 1450px;
    padding: 35px 0 0;
    height: 800px;
  }

  @media screen and (max-width: 992px) {
    padding: 22px 37px;
  }
`

const CoinSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 25px;

  @media screen and (max-width: 992px) {
    gap: 22px;
  }
`

const UnitPart = styled.div`
  width: 48%;
  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const HeaderTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
  color: #101828;
`

const HeaderDesc = styled.div`
  color: #475467;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  margin-top: 4px;
  margin-bottom: 35px;

  @media screen and (max-width: 992px) {
    margin-bottom: 22px;
  }
`

export { Container, Inner, CoinSection, UnitPart, HeaderTitle, HeaderDesc }
