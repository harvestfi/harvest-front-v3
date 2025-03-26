import React from 'react'

const Erc4626VaultLabel = ({ vaultKey }) => {
  return <HarvestErc4626VaultLabel vaultKey={vaultKey} />
}

const HarvestErc4626VaultLabel = ({ vaultKey }) => {
  if (!vaultKey) return null

  const [firstLetter = '', ...rest] = vaultKey.replace(/_/g, ' ')
  const vaultName = [firstLetter.toUpperCase(), ...rest].join('')

  return vaultName
}

const ProtocolLabel = ({ vaultKey }) => {
  return <Erc4626VaultLabel vaultKey={vaultKey} />
}

export default ProtocolLabel
