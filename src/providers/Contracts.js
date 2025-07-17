import React, { createContext, useContext, useState, useEffect } from 'react'
import promiseObject from 'promise-all-object'
import importedContracts from '../services/viem/contracts'
import {
  newContractInstance,
  newIPORContractInstance,
  maticVIem,
  arbitrumViem,
  baseViem,
  zksyncViem,
  infuraViem,
} from '../services/viem'
import { CHAIN_IDS } from '../data/constants'

const ContractsContext = createContext()
const useContracts = () => useContext(ContractsContext)

const getViem = chainId => {
  if (chainId === CHAIN_IDS.POLYGON_MAINNET) {
    return maticVIem
  }

  if (chainId === CHAIN_IDS.ARBITRUM_ONE) {
    return arbitrumViem
  }

  if (chainId === CHAIN_IDS.BASE) {
    return baseViem
  }

  if (chainId === CHAIN_IDS.ZKSYNC) {
    return zksyncViem
  }

  return infuraViem
}

const ContractsProvider = _ref => {
  const { children } = _ref
  const [contracts, setContracts] = useState({})
  useEffect(() => {
    const initializeContracts = async () => {
      const temporaryGroupOfContracts = {}
      const iporContracts = {}
      Object.keys(importedContracts).forEach(contract => {
        if (contract !== 'iporVaults') {
          Object.assign(temporaryGroupOfContracts, {
            [contract]: {
              instance: newContractInstance(
                contract,
                null,
                null,
                getViem(importedContracts[contract].chain),
              ),
              methods: importedContracts[contract].methods,
              address: importedContracts[contract].contract.address,
            },
          })
        } else {
          Object.keys(importedContracts.iporVaults).forEach(iporContract => {
            Object.assign(iporContracts, {
              [iporContract]: {
                instance: newIPORContractInstance(
                  importedContracts.iporVaults[iporContract].contract.address,
                  importedContracts.iporVaults[iporContract].contract.abi,
                  getViem(importedContracts.iporVaults[iporContract].chain),
                ),
                methods: importedContracts.iporVaults[iporContract].methods,
                address: importedContracts.iporVaults[iporContract].contract.address,
                chain: importedContracts.iporVaults[iporContract].chain,
              },
            })
          })
        }
      })
      temporaryGroupOfContracts.iporVaults = iporContracts
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
