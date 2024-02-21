import React from 'react'
import VaultList from '../../components/CamelotComponents/VaultList'
import Notification from '../../components/CamelotComponents/Notification'
import { useThemeContext } from '../../providers/useThemeContext'
import { FarmContainer, NotificationCenter } from './style'
import CamelotBG from '../../assets/images/logos/camelot/camelot_bg.svg'
import CamelotMobile from '../../assets/images/logos/camelot/camelot_mobile.svg'

const Farm = () => {
  const { pageBackColor } = useThemeContext()
  return (
    <FarmContainer pageBackColor={pageBackColor}>
      <img className="camelot-bg" src={CamelotBG} width="100%" alt="" />
      <img className="camelot-mobile" src={CamelotMobile} width="100%" alt="" />
      <NotificationCenter>
        <Notification />
      </NotificationCenter>
      <div className="camelot-main">
        <VaultList />
      </div>
    </FarmContainer>
  )
}

export default Farm
