import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import Diamond from '../../assets/images/logos/diamond.svg'
import MorphoIcon from '../../assets/images/ui/morpho.svg'
import { Autopilot, NewLabel, MorphoBadge, BadgeRow } from './style'

const MorphoAutopilotBadges = ({
  tokenNames,
  tooltipId,
  className = '',
  mobileLayout = 'column',
  isPortfolio = false,
}) => {
  const tokenName = tokenNames && tokenNames[0] ? tokenNames[0] : 'USDC'

  return (
    <BadgeRow className={className} $mobileLayout={mobileLayout}>
      <Autopilot $isPortfolio={isPortfolio}>
        <img src={Diamond} width="12" height="12" alt="" />
        <NewLabel $isPortfolio={isPortfolio}>Autopilot</NewLabel>
      </Autopilot>
      <MorphoBadge $isPortfolio={isPortfolio}>
        <img src={MorphoIcon} width="12" height="12" alt="" />
        <NewLabel $isPortfolio={isPortfolio}>Morpho-Only</NewLabel>
        <PiQuestion className="question" data-tip id={tooltipId} />
        <Tooltip
          id={tooltipId}
          anchorSelect={`#${tooltipId}`}
          backgroundColor="#101828"
          borderColor="black"
          textColor="white"
          place="top"
          style={{ width: '300px' }}
        >
          <NewLabel $isPortfolio={isPortfolio}>
            {`This Autopilot only supplies liquidity to curated ${tokenName} vaults on Morpho, Base Network.`}
          </NewLabel>
        </Tooltip>
      </MorphoBadge>
    </BadgeRow>
  )
}

export default MorphoAutopilotBadges
