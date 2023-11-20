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
  gap: 25px;

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
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);
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
  background-color: #15b088;
  display: flex;
  flex-direction: column;
  padding: 34px;
  color: white;
  border-radius: 13px;
  transition: 0.25s;
  cursor: pointer;
  z-index: 1;
  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
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

  img {
    position: absolute;
    width: 60%;
    bottom: 0;
    right: 0;
    border-bottom-right-radius: 13px;
    border-bottom-left-radius: 13px;
    z-index: -1;
    @media screen and (max-width: 1500px) {
      width: 70%;
    }
    @media screen and (max-width: 992px) {
      width: 40%;
    }
    @media screen and (max-width: 512px) {
      width: 30%;
    }
  }
`

const Title = styled.div`
  font-size: 39px;
  font-weight: 600;
  line-height: 48px;
  margin-bottom: 21px;
  color: #fff;
  padding-top: 75px;
  letter-spacing: -0.786px;

  @media screen and (max-width: 992px) {
    font-size: 32px;
    margin-bottom: 16px;
    padding-top: unset;
    letter-spacing: -0.64px;
  }
`

const Desc = styled.div`
  font-size: 21px;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 21px;
  color: #fff;

  @media screen and (max-width: 992px) {
    font-size: 18px;
    margin-bottom: 21px;
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
    padding: 14px 23px;
    font-size: 19px;
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
  border-radius: 13px;
  background-color: #fcbe4f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 0;

  img.cloud {
    width: 47%;
    position: absolute;
    bottom: -40px;
    right: -8px;
    z-index: -1;

    @media screen and (max-width: 1500px) {
      width: 54%;
    }
    @media screen and (max-width: 1300px) {
      width: 60%;
    }
    @media screen and (max-width: 992px) {
      width: 51%;
    }
  }

  transition: 0.25s;
  cursor: pointer;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }

  @media screen and (max-width: 992px) {
    justify-content: center;
    height: 700px;
    padding: 34px 34px 50px;
    margin-bottom: 20px;

    img.sun {
      width: 80px;
    }
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
    padding: 14px 23px;
    font-size: 19px;
  }
`

const AdvancedFarms = styled.div`
  height: 50%;
  background-color: #eaf1ff;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: #fff;
  position: relative;
  overflow: hidden;
  z-index: 1;

  img.bottom {
    width: 30%;
    position: absolute;
    bottom: 0;
    right: 7%;
    height: 100%;
    z-index: -1;
    @media screen and (max-width: 1300px) {
      width: 27%;
      bottom: -33%;
      right: 5%;
    }
    @media screen and (max-width: 992px) {
      width: 23%;
      bottom: -30%;
      right: 4%;
    }
  }
  transition: 0.25s;
  cursor: pointer;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }

  @media screen and (max-width: 992px) {
    justify-content: center;
    height: 700px;
    padding: 34px 34px 50px;

    img.sun {
      width: 80px;
    }
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
  font-size: 33px;
  font-weight: 600;
  line-height: 32px;
  margin-bottom: 15px;
  color: #fff;
  letter-spacing: -0.673px;

  @media screen and (max-width: 992px) {
    font-size: 28px;
    line-height: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.56px;
  }
`

const FirstFarmDesc = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 24px;
  color: #fff;

  @media screen and (max-width: 992px) {
    font-size: 18px;
    margin-bottom: 21px;
  }
`

const AdvancedTitle = styled.div`
  font-size: 33px;
  font-weight: 600;
  line-height: 32px;
  margin-bottom: 15px;
  color: #1f2937;
  letter-spacing: -0.673px;

  @media screen and (max-width: 992px) {
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.64px;
  }
`

const AdvancedDesc = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 24px;
  color: #1f2937;

  @media screen and (max-width: 992px) {
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 21px;
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
    font-size: 18px;
    line-height: 28px;
    padding: 14px 23px;
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
