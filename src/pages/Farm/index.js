import React from 'react'
import VaultList from '../../components/VaultComponents/VaultList'
import { useThemeContext } from '../../providers/useThemeContext'
import FarmContainer from './style'

const Farm = ({ defaultAsset = '' }) => {
  const { bgColorNew } = useThemeContext()

  return (
    <FarmContainer $bgcolor={bgColorNew}>
      <VaultList defaultAsset={defaultAsset} />
    </FarmContainer>
  )
}

export default Farm
