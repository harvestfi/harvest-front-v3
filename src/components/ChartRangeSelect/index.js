import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { Container, Text } from './style'

const ChartRangeSelect = ({ state, type, text, onClick }) => {
  const { switchMode } = useThemeContext()
  return (
    <Container
      state={state}
      type={type}
      text={text}
      mode={switchMode}
      activeItem={text === state}
      onClick={() => {
        onClick()
      }}
    >
      <Text activeItem={text === state}>{text}</Text>
    </Container>
  )
}

export default ChartRangeSelect
