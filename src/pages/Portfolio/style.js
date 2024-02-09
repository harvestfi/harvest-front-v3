import styled from 'styled-components'
import UsdIcon from '../../assets/images/ui/usd-port.svg'
import TokensIcon from '../../assets/images/ui/tokens-port.svg'
import BoxBgOne from '../../assets/images/logos/dashboard/box-bg-1.png'
import BoxBgTwo from '../../assets/images/logos/dashboard/box-bg-2.png'
import BoxBgThree from '../../assets/images/logos/dashboard/box-bg-3.svg'

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
    padding-bottom: 100px;
  }
`

const Inner = styled.div`
  padding: 100px;
  width: 100%;

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

const SubPart = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const MobileSubPart = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const MobileDiv = styled.div`
  display: none;

  @media screen and (max-width: 992px) {
    display: flex;
    flex-wrap: wrap;
    border: 2px solid #f2f5ff;
    border-radius: 6.5px;
    width: 100%;
    margin-bottom: 24px;

    div:first-child {
      border-right: 0.821px solid #f2f5ff;
    }
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
  border-radius: 15px;
  background: ${props => props.backColor};
  transition: 0.25s;
  margin-top: 25px;
`

const DetailView = styled.div`
  width: 100%;
  padding: 16px 24px;
  cursor: pointer;
  background: ${props => props.background};
  border: 1px solid ${props => props.borderColor};
  border-top: 0px;
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
      border-bottom: 1px solid ${props.borderColor};
    `
    }
  `}
  transition: 0.25s;

  &:hover {
    background: #e9f0f7;
  }

  @media screen and (max-width: 992px) {
    padding: 0px;
    border: unset;
    border-bottom: 1px solid #f2f5ff;
  }
`

const FlexDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: ${props => (props.width ? props.width : 'auto')};
  padding: ${props => (props.padding ? props.padding : 'unset')};

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
  padding-top: 15%;
  padding-bottom: 15%;
  border-radius: 5px;
  border-right: 1px solid ${props => props.borderColor};
  border-bottom: 1px solid ${props => props.borderColor};
  border-left: 1px solid ${props => props.borderColor};
  @media screen and (max-width: 992px) {
    padding: 0px;
    border: none;
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

  display: flex;
  justify-content: center;
  text-align: center;
  gap: 23px;
  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: center;
    font-size: 10px;
    line-height: 18px;
  }
`

const ExploreFarm = styled.div`
  background-image: url(${props =>
    props.bgImage === 'first' ? BoxBgOne : props.bgImage === 'second' ? BoxBgTwo : BoxBgThree});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 175px;
  border-radius: 12.18px;
  border: none;
  box-shadow: 0px 4.06px 4.06px -2.03px rgba(16, 24, 40, 0.03),
    0px 10.15px 12.18px -2.03px rgba(16, 24, 40, 0.08);
  color: #fff;
  padding: 0px 25px;
  font-weight: 400;
  font-size: 15px;
  line-height: 14px;
  display: flex;
  align-self: center;
  cursor: pointer;

  @media screen and (max-width: 992px) {
    padding: 8px 13px;
    font-size: 12px;
  }
`

const ExploreContent = styled.div`
  margin: auto 0px;
  text-align: left;
`

const ExploreTitle = styled.div`
  font-weight: 600;
  font-size: 21px;
  line-height: 20px;
  padding-bottom: 10px;
