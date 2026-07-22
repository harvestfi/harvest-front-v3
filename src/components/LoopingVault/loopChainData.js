import BigNumber from 'bignumber.js'
import { baseViem, newContractInstance, handleViemReadMethod } from '../../services/viem'
import TokenContract from '../../services/viem/contracts/token/contract.json'
import AavePoolContract from '../../services/viem/contracts/aave-pool/contract.json'
import AaveViewerContract from '../../services/viem/contracts/aave-viewer/contract.json'
import LoopStrategyContract from '../../services/viem/contracts/loop-strategy/contract.json'
import { CHAIN_IDS } from '../../data/constants'
import { DEFILLAMA_YIELDS_URL } from '../../constants'
import { stakingPoolIdForSymbol } from './loopHelpers'

export const fetchLoopStakingYield = async symbol => {
  const poolId = stakingPoolIdForSymbol(symbol)
  if (!poolId) return null
  try {
    const res = await fetch(`${DEFILLAMA_YIELDS_URL}/chart/${poolId}`)
    if (!res.ok) return null
    const json = await res.json()
    const rows = Array.isArray(json?.data) ? json.data : []
    if (!rows.length) return null
    const apy = Number(rows[rows.length - 1]?.apy)
    return Number.isFinite(apy) ? apy : null
  } catch (e) {
    return null
  }
}

/** Aave returns type(uint256).max when there is no debt. */
const parseHealthFactor = raw => {
  if (raw == null) return null
  const bn = new BigNumber(raw.toString())
  if (!bn.isFinite() || bn.lte(0) || bn.gte('1e40')) return null
  const n = bn.div(1e18).toNumber()
  return Number.isFinite(n) && n > 0 ? n : null
}

const settle = promise => promise.then(v => v).catch(() => null)

const read = async (address, abi, fn, args = []) => {
  const instance = await newContractInstance(null, address, abi, baseViem)
  if (!instance) return null
  return settle(handleViemReadMethod(fn, args, instance))
}

export const fetchLoopWalletBalance = async (account, tokenAddress, decimals = 18) => {
  if (!account || !tokenAddress) return 0
  try {
    const raw = await settle(
      baseViem.readContract({
        address: tokenAddress,
        abi: TokenContract.abi,
        functionName: 'balanceOf',
        args: [account],
      }),
    )
    if (raw == null) return 0
    return new BigNumber(raw.toString()).div(new BigNumber(10).pow(decimals)).toNumber()
  } catch (e) {
    return 0
  }
}

/** Poll until ERC-20 wallet balance changes from `previousBalance`. */
export const pollLoopWalletBalance = async (
  account,
  tokenAddress,
  decimals = 18,
  { retries = 5, delayMs = 1200, previousBalance = 0 } = {},
) => {
  let last = await fetchLoopWalletBalance(account, tokenAddress, decimals)
  for (let i = 0; i < retries; i += 1) {
    if (Math.abs((last || 0) - (previousBalance || 0)) > 1e-14) return last
    await new Promise(r => setTimeout(r, delayMs))
    last = await fetchLoopWalletBalance(account, tokenAddress, decimals)
  }
  return last
}

