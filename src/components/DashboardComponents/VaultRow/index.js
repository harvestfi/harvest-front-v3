import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { get } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import ListItem from '../ListItem'
import { displayAPY, formatNumber, formatNumberWido } from '../../../utilities/formats'
import { useThemeContext } from '../../../providers/useThemeContext'
import { chainList, directDetailUrl } from '../../../constants'
import { useRate } from '../../../providers/Rate'
import File from '../../../assets/images/logos/dashboard/file-02.svg'
import MobileFile from '../../../assets/images/logos/dashboard/file-01.svg'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import { BadgeIcon, Content, DetailView, FlexDiv, LogoImg, Img, ContentInner } from './style'
import { BadgeIcon, Content, DetailView, FlexDiv, LogoImg, ContentInner } from './style'

const VaultRow = ({ info, firstElement, lastElement, cKey }) => {
  const { push } = useHistory()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const {
    switchMode,
    backColor,
    borderColorTable,
    hoverColorRow,
    fontColor1,
    fontColor,
  } = useThemeContext()

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const boostedToken = get(info, 'boosted')

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  return (
    <DetailView
      className="position-row"
      firstElement={firstElement}
      lastElement={lastElement}
      borderColor={borderColorTable}
      hoverColor={hoverColorRow}
      key={cKey}
      mode={switchMode}
      background={backColor}
      onClick={() => {
        let badgeId = -1
        const token = info.token
        const chain = token.chain || token.data.chain
        chainList.forEach((obj, j) => {
          if (obj.chainId === Number(chain)) {
            badgeId = j
          }
        })
        const isSpecialVault = token.liquidityPoolVault || token.poolVault
        const network = chainList[badgeId].name.toLowerCase()
        const address = isSpecialVault
          ? token.data.collateralAddress
          : token.vaultAddress || token.tokenAddress
        push(`${directDetailUrl + network}/${address}?from=portfolio`)
      }}
    >
      <FlexDiv padding={isMobile ? '10px 15px 15px 15px' : '0'}>
        <Content width={isMobile ? '100%' : '40%'} display={isMobile ? 'block' : 'flex'}>
          <ContentInner width={isMobile ? '100%' : '50%'} display={isMobile ? 'block' : 'flex'}>
            <BadgeIcon
              borderColor={info.status === 'Active' ? '#29ce84' : 'orange'}
              className="network-badge"
            >
              <img src={info.chain ? info.chain : ETHEREUM} width="15px" height="15px" alt="" />
            </BadgeIcon>
            {info.logos.length > 0 &&
              info.logos.map((elem, index) => (
                <LogoImg
                  key={index}
                  className="coin"
                  marginLeft={index === 0 ? '' : '-7px'}
                  src={elem}
                  alt=""
                />
              ))}
          </ContentInner>
          <ContentInner width={isMobile ? '100%' : '50%'} marginLeft={isMobile ? '0px' : '11px'}>
            <ListItem
              weight={500}
              size={12}
              height={18}
              value={info.symbol}
              marginTop={isMobile ? 15 : 0}
              color={fontColor1}
            />
            <ListItem weight={400} size={12} height={18} value={info.platform} color={fontColor} />
          </ContentInner>
        </Content>
        <Content width={isMobile ? '25%' : '15%'} marginTop={isMobile ? '15px' : 'unset'}>
          {isMobile && (
            <ListItem color={fontColor} weight={500} size={12} height={18} value="Balance" />
          )}
          <ListItem
            color={boostedToken ? '#FD7300' : isMobile ? fontColor1 : fontColor}
            weight={500}
            size={14}
            height={20}
            value={
              info.apy === -1
                ? 'Inactive'
                : Number.isNaN(info.apy)
                ? '-'
                : `${displayAPY(info.apy)}`
            }
            boostedToken={boostedToken}
          />
        </Content>
        {isMobile && (
          <>
            <Content width={isMobile ? '33%' : '11%'} marginTop={isMobile ? '15px' : 'unset'}>
              <ListItem color={fontColor} weight={500} size={12} height={18} value="My Balance" />
              <ListItem
                weight={500}
                size={14}
                height={20}
                color={fontColor1}
                value={`${
                  info.balance === 0
                    ? `${currencySym}0.00`
                    : info.balance < 0.01
                    ? `<${currencySym}0.01`
                    : `${currencySym}${formatNumber(info.balance * Number(currencyRate), 2)}`
                }`}
              />
            </Content>
            <Content width={isMobile ? '33%' : '11%'} marginTop={isMobile ? '15px' : 'unset'}>
              <ListItem color={fontColor} weight={500} size={12} height={18} value="Rewards" />
              <ListItem
                weight={500}
                size={14}
                height={20}
                color={fontColor1}
                value={`${
                  info.totalRewardUsd === 0
                    ? `${currencySym}0.00`
                    : info.totalRewardUsd < 0.01
                    ? `<${currencySym}0.01`
                    : `${currencySym}${formatNumberWido(
                        info.totalRewardUsd * Number(currencyRate),
                        2,
                      )}`
                }`}
              />
            </Content>
          </>
        )}
        {!isMobile && (
          <Content width={isMobile ? '33%' : '11%'}>
            <ListItem
              weight={500}
              size={14}
              height={20}
              color={fontColor}
              value={`${
                info.balance === 0
                  ? `${currencySym}0.00`
                  : info.balance < 0.01
                  ? `<${currencySym}0.01`
                  : `${currencySym}${formatNumber(info.balance * Number(currencyRate), 2)}`
              }`}
            />
          </Content>
        )}
        <Content width={isMobile ? '33%' : '11%'} marginTop={isMobile ? '15px' : 'unset'}>
          {isMobile && (
            <ListItem color={fontColor} weight={500} size={12} height={18} value="Monthly Yield" />
          )}
          <ListItem
            weight={500}
            size={12}
            height={18}
            color={isMobile ? fontColor1 : fontColor}
            value={`${
              info.lifetimeYield === 0
                ? `${currencySym}0.00`
                : info.lifetimeYield < 0.01
                ? `<${currencySym}0.01`
                : `${currencySym}${formatNumber(info.lifetimeYield * Number(currencyRate), 2)}`
            }`}
          />
        </Content>
        <Content width={isMobile ? '25%' : '15%'} marginTop={isMobile ? '15px' : 'unset'}>
          {isMobile && (
            <ListItem color={fontColor} weight={500} size={12} height={18} value="Rewards" />
          )}
          <ListItem
            weight={500}
            size={12}
            height={18}
            color={isMobile ? fontColor1 : fontColor}
            value={`${
              info.totalRewardUsd === 0
                ? `${currencySym}0.00`
                : info.totalRewardUsd < 0.01
                ? `<${currencySym}0.01`
                : `${currencySym}${formatNumberWido(info.totalRewardUsd * Number(currencyRate), 2)}`
            }`}
          />
        </Content>
        <Content width={isMobile ? '25%' : '15%'} marginTop={isMobile ? '15px' : 'unset'}>
          {isMobile && (
            <ListItem color={fontColor} weight={500} size={12} height={18} value="Live APY" />
          )}
          <ListItem
            weight={500}
            size={12}
            height={18}
            color={isMobile ? fontColor1 : fontColor}
            value={
              info.apy === -1
                ? 'Inactive'
                : Number.isNaN(info.apy)
                ? '-'
                : `${displayAPY(info.apy)}`
            }
          />
        </Content>
      </FlexDiv>
    </DetailView>
  )
}
export default VaultRow
