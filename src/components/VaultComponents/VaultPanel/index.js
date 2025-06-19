import { find, isEmpty } from 'lodash'
import React, { useEffect } from 'react'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import VaultPanelHeader from '../VaultPanelHeader'
import VaultContainer from './style'

const { tokens } = require('../../../data')

const VaultPanel = ({ token, loaded, tokenSymbol, tokenNum, vaultsCount, ...props }) => {
  const { hoverColor } = useThemeContext()
  const { pools, userStats, vaultLoading, setVaultLoading } = usePools()
  const { account, logout, chainId } = useWallet()

  const vaultPool = find(pools, pool => pool.collateralAddress === tokens[tokenSymbol].vaultAddress)

  useEffect(() => {
    if (logout) {
      setVaultLoading(true)
      return
    }
    setVaultLoading(true)
  }, [logout, chainId, setVaultLoading])

  useEffect(() => {
    if (account && vaultPool && !isEmpty(userStats) && vaultLoading) {
      setVaultLoading(false)
    }
  }, [account, vaultPool, userStats, vaultLoading, setVaultLoading])

  return (
    <>
      <VaultContainer $hovercolor={hoverColor} $lastelement={vaultsCount === tokenNum}>
        <VaultPanelHeader
          token={token}
          tokenSymbol={tokenSymbol}
          loadedVault={loaded}
          vaultPool={vaultPool}
          {...props}
        />
      </VaultContainer>
    </>
  )
}

export default VaultPanel
