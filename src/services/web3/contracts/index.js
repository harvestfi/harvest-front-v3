import { isArray } from 'lodash'
import TokenContract from './token/contract.json'
import TokenMethods from './token/methods'

import DepositHelperContract from './deposit-helper/contract.json'
import DepositHelperMethods from './deposit-helper/methods'

import UniswapContract from './uniswap/contract.json'
import UniswapMethods from './uniswap/methods'

import APRedemptionContract from './ap-redemption/contract.json'
import APRedemptionMethods from './ap-redemption/methods'

import ReaderEthContract from './reader-eth/contract.json'
import ReaderEthMethods from './reader-eth/methods'

import ReaderMaticContract from './reader-matic/contract.json'
import ReaderMaticMethods from './reader-matic/methods'

import ReaderArbitrumContract from './reader-arbitrum/contract.json'
import ReaderArbitrumMethods from './reader-arbitrum/methods'

import ReaderBaseContract from './reader-base/contract.json'
import ReaderBaseMethods from './reader-base/methods'

import { CHAIN_IDS } from '../../../data/constants'

const { tokens } = require('../../../data')

const getTokensContracts = () => {
  const tokenContracts = {}

  Object.keys(tokens).forEach(token => {
    if (!isArray(tokens[token].tokenAddress)) {
      tokenContracts[token] = {
        contract: {
          address: tokens[token].tokenAddress,
          abi: TokenContract.abi,
        },
        methods: TokenMethods,
        chain: tokens[token].chain,
      }
    }
  })

  return tokenContracts
}

export default {
  depositHelper: {
    contract: DepositHelperContract,
    methods: DepositHelperMethods,
    chain: CHAIN_IDS.ETH_MAINNET,
  },
  uniswap: {
    contract: UniswapContract,
    methods: UniswapMethods,
    chain: CHAIN_IDS.ETH_MAINNET,
  },
  apRedemtion: {
    contract: APRedemptionContract,
    methods: APRedemptionMethods,
    chain: CHAIN_IDS.ETH_MAINNET,
  },
  readerEth: {
    contract: ReaderEthContract,
    methods: ReaderEthMethods,
    chain: CHAIN_IDS.ETH_MAINNET,
  },

  readerMatic: {
    contract: ReaderMaticContract,
    methods: ReaderMaticMethods,
    chain: CHAIN_IDS.POLYGON_MAINNET,
  },

  readerArbitrum: {
    contract: ReaderArbitrumContract,
    methods: ReaderArbitrumMethods,
    chain: CHAIN_IDS.ARBITRUM_ONE,
  },

  readerBase: {
    contract: ReaderBaseContract,
    methods: ReaderBaseMethods,
    chain: CHAIN_IDS.BASE,
  },
  ...getTokensContracts(),
}
