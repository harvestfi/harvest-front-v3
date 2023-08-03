import styled from 'styled-components'

const BaseWido = styled.div`
  ${props =>
    props.show
      ? `
  `
      : 'display: none;'}
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

const SelectToken = styled.div`
  border: 1px solid #d8d5dd;
  transition: 0.25s;

  border-radius: 8px;
  padding: 15px;
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

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    margin: 0;
  }
`

const TokenSelect = styled.button`
  background: white;
  border: 1px solid #eaecf0;
  transition: 0.25s;

  border-radius: 8px;
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

const DepoTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin: 10px 0;
  color: ${props => props.fontColor};
`

export {
  BaseWido,
  NewLabel,
  SelectToken,
  TokenAmount,
  TokenInfo,
  TokenSelect,
  BalanceInfo,
  PoweredByWido,
  DepoTitle,
}
