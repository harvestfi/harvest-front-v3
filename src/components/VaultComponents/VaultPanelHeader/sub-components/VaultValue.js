import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { formatNumber } from '../../../../utilities/formats'
import AnimatedDots from '../../../AnimatedDots'
import { useRate } from '../../../../providers/Rate'
import { Value } from '../style'

const getVaultValue = (token, rate) => {
  return new BigNumber(get(token, 'totalValueLocked', 0)) * Number(rate)
}

const VaultValue = ({ token, fontColor1 }) => {
  const [vaultValue, setVaultValue] = useState(null)
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    setVaultValue(getVaultValue(token, currencyRate))
  }, [token, currencyRate])

  return (
    <Value $fontcolor1={fontColor1}>
      {token.excludeVaultStats ? (
        'N/A'
      ) : vaultValue ? (
        <>
          {`${currencySym}`}
          {formatNumber(vaultValue, 2)}
        </>
      ) : (
        <AnimatedDots />
      )}
    </Value>
  )
}

export default VaultValue
