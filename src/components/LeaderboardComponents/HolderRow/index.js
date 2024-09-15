import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Content, DetailView, FlexDiv, ContentInner } from './style'
import { useThemeContext } from '../../../providers/useThemeContext'
import ListItem from '../ListItem'
import { truncateAddress, formatNumber } from '../../../utilities/formats'
import { useRate } from '../../../providers/Rate'

const HolderRow = ({ value, cKey, accounts, groupOfVaults }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { borderColor, hoverColor, fontColor1 } = useThemeContext()
  const [currencySym, setCurrencySym] = useState('$')
  const { rates } = useRate()

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
    }
  }, [rates])

  const getTokenNames = (userVault, dataVaults) => {
    const vaults = userVault.vaults
    const tokenNames = []

    Object.entries(vaults).forEach(([vaultKey]) => {
      Object.entries(dataVaults).forEach(([, vaultData]) => {
        if (vaultData.vaultAddress) {
          if (vaultData.vaultAddress.toLowerCase() === vaultKey.toLowerCase()) {
            if (vaultData.tokenNames.length > 1) {
              tokenNames.push(vaultData.tokenNames.join(', '))
            } else {
              tokenNames.push(...vaultData.tokenNames)
            }
          }
        }
      })
    })

    return tokenNames
  }

  const matchedTokenNames = getTokenNames(value, groupOfVaults)

  return (
    <DetailView borderColor={borderColor} hoverColor={hoverColor} key={cKey}>
      <FlexDiv padding={isMobile ? '10px' : '0'}>
        <Content width={isMobile ? '100%' : '100%'} display={isMobile ? 'block' : 'flex'}>
          <ContentInner width={isMobile ? '100%' : '5%'} display={isMobile ? 'block' : 'flex'}>
            {cKey + 1}
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            <ListItem
              weight={600}
              size={isMobile ? 12 : 14}
              height={isMobile ? 18 : 20}
              marginTop={isMobile ? 10 : 0}
              color={fontColor1}
              value={truncateAddress(accounts)}
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '20%'}>
            <ListItem
              weight={600}
              size={isMobile ? 12 : 14}
              height={isMobile ? 18 : 20}
              marginTop={isMobile ? 10 : 0}
              color={fontColor1}
              value={formatNumber(value.totalBalance, 2)}
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '20%'}>
            {matchedTokenNames.map((vaultKey, i) => {
              return (
                <ListItem
                  key={i}
                  value={vaultKey}
                  weight={600}
                  size={isMobile ? 12 : 14}
                  height={isMobile ? 18 : 20}
                  marginTop={isMobile ? 10 : 0}
                  color={fontColor1}
                />
              )
            })}
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '30%'}>
            {Object.entries(value.vaults)
              .slice(0, 1)
              .map(([vaultKey, vaultValue]) => {
                return (
                  <ListItem
                    key={vaultKey}
                    value={matchedTokenNames[0]}
                    weight={600}
                    size={isMobile ? 12 : 14}
                    height={isMobile ? 18 : 20}
                    marginTop={isMobile ? 10 : 0}
                    color={fontColor1}
                    vaultValue={formatNumber(vaultValue.balance, 2)}
                  />
                )
              })}
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '10%'}>
            <ListItem
              weight={600}
              size={isMobile ? 12 : 14}
              height={isMobile ? 18 : 20}
              marginTop={isMobile ? 10 : 0}
              color={fontColor1}
              value={`${currencySym}${formatNumber(value.totalDailyYield, 2)}`}
            />
          </ContentInner>
        </Content>
      </FlexDiv>
    </DetailView>
  )
}

export default HolderRow
