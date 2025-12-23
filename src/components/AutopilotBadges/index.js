import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useMediaQuery } from 'react-responsive'
import Diamond from '../../assets/images/logos/diamond.svg'
import MorphoIcon from '../../assets/images/ui/morpho.svg'
import FusionIcon from '../../assets/images/ui/fusion.svg'
import { Autopilot, NewLabel, MorphoBadge, FusionBadge, BadgeRow } from './style'

const AutopilotBadges = ({
  tokenNames,
  isMorphoOnly = false,
  tooltipIdMorpho = 'tooltip-morpho-only',
  className = '',
  mobileLayout = 'column',
  isPortfolio = false,
  address,
}) => {
  const tokenName = tokenNames && tokenNames[0] ? tokenNames[0] : 'USDC'
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const tokenNameForId = tokenNames ? tokenNames.join('-') : 'default'
  const morphoTooltipId = `${tooltipIdMorpho}-${tokenNameForId}`

  // Hide Fusion Points badge for this specific autopilot address
  const hideFusionPoints = address?.toLowerCase() === '0xce4d997a3b404f9eaa796f89deae40747d3647b7'

  return (
    <BadgeRow className={className} $mobileLayout={mobileLayout}>
      <Autopilot $isPortfolio={isPortfolio}>
        <img src={Diamond} width="12" height="12" alt="" />
        <NewLabel $isPortfolio={isPortfolio}>Autopilot</NewLabel>
      </Autopilot>
      {isMorphoOnly && (
        <>
          <MorphoBadge $isPortfolio={isPortfolio}>
            <img src={MorphoIcon} width="12" height="12" alt="" />
            <NewLabel $isPortfolio={isPortfolio}>{isMobile ? 'Morpho' : 'Morpho-Only'}</NewLabel>
            <PiQuestion
              className="question"
              data-tip
              id={morphoTooltipId}
              onClick={e => e.preventDefault()}
            />
          </MorphoBadge>
          <Tooltip
            id={morphoTooltipId}
            anchorSelect={`#${morphoTooltipId}`}
            backgroundColor="#101828"
            borderColor="black"
            textColor="white"
            place="top"
            style={{ width: '300px', zIndex: 99999 }}
          >
            <NewLabel $isPortfolio={isPortfolio}>
              {`This Autopilot only supplies liquidity to curated ${tokenName} vaults on Morpho, Base Network.`}
            </NewLabel>
          </Tooltip>
        </>
      )}

      {!hideFusionPoints && (
        <FusionBadge $isPortfolio={isPortfolio}>
          <img src={FusionIcon} width="12" height="12" alt="" />
          <NewLabel $isPortfolio={isPortfolio}>{isMobile ? 'Fusion' : 'Fusion Points'}</NewLabel>
          <PiQuestion
            className="question"
            data-tooltip-id="fusion-tooltip-global"
            onClick={e => e.preventDefault()}
          />
        </FusionBadge>
      )}
    </BadgeRow>
  )
}

export default AutopilotBadges
