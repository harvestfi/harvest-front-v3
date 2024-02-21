import styled from 'styled-components'

const Container = styled.div`
  width: 32%;
  margin-right: 17px;
  font-weight: 700;
  background: ${props => props.backColor};
  padding: 20px;

  border: 1px solid #eaecf0;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 10px;

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-bottom: 15px;
  }
`

const Div = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.fontColor};
  margin-top: 20px;
  margin-bottom: 7px;
  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 16px;
  }
`

const Price = styled.div`
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
  margin-top: 10px;
  color: ${props => props.fontColor};
  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 18px;
    margin-top: 10px;
  }
`

export { Container, Div, Price }
