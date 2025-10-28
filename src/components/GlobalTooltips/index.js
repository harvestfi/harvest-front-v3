import React from 'react'
import { Tooltip } from 'react-tooltip'

// Global tooltips that render at app level, outside any <a> tags
const GlobalTooltips = () => {
  return (
    <>
      {/* Fusion Points Tooltip - Global */}
      <Tooltip
        id="fusion-tooltip-global"
        backgroundColor="#101828"
        borderColor="black"
        textColor="white"
        place="top"
        style={{ width: '300px', zIndex: 99999, maxWidth: '90vw' }}
        clickable
        delayHide={300}
      >
        <div style={{ fontSize: '10px', fontWeight: 500, lineHeight: '15px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Fusion Points Information</div>
          <div style={{ marginBottom: '10px' }}>
            Autopilot users are now entitled to Fusion Points of IPOR Labs - which at a later date
            might be converted into $FUSN rewards.
          </div>
          <div style={{ marginBottom: '5px' }}>
            Check your Fusion Points via Merkl interface:{' '}
            <a
              href="https://app.merkl.xyz/users"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'underline' }}
            >
              https://app.merkl.xyz/users
            </a>
          </div>
          <div style={{ marginBottom: '10px' }}>
            More information{' '}
            <a
              href="https://blog.ipor.io/introducing-ipor-fusion-points-6666d85abe8a"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'underline' }}
            >
              https://blog.ipor.io/introducing-ipor-fusion-points-6666d85abe8a
            </a>
          </div>
          <div style={{ fontSize: '9px', opacity: 0.8 }}>
            Harvest does not guarantee the airdrop, points or reward programs and accepts no
            liability.
          </div>
        </div>
      </Tooltip>
    </>
  )
}

export default GlobalTooltips
