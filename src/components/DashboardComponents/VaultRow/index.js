import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import ListItem from '../ListItem'
import { formatNumber, formatNumberWido } from '../../../utilities/formats'
import { useThemeContext } from '../../../providers/useThemeContext'
import { directDetailUrl } from '../../../constants'
import { useRate } from '../../../providers/Rate'
import File from '../../../assets/images/logos/dashboard/file-02.svg'
import MobileFile from '../../../assets/images/logos/dashboard/file-01.svg'
import { BadgeIcon, Content, DetailView, FlexDiv, LogoImg, Img, ContentInner } from './style'

const chainList = [
  { id: 1, name: 'Ethereum', chainId: 1 },
  { id: 2, name: 'Polygon', chainId: 137 },
  { id: 3, name: 'Arbitrum', chainId: 42161 },
  { id: 4, name: 'Base', chainId: 8453 },
]

const VaultRow = ({ info, firstElement, lastElement, showDetail, setShowDetail, cKey }) => {
  const { push } = useHistory()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const {
    switchMode,
    backColor,
    bgColorButton,
    borderColor,
    hoverColor,
    activeColor,
    fontColor1,
    fontColor,
  } = useThemeContext()

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  return (
    <DetailView
      firstElement={firstElement}
      lastElement={lastElement}
      borderColor={borderColor}
      hoverColor={hoverColor}
      key={cKey}
      mode={switchMode}
      background={showDetail[cKey] ? activeColor : backColor}
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
      <FlexDiv padding={isMobile ? '10px' : '0'}>
        <Content width={isMobile ? '100%' : '40%'} display={isMobile ? 'block' : 'flex'}>
          <ContentInner width={isMobile ? '100%' : '50%'} display={isMobile ? 'block' : 'flex'}>
            <BadgeIcon
              borderColor={info.status === 'Active' ? '#29ce84' : 'orange'}
              className="network-badge"
            >
              <img src={info.chain} width="15px" height="15px" alt="" />
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
              size={isMobile ? 14 : 14}
              height={isMobile ? 20 : 20}
              value={info.symbol}
              marginTop={isMobile ? 15 : 0}
              color={fontColor1}
            />
            <ListItem
              weight={400}
              size={isMobile ? 14 : 14}
              height={isMobile ? 20 : 20}
              value={info.platform}
              color={fontColor}
            />
          </ContentInner>
        </Content>
        <Content width={isMobile ? '33%' : '11%'} marginTop={isMobile ? '15px' : 'unset'}>
          {isMobile && (
            <ListItem color={fontColor} weight={500} size={12} height={18} value="Live APY" />
          )}
          <ListItem
            color={isMobile ? fontColor1 : fontColor}
            weight={500}
            size={14}
            height={20}
            value={
              info.apy === -1
                ? 'Inactive'
                : Number.isNaN(info.apy)
                ? '-'
                : `${formatNumberWido(info.apy, 2)}%`
            }
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
            size={14}
            height={20}
            color={isMobile ? fontColor1 : fontColor}
            value={`${
              info.monthlyYield === 0
                ? `${currencySym}0.00`
                : info.monthlyYield < 0.01
                ? `<${currencySym}0.01`
                : `${currencySym}${formatNumber(info.monthlyYield * Number(currencyRate), 2)}`
            }`}
          />
        </Content>
        <Content width={isMobile ? '33%' : '11%'} marginTop={isMobile ? '15px' : 'unset'}>
          {isMobile && (
            <ListItem color={fontColor} weight={500} size={12} height={18} value="Daily Yield" />
          )}
          <ListItem
            weight={500}
            size={14}
            height={20}
            color={isMobile ? fontColor1 : fontColor}
            value={`${
              info.dailyYield === 0
                ? `${currencySym}0.00`
                : info.dailyYield < 0.01
                ? `<${currencySym}0.01`
                : `${currencySym}${formatNumber(info.dailyYield * Number(currencyRate), 2)}`
            }`}
          />
        </Content>
        {!isMobile && (
          <Content width={isMobile ? '33%' : '11%'}>
            <ListItem
              weight={500}
              size={14}
              height={20}
              color={fontColor}
              value={`${
                info.totalRewardUsd === 0
                  ? `${currencySym}0.00`
                  : info.totalRewardUsd < 0.01
                  ? `<${currencySym}0.01`
                  : `${currencySym}${formatNumber(info.totalRewardUsd * Number(currencyRate), 2)}`
              }`}
            />
          </Content>
        )}
        <Content
          onClick={event => {
            event.stopPropagation()
            const updatedShowDetail = [...showDetail]
            updatedShowDetail[cKey] = !updatedShowDetail[cKey]
            setShowDetail(updatedShowDetail)
          }}
          width={isMobile ? '5%' : '5%'}
          cursor="pointer"
          className={isMobile && 'mobile-extender'}
          backColor={backColor}
          bgColorButton={bgColorButton}
          borderColor={borderColor}
        >
          {showDetail[cKey] ? (
            <img src={isMobile ? MobileFile : File} className="active-file-icon" alt="file" />
          ) : (
            <img src={isMobile ? MobileFile : File} className="file-icon" alt="file" />
          )}
        </Content>
      </FlexDiv>
      {showDetail[cKey] && (
        <FlexDiv padding={isMobile ? '0px 10px 10px' : '16px 0'}>
          <Content width={isMobile ? '100%' : '40%'} display={isMobile ? 'flex' : 'flex'}>
            <ContentInner width={isMobile ? '33%' : '50%'}>
              <ListItem
                weight={600}
                size={isMobile ? 12 : 14}
                height={isMobile ? 18 : 20}
                value="Unstaked"
                marginTop={isMobile ? 10 : 0}
                color={fontColor1}
              />
              <ListItem
                weight={500}
                size={isMobile ? 14 : 14}
                height={isMobile ? 20 : 20}
                value={info.unstake === 0 ? '0.00' : `${formatNumberWido(info.unstake, 6)}`}
                color={fontColor}
              />
            </ContentInner>
            <ContentInner width={isMobile ? '33%' : '50%'} marginLeft={isMobile ? '0px' : '11px'}>
              <ListItem
                weight={600}
                size={isMobile ? 12 : 14}
                height={isMobile ? 18 : 20}
                value="Staked"
                marginTop={isMobile ? 10 : 0}
                color={fontColor1}
              />
              <ListItem
                weight={500}
                size={isMobile ? 14 : 14}
                height={isMobile ? 20 : 20}
                value={info.stake === 0 ? '0.00' : `${formatNumberWido(info.stake, 6)}`}
                color={fontColor}
              />
            </ContentInner>
          </Content>
          {isMobile && (
            <Content width={isMobile ? '100%' : '11%'} display={isMobile ? 'flex' : 'block'}>
              <ListItem
                weight={600}
                size={isMobile ? 12 : 14}
                height={isMobile ? 18 : 20}
                value={isMobile ? 'Rewards Breakdown' : 'Rewards'}
                marginTop={isMobile ? 15 : 0}
                color={fontColor1}
              />
            </Content>
          )}
          {info.reward.map((rw, key) => (
            <Content
              key={key}
              width={isMobile ? '35%' : '15%'}
              display="flex"
              marginTop={isMobile ? '15px' : 'unset'}
            >
              <Img src={`/icons/${info.rewardSymbol[key].toLowerCase()}.svg`} alt="jeur" />
              <div>
                <ListItem
                  weight={isMobile ? 400 : 500}
                  size={isMobile ? 14 : 14}
                  height={isMobile ? 20 : 20}
                  value={`${info.reward[key] === 0 ? '0.00' : `${info.reward[key].toFixed(6)}`}`}
                  color={isMobile ? fontColor : fontColor1}
                />
                <ListItem
                  weight={400}
                  size={isMobile ? 14 : 14}
                  height={isMobile ? 20 : 20}
                  value={`${
                    info.rewardUSD[key] === 0
                      ? `${currencySym}0.00`
                      : info.rewardUSD[key] < 0.01
                      ? `<${currencySym}0.01`
                      : `${currencySym}${formatNumber(
                          info.rewardUSD[key] * Number(currencyRate),
                          2,
                        )}`
                  }`}
                  color={isMobile ? fontColor1 : fontColor}
                />
              </div>
            </Content>
          ))}
          <Content width={isMobile ? '20%' : '5%'} />
        </FlexDiv>
      )}
    </DetailView>
  )
}
export default VaultRow
