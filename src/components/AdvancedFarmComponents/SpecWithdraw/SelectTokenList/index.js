import React, { useEffect, useState } from 'react'
// import { useMediaQuery } from 'react-responsive'
import { fromWei } from '../../../../services/web3'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { Container, Text, Vault, Content, EmptyContainer, Label } from './style'
import AnimatedDots from '../../../AnimatedDots'

const SelectTokenList = ({
  balanceList,
  setPickedToken,
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
    setSelectToken(false)
    setPartHeight(null)
  }

  // Default Token
  const handleDefaultToken = () => {
    setClickBalanceListId(-1)
    setSelectToken(false)
    setPartHeight(null)
  }
  const [defaultCurToken, setDefaultCurToken] = useState()

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
      setDefaultCurToken()
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
          {defaultCurToken &&
            !(
              Object.keys(defaultCurToken).length === 0 && defaultCurToken.constructor === Object
            ) && (
              <>
                <Label>Default token to withdraw to </Label>
                <Container
                  onClick={() => {
                    handleDefaultToken()
                  }}
                  hoverColor={widoDepoTokenListHoverColor}
                  activeColor={widoDepoTokenListActiveColor}
                >
                  <img src={defaultCurToken.logoURI} width={37} height={37} alt="" />
                  <Vault>
                    <Text weight={500} color="#101828">
                      {defaultCurToken.symbol}
                    </Text>
                    <Text weight={400} color="#475467">
                      {defaultCurToken.balance
                        ? `${1 * fromWei(defaultCurToken.balance, defaultCurToken.decimals)}`
                        : '0.00'}
                    </Text>
                  </Vault>
                </Container>
              </>
            )}
          {balanceTokenList.length > 0 && (
            <>
              <Label>Tokens on your wallet that you can withdraw to </Label>
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
                      {data.symbol}
                    </Text>
                    <Text weight={400} color="#475467">
                      {data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}
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
