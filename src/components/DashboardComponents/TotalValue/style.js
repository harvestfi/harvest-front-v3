import styled from 'styled-components'

const Container = styled.div`
  width: 48%;
  margin: 30px 20px 30px 27px;
  &:first-child {
    border-right: 1px solid ${props=>props.borderColor};
  }
  font-weight: 700;

  @media screen and (max-width: 992px) {
    width: 100%;
    margin: 15px;
  }
`

const Div = styled.div`
  display: flex;
  font-size: 16px;
  line-height: 21px;
  align-items: center;
  
  img {
    margin-right: 11px;
  }

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 16px;
  }
`

const Price = styled.div`
  margin-top: 15px;
  font-size: 20px;
  line-height: 26px;

  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 18px;
    margin-top: 10px;
  }
`

export { Container, Div, Price }
