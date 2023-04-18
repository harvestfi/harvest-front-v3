import styled from 'styled-components'

const DetailView = styled.div`
  width: 100%;
  margin-left: 320px;
  background: ${props => props.pageBackColor};
  color: ${props => props.fontColor};
  transition: 0.25s;
  @media screen and (min-width: 1920px) {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 992px) {
    margin-left: 0;
  }
`

const Inner = styled.div`
  padding: 70px 72px 0px 76px;

  @media screen and (min-width: 1920px) {
    width: 1450px;
  }

  @media screen and (max-width: 992px) {
    padding: 20px 10px 10px;
    height: 100%;
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
  align-items: center;
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

const Button = styled.button`
  background: #ffffff;
  padding: 10px 20px;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
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
    &.address {
      display: block;
    }
  }
`

const FlexTopDiv = styled.div`
  display: flex;

  img {
    align-self: center;
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
    margin-right: 0px;
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
  transition: 0.25s;
  border-radius: 10px;
  margin-bottom: 15px;
  font-family: 'Inter', sans-serif;
`

const TotalValueFarm = styled.div`
  font-weight: 600;
  font-size: ${props => props.size} px;
  line-height: 35px;
  color: #000000;
  margin-right: 15px;
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

  @media screen and (max-width: 992px) {
    border-radius: 8px;
    width: 24px;
    height: 24px;
    margin-right: 15px;
  }
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

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 18px;
  }
`

const DescInfo = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  display: flex;
  align-items: center;
  font-style: normal;
  a {
    color: ${props => props.fontColor} !important;
  }

  @media screen and (max-width: 992px) {
    font-size: 13px;
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
  background: #f9fafb;
  border-radius: 8px;
  text-decoration: none;
  padding: 9px 17px;
  align-self: center;
  position: relative;
  color: #15202b;

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

  @media screen and (max-width: 992px) {
    margin-bottom: 10px;
    margin-right: 0px;
  }
`

const RestContent = styled.div`
  width: 42%;

  @media screen and (min-width: 1920px) {
    width: 500px;
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

const RestPart = styled.div`
  padding: 20px 18px;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.06);
  background: ${props => props.backColor};

  border-radius: 10px;
  height: ${props =>
    props.widoHeight
      ? `
    ${props.widoHeight}px`
      : `
      unset
    `};
  transition: 0.25s;

  font-family: 'Inter', sans-serif;

  @media screen and (max-width: 992px) {
    width: 100%;
    display: block;
    padding: 20px 10px;
  }
`

const SwitchTag = styled.div`
  width: 100%;
  border: 1px solid ${props => props.borderColor};
  transition: 0.25s;

  background: ${props => props.backColor};

  padding: 6px;

  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
`

const Tag = styled.div`
  width: 50%;
  height: 100%;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  padding: 16px 0;
  color: ${props => props.fontColor};
  border-radius: 9px;
  cursor: pointer;

  ${props =>
    props.active
      ? `
    background: ${props.backColor};
    box-shadow: ${props.shadow};
    color: ${props.fontActiveColor};
  `
      : ``}
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

const SwitchModeMobile = styled.div`
  display: none;

  @media screen and (max-width: 992px) {
    width: 100%;
    border-width: 0;
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
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding: 10px 28px;
  border-bottom: 2px solid ${props => props.borderColor};
  ${props =>
    props.farm
      ? `
    color: #FF9400;
    border-bottom: 4px solid #FF9400;
  `
      : ''}

  ${props =>
    props.details
      ? `
    color: #FF9400;
    border-bottom: 4px solid #FF9400;
  `
      : ''}
  cursor: pointer;

  img {
    margin-right: 5px;
  }
`

const MobileTop = styled.div`
  display: none;

  @media screen and (max-width: 992px) {
    display: block;
    border: 1px solid ${props => props.borderColor};
    border-radius: 10px;
    padding: 9px 13px;
  }
`

const DepositComponets = styled.div`
  ${props =>
    props.show
      ? `
    display: block;
    height: 85%;
  `
      : 'display: none;'}
`

const WithdrawComponents = styled.div`
  ${props =>
    props.show
      ? `
    display: block;
    height: 85%;
  `
      : 'display: none;'}
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
  transition: 0.25s;
  cursor: pointer;
`

const Monospace = styled.span`
  font-family: 'Inter', sans-serif;
  border-bottom: ${props => props.borderBottom || 'unset'};
`

const DivideBar = styled.div`
  height: ${props => (props.height ? props.height : '20px')};
  width: 1px;
  background: ${props => props.backcolor};
  margin: auto 0;
`

const FlexMobileTopDiv = styled(FlexTopDiv)`
  display: flex;
  justify-content: space-between;

  img {
    align-self: center;
  }

  @media screen and (max-width: 992px) {
    margin-bottom: 11px;
  }
`

const RewardPart = styled.div`
  margin-top: 15px;
  padding: 20px 27px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  transition: 0.25s;

  border-radius: 10px;
  height: fit-content;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

export {
  DetailView,
  TopPart,
  TopDesc,
  Button,
  HalfContent,
  FlexDiv,
  TotalValueFarm,
  DescInfo,
  BackBtnRect,
  BackArrow,
  ValueShow,
  HalfInfo,
  InfoLabel,
  RestContent,
  NewLabel,
  RestPart,
  SwitchTag,
  Tag,
  RewardsContainer,
  FlexTopDiv,
  SwitchModeMobile,
  TagMobile,
  MobileTop,
  Inner,
  DepositComponets,
  WithdrawComponents,
  BigDiv,
  TooltipContent,
  Name,
  ChainBack,
  LogoImg,
  InfoIcon,
  Monospace,
  DivideBar,
  FlexMobileTopDiv,
  RewardPart,
}
