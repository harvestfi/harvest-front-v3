import styled from 'styled-components'

const FarmContainer = styled.div`
  text-align: left;
  width: 100%;
  margin-left: 280px;
  background: ${props => props.pageBackColor};
  transition: 0.25s;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 992px) {
    margin-left: 0;
    width: 100%;
    min-height: 100vh;
  }
`

export default FarmContainer
