import React from 'react'
import { Icon, NotificationMain } from './style'
import closeImg from '../../../assets/images/logos/close.svg'
import AnnounceImg from '../../../assets/images/logos/camelot/announce_img.svg'

const Notification = () => {
  return (
    <NotificationMain>
      <div className="left-part">
        <img className="main-img" src={AnnounceImg} alt="" />
        <div className="main-desc">
          Harvest partnered with Camelot to offer tailored farms for its LPs. Maximize APY today
          with farms in this section.
        </div>
      </div>
      <div className="right-part">
        <button className="announcement" type="button">
          Announcement
        </button>
        <div className="close">
          <Icon src={closeImg} alt="close" cursor="pointer" onClick={() => {}} />
        </div>
      </div>
    </NotificationMain>
  )
}

export default Notification
