import React, { useEffect, useState } from 'react'
// import { useMediaQuery } from 'react-responsive'
import { fromWei } from '../../../../services/web3'
import { useThemeContext } from '../../../../providers/useThemeContext'
import {
  Container,
  Text,
  RightText,
  TextSpan,
  Vault,
  Content,
  EmptyContainer,
  Label,
} from './style'
import AnimatedDots from '../../../AnimatedDots'

const SelectTokenList = ({
  balanceList,
  supTokenNoBalanceList,
  defaultToken,
  soonToSupList,
  setPickedToken,
  setSelectToken,
  setPartHeight,
  filterWord,
}) => {
  const [showList, setShowList] = useState(false)

  const [supTokenList, setSupTokenList] = useState(supTokenNoBalanceList)
  const [clicksupTokenNoBalanceListId, setClickSupTokenNoBalanceListId] = useState(-1)
  const handleSupTokenNoBalanceListClick = id => {
    setClickSupTokenNoBalanceListId(id)
    setPickedToken(supTokenList[id])
    setSelectToken(false)
    setPartHeight(null)
  }

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
    setClickSupTokenNoBalanceListId(-1)
    setPickedToken(defaultToken)
    setSelectToken(false)
    setPartHeight(null)
  }
  const [defaultCurToken, setDefaultCurToken] = useState(defaultToken)

  useEffect(() => {
    if (supTokenNoBalanceList && balanceList && filterWord !== undefined && filterWord !== '') {
      if (supTokenNoBalanceList.length !== 0) {
        const newList = supTokenNoBalanceList.filter(el =>
          el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
        )
        setSupTokenList(newList)
      }
      if (!(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)) {
        if (defaultToken.symbol.includes(filterWord.toLowerCase().trim())) {
          setDefaultCurToken(defaultToken)
        } else {
          setDefaultCurToken(null)
        }
      }

      if (balanceList.length !== 0) {
        const newList = balanceList.filter(el =>
          el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
        )
        setBalanceTokenList(newList)
      }
    }
    if (filterWord === '') {
      setSupTokenList(supTokenNoBalanceList)
      setBalanceTokenList(balanceList)
      setDefaultCurToken(defaultToken)
    }
  }, [filterWord, supTokenNoBalanceList, balanceList]) // eslint-disable-line react-hooks/exhaustive-deps

  const { fontColor } = useThemeContext()
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
          {defaultCurToken &&
            !(
              Object.keys(defaultCurToken).length === 0 && defaultCurToken.constructor === Object
            ) && (
              <>
                <Label padding="15px 24px 0px">Default token to revert to </Label>
                <Container
                  onClick={() => {
                    handleDefaultToken()
                  }}
                  hoverColor="#F2F5FF"
                  activeColor="#ECFDF3"
                >
                  <img src={defaultCurToken.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color="#344054">
                      {defaultCurToken.symbol}
                    </Text>
                    <RightText weight={600} color="#344054">
                      <>
                        {defaultCurToken.balance
                          ? `${1 * fromWei(defaultCurToken.balance, defaultCurToken.decimals)}`
                          : '0.00'}
                      </>
                      <TextSpan>$0</TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              </>
            )}
          {balanceTokenList.length > 0 && (
            <>
              <Label padding="0px 24px">
                Tokens in your wallet which you can revert fTokens into
              </Label>
              {balanceTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clickBalanceListId ? 'active' : ''}
                  onClick={() => {
                    handleBalanceListClick(i)
                  }}
                  hoverColor="#F2F5FF"
                  activeColor="#ECFDF3"
                >
                  <img src={data.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color="#344054">
                      {data.symbol}
                    </Text>
                    <RightText weight={600} color="#344054">
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan>$0</TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              ))}
            </>
          )}
          {supTokenList.length > 0 && (
            <>
              <Label padding="0px 24px">Other supported tokens, which you can revert to </Label>
              {supTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clicksupTokenNoBalanceListId ? 'active' : ''}
                  onClick={() => {
                    handleSupTokenNoBalanceListClick(i)
                  }}
                  hoverColor="#F2F5FF"
                  activeColor="#ECFDF3"
                >
                  <img src={data.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color="#344054">
                      {data.symbol}
                    </Text>
                    <RightText weight={600} color="#344054">
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan>$0</TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              ))}
            </>
          )}
          {soonToSupList.length > 0 && (
            <>
              <Label padding="0px 24px">Soon to be supported</Label>
              {soonToSupList.map((data, i) => (
                <Container key={i} hoverColor="#F2F5FF" activeColor="#ECFDF3">
                  <img src={data.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color="#344054">
                      {data.symbol}
                    </Text>
                    <RightText weight={600} color="#344054">
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan>$0</TextSpan>
                    </RightText>
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
