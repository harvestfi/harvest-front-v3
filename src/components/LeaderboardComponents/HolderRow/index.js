import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { LuEye } from 'react-icons/lu'
import { get, find } from 'lodash'
import { Content, DetailView, FlexDiv, ContentInner, TopFiveText } from './style'
import { useThemeContext } from '../../../providers/useThemeContext'
import ARBITRUM from '../../../assets/images/chains/arbitrum.svg'
import BASE from '../../../assets/images/chains/base.svg'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import POLYGON from '../../../assets/images/logos/badge/polygon.svg'
import ZKSYNC from '../../../assets/images/logos/badge/zksync.svg'
import ListItem from '../ListItem'
import { truncateAddress, formatNumber } from '../../../utilities/formats'
import { useRate } from '../../../providers/Rate'
import { chainList } from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useVaults } from '../../../providers/Vault'
import { getTotalApy } from '../../../utilities/parsers'

const HolderRow = ({ value, cKey, accounts, groupOfVaults, lastItem, getTokenNames }) => {
  const [isExpand, setIsExpand] = useState(false)
  const [currencySym, setCurrencySym] = useState('$')

  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE, ZKSYNC]
  const networkNames = ['ethereum', 'polygon', 'arbitrum', 'base', 'zksync']
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  let vaultPool

  const { borderColor, hoverColor, fontColor1 } = useThemeContext()
  const { rates } = useRate()
  const { pools } = usePools()
  const { vaultsData } = useVaults()

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
    }
  }, [rates])

  const handleExpand = () => {
    setIsExpand(prev => !prev)
  }

  const monthlyYield = (value.totalDailyYield * 365) / 12
  const walletApy = (monthlyYield / value.totalBalance) * 12 * 100
  const allocationValue = (monthlyYield / value.totalBalance) * 12

  const matchedTokenNames = getTokenNames(value, groupOfVaults)

  const getPlatformName = vaultAddress => {
    const vaultData = Object.values(groupOfVaults).find(vault => {
      if (vault.vaultAddress && vaultAddress) {
        return vault.vaultAddress.toLowerCase() === vaultAddress.toLowerCase()
      }
      return false
    })
    const platformName = vaultData ? vaultData.platform : ''

    return platformName
  }

  const getBadgeId = vaultAddress => {
    const vaultData = Object.values(groupOfVaults).find(vault => {
      if (vault.vaultAddress && vaultAddress) {
        return vault.vaultAddress.toLowerCase() === vaultAddress.toLowerCase()
      }
      return false
    })
    const chain = vaultData ? vaultData.chain : ''

    for (let i = 0; i < chainList.length; i += 1) {
      if (chainList[i].chainId === Number(chain)) {
        return i
      }
    }
    return -1
  }

  const getVaultApy = (vaultKey, vaultsGroup) => {
    let token = null,
      tokenSymbol = null,
      specialVaultFlag = false

    if (vaultKey === '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651') {
      vaultKey = '0xa0246c9032bc3a600820415ae600c6388619a14d'
      specialVaultFlag = true
    }

    Object.entries(vaultsGroup).forEach(([key, vaultData]) => {
      if (specialVaultFlag && vaultData.data) {
        if (vaultData.data.collateralAddress.toLowerCase() === vaultKey.toLowerCase()) {
          token = vaultData
          tokenSymbol = key
        }
      } else if (
        vaultData.vaultAddress &&
        vaultData.vaultAddress.toLowerCase() === vaultKey.toLowerCase()
      ) {
        token = vaultData
        tokenSymbol = key
      }
    })

    const isSpecialVault = token.liquidityPoolVault || token.poolVault

    const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

    if (isSpecialVault) {
      vaultPool = token.data
    } else {
      vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
    }

    const totalApy = isSpecialVault
      ? getTotalApy(null, token, true)
      : getTotalApy(vaultPool, tokenVault)

    return totalApy
  }

  return (
    <DetailView
      borderColor={borderColor}
      hoverColor={hoverColor}
      key={cKey}
      lastItem={lastItem}
      onClick={() => {
        handleExpand()
      }}
    >
      <FlexDiv padding={isMobile ? '10px' : '0'}>
        <Content width={isMobile ? '100%' : '100%'} display={isMobile ? 'block' : 'flex'}>
          <ContentInner width={isMobile ? '100%' : '10%'} display={isMobile ? 'block' : 'flex'}>
            <ListItem
              weight={500}
              size={isMobile ? 12 : 14}
              marginTop={isMobile ? 10 : 0}
              color={fontColor1}
              value={`#${cKey}`}
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            <ListItem
              weight={400}
              size={isMobile ? 12 : 14}
              marginTop={isMobile ? 10 : 0}
              color={fontColor1}
              showAddress={truncateAddress(accounts)}
              addressValue={accounts}
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            <ListItem
              weight={400}
              size={isMobile ? 12 : 14}
              marginTop={isMobile ? 10 : 0}
              color="#475467"
              value={`${currencySym}${formatNumber(value.totalBalance, 2)}`}
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            <ListItem
              value={matchedTokenNames.length}
              weight={400}
              size={isMobile ? 12 : 14}
              marginTop={isMobile ? 10 : 0}
              color="#475467"
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            {Object.entries(value.vaults)
              .slice(0, 1)
              .map(([vaultKey, vaultValue]) => {
                return (
                  <React.Fragment key={vaultKey}>
                    <ListItem
                      value={`${currencySym}${formatNumber(vaultValue.balance, 2)}`}
                      weight={400}
                      size={isMobile ? 12 : 14}
                      marginTop={isMobile ? 10 : 0}
                      color="#5FCF76"
                    />
                    <ListItem
                      value={matchedTokenNames[0]}
                      weight={400}
                      size={isMobile ? 12 : 10}
                      marginTop={isMobile ? 10 : 0}
                      color="#6988FF"
                      platform={getPlatformName(vaultKey)}
                      chain={BadgeAry[getBadgeId(vaultKey)]}
                    />
                  </React.Fragment>
                )
              })}
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            <ListItem
              weight={400}
              size={isMobile ? 12 : 14}
              marginTop={isMobile ? 10 : 0}
              color="#5FCF76"
              value={
                walletApy > 0 && walletApy < 0.001
                  ? `<0.001% APY`
                  : `${formatNumber(walletApy, 2)}% APY`
              }
              allocationValue={allocationValue}
            />
            <ListItem
              weight={400}
              size={isMobile ? 12 : 10}
              marginTop={isMobile ? 10 : 0}
              color="#6988FF"
              value={`${currencySym}${formatNumber(allocationValue, 2)}/yr per $1 allocated`}
              allocationValue={allocationValue}
            />
          </ContentInner>
          <ContentInner width={isMobile ? '5%' : '15%'}>
            <ListItem
              weight={400}
              size={isMobile ? 12 : 12}
              marginTop={isMobile ? 10 : 0}
              color="#5FCF76"
              backColor="rgba(95, 207, 118, 0.2)"
              borderRadius="16px"
              padding="2px 8px"
              justifyContent="center"
              value={`${currencySym}${formatNumber(monthlyYield, 2)}/mo`}
            />
          </ContentInner>
          <ContentInner
            width={isMobile ? '5%' : '5%'}
            display="flex"
            justifyContent="center"
            fontSize="18px"
          >
            <LuEye />
          </ContentInner>
        </Content>
      </FlexDiv>
      {isExpand && (
        <>
          <FlexDiv>
            <Content padding="12px 0px 0px 0px">
              <ContentInner
                width={isMobile ? '100%' : '100%'}
                display={isMobile ? 'block' : 'flex'}
              >
                <TopFiveText>Displaying top5 positions</TopFiveText>
              </ContentInner>
            </Content>
          </FlexDiv>
          <Content padding="12px 0px 16px 0px">
            <ContentInner width={isMobile ? '100%' : '100%'} display={isMobile ? 'block' : 'flex'}>
              <div style={{ paddingLeft: '0px', margin: 0 }}>
                {Object.entries(value.vaults)
                  .slice(0, 5)
                  .map(([vaultKey, vaultValue], index) => {
                    return (
                      <div
                        key={vaultKey}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '10px',
                          position: 'relative',
                          paddingLeft: '10px',
                        }}
                      >
                        <span
                          style={{
                            content: '""',
                            width: '4px',
                            height: '4px',
                            backgroundColor: 'rgb(84, 88, 99)',
                            borderRadius: '50%',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />
                        <ListItem
                          value={`${currencySym}${formatNumber(vaultValue.balance, 2)}`}
                          weight={500}
                          size={isMobile ? 12 : 12}
                          marginTop={isMobile ? 10 : 0}
                          marginRight={10}
                          color="#5FCF76"
                        />
                        <ListItem
                          value={matchedTokenNames[index]}
                          weight={500}
                          size={isMobile ? 12 : 12}
                          marginTop={isMobile ? 10 : 0}
                          marginRight={10}
                          imgMargin={10}
                          color="#6988FF"
                          platform={getPlatformName(vaultKey)}
                          chain={BadgeAry[getBadgeId(vaultKey)]}
                          networkName={networkNames[getBadgeId(vaultKey)]}
                          vaultAddress={vaultKey}
                          textDecoration="underline"
                        />
                        <ListItem
                          weight={500}
                          size={isMobile ? 12 : 12}
                          marginTop={isMobile ? 10 : 0}
                          marginRight={10}
                          color="#5FCF76"
                          value={`${getVaultApy(vaultKey, groupOfVaults)}% APY`}
                        />
                        <ListItem
                          weight={500}
                          size={isMobile ? 12 : 12}
                          marginTop={isMobile ? 10 : 0}
                          color="#6988FF"
                          value={`${formatNumber(
                            getVaultApy(vaultKey, groupOfVaults) / 100,
                            2,
                          )}/yr per $1 allocated`}
                        />
                      </div>
                    )
                  })}
              </div>
            </ContentInner>
          </Content>
        </>
      )}
    </DetailView>
  )
}

export default HolderRow
