import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  width: fit-content;
  background: ${props => props.backColor};
  transition: 0.25s;

  border-radius: 15px;
  border: 0.5px solid ${props => props.borderColor};
  overflow: hidden;
`

const ButtonStyle = styled.button`
  display: flex;
  background: transparent;
  color: black;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  border: none;
  cursor: unset !important;
  padding: 8px;
  ${props =>
    props.btnNum === 0
      ? `
    border-radius: 10px 0 0 10px !important;
  `
      : prop =>
          prop.btnNum === 1
            ? `
      border-radius: 0 !important;
    `
            : `
        border-radius: 0 10px 10px 0 !important;
      `}

  &.active {
    cursor: pointer !important;
    background-color: ${props => props.backcolor};
    color: ${props => (props.activeColor ? props.activeColor : 'black')};
    font-weight: bold;
  }

  ${props =>
    props.wallet === true
      ? `
    img {
      filter: invert(63%) sepia(58%) saturate(3702%) hue-rotate(0deg) brightness(107%) contrast(105%);
    }
  `
      : props.btnNum === 2
      ? props.mode === 'dark'
        ? `
          img {
            filter: invert(99%) sepia(1%) saturate(38%) hue-rotate(115deg) brightness(113%) contrast(100%);
            opacity: 0.42;
          }
        `
        : `
          img {
            opacity: 0.42;
          }
        `
      : ``}// img {
  //   // margin-right: 5px;
  // }
`

export { ButtonsGroup, ButtonStyle }
