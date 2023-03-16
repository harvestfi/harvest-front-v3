import styled from 'styled-components'
import "@fontsource/manrope";

const FAQContainer = styled.div`
  // margin-left: 320px;
  width: 100%;
  position: relative;
  z-index: 2;

  background: ${props=>props.pageBackColor};
  color: ${props=>props.fontColor};
  
  font-weight: 400;
  line-height: 150%;
  font-family: 'DM Sans';
  transition: 0.25s;
  
  display: flex;
  justify-content: center;

  @media screen and (max-width: 992px) {
    margin: auto;
  }
`

const FAQContent = styled.div`
  padding: 70px 46px 57px 46px;
  
  display: flex;
  justify-content: space-between;

  @media screen and (min-width: 1920px) {
    width: 1250px;
  }

  @media screen and (max-width: 992px) {
    display: block;
    padding: 30px 10px;
  }
`

const FAQHalfContent = styled.div`
  width: 45%;
`

const FAQBox = styled.div`
  background: #daeff0;
  border-radius: 8px;
  width: 100%;
`

const QuestionContainer = styled.div`
  margin-bottom: 25px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 3;

  ul {
    margin: 0px;
  }

  @media screen and (max-width: 992px) {
    margin-bottom: 15px;
    ul {
      padding: 0 5px 0px;
      list-style-type: none;
    }
  }
`

const Question = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  padding: 16px;
  border-radius: 10px;
  transition: 0.25s;

  &:hover {
    background: #E9E9E9;
  }

  ${props =>
    props.open
      ? `
  border-bottom-left-radius: 0px; 
  border-bottom-right-radius: 0px;
  border-radius: 10px 10px 0px 0px;
    background: #E9E9E9;
  `
      : ``}

  @media screen and (max-width: 992px) {
    padding: 16px;
    font-size: 16px;
    line-height: 24px;
  }
`

const DropdownToggle = styled.img`
  // margin-right: 40px;

  @media screen and (max-width: 992px) {
    // margin-right: 15px;
  }
`

const Answer = styled.div`
  padding: 16px;
  background: #E9E9E9;
  transition: 0.25s;
  border-radius: 0 0 10px 10px;
  border-top: none;
  font-size: 14px;
  
  @media screen and (max-width: 992px) {
    padding: 16px 20px;
    font-size: 12px;
  }
`

export { FAQContainer, FAQBox, Question, Answer, DropdownToggle, QuestionContainer, FAQHalfContent, FAQContent }
