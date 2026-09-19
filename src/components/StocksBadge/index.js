import React from 'react'
import { Stocks, StocksLabel } from './style'

const StocksBadge = ({ className = '', isPortfolio = false }) => (
  <Stocks className={className}>
    <StocksLabel $isportfolio={isPortfolio}>Stocks</StocksLabel>
  </Stocks>
)

export default StocksBadge
