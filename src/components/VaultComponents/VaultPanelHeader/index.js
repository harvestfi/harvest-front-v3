import React from 'react'
import { find, get } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { usePools } from '../../../providers/Pools'
import { useVaults } from '../../../providers/Vault'
import DesktopPanelHeader from './Desktop'
import MobilePanelHeader from './Mobile'

const VaultPanelHeader = ({
  token,
  tokenSymbol,
  useIFARM,
  isSpecialVault,
  multipleAssets,
  loadedVault,
  loadingFarmingBalance,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { pools } = usePools()
  const { vaultsData } = useVaults()

  let vaultPool

  const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

  if (isSpecialVault) {
    vaultPool = token.data
  } else {
    vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
  }

  const componentsProps = {
    token,
    tokenSymbol,
    useIFARM,
    vaultPool,
    isSpecialVault,
    multipleAssets,
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
