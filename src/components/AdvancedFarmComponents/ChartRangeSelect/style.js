import styled from 'styled-components'

const Container = styled.button`
  font-weight: 400;
  font-size: 12px;
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
        color: #00D26B;
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
`

const Text = styled.div`
  padding: 0 5px;
  ${props =>
    props.state === props.text
      ? `
      // color: #DF0000;
    `
      : ''};
`

export { Container, Text }
