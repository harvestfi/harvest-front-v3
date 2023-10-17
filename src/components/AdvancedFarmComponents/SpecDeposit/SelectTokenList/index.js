import React, { useEffect, useState } from 'react'
// import { useMediaQuery } from 'react-responsive'
import { fromWei } from '../../../../services/web3'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { Container, Text, Vault, Content, EmptyContainer, Label } from './style'
import AnimatedDots from '../../../AnimatedDots'

const SelectTokenList = ({
  balanceList,
  setPickedToken,
  setBalance,
  setSelectToken,
  setPartHeight,
  filterWord,
}) => {
  const [showList, setShowList] = useState(false)

  // Supported token with balance in my wallet
  const [balanceTokenList, setBalanceTokenList] = useState(balanceList)
  const [clickBalanceListId, setClickBalanceListId] = useState(-1)
  const handleBalanceListClick = id => {
    setClickBalanceListId(id)
    setPickedToken(balanceTokenList[id])
    setBalance(
      fromWei(
        balanceTokenList[id].balance ? balanceTokenList[id].balance : 0,
        balanceTokenList[id].decimals,
      ),
    )
    setSelectToken(false)
    setPartHeight(null)
  }

  useEffect(() => {
    if (balanceList && filterWord !== undefined && filterWord !== '') {
      if (balanceList.length !== 0) {
        const newList = balanceList.filter(el =>
          el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
        )
        setBalanceTokenList(newList)
      }
    }
    if (filterWord === '') {
      setBalanceTokenList(balanceList)
    }
  }, [filterWord, balanceList]) // eslint-disable-line react-hooks/exhaustive-deps

  const { widoDepoTokenListActiveColor, widoDepoTokenListHoverColor, fontColor } = useThemeContext()
  // const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const count = balanceList && balanceList.length
    if (count > 0) {
      setShowList(true)
    }
  }, [balanceList])

  return (
    <>
      {showList ? (
        <Content>
          {balanceTokenList.length > 0 && (
            <>
              <Label>Tokens on your wallet that you can use as deposit:</Label>
              {balanceTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clickBalanceListId ? 'active' : ''}
                  onClick={() => {
                    handleBalanceListClick(i)
                  }}
                  hoverColor={widoDepoTokenListHoverColor}
                  activeColor={widoDepoTokenListActiveColor}
                >
                  <img src={data.logoURI} width={37} height={37} alt="" />
                  <Vault>
                    <Text weight={500} color="#101828">
                      {data.token}
                    </Text>
                    <Text weight={400} color="#475467">
                      {data.amount ? `${1 * fromWei(data.amount, data.decimals)}` : '0.00'}
                    </Text>
                  </Vault>
                </Container>
              ))}
            </>
          )}
        </Content>
      ) : (
        <EmptyContainer fontColor={fontColor}>
          Loading Token list
          <AnimatedDots />
        </EmptyContainer>
      )}
    </>
  )
}
export default SelectTokenList
