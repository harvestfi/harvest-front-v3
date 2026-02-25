import { defineChain, createThirdwebClient } from 'thirdweb'
// eslint-disable-next-line import/no-unresolved
import { useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react'

const thirdwebClientId = process.env.REACT_APP_THIRDWEB_CLIENT_ID || 'harvest-ui'

export const thirdwebClient = createThirdwebClient({
  clientId: thirdwebClientId,
})

export const useSetChain = () => {
  const connectedChain = useActiveWalletChain()
  const switchActiveWalletChain = useSwitchActiveWalletChain()
  const connectedChainHex = connectedChain?.id
    ? `0x${Number(connectedChain.id).toString(16)}`
    : undefined

  const setChain = async ({ chainId }) => {
    if (!chainId) return
    const numericChainId = Number.parseInt(chainId, 16)
    if (Number.isNaN(numericChainId)) return

    await switchActiveWalletChain(defineChain(numericChainId))
  }

  return [
    {
      connectedChain: connectedChain
        ? {
            ...connectedChain,
            id: connectedChainHex,
          }
        : connectedChain,
    },
    setChain,
  ]
}
