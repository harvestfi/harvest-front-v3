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

  @media screen and (max-width: 1480px) {
    width: 100%;
    padding: 70px 30px 40px;
  }

  @media screen and (max-width: 992px) {
    padding: 16px 10px;
  }
`

const CoinSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 25px;
`

const UnitPart = styled.div`
  width: 48%;
  min-height: 320px;
  border-radius: 13px;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  ${props =>
    props.num === 0
      ? `
    background: #fceabb;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #f8b500, #fceabb);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #f8b500, #fceabb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : props.num === 1
      ? `
    background: #a8c0ff;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #3f2b96, #a8c0ff);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #3f2b96, #a8c0ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : props.num === 2
      ? `
    background: #134E5E;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #71B280, #134E5E);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #71B280, #134E5E); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : `
    background: #2193b0;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #6dd5ed, #2193b0);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #6dd5ed, #2193b0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `}
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
  line-height: 23px;

  margin-top: 4px;
  margin-bottom: 35px;
`

export { Container, Inner, CoinSection, UnitPart, HeaderTitle, HeaderDesc }
