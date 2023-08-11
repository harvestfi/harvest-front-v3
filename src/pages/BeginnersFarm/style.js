import styled from 'styled-components'
import ETH from '../../assets/images/logos/beginnershome/eth.svg'
import DAI from '../../assets/images/logos/beginnershome/dai.svg'
import USDT from '../../assets/images/logos/beginnershome/usdt.svg'
import USDC from '../../assets/images/logos/beginnershome/usdc.svg'
import Plus from '../../assets/images/logos/beginners/plus.svg'
import Minus from '../../assets/images/logos/beginners/minus.svg'

const DetailView = styled.div`
  width: 100%;
  margin-left: 280px;
  background: ${props => props.pageBackColor};
  color: ${props => props.fontColor};
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    margin-left: 0;
  }
`

const Inner = styled.div`
  padding: 80px 72px 200px 76px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1480px) {
    padding: 70px 30px 40px;
  }

  @media screen and (max-width: 992px) {
    padding: 20px 10px 10px;
    height: 100%;
  }
`

const TopPart = styled.div`
  padding: 70px 100px 170px 50px;
  display: flex;
  justify-content: space-between;

  ${props =>
    props.num === 0
      ? `
    background: url(${DAI});
  `
      : props.num === 1
      ? `
    background: url(${ETH});
  `
      : props.num === 2
      ? `
    background: url(${USDT});
  `
      : `
    background: url(${USDC});
  `}
  background-size: cover;
  background-repeat: no-repeat;

  position: relative;

  img.bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    padding: 41px 61px 90px 30px;
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
  color: white;
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

    .back-btn {
      display: none;
    }
  }
`

const HalfContent = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin-right: 50px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  height: ${props =>
    props.partHeight
      ? `
    ${props.partHeight}px`
      : `
      fit-content
    `};

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-right: 0px;
    margin-bottom: 18px;
  }
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
  border: 1px solid #fff;
  background: rgba(236, 236, 236, 0.35);
  &:hover {
    background: rgba(236, 236, 236, 0.7);
  }

  margin-bottom: 47px;
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
`

const RestContent = styled.div`
  width: 40%;

  @media screen and (min-width: 1921px) {
    width: 500px;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const BigDiv = styled(FlexDiv)`
  width: 70%;

  @media screen and (min-width: 1921px) {
    width: unset;
  }

  @media screen and (max-width: 1368px) {
    width: 80%;
  }

  @media screen and (max-width: 1256px) {
    width: 85%;
  }

  @media screen and (max-width: 1112px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const LogoImg = styled.img`
  margin-right: -5px;
  width: 257px;

  @media screen and (max-width: 1368px) {
    width: 200px;
  }

  @media screen and (max-width: 1136px) {
    width: 150px;
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
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
`

const GuideSection = styled.div`
  display: flex;
  margin-bottom: 10px;

  @media screen and (max-width: 992px) {
    margin-top: 19px;
  }
`

const GuidePart = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  border-radius: 18px;
  padding: 3px 11px 3px 9px;
  background: #f2f4f7;
  margin-right: 10px;
  color: #344054;
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;

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

const APRShow = styled.div`
  background: #f2f4f7;
  padding: 2px 10px 2px 8px;
  border-radius: 16px;
  display: flex;

  img {
    margin-right: 6px;
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
  `
      : `
    display: none;
  `}
`

const CreditCardBox = styled.div`
  border-radius: 10px;
  border: 1px solid var(--gray-200, #eaecf0);
  background: var(--base-white, #fff);
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  padding: 12px;

  @media screen and (max-width: 992px) {
    padding: 9px;

    img {
      width: 18px;
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
      background: #000;
      border: 1px solid ${props => props.borderColor};
      height: 24px;
      width: 50px;
      border-radius: 30px;
      transition: all 0.2s ease 0s;
    }
    .switch-thumb {
      background-size: cover;
      background-repeat: no-repeat;
      background-color: white;
      height: 20px;
      left: 2px;
      position: absolute;
      top: 2px;
      width: 20px;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #ff9400;
    }
  }

  ${props =>
    props.mode === 'deposit'
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
          background-image: url(${Plus});
        }
      }
    `
      : `
      #theme-switch {
        .switch-thumb {
          background-image: url(${Minus});
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

export {
  DetailView,
  TopPart,
  TopDesc,
  Button,
  HalfContent,
  FlexDiv,
  TotalValueFarm,
  BackBtnRect,
  BackArrow,
  RestContent,
  NewLabel,
  FlexTopDiv,
  Inner,
  BigDiv,
  LogoImg,
  InfoIcon,
  Monospace,
  MyBalance,
  GuideSection,
  GuidePart,
  APRShow,
  DepositSection,
  WithdrawSection,
  CreditCardBox,
  ThemeMode,
}
