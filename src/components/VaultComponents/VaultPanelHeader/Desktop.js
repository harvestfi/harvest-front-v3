import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { directDetailUrl } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { PanelContainer, ValueContainer, BadgeIcon, LogoImg } from './style'
import VaultName from './sub-components/VaultName'
import VaultApy from './sub-components/VaultApy'
import VaultValue from './sub-components/VaultValue'
import VaultUserBalance from './sub-components/VaultUserBalance'
import POLYGON from '../../../assets/images/logos/badge/polygon.svg'
import BNB from '../../../assets/images/logos/badge/bnb.svg'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import ARBITRUM from '../../../assets/images/chains/arbitrum.svg'

const chainList = [
  { id: 1, name: 'Ethereum', chainId: 1 },
  { id: 2, name: 'Polygon', chainId: 137 },
  { id: 3, name: 'Arbitrum', chainId: 42161 },
  { id: 4, name: 'BNB', chainId: 56 },
]

const DesktopPanelHeader = ({
  token,
  tokenSymbol,
  useIFARM,
  vaultPool,
  isSpecialVault,
  multipleAssets,
  loadedVault,
  loadingFarmingBalance,
}) => {
  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BNB]

  const chainId = token.chain || token.data.chain
  const [badgeId, setBadgeId] = useState(-1)

  const logoUrl = token.logoUrl

  const { push } = useHistory()

  const { fontColor, borderColor, badgeIconBackColor } = useThemeContext()

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
        fontColor={fontColor}
        borderColor={borderColor}
        onClick={() => {
          push(directDetailUrl + tokenSymbol)
        }}
      >
        <ValueContainer width="5%"></ValueContainer>
        <ValueContainer width="20%" textAlign="left">
          {logoUrl.map((el, i) => (
            <LogoImg
              key={i}
              className="logo-img"
              zIndex={100 - i}
              src={el}
              width={37}
              alt={tokenSymbol}
            />
          ))}
          <BadgeIcon badgeBack={badgeIconBackColor}>
            {BadgeAry[badgeId] ? (
              <img src={BadgeAry[badgeId]} width={'17px'} height={'17px'} alt="" />
            ) : (
              <></>
            )}
          </BadgeIcon>
        </ValueContainer>
        <ValueContainer width="25%" textAlign="left" paddingLeft="0%">
          <VaultName token={token} tokenSymbol={tokenSymbol} useIFARM={useIFARM} />
        </ValueContainer>
        <ValueContainer width="10%">
          <VaultApy
            token={token}
            tokenSymbol={tokenSymbol}
            vaultPool={vaultPool}
            isSpecialVault={isSpecialVault}
          />
        </ValueContainer>
        <ValueContainer width="20%">
          <VaultValue token={token} />
        </ValueContainer>
        <ValueContainer width="20%">
          <VaultUserBalance
            token={token}
            tokenSymbol={tokenSymbol}
            multipleAssets={multipleAssets}
            isSpecialVault={isSpecialVault}
            loadingFarmingBalance={loadingFarmingBalance}
            vaultPool={vaultPool}
            loadedVault={loadedVault}
          />
        </ValueContainer>
      </PanelContainer>
    </>
  )
}

export default DesktopPanelHeader
