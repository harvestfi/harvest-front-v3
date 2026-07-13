import BigNumber from 'bignumber.js'
import { toWei, getViem, newContractInstance, baseViem } from '../../services/viem'
import { CHAIN_IDS } from '../../data/constants'
import LoopVaultContract from '../../services/viem/contracts/loop-vault/contract.json'
import LoopVaultMethods from '../../services/viem/contracts/loop-vault/methods'
import TokenContract from '../../services/viem/contracts/token/contract.json'
import TokenMethods from '../../services/viem/contracts/token/methods'

const VAULT_DECIMALS = 18

const settle = promise => promise.then(v => v).catch(() => null)

const awaitReceipt = async hash => {
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
  return hash
}

const writeInstance = async (address, account, viem) => {
  const client = await getViem(CHAIN_IDS.BASE, account, viem)
  return newContractInstance(null, address, LoopVaultContract.abi, client)
}

const readInstance = async address => {
  return newContractInstance(null, address, LoopVaultContract.abi, baseViem)
}

const ensureApproval = async ({ tokenAddress, spender, amountWei, account, viem }) => {
  const readTok = await newContractInstance(null, tokenAddress, TokenContract.abi, baseViem)
  const current = await TokenMethods.getApprovedAmount(account, spender, readTok)
  if (new BigNumber(current.toString()).gte(new BigNumber(amountWei))) return

  const writeTok = await newContractInstance(
    null,
    tokenAddress,
    TokenContract.abi,
    await getViem(CHAIN_IDS.BASE, account, viem),
  )
  const hash = await TokenMethods.approve(spender, account, amountWei, writeTok)
  if (hash) await baseViem.waitForTransactionReceipt({ hash })
}

const toTokenAmount = (raw, decimals = VAULT_DECIMALS) => {
  if (raw == null) return 0
  return new BigNumber(raw.toString()).div(new BigNumber(10).pow(decimals)).toNumber()
}

export const loopPreviewDepositShares = async ({ vaultAddress, amount, decimals = 18 }) => {
  if (!vaultAddress || !(Number(amount) > 0)) return null
  try {
    const amountWei = toWei(amount, decimals, 0)
    const vault = await readInstance(vaultAddress)
    try {
      const preview = await LoopVaultMethods.previewDeposit(BigInt(amountWei), vault)
      if (preview != null) return Number(preview.toString()) / 10 ** VAULT_DECIMALS
    } catch (e) {
      // fall through to PPS estimate
    }
    const pps = await LoopVaultMethods.getPricePerFullShare(vault)
    if (!pps || new BigNumber(pps.toString()).lte(0)) return null
    return new BigNumber(amountWei).div(new BigNumber(pps.toString())).toNumber()
  } catch (e) {
    return null
  }
}

export const loopPreviewWithdrawUnderlying = async ({ vaultAddress, shares }) => {
  if (!vaultAddress || !(Number(shares) > 0)) return null
  try {
    const vault = await readInstance(vaultAddress)
    const pps = await LoopVaultMethods.getPricePerFullShare(vault)
    if (!pps) return null
    return new BigNumber(shares).times(new BigNumber(pps.toString()).div(1e18)).toNumber()
  } catch (e) {
    return null
  }
}

export const loopDeposit = async ({ vaultAddress, underlying, amount, account, viem }) => {
  const amountWei = toWei(amount, underlying.decimals, 0)

  // Vault underlying is WETH — deposit the ERC-20 directly (no native ETH wrap).
  await ensureApproval({
    tokenAddress: underlying.address,
    spender: vaultAddress,
    amountWei,
    account,
    viem,
  })

  const vault = await writeInstance(vaultAddress, account, viem)
  return awaitReceipt(await LoopVaultMethods.deposit(BigInt(amountWei), account, account, vault))
}

export const loopWithdraw = async ({ vaultAddress, shares, account, viem }) => {
  const sharesWei = toWei(shares, VAULT_DECIMALS, 0)
  const vault = await writeInstance(vaultAddress, account, viem)
  return awaitReceipt(await LoopVaultMethods.withdraw(BigInt(sharesWei), account, vault))
}

export const fetchLoopPosition = async ({
  vaultAddress,
  account,
  usdPrice = 0,
  pricePerShare = 0,
}) => {
  const empty = { vaultShares: 0, usdValue: 0, assets: 0 }
  if (!account || !vaultAddress) return empty

  try {
    const vault = await readInstance(vaultAddress)
    const [vsRaw, ppsRaw, assetsRaw] = await Promise.all([
      settle(LoopVaultMethods.getBalanceOf(account, vault)),
      settle(LoopVaultMethods.getPricePerFullShare(vault)),
      settle(LoopVaultMethods.getAssetsOf(account, vault)),
    ])

    const vaultShares = toTokenAmount(vsRaw)
    const assets = toTokenAmount(assetsRaw)
    const pps =
      ppsRaw != null && new BigNumber(ppsRaw.toString()).gt(0)
        ? toTokenAmount(ppsRaw)
        : Number(pricePerShare) || 1
    const usdValue =
      Number(usdPrice) > 0 ? (assets > 0 ? assets : vaultShares * pps) * Number(usdPrice) : 0

    return { vaultShares, usdValue, assets }
  } catch (e) {
    return empty
  }
}

/** Poll until vault share balance changes from `previousShares` (deposit or withdraw). */
export const pollLoopPosition = async (
  params,
  { retries = 5, delayMs = 1200, previousShares = 0 } = {},
) => {
  let last = await fetchLoopPosition(params)
  for (let i = 0; i < retries; i += 1) {
    const next = last.vaultShares || 0
    if (Math.abs(next - (previousShares || 0)) > 1e-14) return last
    await new Promise(r => setTimeout(r, delayMs))
    last = await fetchLoopPosition(params)
  }
  return last
}
