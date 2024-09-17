import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin-top: ${props => props.marginTop}px;
  margin-right: ${props => props.marginRight}px;
  color: ${props => props.fontColor};
  line-height: ${props => props.lineHeight};
  font-weight: ${props => props.fontWeight};
  font-size: ${props => props.fontSize}px;
`

const Label = styled.div`
  display: flex;
  color: ${props => props.fontColor};
  background: ${props => props.backColor};
  border-radius: ${props => props.borderRadius};
  padding: ${props => props.padding};
  text-decoration: ${props => props.textDecoration};
  img {
    margin-left: ${props => (props.imgMargin ? `${props.imgMargin}px` : '3px')};
    align-self: center;
  }
`

const Content = styled.div`
  font-size: ${props => props.size}px;
  font-weight: ${props => (props.weight ? prop => prop.weight : 'normal')};
  line-height: ${props => props.height}px;
  color: ${props => props.color};
  align-self: center;

  img.boost-img {
    width: 16px;
    margin: -2px 0px auto 5px;
  }
`

const Percent = styled.div`
  border-radius: 6px;
  padding: 0px 10px;
  margin-left: 10px;

  ${props =>
    props.up
      ? `
      background: ${props.dashboardBack};
      color: ${props.dashboardColor};
    `
      : `
      background: #FEE3E3;
      color: #E64D3E;
  `}
`

const TextInner = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;

  @media screen and (max-width: 992px) {
    font-size: 10px;
  }
`
const ChainImage = styled.img`
  width: 12px;
  height: 12px;
  margin-left: ${props => (props.imgMargin ? `${props.imgMargin}px!important` : '3px')};
`

export { Container, Label, Content, Percent, TextInner, ChainImage }
