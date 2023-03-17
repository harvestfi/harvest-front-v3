import styled from 'styled-components'
import { AiOutlineSearch } from 'react-icons/ai'

const Container = styled.div`
  display: flex;
  justify-content: ${props => props.justify};
  align-items: center;
  position: relative;
  border-radius: 10px;
  transition: 0.25s;
  background: ${props => props.backColor};
  input {
    background: ${props => props.backColor};
  }
  border: 1px solid ${props => props.borderColor};

  // width: 300px;

  input {
    width: 100%;
    border-width: 0px;
    box-sizing: border-box;
    border-radius: 10px;
    color: ${props => props.fontColor};
    transition: 0.25s;
    // height: 41px;
    margin: 0;
    padding: 10px 30px 9px 0px;
    outline: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;

    &:disabled {
      background-color: #fffce6;
      opacity: 0.9;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #a9aeb3;
    }

    @media screen and (max-width: 992px) {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #888e8f;
    }
  }

  @media screen and (max-width: 1400px) {
    width: auto;
  }

  @media screen and (max-width: 992px) {
    width: 100%;

    input {
      height: 45px;
    }
  }
`

const SearchIcon = styled(AiOutlineSearch)`
  width: 25px;
  font-size: 35px;
  color: #888e8f;
  margin-right: 5px;
  margin-left: 12px;

  @media screen and (max-width: 992px) {
    width: 12px;
    margin-right: 10px;
    margin-left: 13px;
  }
`

const Icon = styled.img`
  position: absolute;
  z-index: 1;

  filter: ${props => props.iconColor};
  transition: 0.25s;
  ${props =>
    props.left
      ? `
    left: ${props.left}px;
  `
      : ''}

  ${props =>
    props.right
      ? `
    right: ${props.right}px;
  `
      : ''}

  ${props =>
    props.cursor
      ? `
    cursor: ${props.cursor};
  `
      : ''}

  ${props =>
    props.opacity
      ? `
    opacity: ${props.opacity};
  `
      : ''}

  @media screen and (max-width: 992px) {
    display: none;
  }
`

export { Container, Icon, SearchIcon }
