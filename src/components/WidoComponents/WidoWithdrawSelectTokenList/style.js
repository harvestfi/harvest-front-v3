import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  width: auto;
  padding: 6px;
  align-items: center;

  &:hover {
    background: ${props => props.hoverColor};
    border-radius: 10px;
  }

  &.active {
    background: ${props => props.activeColor};
    border-radius: 10px;
  }
`

const Text = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
`

const Vault = styled.div`
  margin-left: 10px;
`

const Content = styled.div`
  height: 90%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #caf1d5;
    border-radius: 6px;
    border: none;
  }
`

export { Container, Text, Vault, Content }
