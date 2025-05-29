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
import { formatNumber, parseValue } from '../../../../utilities/formats'
import AnimatedDots from '../../../AnimatedDots'
import { useWallet } from '../../../../providers/Wallet'
import { useContracts } from '../../../../providers/Contracts'
import { Monospace } from '../../../GlobalStyle'
import { usePools } from '../../../../providers/Pools'
import { useRate } from '../../../../providers/Rate'

const VaultUserBalance = ({
  token,
  tokenSymbol,
  multipleAssets,
  isSpecialVault,
  loadingFarmingBalance,
  vaultPool,
  loadedVault,
  useIFARM,
  fontColor1,
}) => {
  const { vaultsData, farmingBalances } = useVaults()
  const { contracts } = useContracts()
  const { account, connected } = useWallet()
  const { userStats } = usePools()
  const [userVaultBalance, setUserVaultBalance] = useState(null)
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    const getBalance = async () => {
      let bal
      if (tokenSymbol === FARM_TOKEN_SYMBOL) {
        if (userStats['profit-sharing-farm']) {
          bal = new BigNumber(userStats['profit-sharing-farm']['lpTokenBalance'])
            .times(get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0))
            .div(1e18)
            .toFixed()
        } else {
          bal = 0
        }
      } else {
        bal = farmingBalances[tokenSymbol]
      }
      setUserVaultBalance(bal)
    }

    console.log(tokenSymbol, userVaultBalance)

    getBalance()
  }, [vaultsData, token, tokenSymbol, farmingBalances, account, userStats])

  const isLoadingUserBalance =
    loadedVault === false || loadingFarmingBalance || userVaultBalance === false

  return (
    <Monospace
      // $borderbottom={connected && !isLoadingUserBalance && multipleAssets && '1px dotted black'}
      $fontweight="500"
      className="farm-balance-span"
      $fontcolor1={fontColor1}
    >
      {!connected ? (
        ''
      ) : isLoadingUserBalance ? (
        <AnimatedDots />
      ) : (
        <>
          {currencySym}
          {`${formatNumber(
            new BigNumber(
              fromWei(
                parseValue(userVaultBalance),
                isSpecialVault ? 18 : token.decimals,
                MAX_DECIMALS,
              ),
            )
              .multipliedBy((isSpecialVault ? token.data.lpTokenData.price : token.usdPrice) || 1)
              .multipliedBy(new BigNumber(currencyRate))
              .toString(),
            2,
          )}`}
        </>
      )}
    </Monospace>
  )
}

export default VaultUserBalance
