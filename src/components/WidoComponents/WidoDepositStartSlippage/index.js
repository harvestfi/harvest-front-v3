import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useThemeContext } from '../../../providers/useThemeContext'
import { SelectTokenWido, CloseBtn, NewLabel, CustomInput, SaveSetting } from './style'
import Button from '../../Button'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import CheckedIcon from '../../../assets/images/logos/wido/checked.svg'

const WidoDepositStartSlippage = ({
  startSlippage,
  setStartSlippage,
  setSlippagePercent,
  setDepositWido,
}) => {
  const [percent, setPercent] = useState('')
  const [clickId, setClickId] = useState(1)

  const percentList = [0.1, 0.5, 1]

  const { backColor, filterColor, widoInputPanelBorderColor } = useThemeContext()
  return (
    <SelectTokenWido show={startSlippage} backColor={backColor}>
      <div>
        <CloseBtn
          src={BackIcon}
          width={18}
          height={18}
          alt=""
          onClick={() => {
            setStartSlippage(false)
            setDepositWido(true)
          }}
          filterColor={filterColor}
        />
        <NewLabel
          padding="16px"
          display="flex"
          borderColor="#6CE9A6"
          marginBottom="13px"
          background="#F6FEF9"
          borderRadius="12px"
          weight="400"
          size="14px"
          height="18px"
          color="#027A48"
        >
          <img src={CheckedIcon} alt="" />
          <NewLabel marginLeft="15px">
            <NewLabel display="flex" weight="900" size="16px" height="21px" marginBottom="5px">
              Slippage Tolerance
            </NewLabel>
            A {percent}% slippage tolerance is set by defult.
          </NewLabel>
        </NewLabel>

        <NewLabel
          borderColor={widoInputPanelBorderColor}
          borderRadius="8px"
          display="flex"
          weight="600"
          size="14px"
          height="20px"
          marginBottom="40px"
        >
          {percentList.map((data, i) => (
            <NewLabel
              key={i}
              className={clickId === i ? 'item active' : 'item'}
              width="15%"
              align="center"
              color="black"
              padding="10px"
              borderColor={widoInputPanelBorderColor}
              onClick={() => {
                setPercent(data)
                setClickId(i)
              }}
            >
              {data}%
            </NewLabel>
          ))}
          <NewLabel align="center" borderRadius="12px">
            <CustomInput
              type="number"
              placeholder="Enter custom number"
              value={percent}
              onChange={e => {
                setPercent(e.target.value)
              }}
            />
          </NewLabel>
        </NewLabel>
      </div>
      <Button
        width="100%"
        height="50px"
        color="wido-save"
        padding="17px"
        onClick={() => {
          if (percent <= 0 || percent > 1) {
            toast.error('Please input custom value from 0 to 1.0!')
            return
          }
          setSlippagePercent(percent / 100)
          setStartSlippage(false)
          setDepositWido(true)
        }}
      >
        <SaveSetting>Save Settings</SaveSetting>
      </Button>
    </SelectTokenWido>
  )
}
export default WidoDepositStartSlippage
