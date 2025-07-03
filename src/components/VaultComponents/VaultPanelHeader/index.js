import React from 'react'
import { useMediaQuery } from 'react-responsive'
import DesktopPanelHeader from './Desktop'
import MobilePanelHeader from './Mobile'

const VaultPanelHeader = ({
  token,
  tokenSymbol,
  loadedVault,
  vaultPool,
  loadingFarmingBalance,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const componentsProps = {
    token,
    tokenSymbol,
    vaultPool,
    loadedVault,
    loadingFarmingBalance,
  }

  return (
    <>
      {isMobile ? (
        <MobilePanelHeader {...componentsProps} />
      ) : (
        <DesktopPanelHeader {...componentsProps} />
      )}
    </>
  )
}

export default VaultPanelHeader
