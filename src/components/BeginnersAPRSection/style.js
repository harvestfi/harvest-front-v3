import styled from 'styled-components'

const Container = styled.div`
  transition: 0.25s;
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const Percent = styled.div`
  border-radius: 18px;
  background: white;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #344054;
  transition: 0.25s;
  margin-top: 15px;
  padding: 2px 11px 2px 8px;
  display: flex;
  justify-content: center;
  img {
    margin-right: 5px;
  }
`

export { Container, Percent }
