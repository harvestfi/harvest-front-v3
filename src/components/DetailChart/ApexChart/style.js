import styled from 'styled-components'

const LoadingDiv = styled.div`
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`

const NoData = styled.div`
  color: ${props => props.fontColor};

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 18px;
  }
`

export { LoadingDiv, NoData }
