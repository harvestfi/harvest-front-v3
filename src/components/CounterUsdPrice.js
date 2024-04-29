import BigNumber from 'bignumber.js'
import { get, toArray } from 'lodash'
import React from 'react'
import { BEGINNERS_BALANCES_DECIMALS } from '../constants'
import { fromWei } from '../services/web3'
import { formatNumber } from '../utilities/formats'

const { tokens } = require('../data')
const { POOL_TYPES } = require('../data/constants')

const nowInSeconds = Date.now() / 1000

const CounterUsdPrice = ({
  pool,
  totalTokensEarned,
  totalStaked,
  ratePerDay,
  rewardPerToken,
  rewardTokenAddress,
  rewardTokenUsdPrice,
}) => {
  if (!!pool.autoStakePoolAddress && Number(totalStaked) <= 0) {
    return ''
  }

  if (!pool.autoStakePoolAddress && Number(totalTokensEarned) <= 0) {
    return ' ($0.00)'
  }

  const rewardToken = toArray(tokens).find(token => token.tokenAddress === rewardTokenAddress)

  const rewardPerTokenInEther = new BigNumber(rewardPerToken).dividedBy(
    new BigNumber(10).exponentiatedBy(get(rewardToken, 'decimals', 18)),
  )

  const sharingPoolEndTarget = fromWei(
    new BigNumber(totalStaked).multipliedBy(rewardPerTokenInEther).toNumber(),
    pool.lpTokenData.decimals,
  )

  const totalStakedInEther = fromWei(totalStaked, pool.lpTokenData.decimals)

  const RewardUSDCase1 =
    (Number(totalTokensEarned) + Number(totalTokensEarned) * Number(ratePerDay)) *
    Number(rewardTokenUsdPrice)
  const RewardUSDCase2 =
    (Number(totalStakedInEther) + Number(totalStakedInEther) * Number(ratePerDay)) *
    Number(rewardTokenUsdPrice)
  const RewardUSDCase3 = Number(sharingPoolEndTarget) * Number(rewardTokenUsdPrice)

  switch (true) {
    case pool.type === POOL_TYPES.UNIV3:
    case pool.type === POOL_TYPES.INCENTIVE:
    case pool.type === POOL_TYPES.INCENTIVE_BUYBACK:
      return (
        <>
          {' '}
          (
          {RewardUSDCase1 === 0
            ? '$0.00'
            : RewardUSDCase1 < 0.01
            ? '<$0.01'
            : `$${formatNumber(RewardUSDCase1, BEGINNERS_BALANCES_DECIMALS)}`}
          )
        </>
      )
    case pool.type === POOL_TYPES.PROFIT_SHARING && !!pool.autoStakePoolAddress:
      return (
        <>
          {' '}
          (
          {RewardUSDCase2 === 0
            ? '$0.00'
            : RewardUSDCase2 < 0.01
            ? '<$0.01'
            : `$${formatNumber(RewardUSDCase2, BEGINNERS_BALANCES_DECIMALS)}`}
          )
        </>
      )
    case pool.finishTime > nowInSeconds && pool.type === POOL_TYPES.PROFIT_SHARING:
      return (
        <>
          {' '}
          (
          {RewardUSDCase3 === 0
            ? '$0.00'
            : RewardUSDCase3 < 0.01
            ? '<$0.01'
            : `$${formatNumber(RewardUSDCase3, BEGINNERS_BALANCES_DECIMALS)}`}
          )
        </>
      )
    default:
      return '0.000000000'
  }
}

export default CounterUsdPrice
