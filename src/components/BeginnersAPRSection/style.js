import styled from 'styled-components'
import NewFarmImg from '../../assets/images/logos/home/new-farming.jpg'
import AdvancedImg from '../../assets/images/logos/home/advanced-farming.jpg'

const Container = styled.a`
  transition: 0.25s;
  width: 100%;
  min-height: 565px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  text-decoration: none;
  border-radius: 15px;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);
  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }
  position: relative;
  overflow: hidden;
  background: linear-gradient(0deg, rgba(47, 39, 39, 0.78) 0%, rgba(47, 39, 39, 0.78) 100%),
    url(${props => (props.num === 1 ? NewFarmImg : AdvancedImg)}) lightgray 50% / cover no-repeat;

  &:hover {
    background: linear-gradient(0deg, rgba(47, 39, 39, 0.6) 0%, rgba(47, 39, 39, 0.6) 100%),
      url(${props => (props.num === 1 ? NewFarmImg : AdvancedImg)}) lightgray 50% / cover no-repeat;
    box-shadow: 0px 5.329px 5.329px -2.664px rgba(16, 24, 40, 0.03),
      0px 13.322px 15.987px -2.664px rgba(16, 24, 40, 0.08);
  }

  img.bottom {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    min-height: 350px;
  }
  @media screen and (max-width: 512px) {
    min-height: 260px;
  }
`

const Percent = styled.div`
  border-radius: 25px;
  background: white;
  font-weight: 500;
  font-size: 19px;
  line-height: 36.8px;
  color: #344054;
  transition: 0.25s;
  padding: 3.682px 18.409px 1.682px 14.727px;
  display: flex;
  justify-content: center;
  width: fit-content;
  align-items: center;
  img {
    margin-right: 5px;
  }

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 26px;
    padding: 2.5px 13px;
    border-radius: 21px;
  }
`

const Section = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 60px;

  img.token-icon {
    width: 225px;
  }

  @media screen and (max-width: 992px) {
    padding-top: 55px;
    img.token-icon {
      width: 130px;
      height: 130px;
    }
  }
  @media screen and (max-width: 512px) {
    padding-top: 15px;
    img.token-icon {
      width: 130px;
      height: 130px;
    }
  }
`

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 35px;

  @media screen and (max-width: 992px) {
    padding: 15px 15px;
  }
`

const Network = styled.div`
  border-radius: 25.23px;
  border: 1.805px solid #fff;
  color: #fff;
  padding: 7.022px 19.662px;
  text-align: center;
  font-size: 19px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;

  @media screen and (max-width: 992px) {
    padding: 5px 14px;
    border-radius: 21px;
    border: 1.5px solid #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    gap: 6px;

    img {
      width: 17.5px;
      height: 17.5px;
    }
  }
`

export { Container, Percent, Section, TopSection, Network }
