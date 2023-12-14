import React, { useEffect, useState } from 'react'
import VaultList from '../../components/VaultComponents/VaultList'
import { useThemeContext } from '../../providers/useThemeContext'
import BswapBG from '../../assets/images/logos/bswap_bg.png'
import FarmContainer from './style'

const Farm = () => {
  const { pageBackColor } = useThemeContext()
  const [baseswapBG, setBaseswapBG] = useState(false)

  const handleNetworkChange = () => {
    window.location.reload() // Reload the page when the network changes
  }

  useEffect(() => {
    if (window.ethereum) {
      // Listen for network changes
      window.ethereum.on('chainChanged', handleNetworkChange)

      return () => {
        // Cleanup: Remove the event listener when the component unmounts
        window.ethereum.removeListener('chainChanged', handleNetworkChange)
      }
    }
    return () => {}
  }, [])

  useEffect(() => {
    const setUrlData = () => {
      const params = new URLSearchParams(window.location.search)
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of params.entries()) {
        if (key === 'search') {
          if (value.toLowerCase() === 'baseswap') {
            setBaseswapBG(true)
          } else {
            setBaseswapBG(false)
          }
        } else {
          setBaseswapBG(false)
        }
      }
    }

    setUrlData()
  }, [window.location.search]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <FarmContainer pageBackColor={pageBackColor}>
      {baseswapBG ? <img className="bswap-bg" src={BswapBG} width="100%" alt="" /> : <></>}
      <VaultList />
    </FarmContainer>
  )
}

export default Farm
