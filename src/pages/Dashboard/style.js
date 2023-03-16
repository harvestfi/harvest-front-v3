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
  z-index: 2;
  // margin-left: 320px;

  @media screen and (min-width: 1920px) {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    // padding: 0 27px;
    height: 100%;
    margin: 0;
  }
`

const Inner = styled.div`
  padding: 70px 76px 57px 76px;

  @media screen and (min-width: 1920px) {
    width: 1450px;
  }

  @media screen and (max-width: 1280px) {
    width: 100%;
    padding: 0px 12px 19px 12px;
  }
`

const SubPart = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1280px) {
    display: block;
    // padding-top: 34px;
  }
`

const TotalValueRow = styled.div`
  display: flex;
  justify-content: space-between;

  border-radius: 10px;
  margin-bottom: 30px;

  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  transition: 0.25s;
`

const SecondaryPart = styled.div`
  width: 45%;

  @media screen and (max-width: 1280px) {
    width: 100%;
  }
`

const FarmTitle = styled.span`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  z-index: 3;

  @media screen and (max-width: 992px) {
    margin-top: 15px;
    margin-bottom: 18px;
  }
`

const TransactionDetails = styled.div`
  width: 100%;
  border-radius: 5px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  transition: 0.25s;
`

const DetailView = styled.div`
  width: 100%;
  padding: 15px 6px;
  ${props =>
    props.mode === 'dark'
      ? `
    ${props.lastElement === 'yes' ? '' : 'border-bottom: 1px solid rgba(255, 255, 255, 0.5);'}
  `
      : `
    border: 1px solid #E9E9E9;
  `}
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    padding: 12px;
  }
`

const FlexDiv = styled.div`
  display: flex;
  position: relative;
  width: ${props => (props.width ? props => props.width : 'auto')};

  @media screen and (max-width: 992px) {
    ${props =>
      props.display
        ? `
      display: ${props.display};
      // width: 50%;
    `
        : ``};
  }
`

const MyFarm = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 21px;
  align-self: center;

  img {
    margin-right: 15px;
  }

  @media screen and (max-width: 992px) {
    // margin-bottom: 15px;
    font-size: 14px;
    line-height: 18px;

    img {
      width: 15px;
      height: 15px;
    }
  }
`

const FarmPic = styled.img`
  position: absolute;
  right: 0;
  top: 0;
`

const EmptyPanel = styled.div`
  // height: 50%;
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
  background: #27ae60;
  border-radius: 12px;
  color: white;
  padding: 15px 130px;
  border: none;

  &:hover {
    background: #27ae60d0;
  }

  &:active {
    background: #27ae60f0;
  }

  img {
    margin-right: 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 15px 84px;
  }
`

const FirstPart = styled.div`
  display: flex;
  width: 60%;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const SecondPart = styled.div`
  display: flex;
  width: 40%;

  @media screen and (max-width: 992px) {
    width: 100%;
    display: block;
  }
`

const FirstContent = styled.div`
  // padding-top: 10px;
  width: ${props => (props.width ? props => props.width : 'auto')};
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  align-self: center;
  display: ${props => props.display};
  justify-content: center;

  .coin {
    width: 37px;
    height: 37px;
  }

  .coin:not(:first-child) {
    margin-left: -8px;
  }

  @media screen and (max-width: 992px) {
    ${props =>
      props.display
        ? `
      display: ${props.display};
      justify-content: center;
      // margin-left: 10px;
      align-self: flex-start;
      margin-top: 14px;
      width: 40%;
    `
        : ``};

    .coin {
      width: 32px;
      height: 32px;
    }

    .coin:not(:first-child) {
      margin-left: -8px;
    }
  }
`

const SecondContent = styled.div`
  width: 50%;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  // align-self: center;

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: space-between;
    align-self: flex-start;
    margin-top: 14px;
    width: 100%;
  }
`

const BadgeIcon = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 17px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.badgeBack};
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  @media screen and (max-width: 992px) {
    border-radius: 2px;
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
      height: 22px;
      left: 1px;
      position: absolute;
      top: 1px;
      width: 22px;
      // border-image: initial;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #ff9400;
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

export {
  Container,
  SubPart,
  TotalValueRow,
  SecondaryPart,
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
  FirstPart,
  FirstContent,
  SecondPart,
  SecondContent,
  ThemeMode,
}
