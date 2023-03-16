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

const NewLabel = styled.div`
  ${props =>
    props.left
      ? `
    left: ${props.left};
  `
      : ''}
  ${props =>
    props.zIndex
      ? `
    z-index: ${props.zIndex};
  `
      : ''}
  ${props =>
    props.top
      ? `
    top: ${props.top};
  `
      : ''}
  ${props =>
    props.right
      ? `
    right: ${props.right};
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
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.background
      ? `
    background: ${props.background};
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
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 30px 15px 12px 15px;
  margin-bottom: 30px;
  margin-top: 10px;
`

const TokenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 49%;
`

const TokenSelect = styled.button`
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 8px 15px;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  text-align: right;
  color: #1f2937;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;

  &:hover {
    background: #e1e3fd99;
  }

  img {
    margin-left: 8px;
    &.logo {
      margin-right: 8px;
    }
  }

  div.token {
    max-width: 165px;
    text-align: left;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const BalanceInfo = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #1f2937;

  span {
    margin-left: 6px;
    font-weight: 700;
    font-size: 16px;
    line-height: 21px;
    color: rgba(31, 41, 55, 0.7);
  }
`

const PoweredByWido = styled.div`
  margin-top: 10px;
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
  // text-decoration-line: underline;
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
  margin-top: 15px;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
`

const StakeAction = styled.div`
  margin-top: 34px;
  display: flex;
  justify-content: space-between;
`

const BalanceInput = styled.input`
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  width: 100%;
  height: 50px;
  padding: 10px 80px 10px 20px;
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const Max = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  border: none;
  background: #1f2937;
  box-shadow: 0px 0.173536px 0.347072px rgba(16, 24, 40, 0.05);
  border-radius: 3px;
  padding: 5px 10px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
`

const Part = styled.div`
  position: relative;

  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
`

const Balance = styled.div`
  background: ${props => props.backColor};
  transition: 0.25s;
  border-radius: 12px;
  width: ${props => props.width};

  position: relative;
`

const TokenAmount = styled.input`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  color: ${props => props.fontColor};
  transition: 0.25s;
  outline: 0;

  padding: 18px 52px 18px 12px;
  border-radius: 8px;

  margin-bottom: 0.25rem;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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
  TokenName,
  StakeInfo,
  Part,
  Max,
  BalanceInput,
  StakeAction,
  Balance,
}
