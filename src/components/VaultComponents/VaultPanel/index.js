import { find, isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FARM_TOKEN_SYMBOL } from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useVaults } from '../../../providers/Vault'
import { useWallet } from '../../../providers/Wallet'
import VaultPanelHeader from '../VaultPanelHeader'
import VaultContainer from './style'

const { tokens } = require('../../../data')

const VaultPanel = ({ token, loaded, tokenSymbol, tokenNum, vaultsCount, ...props }) => {
  const { hoverColor } = useThemeContext()
  const { pools, fetchUserPoolStats, userStats, vaultLoading, setVaultLoading } = usePools()
  const { account, logout, chainId } = useWallet()
  const { vaultsData } = useVaults()

  const isSpecialVault = token.poolVault

  const vaultPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === tokens[tokenSymbol].vaultAddress)

  const [useIFARM] = useState(tokenSymbol === FARM_TOKEN_SYMBOL)

  useEffect(() => {
    if (logout) {
      setVaultLoading(true)
      return
    }
    setVaultLoading(true)
  }, [logout, chainId, setVaultLoading])

  useEffect(() => {
    if (account && vaultPool && !isEmpty(userStats) && useIFARM && vaultLoading) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = [vaultPool]

        await fetchUserPoolStats(poolsToLoad, account, userStats)
        setVaultLoading(false)
      }
      loadUserPoolsStats()
    }
  }, [
    account,
    setVaultLoading,
    vaultPool,
    fetchUserPoolStats,
    pools,
    vaultsData,
    tokenSymbol,
    userStats,
    useIFARM,
    vaultLoading,
  ])

  return (
    <>
      <VaultContainer $hovercolor={hoverColor} $lastelement={vaultsCount === tokenNum}>
        <VaultPanelHeader
          token={token}
          tokenSymbol={tokenSymbol}
          useIFARM={useIFARM}
          isSpecialVault={isSpecialVault}
          loadedVault={loaded}
          {...props}
        />
      </VaultContainer>
    </>
  )
}

export default VaultPanel
