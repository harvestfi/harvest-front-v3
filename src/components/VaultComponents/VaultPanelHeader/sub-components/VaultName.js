import React from 'react'
import { TokenDescriptionContainer, TokenNameContainer, BadgeIcon, BadgePlatform } from '../style'
import AutopilotBadges from '../../../AutopilotBadges'

const VaultName = ({ token, tokenSymbol, fontColor1, BadgeAry, badgeId, isMobile }) => {
  const isAutopilotMorpho = token.platform[0] && token.platform[0].includes('Autopilot - MORPHO')
  const isAutopilot = token.platform[0] && token.platform[0] === 'Autopilot'
  const uniqueId = token.vaultAddress || token.tokenAddress || tokenSymbol

  const renderPlatformBadges = () => {
    if (token.subLabel) {
      return token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
    } else if (isAutopilotMorpho || isAutopilot) {
      return (
        <AutopilotBadges
          tokenNames={token.tokenNames}
          isMorphoOnly={isAutopilotMorpho}
          tooltipIdMorpho={`tooltip-morpho-vault-${uniqueId}`}
          mobileLayout="row"
          isPortfolio={false}
          address={token.vaultAddress || token.tokenAddress}
        />
      )
    } else {
      return token.platform[0] && token.platform[0]
    }
  }

  return (
    <TokenDescriptionContainer>
      <TokenNameContainer $fontcolor1={fontColor1}>
        {token.tokenNames.join(' - ') || tokenSymbol}
      </TokenNameContainer>
      {isMobile ? (
        <BadgePlatform>
          <BadgeIcon>
            {BadgeAry[badgeId] ? (
              <img src={BadgeAry[badgeId]} width="10" height="10" alt="" />
            ) : (
              <></>
            )}
          </BadgeIcon>
          {renderPlatformBadges()}
        </BadgePlatform>
      ) : (
        <>{renderPlatformBadges()}</>
      )}
    </TokenDescriptionContainer>
  )
}

export default VaultName
