import styled from 'styled-components'

const Container = styled.button`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  padding: 3px 15px;
  display: flex;
  text-align: left;
  // margin-left: 20px;
  border: none;
  color: #282f3d;
  border-radius: 3px;

  &:hover {
    background: ${props =>
      props.mode === 'dark'
        ? `
          #3b3c3e
        `
        : `#e9f0f7`};
    // filter: drop-shadow(0px 0px 4px #ff9400);
  }

  ${props =>
    props.activeItem
      ? props.mode === 'dark'
        ? `
        background: none;
        border-radius: 3px;
        color: #ff9400;
    `
        : `
        background: none;
        border-radius: 3px;
        color: #5B5181;
      `
      : props.mode === 'dark'
      ? `
      background: none;
      border: none;
      color: white;
    `
      : `
      background: white;
      `}

  @media screen and (max-width: 992px) {
    font-size: 8px;
    line-height: 8px;
  }
`

const Text = styled.div`
  padding: 0 5px;

  @media screen and (max-width: 992px) {
    ${props =>
      props.activeItem
        ? `
          color: #5b5181;
          font-weight: 700;
        `
        : `
          color: #282F3D;
          font-weight: 400;
        `}
  }
`

export { Container, Text }
