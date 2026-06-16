import BigNumber from 'bignumber.js'
import { toWei, getViem, newContractInstance, baseViem } from '../../services/viem'
import { CHAIN_IDS } from '../../data/constants'
import VaultContract from '../../services/viem/contracts/vault/contract.json'
import VaultMethods from '../../services/viem/contracts/vault/methods'
import TokenContract from '../../services/viem/contracts/token/contract.json'
import TokenMethods from '../../services/viem/contracts/token/methods'

const VAULT_DECIMALS = 18

const WETH_ABI = [
  { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
]

const isNativeEth = symbol => typeof symbol === 'string' && symbol.toUpperCase() === 'ETH'

const settle = promise => promise.then(v => v).catch(() => null)

const awaitReceipt = async hash => {
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
  return hash
}

const writeInstance = async (address, abi, account, viem) => {
  const client = await getViem(CHAIN_IDS.BASE, account, viem)
  return newContractInstance(null, address, abi, client)
}

const ensureApproval = async ({ tokenAddress, spender, amountWei, account, viem }) => {
  const readTok = await newContractInstance(null, tokenAddress, TokenContract.abi, baseViem)
  const current = await TokenMethods.getApprovedAmount(account, spender, readTok)
  if (new BigNumber(current.toString()).gte(new BigNumber(amountWei))) return

  const writeTok = await writeInstance(tokenAddress, TokenContract.abi, account, viem)
  const hash = await TokenMethods.approve(spender, account, amountWei, writeTok)
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
}

export const loopPreviewDepositShares = async ({ vaultAddress, amount, decimals = 18 }) => {
  if (!vaultAddress || !(Number(amount) > 0)) return null
  try {
    const vaultRead = await newContractInstance(null, vaultAddress, VaultContract.abi, baseViem)
    const pps = await VaultMethods.getPricePerFullShare(vaultRead)
    if (!pps || new BigNumber(pps.toString()).lte(0)) return null
    const amountWei = new BigNumber(toWei(amount, decimals, 0))
    return amountWei.div(new BigNumber(pps.toString())).div(1e18).toNumber()
  } catch (e) {
    return null
  }
}

export const loopPreviewWithdrawUnderlying = async ({ vaultAddress, shares }) => {
  if (!vaultAddress || !(Number(shares) > 0)) return null
  try {
    const vaultRead = await newContractInstance(null, vaultAddress, VaultContract.abi, baseViem)
    const pps = await VaultMethods.getPricePerFullShare(vaultRead)
    if (!pps) return null
    return new BigNumber(shares).times(new BigNumber(pps.toString()).div(1e18)).toNumber()
  } catch (e) {
    return null
  }
}

const wrapNativeIfNeeded = async ({ underlying, amountWei, account, viem }) => {
  if (!isNativeEth(underlying.symbol) || new BigNumber(amountWei).lte(0)) return
  const client = await getViem(CHAIN_IDS.BASE, account, viem)
  const instance = await newContractInstance(null, underlying.address, WETH_ABI, client)
  const { walletClient } = instance
  const hash = await walletClient.writeContract({
    address: underlying.address,
    abi: WETH_ABI,
    functionName: 'deposit',
    args: [],
    value: BigInt(amountWei),
    account,
    chain: walletClient.chain,
  })
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
}

export const loopDeposit = async ({ vaultAddress, underlying, amount, account, viem }) => {
  const amountWei = toWei(amount, underlying.decimals, 0)

  await wrapNativeIfNeeded({ underlying, amountWei, account, viem })

  await ensureApproval({
    tokenAddress: underlying.address,
    spender: vaultAddress,
    amountWei,
    account,
    viem,
  })

  const vault = await writeInstance(vaultAddress, VaultContract.abi, account, viem)
  return awaitReceipt(await VaultMethods.deposit(amountWei, account, vault))
}

export const loopWithdraw = async ({ vaultAddress, shares, account, viem }) => {
  const sharesWei = toWei(shares, VAULT_DECIMALS, 0)
  const vault = await writeInstance(vaultAddress, VaultContract.abi, account, viem)
  return awaitReceipt(await VaultMethods.withdraw(sharesWei, account, vault))
}

export const fetchLoopPosition = async ({
  vaultAddress,
  account,
  usdPrice = 0,
  pricePerShare = 0,
}) => {
  const empty = { vaultShares: 0, usdValue: 0 }
  if (!account || !vaultAddress) return empty

  const vaultRead = await newContractInstance(null, vaultAddress, VaultContract.abi, baseViem)
  const [vsRaw, ppsRaw] = await Promise.all([
    settle(TokenMethods.getBalance(account, vaultRead)),
    settle(VaultMethods.getPricePerFullShare(vaultRead)),
  ])

  const vaultShares = vsRaw == null ? 0 : Number(vsRaw) / 10 ** VAULT_DECIMALS
  const pps =
    ppsRaw != null && Number(ppsRaw) > 0
      ? Number(ppsRaw) / 10 ** VAULT_DECIMALS
      : Number(pricePerShare) || 1
  const usdValue = Number(usdPrice) > 0 ? vaultShares * pps * Number(usdPrice) : 0

  return { vaultShares, usdValue }
}
