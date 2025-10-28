import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ARBITRUM from '../../../assets/images/chains/arbitrum.svg'
import BASE from '../../../assets/images/chains/base.svg'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import POLYGON from '../../../assets/images/logos/badge/polygon.svg'
import ZKSYNC from '../../../assets/images/logos/badge/zksync.svg'
import { chainList, directDetailUrl } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { BadgeIcon, LogoImg, PanelContainer, ValueContainer } from './style'
import VaultApy from './sub-components/VaultApy'
import VaultDailyApy from './sub-components/VaultDailyApy'
import VaultName from './sub-components/VaultName'
import VaultUserBalance from './sub-components/VaultUserBalance'
import VaultValue from './sub-components/VaultValue'

const DesktopPanelHeader = ({ token, tokenSymbol, vaultPool, loadedVault }) => {
  const location = useLocation()
  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE, ZKSYNC]

  const chainId = token.chain || token.data.chain
  const [badgeId, setBadgeId] = useState(-1)

  const { logoUrl } = token

  const navigate = useNavigate()

  const { fontColor, fontColor1, borderColorBox, setPrevPage } = useThemeContext()

  const network = chainList[badgeId]?.name.toLowerCase()
  const address = token.vaultAddress || token.tokenAddress
  const url = `${directDetailUrl}${network}/${address}${location.search}`

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

  return (
    <>
      <PanelContainer
        as="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        $fontcolor={fontColor}
        $bordercolor={borderColorBox}
        onClick={e => {
          if (!e.ctrlKey) {
            e.preventDefault()
            setPrevPage(window.location.href)
            navigate(url)
          }
        }}
      >
        <ValueContainer $width="5%" />
        <ValueContainer $width="10%" $textalign="left">
          {logoUrl.map((el, i) => (
            <LogoImg key={i} className="logo-img" $zindex={10 - i} src={el} alt={tokenSymbol} />
          ))}
          <BadgeIcon $bordercolor={token.inactive ? 'orange' : '#29ce84'}>
            {BadgeAry[badgeId] ? (
              <img src={BadgeAry[badgeId]} width="12px" height="12px" alt="" />
            ) : (
              <></>
            )}
          </BadgeIcon>
        </ValueContainer>
        <ValueContainer $width="30%" $textalign="left" $paddingleft="0%">
          <VaultName token={token} tokenSymbol={tokenSymbol} $fontcolor1={fontColor1} />
        </ValueContainer>
        <ValueContainer $width="15%">
          <VaultApy
            token={token}
            tokenSymbol={tokenSymbol}
            vaultPool={vaultPool}
            $fontcolor1={fontColor1}
          />
        </ValueContainer>
        <ValueContainer $width="15%">
          <VaultDailyApy
            token={token}
            tokenSymbol={tokenSymbol}
            vaultPool={vaultPool}
            $fontcolor1={fontColor1}
          />
        </ValueContainer>
        <ValueContainer $width="15%">
          <VaultValue token={token} $fontcolor1={fontColor1} />
        </ValueContainer>
        <ValueContainer $width="10%">
          <VaultUserBalance
            token={token}
            tokenSymbol={tokenSymbol}
            loadedVault={loadedVault}
            $fontcolor1={fontColor1}
          />
        </ValueContainer>
      </PanelContainer>
    </>
  )
}

export default DesktopPanelHeader
