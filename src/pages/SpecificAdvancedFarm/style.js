import styled from 'styled-components'

const DetailView = styled.div`
  width: 100%;
  margin-left: 280px;
  background: ${props => props.pageBackColor};
  color: ${props => props.fontColor};
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    margin-left: 0;
    padding-bottom: 150px;
  }
`

const Inner = styled.div`
  padding: 0px 72px 200px 76px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1480px) {
    padding: 0px 30px 40px;
  }

  @media screen and (max-width: 1024px) {
    padding: 0px 20px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 24px 29px 50px 31px;
    height: 100%;
    background: #fff;
  }
`

const TopInner = styled.div`
  padding: 10px 72px 20px 76px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1480px) {
    padding: 25px 30px 25px;
  }

  @media screen and (max-width: 1024px) {
    padding: 0px 20px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 24px 29px 50px 31px;
    height: 100%;
    background: #fff;
  }
`

const TopBtnInner = styled.div`
  padding: 100px 72px 20px 76px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1480px) {
    padding: 70px 30px 0px;
  }

  @media screen and (max-width: 1024px) {
    padding: 50px 20px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 24px 29px 0px 31px;
    height: 100%;
    background: #fff;
  }
`

const TopPart = styled.div`
  width: 80%;
  padding: 60px 45px 60px 45px;
  display: flex;
  justify-content: space-between;
  background: #eaf1ff;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 10px;
  overflow: hidden;

  img.bottom {
    position: absolute;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 0;
  }

  @media screen and (min-width: 1921px) {
    width: 1200px;
  }

  @media screen and (max-width: 1624px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    padding: 41px 30px 50px 30px;
  }
`

