import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  width: fit-content;
  background: ${props => props.backColor};
  transition: 0.25s;

  border-radius: 8px;
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
  padding: 10px 16px;
  ${props =>
    props.btnNum === 0
      ? `
    border-radius: 8px 0 0 8px !important;
    border-right: 1px solid ${props.borderColor};
  `
      : prop =>
          prop.btnNum === 1
            ? `
      border-radius: 0 !important;
    `
            : `
        border-radius: 0 8px 8px 0 !important;
        border-left: 1px solid ${props.borderColor};
      `}

  &.active {
    cursor: pointer !important;
    background: transparent;
    color: ${props => (props.activeColor ? props.activeColor : 'black')};
    font-weight: bold;

    img {
      filter: invert(50%) sepia(90%) saturate(1885%) hue-rotate(116deg) brightness(103%)
        contrast(105%);
    }
  }

  img {
    filter: invert(49%) sepia(28%) saturate(563%) hue-rotate(193deg) brightness(91%) contrast(88%);
  }

  &:hover {
    background-color: ${props => props.backcolor};
    ${props =>
      props.wallet === false && props.btnNum === 2
        ? `
      background-color: transparent;
          `
        : ``}
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
  font-size: 12px;
  line-height: 18px;
`

export { ButtonsGroup, ButtonStyle, TooltipContent }
