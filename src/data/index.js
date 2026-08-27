const { withPairDisplay } = require('../utilities/pairAssets')

const data = require('./harvest-api-v3/data')

const tokens = Object.fromEntries(
  Object.entries(data.tokens).map(([symbol, token]) => [symbol, withPairDisplay(token)]),
)

module.exports = { ...data, tokens }
