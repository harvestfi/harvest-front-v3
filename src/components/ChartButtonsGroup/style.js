import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  width: fit-content;
  background: ${props => props.backColor};
  transition: 0.25s;

  border-radius: 15px;
  border: 1px solid ${props => props.borderColor};
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
    border-right: 1px solid ${props.borderColor};
  `
      : prop =>
          prop.btnNum === 1
            ? `
      border-radius: 0 !important;
    `
            : `
        border-radius: 0 10px 10px 0 !important;
        border-left: 1px solid ${props.borderColor};
      `}

  &.active {
    cursor: pointer !important;
    background: transparent;
    color: ${props => (props.activeColor ? props.activeColor : 'black')};
    font-weight: bold;

    img {
      filter: invert(63%) sepia(58%) saturate(3702%) hue-rotate(0deg) brightness(107%)
        contrast(105%);
    }
  }

  &:hover {
    background-color: ${props => props.backcolor};
  }

  ${props =>
    props.mode === 'true'
      ? `
      img {
        filter: invert(100%) sepia(95%) saturate(22%) hue-rotate(33deg) brightness(106%) contrast(107%);
      }
    `
      : ``}

  ${props =>
    props.wallet === true
      ? `
    img {
      // filter: invert(63%) sepia(58%) saturate(3702%) hue-rotate(0deg) brightness(107%) contrast(105%);
    }
  `
      : props.btnNum === 2
      ? props.mode === 'true'
        ? `
          img {
            filter: invert(85%) sepia(58%) saturate(0%) hue-rotate(241deg) brightness(94%) contrast(89%);
            opacity: 0.6;
          }
        `
        : `
          img {
            opacity: 0.42;
          }
        `
      : ``}
`

const TooltipContent = styled.div`
  display: flex;
  color: white !important;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
`

export { ButtonsGroup, ButtonStyle, TooltipContent }
