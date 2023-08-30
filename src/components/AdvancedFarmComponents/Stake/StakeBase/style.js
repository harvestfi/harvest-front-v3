import styled from 'styled-components'
import Plus from '../../../../assets/images/logos/beginners/plus.svg'
import Minus from '../../../../assets/images/logos/beginners/minus.svg'

const BaseSection = styled.div`
  padding: 16px 24px 24px;
  ${props =>
    props.show
      ? `
  `
      : 'display: none;'}

  @media screen and (max-width: 992px) {
    padding: 12px 12px 18px;
  }
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
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
    props.widthDiv
      ? `
    width: ${props.widthDiv};
  `
      : ''}

  img.icon {
    margin-right: 10px;
  }

  img.info {
    margin-left: 10px;
  }

  img.info-icon {
    margin-right: 10px;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }

    img.info-icon {
      width: 16px;
    }
  }
`

const TokenInfo = styled.div`
  display: flex;
  justify-content: space-between;
`

const TokenAmount = styled.input`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: #fff;
  border: 1px solid #d0d5dd;
  outline: 0;
  padding: 10px 14px;
  border-radius: 8px;
  color: #344054;
  transition: 0.25s;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    margin: 0;
  }

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 18px;
    padding: 7px 10px;
  }
`

const TokenSelect = styled.button`
  background: white;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  transition: 0.25s;

  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  color: #344054;

  display: flex;
  align-items: center;

  &:hover {
    background: rgba(203, 203, 203, 0.7);
  }

  img.logo {
    margin-right: 8px;
  }

  span {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 4px;
  }

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 18px;
    padding: 7px 10px;

    img.logo {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }

    img.dropdown-icon {
      width: 15px;
      height: 16px;
    }
  }
`

const BalanceInfo = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #475467;
  margin-top: 5px;
  cursor: pointer;

  span {
    margin-left: 6px;
    transition: 0.25s;
  }

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 15px;
    margin-top: 3px;
  }
`

const DepoTitle = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  margin: 4px 0 20px;
  color: #475467;

  @media screen and (max-width: 992px) {
    font-size: 10px;
    line-height: 15px;
    margin: 0 0 15px;
  }
`

const AmountSection = styled.div`
  width: 100%;
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

const InsufficientSection = styled.div`
  border-radius: 12px;
  border: 1px solid #d0d5dd;
  background: #fcfcfd;
  padding: 16px;
  ${props =>
    props.isShow === 'true'
      ? `
    display: flex;
    justify-content: space-between;
  `
      : `
    display: none;
  `}
  margin-top: 20px;

  @media screen and (max-width: 992px) {
    padding: 10px;
    margin-top: 14px;
  }
`

const CloseBtn = styled.img`
  cursor: pointer;

  @media screen and (max-width: 992px) {
    width: 17px;
    height: 16px;
  }
`

const FTokenWrong = styled.div`
  border-radius: 12px;
  border: 1px solid #fec84b;
  background: #fffcf5;
  padding: 16px;
  display: ${props => (props.isShow === 'true' ? `flex` : 'none')};
  gap: 12px 0;
  margin-top: 15px;
  justify-content: space-between;
`

const ImgBtn = styled.img`
  cursor: pointer;
  transition: 0.25s;
  margin-right: 8px;

  @media screen and (max-width: 992px) {
    width: 17px;
    height: 16px;
  }
`

const AmountInputSection = styled.div`
  position: relative;

  button.max-btn {
    position: absolute;
    right: 14px;
    top: 12px;
    border: none;
    background: none;
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    color: #000;
  }

  @media screen and (max-width: 992px) {
    button.max-btn {
      right: 5px;
      top: 9px;
      font-size: 10px;
      line-height: 15px;
    }
  }
`

export {
  BaseSection,
  NewLabel,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  BalanceInfo,
  DepoTitle,
  AmountSection,
  ThemeMode,
  InsufficientSection,
  CloseBtn,
  FTokenWrong,
  ImgBtn,
  AmountInputSection,
}
