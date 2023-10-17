import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  width: auto;
  padding: 9px 3px;
  align-items: center;

  &:hover {
    background: ${props => props.hoverColor};
    border-radius: 7px;
  }

  &.active {
    background: ${props => props.activeColor};
    border-radius: 7px;
  }
`

const Text = styled.div`
  font-weight: ${props => props.weight || '400'};
`

const Vault = styled.div`
  margin-left: 8px;
  font-size: 13px;
  line-height: 18px;
`

const Content = styled.div`
  height: auto;
  // overflow-y: auto;

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

const EmptyContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  font-size: 14px;
  line-height: 18px;
  color: ${props => props.fontColor};

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 15px;
  }
`

const Label = styled.div`
  color: #475467;
  font-size: 13.281px;
  font-weight: 500;
  line-height: 18.972px;
`

export { Container, Text, Vault, Content, EmptyContainer, Label }
