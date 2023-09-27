import React, { useEffect, useState } from 'react'
// import { useMediaQuery } from 'react-responsive'
import { fromWei } from '../../../../services/web3'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { Container, Text, Vault, Content, EmptyContainer, Label } from './style'
import AnimatedDots from '../../../AnimatedDots'

const SelectTokenList = ({
  balanceList,
  supTokenNoBalanceList,
  defaultToken,
  soonToSupList,
  setPickedToken,
  setBalance,
  setSelectToken,
  setPartHeight,
  filterWord,
}) => {
  const [showList, setShowList] = useState(false)

  // Supported Token with no balance
  const [supTokenList, setSupTokenList] = useState(supTokenNoBalanceList)
  const [clicksupTokenNoBalanceListId, setClickSupTokenNoBalanceListId] = useState(-1)
  const handleSupTokenNoBalanceListClick = id => {
    setClickSupTokenNoBalanceListId(id)
    setPickedToken(supTokenList[id])
    setBalance(
      fromWei(supTokenList[id].balance ? supTokenList[id].balance : 0, supTokenList[id].decimals),
    )
    setSelectToken(false)
    setPartHeight(null)
  }

  // Supported token with balance in my wallet
  const [balanceTokenList, setBalanceTokenList] = useState(balanceList)
  const [clickBalanceListId, setClickBalanceListId] = useState(-1)
  const handleBalanceListClick = id => {
    setClickBalanceListId(id)
    setPickedToken(balanceTokenList[id])
    setBalance(
      fromWei(supTokenList[id].balance ? supTokenList[id].balance : 0, supTokenList[id].decimals),
    )
    setSelectToken(false)
    setPartHeight(null)
  }

  // Default Token
  const handleDefaultToken = () => {
    setClickBalanceListId(-1)
    setClickSupTokenNoBalanceListId(-1)
    setPickedToken(defaultToken)
    setBalance(fromWei(defaultToken.balance ? defaultToken.balance : 0, defaultToken.decimals))
    setSelectToken(false)
    setPartHeight(null)
  }

  useEffect(() => {
    if (
      supTokenNoBalanceList &&
      supTokenNoBalanceList.length !== 0 &&
      balanceList &&
      balanceList.length !== 0 &&
      filterWord !== undefined &&
      filterWord !== ''
    ) {
      let newList = supTokenNoBalanceList.filter(el =>
        el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
      )
      setSupTokenList(newList)

      newList = balanceList.filter(el =>
        el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
      )
      setBalanceTokenList(newList)
    }
    if (filterWord === '') {
      setSupTokenList(supTokenNoBalanceList)
      setBalanceTokenList(balanceList)
    }
  }, [filterWord, supTokenNoBalanceList, balanceList]) // eslint-disable-line react-hooks/exhaustive-deps

  const { widoDepoTokenListActiveColor, widoDepoTokenListHoverColor, fontColor } = useThemeContext()
  // const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const count =
      defaultToken &&
      !(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)
        ? 1
        : 0 +
          (balanceList && balanceList.length) +
          (supTokenNoBalanceList && supTokenNoBalanceList.length) +
          (soonToSupList && soonToSupList.length)
    if (count > 0) {
      setShowList(true)
    }
  }, [defaultToken, balanceList, supTokenNoBalanceList, soonToSupList])

  return (
    <>
      {showList ? (
        <Content>
          {defaultToken &&
            !(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object) && (
              <>
                <Label>Default deposit token </Label>
                <Container
                  onClick={() => {
                    handleDefaultToken()
                  }}
                  hoverColor={widoDepoTokenListHoverColor}
                  activeColor={widoDepoTokenListActiveColor}
                >
                  <img src={defaultToken.logoURI} width={37} height={37} alt="" />
                  <Vault>
                    <Text weight={500} color="#101828">
                      {defaultToken.symbol}
                    </Text>
                    <Text weight={400} color="#475467">
                      {defaultToken.balance
                        ? `${1 * fromWei(defaultToken.balance, defaultToken.decimals)}`
                        : '0.00'}
                    </Text>
                  </Vault>
                </Container>
              </>
            )}
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
          {supTokenList.length > 0 && (
            <>
              <Label>Other supported deposit tokens, which you don’t have on your wallet</Label>
              {supTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clicksupTokenNoBalanceListId ? 'active' : ''}
                  onClick={() => {
                    handleSupTokenNoBalanceListClick(i)
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
          {soonToSupList.length > 0 && (
            <>
              <Label>Soon to be supported</Label>
              {balanceList.map((data, i) => (
                <Container
                  key={i}
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
