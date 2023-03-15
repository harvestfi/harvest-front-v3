import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  width: auto;
  margin-bottom: 13px;
  padding: 6px;
  background: #ECFDF3;
  border-radius: 16px;
  align-items: center;

  &.active {
    background: #F5F5F5;
    border-radius: 10px;
  }
`

const Text = styled.div`
  ${props => props.color ? `
  color: ${props.color};
  ` : ""   
  }
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
`

const Vault = styled.div`
  margin-left: 10px;
`

export { Container, Text, Vault, }
