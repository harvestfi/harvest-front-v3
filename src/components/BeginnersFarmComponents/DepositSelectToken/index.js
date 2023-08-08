import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { SelectToken, SelectTokenWido, CloseBtn, FilterInput, NewLabel, Search } from './style'
import SelectTokenList from '../SelectTokenList'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import SearchIcon from '../../../assets/images/logos/beginners/search.svg'

const DepositSelectToken = ({
  selectTokenWido,
  setSelectTokenWido,
  clickTokenId,
  setClickedTokenId,
  setPickedToken,
  setBalance,
  supTokenList,
  setPartHeight,
}) => {
  const [filterWord, setFilterWord] = useState('')

  const onFilter = async e => {
    setFilterWord(e.target.value)
  }

  useEffect(() => {
    if (selectTokenWido) {
      setPartHeight(350) // Set fixed height for select token part
    }
  }, [selectTokenWido, setPartHeight])

  const { filterColor } = useThemeContext()
  return (
    <SelectToken show={selectTokenWido}>
      <SelectTokenWido>
        <NewLabel position="relative">
          <Search src={SearchIcon} />
          <FilterInput
            value={filterWord}
            placeholder="Search for ticker or full name"
            onChange={onFilter}
          />
          <CloseBtn
            src={CloseIcon}
            filterColor={filterColor}
            alt=""
            onClick={() => {
              setSelectTokenWido(false)
              setPartHeight(null)
            }}
          />
        </NewLabel>

        <NewLabel heightDiv="85%" divScroll="scroll" padding="15px 17px 0">
          <NewLabel weight="500" size="13px" height="19px" color="#475467">
            Tokens on your connected wallet that you can use as a deposit:
          </NewLabel>
          <SelectTokenList
            list={supTokenList}
            clickId={clickTokenId}
            setClickedId={setClickedTokenId}
            setPickedToken={setPickedToken}
            setBalance={setBalance}
            setSelectTokenWido={setSelectTokenWido}
            setPartHeight={setPartHeight}
            filterWord={filterWord}
          />
        </NewLabel>
      </SelectTokenWido>
    </SelectToken>
  )
}
export default DepositSelectToken