export const fetchLoopChainData = async ({
  strategyAddress,
  supplyAsset,
  borrowAsset,
  aavePool,
}) => {
  if (!strategyAddress || !supplyAsset || !borrowAsset || !aavePool) return null

  const poolAbi = AavePoolContract.abi
  const strategyAbi = LoopStrategyContract.abi
  const viewerAddress = AaveViewerContract.address
  const viewerAbi = AaveViewerContract.abi

  const [
    supplyReserve,
    borrowReserve,
    supplyPriceRaw,
    borrowPriceRaw,
    healthRaw,
    aaveAccount,
    targetHealthRaw,
    collFactorRaw,
    borrowTargetRaw,
    profitShareRaw,
    feeDenomRaw,
  ] = await Promise.all([
    read(aavePool, poolAbi, 'getReserveData', [supplyAsset]),
    read(aavePool, poolAbi, 'getReserveData', [borrowAsset]),
    read(viewerAddress, viewerAbi, 'getPrice', [supplyAsset, borrowAsset]),
    read(strategyAddress, strategyAbi, 'getBorrowPriceInSupply'),
    read(strategyAddress, strategyAbi, 'positionHealth'),
    read(aavePool, poolAbi, 'getUserAccountData', [strategyAddress]),
    read(strategyAddress, strategyAbi, 'targetHealth'),
    read(strategyAddress, strategyAbi, 'collateralFactorNumerator'),
    read(strategyAddress, strategyAbi, 'borrowTargetFactorNumerator'),
    read(strategyAddress, strategyAbi, 'profitSharingNumerator'),
    read(strategyAddress, strategyAbi, 'feeDenominator'),
  ])

  if (!supplyReserve || !borrowReserve) return null

  const aTokenAddr = supplyReserve.aTokenAddress || supplyReserve[8]
  const debtTokenAddr = borrowReserve.variableDebtTokenAddress || borrowReserve[10]

  const [collateralRaw, debtRaw] = await Promise.all([
    read(aTokenAddr, TokenContract.abi, 'balanceOf', [strategyAddress]),
    read(debtTokenAddr, TokenContract.abi, 'balanceOf', [strategyAddress]),
  ])

  const supplyPrice = new BigNumber(supplyPriceRaw?.toString() || '0').div(1e18)
  const borrowPriceInSupply =
    borrowPriceRaw != null ? new BigNumber(borrowPriceRaw.toString()).div(1e18) : new BigNumber(1)

  const collateral = new BigNumber(collateralRaw?.toString() || '0').div(1e18)
  const debtInBorrow = new BigNumber(debtRaw?.toString() || '0').div(1e18)
  const debtInSupply = debtInBorrow.times(borrowPriceInSupply)

  const collateralValue = collateral.times(supplyPrice.gt(0) ? supplyPrice : 1)
  const debtValue = debtInBorrow
  const netValue = collateralValue.minus(debtValue)

  let leverage = 1,
    ltv = 0,
    liquidationLtv = 0.95,
    suppliedMul = 1,
    borrowedMul = 0
  if (collateralValue.gt(0)) {
    ltv = debtValue.div(collateralValue).toNumber()
    if (netValue.gt(0)) {
      leverage = collateralValue.div(netValue).toNumber()
    }
  }

  const feeDenom = new BigNumber(feeDenomRaw?.toString() || '1000')
  const collFactor = feeDenom.gt(0)
    ? new BigNumber(collFactorRaw?.toString() || '0').div(feeDenom).toNumber()
    : 0
  const borrowTarget = feeDenom.gt(0)
    ? new BigNumber(borrowTargetRaw?.toString() || '0').div(feeDenom).toNumber()
    : 0
  const profitSharePct =
    feeDenom.gt(0) && profitShareRaw != null
      ? new BigNumber(profitShareRaw.toString()).div(feeDenom).times(100).toNumber()
      : 10

  // Strategy positionHealth() currently reverts; fall back to Aave, then LTV math.
  const aaveHfRaw = aaveAccount?.healthFactor ?? aaveAccount?.[5]
  // eslint-disable-next-line one-var
  let healthFactor = parseHealthFactor(healthRaw) ?? parseHealthFactor(aaveHfRaw)
  if (healthFactor == null && ltv > 0 && collFactor > 0) {
    healthFactor = collFactor / ltv
  }

  const targetHealth = parseHealthFactor(targetHealthRaw)

  const rebalanceTrigger =
    targetHealth != null ? Math.max(1.001, Number((targetHealth - 0.035).toFixed(3))) : 1.025
  const forcedDeleverage =
    targetHealth != null ? Math.max(1.001, Number((targetHealth - 0.045).toFixed(3))) : 1.015

  liquidationLtv = collFactor > 0 ? collFactor : 0.95
  if (healthFactor != null && healthFactor > 0 && ltv > 0) {
    liquidationLtv = Math.min(0.99, ltv * healthFactor)
  } else if (borrowTarget > 0) {
    liquidationLtv = Math.max(borrowTarget + 0.02, liquidationLtv)
  }

  const supplyRate = new BigNumber(
    supplyReserve.currentLiquidityRate?.toString() || supplyReserve[2]?.toString() || '0',
  )
    .div(1e27)
    .times(100)
    .toNumber()
  const borrowRate = new BigNumber(
    borrowReserve.currentVariableBorrowRate?.toString() || borrowReserve[4]?.toString() || '0',
  )
    .div(1e27)
    .times(100)
    .toNumber()

  if (netValue.gt(0)) {
    suppliedMul = collateralValue.div(netValue).toNumber()
    borrowedMul = debtValue.div(netValue).toNumber()
  } else if (leverage > 1) {
    suppliedMul = leverage
    borrowedMul = leverage - 1
  }

  return {
    collateral: collateral.toNumber(),
    debt: debtInBorrow.toNumber(),
    debtInSupply: debtInSupply.toNumber(),
    collateralValue: collateralValue.toNumber(),
    debtValue: debtValue.toNumber(),
    netValue: netValue.toNumber(),
    ltv,
    targetLtv: borrowTarget,
    liquidationLtv,
    leverage,
    healthFactor,
    targetHealth,
    rebalanceTrigger,
    forcedDeleverage,
    liquidationHf: 1.0,
    profitSharePct,
    supplyPrice: supplyPrice.toNumber(),
    borrowPriceInSupply: borrowPriceInSupply.toNumber(),
    supplyRate,
    borrowRate,
    suppliedMul,
    borrowedMul,
    chainId: CHAIN_IDS.BASE,
  }
}

export default fetchLoopChainData
