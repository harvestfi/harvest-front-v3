import styled from 'styled-components'
import AdvancedImg from '../../assets/images/logos/home/advanced-farming.jpg'

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
    padding-bottom: 100px;
  }
`

const TopSection = styled.div`
  width: 100%;
  border-radius: 0px 0px 15px 15px;
  background: linear-gradient(0deg, rgba(47, 39, 39, 0.78) 0%, rgba(47, 39, 39, 0.78) 100%),
    url(${AdvancedImg}) lightgray 50% / cover no-repeat;

  @media screen and (max-width: 992px) {
    height: 250px;
  }
`

const TopContainer = styled.div`
  height: 250px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 100px;

  @media screen and (min-width: 1921px) {
    width: 1450px;
    margin: auto;
    padding: 100px 40px;
  }

  @media screen and (max-width: 1921px) {
    padding: 100px;
  }

  @media screen and (max-width: 1200px) {
    padding: 100px 40px;
  }

  @media screen and (max-width: 992px) {
    padding: 0px 25px;
    text-align: center;
  }
`

const Inner = styled.div`
  padding: 60px 100px;
  width: 100%;
  margin: auto;

  @media screen and (min-width: 1921px) {
    width: 1450px;
    padding: 60px 40px;
    height: 800px;
  }

  @media screen and (max-width: 1200px) {
    padding: 60px 40px;
  }

  @media screen and (max-width: 992px) {
    padding: 22px 37px;
  }

  @media screen and (max-width: 512px) {
    padding: 32px 15px;
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
  font-size: 35px;
  font-weight: 600;
  line-height: 44px;
  color: #fff;
`

const HeaderDesc = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 4.6px;
  margin-bottom: 12.8px;

  @media screen and (max-width: 992px) {
    margin-top: 15px;
    margin-bottom: 18px;
  }
`

const HeaderBadge = styled.div`
  width: fit-content;
  border-radius: 12px;
  padding: 3px 3px 3px 10px;
  background: #344054;
  font-size: 10.5px;
  font-weight: 500;
  line-height: 17px;
  display: flex;
  gap: 9px;

  @media screen and (max-width: 992px) {
    margin: 0px auto;
  }

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

export {
  Container,
  TopSection,
  TopContainer,
  Inner,
  CoinSection,
  UnitPart,
  HeaderTitle,
  HeaderDesc,
  HeaderBadge,
}