const TopButton = styled.div`
  width: 80%;
  display: flex;
  justify-content: start;

  @media screen and (min-width: 1921px) {
    width: 1200px;
  }

  @media screen and (max-width: 1624px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    padding: 24px 29px 50px 31px;
    height: 100%;
    background: #fff;
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

const TopDesc = styled(NewLabel)`
  color: #344054;
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
    props.gap
      ? `
      gap: ${props.gap};
    `
      : ''}

  ${props =>
    props.padding
      ? `
      padding: ${props.padding};
    `
      : ''}

  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}

  ${props =>
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
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

const InternalSection = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${props => props.height};

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const FlexTopDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: center;
  z-index: 1;

  img {
    align-self: center;
  }

  img.mobile-logo {
    display: none;
  }

  @media screen and (max-width: 992px) {
    &.desktop-logo {
      display: none;
    }

    img.mobile-logo {
      display: block;
    }
  }
`

const HalfContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: fit-content;
  background: #fff;
  // box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  ${props =>
    props.borderRadius
      ? `
    border-radius: ${props.borderRadius};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}

  ${props =>
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
  `
      : ''}

  height: ${props =>
    props.partHeight
      ? `
    ${props.partHeight}px`
      : `
      fit-content
    `};
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
  display: inline-flex;
  height: 35px;
  text-decoration: none;
  border: 1px solid #475467;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;

  &:hover {
    background: rgba(236, 236, 236, 0.7);
  }
`

const BackArrow = styled.img`
  margin: auto;
`

const BackText = styled.p`
  color: #475467;
  margin: auto;
  padding-left: 15px;
  font-size: 14px;
`

const RestContent = styled.div`
  width: 43%;
  height: ${props => props.height};

  @media screen and (min-width: 1921px) {
    width: 500px;
  }

  @media screen and (max-width: 1480px) {
    width: 48%;
  }

  @media screen and (max-width: 1281px) {
    width: 50%;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const BigDiv = styled(FlexDiv)`
  width: 80%;
  display: block;

  @media screen and (min-width: 1921px) {
    width: 1200px;
  }

  @media screen and (max-width: 1624px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const LogoImg = styled.img`
  margin-right: -5px;
  width: 64px;

  @media screen and (max-width: 992px) {
    width: 32px;
  }

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
  margin-left: 5px;
`

const Monospace = styled.span`
  font-family: 'Inter', sans-serif;
  border-bottom: ${props => props.borderBottom || 'unset'};
`

const MyBalance = styled.div`
  border-radius: 12px;
  background: #fff;
  // box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);

  ${props =>
    props.marginTop
      ? `
      margin-top: ${props.marginTop};
    `
      : ``}

  ${props =>
    props.marginBottom
      ? `
      margin-bottom: ${props.marginBottom};
    `
      : ``}
`

const GuideSection = styled.div`
  display: flex;
  margin-bottom: 24px;

  @media screen and (max-width: 992px) {
    margin-top: 19px;
    margin-bottom: 5px;
  }

  @media screen and (max-width: 343px) {
    flex-direction: column;
    gap: 10px;
  }
`

const GuidePart = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  border-radius: 18px;
  padding: 3px 11px 3px 9px;
  background: #ffffff;
  margin-right: 10px;
  color: #344054;
  font-size: 14.597px;
  line-height: 22px;
  font-weight: ${props => props.fontWeight};

  &:last-child {
    margin-right: 0;
  }

  img {
    margin-right: 7px;
  }

  @media screen and (max-width: 992px) {
    font-size: 8px;
    line-height: 12px;

    img {
      margin-right: 3px;
    }

    img.icon {
      width: 11px;
    }
  }
`

const DepositSection = styled.div`
  ${props =>
    props.isShow
      ? `
    display: block;
    height: 100%;
  `
      : `
    display: none;
  `}
`

const WithdrawSection = styled.div`
  ${props =>
    props.isShow
      ? `
    display: block;
    height: 100%;
  `
      : `
    display: none;
  `}
`

const MainSection = styled.div`
  width: 55%;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  border-radius: 12px;
  height: ${props => props.height};

  @media screen and (max-width: 1480px) {
    width: 49%;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-right: 0px;
    display: none;
  }
`

const ChainBack = styled.div`
  background: #fff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-self: center;
  padding: 4px;

  margin-left: 15px;

  @media screen and (max-width: 992px) {
    width: 12px;
    height: 12px;
    margin-left: 10px;
  }
`

const MainTag = styled.div`
  display: flex;
  justify-content: center;
  width: 33%;
  padding: 8px 12px;
  align-items: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  ${props =>
    props.active === 'true'
      ? `
      color: #1F2937;
      background: #EAF1FF;
      box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10);
    `
      : `
      color: #667085;
      background: white;
    `}

  p {
    margin-bottom: 0px;
    padding-left: 10px;
  }

  img {
    ${props =>
      props.active === 'true'
        ? `
      `
        : `
        filter: invert(43%) sepia(5%) saturate(1510%) hue-rotate(183deg) brightness(99%) contrast(86%);
      `}
  }
`

const MainDescText = styled.div`
  color: #475467;
  font-size: 16px;
  margin-bottom: 25px;
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

  border-radius: 10px;
  background: #fff;
  transition: 0.25s;
  margin-bottom: ${props => props.marginBottom};
  font-family: 'Inter', sans-serif;
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
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
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

const DescInfo = styled.div`
  font-family: 'Inter', sans-serif;
  color: #475467;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  font-style: normal;
  border-top: 1px solid #ebebeb;

  .help-message {
    margin-top: 0;
    p {
      a {
        cursor: pointer;
      }
    }
  }

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 20px;
    padding: 7px 11px;
  }
`

const LastHarvestInfo = styled.div`
  background: #fff;
  border-radius: 15px;
  // box-shadow: 0px 10px 18px 0px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  margin-bottom: 25px;
`

const RestInternal = styled.div`
  display: flex;
  // justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const StakeSection = styled.div`
  ${props =>
    props.isShow
      ? `
    display: block;
    height: 100%;
  `
      : `
    display: none;
  `}
`

const UnstakeSection = styled.div`
  ${props =>
    props.isShow
      ? `
    display: block;
    height: 100%;
  `
      : `
    display: none;
  `}
`

const MainTagPanel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  width: 100%;
  padding: 5px;
  background: white;
  border-radius: 8px;

  @media screen and (max-width: 992px) {
    margin-bottom: 24px;
    justify-content: space-between;
  }
`

const FirstPartSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    display: flex;
    flex-direction: column-reverse;
  }
`

const SecondPartSection = styled.div`
  width: 100%;

  @media screen and (max-width: 992px) {
    display: flex;
    flex-direction: column-reverse;
  }
`

const APRValueShow = styled.div`
  padding: 1.466px 7.331px 1.466px 5.865px;
  border-radius: 11.729px;
  background: #f2f4f7;
  color: #344054;
  text-align: center;
  font-size: 10.73px;
  font-weight: 500;
  line-height: 14.662px;
  display: flex;
  align-items: center;

  img {
    margin-right: 4px;
    width: 6px;
    height: 6px;
  }
`

const BorderBottomDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 15px;
  background: #036666;
  bottom: 0;
  right: 0;
`

export {
  DetailView,
  TopPart,
  TopButton,
  TopDesc,
  Button,
  HalfContent,
  FlexDiv,
  TotalValueFarm,
  BackBtnRect,
  BackArrow,
  BackText,
  RestContent,
  NewLabel,
  FlexTopDiv,
  Inner,
  TopInner,
  TopBtnInner,
  BigDiv,
  LogoImg,
  InfoIcon,
  Monospace,
  MyBalance,
  GuideSection,
  GuidePart,
  DepositSection,
  WithdrawSection,
  MainSection,
  ChainBack,
  MainTag,
  MainDescText,
  InternalSection,
  HalfInfo,
  InfoLabel,
  DescInfo,
  LastHarvestInfo,
  RestInternal,
  StakeSection,
  UnstakeSection,
  MainTagPanel,
  FirstPartSection,
  SecondPartSection,
  APRValueShow,
  BorderBottomDiv,
}
