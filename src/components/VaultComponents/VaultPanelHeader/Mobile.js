import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useNavigate, useLocation } from 'react-router-dom'
import ARBITRUM from '../../../assets/images/chains/arbitrum.svg'
import BASE from '../../../assets/images/chains/base.svg'
import ETHEREUM from '../../../assets/images/chains/ethereum.svg'
import POLYGON from '../../../assets/images/chains/polygon.svg'
import ZKSYNC from '../../../assets/images/chains/zksync.svg'
import APYIcon from '../../../assets/images/logos/farm/sortAPY.svg'
import TVLIcon from '../../../assets/images/logos/farm/sortBank.svg'
import DailyIcon from '../../../assets/images/logos/farm/sortCurrency.svg'
import { chainList, directDetailUrl } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import {
  FlexDiv,
  MobileVaultInfoContainer,
  MobileVaultValueContainer,
  PanelContainer,
  TokenLogoContainer,
} from './style'
import VaultApy from './sub-components/VaultApy'
import VaultName from './sub-components/VaultName'
import VaultUserBalance from './sub-components/VaultUserBalance'
import VaultValue from './sub-components/VaultValue'

const MobilePanelHeader = ({
  token,
  tokenSymbol,
  vaultPool,
  loadedVault,
  loadingFarmingBalance,
}) => {
  const location = useLocation()
  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE, ZKSYNC]
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const chainId = token.chain || token.data.chain
  const [badgeId, setBadgeId] = useState(-1)

  const navigate = useNavigate()

  useEffect(() => {
    const getBadge = () => {
      chainList.forEach((el, i) => {
        if (el.chainId === Number(chainId)) {
          setBadgeId(i)
        }
      })
    }
    getBadge()
  }, [chainId])

  const { logoUrl } = token

  const { badgeIconBackColor, fontColor, borderColorBox, setPrevPage } = useThemeContext()
  return (
    <PanelContainer
      $fontcolor={fontColor}
      $bordercolor={borderColorBox}
      onClick={() => {
        const network = chainList[badgeId].name.toLowerCase()
        const address = token.vaultAddress || token.tokenAddress
        setPrevPage(window.location.href)
        const url = `${directDetailUrl}${network}/${address}${location.search}`
        navigate(url)
      }}
    >
      <FlexDiv
        className="token-symbols"
        $width="60%"
        $alignself="center"
        $marginright="18px"
        $paddingbottom="5px"
      >
        <div>
          {logoUrl.map((el, i) => (
            <img key={i} src={el} width={19} alt={tokenSymbol} />
          ))}
        </div>
        <TokenLogoContainer>
          <VaultName
            token={token}
            tokenSymbol={tokenSymbol}
            BadgeAry={BadgeAry}
            badgeId={badgeId}
            badgeIconBackColor={badgeIconBackColor}
            isMobile={isMobile}
          />
        </TokenLogoContainer>
      </FlexDiv>
      <FlexDiv $width="30%">
        <MobileVaultInfoContainer>
          <MobileVaultValueContainer>
            <VaultApy token={token} tokenSymbol={tokenSymbol} vaultPool={vaultPool} mobile />
            <div className="title">
              <img src={APYIcon} alt="" />
            </div>
          </MobileVaultValueContainer>
          <MobileVaultValueContainer>
            <VaultValue token={token} tokenSymbol={tokenSymbol} />
            <div className="title">
              <img src={TVLIcon} alt="" />
            </div>
          </MobileVaultValueContainer>
          <MobileVaultValueContainer>
            <VaultUserBalance
              token={token}
              tokenSymbol={tokenSymbol}
              loadingFarmingBalance={loadingFarmingBalance}
              loadedVault={loadedVault}
            />
            <div className="title">
              <img src={DailyIcon} alt="" />
            </div>
          </MobileVaultValueContainer>
        </MobileVaultInfoContainer>
      </FlexDiv>
    </PanelContainer>
  )
}

export default MobilePanelHeader
