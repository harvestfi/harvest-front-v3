import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import {
  SelectToken,
  SelectTokenWido,
  CloseBtn,
  FilterInput,
  NewLabel,
  Search,
  DepoTitle,
} from './style'
import WidoSelectTokenList from '../WidoSelectTokenList'
import WidoSoonToSupportTokenList from '../WidoSoonToSupportTokenList'
import CloseIcon from '../../../assets/images/logos/wido/close.svg'
import SearchIcon from '../../../assets/images/logos/wido/search.svg'

const WidoDepositSelectToken = ({
  selectTokenWido,
  setSelectTokenWido,
  clickTokenId,
  setClickedTokenId,
  setPickedToken,
  setBalance,
  supTokenList,
  soonToSupList,
  setWidoPartHeight,
}) => {
  const [filterWord, setFilterWord] = useState('')

  const onFilter = async e => {
    setFilterWord(e.target.value)
  }

  useEffect(() => {
    if (selectTokenWido) {
      setWidoPartHeight(565) // Set fixed height for select token part
    }
  }, [selectTokenWido, setWidoPartHeight])

  const {
    fontColor,
    borderColor,
    filterColor,
    widoInputPanelBorderColor,
    widoInputBoxShadow,
    widoSelTokenSubTitleColor,
    widoTagActiveFontColor,
  } = useThemeContext()
  return (
    <SelectToken show={selectTokenWido}>
      <DepoTitle fontColor={widoTagActiveFontColor}>I want to deposit</DepoTitle>
      <SelectTokenWido borderColor={borderColor}>
        <NewLabel display="flex" justifyContent="space-between" marginBottom="10px">
          <NewLabel weight="500" size="16px" height="21px" color={fontColor}>
            Select deposit asset
          </NewLabel>
          <CloseBtn
            src={CloseIcon}
            filterColor={filterColor}
            alt=""
            onClick={() => {
              setSelectTokenWido(false)
              setWidoPartHeight(null)
            }}
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
          <WidoSelectTokenList
            list={supTokenList}
            clickId={clickTokenId}
            setClickedId={setClickedTokenId}
            setPickedToken={setPickedToken}
            setBalance={setBalance}
            setSelectTokenWido={setSelectTokenWido}
            setWidoPartHeight={setWidoPartHeight}
            filterWord={filterWord}
          />
          <NewLabel
            weight="500"
            size="16px"
            height="21px"
            color={widoSelTokenSubTitleColor}
            marginBottom="10px"
          >
            Soon to be Supported
          </NewLabel>
          <WidoSoonToSupportTokenList list={soonToSupList} filterWord={filterWord} />
        </NewLabel>
      </SelectTokenWido>
    </SelectToken>
  )
}
export default WidoDepositSelectToken
