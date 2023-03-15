import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Text } from './style'

const ChartRangeSelect = ( { state, type, text, onClick } ) => {
  const {switchMode} = useThemeContext()
  return (
    <Container state={state} type={type} text={text} mode={switchMode} activeItem={text===state ? true : false} onClick={()=>{ 
      onClick() 
    }} >
      <Text state={state} text={text} type={type}>{text}</Text>
    </Container>
  )
}

export default ChartRangeSelect
