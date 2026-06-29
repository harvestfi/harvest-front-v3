import BigNumber from 'bignumber.js'
import { baseViem, newContractInstance, handleViemReadMethod } from '../../services/viem'
import TokenContract from '../../services/viem/contracts/token/contract.json'
import TokenMethods from '../../services/viem/contracts/token/methods'
import { CHAIN_IDS } from '../../data/constants'

const AAVE_VIEWER = '0x1e51654aB193bA165b7F7715C734dAF454f08148'

const POOL_ABI = [
  {
    inputs: [{ name: 'asset', type: 'address' }],
    name: 'getReserveData',
    outputs: [
      {
        components: [
          { name: 'configuration', type: 'uint256' },
          { name: 'liquidityIndex', type: 'uint128' },
          { name: 'currentLiquidityRate', type: 'uint128' },
          { name: 'variableBorrowIndex', type: 'uint128' },
          { name: 'currentVariableBorrowRate', type: 'uint128' },
          { name: 'currentStableBorrowRate', type: 'uint128' },
          { name: 'lastUpdateTimestamp', type: 'uint40' },
          { name: 'id', type: 'uint16' },
          { name: 'aTokenAddress', type: 'address' },
          { name: 'stableDebtTokenAddress', type: 'address' },
          { name: 'variableDebtTokenAddress', type: 'address' },
          { name: 'interestRateStrategyAddress', type: 'address' },
          { name: 'accruedToTreasury', type: 'uint128' },
          { name: 'unbacked', type: 'uint128' },
          { name: 'isolationModeTotalDebt', type: 'uint128' },
        ],
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const STRATEGY_ABI = [
  {
    inputs: [],
    name: 'positionHealth',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'targetHealth',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collateralFactorNumerator',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'borrowTargetFactorNumerator',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'profitSharingNumerator',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeDenominator',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBorrowPriceInSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const VIEWER_ABI = [
  {
    inputs: [
      { name: 'assetToken', type: 'address' },
      { name: 'quoteToken', type: 'address' },
    ],
    name: 'getPrice',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const settle = promise => promise.then(v => v).catch(() => null)

const read = async (address, abi, fn, args = []) => {
  const instance = await newContractInstance(null, address, abi, baseViem)
  if (!instance) return null
  return settle(handleViemReadMethod(fn, args, instance))
}

export const fetchLoopWalletBalance = async (account, tokenAddress, decimals = 18) => {
  if (!account || !tokenAddress) return 0
  try {
    const nativeBal = await baseViem.getBalance({ address: account })
    const instance = await newContractInstance(null, tokenAddress, TokenContract.abi, baseViem)
    if (!instance) return Number(nativeBal) / 10 ** decimals
    const raw = await settle(TokenMethods.getBalance(account, instance))
    return raw == null ? Number(nativeBal) / 10 ** decimals : Number(raw) / 10 ** decimals
  } catch (e) {
    return 0
  }
}

export const fetchLoopChainData = async ({
  strategyAddress,
  supplyAsset,
  borrowAsset,
  aavePool,
}) => {
  if (!strategyAddress || !supplyAsset || !borrowAsset || !aavePool) return null

  const [
    supplyReserve,
    borrowReserve,
    supplyPriceRaw,
    borrowPriceRaw,
    healthRaw,
    targetHealthRaw,
    collFactorRaw,
    borrowTargetRaw,
    profitShareRaw,
    feeDenomRaw,
  ] = await Promise.all([
    read(aavePool, POOL_ABI, 'getReserveData', [supplyAsset]),
    read(aavePool, POOL_ABI, 'getReserveData', [borrowAsset]),
    read(AAVE_VIEWER, VIEWER_ABI, 'getPrice', [supplyAsset, borrowAsset]),
    read(strategyAddress, STRATEGY_ABI, 'getBorrowPriceInSupply'),
    read(strategyAddress, STRATEGY_ABI, 'positionHealth'),
    read(strategyAddress, STRATEGY_ABI, 'targetHealth'),
    read(strategyAddress, STRATEGY_ABI, 'collateralFactorNumerator'),
    read(strategyAddress, STRATEGY_ABI, 'borrowTargetFactorNumerator'),
    read(strategyAddress, STRATEGY_ABI, 'profitSharingNumerator'),
    read(strategyAddress, STRATEGY_ABI, 'feeDenominator'),
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

  let leverage = 1
  let ltv = 0
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

  const healthFactor =
    healthRaw != null ? new BigNumber(healthRaw.toString()).div(1e18).toNumber() : null
  const targetHealth =
    targetHealthRaw != null ? new BigNumber(targetHealthRaw.toString()).div(1e18).toNumber() : null

  const rebalanceTrigger =
    targetHealth != null ? Math.max(1.001, Number((targetHealth - 0.035).toFixed(3))) : 1.025
  const forcedDeleverage =
    targetHealth != null ? Math.max(1.001, Number((targetHealth - 0.045).toFixed(3))) : 1.015

  let liquidationLtv = collFactor > 0 ? collFactor : 0.95
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
    borrowReserve.currentVariableBorrowRate?.toString() ||
      borrowReserve[4]?.toString() ||
      '0',
  )
    .div(1e27)
    .times(100)
    .toNumber()

  let suppliedMul = 1
  let borrowedMul = 0
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
