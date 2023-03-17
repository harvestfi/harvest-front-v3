import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { SelectTokenWido, CloseBtn, NewLabel, PreviewComponent, Components } from './style'
import CloseIcon from '../../../assets/images/logos/wido/close.svg'
import VaultsIcon from '../../../assets/images/logos/wido/vault.svg'
import Swap2Icon from '../../../assets/images/logos/wido/swap2.svg'
import WidoIcon from '../../../assets/images/logos/wido/wido.svg'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'

const WidoDepositStartRoutes = ({ startRoutes, setStartRoutes }) => {
  const { backColor, borderColor, filterColor } = useThemeContext()
  return (
    <SelectTokenWido show={startRoutes} backColor={backColor} borderColor={borderColor}>
      <NewLabel display="flex" justifyContent="space-between" marginBottom="20px">
        <NewLabel display="flex" weight="700" size="16px" height="21px">
          <NewLabel marginRight="5px">Route Preview</NewLabel>
          <img src={WidoIcon} alt="" />
          <NewLabel marginLeft="5px">wido</NewLabel>
        </NewLabel>
        <CloseBtn
          src={CloseIcon}
          alt=""
          onClick={() => {
            setStartRoutes(false)
          }}
          filterColor={filterColor}
        />
      </NewLabel>

      <Components>
        <PreviewComponent backColor={backColor} borderColor={borderColor}>
          <img src={VaultsIcon} width={30} height={30} alt="" />
        </PreviewComponent>
        <NewLabel display="flex" justifyContent="center" marginBottom="20px" marginTop="20px">
          <img src={ArrowDownIcon} width={25} height={25} alt="" />
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-around">
          <PreviewComponent backColor={backColor} borderColor={borderColor}>
            <img src={Swap2Icon} width={30} height={30} alt="" />
          </PreviewComponent>
          <PreviewComponent backColor={backColor} borderColor={borderColor}>
            <img src={Swap2Icon} width={30} height={30} alt="" />
          </PreviewComponent>
        </NewLabel>
        <NewLabel display="flex" justifyContent="center" marginBottom="20px" marginTop="20px">
          <img src={ArrowDownIcon} width={25} height={25} alt="" />
        </NewLabel>
        <PreviewComponent backColor={backColor} borderColor={borderColor}>
          <img src={Swap2Icon} width={30} height={30} alt="" />
        </PreviewComponent>
      </Components>
    </SelectTokenWido>
  )
}
export default WidoDepositStartRoutes
