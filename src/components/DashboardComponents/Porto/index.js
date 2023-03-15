import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container } from './style'
import { directDetailUrl } from '../../../constants'
import DashboardBack from '../../../assets/images/logos/dashboard/dashboard-back-min.png'
import ProfitSharingIcon from '../../../assets/images/logos/dashboard/profit_sharing.svg'

const Porto = () => {
  const { boxShadowColor } = useThemeContext()
  return (
    <Container boxShadowColor={boxShadowColor} href={directDetailUrl + "FARM"}>
      <img className="dash-back" src={DashboardBack} width={"100%"} height="180px" alt="" />
      <div className='title'>Discover</div>

      <div className='feature'>
        <img src={ProfitSharingIcon} alt="" />
        Profit Sharing
      </div>
    </Container>
  )
}

export default Porto
