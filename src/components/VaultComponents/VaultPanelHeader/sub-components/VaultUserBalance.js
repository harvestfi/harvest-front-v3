import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import {
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  MAX_DECIMALS,
} from '../../../../constants'
import { useVaults } from '../../../../providers/Vault'
import { fromWei } from '../../../../services/web3'
import { formatNumber, getUserVaultBalance, parseValue } from '../../../../utils'
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
  useIFARM,
}) => {
  const { vaultsData, farmingBalances } = useVaults()
  const { connected, balances } = useWallet()
  const { userStats } = usePools()
  const [userVaultBalance, setUserVaultBalance] = useState(null)

  const tokenDecimals = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.decimals`, 0)
    : token.decimals
  const tempPricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)
  const pricePerFullShare = fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals)

  useEffect(() => {
    let iFARMBalance
    if (tokenSymbol === FARM_TOKEN_SYMBOL) {
      iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
    }

    const totalStaked = get(userStats, `[${get(vaultPool, 'id')}]['totalStaked']`, 0)
    setUserVaultBalance(
      getUserVaultBalance(tokenSymbol, farmingBalances, totalStaked, iFARMBalance),
    )
  }, [vaultsData, tokenSymbol, vaultPool, userStats, farmingBalances, balances])

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
      // borderBottom={connected && !isLoadingUserBalance && multipleAssets && '1px dotted black'}
      fontWeight="500"
      className="farm-balance-span"
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
                new BigNumber(fromWei(parseValue(userVaultBalance), token.decimals, MAX_DECIMALS))
                  .multipliedBy(token.usdPrice || 1)
                  .toString(),
                2,
              )}`
            : formatNumber(
                new BigNumber(
                  fromWei(
                    parseValue(userVaultBalance),
                    isSpecialVault ? get(token, 'data.watchAsset.decimals', 18) : token.decimals,
                    MAX_DECIMALS,
                  ),
                )
                  .multipliedBy(
                    (tokenSymbol === FARM_TOKEN_SYMBOL
                      ? token.data.lpTokenData.price * pricePerFullShare
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
