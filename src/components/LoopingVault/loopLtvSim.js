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
