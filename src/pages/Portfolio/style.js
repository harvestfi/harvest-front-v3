import styled from 'styled-components'
import UsdIcon from '../../assets/images/ui/usd.svg'
import TokensIcon from '../../assets/images/ui/tokens.svg'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  color: ${props => props.fontColor};

  background: ${props => props.pageBackColor};
  transition: 0.25s;
  position: relative;
  margin-left: 280px;

  @media screen and (min-width: 1920px) {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 100%;
    margin: 0;
  }
`

const Inner = styled.div`
  padding: 70px 76px 57px 76px;
  width: 100%;

  @media screen and (min-width: 1921px) {
    width: 1450px;
  }

  @media screen and (max-width: 1480px) {
    width: 100%;
    padding: 70px 30px 40px;
  }
`

const SubPart = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const FarmTitle = styled.span`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.borderColor};

  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  z-index: 3;
  padding: 27px 20px;
`

const TransactionDetails = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  transition: 0.25s;
  margin-top: 30px;
`

const DetailView = styled.div`
  width: 100%;
  padding: 30px 6px;
  ${props =>
    props.mode === 'dark'
      ? `
    ${
      props.lastElement === 'yes'
        ? 'border-radius: 0 0 10px 10px;'
        : 'border-bottom: 1px solid rgba(255, 255, 255, 0.5);'
    }
  `
      : `
    ${
      props.lastElement === 'yes'
        ? ``
        : `
      border-bottom: 1px solid #E9E9E9;
    `
    }
  `}
  transition: 0.25s;
  cursor: pointer;
  &:hover {
    background: ${props => props.hoverColor};
  }

  @media screen and (max-width: 992px) {
    padding: 12px 6px;
    width: ${props => props.width}px;
  }
`

const FlexDiv = styled.div`
  display: flex;
  position: relative;
  width: ${props => (props.width ? props.width : 'auto')};

  @media screen and (max-width: 992px) {
    ${props =>
      props.display
        ? `
      display: ${props.display};
    `
        : ``};
  }
`

const MyFarm = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 23px;
  display: flex;

  color: ${props => props.fontColor};
  align-self: center;
  align-items: center;

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 18px;
  }
`

const FarmPic = styled.img`
  position: absolute;
  right: 0;
  top: 0;
`

const EmptyPanel = styled.div`
  padding-top: 5%;
  padding-bottom: 5%;

  border-radius: 5px;
  @media screen and (max-width: 992px) {
    padding-top: 70px;
  }
`

const EmptyImg = styled.img`
  margin: auto;
`

const EmptyInfo = styled.div`
  ${props =>
    props.weight
      ? `
    font-weight: ${props.weight};
  `
      : ''}
  ${props =>
    props.size
      ? `
    font-size: ${props.size}px;
  `
      : ''}
  ${props =>
    props.height
      ? `
    line-height: ${props.height}px;
  `
      : ''}
  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}

  text-align: center;
`

const ExploreFarm = styled.button`
  background: white;
  border-radius: 12px;
  color: #1e1f20;
  padding: 15px 130px;
  border: 2px solid #1e1f20;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;

  &:hover {
    background: #f0f0f0;
  }

  &:active {
    background: #e5e5e5;
  }

  img {
    margin-right: 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 15px 84px;
  }
`

const Content = styled.div`
  width: ${props => props.width};
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  align-self: center;
`

const BadgeIcon = styled.div`
  width: 14px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.badgeBack};
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
`

const ThemeMode = styled.div`
  display: flex;

  #theme-switch {
    position: relative;
    width: fit-content;
    height: fit-content;
    touch-action: pan-x;
    user-select: none;

    input {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
    }

    .switch-track {
      background: ${props => props.backColor};
      border: 1px solid ${props => props.borderColor};
      height: 24px;
      width: 50px;
      border-radius: 30px;
      transition: all 0.2s ease 0s;
    }
    .switch-thumb {
      background: url(${props => (props.mode === 'usd' ? UsdIcon : TokensIcon)});
      background-size: cover;
      height: 20px;
      left: 2px;
      position: absolute;
      top: 2px;
      width: 20px;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #7f56d9;
    }
  }

  ${props =>
    props.mode === 'token'
      ? `
      #theme-switch {
        .switch-check {
          opacity: 1;
        }
        .switch-x {
          opacity: 0;
        }
        .switch-thumb {
          left: 27px;
        }
      }
    `
      : `
      
    `}
`

const Div = styled.div`
  width: 32%;

  display: ${props => (props.mobileView ? 'none' : 'block')};

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const Counter = styled.div`
  color: #344054;
  background: #f2c94c;
  width: 20px;
  height: 20px;
  border-radius: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
`

const Header = styled.div`
  width: 100%;
  padding: 10px 6px;
  background: ${props => props.backColor};
  border-bottom: 1px solid ${props => props.borderColor};
  display: flex;

  @media screen and (max-width: 992px) {
    width: ${props => props.width}px;
  }
`

const Column = styled.div`
  width: ${props => props.width};
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  justify-content: start;
  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : `
    color: #475467;
  `}
`

const Status = styled.div`
  ${props =>
    props.status === 'Active'
      ? `
        background: #ECFDF3;
        color: #027A48;
      `
      : `
        background: #FFE8C8;
        color: #F2994A;
        img {
          filter: invert(60%) sepia(97%) saturate(5817%) hue-rotate(15deg) brightness(87%) contrast(86%);
        }
  `};

  padding: 2px 7px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  width: fit-content;
  border-radius: 13px;
  align-items: center;

  img {
    margin-right: 5px;
  }

  @media screen and (max-width: 992px) {
    img {
      margin-right: 0;
    }
  }
`

const LogoImg = styled.img`
  z-index: 10;
  &:not(:first-child) {
    margin-left: -7px;
    ${props =>
      props.zIndex
        ? `
      z-index: ${props.zIndex};
    `
        : ``};
  }
`

const Col = styled.div`
  display: flex;
  cursor: pointer;
  width: fit-content;
`

const ContentInner = styled.div`
  ${props =>
    props.width
      ? `
    width: ${props.width}
  `
      : ``};
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  align-self: center;

  @media screen and (max-width: 992px) {
    margin-top: 10px;
    width: 100%;
  }
`

const TableContent = styled.div`
  ${props =>
    props.count === 0
      ? `
    margin-bottom: 10px;
  `
      : ``}
  @media screen and (max-width: 992px) {
    overflow-x: scroll;
  }
`

export {
  Container,
  SubPart,
  TransactionDetails,
  DetailView,
  FarmTitle,
  FlexDiv,
  MyFarm,
  FarmPic,
  BadgeIcon,
  Inner,
  EmptyPanel,
  EmptyInfo,
  EmptyImg,
  ExploreFarm,
  Content,
  ThemeMode,
  Div,
  Counter,
  Header,
  Column,
  Status,
  LogoImg,
  Col,
  ContentInner,
  TableContent,
}
