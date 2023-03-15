import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { SelectToken, SelectTokenWido, CloseBtn, FilterInput, NewLabel, Search, DepoTitle } from './style'
import WidoSelectTokenList from '../WidoSelectTokenList'
import CloseIcon from '../../../assets/images/logos/wido/close.svg'
import SearchIcon from '../../../assets/images/logos/wido/search.svg'

const WidoDepositSelectToken = ( { selectTokenWido, setSelectTokenWido, clickTokenId, setClickedTokenId, 
      setPickedToken, setBalance, balanceList, setWidoPartHeight } ) => {

  const [filter, setFilter] = useState("")

  const onFilter = async (e) => {
    setFilter(e.target.value)
  }

  useEffect(()=>{
    if(selectTokenWido) {
      setWidoPartHeight(565)  // Set fixed height for select token part
    }
  }, [selectTokenWido, setWidoPartHeight])
  
  const { fontColor, borderColor, filterColor, widoInputPanelBorderColor, widoInputBoxShadow, widoSelTokenSubTitleColor,
    widoTagActiveFontColor } = useThemeContext()
  return (
    <SelectToken show={selectTokenWido}>
      <DepoTitle fontColor={widoTagActiveFontColor}>I want to deposit</DepoTitle>
      <SelectTokenWido borderColor={borderColor}>
        <NewLabel display={"flex"} justifyContent={"space-between"} marginBottom={"10px"}>
          <NewLabel weight={"500"} size={"16px"} height={"21px"} color={fontColor}>Select deposit asset</NewLabel>
          <CloseBtn src={CloseIcon} filterColor={filterColor} alt="" onClick={()=>{
            setSelectTokenWido(false)
            setWidoPartHeight(null)
          }}/>
        </NewLabel>

        <NewLabel position={"relative"} marginBottom={"10px"}>
          <Search src={SearchIcon} />
          <FilterInput value={filter} placeholder={"Search for ticker or full name"} shadow={widoInputBoxShadow} borderColor={widoInputPanelBorderColor} onChange={onFilter} />
        </NewLabel>

        <NewLabel marginBottom={"10px"} heightDiv={"75%"}>
          <NewLabel weight={"500"} size={"16px"} height={"21px"} color={widoSelTokenSubTitleColor} marginBottom={"10px"}>Tokens</NewLabel>
          <WidoSelectTokenList list={balanceList} clickId={clickTokenId} setClickedId={setClickedTokenId} 
              setPickedToken={setPickedToken} setBalance={setBalance} setSelectTokenWido={setSelectTokenWido} setWidoPartHeight={setWidoPartHeight} />
        </NewLabel>

        {/* <NewLabel marginBottom={"10px"}>
          <NewLabel weight={"700"} size={"16px"} height={"21px"} color={"#1F2937"} marginBottom={"10px"}>Vaults</NewLabel>
          <NewWidoTestDepositSelectTokenList withdraw={false} list={VaultList} clickId={clickVaultId} setClickedId={setClickedVaultId} setPickedToken={setPickedToken} setBalance={setBalance} />
        </NewLabel> */}
      </SelectTokenWido>
    </SelectToken>
  )
}
export default WidoDepositSelectToken
