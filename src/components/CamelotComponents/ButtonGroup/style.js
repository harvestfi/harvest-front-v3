import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 10px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  // padding: 15px 21px 14px 21px;
  transition: 0.25s;

  @media screen and (max-width: 1475px) {
    padding: 10px 20px;
  }
`

const ButtonStyle = styled.button`
  display: flex;
  background: transparent;
  color: ${props => props.fontColor};
  font-size: 16px;
  line-height: 21px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  // margin-right: 30px;
  opacity: 1;
  position: relative;
  transition: 0.25s;

  &:first-child {
    border-radius: 7px 0 0 7px;
  }

  &:last-child {
    border-radius: 0 7px 7px 0;
    margin-right: 0px;
  }
  padding: 12px 20px;

  &.active {
    background: #ffe1b7;
    color: #475467;
    border: none;
    opacity: 1;

    img {
      transition: 0.25s;
      filter: invert(57%) sepia(61%) saturate(2063%) hue-rotate(1deg) brightness(103%)
        contrast(105%);
    }
  }
  transition: 0.25s;
  &:hover {
    background: #ffe1b7;
    color: #475467;
  }

  img {
    margin-right: 10px;
    margin-top: 2px;

    filter: ${props => props.filterColor};
  }

  div {
    width: max-content;
  }

  @media screen and (max-width: 1475px) {
    font-size: 14px;
    line-height: 18px;

    img {
      width: 13px;
      height: 13px;
    }
  }
`

export { ButtonsGroup, ButtonStyle }
