import React from 'react'
import { Icon, NotificationMain } from './style'
import closeImg from '../../../assets/images/logos/close.svg'
import AnnounceImg from '../../../assets/images/logos/camelot/announce_img.svg'
import { useThemeContext } from '../../../providers/useThemeContext'

const Notification = () => {
  const newNotify = localStorage.getItem('newNotify')
  const { openNotify, setOpenNotify } = useThemeContext()

  React.useEffect(() => {
    if (newNotify === null || newNotify === 'true') {
      localStorage.setItem('newNotify', true)
      setOpenNotify(true)
    } else {
      setOpenNotify(false)
    }
  }, [newNotify, setOpenNotify])

  return (
    <NotificationMain status={openNotify ? '0' : '1'}>
      <div className="left-part">
        <img className="main-img" src={AnnounceImg} alt="" />
        <div className="main-desc">
          Read about our collaboration with Camelot to bring DeFi&apos;s first farms on top of their
          liquidity pools.
        </div>
      </div>
      <div className="right-part">
        <button
          className="announcement"
          type="button"
          onClick={() => {
            window.open(
              'https://medium.com/harvest-finance/harvest-launches-dedicated-farming-section-for-camelot-11895f3f8ca0',
              '_blank',
            )
          }}
        >
          Announcement
        </button>
        <div className="close">
          <Icon
            src={closeImg}
            alt="close"
            cursor="pointer"
            onClick={() => {
              localStorage.setItem('newNotify', false)
              setOpenNotify(false)
            }}
          />
        </div>
      </div>
    </NotificationMain>
  )
}

export default Notification
