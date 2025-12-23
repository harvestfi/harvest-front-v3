import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useMediaQuery } from 'react-responsive'
import DiamondSvg from '../../../assets/images/logos/diamond.svg'
import FusionIcon from '../../../assets/images/ui/fusion.svg'
import { BadgeWrap, GuidePart, FusionPointsBadge } from './style'
import { useThemeContext } from '../../../providers/useThemeContext'

const TopBadge = ({ address }) => {
  const { fontColor8, activeColorModal } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  // Hide Fusion Points badge for this specific autopilot address
  const hideFusionPoints = address?.toLowerCase() === '0xce4d997a3b404f9eaa796f89deae40747d3647b7'

  return (
    <BadgeWrap>
      <GuidePart $backcolor={activeColorModal} $fontcolor4="#5dcf46">
        <img src={DiamondSvg} width="14" height="14" alt="" />
        Autopilot
        <PiQuestion
          className="question"
          color={fontColor8}
          fontSize={16}
          data-tooltip-id="autopilot-tooltip-advanced"
        />
      </GuidePart>
      <Tooltip
        id="autopilot-tooltip-advanced"
        backgroundColor="#101828"
        borderColor="black"
        textColor="white"
        place="top"
        style={{ width: '300px', zIndex: 99999 }}
        clickable
        delayHide={300}
      >
        <div style={{ fontSize: '10px', fontWeight: 500, lineHeight: '15px' }}>
          Automatic allocation optimization to the best performing sub-vaults.{' '}
          <a
            href="https://docs.harvest.finance/how-it-works/autopilots"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 700 }}
          >
            Learn more
          </a>
        </div>
      </Tooltip>
      {!hideFusionPoints && (
        <FusionPointsBadge>
          <img src={FusionIcon} width="14" height="14" alt="" />
          {isMobile ? 'Fusion' : 'Fusion Points'}
          <PiQuestion
            className="question"
            color={fontColor8}
            fontSize={16}
            data-tooltip-id="fusion-tooltip-global"
          />
        </FusionPointsBadge>
      )}
    </BadgeWrap>
  )
}

export default TopBadge
