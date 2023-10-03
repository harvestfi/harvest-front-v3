import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../../../constants'
import { useVaults } from '../../../../providers/Vault'
import { tokens } from '../../../../data'
import { fromWei } from '../../../../services/web3'
import { convertAmountToFARM, formatNumber, getUserVaultBalance } from '../../../../utils'
import AnimatedDots from '../../../AnimatedDots'
import { useWallet } from '../../../../providers/Wallet'
import { Monospace } from '../../../GlobalStyle'
import { usePools } from '../../../../providers/Pools'

const VaultUserBalance = ({
  token,
  tokenSymbol,
  multipleAssets,
  isSpecialVault,
  loadingFarmingBalance,
  vaultPool,
  loadedVault,
}) => {
  const { vaultsData, farmingBalances } = useVaults()
  const { connected, balances } = useWallet()
  const { userStats } = usePools()
  const [iFARMinFARM, setIFARMinFARM] = useState(null)
  const [userVaultBalance, setUserVaultBalance] = useState(null)

  useEffect(() => {
    if (tokenSymbol === FARM_TOKEN_SYMBOL) {
      const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
      setIFARMinFARM(
        convertAmountToFARM(
          IFARM_TOKEN_SYMBOL,
          iFARMBalance,
          tokens[FARM_TOKEN_SYMBOL].decimals,
          vaultsData,
        ),
      )
    }

    const totalStaked = get(userStats, `[${get(vaultPool, 'id')}]['totalStaked']`, 0)
    setUserVaultBalance(getUserVaultBalance(tokenSymbol, farmingBalances, totalStaked, iFARMinFARM))
  }, [vaultsData, tokenSymbol, vaultPool, userStats, farmingBalances, balances, iFARMinFARM])

  const isLoadingUserBalance =
    loadedVault === false ||
    loadingFarmingBalance ||
    (isSpecialVault
      ? connected &&
        (!token.data ||
          !get(userStats, `[${token.data.id}]['totalStaked']`) ||
          (token.data.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
            !balances[IFARM_TOKEN_SYMBOL]))
      : userVaultBalance === false)

  return (
    <Monospace
      borderBottom={connected && !isLoadingUserBalance && multipleAssets && '1px dotted black'}
      fontWeight="600"
    >
      {!connected ? (
        ''
      ) : isLoadingUserBalance ? (
        <AnimatedDots />
      ) : (
        <>
          $
          {multipleAssets
            ? `${formatNumber(
                new BigNumber(fromWei(userVaultBalance, token.decimals, 3))
                  .multipliedBy(token.usdPrice || 1)
                  .toString(),
                2,
              )}`
            : formatNumber(
                new BigNumber(
                  fromWei(
                    userVaultBalance,
                    isSpecialVault ? get(token, 'data.watchAsset.decimals', 18) : token.decimals,
                    5,
                  ),
                )
                  .multipliedBy(
                    (tokenSymbol === FARM_TOKEN_SYMBOL
                      ? token.data.lpTokenData.price
                      : token.usdPrice) || 1,
                  )
                  .toString(),
                2,
              )}
        </>
      )}
    </Monospace>
  )
}

export default VaultUserBalance
