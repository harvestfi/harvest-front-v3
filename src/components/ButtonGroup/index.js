import React from "react"
import { useThemeContext } from '../../providers/useThemeContext'
import { ButtonsGroup, ButtonStyle, Soon, } from "./style.js"

const ButtonGroup = ({ buttons, doSomethingAfterClick, clickedId, setClickedId }) => {

  const { backColor, borderColor, fontColor, filterColor } = useThemeContext()

  const handleClick = (event, id) => {
    if(buttons[id].name !== "Labs") {
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
          name={button.name}
          onClick={(event) => handleClick(event, i)}
          onMouseEnter={() => {
            tempId !== -1 ? tempId = i : tempId = -1
            setFocusId(i)
          }}
          onMouseLeave={() => {
            setFocusId(tempId)
            tempId = focusId
          }}
          className={(i === clickedId || i === focusId) && button.name !== 'Labs' ? "active" : ""}
          fontColor={fontColor}
          filterColor={filterColor}
        >
          {
            // (i === clickedId || i === focusId) && button.name !== 'Labs' ? 
            //   <img src={button.img} width={"18"} height={"18"} alt="" />
            // :
            
              <img src={button.img} width={"18"} height={"18"} alt="" />
          }
          <div>{button.name}</div>
          {
            button.name === 'Labs' ? 
            <Soon>Soon TM</Soon> : <></>
          }
          
        </ButtonStyle>
      ))}
    </ButtonsGroup>
  )
}

export default ButtonGroup