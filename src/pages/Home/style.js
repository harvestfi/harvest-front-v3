import styled from 'styled-components'
import NewFarmImg from '../../assets/images/logos/home/new-farming.jpg'
import AdvancedImg from '../../assets/images/logos/home/advanced-farming.jpg'

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

  @media screen and (min-width: 1921px) {
    flex-direction: row;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding-bottom: 100px;
  }
`

const Inner = styled.div`
  padding: 0px 41px;
  width: 100%;
  min-height: 700px;
  display: flex;
  gap: 30px;

  @media screen and (max-height: 800px) {
    min-height: 90%;
  }
  @media screen and (min-width: 1921px) {
    width: 1450px;
    height: 800px;
    padding: 35px 0 0;
  }
  @media screen and (max-width: 1480px) {
    width: 100%;
    padding: 0px 30px 0px;
  }
  @media screen and (max-width: 992px) {
    padding: 32px 15px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 0;
  }
`

const FirstPart = styled.div`
  width: 50%;
  display: flex;
  position: relative;
  border-radius: 13px;

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-bottom: 20px;
  }
`

const FirstBack = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(47, 39, 39, 0.78) 0%, rgba(47, 39, 39, 0.78) 100%),
    url(${AdvancedImg}) lightgray 50% / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 42px;
  color: white;
  border-radius: 16px;
  transition: 0.25s;
  cursor: pointer;
  z-index: 1;
  &:hover {
    background: linear-gradient(0deg, rgba(47, 39, 39, 0.6) 0%, rgba(47, 39, 39, 0.6) 100%),
      url(${AdvancedImg}) lightgray 50% / cover no-repeat;
    box-shadow: 0px 5.329px 5.329px -2.664px rgba(16, 24, 40, 0.03),
      0px 13.322px 15.987px -2.664px rgba(16, 24, 40, 0.08);
  }

  @media screen and (max-width: 992px) {
    height: 700px;
    padding: 34px 34px 50px;
  }

  @media screen and (max-width: 768px) {
    height: 530px;
    padding: 34px 34px 50px;
  }

  @media screen and (max-width: 512px) {
    height: 100%;
    padding: 34px;
  }
`

const Title = styled.div`
  font-size: 49px;
  font-weight: 600;
  line-height: 60px;
  margin-bottom: 27px;
  color: #fff;
  letter-spacing: -0.983px;

  @media screen and (max-width: 992px) {
    font-size: 32px;
    margin-bottom: 16px;
    padding-top: unset;
    letter-spacing: -0.64px;
  }

  @media screen and (max-width: 512px) {
    font-size: 24px;
    letter-spacing: -0.48px;
    margin-bottom: 0px;
  }
`

const Desc = styled.div`
  font-size: 27px;
  font-weight: 500;
  line-height: 41px;
  color: #fff;

  @media screen and (max-width: 992px) {
    font-size: 18px;
  }

  @media screen and (max-width: 512px) {
    font-size: 14px;
  }
`

const SecondPart = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media screen and (max-width: 992px) {
    width: 100%;
    gap: 5px;
  }
`

const FirstFarmingPart = styled.div`
  height: 50%;
  width: 100%;
  border-radius: 16px;
  background: linear-gradient(0deg, rgba(47, 39, 39, 0.78) 0%, rgba(47, 39, 39, 0.78) 100%),
    url(${NewFarmImg}) lightgray 50% / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 49px;
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 0;
  transition: 0.25s;
  cursor: pointer;

  &:hover {
    background: linear-gradient(0deg, rgba(47, 39, 39, 0.6) 0%, rgba(47, 39, 39, 0.6) 100%),
      url(${NewFarmImg}) lightgray 50% / cover no-repeat;
    box-shadow: 0px 5.329px 5.329px -2.664px rgba(16, 24, 40, 0.03),
      0px 13.322px 15.987px -2.664px rgba(16, 24, 40, 0.08);
  }

  @media screen and (max-width: 992px) {
    justify-content: center;
    height: 700px;
    padding: 34px 34px 50px;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 768px) {
    height: 530px;
    padding: 34px 34px 50px;
  }

  @media screen and (max-width: 512px) {
    height: 100%;
    padding: 34px;
  }
`

const AdvancedFarms = styled.div`
  height: 50%;
  background: linear-gradient(0deg, rgba(47, 39, 39, 0.78) 0%, rgba(47, 39, 39, 0.78) 100%),
    url(${AdvancedImg}) lightgray 50% / cover no-repeat;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: #fff;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: 0.25s;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
    background: linear-gradient(0deg, rgba(47, 39, 39, 0.6) 0%, rgba(47, 39, 39, 0.6) 100%),
      url(${AdvancedImg}) lightgray 50% / cover no-repeat;
    box-shadow: 0px 5.329px 5.329px -2.664px rgba(16, 24, 40, 0.03),
      0px 13.322px 15.987px -2.664px rgba(16, 24, 40, 0.08);
  }

  @media screen and (max-width: 992px) {
    justify-content: center;
    height: 700px;
    padding: 34px 34px 50px;
  }

  @media screen and (max-width: 768px) {
    height: 530px;
    padding: 34px 34px 50px;
  }

  @media screen and (max-width: 512px) {
    height: 100%;
    padding: 34px 34px 50px;
  }
`

const FirstFarmTitle = styled.div`
  font-size: 42px;
  font-weight: 600;
  line-height: 40px;
  margin-bottom: 18.6px;
  color: #fff;
  letter-spacing: -0.841px;

  @media screen and (max-width: 992px) {
    font-size: 28px;
    line-height: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.56px;
  }

  @media screen and (max-width: 512px) {
    font-size: 24px;
    letter-spacing: -0.48px;
    margin-bottom: 0px;
  }
`

const FirstFarmDesc = styled.div`
  font-size: 23px;
  font-weight: 400;
  line-height: 27px;
  color: #fff;

  @media screen and (max-width: 992px) {
    font-size: 18px;
  }

  @media screen and (max-width: 512px) {
    font-size: 14px;
  }
`

const AdvancedTitle = styled.div`
  font-size: 42px;
  font-weight: 600;
  line-height: 41px;
  margin-bottom: 18.6px;
  letter-spacing: -0.841px;

  @media screen and (max-width: 992px) {
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.64px;
  }

  @media screen and (max-width: 512px) {
    font-size: 24px;
    letter-spacing: -0.48px;
    margin-bottom: 0px;
  }
`

const AdvancedDesc = styled.div`
  font-size: 23px;
  font-weight: 400;
  line-height: 27px;

  @media screen and (max-width: 992px) {
    font-size: 18px;
    line-height: 22px;
  }

  @media screen and (max-width: 512px) {
    font-size: 14px;
  }
`

export {
  Container,
  Inner,
  FirstPart,
  FirstBack,
  Title,
  Desc,
  SecondPart,
  FirstFarmingPart,
  AdvancedFarms,
  FirstFarmTitle,
  FirstFarmDesc,
  AdvancedTitle,
  AdvancedDesc,
}
