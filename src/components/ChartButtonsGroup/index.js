import React from "react"
import { ButtonsGroup, ButtonStyle } from "./style.js"
import { useWallet } from "../../providers/Wallet/index.js"
import { useThemeContext } from "../../providers/useThemeContext.js"

const ChartButtonsGroup = ({ buttons, clickedId, setClickedId }) => {

  const { connected } = useWallet()
  const handleClick = (event, id) => {
    if(connected || id !== 2) {
      setClickedId(id)
    }
    // doSomethingAfterClick(event)
  }

  const [focusId, setFocusId] = React.useState(-1)
  let tempId = -1

  const { chartBtnGroupBackColor, backColor, borderColor } = useThemeContext()

  return (
    <ButtonsGroup backColor={backColor} borderColor={borderColor}>
      {buttons.map((button, i) => (
        <div key={i}>
          <ButtonStyle
            key={i}
            btnNum={i}
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
            className={(i === clickedId || i === focusId) && (connected || i !== 2) ? "active" : ""}
            wallet={connected && i === 2 ? true : false}
            backcolor={chartBtnGroupBackColor}
          >
            <img src={button.img} width={"20"} height={"20"} alt="" />
          </ButtonStyle>
        </div>
      ))}
    </ButtonsGroup>
  )
}

export default ChartButtonsGroup