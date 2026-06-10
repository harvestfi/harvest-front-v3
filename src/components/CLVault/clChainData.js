/* eslint-disable one-var */
import ClVaultContract from '../../services/viem/contracts/cl-vault/contract.json'
import ClVaultMethods from '../../services/viem/contracts/cl-vault/methods'
import TokenContract from '../../services/viem/contracts/token/contract.json'
import TokenMethods from '../../services/viem/contracts/token/methods'
import { baseViem, getViem, newContractInstance } from '../../services/viem'
import { CHAIN_IDS } from '../../data/constants'

const settle = promise => promise.then(value => value).catch(() => null)

const isNativeToken = tk => typeof tk?.symbol === 'string' && tk.symbol.toUpperCase() === 'ETH'

export const fetchCLWalletBalances = async (account, token0, token1) => {
  const empty = { token0: 0, token1: 0 }
  if (!account || !token0 || !token1) return empty

  const readErc20 = async tk => {
    if (!tk.address) return 0
    const instance = await newContractInstance(null, tk.address, TokenContract.abi, baseViem)
    if (!instance) return 0
    const raw = await settle(TokenMethods.getBalance(account, instance))
    return raw == null ? 0 : Number(raw) / 10 ** (tk.decimals ?? 18)
  }

  const readNative = async () => {
    try {
      const raw = await baseViem.getBalance({ address: account })
      return Number(raw) / 1e18
    } catch (e) {
      return 0
    }
  }

  const needsNative = isNativeToken(token0) || isNativeToken(token1)
  const [b0, b1, native] = await Promise.all([
    isNativeToken(token0) ? Promise.resolve(0) : readErc20(token0),
    isNativeToken(token1) ? Promise.resolve(0) : readErc20(token1),
    needsNative ? readNative() : Promise.resolve(0),
  ])

  return {
    token0: isNativeToken(token0) ? native : b0,
    token1: isNativeToken(token1) ? native : b1,
  }
}

export const fetchCLChainData = async vaultAddress => {
  if (!vaultAddress) return null

  const client = await getViem(CHAIN_IDS.BASE, null)
  const instance = await newContractInstance(null, vaultAddress, ClVaultContract.abi, client)
  if (!instance) return null

  const {
    getTickLower,
    getTickUpper,
    getCurrentTokenWeights,
    getCurrentTokenAmounts,
    getSqrtPriceX96,
    getToken0,
    getToken1,
  } = ClVaultMethods

  const [tickLower, tickUpper, weights, amounts, sqrtPriceX96, token0Address, token1Address] =
    await Promise.all([
      settle(getTickLower(instance)),
      settle(getTickUpper(instance)),
      settle(getCurrentTokenWeights(instance)),
      settle(getCurrentTokenAmounts(instance)),
      settle(getSqrtPriceX96(instance)),
      settle(getToken0(instance)),
      settle(getToken1(instance)),
    ])

  const tl = tickLower == null ? null : Number(tickLower)
  const tu = tickUpper == null ? null : Number(tickUpper)
  let currentTick = null
  if (sqrtPriceX96 != null) {
    const ratio = Number(sqrtPriceX96) / 2 ** 96
    const rawPrice = ratio * ratio
    if (rawPrice > 0) currentTick = Math.floor(Math.log(rawPrice) / Math.log(1.0001))
  }
  const inRange =
    currentTick != null && tl != null && tu != null ? currentTick >= tl && currentTick < tu : null

  const readDecimals = async addr => {
    if (!addr) return null
    const tokenInstance = await newContractInstance(null, addr, TokenContract.abi, client)
    if (!tokenInstance) return null
    const d = await settle(TokenMethods.getDecimals(tokenInstance))
    return d == null ? null : Number(d)
  }
  const [dec0, dec1] = await Promise.all([readDecimals(token0Address), readDecimals(token1Address)])

  let weight0 = null,
    weight1 = null
  if (Array.isArray(weights)) {
    const total = BigInt(weights[0]) + BigInt(weights[1])
    if (total > 0n) {
      weight0 = Number((BigInt(weights[0]) * 1000000n) / total) / 1000000
      weight1 = 1 - weight0
    }
  }

  let amount0Raw = null,
    amount1Raw = null
  if (Array.isArray(amounts)) {
    amount0Raw = BigInt(amounts[0]).toString()
    amount1Raw = BigInt(amounts[1]).toString()
  }

  return {
    currentTick,
    tickLower: tl,
    tickUpper: tu,
    sqrtPriceX96: sqrtPriceX96 == null ? null : BigInt(sqrtPriceX96).toString(),
    weight0,
    weight1,
    amount0Raw,
    amount1Raw,
    inRange,
    token0Address: token0Address || null,
    token1Address: token1Address || null,
    dec0,
    dec1,
  }
}

export default fetchCLChainData
