import React from 'react'
import {
  TokenDescriptionContainer,
  TokenNameContainer,
  BadgeIcon,
  BadgePlatform,
  Autopilot,
  NewLabel,
} from '../style'
import Diamond from '../../../../assets/images/logos/diamond.svg'
import MorphoAutopilotBadges from '../../../MorphoAutopilotBadges'

const VaultName = ({ token, tokenSymbol, fontColor1, BadgeAry, badgeId, isMobile }) => {
  const isAutopilotMorpho = token.platform[0] && token.platform[0].includes('Autopilot - MORPHO')
  const isAutopilot = token.platform[0] && token.platform[0] === 'Autopilot'

  const renderPlatformBadges = () => {
    if (token.subLabel) {
      return token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
    } else if (isAutopilotMorpho) {
      return (
        <MorphoAutopilotBadges
          tokenNames={token.tokenNames}
          tooltipId="tooltip-morpho-only"
          mobileLayout="row"
          isPortfolio={false}
        />
      )
    } else if (isAutopilot) {
      return (
        <Autopilot>
          <img src={Diamond} width="12" height="12" alt="" />
          <NewLabel>{token.platform[0]}</NewLabel>
        </Autopilot>
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
