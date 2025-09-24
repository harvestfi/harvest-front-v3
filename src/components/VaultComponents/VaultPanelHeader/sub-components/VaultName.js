import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import {
  TokenDescriptionContainer,
  TokenNameContainer,
  BadgeIcon,
  BadgePlatform,
  Autopilot,
  NewLabel,
  MorphoBadge,
  BadgeRow,
} from '../style'
import Diamond from '../../../../assets/images/logos/diamond.svg'
import MorphoIcon from '../../../../assets/images/ui/morpho.svg'

const VaultName = ({ token, tokenSymbol, fontColor1, BadgeAry, badgeId, isMobile }) => {
  const isAutopilotMorpho = token.platform[0] && token.platform[0].includes('Autopilot - MORPHO')
  const isAutopilot = token.platform[0] && token.platform[0] === 'Autopilot'

  const renderPlatformBadges = () => {
    if (token.subLabel) {
      return token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
    } else if (isAutopilotMorpho) {
      return (
        <BadgeRow>
          <Autopilot>
            <img src={Diamond} width="12" height="12" alt="" />
            <NewLabel>Autopilot</NewLabel>
          </Autopilot>
          <MorphoBadge>
            <img src={MorphoIcon} width="12" height="12" alt="" />
            <NewLabel>Morpho-Only</NewLabel>
            <PiQuestion className="question" data-tip id="tooltip-morpho-only" />
            <Tooltip
              id="tooltip-morpho-only"
              anchorSelect="#tooltip-morpho-only"
              backgroundColor="#101828"
              borderColor="black"
              textColor="white"
              place="top"
              style={{ width: '300px' }}
            >
              <NewLabel>
                {`This Autopilot only supplies liquidity to curated ${token.tokenNames[0]} vaults on Morpho, Base Network.`}
              </NewLabel>
            </Tooltip>
          </MorphoBadge>
        </BadgeRow>
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
