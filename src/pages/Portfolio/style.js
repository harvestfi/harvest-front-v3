import styled from 'styled-components'
import UsdIcon from '../../assets/images/ui/usd-port.svg'
import TokensIcon from '../../assets/images/ui/tokens-port.svg'
import BoxBgOne from '../../assets/images/logos/dashboard/box-bg-1.png'
import BoxBgTwo from '../../assets/images/logos/dashboard/box-bg-2.png'
import BoxBgThree from '../../assets/images/logos/dashboard/box-bg-3.png'

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
  gap: 10px;

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
    border: 2px solid ${props => props.borderColor};
    border-radius: 6.5px;
    width: 100%;
    margin-bottom: 24px;
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
  transition: 0.25s;
  margin-top: 25px;
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
  padding-top: 12%;
  padding-bottom: 12%;
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
    flex-flow: column;
    font-size: 10px;
    line-height: 18px;
  }
`

const ConnectButtonStyle = styled.button`
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  margin: 25px auto;
  width: 250px;
  background: ${props => props.backColor};
  border-radius: 8px;
  border: 1px solid ${props => props.inputBorderColor};
  color: ${props => props.fontColor2};
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  cursor: pointer;

  ${props =>
    props.connected
      ? `
      padding: 7px 45px 7px 11px;
      filter: drop-shadow(0px 4px 52px rgba(0, 0, 0, 0.25));

      &:hover {
        background: #E6F8EB;
      }
    `
      : `
      padding: 15px 0px 15px 0px;
    `}

  &:hover {
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05),
      0px 0px 0px 4px ${props => props.hoverColorButton};
    img.connect-wallet {
      filter: brightness(0) saturate(100%) invert(69%) sepia(55%) saturate(4720%) hue-rotate(110deg)
        brightness(91%) contrast(86%);
    }
  }

  img.connect-wallet {
    margin: auto 25px auto 0px;
  }

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: center;
    align-items: center;

    ${props =>
      props.connected
        ? `
      background: none;
      color: ${props.fontcolor};
      font-size: 11px;
      padding: 2px 16px 2px 7px;
      border: 1px solid ${props.bordercolor};
      `
        : `
      padding: 10px 11px;
      font-size: 13px;
      `}

    img.connect-wallet {
      margin-right: 15px;
      width: 14px;
      height: 14px;
    }
  }
`

const ExploreFarm = styled.div`
  /* background-image: url(${props =>
    props.bgImage === 'first' ? BoxBgOne : props.bgImage === 'second' ? BoxBgTwo : BoxBgThree}); */
  background-image: ${props =>
    `url('${
      props.bgImage === 'first' ? BoxBgOne : props.bgImage === 'second' ? BoxBgTwo : BoxBgThree
    }')`};
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
  color: ${props => props.color};
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
    border: 1px solid ${props => props.borderColor};
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
    color: ${props => props.fontColor};
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

const CheckBoxDiv = styled.div`
  cursor: pointer;
  margin-top: 25px;
  margin-right: 25px;
  display: inline-block;
  position: relative;

  svg {
    position: absolute;
    top: 4px;
  }

  div {
    padding-left: 23px;
  }
`

export {
  Container,
  SubPart,
  MobileSubPart,
  MobileDiv,
  TransactionDetails,
  FarmTitle,
  MyFarm,
  FarmPic,
  Inner,
  EmptyPanel,
  EmptyInfo,
  EmptyImg,
  ExploreFarm,
  ExploreContent,
  ExploreTitle,
  ThemeMode,
  Div,
  Counter,
  Header,
  Column,
  Status,
  Col,
  TableContent,
  DescInfo,
  NewLabel,
  ConnectButtonStyle,
  CheckBoxDiv,
}
