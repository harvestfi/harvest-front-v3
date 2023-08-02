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
  overflow: hidden;

  img.coin-group {
    width: 400px;
    position: absolute;
    right: -40px;
    top: calc(50% - 200px);
    opacity: 0.2;
  }

  @media screen and (max-width: 1510px) {
    img.coin-group {
      width: 300px;
      right: -40px;
      top: calc(50% - 150px);
      opacity: 0.2;
    }
  }

  @media screen and (max-width: 1310px) {
    img.coin-group {
      width: 250px;
      right: -40px;
      top: calc(50% - 125px);
      opacity: 0.2;
    }
  }

  @media screen and (max-width: 1210px) {
    img.coin-group {
      width: 200px;
      right: -40px;
      top: calc(50% - 100px);
      opacity: 0.2;
    }
  }
`

const FirstBack = styled.div`
  width: 100%;
  height: 100%;
  background: #fceabb; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #f8b500, #fceabb); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #f8b500,
    #fceabb
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

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
  background: #12c2e9; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #f64f59,
    #c471ed,
    #12c2e9
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #f64f59,
    #c471ed,
    #12c2e9
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

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
  background: #1d976c; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #93f9b9, #1d976c); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #93f9b9, #1d976c);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  border-radius: 13px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: #fff;

  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    right: -15%;
    bottom: -20%;
    opacity: 0.4;
  }

  @media screen and (max-width: 1650px) {
    img {
      right: -40%;
    }
  }

  @media screen and (max-width: 1480px) {
    img {
      bottom: -40%;
    }
  }

  @media screen and (max-width: 1410px) {
    img {
      right: -50%;
    }
  }

  @media screen and (max-width: 1280px) {
    img {
      right: -60%;
    }
  }

  @media screen and (max-width: 1120px) {
    img {
      bottom: -60%;
      right: -80%;
    }
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
}
