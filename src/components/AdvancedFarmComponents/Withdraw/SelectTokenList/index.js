import React, { useEffect, useState } from 'react'
import { PiQuestion } from 'react-icons/pi'
import { fromWei } from '../../../../services/viem'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { formatNumberWido, showTokenBalance } from '../../../../utilities/formats'
import {
  Container,
  Text,
  RightText,
  TextSpan,
  Vault,
  Content,
  EmptyContainer,
  Label,
  BadgeRow,
  OneWayBadge,
  OneWayTooltip,
} from './style'
import AnimatedDots from '../../../AnimatedDots'
import TokenLogo from '../../../TokenLogo'
import { useWallet } from '../../../../providers/Wallet'
import { usePortals } from '../../../../providers/Portals'
import { useRate } from '../../../../providers/Rate'

const SelectTokenList = ({
  balanceList,
  supTokenNoBalanceList,
  defaultToken,
  nativeExitToken,
  soonToSupList,
  setPickedToken,
  setSelectToken,
  filterWord,
  supportedVault,
  hasPortalsError,
}) => {
  const { darkMode, fontColor, fontColor2, hoverColor, activeColorModal } = useThemeContext()
  const [showList, setShowList] = useState(false)
  const [curSupportedVault, setCurSupportedVault] = useState(supportedVault)
  const { chainId } = useWallet()
  const { getPortalsToken } = usePortals()
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

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

  const handleNativeExitToken = () => {
    setClickBalanceListId(-1)
    setClickSupTokenNoBalanceListId(-1)
    setPickedToken(nativeExitToken)
    setSelectToken(false)
  }
  const nativeExitFilterWord = (filterWord || '').toLowerCase().trim()
  const showNativeExit =
    !!nativeExitToken &&
    (nativeExitFilterWord === '' ||
      nativeExitToken.symbol.toLowerCase().includes(nativeExitFilterWord) ||
      (nativeExitToken.address && nativeExitToken.address.toLowerCase() === nativeExitFilterWord))

  const showDefaultToken =
    !!defaultCurToken &&
    !(Object.keys(defaultCurToken).length === 0 && defaultCurToken.constructor === Object)

  useEffect(() => {
    const fetch = async () => {
      if (supTokenNoBalanceList && balanceList && filterWord !== undefined && filterWord !== '') {
        const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/
        if (ethereumAddressRegex.test(filterWord)) {
          let TokenDetail = {},
            defaultTokenInvolve = false,
            balanceListInvolve = false
          try {
            TokenDetail = (await getPortalsToken(chainId, filterWord)) || {}
          } catch (e) {
            TokenDetail = {}
          }
          if (Object.keys(TokenDetail).length !== 0) {
            TokenDetail = {
              ...TokenDetail,
              logoURI: TokenDetail.image,
              balance: 0,
              default: false,
              usdValue: 0,
              usdPrice: TokenDetail.price,
              chainId,
            }
          }
          if (Object.keys(TokenDetail).length !== 0) {
            setCurSupportedVault(true)
            if (!(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)) {
              if (defaultToken.symbol.includes(TokenDetail.symbol.toLowerCase().trim())) {
                defaultTokenInvolve = true
                setDefaultCurToken(defaultToken)
              } else {
                setDefaultCurToken(null)
              }
            }
            if (balanceList.length !== 0) {
              const newList = balanceList.filter(el =>
                el.symbol.toLowerCase().includes(TokenDetail.symbol.toLowerCase().trim()),
              )
              if (newList.length > 0) {
                balanceListInvolve = true
              }
              setBalanceTokenList(newList)
            }
            if (defaultCurToken === null) {
              const newList = balanceList.filter(el =>
                el.symbol.toLowerCase().includes(TokenDetail.symbol.toLowerCase().trim()),
              )
              if (newList.length === 0) setSupTokenList([TokenDetail])
              else setSupTokenList([])
            } else {
              setSupTokenList([])
            }
            if (supTokenNoBalanceList.length !== 0 && !defaultTokenInvolve && !balanceListInvolve) {
              const newList = supTokenNoBalanceList.filter(el =>
                el.symbol.toLowerCase().includes(TokenDetail.symbol.toLowerCase().trim()),
              )
              if (newList.length > 0) {
                setSupTokenList(newList)
              } else {
                setSupTokenList([TokenDetail])
              }
            }
          } else {
            setSupTokenList([])
            if (!(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)) {
              setDefaultCurToken(null)
            }
            setBalanceTokenList([])
          }
        } else {
          if (supTokenNoBalanceList.length !== 0) {
            const newList = supTokenNoBalanceList.filter(el =>
              el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
            )
            setSupTokenList(newList)
          }
          if (
            defaultToken &&
            !(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)
          ) {
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
      }
      if (filterWord === '') {
        setSupTokenList(supTokenNoBalanceList)
        setBalanceTokenList(balanceList)
        setDefaultCurToken(defaultToken)
      }
    }
    fetch()
  }, [filterWord, supTokenNoBalanceList, balanceList])

  useEffect(() => {
    const count =
      defaultToken &&
      !(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)
        ? 1
        : 0 +
          (balanceList && balanceList.length) +
          (supTokenNoBalanceList && supTokenNoBalanceList.length) +
          (soonToSupList && soonToSupList.length)
    if (count > 0 || nativeExitToken) {
      setShowList(true)
    }
  }, [defaultToken, balanceList, supTokenNoBalanceList, soonToSupList, nativeExitToken])

  return (
    <>
      {showList ? (
        <Content>
          {showDefaultToken && (
            <>
              <Label $fontcolor={fontColor} $padding="15px 24px 0px">
                Default token to revert to{' '}
              </Label>
              <Container
                onClick={() => {
                  handleDefaultToken()
                }}
                $hovercolor={hoverColor}
                $activecolor={activeColorModal}
              >
                <TokenLogo src={defaultCurToken.logoURI} symbol={defaultCurToken.symbol} />
                <Vault>
                  <Text $weight={600} $fontcolor={fontColor2}>
                    {defaultCurToken.symbol}
                  </Text>
                  <RightText $weight={600} $fontcolor={fontColor2}>
                    <>{defaultCurToken.balance ? showTokenBalance(defaultCurToken.balance) : '0'}</>
                    <TextSpan $fontcolor2={fontColor2}>
                      {defaultCurToken.usdValue
                        ? `${currencySym}${(
                            defaultCurToken.usdValue * Number(currencyRate)
                          ).toFixed(2)}`
                        : `${currencySym}0`}
                    </TextSpan>
                  </RightText>
                </Vault>
              </Container>
            </>
          )}
          {showNativeExit && (
            <>
              <Label $fontcolor={fontColor} $padding="15px 24px 0px">
                Exit to the native strategy token
              </Label>
              <Container
                onClick={() => {
                  handleNativeExitToken()
                }}
                $hovercolor={hoverColor}
                $activecolor={activeColorModal}
              >
                <TokenLogo src={nativeExitToken.logoURI} symbol={nativeExitToken.symbol} />
                <Vault>
                  <BadgeRow>
                    <Text $weight={600} $fontcolor={fontColor2}>
                      {nativeExitToken.symbol}
                    </Text>
                    <OneWayBadge
                      $bordercolor={darkMode ? '#475467' : '#d0d5dd'}
                      $bgcolor={darkMode ? '#1f242f' : '#f9fafb'}
                      $fontcolor={darkMode ? '#cecfd2' : '#475467'}
                      onClick={e => e.stopPropagation()}
                    >
                      ONE-WAY
                      <PiQuestion className="badge-question" data-tip id="native-exit-oneway" />
                      <OneWayTooltip
                        id="native-exit-oneway"
                        anchorSelect="#native-exit-oneway"
                        backgroundColor={darkMode ? 'white' : '#101828'}
                        borderColor={darkMode ? 'white' : 'black'}
                        textColor={darkMode ? 'black' : 'white'}
                        place="top"
                        clickable
                      >
                        {nativeExitToken.oneWayText}
                      </OneWayTooltip>
                    </OneWayBadge>
                  </BadgeRow>
                  <RightText $weight={600} $fontcolor={fontColor2}>
                    <>{nativeExitToken.balance ? showTokenBalance(nativeExitToken.balance) : '0'}</>
                    <TextSpan $fontcolor2={fontColor2}>
                      {nativeExitToken.usdValue
                        ? `${currencySym}${formatNumberWido(
                            nativeExitToken.usdValue * Number(currencyRate),
                            2,
                          )}`
                        : `${currencySym}0`}
                    </TextSpan>
                  </RightText>
                </Vault>
              </Container>
            </>
          )}
          {!hasPortalsError && balanceTokenList.length > 0 && (
            <>
              <Label $fontcolor={fontColor} $padding="15px 24px 0px">
                {curSupportedVault
                  ? 'Tokens in your wallet which you can revert fTokens into'
                  : 'Soon to be supported'}
              </Label>
              {balanceTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clickBalanceListId ? 'active' : ''}
                  onClick={() => {
                    if (curSupportedVault) handleBalanceListClick(i)
                  }}
                  cursor={curSupportedVault ? 'pointer' : 'not-allowed'}
                  $hovercolor={hoverColor}
                  $activecolor={activeColorModal}
                >
                  <TokenLogo src={data.logoURI} symbol={data.symbol} />
                  <Vault>
                    <Text $weight={600} $fontcolor={fontColor2}>
                      {data.symbol}
                    </Text>
                    <RightText $weight={600} $fontcolor={fontColor2}>
                      <>{data.balance ? showTokenBalance(data.balance) : '0'}</>
                      <TextSpan $fontcolor2={fontColor2}>
                        {data.usdValue
                          ? `${currencySym}${formatNumberWido(
                              data.usdValue * Number(currencyRate),
                              2,
                            )}`
                          : `${currencySym}0`}
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
                $fontcolor={fontColor}
                $padding="15px 24px 0px"
                $showlabel={curSupportedVault ? 'block' : 'none'}
              >
                Other supported tokens, which you can revert to{' '}
              </Label>
              {supTokenList.map((data, i) => (
                <Container
                  key={i}
                  className={i === clicksupTokenNoBalanceListId ? 'active' : ''}
                  onClick={() => {
                    if (curSupportedVault) handleSupTokenNoBalanceListClick(i)
                  }}
                  cursor={curSupportedVault ? 'pointer' : 'not-allowed'}
                  $hovercolor={hoverColor}
                  $activecolor={activeColorModal}
                >
                  <TokenLogo src={data.logoURI} symbol={data.symbol} />
                  <Vault>
                    <Text $weight={600} $fontcolor={fontColor2}>
                      {data.symbol}
                    </Text>
                    <RightText $weight={600} $fontcolor={fontColor2}>
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan $fontcolor2={fontColor2}>{`${currencySym}0`}</TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              ))}
            </>
          )}
          {!hasPortalsError && soonToSupList.length > 0 && (
            <>
              <Label $fontcolor={fontColor} $padding="15px 24px 0px">
                Soon to be supported
              </Label>
              {soonToSupList.map((data, i) => (
                <Container key={i} $hovercolor={hoverColor} $activecolor={activeColorModal}>
                  <TokenLogo src={data.logoURI} symbol={data.symbol} />
                  <Vault>
                    <Text $weight={600} $fontcolor={fontColor2}>
                      {data.symbol}
                    </Text>
                    <RightText $weight={600} $fontcolor={fontColor2}>
                      <>{data.balance ? `${1 * fromWei(data.balance, data.decimals)}` : '0.00'}</>
                      <TextSpan $fontcolor2={fontColor2}>{`${currencySym}0`}</TextSpan>
                    </RightText>
                  </Vault>
                </Container>
              ))}
            </>
          )}
          {!showDefaultToken &&
            !showNativeExit &&
            supTokenList.length === 0 &&
            balanceTokenList.length === 0 &&
            Object.keys(soonToSupList).length === 0 &&
            filterWord !== '' && (
              <EmptyContainer $fontcolor={fontColor} cursor="not-allowed">
                Not Found
              </EmptyContainer>
            )}
        </Content>
      ) : (
        <EmptyContainer $fontcolor={fontColor}>
          Loading Token list
          <AnimatedDots />
        </EmptyContainer>
      )}
    </>
  )
}
export default SelectTokenList
