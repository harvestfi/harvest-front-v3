import React, { useEffect, useState } from 'react'
import { fromWei } from '../../../services/web3'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Text, Vault, Content, EmptyContainer } from './style'

const WidoSoonToSupportTokenList = ({ list, filterWord }) => {
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

  const { widoDepoTokenListHoverColor, fontColor } = useThemeContext()

  return (
    <Content>
      {tokenList.length > 0 ? (
        tokenList.map((data, i) => (
          <Container key={i} hoverColor={widoDepoTokenListHoverColor}>
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
        <EmptyContainer fontColor={fontColor} />
      )}
    </Content>
  )
}
export default WidoSoonToSupportTokenList
