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
    padding: 0px 10px;
  }
`

const FirstPart = styled.div`
  width: 50%;

  display: flex;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);
  border-radius: 13px;
  position: relative;
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
  color: black;
`

const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 36px;
  margin-bottom: 17px;
`

const Desc = styled.div`
  font-size: 17px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 21px;
`

const StartBeginners = styled.button`
  border-radius: 7px;
  border: 1px solid #000;
  background: #000;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  color: white;
  padding: 10px 18px;
  display: flex;
  width: fit-content;
`

const SecondPart = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
`

const DirectBtn = styled.button`
  border: 1px solid white;
  background: white;
  border-radius: 6px;
  box-shadow: 0px 1px 1px 0px rgba(16, 24, 40, 0.05);
  display: flex;
  width: fit-content;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #232323;
`

const AdvancedFarms = styled.div`
  height: 50%;
  background: url(${AdvancedBack});
  background-size: cover;
  background-repeat: no-repeat;

  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  border-radius: 13px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: #fff;

  position: relative;
  overflow: hidden;
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
}
