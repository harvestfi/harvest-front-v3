import styled from 'styled-components'

const TransactionDetails = styled.div`
  width: 100%;
  border-radius: 15px;
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    height: ${props => props.hasData};
  }
`

const TableContent = styled.div`
  @media screen and (max-width: 992px) {
    // overflow-x: scroll;
    border-radius: 15px 15px 0px 0px;
    border: 1px solid ${props => props.borderColor};
    ${props =>
      props.count === 0
        ? `
        border-radius: unset;
        border: none;
    `
        : ``}
  }
`

const HistoryPagination = styled.div`
  margin-top: 25px;

  ul.paginate-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    list-style: none;
    padding: 12px 24px 16px 24px;
    margin-bottom: 0px;
    gap: 5px;
  }

  li.previous,
  li.next {
    border-radius: 8px;
    border: 1px solid ${props => props.borderColor};
    background: ${props => props.bgColor};
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    display: flex;
    padding: 8px 14px;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  li.paginate-item {
    margin: auto 0px;
  }

  li.break {
    margin: auto 0px;
  }

  li.previous a,
  li.next a {
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: ${props => props.fontColor2};
  }

  li.previous a svg,
  li.next a svg {
    margin-top: -2px;
  }

  a.paginate-item-link {
    text-decoration: none;
    color: ${props => props.fontColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    display: flex;
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  li.disabled a {
    color: #b2b2b2;
  }

  li.selected a {
    color: #1d2939;
    background: #f9fafb;
  }
`

const Header = styled.div`
  width: 100%;
  padding: 12px 24px;
  background: ${props => props.backColor};
  display: flex;
  border: 1px solid ${props => props.borderColor};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  @media screen and (max-width: 992px) {
    padding: 10px;
  }
`

const Column = styled.div`
  width: ${props => props.width};
  color: ${props => props.color};
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  justify-content: start;
  ${props => (props.display ? `display: ${props.display}` : '')};
  ${props => (props.justifyContent ? `justify-content: ${props.justifyContent}` : '')};
`

const Col = styled.div`
  display: flex;
  cursor: pointer;
  width: fit-content;
  @media screen and (max-width: 1200px) {
    flex-flow: column;
  }

  img.sortIcon {
    width: 8.8px;
    height: 10.5px;
    margin: auto 0px auto 5px;
    @media screen and (max-width: 1200px) {
      margin: auto;
    }
  }

  img.info {
    margin-right: 3px;
    margin-left: 0px;
  }

  #tooltip-balance {
    max-width: 300px;
  }
`

const EmptyPanel = styled.div`
  padding-top: 12%;
  padding-bottom: 12%;
  border-radius: 5px;
  border-right: 1px solid ${props => props.borderColor};
  border-bottom: 1px solid ${props => props.borderColor};
  border-left: 1px solid ${props => props.borderColor};
  @media screen and (max-width: 992px) {
    padding: 0px;
    border: none;
    min-height: 100px;
  }
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
  
  ${props =>
    props.gap
      ? `
    gap: ${props.gap};
  `
      : 'gap: 23px;'}

  display: flex;
  justify-content: center;
  text-align: center;

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: center;
    flex-flow: column;
    font-size: 10px;
    line-height: 18px;
    padding-top: 35px;
  }
`

const ConnectButtonStyle = styled.button`
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  margin: 25px auto;
  width: 250px;
  background: ${props => props.backColor};
  border-radius: 8px;
  border: 1px solid ${props => props.inputBorderColor};
  color: ${props => props.fontColor2};
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  cursor: pointer;

  ${props =>
    props.connected
      ? `
      padding: 7px 45px 7px 11px;
      filter: drop-shadow(0px 4px 52px rgba(0, 0, 0, 0.25));

      &:hover {
        background: #E6F8EB;
      }
    `
      : `
      padding: 15px 0px 15px 0px;
    `}

  &:hover {
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05),
      0px 0px 0px 4px ${props => props.hoverColorButton};
    img.connect-wallet {
      filter: brightness(0) saturate(100%) invert(69%) sepia(55%) saturate(4720%) hue-rotate(110deg)
        brightness(91%) contrast(86%);
    }
  }

  img.connect-wallet {
    margin: auto 25px auto 0px;
  }

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: center;
    align-items: center;

    ${props =>
      props.connected
        ? `
      background: none;
      color: ${props.fontcolor};
      font-size: 11px;
      padding: 2px 16px 2px 7px;
      border: 1px solid ${props.bordercolor};
      `
        : `
      padding: 10px 11px;
      font-size: 13px;
      `}

    img.connect-wallet {
      margin-right: 15px;
      width: 14px;
      height: 14px;
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
    props.mode === 'balance'
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
        width: 30px;
        height: 17px;
      }

      .switch-thumb {
        width: 13px;
        height: 13px;
        top: 2px;
      }
    }

    ${props =>
      props.mode === 'balance'
        ? `
        #theme-switch {
          .switch-thumb {
            left: 15px;
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

export {
  TransactionDetails,
  HistoryPagination,
  TableContent,
  Header,
  Column,
  Col,
  EmptyPanel,
  EmptyInfo,
  ConnectButtonStyle,
  ThemeMode,
}
