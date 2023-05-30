import { get } from 'lodash'
import React, { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSetChain } from '@web3-onboard/react'
import {
  ACTIONS,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
} from '../../../constants'
import { useActions } from '../../../providers/Actions'
import { usePools } from '../../../providers/Pools'
import { useStats } from '../../../providers/Stats'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useVaults } from '../../../providers/Vault'
import { useWallet } from '../../../providers/Wallet'
import {
  formatNumber,
  hasAmountGreaterThanZero,
  hasRequirementsForInteraction,
} from '../../../utils'
import Button from '../../Button'
import {
  Div,
  InfoIcon,
  SelectedVault,
  SelectedVaultContainer,
  SelectedVaultLabel,
  SelectedVaultNumber,
  USDValue,
} from './style'
import Info from '../../../assets/images/logos/earn/info.svg'
import { fromWei } from '../../../services/web3'
import AnimatedDots from '../../AnimatedDots'
import Counter from '../../Counter'
import { Monospace } from '../../GlobalStyle'

const { tokens } = require('../../../data')

const PoolFooterActions = ({
  fAssetPool,
  token,
  totalTokensEarned,
  rewardTokenSymbols,
  isLoadingData,
  rewardsEarned,
  ratesPerDay,
  tokenSymbol,
  totalRewardsEarned,
  loadingBalances,
  setLoadingDots,
  setPendingAction,
  pendingAction,
  loaded,
  poolRewardSymbol,
}) => {
  const { fetchUserPoolStats, userStats, pools } = usePools()
  const { account, getWalletBalances, connected } = useWallet()
  const { profitShareAPY } = useStats()
  const { vaultsData } = useVaults()
  const { handleClaim } = useActions()
  const { fontColor, borderColor, filterColor } = useThemeContext()

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmWethPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)

  const isMobile = useMediaQuery({ query: '(max-width: 1510px)' })

  const [
    {
      connectedChain, // the current chain the user's wallet is connected to
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain()

  const tokenChain = token.chain || token.data.chain
  const curChain = connectedChain ? parseInt(connectedChain.id, 16).toString() : ''

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        tokenNames: ['FARM'],
        isNew: tokens[FARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[FARM_TOKEN_SYMBOL].newDetails,
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, ETH'], // 'FARM/ETH',
        platform: ['Uniswap'],
        data: farmWethPool,
        logoUrl: ['./icons/farm.svg', './icons/eth.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_WETH_TOKEN_SYMBOL].isNew,
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM, GRAIN'], // 'FARM/GRAIN',
        platform: ['Uniswap'],
        data: farmGrainPool,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_GRAIN_TOKEN_SYMBOL].isNew,
      },
    }),
    [farmGrainPool, farmWethPool, farmProfitSharingPool, profitShareAPY],
  )
  const groupOfVaults = { ...vaultsData, ...poolVaults }

  return (
    <SelectedVaultContainer
      maxWidth="100%"
      margin="0px"
      padding="0px"
      borderWidth="0px"
      borderColor={borderColor}
    >
      <SelectedVault alignItems="center" justifyContent="start">
        <SelectedVaultLabel fontSize="16px" lineHeight="21px" fontColor={fontColor}>
          Rewards
          <InfoIcon
            className="info"
            width={isMobile ? 10 : 16}
            src={Info}
            alt=""
            data-tip
            data-for={`claim-tooltip-${tokenSymbol}`}
            filterColor={filterColor}
          />
        </SelectedVaultLabel>
      </SelectedVault>
      {fAssetPool.id !== SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
        rewardTokenSymbols.map((symbol, symbolIdx) => {
          const curtoken = groupOfVaults[symbol]
          let usdPrice = 1
          if (curtoken) {
            usdPrice =
              (symbol === FARM_TOKEN_SYMBOL
                ? curtoken.data.lpTokenData && curtoken.data.lpTokenData.price
                : curtoken.usdPrice) || 1
          }
          return (
            <div key={symbolIdx}>
              <SelectedVault key={`${symbol}-rewards-earned`}>
                <SelectedVaultNumber display="flex">
                  <img src={`/icons/${symbol.toLowerCase()}.svg`} width={40} height={40} alt="" />
                  <Div>
                    <Monospace>
                      {!connected ? (
                        formatNumber(0, 8)
                      ) : !isLoadingData &&
                        get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`) ? (
                        <Counter
                          pool={fAssetPool}
                          totalTokensEarned={
                            rewardTokenSymbols.length > 1
                              ? fromWei(
                                  get(rewardsEarned, symbol, 0),
                                  get(tokens[symbol], 'decimals', 18),
                                  4,
                                )
                              : totalTokensEarned
                          }
                          totalStaked={get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)}
                          ratePerDay={get(ratesPerDay, symbolIdx, ratesPerDay[0])}
                          rewardPerToken={get(
                            fAssetPool,
                            `rewardPerToken[${symbolIdx}]`,
                            fAssetPool.rewardPerToken[0],
                          )}
                          rewardTokenAddress={get(
                            fAssetPool,
                            `rewardTokens[${symbolIdx}]`,
                            fAssetPool.rewardTokens[0],
                          )}
                        />
                      ) : userStats.length === 0 ? (
                        <AnimatedDots />
                      ) : (
                        formatNumber(0, 8)
                      )}
                    </Monospace>
                    <USDValue>
                      <Monospace>
                        {!connected ? (
                          formatNumber(0, 8)
                        ) : !isLoadingData &&
                          get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`) ? (
                          <Counter
                            pool={fAssetPool}
                            totalTokensEarned={
                              (rewardTokenSymbols.length > 1
                                ? fromWei(
                                    get(rewardsEarned, symbol, 0),
                                    get(tokens[symbol], 'decimals', 18),
                                    4,
                                  )
                                : totalTokensEarned) * usdPrice
                            }
                            totalStaked={get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)}
                            ratePerDay={get(ratesPerDay, symbolIdx, ratesPerDay[0])}
                            rewardPerToken={get(
                              fAssetPool,
                              `rewardPerToken[${symbolIdx}]`,
                              fAssetPool.rewardPerToken[0],
                            )}
                            rewardTokenAddress={get(
                              fAssetPool,
                              `rewardTokens[${symbolIdx}]`,
                              fAssetPool.rewardTokens[0],
                            )}
                          />
                        ) : userStats.length === 0 ? (
                          <AnimatedDots />
                        ) : (
                          formatNumber(0, 8)
                        )}
                      </Monospace>
                    </USDValue>
                  </Div>
                </SelectedVaultNumber>
              </SelectedVault>
              <SelectedVault alignItems="center">
                <Button
                  width="100%"
                  size="md"
                  color="earn"
                  onClick={async () => {
                    if (curChain !== tokenChain) {
                      const chainHex = `0x${Number(tokenChain).toString(16)}`
                      await setChain({ chainId: chainHex })
                    } else {
                      handleClaim(account, fAssetPool, setPendingAction, async () => {
                        await getWalletBalances([poolRewardSymbol])
                        setLoadingDots(false, true)
                        await fetchUserPoolStats([fAssetPool], account, userStats)
                        setLoadingDots(false, false)
                      })
                    }
                  }}
                  disabled={
                    !hasRequirementsForInteraction(
                      loaded,
                      pendingAction,
                      vaultsData,
                      loadingBalances,
                    ) || !hasAmountGreaterThanZero(totalRewardsEarned)
                  }
                >
                  {pendingAction === ACTIONS.CLAIM ? 'Processing...' : 'Claim'}
                </Button>
              </SelectedVault>
            </div>
          )
        })}
    </SelectedVaultContainer>
  )
}

export default PoolFooterActions
