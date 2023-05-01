import React, { useEffect, useState } from 'react'
import { fromWEI } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Text, Vault, Content, EmptyContainer } from './style'

const WidoSelectTokenList = ({
  list,
  clickId,
  setClickedId,
  setPickedToken,
  setBalance,
  setSelectTokenWido,
  setWidoPartHeight,
  filterWord,
}) => {
  const handleClick = id => {
    setClickedId(id)
    setPickedToken(list[id])
    setBalance(fromWEI(list[id].balance ? list[id].balance : 0, list[id].decimals))
    setSelectTokenWido(false)
    setWidoPartHeight(null)
  }

  const [tokenList, setTokenList] = useState(list)

  useEffect(() => {
    if (list.length !== 0 && filterWord !== undefined && filterWord !== '') {
      const newList = list.filter(el =>
        el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
      )
      setTokenList(newList)
    }

    if (filterWord === '') {
      setTokenList(list)
    }
  }, [filterWord, list]) // eslint-disable-line react-hooks/exhaustive-deps

  const { widoDepoTokenListActiveColor, widoDepoTokenListHoverColor, fontColor } = useThemeContext()

  return (
    <Content cnt={tokenList.length}>
      {tokenList.length > 0 ? (
        tokenList.map((data, i) => (
          <Container
            key={i}
            className={i === clickId ? 'active' : ''}
            onClick={() => {
              handleClick(i)
            }}
            hoverColor={widoDepoTokenListHoverColor}
            activeColor={widoDepoTokenListActiveColor}
          >
            <img src={data.logoURI} width={25} height={25} alt="" />
            <Vault>
              <Text size="14px" height="18px" weight={700}>
                {data.symbol}
              </Text>
              <Text size="12px" height="16px" weight={400}>
                {data.balance ? fromWEI(data.balance, data.decimals).toFixed(4) : '0.0000'}
              </Text>
            </Vault>
          </Container>
        ))
      ) : (
        <EmptyContainer fontColor={fontColor}>Nothing to Supported</EmptyContainer>
      )}
    </Content>
  )
}
export default WidoSelectTokenList
