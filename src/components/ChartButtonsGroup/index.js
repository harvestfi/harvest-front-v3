import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet/index'
import { ButtonsGroup, ButtonStyle } from './style'

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

  const { chartBtnGroupBackColor, backColor, borderColor, darkMode } = useThemeContext()

  return (
    <ButtonsGroup backColor={backColor} borderColor={borderColor}>
      {buttons.map((button, i) => (
        <div key={i}>
          <ButtonStyle
            key={i}
            btnNum={i}
            name={button.name}
            onClick={event => handleClick(event, i)}
            onMouseEnter={() => {
              tempId = tempId !== -1 ? i : -1
              setFocusId(i)
            }}
            onMouseLeave={() => {
              setFocusId(tempId)
              tempId = focusId
            }}
            className={(i === clickedId || i === focusId) && (connected || i !== 2) ? 'active' : ''}
            wallet={!!(connected && i === 2)}
            backcolor={chartBtnGroupBackColor}
            mode={darkMode.toString()}
          >
            <img src={button.img} width="20" height="20" alt="" />
          </ButtonStyle>
        </div>
      ))}
    </ButtonsGroup>
  )
}

export default ChartButtonsGroup
