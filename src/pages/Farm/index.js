import React from 'react'
import VaultList from '../../components/VaultComponents/VaultList'
import { useThemeContext } from '../../providers/useThemeContext'
import FarmContainer from './style'

const Farm = () => {
  const { pageBackColor } = useThemeContext()
  return (
    <FarmContainer pageBackColor={pageBackColor}>
      <VaultList />
    </FarmContainer>
  )
}

export default Farm
