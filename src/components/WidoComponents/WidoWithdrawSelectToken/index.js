import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { SelectTokenWido, CloseBtn, FilterInput, NewLabel, Search } from './style'
import WidoWithdrawSelectTokenList from '../WidoWithdrawSelectTokenList'
import CloseIcon from '../../../assets/images/logos/wido/close.svg'
import SearchIcon from '../../../assets/images/logos/wido/search.svg'

const WidoWithdrawSelectToken = ({
  selectTokenWido,
  setSelectTokenWido,
  clickTokenId,
  setClickedTokenId,
  setPickedToken,
  supTokenList,
  setWidoPartHeight,
}) => {
  const {
    borderColor,
    backColor,
    filterColor,
    widoSelTokenSubTitleColor,
    widoInputBoxShadow,
    widoInputPanelBorderColor,
  } = useThemeContext()

  const [filterWord, setFilterWord] = useState('')

  const onFilter = async e => {
    setFilterWord(e.target.value)
  }

  useEffect(() => {
    if (selectTokenWido) {
      setWidoPartHeight(565)
    }
  }, [setWidoPartHeight, selectTokenWido])

  return (
    <SelectTokenWido show={selectTokenWido} backColor={backColor} borderColor={borderColor}>
      <NewLabel display="flex" justifyContent="space-between" marginBottom="10px">
        <NewLabel weight="500" size="16px" height="21px">
          Select withdrawal asset
        </NewLabel>
        <CloseBtn
          src={CloseIcon}
          alt=""
          onClick={() => {
            setSelectTokenWido(false)
            setWidoPartHeight(null)
          }}
          filterColor={filterColor}
        />
      </NewLabel>

      <NewLabel position="relative" marginBottom="10px">
        <Search src={SearchIcon} />
        <FilterInput
          value={filterWord}
          placeholder="Search for ticker or full name"
          shadow={widoInputBoxShadow}
          borderColor={widoInputPanelBorderColor}
          onChange={onFilter}
        />
      </NewLabel>

      <NewLabel marginBottom="10px" heightDiv="75%" scroll="scroll">
        <NewLabel
          weight="500"
          size="16px"
          height="21px"
          color={widoSelTokenSubTitleColor}
          marginBottom="10px"
        >
          Supported Tokens
        </NewLabel>
        <WidoWithdrawSelectTokenList
          list={supTokenList}
          clickId={clickTokenId}
          setClickedId={setClickedTokenId}
          setPickedToken={setPickedToken}
          setSelectTokenWido={setSelectTokenWido}
          setWidoPartHeight={setWidoPartHeight}
          filterWord={filterWord}
        />
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoWithdrawSelectToken
