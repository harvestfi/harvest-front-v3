import styled from 'styled-components'

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
      background: #7F9BFF;
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
    props.mode === 'subscribe'
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
          background: #5DCF46;
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
      props.mode === 'subscribe'
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

const PanelHeader = styled.div`
  background: url(${props => props.background});
  display: flex;
  flex-direction: row;
  height: 145px;
  justify-content: space-between;
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  overflow: hidden;
`

const PanelBalance = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 0.7px solid ${props => props.borderColor};
`

const PanelSubscribe = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 25px;
`

const BasePanelBox = styled.div`
  width: 450px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  background: ${props => props.backColor};
  key: ${props => props.key};
  border: 1px solid ${props => props.borderColor};
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

const TokenInfo = styled.div`
  display: flex;
  flex-direction: row;
  margin: 28px 22px;
  justify-content: space-between;
`
const ApyInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 20px 30px;
  justify-content: center;
`

const PilotInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  
  svg.pilot-info {
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    margin-top: 15px;
    margin-right: 15px;
  }
`

const NewLabel = styled.div`
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
    props.weight
      ? `
    font-weight: ${props.weight};
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
  ${props =>
    props.position
      ? `
    position: ${props.position};
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
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
  `
      : ''}

  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
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
    props.flexFlow
      ? `
    flex-flow: ${props.flexFlow};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.items
      ? `
    align-items: ${props.items};
  `
      : ''}
  
  ${props =>
    props.border
      ? `
    border: ${props.border};
  `
      : ''}

  ${props =>
    props.borderRadius
      ? `
    border-radius: ${props.borderRadius};
  `
      : ''}

  svg.question {
    font-size: 16px;
    color: ${props => props.color};
    cursor: pointer;
    margin: auto 0px auto 5px;
  }

  #min-received {
    max-width: 300px;
  }

  img.info-icon {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }

  span.token-symbol {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
  }
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

  ${props =>
    props.flexDirection
      ? `
    flex-direction: ${props.flexDirection};
  `
      : ''}

`

const TokenInput = styled.div`
  position: relative;
  width: 195px;
  input[type='text'] {
    -webkit-appearance: none;
    -moz-appearance: textfield;
  }

  input[type='text']::-webkit-outer-spin-button,
  input[type='text']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const TokenAmount = styled.input`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: ${props => props.bgColor};
  border: 1px solid #D7DFFA8C;
  outline: 0;
  padding: 7px 14px 7px 14px;
  border-radius: 8px;
  color: ${props => props.fontColor2};
  transition: 0.25s;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    margin: 0;
  }
`

const TokenUSDAmount = styled.div`
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 12px;
  color: ${props => props.fontColor3};
  font-weight: 400;
`

const TokenType = styled.div`
  position: relative;
  border: 1px solid #D7DFFA8C;
  border-radius: 9px;
  width: 195px;
  img.token-symbol {
    position: absolute;
    left: 12px;
    bottom: 7px;
  }
`

const TokenName = styled.div`
  position: absolute;
  left: 50px;
  bottom: 10px;
  font-size: 12px;
  color: ${props => props.fontColor3};
  font-weight: 400;
`

export {
  ThemeMode,
  PanelHeader,
  BasePanelBox,
  TokenInfo,
  ApyInfo,
  NewLabel,
  PilotInfo,
  PanelBalance,
  FlexDiv,
  PanelSubscribe,
  TokenInput,
  TokenAmount,
  TokenUSDAmount,
  TokenType,
  TokenName,
}
