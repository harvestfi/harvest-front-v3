import styled from 'styled-components'
import { AiOutlineSearch } from 'react-icons/ai'

const Container = styled.div`
  display: flex;
  justify-content: ${props => props.justify};
  background: ${props => props.backColor};
  align-items: center;
  position: relative;
  border-radius: 10px;
  transition: 0.25s;
  border: 1px solid #d0d5dd;
  margin-right: 15px;
  height: fit-content;

  input {
    width: 100%;
    border-width: 0px;
    box-sizing: border-box;
    border-radius: 10px 0 0 10px;
    color: ${props => props.fontColor};
    background: none;
    transition: 0.25s;
    margin: 0;
    padding: 9px 10px;
    outline: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;

    &:disabled {
      background-color: #fffce6;
      opacity: 0.9;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #667085;
    }

    @media screen and (max-width: 1480px) {
      padding: 6px 10px;
      font-size: 12px;
      line-height: 16px;
    }

    @media screen and (max-width: 1280px) {
      font-size: 8px;
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
  font-size: 20px;

  @media screen and (max-width: 1480px) {
    font-size: 14px;
  }

  @media screen and (max-width: 1280px) {
    font-size: 13px;
  }

  @media screen and (max-width: 992px) {
    width: 12px;
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
  font-size: 14px;
  line-height: 20px;
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
    padding: 10px 15px;
  }

  @media screen and (max-width: 1280px) {
    padding: 6px 10px;
  }

  @media screen and (max-width: 992px) {
    height: 45px;
  }
`

export { Container, Icon, SearchIcon, SearchBtn }
