import React from 'react'
import { Container, SearchBtn } from './style'
import { useThemeContext } from '../../../providers/useThemeContext'
import SearchIcon from '../../../assets/images/logos/filter/search.svg'

const VaultSearchBar = ({
  placeholder,
  onKeyDown = () => {},
  onSearch = () => {},
  inputText,
  setInputText,
}) => {
  const { darkMode, fontColor, backColor, filterBorderColor } = useThemeContext()

  const onChange = e => {
    setInputText(e.target.value)
  }
  return (
    <Container fontColor={fontColor} borderColor={filterBorderColor} backColor={backColor}>
      <input
        id="search-input"
        value={inputText}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      <SearchBtn type="button" darkMode={darkMode} onClick={() => onSearch(inputText)}>
        <img src={SearchIcon} alt="" />
      </SearchBtn>
    </Container>
  )
}

export default VaultSearchBar
