import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { MAX_DECIMALS } from '../../../../constants'
import { useVaults } from '../../../../providers/Vault'
import { fromWei } from '../../../../services/web3'
import { formatNumber, parseValue } from '../../../../utilities/formats'
import AnimatedDots from '../../../AnimatedDots'
import { useWallet } from '../../../../providers/Wallet'
import { Monospace } from '../../../GlobalStyle'
import { useRate } from '../../../../providers/Rate'

const VaultUserBalance = ({
  token,
  tokenSymbol,
  isSpecialVault,
  loadingFarmingBalance,
  loadedVault,
  fontColor1,
}) => {
  const { farmingBalances } = useVaults()
  const { connected } = useWallet()
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
      let bal = farmingBalances[tokenSymbol]
      setUserVaultBalance(bal)
    }

    getBalance()
  }, [tokenSymbol, farmingBalances])

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
