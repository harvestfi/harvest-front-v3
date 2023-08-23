import React from 'react'
import ReactTooltip from 'react-tooltip'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { useWallet } from '../../../../providers/Wallet'
import { ButtonsGroup, ButtonStyle, TooltipContent } from './style'

const ChartButtonsGroup = ({ buttons, clickedId, setClickedId }) => {
  const { connected } = useWallet()
  const handleClick = (event, id) => {
    if (connected || id !== 2) {
      setClickedId(id)
    }
    // doSomethingAfterClick(event)
  }

  const [focusId, setFocusId] = React.useState(-1)
  let tempId = -1

  const { backColor, borderColor, darkMode, filterChainHoverColor } = useThemeContext()

  return (
    <ButtonsGroup backColor={backColor} borderColor={borderColor}>
      {buttons.map((button, i) => (
        <ButtonStyle
          key={i}
          btnNum={i}
          name={button.name}
          onClick={event => handleClick(event, i)}
          onMouseEnter={() => {
            tempId = tempId !== -1 ? i : -1
            setFocusId(i)
          }}
          data-tip={!!(i === 2 && !connected)}
          data-for={i === 2 && !connected ? 'tooltip-balance-chart' : ''}
          onMouseLeave={() => {
            setFocusId(tempId)
            tempId = focusId
          }}
          className={(i === clickedId || i === focusId) && (connected || i !== 2) ? 'active' : ''}
          wallet={!!(connected && i === 2)}
          backcolor={filterChainHoverColor}
          mode={darkMode.toString()}
          borderColor={borderColor}
        >
          <img src={button.img} width="20" height="20" alt="" />
        </ButtonStyle>
      ))}
      {!connected && (
        <ReactTooltip
          id="tooltip-balance-chart"
          backgroundColor="black"
          borderColor="black"
          textColor="white"
        >
          <TooltipContent>
            Connect your wallet <br />
            to see balance chart
          </TooltipContent>
        </ReactTooltip>
      )}
    </ButtonsGroup>
  )
}

export default ChartButtonsGroup
