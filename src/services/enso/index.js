import axios from 'axios'
import { fromWei } from '../web3'

// eslint-disable-next-line consistent-return
const getBalances = async (account, chainId) => {
  try {
    const response = await axios.get(`https://api.enso.finance/api/v1/wallet/balances`, {
      params: {
        chainId,
        eoaAddress: account,
        useEoa: true,
      },
    })
    if (Array.isArray(response.data)) {
      const curBalances = response.data
      const curSortedBalances = curBalances.sort(function reducer(a, b) {
        return Number(fromWei(b.amount, b.decimals)) - Number(fromWei(a.amount, a.decimals))
      })
      return curSortedBalances
    }
  } catch (err) {
    console.log(err)
  }
}

export default getBalances
