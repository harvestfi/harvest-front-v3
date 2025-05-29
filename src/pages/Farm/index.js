import React, { useEffect } from 'react'
import VaultList from '../../components/VaultComponents/VaultList'
import { useThemeContext } from '../../providers/useThemeContext'
import FarmContainer from './style'

const Farm = () => {
  const { bgColorNew } = useThemeContext()

  useEffect(() => {
    const setUrlData = () => {
      const params = new URLSearchParams(window.location.search)
    }

    setUrlData()
  }, [window.location.search])
  return (
    <FarmContainer $bgcolor={bgColorNew}>
      <VaultList />
    </FarmContainer>
  )
}

export default Farm
