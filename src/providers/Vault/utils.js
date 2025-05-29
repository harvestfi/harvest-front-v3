import BigNumber from 'bignumber.js'
import { forEach } from 'promised-loops'
import { find } from 'lodash'
import { FARM_GRAIN_TOKEN_SYMBOL, FARM_TOKEN_SYMBOL, FARM_WETH_TOKEN_SYMBOL } from '../../constants'

export const calculateTotalValueDeposited = async vaults => {
  let totalDeposited = new BigNumber(0)

  await forEach(Object.keys(vaults), async vaultSymbol => {
    const { usdPrice, decimals, underlyingBalanceWithInvestment } = vaults[vaultSymbol]
    const tokenPriceInUSD = new BigNumber(usdPrice)

    totalDeposited = totalDeposited.plus(
      new BigNumber(underlyingBalanceWithInvestment)
        .multipliedBy(tokenPriceInUSD)
        .dividedBy(new BigNumber(10).exponentiatedBy(Number(decimals))),
    )
  })

  return totalDeposited
}

export const calculateFarmingBalance = async (pools, userStats, vaultSymbol, vaultsData) => {
  let farmedBalance = '0'
  if (!vaultsData[vaultSymbol]) return '0'
  const { pricePerFullShare, decimals } = vaultsData[vaultSymbol]

  try {
    const userBalanceInVault = new BigNumber(
      userStats[vaultSymbol] && userStats[vaultSymbol].lpTokenBalance,
    )

    const userBalanceInPool = new BigNumber(
      userStats[vaultSymbol] && userStats[vaultSymbol].totalStaked,
    )

    const underlyingPoolBalanceForHolder = new BigNumber(userBalanceInPool.plus(userBalanceInVault))
      .times(pricePerFullShare)
      .dividedBy(10 ** decimals)

    farmedBalance = underlyingPoolBalanceForHolder.toFixed()
  } catch (err) {
    console.error(err)
    console.log('vaultSymbol: ', vaultSymbol)
    farmedBalance = 'error'
  }

  return farmedBalance
}

export const filterVaults = selectedVaults =>
  selectedVaults.filter(
    vaultSymbol =>
      vaultSymbol !== FARM_TOKEN_SYMBOL &&
      vaultSymbol !== FARM_WETH_TOKEN_SYMBOL &&
      vaultSymbol !== FARM_GRAIN_TOKEN_SYMBOL,
  )
