const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export const projectLtvAfterDeposit = (position, depositAmount, entryCostBps = 0) => {
  if (!position || !(Number(depositAmount) > 0)) return null
  const costFrac = (Number(entryCostBps) || 0) / 10000
  const netIn = Number(depositAmount) * (1 - costFrac)
  const supplyPrice = position.supplyPrice > 0 ? position.supplyPrice : 1
  const collateralAdded = netIn * supplyPrice
  const newCollateral = position.collateralValue + collateralAdded
  if (!(newCollateral > 0)) return position.ltv
  return clamp(position.debtValue / newCollateral, 0, 0.99)
}

export const projectLtvAfterWithdraw = (position, underlyingOut, exitCostBps = 0) => {
  if (!position || !(Number(underlyingOut) > 0) || !(position.netValue > 0)) return null
  const costFrac = (Number(exitCostBps) || 0) / 10000
  const equityOut = Number(underlyingOut) / (1 - costFrac)
  const fraction = clamp(equityOut / position.netValue, 0, 1)
  const newCollateral = position.collateralValue * (1 - fraction)
  const newDebt = position.debtValue * (1 - fraction)
  if (!(newCollateral > 0)) return position.ltv
  return clamp(newDebt / newCollateral, 0, 0.99)
}

export const computeEntryCostBps = (inputAmount, equivalentOut) => {
  const input = Number(inputAmount)
  const out = Number(equivalentOut)
  if (!(input > 0) || !(out >= 0)) return null
  return Math.max(0, ((input - out) / input) * 10000)
}

export const computeExitCostBps = (sharesValue, underlyingOut) => {
  const inp = Number(sharesValue)
  const out = Number(underlyingOut)
  if (!(inp > 0) || !(out >= 0)) return null
  return Math.max(0, ((inp - out) / inp) * 10000)
}
