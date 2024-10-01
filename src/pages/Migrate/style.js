import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  color: ${props => props.fontColor};

  background: ${props => props.bgColor};
  transition: 0.25s;
  position: relative;
  margin-left: 280px;

  @media screen and (min-width: 1920px) {
    display: flex;
    flex-direction: column;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding-bottom: 100px;
  }
`

const Inner = styled.div`
  padding: 50px 75px 75px 75px;
  width: 100%;
  display: ${props => (props.display ? props.display : '')};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : '')};
  align-items: ${props => (props.alignItems ? props.alignItems : '')};
  height: ${props => (props.height ? props.height : '')};

  @media screen and (min-width: 1921px) {
    width: 1450px;
  }

  @media screen and (max-width: 1480px) {
    width: 100%;
    padding: 70px 30px 40px;
  }

  @media screen and (max-width: 992px) {
    padding: 25px 15px;
  }
`

const MigrateTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: space-between;
`

const PageTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
  color: ${props => (props.color ? props.color : '')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '10px')};
`

const PageIntro = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: ${props => (props.color ? props.color : '')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '20px')};
`

const SpaceLine = styled.div`
  border-bottom: 1px solid rgba(234, 236, 240, 1);
`

const MigrateBox = styled.div`
  width: 451px;
  border-radius: 12px;
  border: 2px solid #f2f5ff;
  padding: 25px;

  .from-vault {
    position: relative;
  }

  .from-vault::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    padding: 2px;
    background: linear-gradient(90deg, #ffd6a6 0%, #a1b5ff 48.9%, #73df88 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
`
const BoxTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 25px;
  color: ${props => (props.color ? props.color : '')};
`

const FromVault = styled.div`
  border: 2px solid #7f9bff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f6ff;
`

const ToVault = styled.div`
  padding: 15px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MigrateIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
`
const Button = styled.button`
  padding: 10px 18px;
  border: 1px solid #6988ff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #6988ff;
  color: white;
  width: 100%;
`

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  align-items: ${props => (props.alignItems ? props.alignItems : '')};
  flex-direction: column;
`

const InfoText = styled.div`
  font-size: ${props => (props.fontSize ? props.fontSize : '')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : '')};
  line-height: 20px;
  color: ${props => (props.color ? props.color : '')};
`

const BadgeToken = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`

const BadgeIcon = styled.div`
  margin: 0px 5px -1px 0px;
  width: 13.096px;
  height: 13.096px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 10px;
    height: 11px;
  }
`

const ApyDownIcon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Token = styled.a`
  font-weight: 500;
  font-size: 10px;
  line-height: 20px;
  color: #414141;
  cursor: pointer;
`

export {
  Container,
  Inner,
  MigrateTop,
  PageTitle,
  PageIntro,
  SpaceLine,
  MigrateBox,
  FromVault,
  ToVault,
  BoxTitle,
  MigrateIcon,
  Button,
  ButtonDiv,
  Content,
  InfoText,
  BadgeToken,
  BadgeIcon,
  ApyDownIcon,
  Token,
}
