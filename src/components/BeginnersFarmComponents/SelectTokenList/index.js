import React, { useEffect, useState } from 'react'
import { fromWei } from '../../../services/web3'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Text, Vault, Content, EmptyContainer } from './style'
import AnimatedDots from '../../AnimatedDots'

const SelectTokenList = ({
  list,
  clickId,
  setClickedId,
  setPickedToken,
  setBalance,
  setSelectTokenWido,
  setPartHeight,
  filterWord,
}) => {
  const [tokenList, setTokenList] = useState(list)
  const handleClick = id => {
    setClickedId(id)
    setPickedToken(tokenList[id])
    setBalance(fromWei(tokenList[id].balance ? tokenList[id].balance : 0, tokenList[id].decimals))
    setSelectTokenWido(false)
    setPartHeight(null)
  }

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
                {data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}
              </Text>
            </Vault>
          </Container>
        ))
      ) : (
        <EmptyContainer fontColor={fontColor}>
          Loading Token list
          <AnimatedDots />
        </EmptyContainer>
      )}
    </Content>
  )
}
export default SelectTokenList
