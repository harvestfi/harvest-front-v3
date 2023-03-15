import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Container, FarmType, Text, ContentResult, ContentItem, Value, ContentImg,
  Header, ContentMiddle, Percent, Img, Content, Chain
} from './style'
import AnimatedDots from '../AnimatedDots'
import { displayAPY, getTotalApy, formatNumber } from '../../utils'
import {
  DECIMAL_PRECISION,
  SPECIAL_VAULTS,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  directDetailUrl,
} from '../../constants'
import { tokens, addresses } from '../../data'
import TVL from '../../assets/images/logos/earn/tvl.svg'

const getVaultValue = token => {
  const poolId = get(token, 'data.id')

  switch (poolId) {
    case SPECIAL_VAULTS.FARM_WETH_POOL_ID:
      return get(token, 'data.lpTokenData.liquidity')
    case SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID: {
      if (!get(token, 'data.lpTokenData.price')) {
        return null
      }

      return new BigNumber(get(token, 'data.totalValueLocked', 0))
    }
    case SPECIAL_VAULTS.FARM_GRAIN_POOL_ID:
    case SPECIAL_VAULTS.FARM_USDC_POOL_ID:
      return get(token, 'data.totalValueLocked')
    default:
      return token.usdPrice
        ? new BigNumber(token.underlyingBalanceWithInvestment)
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

const HomeComponentInfo = ({
  data,
  token,
  vaultPool,
  tokenVault,
  tokenSymbol,
  headIcon,
  text,
  url,
  textColor,
}) => {
  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const [useIFARM] = useState(tokenSymbol === FARM_TOKEN_SYMBOL)

  const isAmpliFARM = get(vaultPool, 'rewardTokens', []).includes(addresses.BSC.ampliFARM)

  const [vaultValue, setVaultValue] = useState(null)

  useEffect(() => {
    setVaultValue(getVaultValue(token))
  }, [token, tokenSymbol])

  const { fontColor, backColor, borderColor } = useThemeContext()

  return (
    <Container href={directDetailUrl + url} backColor={backColor} borderColor={borderColor} >
      <Header>
        <img className='back-img' src={data} alt="" />
      
        <FarmType textColor={textColor}>
          <img src={headIcon} alt="" width={"18px"} height={"18px"} />
          <Text>{text}</Text>
        </FarmType>
      </Header>

      <Content borderColor={borderColor}>
        <ContentMiddle>
          <Img>
            {token.logoUrl
              ? token.logoUrl.map((symbol, symbolIdx) => (
                  <ContentImg
                    key={symbol}
                    id={10 - symbolIdx}
                    width={'32'}
                    height={'32'}
                    margin="0px 5px 0px 0px"
                    src={symbol}
                  />
                ))
              : null}
          </Img>

          <Percent fontColor={fontColor}>
            {isAmpliFARM
              ? `${displayAPY(
                  new BigNumber(totalApy).minus(get(vaultPool, 'boostedRewardAPY', 0)).toFixed(2),
                  DECIMAL_PRECISION,
                  10,
                )}→${displayAPY(totalApy, DECIMAL_PRECISION, 10)}`
              : displayAPY(totalApy, DECIMAL_PRECISION, 10)}
          </Percent>
        </ContentMiddle>
        <ContentResult>
          <ContentItem>
            <img src={TVL} width={18} height={18} alt="Total Deposit" />
            <Value fontColor={fontColor}>
              <div data-tip="" data-for={`tooltip-${tokenSymbol}`}>
                {token.excludeVaultStats ? (
                  'N/A'
                ) : vaultValue ? (
                  <>${formatNumber(vaultValue, 2)}</>
                ) : (
                  <AnimatedDots />
                )}
              </div>
            </Value>
          </ContentItem>
          <ContentItem>
            <Chain fontColor={fontColor}>
              {useIFARM ? tokens[IFARM_TOKEN_SYMBOL].subLabel : token.subLabel}
            </Chain>
          </ContentItem>
        </ContentResult>
      </Content>
    </Container>
  )
}

export default HomeComponentInfo
