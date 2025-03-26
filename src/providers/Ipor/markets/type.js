import { z } from 'zod'

export const ERC4626_PROTOCOLS = ['erc4626', 'harvest-erc4626']
const NumberStringSchema = z.string().regex(/^-?[0-9]+(\.[0-9]+)?$/)

const marketBalanceSchema = z.object({
  marketId: z.string().nullable(),
  protocol: z.string().nullable(),
  balanceUsd: NumberStringSchema,
  balanceType: z.string().nullable(),
})

export const getMarketBalanceSchema = () => marketBalanceSchema
