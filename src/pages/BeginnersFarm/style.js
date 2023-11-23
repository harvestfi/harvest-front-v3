import styled from 'styled-components'

const DetailView = styled.div`
  width: 100%;
  margin-left: 280px;
  color: ${props => props.fontColor};
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    margin-left: 0;
    padding-bottom: 100px;
  }
`

const Inner = styled.div`
  padding: 25px 72px 200px 76px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1480px) {
    padding: 25px 30px 40px;
  }

  @media screen and (max-width: 1024px) {
    padding: 25px 20px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 25px 15px 0px 15px;
    height: 100%;
    background: #fff;
  }
`

const TopInner = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  padding: 50px 72px 0px 76px;
  display: flex;
  justify-content: center;
  background: ${props =>
    props.isETHFarm
      ? `
      #627EEA
  `
      : '#2775ca'};

  @media screen and (max-width: 1480px) {
    padding: 25px 30px 0px;
  }

  @media screen and (max-width: 1024px) {
    padding: 20px 20px 0px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 24px 29px 0px 31px;
    height: 100%;
  }
`

const TopPart = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  position: relative;
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
    width: 1300px;
  }

  @media screen and (max-width: 1624px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    z-index: 0;
  }
`

const TopButton = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 49px;

  @media screen and (min-width: 1921px) {
    width: 1200px;
  }

  @media screen and (max-width: 1624px) {
    width: 100%;
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

  #tooltip-token-name,
  #tooltip-balance,
  #tooltip-underlying-balance {
    max-width: 300px;
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

const ThemeMode = styled.div`
  display: flex;
  align-items: center;

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
      background: #036666;
      height: 16px;
      width: 32px;
      border-radius: 30px;
      transition: all 0.2s ease 0s;
    }
    .switch-thumb {
      background-size: cover;
      background-repeat: no-repeat;
      background-color: white;
      height: 14px;
      left: 1px;
      position: absolute;
      top: 1px;
      width: 14px;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #ff9400;
    }
  }

  ${props =>
    props.mode === 'Farm(Legacy)'
      ? `
      #theme-switch {
        .switch-check {
          opacity: 1;
        }
        .switch-x {
          opacity: 0;
        }
        .switch-thumb {
          left: 16px;
        }
        .switch-track {
          background: #A9A9A9 ;
        } 
      }
    `
      : `
      #theme-switch {
        .switch-thumb {
        }
      }
    `}

  @media screen and (max-width: 992px) {
    #theme-switch {
      .switch-track {
        width: 24px;
        height: 12px;
      }

      .switch-thumb {
        width: 10px;
        height: 10px;
        top: 1px;
      }
    }

    ${props =>
      props.mode === 'deposit'
        ? `
        #theme-switch {
          .switch-thumb {
            left: 12px;
          }
      `
        : `
        #theme-switch {
        .switch-thumb {
          left: 2px;
        }
      `}
`

const TopDesc = styled(NewLabel)`
  color: #fff;
  margin: auto 0px auto 35px;
  @media screen and (max-width: 992px) {
    margin: 0px;
  }
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
    flex-flow: column;
    justify-content: center;
    margin: auto;
    &.address {
      display: block;
    }
  }
`

const InternalSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: ${props => props.height};

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const FlexTopDiv = styled.div`
  width: 100%;
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
  border: 2px solid #f2f5ff;
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
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;

  svg {
    margin: auto;
    color: white;
  }
`

const BackText = styled.p`
  color: #fff;
  margin: auto;
  padding-left: 15px;
  font-size: 14px;
`

const RestContent = styled.div`
  width: 39%;
  height: ${props => props.height};

  @media screen and (min-width: 1921px) {
    width: 500px;
  }

  // @media screen and (max-width: 1480px) {
  //   width: 49%;
  // }

  // @media screen and (max-width: 1281px) {
  //   width: 50%;
  // }

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const BigDiv = styled(FlexDiv)`
  width: 90%;
  display: block;

  @media screen and (min-width: 1921px) {
    width: 1300px;
  }

  @media screen and (max-width: 1624px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const LogoImg = styled.img`
  margin-right: -20px;
  width: 69px;

  @media screen and (max-width: 992px) {
    width: 32px;
    margin-right: 0px;
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
  margin-top: -2px;
`

const InfoIconBlack = styled.img`
  transition: 0.25s;
  cursor: pointer;
  margin-left: 5px;
`

const Monospace = styled.span`
  font-family: 'Inter', sans-serif;
  border-bottom: ${props => props.borderBottom || 'unset'};
`

const MyBalance = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 2px solid #f2f5ff;

  ${props =>
    props.height
      ? `
      height: ${props.height};
    `
      : ``}

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
  margin-bottom: 49px;
  margin-top: 5px;

  @media screen and (max-width: 992px) {
    margin-top: 10px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 343px) {
    flex-direction: column;
    gap: 10px;
  }
`

const GuidePart = styled.div`
  border-radius: 5px;
  border: 1.3px solid #fff;
  display: flex;
  padding: 2px 8px;
  align-items: center;
  gap: 6px;
  width: fit-content;
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin-right: 10px;

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
  width: 59%;
  display: flex;
  flex-direction: column;
  height: fit-content;
  border-radius: 12px;
  height: ${props => props.height};

  // @media screen and (max-width: 1480px) {
  //   width: 49%;
  // }

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-right: 0px;
  }
