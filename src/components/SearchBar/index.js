import React from 'react'
import { Container, Icon, SearchIcon } from './style'
import { useThemeContext } from '../../providers/useThemeContext'
import closeImg from '../../assets/images/logos/close.svg'
// import { AiOutlineSearch } from "react-icons/ai"

const VaultSearchBar = ({ placeholder, onChange = () => {}, onClose = () => {} }) => {
  const { searchBackColor, fontColor, searchBorderColor, searchIconColor } = useThemeContext()
  return (
  <Container borderColor={searchBorderColor} backColor={searchBackColor} fontColor={fontColor}>
    {/* <Icon src={searchImg} alt="Search" left={12} /> */}
    <SearchIcon/>
    <input id="search-input" onChange={onChange} placeholder={placeholder} />
    <Icon src={closeImg} width={12} height={12} alt="close" right={12} opacity={"0.6"} cursor={"pointer"} iconColor={searchIconColor}
      onClick={onClose} />
  </Container>
)
}

export default VaultSearchBar
