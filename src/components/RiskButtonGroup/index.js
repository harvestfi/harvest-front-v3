import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { ButtonsGroup, ButtonStyle } from './style'

const ButtonGroup = ({ buttons, doSomethingAfterClick, clickedId, setClickedId }) => {
  const { backColor, borderColor, fontColor, filterColor } = useThemeContext()

  const handleClick = (event, id) => {
    setClickedId(id)
    doSomethingAfterClick(id)
  }
  const [focusId, setFocusId] = React.useState(-1)
  let tempId = -1
  return (
    <ButtonsGroup backColor={backColor} borderColor={borderColor}>
      {buttons.map((button, i) => (
        <ButtonStyle
          key={i}
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
          className={i === clickedId || i === focusId ? 'active' : ''}
          fontColor={fontColor}
          filterColor={filterColor}
        >
          <img src={button.img} width="18" height="18" alt="" />
          <div>{button.name}</div>
        </ButtonStyle>
      ))}
    </ButtonsGroup>
  )
}

export default ButtonGroup
