const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getSushiPerSecond = instance => countFunctionCall(instance.methods.sushiPerSecond().call())
const getRewarder = (poolId, instance) =>
  countFunctionCall(instance.methods.rewarder(poolId).call())
const getRewardToken = instance => countFunctionCall(instance.methods.rewardToken().call())
const getRewardPerSecond = instance => countFunctionCall(instance.methods.rewardPerSecond().call())
const getSushiLpToken = (poolId, instance) =>
  countFunctionCall(instance.methods.lpToken(poolId).call())

module.exports = {
  getPoolInfo,
  getTotalAllocPoint,
  getSushiPerSecond,
  getSushiLpToken,
  getRewardToken,
  getRewardPerSecond,
  getRewarder,
}
