import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 10px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const ButtonStyle = styled.button`
  display: flex;
  justify-content: center;
  background: transparent;
  color: ${props => props.fontColor};
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  border: none;
  border-right: 1px solid ${props => props.borderColor};
  cursor: pointer;
  padding: 10px 16px;
  position: relative;
  transition: 0.25s;

  &:first-child {
    border-radius: 8px 0 0 8px;
  }

  &:last-child {
    border-radius: 0 8px 8px 0;
    border-right: none;
  }

  &.active,
  &:hover {
    background: ${props => props.hoverColor};
  }
  transition: 0.25s;

  img {
    filter: ${props => props.filterColor};
    padding-right: 8px;
    width: 24px;
  }

  div {
    width: max-content;
  }

  @media screen and (max-width: 1480px) {
    font-size: 12px;
    line-height: 16px;
    align-items: center;
    padding: 9px 14px;
  }

  @media screen and (max-width: 1280px) {
    font-size: 8px;
    line-height: 14px;
    align-items: center;
    padding: 5px 10px;
  }

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 20px;
    padding: 10px 26px;
    width: ${props => props.percent}%;
  }
`

export { ButtonsGroup, ButtonStyle }
