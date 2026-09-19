const EQUITY_QUOTES = [/(^|-)tokenized-stock$/i, /(^|-)xstock$/i]

const quoteIds = token => {
  const priceFunction = token && token.priceFunction
  const params = priceFunction && Array.isArray(priceFunction.params) ? priceFunction.params : []
  return params.filter(param => typeof param === 'string')
}

const isStockVault = token => quoteIds(token).some(id => EQUITY_QUOTES.some(q => q.test(id)))

module.exports = { isStockVault }
