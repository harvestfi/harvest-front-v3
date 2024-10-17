import styled from 'styled-components'

const Container = styled.div`
  padding: 50px 75px 75px 75px;
  width: 100%;
  min-height: 100vh;
  color: ${props => props.fontColor};
  display: flex;
  align-items: center;
  flex-direction: column;

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
    padding-bottom: 50px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
  }
`

const Inner = styled.div`
  width: 100%;
  display: ${props => (props.display ? props.display : '')};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : '')};
  align-items: ${props => (props.alignItems ? props.alignItems : '')};
  height: ${props => (props.height ? props.height : '')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '')};
  padding: ${props => (props.padding ? props.padding : '')};

  @media screen and (min-width: 1921px) {
    width: 1450px;
  }

  @media screen and (max-width: 1660px) {
    &.box-faq {
      padding: 0px 50px;
    }
  }

  @media screen and (max-width: 1600px) {
    &.box-faq {
      padding: 0px;
    }
  }

  @media screen and (max-width: 1265px) {
    &.box-faq {
      flex-direction: column;
      padding: 0px 50px;
    }

    .migrate-faq {
      width: 100%;
      margin-left: 0px;
      margin-top: 70px;
    }
  }

  @media screen and (max-width: 992px) {
    &.box-faq {
      flex-direction: column;
      padding: 0px 150px;
    }

    padding: 25px 15px;
    flex-direction: column;

    .migrate-faq {
      margin-top: 0px;
    }
  }

  @media screen and (max-width: 570px) {
    &.box-faq {
      padding: 15px;
    }
  }

  .migrate-box {
    position: relative;
    border: 1px solid #eaefff;
  }

  // .migrate-box::before {
  //   content: '';
  //   position: absolute;
  //   inset: 0;
  //   border-radius: 12px;
  //   padding: 4px;
  //   background: linear-gradient(90deg, #ffd6a6 0%, #a1b5ff 48.9%, #73df88 100%);
  //   -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  //   -webkit-mask-composite: xor;
  //   mask-composite: exclude;
  // }
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
  width: ${props => (props.width ? props.width : '')};
  border-radius: 12px;
  padding: 25px;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '')};

  .from-vault {
    position: relative;
  }

  @media screen and (max-width: 1380px) {
    width: 50%;
  }

  @media screen and (max-width: 1265px) {
    width: 100%;
  }

  // .from-vault::before {
  //   content: '';
  //   position: absolute;
  //   inset: 0;
  //   border-radius: 8px;
  //   padding: 2px;
  //   background: linear-gradient(90deg, #ffd6a6 0%, #a1b5ff 48.9%, #73df88 100%);
  //   -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  //   -webkit-mask-composite: xor;
  //   mask-composite: exclude;
  //   z-index: 0;
  // }
`
const BoxTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
  color: ${props => (props.color ? props.color : '')};
`

const VaultBox = styled.div`
  box-shadow: 0px 1px 2px 0px #1018280d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 10px 14px;
  border-radius: 8px;
  margin-bottom: 21px;
  background: ${props => (props.bgColor ? props.bgColor : '')};
  border: ${props => (props.border ? props.border : '')};
  cursor: pointer;
  position: relative;
  z-index: 1;

  &.inactive {
    cursor: not-allowed;
  }
`

const MigrateIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`
const Button = styled.button`
  padding: 15px 18px;
  border: 1px solid #6988ff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #6988ff;
  color: white;
  width: 100%;

  &:hover {
    background: #809aff;
  }

  &.inactive-btn {
    background: #535763;
    cursor: not-allowed;
    border: 1px solid #535763;
  }
`

const Buttons = styled.button`
  background: #6988ff;
  border: none;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  color: white;
  border-radius: 8px;
  padding: 15px 18px;
  align-items: center;
  width: 100%;

  &:hover {
    background: #809aff;
  }

  &:active {
    background: #809aff;
    opacity: 1;
  }
`

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  pointer: cursor;
  position: relative;
  z-index: 1;
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
  margin: 0px 5px 0px 0px;
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
const Token = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #414141;
  cursor: pointer;
  z-index: 1;
  text-decoration: none;
`

export {
  Container,
  Inner,
  MigrateTop,
  PageTitle,
  PageIntro,
  SpaceLine,
  MigrateBox,
  VaultBox,
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
  Buttons,
}
