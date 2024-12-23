import styled from 'styled-components'
import BgImage from '../../assets/images/logos/beginners/bg-image.jpg'

const DetailView = styled.div`
  width: 100%;
  margin-left: 280px;
  background: ${props => props.bgColor};
  color: ${props => props.fontColor};
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    margin-left: 0;
    padding-bottom: 100px;
  }
`

const Inner = styled.div`
  background: ${props => props.backColor};
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
  }
`

const TopInner = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  padding: 50px 72px 0px 76px;
  display: flex;
  justify-content: center;
  background-image: url(${BgImage});
  background-repeat: no-repeat;
  background-size: cover;

  @media screen and (max-width: 1480px) {
    padding: 25px 30px 0px;
  }

  @media screen and (max-width: 1024px) {
    padding: 20px 20px 0px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 40px 25px 0px 25px;
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

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: end;
    margin-bottom: 30px;
  }
`

const LinksContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  ${props =>
    props.showBadge === 'flex'
      ? `
      justify-content: space-between;
  `
      : 'justify-content: end;'}
  align-items: center;
  margin: 0 0px auto;
  transition: 0.25s;

  div.logo {
    ${props =>
      props.showBadge
        ? `
      display: ${props.showBadge};
    `
        : ''}
    align-items: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 24px;

    &:after {
      margin-left: 15px;
      display: block;
      content: 'Harvest';
      color: #fff;
    }
  }
`

const Logo = styled.div`
  cursor: pointer;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: end;
  }
`

const SwitchTabTag = styled.div`
  width: 50%;
  transition: 0.25s;
  color: ${props => props.color};
  background: ${props => props.backColor};
  box-shadow: ${props => props.boxShadow};
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  cursor: pointer;

  svg {
    font-size: 16px;
    margin: auto 0px;
  }

  p {
    margin-bottom: 0px;
    padding-left: 5px;
    font-size: 14px;
    line-height: 20px;
  }
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};

  ${props =>
    props.backColor
      ? `
    background: ${props.backColor};
  `
      : ''}
  ${props =>
    props.border
      ? `
    border: ${props.border};
  `
      : ''}
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
  ${props =>
    props.transition
      ? `
    transition: ${props.transition};
    `
      : ``}

  svg.question {
    font-size: 16px;
    color: ${props => props.color};
    cursor: pointer;
    margin: auto 0px auto 5px;
  }

  span.symbol {
    position: absolute;
    color: ${props => props.fontColor2};
    font-size: 8px;
    right: 0;
    top: 13px;
  }

  span.total-days {
    font-weight: 400;
  }

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
  #tooltip-underlying-balance,
  #tooltip-lifetime-earning,
  #tooltip-latest-earning,
  #tooltip-total-balance,
  #tooltip-yield-estimate {
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
    props.mode === 'latest'
      ? `
      #theme-switch {
        .switch-check {
          opacity: 1;
        }
        .switch-x {
          opacity: 0;
        }
        .switch-thumb {
          left: 17px;
        }
        .switch-track {
          background: #6B8AFF;
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
      props.mode === 'latest'
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
  }
`

const SwitchMode = styled.div`
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
    props.mode === 'apy'
      ? `
      #theme-switch {
        .switch-check {
          opacity: 1;
        }
        .switch-x {
          opacity: 0;
        }
        .switch-thumb {
          left: 17px;
        }
        .switch-track {
          background: #6B8AFF;
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
      props.mode === 'apy'
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
  }
`

const TopDesc = styled(NewLabel)`
  color: #fff;
  margin: auto 0px auto 35px;
  @media screen and (max-width: 992px) {
    margin: 5px auto;
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

  ${props =>
    props.borderBottom
      ? `
    border-bottom: ${props.borderBottom};
  `
      : ''}

  @media screen and (max-width: 992px) {
    &.farm-symbol {
      flex-flow: column;
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
const WelcomeBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.bgColorTooltip};
  box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08);
  padding: 16px;
  margin-bottom: 25px;

  @media screen and (max-width: 992px) {
    flex-flow: column;
  }
`

const WelcomeTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`

const FarmerImage = styled.img`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  border: 1.719px solid #f2f5ff;
`

const WelcomeContent = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${props => props.fontColor};
`

const WelcomeTitle = styled.div`
  font-weight: 600;
  color: ${props => props.fontColor1};
  padding-bottom: 5px;
  @media screen and (max-width: 992px) {
    width: 100%;
    margin: auto;
    padding-bottom: 0px;
  }
`

const WelcomeText = styled.div`
  a {
    font-weight: 700;
    color: #ff9400;
  }
  a.badge-body {
    text-decoration: none;
  }
`

const WelcomeClose = styled.div`
  font-size: 20px;
  text-align: start;
  svg {
    cursor: pointer;
  }
  @media screen and (max-width: 992px) {
    margin: auto;
  }
`

const HeaderBadge = styled.div`
  width: fit-content;
  border-radius: 12px;
  padding: 3px 3px 3px 10px;
  background: #1568b3;
  font-size: 10.5px;
  font-weight: 500;
  line-height: 17px;
  display: flex;
  gap: 9px;
  margin-top: 12px;

  &:hover {
    transform: scale(1.01);
    margin-right: 2px;
  }

  @media screen and (max-width: 400px) {
    font-size: 9px;
  }

  div.badge-text {
    color: #fff;
    margin: auto;
  }

  div.badge-btn {
    background: #fff;
    padding: 0px 7px;
    gap: 3px;
    display: flex;
    border-radius: 11px;
    color: #1568b3;

    svg {
      color: #6b6b6b;
      margin: auto;
    }
  }
`

const FlexTopDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: center;

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
  background: ${props => props.backColor};
  border: 2px solid ${props => props.borderColor};
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
`

const TotalValueFarm = styled.div`
  font-weight: 600;
  font-size: ${props => props.size} px;
  line-height: 35px;
  color: #000000;
  margin-right: 15px;
`

const RestContent = styled.div`
  width: 39%;
  height: ${props => props.height};

  @media screen and (min-width: 1921px) {
    width: 500px;
  }

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
    width: 37px;
    margin-right: 0px;
  }

  ${props =>
    props.zIndex
      ? `
    z-index: ${props.zIndex};
  `
      : ``}
`

const Monospace = styled.span`
  font-family: 'Inter', sans-serif;
  border-bottom: ${props => props.borderBottom || 'unset'};
`

const MyBalance = styled.div`
  background: ${props => props.backColor};
  border-radius: 12px;
  border: 2px solid ${props => props.borderColor};
  width: 100%;

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

const EarningsBadge = styled.div`
  color: #027a48;
  font-size: 8px;
  font-weight: 500;
  line-height: 12px;
  padding: 1.364px 5.455px 1.364px 4.091px;
  margin: auto 0px auto 5px;
  border-radius: 10.909px;
  background: #ecfdf3;
`

const GuideSection = styled.div`
  display: flex;
  margin-bottom: 49px;
  margin-top: 6px;

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
    font-size: 12px;
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
    border: 2px solid ${props => props.borderColor};
    margin-bottom: 20px;
  }
`

const ManageBoxWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 25px;

  @media screen and (max-width: 992px) {
    flex-flow: column;
    gap: 0px;
  }
`

const ValueBox = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  border-radius: 12px;
  border: 2px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  padding: 24px;
  height: 120px;
  ${props => (props.width ? `width: ${props.width};` : '')}

  @media screen and (max-width: 1320px) {
    padding: 10px;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 70px;
    padding: 8px 13px;
    border-radius: 0px;
    border: unset;

    &.balance-box {
      border-right: 2px solid ${props => props.borderColor};
      border-radius: 14px 0px 0px 14px;
    }
    &.daily-yield-box {
      border-left: 2px solid ${props => props.borderColor};
      border-radius: 0px 14px 14px 0px;
    }
    &.daily-apy-box {
      display: none;
    }
  }
`

