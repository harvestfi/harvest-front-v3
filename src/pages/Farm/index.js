import React from 'react'
import { FarmContainer } from './style'
import VaultList from '../../components/VaultComponents/VaultList'
import { useThemeContext } from '../../providers/useThemeContext'

const Farm = () => {
  const { pageBackColor } = useThemeContext()
  return (
    <FarmContainer pageBackColor={pageBackColor}>
      <VaultList />
    </FarmContainer>
  )
}

export default Farm
