import styled from 'styled-components'

const FarmContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  // margin-left: 320px;
  position: relative;
  min-height: 100vh;
  transition: 0.25s;
  color: ${props => props.fontColor};
  background: ${props => props.pageBackColor};

  // @media screen and (min-width: 1920px) {
    display: flex;
    justify-content: center;
    flex-direction: column;
  // }

  @media screen and (max-width: 992px) {
    margin-left: 0;
  }
`
const FarmContent = styled.div`
  display: flex;
  flex-direction: column;

  // flex-wrap: wrap;
  justify-content: center;
  padding: 70px 76px 94px 76px;
  margin: auto;

  @media screen and (min-width: 1920px) {
    width: 1400px;
    height: fit-content;
    
  }

  @media screen and (max-width: 992px) {
    padding: 0px 10px;
  }
`

const FarmCompInner = styled.div`
  &:hover {
    filter: drop-shadow(0px 4px 4px ${props=>props.boxShadowColor});
  }

  margin: 25px 0px;
  width: 30%;

  @media screen and (max-width: 992px) {
    width: 100%;
    margin: 15px 10px;
    margin-bottom: 21px !important;
  }
`

const WelcomeBackPart = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  
  img {
    border-radius: 12px;
  }

  @media screen and (max-width: 992px) {
    margin: 25px 10px;
  }
`

const NavPart = styled.div`
  position: absolute;
  left: 5%;
  top: calc(50% - 80px);
  
  @media screen and (max-width: 992px) {
    display: flex;
    flex-direction: column;
    margin: auto auto 15px;
    bottom: 5%;
    top: unset;
    left: unset;
  }
`

const BottomPart = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;  
`

const NavText = styled.div`
  font-weight: 700;
  font-size: 27.5745px;
  line-height: 36px;
  margin-bottom: 30px;
  color: white;

  @media screen and (max-width: 992px) {
    font-size: 26px;
    line-height: 34px;
    margin-bottom: 20px;
  }
`

const NavButton = styled.button`
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: #5A3A2C;
  border-radius: 10px;
  border: none;
  padding: 15px 48px;
  width: fit-content;

  &:hover {
    background: #FFFFFF;
  }
`

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`

export { FarmContainer, FarmContent, FarmCompInner, WelcomeBackPart, BottomPart, NavPart, NavText, 
  NavButton, ButtonDiv }
