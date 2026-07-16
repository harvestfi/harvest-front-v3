import BigNumber from 'bignumber.js'
import { keccak256, encodeAbiParameters, pad, numberToHex } from 'viem'
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

// Standard WETH9 storage layout (Base underlying): balanceOf -> slot 3, allowance -> slot 4.
const WETH9_BALANCE_SLOT = 3n
const WETH9_ALLOWANCE_SLOT = 4n
// Placeholder sender used when the wallet is not connected; state overrides fund/approve it.
const SIM_SENDER = '0x0000000000000000000000000000000000000001'

const mappingSlot = (key, slot) =>
  keccak256(encodeAbiParameters([{ type: 'address' }, { type: 'uint256' }], [key, slot]))

const nestedMappingSlot = (owner, spender, slot) => {
  const inner = mappingSlot(owner, slot)
  return keccak256(
    encodeAbiParameters([{ type: 'address' }, { type: 'bytes32' }], [spender, inner]),
  )
}

const to32 = big => pad(numberToHex(big), { size: 32 })

const depositAbi = LoopVaultContract.abi.filter(x => x.name === 'deposit' && x.inputs?.length === 2)

/**
 * Simulate the real deposit(amount, receiver) transaction to read the true minted shares
 * (reflecting the vault's live zap + fold), then value them back to the underlying via
 * price-per-share to derive the WETH-equivalent value and the effective entry cost.
 * Falls back to the on-chain previewDeposit if the simulation reverts.
 */
export const loopSimulateDeposit = async ({ vaultAddress, underlying, amount, account }) => {
  if (!vaultAddress || !underlying?.address || !(Number(amount) > 0)) return null

  const decimals = underlying.decimals ?? 18
  let amountWei
  try {
    amountWei = BigInt(toWei(amount, decimals, 0))
  } catch (e) {
    return null
  }
  if (amountWei <= 0n) return null

  const sender = account || SIM_SENDER

  const runSim = async stateOverride => {
    const { result } = await baseViem.simulateContract({
      address: vaultAddress,
      abi: depositAbi,
      functionName: 'deposit',
      args: [amountWei, sender],
      account: sender,
      ...(stateOverride ? { stateOverride } : {}),
    })
    return result
  }

  // Fake WETH balance + allowance so the transferFrom inside deposit() clears even before approval.
  const overrides = [
    {
      address: underlying.address,
      stateDiff: [
        { slot: mappingSlot(sender, WETH9_BALANCE_SLOT), value: to32(amountWei) },
        {
          slot: nestedMappingSlot(sender, vaultAddress, WETH9_ALLOWANCE_SLOT),
          value: to32(amountWei),
        },
      ],
    },
  ]

  const resolveMintedWei = async () => {
    if (account) {
      try {
        return await runSim(null)
      } catch (e) {
        // fall through to the next resolution strategy
      }
    }
    try {
      return await runSim(overrides)
    } catch (e) {
      // fall through to the on-chain preview
    }
    const previewShares = await loopPreviewDepositShares({ vaultAddress, amount, decimals })
    if (previewShares == null) return null
    return BigInt(new BigNumber(previewShares).times('1e18').toFixed(0))
  }

  const mintedWei = await resolveMintedWei()
  if (mintedWei == null) return null

  const vault = await readInstance(vaultAddress)
  const ppsRaw = await settle(LoopVaultMethods.getPricePerFullShare(vault))
  const pps =
    ppsRaw != null && new BigNumber(ppsRaw.toString()).gt(0)
      ? new BigNumber(ppsRaw.toString()).div('1e18')
      : new BigNumber(1)

  const shares = new BigNumber(mintedWei.toString()).div('1e18')
  const wethEquivalent = shares.times(pps).toNumber()
  const input = Number(amount)
  const entryCostBps = input > 0 ? Math.max(0, ((input - wethEquivalent) / input) * 10000) : null

  return { shares: shares.toNumber(), wethEquivalent, entryCostBps }
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

const withdrawAbi = LoopVaultContract.abi.filter(
  x => x.name === 'withdraw' && x.inputs?.length === 1,
)

/**
 * Simulate the real withdraw(shares) transaction to read the true underlying returned by
 * unwinding the loop, then compare it against the shares' book value (shares × price-per-share)
 * to derive the effective exit cost. Returns null (caller keeps its own fallback) when the
 * simulation can't run — e.g. no connected wallet or an amount above the held balance.
 */
export const loopSimulateWithdraw = async ({ vaultAddress, shares, account }) => {
  if (!vaultAddress || !account || !(Number(shares) > 0)) return null

  let sharesWei
  try {
    sharesWei = BigInt(toWei(shares, VAULT_DECIMALS, 0))
  } catch (e) {
    return null
  }
  if (sharesWei <= 0n) return null

  const assetsWei = await (async () => {
    try {
      const { result } = await baseViem.simulateContract({
        address: vaultAddress,
        abi: withdrawAbi,
        functionName: 'withdraw',
        args: [sharesWei],
        account,
      })
      return result
    } catch (e) {
      return null
    }
  })()
  if (assetsWei == null) return null

  const vault = await readInstance(vaultAddress)
  const ppsRaw = await settle(LoopVaultMethods.getPricePerFullShare(vault))
  const pps =
    ppsRaw != null && new BigNumber(ppsRaw.toString()).gt(0)
      ? new BigNumber(ppsRaw.toString()).div('1e18')
      : new BigNumber(1)

  const underlyingOut = new BigNumber(assetsWei.toString()).div('1e18').toNumber()
  const sharesValue = new BigNumber(shares).times(pps).toNumber()
  const exitCostBps =
    sharesValue > 0 ? Math.max(0, ((sharesValue - underlyingOut) / sharesValue) * 10000) : null

  return { underlyingOut, sharesValue, exitCostBps }
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
