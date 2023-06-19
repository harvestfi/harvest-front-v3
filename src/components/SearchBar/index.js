import React from 'react'
import { Container, SearchIcon, SearchBtn } from './style'
import { useThemeContext } from '../../providers/useThemeContext'

const VaultSearchBar = ({
  placeholder,
  onKeyDown = () => {},
  onSearch = () => {},
  inputText,
  setInputText,
}) => {
  const { darkMode, fontColor, backColor, borderColor } = useThemeContext()

  const onChange = e => {
    setInputText(e.target.value)
  }
  return (
    <Container fontColor={fontColor} borderColor={borderColor} backColor={backColor}>
      <input
        id="search-input"
        value={inputText}
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
