import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { ButtonsGroup, ButtonStyle } from './style'

const ButtonGroup = ({
  buttons,
  doSomethingAfterClick,
  clickedId,
  setClickedId,
  fontColor,
  unsetWidth,
}) => {
  const { backColor, borderColor, filterColor, filterChainHoverColor } = useThemeContext()

  const handleClick = (event, id) => {
    if (buttons[id].name !== 'Labs') {
      setClickedId(id)
      doSomethingAfterClick(id)
    }
  }
  const [focusId, setFocusId] = React.useState(-1)
  let tempId = -1
  return (
    <ButtonsGroup backColor={backColor} borderColor={borderColor}>
      {buttons.map((button, i) => (
        <ButtonStyle
          key={i}
          percent={100 / buttons.length}
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
          num={i}
          className={i === clickedId || i === focusId ? 'active' : ''}
          fontColor={fontColor}
          filterColor={button.name === 'Boosted 🔥' || button.name === 'Boosted' ? '' : filterColor}
          borderColor={borderColor}
          hoverColor={filterChainHoverColor}
          unsetWidth={unsetWidth}
          isBoosted={button.name === 'Boosted 🔥' || button.name === 'Boosted' ? 'true' : 'false'}
        >
          {button.img && <img src={button.img} width="18" height="18" alt="" />}
          <div>{button.name}</div>
        </ButtonStyle>
      ))}
    </ButtonsGroup>
  )
}

export default ButtonGroup
