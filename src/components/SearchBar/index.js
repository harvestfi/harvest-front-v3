import React from 'react'
import { Container, SearchIcon, SearchBtn } from './style'
import { useThemeContext } from '../../providers/useThemeContext'

const VaultSearchBar = ({ placeholder, onKeyDown = () => {}, onSearch = () => {} }) => {
  const { darkMode, fontColor } = useThemeContext()
  const [inputText, setInputText] = React.useState('')

  const onChange = e => {
    setInputText(e.target.value)
  }
  return (
    <Container fontColor={fontColor}>
      <SearchIcon />
      <input
        id="search-input"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      <SearchBtn type="button" darkMode={darkMode} onClick={() => onSearch(inputText)}>
        Search
      </SearchBtn>
    </Container>
  )
}

export default VaultSearchBar