`

const BoxCover = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 25px;

  @media screen and (max-width: 992px) {
    border-radius: 12px;
    border: 2px solid #f3f6ff;
  }
`

const ValueBox = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  border-radius: 12px;
  border: 2px solid #f3f6ff;
  background: var(--base-white, #fff);
  padding: 24px;
  height: 120px;
  ${props => (props.width ? `width: ${props.width};` : '')}

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 70px;
    padding: 8px 13px;
    border: unset;

    &.balance-box {
      border-right: 2px solid #f3f6ff;
      border-radius: 14px 0px 0px 14px;
    }
    &.daily-yield-box {
      border-left: 2px solid #f3f6ff;
      border-radius: 0px 14px 14px 0px;
    }
  }
`

const BoxTitle = styled.div`
  color: #6f78aa;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  #tooltip-mybalance,
  #tooltip-monthly-yield,
  #tooltip-daily-yield {
    max-width: 300px;
  }

  @media screen and (max-width: 992px) {
    font-size: 10px;
    .info {
      display: none;
    }
  }
`

const BoxValue = styled.div`
  color: var(--gray-900, #101828);
  font-weight: 600;
  letter-spacing: -0.6px;
  font-size: 22px;

  @media screen and (max-width: 992px) {
    font-size: 18px;
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
  width: 50%;
  padding: 12px 15px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  color: #1f2937;

  ${props =>
    props.active === 'true'
      ? `
      background: white;
      border-radius: 6px 6px 0px 0px;
    `
      : `
      color: #fff;
      background: ${
        props.isETHFarm
          ? `
          #627EEA
      `
          : '#2775ca'
      };
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
        filter: invert(98%) sepia(76%) saturate(0%) hue-rotate(113deg) brightness(116%) contrast(101%);
      `}
  }
`

const MainDescText = styled.div`
  color: #475467;
  font-size: 16px;
  margin-bottom: 25px;
`

const HalfInfo = styled.div`
  border-radius: 10px;
  background: #fff;
  transition: 0.25s;
  margin-bottom: ${props => props.marginBottom};
  font-family: 'Inter', sans-serif;
  border: 2px solid #f2f5ff;

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
  border-radius: 12px;
  margin-bottom: 25px;
  border: 2px solid #f2f5ff;
`

const RestInternal = styled.div`
  display: flex;
  // justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const MainTagPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 40%;
  border-radius: 8px;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const TabRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const NetDetail = styled.div`
  display: flex;
  margin: auto 0px;
  @media screen and (max-width: 992px) {
    display: none;
  }
`

const NetDetailItem = styled.div`
  display: flex;
  margin-left: 50px;
`

const NetDetailTitle = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
`

const NetDetailContent = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  padding-left: 5px;
`

const NetDetailImg = styled.div`
  width: 21px;
  height: 21px;
  margin: 2px 0px 0px 5px;

  img {
    width: 100%;
  }
`

const FirstPartSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  @media screen and (max-width: 992px) {
    // display: flex;
    // flex-direction: column-reverse;
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
  BackText,
  RestContent,
  NewLabel,
  FlexTopDiv,
  Inner,
  TopInner,
  BigDiv,
  LogoImg,
  InfoIcon,
  Monospace,
  MyBalance,
  ThemeMode,
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
  MainTagPanel,
  FirstPartSection,
  APRValueShow,
  BorderBottomDiv,
  TabRow,
  NetDetail,
  NetDetailItem,
  BoxCover,
  ValueBox,
  BoxTitle,
  BoxValue,
  NetDetailTitle,
  NetDetailContent,
  NetDetailImg,
  InfoIconBlack,
}
