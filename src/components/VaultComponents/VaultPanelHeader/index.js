import React from 'react'
import { find, get } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { usePools } from '../../../providers/Pools'
import { useVaults } from '../../../providers/Vault'
import DesktopPanelHeader from './Desktop'
import MobilePanelHeader from './Mobile'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../../constants'

const { tokens } = require('../../../data')

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

  const lsdToken =
    tokenSymbol.toLowerCase().includes('steth') ||
    tokenSymbol.toLowerCase().includes('reth') ||
    tokenSymbol.toLowerCase().includes('crvusd') ||
    (get(token, 'tokenNames') && token.tokenNames.join(', ').toLowerCase().includes('steth')) ||
    (get(token, 'tokenNames') && token.tokenNames.join(', ').toLowerCase().includes('reth')) ||
    (get(token, 'tokenNames') && token.tokenNames.join(', ').toLowerCase().includes('crvusd')) ||
    (get(token, 'subLabel') && token.subLabel.toLowerCase().includes('steth')) ||
    (get(token, 'subLabel') && token.subLabel.toLowerCase().includes('reth')) ||
    (get(token, 'subLabel') && token.subLabel.toLowerCase().includes('crvusd')) ||
    (get(tokenSymbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : token, 'platform')[0] &&
      (tokenSymbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : token).platform[0]
        .toLowerCase()
        .includes('steth')) ||
    (get(tokenSymbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : token, 'platform')[0] &&
      (tokenSymbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : token).platform[0]
        .toLowerCase()
        .includes('reth')) ||
    (get(tokenSymbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : token, 'platform')[0] &&
      (tokenSymbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : token).platform[0]
        .toLowerCase()
        .includes('crvusd'))

  const componentsProps = {
    token,
    tokenSymbol,
    useIFARM,
    vaultPool,
    isSpecialVault,
    multipleAssets,
    loadedVault,
    loadingFarmingBalance,
    lsdToken,
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
