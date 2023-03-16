import React from 'react'
import Collapsible from 'react-collapsible'
import { useMediaQuery } from 'react-responsive'
import uuid from 'react-uuid'
import { FAQContainer, FAQContent, FAQHalfContent, DropdownToggle, Question, Answer, QuestionContainer } from './style'
import { FAQ_ITEMS_FIRST, FAQ_ITEMS_SECOND, FAQ_TOTAL } from '../../constants'
import DropdownToggleImageOpen from '../../assets/images/ui/dropdown-toggle-closed-faq.svg'
import DropdownToggleImageClosed from '../../assets/images/ui/dropdown-toggle-open-faq.svg'
import { useThemeContext } from '../../providers/useThemeContext'

const FAQ = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { pageBackColor, backColor, fontColor, borderColor } = useThemeContext()

  return (
    <FAQContainer pageBackColor={pageBackColor} fontColor={fontColor}>
      {
        isMobile ? 
        <FAQContent>
          {FAQ_TOTAL.map(item => (
            <QuestionContainer key={uuid()}>
              <Collapsible
                lazyRender={item.lazyRender !== undefined ? item.lazyRender : true}
                triggerWhenOpen={
                  <Question open backColor={backColor} borderColor={borderColor}>
                    {item.question}
                    <DropdownToggle open src={DropdownToggleImageOpen} />
                  </Question>
                }
                trigger={
                  <Question backColor={backColor} borderColor={borderColor}>
                      {item.question}
                    <DropdownToggle src={DropdownToggleImageClosed} />
                  </Question>
                }
              >
                <Answer backColor={backColor} borderColor={borderColor}>{item.answer}</Answer>
              </Collapsible>
            </QuestionContainer>
          ))}
        </FAQContent> :
        <FAQContent>
          <FAQHalfContent>
            {FAQ_ITEMS_FIRST.map(item => (
              <QuestionContainer key={uuid()}>
                <Collapsible
                  lazyRender={item.lazyRender !== undefined ? item.lazyRender : true}
                  triggerWhenOpen={
                    <Question open >
                      {item.question}
                      <DropdownToggle open src={DropdownToggleImageOpen} />
                    </Question>
                  }
                  trigger={
                    <Question>
                        {item.question}
                      <DropdownToggle src={DropdownToggleImageClosed} />
                    </Question>
                  }
                >
                  <Answer>{item.answer}</Answer>
                </Collapsible>
              </QuestionContainer>
            ))}
          </FAQHalfContent>
          <FAQHalfContent>
            {FAQ_ITEMS_SECOND.map(item => (
              <QuestionContainer key={uuid()}>
                <Collapsible
                  lazyRender={item.lazyRender !== undefined ? item.lazyRender : true}
                  triggerWhenOpen={
                    <Question open  backColor={backColor} borderColor={borderColor}>
                      {item.question}
                      <DropdownToggle open src={DropdownToggleImageOpen} />
                    </Question>
                  }
                  trigger={
                    <Question backColor={backColor} borderColor={borderColor}>
                        {item.question}
                      <DropdownToggle src={DropdownToggleImageClosed} />
                    </Question>
                  }
                >
                  <Answer backColor={backColor} borderColor={borderColor}>{item.answer}</Answer>
                </Collapsible>
              </QuestionContainer>
            ))}
          </FAQHalfContent>
        </FAQContent>
      }
    </FAQContainer>
  )
}

export default FAQ
