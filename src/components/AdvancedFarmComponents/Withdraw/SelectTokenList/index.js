import React, { useEffect, useState } from 'react'
import { fromWei } from '../../../../services/web3'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { formatNumberWido } from '../../../../utilities/formats'
import { WIDO_EXTEND_DECIMALS, WIDO_BALANCES_DECIMALS } from '../../../../constants'
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
  filterWord,
  supportedVault,
  hasPortalsError,
}) => {
  const { fontColor, fontColor2, hoverColor, activeColorModal } = useThemeContext()
  const [showList, setShowList] = useState(false)

  const [supTokenList, setSupTokenList] = useState(supTokenNoBalanceList)
  const [clicksupTokenNoBalanceListId, setClickSupTokenNoBalanceListId] = useState(-1)
  const handleSupTokenNoBalanceListClick = id => {
    setClickSupTokenNoBalanceListId(id)
    setPickedToken(supTokenList[id])
    setSelectToken(false)
  }

  // Supported token with balance in my wallet
  const [balanceTokenList, setBalanceTokenList] = useState(balanceList)
  const [clickBalanceListId, setClickBalanceListId] = useState(-1)
  const handleBalanceListClick = id => {
    setClickBalanceListId(id)
    setPickedToken(balanceTokenList[id])
    setSelectToken(false)
  }

  // Default Token
  const handleDefaultToken = () => {
    setClickBalanceListId(-1)
    setClickSupTokenNoBalanceListId(-1)
    setPickedToken(defaultToken)
    setSelectToken(false)
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
                <Label fontColor={fontColor} padding="15px 24px 0px">
                  Default token to revert to{' '}
                </Label>
                <Container
                  onClick={() => {
                    handleDefaultToken()
                  }}
                  hoverColor={hoverColor}
                  activeColor={activeColorModal}
                >
                  <img src={defaultCurToken.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color={fontColor2}>
                      {defaultCurToken.symbol}
                    </Text>
                    <RightText weight={600} color={fontColor2}>
                      <>{defaultCurToken.balance ? defaultCurToken.balance : '0.00'}</>
                      <TextSpan fontColor2={fontColor2}>
                        {defaultCurToken.usdValue ? `$${defaultCurToken.usdValue}` : '$0.00'}
                      </TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              </>
            )}
          {!hasPortalsError && balanceTokenList.length > 0 && (
            <>
              <Label fontColor={fontColor} padding="15px 24px 0px">
                {supportedVault
                  ? 'Tokens in your wallet which you can revert fTokens into'
                  : 'Soon to be supported'}
              </Label>
              {balanceTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clickBalanceListId ? 'active' : ''}
                  onClick={() => {
                    if (supportedVault) handleBalanceListClick(i)
                  }}
                  cursor={supportedVault ? 'pointer' : 'not-allowed'}
                  hoverColor={hoverColor}
                  activeColor={activeColorModal}
                >
                  <img src={data.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color={fontColor2}>
                      {data.symbol}
                    </Text>
                    <RightText weight={600} color={fontColor2}>
                      <>
                        {data.balance
                          ? `${formatNumberWido(data.balance, WIDO_EXTEND_DECIMALS)}`
                          : '0.00'}
                      </>
                      <TextSpan fontColor2={fontColor2}>
                        {data.usdValue
                          ? `$${formatNumberWido(data.usdValue, WIDO_BALANCES_DECIMALS)}`
                          : '$0.00'}
                      </TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              ))}
            </>
          )}
          {!hasPortalsError && supTokenList.length > 0 && (
            <>
              <Label
                fontColor={fontColor}
                padding="15px 24px 0px"
                showLabel={supportedVault ? 'block' : 'none'}
              >
                Other supported tokens, which you can revert to{' '}
              </Label>
              {supTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clicksupTokenNoBalanceListId ? 'active' : ''}
                  onClick={() => {
                    if (supportedVault) handleSupTokenNoBalanceListClick(i)
                  }}
                  cursor={supportedVault ? 'pointer' : 'not-allowed'}
                  hoverColor={hoverColor}
                  activeColor={activeColorModal}
                >
                  <img src={data.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color={fontColor2}>
                      {data.symbol}
                    </Text>
                    <RightText weight={600} color={fontColor2}>
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan fontColor2={fontColor2}>$0</TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              ))}
            </>
          )}
          {!hasPortalsError && soonToSupList.length > 0 && (
            <>
              <Label fontColor={fontColor} padding="15px 24px 0px">
                Soon to be supported
              </Label>
              {soonToSupList.map((data, i) => (
                <Container key={i} hoverColor={hoverColor} activeColor={activeColorModal}>
                  <img src={data.logoURI} width={26} height={26} alt="" />
                  <Vault>
                    <Text weight={600} color={fontColor2}>
                      {data.symbol}
                    </Text>
                    <RightText weight={600} color={fontColor2}>
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan fontColor2={fontColor2}>$0</TextSpan>
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
