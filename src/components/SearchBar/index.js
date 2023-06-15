import React from 'react'
import { Container, SearchIcon, SearchBtn } from './style'
import { useThemeContext } from '../../providers/useThemeContext'

const VaultSearchBar = ({ placeholder, onKeyDown = () => {}, onSearch = () => {} }) => {
  const { darkMode, fontColor, backColor } = useThemeContext()
  const [inputText, setInputText] = React.useState('')

  const onChange = e => {
    setInputText(e.target.value)
  }
  return (
    <Container fontColor={fontColor} backColor={backColor}>
      <input
        id="search-input"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      <SearchBtn type="button" darkMode={darkMode} onClick={() => onSearch(inputText)}>
        <SearchIcon />
      </SearchBtn>
    </Container>
  )
}

export default VaultSearchBar
