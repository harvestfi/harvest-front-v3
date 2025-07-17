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

const VaultName = ({ token, tokenSymbol, fontColor1, BadgeAry, badgeId, isMobile }) => {
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
          {token.subLabel ? (
            token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
          ) : token.platform[0] && token.platform[0] === 'Autopilot' ? (
            <Autopilot>
              <img src={Diamond} width="12" height="12" alt="" />
              <NewLabel>{token.platform[0]}</NewLabel>
            </Autopilot>
          ) : (
            token.platform[0] && token.platform[0]
          )}
        </BadgePlatform>
      ) : (
        <>
          {token.subLabel ? (
            token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
          ) : token.platform[0] && token.platform[0] === 'Autopilot' ? (
            <Autopilot>
              <img src={Diamond} width="12" height="12" alt="" />
              <NewLabel>{token.platform[0]}</NewLabel>
            </Autopilot>
          ) : (
            token.platform[0] && token.platform[0]
          )}
        </>
      )}
    </TokenDescriptionContainer>
  )
}

export default VaultName
