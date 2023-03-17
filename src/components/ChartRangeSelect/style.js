import styled from 'styled-components'

const Container = styled.button`
  font-weight: 400;
  font-size: 12px;
  padding: 6px 15px;
  display: flex;
  text-align: left;
  margin-left: 20px;
  border: 1px solid white;
  color: #ff9400;
  border-radius: 3px;

  &:hover {
    border: 1px solid #ff9400;
    filter: drop-shadow(0px 0px 4px #ff9400);
  }

  ${props =>
    props.activeItem
      ? props.mode === 'dark'
        ? `
        background: white;
        border-radius: 3px;
    `
        : `
        background: #FFE6AF;
        border-radius: 3px;
      `
      : props.mode === 'dark'
      ? `
      background: none;
      border: 1px solid #15202B;
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
