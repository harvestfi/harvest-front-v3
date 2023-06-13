import styled from 'styled-components'
import { AiOutlineSearch } from 'react-icons/ai'

const Container = styled.div`
  display: flex;
  justify-content: ${props => props.justify};
  align-items: center;
  position: relative;
  border-radius: 10px;
  transition: 0.25s;
  border: 1px solid #d0d5dd;

  input {
    width: 100%;
    border-width: 0px;
    box-sizing: border-box;
    border-radius: 10px 0 0 10px;
    color: ${props => props.fontColor};
    background: none;
    transition: 0.25s;
    margin: 0;
    padding: 10px 10px 9px 45px;
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
      color: #667085;
    }

    @media screen and (max-width: 1480px) {
      font-size: 10px;
      line-height: 14px;
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
  position: absolute;
  left: 0px;
  width: 20px;
  font-size: 20px;
  color: #667085;
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

const SearchBtn = styled.button`
  background: #15202b;
  border-radius: 0px 10px 10px 0px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: white;
  border: none;
  ${props =>
    props.darkMode
      ? `
    border-left: 1px solid #d0d5dd;
  `
      : `
  `}

  &:hover {
    background: #37495b;
  }

  @media screen and (max-width: 1480px) {
    font-size: 10px;
    line-height: 14px;
  }

  @media screen and (max-width: 992px) {
    height: 45px;
  }
`

export { Container, Icon, SearchIcon, SearchBtn }
