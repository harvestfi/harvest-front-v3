import styled from 'styled-components'

const Container = styled.a`
  width: 100%;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  text-align: left;
  text-decoration: none;
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  transition: 0.25s;
  padding: 20px;
`

const FarmType = styled.div`
  display: flex;
  border: 1.5px solid #039855;
  border-radius: 16px;
  background: white;
  align-items: center;

  color: #027a48;
  padding: 4px 12px;
`

const Text = styled.div`
  margin-left: 7px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  align-self: center;
`

const ContentImg = styled.img`
  width: ${props => props.width || '20px'};
  height: ${props => props.height || '20px'};
  margin: ${props => props.margin || '0px'};
  z-index: ${props => props.id};

  &:not(:first-child) {
    margin-left: -15px;
  }
`

const ContentMiddle = styled.div`
  font-size: 23px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
`

const ContentResult = styled.div`
  font-size: 23px;
  display: flex;
  justify-content: space-between;
  position: relative;
`

const Img = styled.div`
  display: flex;
  align-self: center;
`

const Percent = styled.div`
  font-weight: 600;
  font-size: 30px;
  line-height: 38px;
  color: ${props => props.fontColor};
  transition: 0.25s;

  @media screen and (max-width: 1352px) {
    font-size: 18px;
    line-height: 25px;
  }

  @media screen and (max-width: 992px) {
    font-size: 30px;
    line-height: 38px;
  }
`

const ChartDiv = styled.div`
  position: absolute;
  bottom: -50px;
  right: 0;
`

export {
  Container,
  FarmType,
  Text,
  ContentResult,
  ContentImg,
  ContentMiddle,
  Img,
  Percent,
  ChartDiv,
}
