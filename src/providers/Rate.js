import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import Dollar from '../assets/images/logos/sidebar/dollar.svg'
import Pound from '../assets/images/logos/sidebar/pound.svg'
import Euro from '../assets/images/logos/sidebar/euro.svg'
import { CURRENCY_RATES_API_ENDPOINT, SUPPORTED_CURRENCY } from '../constants'

const RateContext = createContext()
const useRate = () => useContext(RateContext)

const supportedCurrencies = [
  {
    id: SUPPORTED_CURRENCY.USD,
    symbol: 'USD',
    icon: '$',
    imgPath: Dollar,
  },
  {
    id: SUPPORTED_CURRENCY.GBP,
    symbol: 'GBP',
    icon: '£',
    imgPath: Pound,
  },
  {
    id: SUPPORTED_CURRENCY.EUR,
    symbol: 'EUR',
    icon: '€',
    imgPath: Euro,
  },
]

const fetchDataFromAPI = (endpoint, defaultValue = null) =>
  axios
    .get(endpoint)
    .then(res => get(res, 'data', defaultValue))
    .catch(err => {
      console.error(err)
      return defaultValue
    })

const RateProvider = ({ children }) => {
  const [rates, setRates] = useState({
    currency: supportedCurrencies[0],
  })

  const firstRateRender = useRef(true)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rateData = await fetchDataFromAPI(CURRENCY_RATES_API_ENDPOINT)
        setRates(prevRates => ({
          ...prevRates,
          rateData, // Update only the rateData property
        }))
      } catch (error) {
        console.error('Error fetching currency rates:', error)
      }
    }

    if (firstRateRender.current) {
      fetchRates()
      firstRateRender.current = false
    }
  }, [])

  const updateCurrency = value => {
    setRates({
      ...rates,
      currency: supportedCurrencies[value],
    })
  }

  return <RateContext.Provider value={{ rates, updateCurrency }}>{children}</RateContext.Provider>
}

export { RateProvider, useRate }
