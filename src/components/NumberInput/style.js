import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-grow: ${props => props.grow};
  justify-content: ${props => props.justify};
  align-items: baseline;
  position: relative;
  width: ${props => props.width || 'auto'};
  flex-direction: column;
  align-items: baseline;

  input {
    width: inherit;
    border-radius: 10px;
    // border: 2px solid #dadfe6;
    border: 0;
    height: 43px;
    margin: 0;
    padding: 0px 0px 0px 10px;
    outline: 0;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    // background-color: #ffffff;
    padding-right: ${props => (props.hasButton ? '65px' : 'unset')};
    box-sizing: border-box;
    color: ${props => (props.invalidAmount ? 'red' : 'unset')};

    &:disabled {
      // background-color: #f1f1f1;
      opacity: 0.9;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #a9aeb3;
    }
  }

  button {
    z-index: 1;
    border: 0;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: white;
    border-radius: 6px;
    background: #FFD984;
    padding: 0 5px;

    &:hover {
      border: 0;
    }
  }
`

const LabelContainer = styled.div`
  display: flex;
  // justify-content: space-between;
  width: inherit;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`

const Label = styled.span`
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
  // color: black;
  margin-right: 5px;
`

const InputContainer = styled.div`
  position: relative;
  width: inherit;
  margin-top: 5px;
`

const CoinInfo = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  background: ${props=>props.backColor};
  border: 1px solid ${props=>props.borderColor};
  // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  display: flex;
  padding: 8px;
  cursor: pointer;
  align-items: center;

  img {
    margin-right: 10px;
  }
`

export { Container, LabelContainer, Label, InputContainer, CoinInfo }
