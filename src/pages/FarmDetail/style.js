import styled from 'styled-components'

const DetailView = styled.div`
  width: 100%;
  margin-left: 320px;
  background: ${props => props.pageBackColor};
  color: ${props => props.fontColor};

  @media screen and (min-width: 1920px) {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 992px) {
    margin-left: 0;
    // padding: 20px;
  }
`

const Inner = styled.div`
  padding: 70px 72px 0px 76px;
  // background: #FAFAFA;

  @media screen and (min-width: 1920px) {
    width: 1450px;
  }

  @media screen and (max-width: 992px) {
    padding: 20px;
  }
`

const TopPart = styled.div`
  padding-bottom: 23px;
  display: flex;
  justify-content: space-between;
  height: 60px;

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
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

  img.icon {
    margin-right: 10px;
  }

  img.info {
    margin-left: 10px;
  }

  img.info-icon {
    margin-left: 15px;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }
  }
`

const TopDesc = styled(NewLabel)`
  margin-left: 22px;
  margin-right: 19px;
  align-self: center;
  color: ${props => props.fontColor};
`
const FlexDiv = styled.div`
  display: flex;

  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}

  ${props =>
    props.justifyContent
      ? `
    justify-content: ${props.justifyContent};
  `
      : ''}

  @media screen and (max-width: 992px) {
    display: block;

    &.address {
      display: flex;
    }
  }
`

const FlexTopDiv = styled.div`
  display: flex;

  img {
    align-self: center;
  }

  @media screen and (max-width: 992px) {
    margin-top: 18px;
    margin-bottom: 15px;
  }
`

const HalfContent = styled.div`
  width: 56%;
  margin-right: 25px;

  @media screen and (min-width: 1920px) {
    width: 750px;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    ${props =>
      props.show
        ? `
      display: block;
    `
        : `display: none;`}
  }
`

const HalfInfo = styled.div`
  ${props =>
    props.padding
      ? `
  padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.display
      ? `
  display: ${props.display};
  `
      : ''}
  ${props =>
    props.justifyContent
      ? `
  justify-content: ${props.justifyContent};
  `
      : ''}

  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};

  // box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-bottom: 39px;
  font-family: 'DM Sans';
`

const BackBtnRect = styled.a`
  position: relative;
  border-radius: 12px;
  width: 35px;
  height: 35px;
  background: ${props => props.backcolor};
  &:hover {
    background: ${props => props.backhovercolor};
  }

  margin-right: 18px;
  cursor: pointer;
  display: flex;
  align-self: center;
`

const BackArrow = styled.img`
  margin: auto;
  filter: ${props => props.iconcolor};
`

const ValueShow = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  text-align: left;
`

const DescInfo = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 23px;
  display: flex;
  align-items: center;
  font-style: normal;

  a {
    color: ${props => props.fontColor} !important;
  }
`

const InfoLabel = styled.a`
  ${props =>
    props.weight
      ? `
  font-weight: ${props.weight};
  `
      : ''}
  ${props =>
    props.display
      ? `
  display: ${props.display};
  `
      : ''}
  ${props =>
    props.size
      ? `
  font-size: ${props.size};
  `
      : ''}
  ${props =>
    props.height
      ? `
  line-height: ${props.height};
  `
      : ''}
  margin-right: 15px;
  background: #ced3e6;
  border-radius: 6px;
  text-decoration: none;
  padding: 9px 17px;
  align-self: center;
  position: relative;
  color: #1f2937;

  img.icon {
    margin-right: 5px;
  }

  img.external-link {
    position: absolute;
    top: 3px;
    right: 3px;
  }

  &:hover {
    color: #1f2937;
    background: #ced3e6c0;
    .address {
      font-weight: bold;
    }
  }
`

const RestContent = styled.div`
  width: 42%;

  @media screen and (min-width: 1920px) {
    width: 500px;
  }
`

const RestPart = styled.div`
  padding: 20px 27px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};

  border-radius: 10px;
  height: fit-content;

  @media screen and (max-width: 992px) {
    width: 100%;
    ${props =>
      props.show
        ? `
      display: block;
    `
        : `display: none;`}
  }
`

const RewardPart = styled.div`
  margin-top: 15px;
  padding: 20px 27px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};

  border-radius: 10px;
  height: fit-content;

  @media screen and (max-width: 992px) {
    width: 100%;
    ${props =>
      props.show
        ? `
      display: block;
    `
        : `display: none;`}
  }
