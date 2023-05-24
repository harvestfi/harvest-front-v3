import React, { createContext, useContext, useState, useEffect } from 'react'
import promiseObject from 'promise-all-object'
import importedContracts from '../services/web3/contracts'
import { newContractInstance, maticWeb3, arbitrumWeb3, infuraWeb3 } from '../services/web3'
import { isLedgerLive } from '../utils'
import { CHAINS_ID } from '../data/constants'

const ContractsContext = createContext()
const useContracts = () => useContext(ContractsContext)

const getWeb3 = chainId => {
  if (chainId === CHAINS_ID.MATIC_MAINNET) {
    return maticWeb3
  }

  if (chainId === CHAINS_ID.ARBITRUM_ONE) {
    return arbitrumWeb3
  }

  return infuraWeb3
}

const ContractsProvider = _ref => {
  const { children } = _ref
  const [contracts, setContracts] = useState({})
  useEffect(() => {
    const initializeContracts = async () => {
      const temporaryGroupOfContracts = {}
      Object.keys(importedContracts).forEach(contract => {
        if (!isLedgerLive() || (isLedgerLive() && contract.chain !== CHAINS_ID.ARBITRUM_ONE)) {
          Object.assign(temporaryGroupOfContracts, {
            [contract]: {
              instance: newContractInstance(
                contract,
                null,
                null,
                getWeb3(importedContracts[contract].chain),
              ),
              methods: importedContracts[contract].methods,
              address: importedContracts[contract].contract.address,
            },
          })
        }
      })
      const initializedContracts = await promiseObject(temporaryGroupOfContracts)
      setContracts(initializedContracts)
    }

    initializeContracts()
  }, [])
  return React.createElement(
    ContractsContext.Provider,
    {
      value: {
        contracts,
      },
    },
    Object.keys(contracts).length ? children : '',
  )
}

export { ContractsProvider, useContracts }
