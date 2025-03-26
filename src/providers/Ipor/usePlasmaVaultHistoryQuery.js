import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { isAddress } from 'viem'
import { IPOR_API_URL, API_REFRESH_INTERVAL } from '../../constants'

// Schema Definitions
const AddressTypeSchema = z.custom(address => isAddress(address), {
  message: 'Incorrect address',
})

const DateStringSchema = z.string().datetime()
const NumberStringSchema = z.string().regex(/^-?[0-9]+(\.[0-9]+)?$/)

const marketBalanceSchema = z.object({
  marketId: z.string().nullable(),
  protocol: z.string().nullable(),
  balanceUsd: NumberStringSchema,
  balanceType: z.string().nullable(),
})

const dexTokenSchema = z.object({
  token: AddressTypeSchema,
  amountUsd: NumberStringSchema,
})

const dexPositionBalanceSchema = z.object({
  protocol: z.string().nullable(),
  token0: dexTokenSchema,
  token1: dexTokenSchema,
})

const historySchema = z.object({
  apr: NumberStringSchema.nullable(),
  rewardsApr: NumberStringSchema.nullable(),
  apr1d: NumberStringSchema.nullable(),
  blockTimestamp: DateStringSchema,
  marketBalances: z.array(marketBalanceSchema),
  dexPositionBalances: z.array(dexPositionBalanceSchema),
  tvl: NumberStringSchema,
  blockNumber: z.number(),
})

const plasmaVaultsHistoryDataSchema = z.object({
  history: z.array(historySchema),
})
// Axios Client
const mainnetApiClient = axios.create({
  baseURL: IPOR_API_URL,
})

const usePlasmaVaultHistoryQuery = (chainId, vaultAddress) => {
  return useQuery({
    queryKey: ['vaults-history', chainId, vaultAddress],
    queryFn: async () => {
      const { data } = await mainnetApiClient.get(
        `/fusion/vaults-history/${chainId}/${vaultAddress}`,
      )
      return plasmaVaultsHistoryDataSchema.parse(data)
    },
    refetchInterval: API_REFRESH_INTERVAL,
    staleTime: API_REFRESH_INTERVAL,
    enabled: !!chainId && !!vaultAddress, // Prevents fetching if values are missing
  })
}

export default usePlasmaVaultHistoryQuery