`

const BalanceItem = styled.div`
  width: 100%;
  margin: 5px auto;
  // background: #F9FAFC;
  border-radius: 12px;
  border: 1px solid ${props => props.borderColor};
  padding: 15px 20px;
  position: relative;
`

const DivFlex = styled.div`
  display: flex;
  ${props =>
    props.justify
      ? `
    justify-content: ${props.justify};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
`

const SwitchTag = styled.div`
  width: 100%;
  // height: 40px;
  border: 1px solid ${props => props.borderColor};

  border-radius: 12px;
  margin-bottom: 15px;
  display: flex;
`

const Tag = styled.div`
  width: 50%;
  height: 100%;
  // border-width: 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  padding: 16px 0;
  // color: black;
  border-radius: 9px;

  @media screen and (max-width: 1256px) {
    font-size: 12px;
    line-height: 16px;
  }

  &.tag1 {
    margin-right: -8px;
  }

  &.tag2 {
    margin-left: -8px;
  }

  ${props =>
    props.active1
      ? `
    width: 55%;
    background: rgba(39, 174, 96, 0.3);
    color: #27AE60;
    font-weight: bold;
  `
      : ``}

  ${props =>
    props.active2
      ? `
    width: 55%;
    background: rgba(255, 169, 169, 0.3);
    color: #FFA9A9;
    font-weight: bold;
    
    &.tag2 {
      img {
        filter: ${prop => prop.filterColor};
      }
    }
  `
      : `
    &.tag2 {
      border-left: 0;
    }
  `}

  cursor: pointer;

  img {
    margin-right: 5px;
  }
`

const RewardsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  span {
    font-size: 20px;
  }

  b {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const MigrationLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 30px;
  font-weight: 700;
  width: 100%;
  height: 100%;
`

const SwitchModeMobile = styled.div`
  display: none;

  @media screen and (max-width: 992px) {
    width: 100%;
    border-width: 0;
    // border: 1px solid #D1D1D1;
    border-radius: 12px;
    margin-bottom: 20px;
    margin-top: 13px;
    display: flex;
  }
`

const TagMobile = styled.div`
  width: 50%;
  height: 100%;
  border-width: 0;
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  padding: 16px 28px;
  border-bottom: 2px solid #e9e9e9;
  color: #1f2937;
  ${props =>
    props.farm
      ? `
    // background: #CAF1D5;
    color: #1F2937;
    border-bottom: 4px solid #FFD984;
    // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  `
      : ''}

  ${props =>
    props.details
      ? `
    // background: #FFA9A9;
    color: #1F2937;
    border-bottom: 4px solid #FFD984;
    // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  `
      : ''}
  // border-radius: 12px;
  cursor: pointer;

  img {
    margin-right: 5px;
  }
`

const MobileTop = styled.div`
  display: none;

  @media screen and (max-width: 992px) {
    display: block;
    background: radial-gradient(81.9% 81.9% at 50% 18.1%, #00ff82 0%, #188e54 100%);
    border-radius: 20px;
    padding: 14px 13px;
    position: relative;

    .collabo-back {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
`

const CollaboButton = styled.button`
  padding: 5px 10px;
  background: #f3e8f7;
  border-radius: 10px;
`

const BigDiv = styled(FlexDiv)`
  justify-content: start;
`

const TooltipContent = styled.div`
  display: flex;
  color: black !important;
  padding: 10px 0;
  font-weight: 800;
`

const Name = styled.div`
  margin-right: 50px;
`

const ChainBack = styled.div`
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-self: center;
  padding: 4px;
`

const LogoImg = styled.img`
  margin-right: -5px;
  ${props =>
    props.zIndex
      ? `
    z-index: ${props.zIndex};
  `
      : ``}
`

const InfoIcon = styled.img`
  filter: ${props => props.filterColor};
  cursor: pointer;
`

export {
  DetailView,
  TopPart,
  TopDesc,
  HalfContent,
  FlexDiv,
  DescInfo,
  BackBtnRect,
  BackArrow,
  ValueShow,
  HalfInfo,
  InfoLabel,
  RestContent,
  BalanceItem,
  NewLabel,
  DivFlex,
  RestPart,
  SwitchTag,
  Tag,
  RewardsContainer,
  MigrationLabel,
  FlexTopDiv,
  SwitchModeMobile,
  TagMobile,
  MobileTop,
  CollaboButton,
  Inner,
  BigDiv,
  TooltipContent,
  Name,
  ChainBack,
  LogoImg,
  InfoIcon,
  RewardPart,
}