const BoxTitle = styled.div`
  color: ${props => props.fontColor3};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  svg.question {
    font-size: 16px;
    color: ${props => props.fontColor3};
    cursor: pointer;
    margin: auto 0px auto 5px;
  }

  #tooltip-mybalance,
  #tooltip-monthly-yield,
  #tooltip-daily-yield {
    max-width: 300px;
  }

  @media screen and (max-width: 1170px) {
    font-size: 12px;
  }

  @media screen and (max-width: 992px) {
    font-size: 12px;
    svg.question {
      display: none;
    }
  }
`

const BoxValue = styled.div`
  color: ${props => props.fontColor1};
  font-weight: 600;
  letter-spacing: -0.6px;
  font-size: 22px;
  line-height: 32px;

  @media screen and (max-width: 992px) {
    font-size: 12px;
  }
`

const MobileChain = styled.div`
  display: flex;

  @media screen and (max-width: 992px) {
    margin: auto 0px;
  }
`

const ChainBack = styled.div`
  border-radius: 2px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-self: center;
  margin-left: 15px;

  img {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 992px) {
    margin-left: 11px;
  }
`

const MainTag = styled.div`
  display: flex;
  justify-content: center;
  width: 33%;
  padding: 12px 15px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  color: ${props => props.fontColor4};

  &:nth-child(1) {
    width: 34%;
  }

  ${props =>
    props.active === 'true'
      ? `
      background: ${props.bgColor};
      border-radius: 6px 6px 0px 0px;
    `
      : `
      color: #fff;
      background: transparent;
    `}

  @media screen and (max-width: 992px) {
    width: ${props => (props.active === 'true' ? '50% !important' : '25% !important')};
  }

  p {
    margin-bottom: 0px;
    padding-left: 8px;

    @media screen and (max-width: 992px) {
      display: ${props => (props.active === 'true' ? 'block' : 'none')};
    }
  }

  img {
    ${props =>
      props.mode === 'dark'
        ? 'filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(352deg) brightness(101%) contrast(104%);'
        : props.active === 'true'
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
  border-radius: 12px;
  background: ${props => props.backColor};
  transition: 0.25s;
  margin-bottom: ${props => props.marginBottom};
  font-family: 'Inter', sans-serif;
  border: 2px solid ${props => props.borderColor};

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
  background: ${props => props.bgColor};
  border-radius: 8px;
  border: 1px solid ${props => props.borderColor};
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
    background: ${props => props.hoverColor};
    .address {
      font-weight: bold;
    }
  }
`

const DescInfo = styled.div`
  color: ${props => props.fontColor3};
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  padding: 10px 15px;
  display: flex;
  align-items: center;

  #tooltip-begin-desc {
    width: 300px;
  }

  p {
    a {
      cursor: pointer;
      color: ${props => props.fontColor6};
    }
  }

  @media screen and (max-width: 992px) {
    font-size: 12px;
  }
`

const LastHarvestInfo = styled.div`
  background: ${props => props.backColor};
  border-radius: 12px;
  margin-bottom: 25px;
  border: 2px solid ${props => props.borderColor};

  @media screen and (max-width: 992px) {
    margin-bottom: 20px;
  }
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
  width: 50%;
  border-radius: 8px;

  @media screen and (max-width: 1200px) {
    width: 55%;
  }

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
  @media screen and (max-width: 992px) {
    margin-left: 0px;
  }
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
  RestContent,
  NewLabel,
  FlexTopDiv,
  Inner,
  TopInner,
  BigDiv,
  LogoImg,
  Monospace,
  MyBalance,
  EarningsBadge,
  ThemeMode,
  SwitchMode,
  GuideSection,
  GuidePart,
  DepositSection,
  WithdrawSection,
  MainSection,
  ChainBack,
  MainTag,
  MainDescText,
  InternalSection,
  WelcomeBox,
  WelcomeTop,
  FarmerImage,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
  WelcomeClose,
  HeaderBadge,
  HalfInfo,
  InfoLabel,
  MobileChain,
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
  ManageBoxWrapper,
  ValueBox,
  BoxTitle,
  BoxValue,
  NetDetailTitle,
  NetDetailContent,
  NetDetailImg,
  LinksContainer,
  Logo,
  SwitchTabTag,
}
