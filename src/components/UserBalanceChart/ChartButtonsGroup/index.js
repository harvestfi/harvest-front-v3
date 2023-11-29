import React from 'react'
import ReactTooltip from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { ButtonsGroup, ButtonStyle, TooltipContent } from './style'

const ChartButtonsGroup = ({ buttons, clickedId, setClickedId }) => {
  const { connected } = useWallet()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
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
          data-tip={!connected}
          data-for={i === 0 ? 'tooltip-balance-chart' : 'tooltip-underlying-balance-chart'}
          onMouseLeave={() => {
            setFocusId(tempId)
            tempId = focusId
          }}
          className={(i === clickedId || i === focusId) && connected ? 'active' : ''}
          wallet={!!(connected && i === 2)}
          backcolor={filterChainHoverColor}
          mode={darkMode.toString()}
          borderColor={borderColor}
        >
          <img
            src={button.img}
            width={isMobile ? '20' : '20'}
            height={isMobile ? '20' : '20'}
            alt=""
          />
        </ButtonStyle>
      ))}
      {!connected && (
        <>
          <ReactTooltip
            id="tooltip-balance-chart"
            backgroundColor="#101828"
            borderColor="black"
            textColor="white"
            place="top"
          >
            <TooltipContent>Connect your wallet to see your balance chart</TooltipContent>
          </ReactTooltip>
          <ReactTooltip
            id="tooltip-underlying-balance-chart"
            backgroundColor="#101828"
            borderColor="black"
            textColor="white"
            place="top"
          >
            <TooltipContent>
              Connect your wallet to see your underlying balance chart
            </TooltipContent>
          </ReactTooltip>
        </>
      )}
    </ButtonsGroup>
  )
}

export default ChartButtonsGroup