`

const Content = styled.div`
  width: ${props => props.width};
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ``}
  ${props =>
    props.cursor
      ? `
      cursor: ${props.cursor};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  align-self: center;

  &.mobile-extender {
    width: unset;
    position: absolute;
    top: 2.5%;
    right: 3%;

    img.file-icon {
      padding: 6px;
    }

    img.active-file-icon {
      padding: 6px;
    }
  }

  img.file-icon {
    padding: 4px;
    background: #f3f7ff;
    border-radius: 4.7px;
    border: 1px solid #fff;
  }

  img.active-file-icon {
    background: #eaf1ff;
    padding: 4px;
    border-radius: 4.7px;
    border: 1px solid #fff;
  }

  img.active-file-icon:hover {
    background: #eaf1ff;
  }

  img.file-icon:hover {
    background: #eaf1ff;
  }
`

const BadgeIcon = styled.div`
  margin: auto 17px auto 0px;
  width: 23px;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 2px solid ${props => props.borderColor};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.15);

  &.network-badge {
    @media screen and (max-width: 992px) {
      margin-bottom: 15px;
    }
  }
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
  padding: 12px 24px;
  background: ${props => props.backColor};
  display: flex;
  border: 1px solid ${props => props.borderColor};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const Column = styled.div`
  width: ${props => props.width};
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
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
  width: 37px;
  height: 37px;

  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft}
  `
      : ``};
`

const Img = styled.img`
  width: 37px;
  height: 37px;
  margin: auto 6px auto 0px;
  @media screen and (max-width: 992px) {
    width: 26px;
    height: 26px;
  }
`

const Col = styled.div`
  display: flex;
  cursor: pointer;
  width: fit-content;
  @media screen and (max-width: 1200px) {
    flex-flow: column;
  }

  img.sortIcon {
    width: 8.8px;
    height: 10.5px;
    margin: auto 0px auto 5px;
    @media screen and (max-width: 1200px) {
      margin: auto;
    }
  }

  img.info {
    margin-right: 3px;
    margin-left: 0px;
  }

  #tooltip-balance {
    max-width: 300px;
  }
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
`

const TableContent = styled.div`
  ${props =>
    props.count === 0
      ? `
    margin-bottom: 10px;
  `
      : ``}
  @media screen and (max-width: 992px) {
    // overflow-x: scroll;
    border-radius: 15px 15px 0px 0px;
    border: 1px solid #f2f5ff;
    ${props =>
      props.count === 0
        ? `
        border-radius: unset;
        border: none;
    `
        : ``}
  }
`

const DescInfo = styled.div`
  display: none;
  @media screen and (max-width: 992px) {
    display: block;
    font-size: 12px;
    line-height: 24px;
    font-weight: 400;
    color: #475467;
    padding-bottom: 10px;
    border-bottom: 2px solid ${props => props.borderColor};
  }
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
  ${props =>
    props.borderBottom
      ? `
    border-bottom: ${props.borderBottom};
  `
      : ''}

  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  ${props =>
    props.position
      ? `
    position: ${props.position};
  `
      : ''}
  ${props =>
    props.align
      ? `
    text-align: ${props.align};
  `
      : ''}
  ${props =>
    props.justifyContent
      ? `
    justify-content: ${props.justifyContent};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  ${props =>
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
  `
      : ''}
  ${props =>
    props.marginRight
      ? `
    margin-right: ${props.marginRight};
  `
      : ''}
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ''}
  ${props =>
    props.items
      ? `
    align-items: ${props.items};
  `
      : ''}
  ${props =>
    props.self
      ? `
    align-self: ${props.self};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
  ${props =>
    props.borderRadius
      ? `
    border-radius: ${props.borderRadius};
    `
      : ``}
  img.icon {
    margin-right: 10px;
  }

  img.thumbs-up {
    margin-right: 10px;
  }

  img.info-icon {
    margin-left: 15px;
  }

  #info .tooltip-inner {
    background: black;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }

    img.thumbs-up {
      margin-right: 5px;
      width: 11px;
    }
  }
`

export {
  Container,
  SubPart,
  MobileSubPart,
  MobileDiv,
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
  ExploreContent,
  ExploreTitle,
  Content,
  ThemeMode,
  Div,
  Counter,
  Header,
  Column,
  Status,
  LogoImg,
  Img,
  Col,
  ContentInner,
  TableContent,
  DescInfo,
  NewLabel,
}
