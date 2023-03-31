import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 10px;
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  padding: 15px 21px 14px 21px;
  transition: 0.25s;

  @media screen and (max-width: 992px) {
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
  margin-right: 30px;
  opacity: 1;
  position: relative;
  transition: 0.25s;
  ${props =>
    props.name === 'Labs'
      ? `
      opacity: 0.5 !important;
      cursor: unset !important;
      color: ${props.mode} !important;
      margin-right: 20px !important;
    `
      : ``}

  &:last-child {
    margin-right: 0px;
  }
  padding: 0px;

  &.active {
    background: none;
    color: #ff9400;
    border: none;
    border-radius: 7px;
    opacity: 1;

    img {
      transition: 0.25s;
      filter: invert(57%) sepia(61%) saturate(2063%) hue-rotate(1deg) brightness(103%)
        contrast(105%);
    }
  }
  transition: 0.25s;
  &:hover {
    background: none;
  }

  img {
    margin-right: 10px;
    margin-top: 2px;

    filter: ${props => props.filterColor};
  }

  div {
    width: max-content;
  }

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 18px;

    img {
      width: 13px;
      height: 13px;
    }
  }
`

const Soon = styled.div`
  font-size: 8px;
  position: absolute;
  top: -10px;
  right: -24px;
`

export { ButtonsGroup, ButtonStyle, Soon }
