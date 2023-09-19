import styled from 'styled-components'
import BeginnersBack from '../../assets/images/logos/home/beginner-back.svg'
import FirstFarmingBack from '../../assets/images/logos/home/first-farming-back.svg'
import AdvancedBack from '../../assets/images/logos/home/advanced-back.svg'

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
    padding-bottom: 100px;
  }
`

const Inner = styled.div`
  padding: 0px 41px;
  width: 100%;
  min-height: 765px;
  display: flex;
  gap: 10px;

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
    padding: 25px 24px 32px 17px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`

const FirstPart = styled.div`
  width: 50%;
  display: flex;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);
  position: relative;
  border-radius: 13px;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const FirstBack = styled.div`
  width: 100%;
  height: 100%;
  background: url(${BeginnersBack});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: white;
  border-radius: 13px;
  transition: 0.25s;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }

  @media screen and (max-width: 992px) {
    height: 700px;
    padding: 19px;
  }

  @media screen and (max-width: 768px) {
    height: 530px;
  }

  @media screen and (max-width: 512px) {
    height: 380px;
  }
`

const Title = styled.div`
  font-size: 39px;
  font-weight: 600;
  line-height: 48px;
  margin-bottom: 21px;

  @media screen and (max-width: 992px) {
    font-size: 22px;
    line-height: 27px;
    margin-bottom: 12px;
  }
`

const Desc = styled.div`
  font-size: 21px;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 21px;

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 12px;
  }
`

const StartBeginners = styled.button`
  border-radius: 9px;
  border: 1px solid #fff;
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  color: #1f2937;
  padding: 14px 24px;
  display: flex;
  width: fit-content;
  font-size: 19px;
  line-height: 28px;
  font-weight: 600;

  &:hover {
    color: #576f91;
  }

  @media screen and (max-width: 992px) {
    padding: 8px 13px;
    font-size: 10px;
    line-height: 16px;
  }
`

const SecondPart = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (max-width: 992px) {
    width: 100%;
    gap: 5px;
  }
`

const FirstFarmingPart = styled.div`
  height: 50%;
  width: 100%;
  border-radius: 13px;
  background: url(${FirstFarmingBack});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: white;
  position: relative;
  overflow: hidden;

  img.sun {
    width: 150px;
    position: absolute;
    top: 10%;
    right: 10%;
  }

  img.bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  transition: 0.25s;
  cursor: pointer;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 300px;
    padding: 22px;

    img.sun {
      width: 80px;
    }
  }

  @media screen and (max-width: 768px) {
    height: 250px;
  }

  @media screen and (max-width: 512px) {
    height: 188px;
  }
`

const DirectBtn = styled.button`
  border: 1px solid white;
  background: white;
  border-radius: 6px;
  box-shadow: 0px 1px 1px 0px rgba(16, 24, 40, 0.05);
  display: flex;
  width: fit-content;
  padding: 9px 15px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: #232323;
  &:hover {
    color: #576f91;
  }

  @media screen and (max-width: 992px) {
    padding: 5px 8px;
    font-size: 7px;
    line-height: 10px;
  }
`

const AdvancedFarms = styled.div`
  height: 50%;
  background: url(${AdvancedBack});
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: #fff;
  position: relative;
  overflow: hidden;

  img.sun {
    position: absolute;
    left: 45%;
    bottom: 12%;
    width: 150px;
  }

  img.bottom {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  transition: 0.25s;
  cursor: pointer;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    padding: 22px;
    height: 300px;
    img.sun {
      width: 80px;
    }
  }

  @media screen and (max-width: 768px) {
    height: 250px;
  }

  @media screen and (max-width: 512px) {
    height: 188px;
  }
`

const FirstFarmTitle = styled.div`
  font-size: 33px;
  font-weight: 600;
  line-height: 32px;
  margin-bottom: 15px;

  @media screen and (max-width: 992px) {
    font-size: 19px;
    line-height: 18px;
    margin-bottom: 8px;
  }
`

const FirstFarmDesc = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 24px;

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 12px;
    margin-bottom: 14px;
  }
`

const AdvancedTitle = styled.div`
  font-size: 33px;
  font-weight: 600;
  line-height: 32px;
  margin-bottom: 15px;

  @media screen and (max-width: 992px) {
    font-size: 19px;
    line-height: 18px;
    margin-bottom: 8px;
  }
`

const AdvancedDesc = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 24px;

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 12px;
    margin-bottom: 14px;
  }
`

const AdvancedDirectBtn = styled.button`
  border: 1px solid white;
  background: white;
  border-radius: 6px;
  box-shadow: 0px 1px 1px 0px rgba(16, 24, 40, 0.05);
  display: flex;
  width: fit-content;
  padding: 9px 15px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: #232323;
  &:hover {
    color: #576f91;
  }

  @media screen and (max-width: 992px) {
    font-size: 6px;
    line-height: 10px;
    padding: 5px 8px;
  }
`

export {
  Container,
  Inner,
  FirstPart,
  FirstBack,
  Title,
  Desc,
  StartBeginners,
  SecondPart,
  FirstFarmingPart,
  DirectBtn,
  AdvancedFarms,
  FirstFarmTitle,
  FirstFarmDesc,
  AdvancedTitle,
  AdvancedDesc,
  AdvancedDirectBtn,
}
