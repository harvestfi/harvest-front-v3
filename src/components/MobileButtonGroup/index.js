import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { ButtonsGroup, ButtonStyle } from './style'

const MobileButtonGroup = ({ buttons, doSomethingAfterClick, clickedId, setClickedId }) => {
  const { backColor, borderColor, fontColor, filterColor } = useThemeContext()
  const handleClick = (event, id) => {
    if (buttons[id].name !== 'Labs') {
      setClickedId(id)
      doSomethingAfterClick(id)
    }
  }

  return (
    <ButtonsGroup backColor={backColor} borderColor={borderColor}>
      {buttons.map((button, i) => (
        <ButtonStyle
          key={i}
          name={button.name}
          onClick={event => handleClick(event, i)}
          className={i === clickedId ? 'active' : ''}
          fontColor={fontColor}
          filterColor={filterColor}
        >
          <img src={button.img} width="12" height="12" alt="" />
          <div>{button.name}</div>
        </ButtonStyle>
      ))}
    </ButtonsGroup>
  )
}

export default MobileButtonGroup
