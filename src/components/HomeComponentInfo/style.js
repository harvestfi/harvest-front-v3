import styled from 'styled-components'

const Container = styled.a`
  width: 100%;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
  text-decoration: none;
  background: ${props=>props.backColor};
  transition: 0.25s;
`

const Header = styled.div`
  position: relative;
  width: 100%;

  img.back-img {
    width: 100%;
    // height: 84px;
    border-radius: 10px 10px 0 0;
  }
`

const Content = styled.div`
  border-radius: 0 0 10px 10px;
  border: 1px solid ${props=>props.borderColor};
  border-top-width: 0px;
`

const FarmType = styled.div`
  display: flex;
  border-radius: 20px;
  position: absolute;
  top: 43px;
  left: 18px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  
  color: ${props => props.textColor};
  padding: 7px 10px;

  img {
    // width: auto;
  }
  
`

const Text = styled.div`
  margin-left: 0.5rem;
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  align-self: center;
`

const ContentImg = styled.img`
  width: ${props => props.width || '20px'};
  height: ${props => props.height || '20px'};
  margin: ${props => props.margin || '0px'};
  z-index: ${props=>props.id};

  &:not(:first-child) {
    margin-left: -15px;
  }
`

const ContentMiddle = styled.div`
  font-size: 23px;
  margin: 10px 20px;
  display: flex;
  justify-content: space-between;

`

const ContentResult = styled.div`
  font-size: 23px;
  display: flex;
  justify-content: space-between;
  margin: 27px 20px 20px 20px;
`

const ContentItem= styled.div`
  font-size: 18px;
  display: flex;
`

const Value = styled.div`
  transition: 0.25s;
  color: ${props=>props.fontColor};
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  margin-left: 5px;
`

const Img = styled.div`
  display: flex;
  align-self: center;
`

const Percent = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 39px;
  color: ${props=>props.fontColor};
  transition: 0.25s;
`

const Chain = styled.div`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;

  text-align: right;

  color: ${props=>props.fontColor};
  transition: 0.25s;

  &:first-letter {
    text-transform: capitalize;
  }
`

export { Container, FarmType, Text, ContentResult, ContentItem, Value, ContentImg,
Header, ContentMiddle, Img, Percent, Content, Chain }
