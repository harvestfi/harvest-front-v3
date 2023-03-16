import React, { useMemo } from 'react'
import { get } from 'lodash'
import ReactTooltip from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import { SelectedVaultContainer, SelectedVault, SelectedVaultLabel, SelectedVaultNumber, Div, InfoIcon, USDValue } from './style'
import { fromWei } from '../../../services/web3'
import { formatNumber, hasAmountGreaterThanZero, hasRequirementsForInteraction } from '../../../utils'
import { Monospace } from '../../GlobalStyle'
import AnimatedDots from '../../AnimatedDots'
import Counter from '../../Counter'
import { useWallet } from '../../../providers/Wallet'
import { usePools } from '../../../providers/Pools'
import { VAULT_CATEGORIES_IDS } from '../../../data/constants'
import { ACTIONS, FARM_TOKEN_SYMBOL, FARM_USDC_TOKEN_SYMBOL, FARM_WETH_TOKEN_SYMBOL,
  FARM_GRAIN_TOKEN_SYMBOL, SPECIAL_VAULTS, 
} from '../../../constants'
import { useVaults } from '../../../providers/Vault'
import { useStats } from '../../../providers/Stats'
import { useActions } from '../../../providers/Actions'
import { useThemeContext } from '../../../providers/useThemeContext'
import Button from '../../Button'
import Info from '../../../assets/images/logos/earn/info.svg'

const { tokens } = require('../../../data')

const VaultFooterActions = ({
  fAssetPool,
  totalTokensEarned,
  token,
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
  hasHodlCategory,
  loaded,
  withdrawMode,
  setWithdrawMode,
  setIFARM,
  poolRewardSymbol,
  fAssetSymbol,
  rewardSymbol
}) => {
  const { fetchUserPoolStats, userStats, pools } = usePools()
  const { account, getWalletBalances, connected } = useWallet()
  const { vaultsData } = useVaults()
  const { profitShareAPY } = useStats()
  const { handleClaim } = useActions()
  const { fontColor, borderColor, filterColor } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmUsdcPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_USDC_POOL_ID)
  const farmWethPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/iFarm.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[FARM_TOKEN_SYMBOL].newDetails,
        category: VAULT_CATEGORIES_IDS.GENERAL,
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        displayName: 'FARM, ETH', //'FARM/ETH',
        subLabel: 'Uniswap',
        data: farmWethPool,
        logoUrl: ['./icons/farm.svg', './icons/weth.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_WETH_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.LIQUIDITY,
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        displayName: 'FARM, GRAIN', //'FARM/GRAIN',
        subLabel: 'Uniswap',
        data: farmGrainPool,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_GRAIN_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.LIQUIDITY,
      },
      [FARM_USDC_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        inactive: true,
        displayName: 'FARM/USDC',
        data: farmUsdcPool,
        logoUrl: ['./icons/farm.svg', './icons/usdc.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_USDC_TOKEN_SYMBOL].isNew,
      },
    }),
    [
      farmGrainPool,
      farmWethPool,
      farmUsdcPool,
      farmProfitSharingPool,
      profitShareAPY,
    ],
  )
  const groupOfVaults = { ...vaultsData, ...poolVaults }

  return (
    <SelectedVaultContainer maxWidth="100%" margin="0px" padding="0px" borderWidth="0px" borderColor={borderColor}>
      <SelectedVault alignItems="center" justifyContent="start">
        <SelectedVaultLabel fontSize="16px" lineHeight="21px" fontColor={fontColor}>
          Rewards
          <InfoIcon className="info" width={isMobile ? 10 : 16} src={Info} alt="" data-tip data-for={`claim-tooltip-${tokenSymbol}`} filterColor={filterColor} />
        </SelectedVaultLabel>
      </SelectedVault>
      {rewardTokenSymbols && rewardTokenSymbols.slice(0, 1).map((symbol, symbolIdx) => {
        const token = groupOfVaults[symbol]
        let usdPrice = 1
        if(token) {
          usdPrice = (symbol === FARM_TOKEN_SYMBOL ? token.data.lpTokenData && token.data.lpTokenData.price : token.usdPrice) || 1
        }
        return (
        <SelectedVault key={`${symbol}-rewards-earned`}>
          <SelectedVaultNumber display={"flex"}>
            <img src={`/icons/${symbol.toLowerCase()}.svg`} width={40} height={40} alt="" />
            <Div>
              <Monospace>
                {!connected ? (
                  formatNumber(0, 2)
                ) : !isLoadingData && get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`) ? (
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
                ) : (
                  <AnimatedDots />
                )}
              </Monospace>
              <USDValue>
                <Monospace>
                  ${!connected ? (
                    formatNumber(0, 2)
                  ) : !isLoadingData && get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`) ? (
                    <Counter
                      pool={fAssetPool}
                      totalTokensEarned={
                        (rewardTokenSymbols.length > 1 ?
                          fromWei(
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
                  ) : (
                    <AnimatedDots />
                  )}
                </Monospace>
              </USDValue>
            </Div>
          </SelectedVaultNumber>
        </SelectedVault>
      )})}
      <ReactTooltip
        id={`claim-tooltip-${tokenSymbol}`}
        backgroundColor="#fffce6"
        borderColor="black"
        border
        textColor="black"
        getContent={() =>
          token.hodlVaultId ? (
            <>
              <b>iFARM</b> and <b>fSUSHI</b> amount is claimed upon withdrawal only.
            </>
          ) : (
            <>
              Claims all non-compounded reward tokens.
              <br />
              All pending rewards are automatically claimed when withdrawing the full value of a
              position.
            </>
          )
        }
      />
      <Button
        color="reward"
        width="100%"
        size="md"
        onClick={() =>
          handleClaim(account, fAssetPool, setPendingAction, async () => {
            await getWalletBalances([poolRewardSymbol])
            setLoadingDots(false, true)
            await fetchUserPoolStats([fAssetPool], account, userStats)
            setLoadingDots(false, false)
          })
        }
        disabled={
          !hasRequirementsForInteraction(loaded, pendingAction, vaultsData, loadingBalances) ||
          !hasAmountGreaterThanZero(totalRewardsEarned)
        }
      >
        {pendingAction === ACTIONS.CLAIM ? 'Processing...' : 'Claim All'}
      </Button>
    </SelectedVaultContainer>
  )
}

export default VaultFooterActions
