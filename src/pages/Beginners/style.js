import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  color: ${props => props.fontColor};

  background: ${props => props.pageBackColor};
  transition: 0.25s;
  position: relative;
  margin-left: 280px;

  @media screen and (min-width: 1921px) {
    flex-direction: row;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 100%;
    margin: 0;
    justify-content: start;
    padding-bottom: 150px;
  }
`

const TopSection = styled.div`
  width: 100%;
  height: 345px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 100px;
  background: #15b088;
`

const Inner = styled.div`
  padding: 60px 100px 60px;
  width: 100%;
  margin: auto;
  // min-height: 765px;

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
  justify-content: space-between;
  flex-wrap: wrap;
  // gap: 25px;

  @media screen and (max-width: 992px) {
    gap: 22px;
  }
`

const UnitPart = styled.div`
  width: 49%;
  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const HeaderTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
  color: #fff;
`

const HeaderDesc = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  margin-top: 4px;
  margin-bottom: 11px;

  @media screen and (max-width: 992px) {
    margin-bottom: 22px;
  }
`

const HeaderBadge = styled.div`
  width: fit-content;
  border-radius: 11.797px;
  padding: 3px 3px 3px 10px;
  background: #1568b3;
  font-size: 10.5px;
  font-weight: 500;
  line-height: 15px;
  display: flex;
  gap: 9px;

  div.badge-text {
    color: #fff;
    margin: auto;
  }

  a.badge-btn {
    background: #fff;
    padding: 1.5px 7px;
    gap: 3px;
    display: flex;
    border-radius: 11px;
    color: #1568b3;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      transform: scale(1.05);
      margin-right: 2px;
    }

    svg {
      color: #6b6b6b;
      margin: auto;
    }
  }
`

export { Container, TopSection, Inner, CoinSection, UnitPart, HeaderTitle, HeaderDesc, HeaderBadge }
