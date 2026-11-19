import { CHAIN_IDS } from '../data/constants'
import { isSpecialApp } from '../utilities/formats'
import { getChainName } from '../utilities/parsers'
import { useSetChain } from './thirdweb'
import { useWallet } from './Wallet'

const useRequiredChain = (requiredChain = CHAIN_IDS.BASE) => {
  const { chainId, connected } = useWallet()
  const [{ connectedChain }, setChain] = useSetChain()
  const currentChain = isSpecialApp
    ? chainId
    : connectedChain
      ? parseInt(connectedChain.id, 16).toString()
      : ''
  const wrongNetwork = Boolean(connected) && currentChain !== '' && currentChain !== requiredChain

  const switchNetwork = async () => {
    if (!isSpecialApp) {
      await setChain({ chainId: `0x${Number(requiredChain).toString(16)}` })
    }
  }

  return {
    wrongNetwork,
    switchLabel: `Change Network to ${getChainName(requiredChain)}`,
    switchNetwork,
  }
}

export default useRequiredChain
