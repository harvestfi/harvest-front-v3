import styled from 'styled-components'

const BaseWido = styled.div`
  ${props =>
    props.show
      ? `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `
      : 'display: none;'}
`

const SelectToken = styled.div`
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  box-shadow: ${props => props.shadow};
  transition: 0.25s;

  border-radius: 12px;
  padding: 30px 12px 12px 12px;
`

const TokenInfo = styled.div`
  display: flex;
  justify-content: space-between;
`

const TokenAmount = styled.input`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: ${props => props.backColor};
  border: none;
  outline: 0;
  color: ${props => props.fontColor};
  transition: 0.25s;
  padding: 0 10px 10px 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:hover {
    color: #ffaa34;
  }
`

const TokenSelect = styled.button`
  background: #f4f4f4;
  border: 1px solid ${props => props.borderColor};
  transition: 0.25s;

  border-radius: 15px;
  padding: 8px 12px;
  height: fit-content;
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
`

const BalanceInfo = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  margin-top: 13px;
  margin-bottom: 13px;
  cursor: pointer;
  span {
    margin-left: 6px;
    color: ${props => props.fontColor};
    transition: 0.25s;
  }
`

const PoweredByWido = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: end;
  font-weight: 700;
  font-size: 10px;
  line-height: 13px;

  div {
    color: #1abc9c;
  }

  img {
    margin-left: 5px;
  }

  span {
    margin-left: 5px;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
  }
`

const TokenName = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  background: #ecfdf3;
  color: #027a48;
  border-radius: 16px;
  padding: 5px 10px;
  width: fit-content;

  img {
    margin-right: 6px;
  }
`

const StakeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
`

const TokenUSD = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: #667085;

  &:hover {
    color: #ffaa34;
  }
`

const DepoTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 3px;
  color: ${props => props.fontColor};
`

const Line = styled.div`
  height: 1px;
  background: #eaecf0;
  margin-bottom: 10px;
  margin-top: 10px;
`

const HelpImg = styled.img`
  margin-left: 6px;
`

const ThemeMode = styled.div`
  display: flex;
  margin-right: 8px;

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
      background: ${props =>
        props.mode === 'true' ? props.activeBackColor : props.inactiveBackColor};
      border: 1px solid ${props => props.borderColor};
      height: 24px;
      width: 50px;
      border-radius: 30px;
      transition: all 0.2s ease 0s;
    }
    .switch-thumb {
      background-size: cover;
      background: #ffffff;
      height: 20px;
      left: 1px;
      position: absolute;
      top: 2px;
      width: 20px;
      // border-image: initial;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #ff9400;
    }
  }

  ${props =>
    props.mode === 'true'
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

const SwitchMode = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.fontColor};

  margin-bottom: 13px;
`

const FarmInfo = styled.div`
  display: flex;
  padding-right: 20px;

  span {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 8px;
  }
`

export {
  BaseWido,
  SelectToken,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  BalanceInfo,
  PoweredByWido,
  TokenName,
  StakeInfo,
  TokenUSD,
  DepoTitle,
  Line,
  HelpImg,
  ThemeMode,
  SwitchMode,
  FarmInfo,
}
