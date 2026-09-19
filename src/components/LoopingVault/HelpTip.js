import React from 'react'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { HelpRowLabel } from './style'

const HelpTip = ({ id, tip, darkMode, children, place = 'right' }) => (
  <HelpRowLabel>
    {children}
    <PiQuestion className="question" data-tip id={id} style={{ cursor: 'help', flexShrink: 0 }} />
    <Tooltip
      id={id}
      anchorSelect={`#${id}`}
      backgroundColor={darkMode ? 'white' : '#101828'}
      borderColor={darkMode ? 'white' : 'black'}
      textColor={darkMode ? 'black' : 'white'}
      place={place}
      style={place === 'bottom' ? { maxWidth: 280 } : undefined}
    >
      {tip}
    </Tooltip>
  </HelpRowLabel>
)

export default HelpTip
