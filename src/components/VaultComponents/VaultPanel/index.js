import React, { useState, useMemo, useEffect } from 'react'
import { isArray, find, isEmpty } from 'lodash'
import { useThemeContext } from '../../../providers/useThemeContext'
import { VaultContainer } from './style'
import VaultPanelHeader from '../VaultPanelHeader'
import { FARM_TOKEN_SYMBOL } from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useWallet } from '../../../providers/Wallet'
import { useVaults } from '../../../providers/Vault'

const { tokens } = require('../../../data')

const VaultPanel = ({ token, loaded, tokenSymbol, tokenNum, vaultsCount, ...props }) => {
  const { vaultPanelHoverColor } = useThemeContext()
  const { pools, fetchUserPoolStats, userStats, vaultLoading, setVaultLoading } = usePools()
  const { account, logout, chainId } = useWallet()
  const { vaultsData } = useVaults()
  const [loadingFarmingBalance] = useState(false)
  // const [vaultLoading, setVaultLoading] = useState(true)

  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const fAssetPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === tokens[tokenSymbol].vaultAddress)

  const [useIFARM] = useState(tokenSymbol === FARM_TOKEN_SYMBOL)

  const multipleAssets = useMemo(
    () =>
      isArray(tokens[tokenSymbol].tokenAddress) &&
      tokens[tokenSymbol].tokenAddress.map(address => {
        const selectedSymbol = Object.keys(tokens).find(
          symbol =>
            !isArray(tokens[symbol].tokenAddress) &&
            tokens[symbol].tokenAddress.toLowerCase() === address.toLowerCase(),
        )
        return selectedSymbol
      }),
    [tokenSymbol],
  )

  useEffect(() => {
    if(logout) {
      setVaultLoading(true)
      return
    }
    setVaultLoading(true)
  }, [logout, chainId, setVaultLoading])

  useEffect(() => {
    if (
      account &&
      fAssetPool &&
      !isEmpty(userStats) &&
      useIFARM &&
      vaultLoading
    ) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = [fAssetPool]

        await fetchUserPoolStats(poolsToLoad, account, userStats)
        setVaultLoading(false)
      }
      loadUserPoolsStats()
    }
  }, [
    account,
    setVaultLoading,
    fAssetPool,
    fetchUserPoolStats,
    pools,
    vaultsData,
    tokenSymbol,
    userStats,
    useIFARM,
    vaultLoading
  ])

  return (
    <>
      <VaultContainer hoverColor={vaultPanelHoverColor} lastElement={vaultsCount === tokenNum ? true : false}>
        <VaultPanelHeader
          isSpecialVault={isSpecialVault}
          token={token}
          tokenSymbol={tokenSymbol}
          useIFARM={useIFARM}
          loadingFarmingBalance={loadingFarmingBalance}
          loadedVault={loaded}
          multipleAssets={multipleAssets}
          {...props}
        />
      </VaultContainer>
    </>
  )
}

export default VaultPanel
