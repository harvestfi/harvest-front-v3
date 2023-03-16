import styled from 'styled-components'

const FarmContainer = styled.div`
  text-align: left;
  width: 100%;
  // margin-left: 320px;
  background: ${props => props.pageBackColor};
  transition: 0.25s;
  // @media screen and (min-width: 1920px) {
  display: flex;
  justify-content: center;
  // }

  @media screen and (max-width: 992px) {
    margin-left: 0;
    width: 100%;
  }
`

export { FarmContainer }
