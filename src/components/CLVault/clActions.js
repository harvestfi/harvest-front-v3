import BigNumber from 'bignumber.js'
import { toWei, getViem, newContractInstance, baseViem } from '../../services/viem'
import { CHAIN_IDS } from '../../data/constants'
import ClVaultContract from '../../services/viem/contracts/cl-vault/contract.json'
import ClVaultMethods from '../../services/viem/contracts/cl-vault/methods'
import ClWrapperContract from '../../services/viem/contracts/cl-wrapper/contract.json'
import ClWrapperMethods from '../../services/viem/contracts/cl-wrapper/methods'
import TokenContract from '../../services/viem/contracts/token/contract.json'
import TokenMethods from '../../services/viem/contracts/token/methods'

const VAULT_DECIMALS = 18

const WETH_ABI = [
  { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
]

const settle = promise => promise.then(v => v).catch(() => null)

const awaitReceipt = async hash => {
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
  return hash
}

const isNativeToken = token =>
  typeof token?.symbol === 'string' && token.symbol.toUpperCase() === 'ETH'

const readInstance = (address, abi) => newContractInstance(null, address, abi, baseViem)

const writeInstance = async (address, abi, account, viem) => {
  const client = await getViem(CHAIN_IDS.BASE, account, viem)
  return newContractInstance(null, address, abi, client)
}

const applySlippageDown = (weiStr, slippagePct) =>
  new BigNumber(weiStr)
    .multipliedBy(new BigNumber(100 - slippagePct).div(100))
    .integerValue(BigNumber.ROUND_FLOOR)
    .toFixed(0)

const wrapNativeIfNeeded = async ({ token, amountWei, account, viem }) => {
  if (!isNativeToken(token) || new BigNumber(amountWei).lte(0)) return
  const client = await getViem(CHAIN_IDS.BASE, account, viem)
  const instance = await newContractInstance(null, token.address, WETH_ABI, client)
  const { walletClient } = instance
  const hash = await walletClient.writeContract({
    address: token.address,
    abi: WETH_ABI,
    functionName: 'deposit',
    args: [],
    value: BigInt(amountWei),
    account,
    chain: walletClient.chain,
  })
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
}

const ensureApproval = async ({ tokenAddress, spender, amountWei, account, viem }) => {
  const readTok = await readInstance(tokenAddress, TokenContract.abi)
  const current = await TokenMethods.getApprovedAmount(account, spender, readTok)
  if (new BigNumber(current.toString()).gte(new BigNumber(amountWei))) return

  const writeTok = await writeInstance(tokenAddress, TokenContract.abi, account, viem)
  const hash = await TokenMethods.approve(spender, account, amountWei, writeTok)
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
}

export const clPreviewDepositShares = async ({ token, amount }) => {
  if (!token?.wrapper || !(Number(amount) > 0)) return null
  try {
    const assetsWei = toWei(amount, token.decimals, 0)
    const readWrap = await readInstance(token.wrapper, ClWrapperContract.abi)
    const expected = await ClWrapperMethods.previewDeposit(assetsWei, readWrap)
    if (expected == null) return null
    return Number(expected.toString()) / 10 ** VAULT_DECIMALS
  } catch (e) {
    return null
  }
}

export const clDepositSingle = async ({ token, amount, account, viem, slippage }) => {
  if (!token?.wrapper) throw new Error('Missing wrapper address for single-asset deposit')
  const assetsWei = toWei(amount, token.decimals, 0)

  await wrapNativeIfNeeded({ token, amountWei: assetsWei, account, viem })

  await ensureApproval({
    tokenAddress: token.address,
    spender: token.wrapper,
    amountWei: assetsWei,
    account,
    viem,
  })

  let minOut = '0'
  try {
    const readWrap = await readInstance(token.wrapper, ClWrapperContract.abi)
    const expected = await ClWrapperMethods.previewDeposit(assetsWei, readWrap)
    minOut = applySlippageDown(expected.toString(), slippage)
  } catch (e) {
    minOut = '0'
  }

  const wrapper = await writeInstance(token.wrapper, ClWrapperContract.abi, account, viem)
  return awaitReceipt(await ClWrapperMethods.deposit(assetsWei, account, minOut, account, wrapper))
}

export const clWithdrawBoth = async ({ vaultAddress, shares, account, viem, slippage }) => {
  const sharesWei = toWei(shares, VAULT_DECIMALS, 0)

  let min0 = '0',
    min1 = '0'
  try {
    const vaultRead = await readInstance(vaultAddress, ClVaultContract.abi)
    const [amounts, totalSupply] = await Promise.all([
      ClVaultMethods.getCurrentTokenAmounts(vaultRead),
      ClVaultMethods.getTotalSupply(vaultRead),
    ])
    const supply = new BigNumber(totalSupply.toString())
    if (supply.gt(0) && Array.isArray(amounts)) {
      const exp0 = new BigNumber(amounts[0].toString()).multipliedBy(sharesWei).div(supply)
      const exp1 = new BigNumber(amounts[1].toString()).multipliedBy(sharesWei).div(supply)
      min0 = applySlippageDown(exp0.toFixed(0), slippage)
      min1 = applySlippageDown(exp1.toFixed(0), slippage)
    }
  } catch (e) {
    min0 = '0'
    min1 = '0'
  }

  const vault = await writeInstance(vaultAddress, ClVaultContract.abi, account, viem)
  return awaitReceipt(await ClVaultMethods.withdraw(sharesWei, min0, min1, account, vault))
}

export const clWithdrawSingle = async ({
  vaultAddress,
  token,
  shares,
  account,
  viem,
  slippage,
}) => {
  if (!token?.wrapper) throw new Error('Missing wrapper address for single-asset withdraw')
  const sharesWei = toWei(shares, VAULT_DECIMALS, 0)

  await ensureApproval({
    tokenAddress: vaultAddress,
    spender: token.wrapper,
    amountWei: sharesWei,
    account,
    viem,
  })

  let minOut = '0'
  try {
    const readWrap = await readInstance(token.wrapper, ClWrapperContract.abi)
    const expected = await ClWrapperMethods.previewRedeem(sharesWei, readWrap)
    minOut = applySlippageDown(expected.toString(), slippage)
  } catch (e) {
    minOut = '0'
  }

  const wrapper = await writeInstance(token.wrapper, ClWrapperContract.abi, account, viem)
  return awaitReceipt(
    await ClWrapperMethods.redeem(sharesWei, account, account, minOut, account, wrapper),
  )
}

export const fetchCLPosition = async ({
  vaultAddress,
  token0,
  token1,
  account,
  usdPrice = 0,
  pricePerShare = 0,
}) => {
  const empty = { vaultShares: 0, underlying0: 0, underlying1: 0, usdValue: 0 }
  if (!account || !vaultAddress) return empty

  const vaultRead = await readInstance(vaultAddress, ClVaultContract.abi)
  const [vsRaw, amounts, supplyRaw, ppsRaw] = await Promise.all([
    settle(ClVaultMethods.getBalanceOf(account, vaultRead)),
    settle(ClVaultMethods.getCurrentTokenAmounts(vaultRead)),
    settle(ClVaultMethods.getTotalSupply(vaultRead)),
    settle(ClVaultMethods.getPricePerFullShare(vaultRead)),
  ])

  const dec0 = token0?.decimals ?? 18
  const dec1 = token1?.decimals ?? 18

  const vaultShares = vsRaw == null ? 0 : Number(vsRaw) / 10 ** VAULT_DECIMALS

  let underlying0 = 0,
    underlying1 = 0
  if (Array.isArray(amounts) && supplyRaw != null) {
    const supply = Number(supplyRaw) / 10 ** VAULT_DECIMALS
    if (supply > 0) {
      const frac = vaultShares / supply
      underlying0 = (frac * Number(amounts[0])) / 10 ** dec0
      underlying1 = (frac * Number(amounts[1])) / 10 ** dec1
    }
  }

  const pps =
    ppsRaw != null && Number(ppsRaw) > 0
      ? Number(ppsRaw) / 10 ** VAULT_DECIMALS
      : Number(pricePerShare) || 1
  // eslint-disable-next-line one-var
  let usdValue = 0
  if (Number(usdPrice) > 0) {
    usdValue = vaultShares * pps * Number(usdPrice)
  } else {
    usdValue =
      underlying0 * (Number(token0?.priceUsd) || 0) + underlying1 * (Number(token1?.priceUsd) || 0)
  }

  return { vaultShares, underlying0, underlying1, usdValue }
}
