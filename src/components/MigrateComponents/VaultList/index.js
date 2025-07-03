import React from 'react'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import ARBITRUM from '../../../assets/images/logos/badge/arbitrum.svg'
import POLYGON from '../../../assets/images/logos/badge/polygon.svg'
import ZKSYNC from '../../../assets/images/logos/badge/zksync.svg'
import BASE from '../../../assets/images/logos/badge/base.svg'
import { formatNumber } from '../../../utilities/formats'
import {
  VaultBox,
  Content,
  InfoText,
  BadgeIcon,
  BadgeToken,
  Token,
  ApyDownIcon,
} from '../PositionList/style'

const VaultList = ({
  matchVault,
  currencySym,
  networkName,
  setShowVaultModal,
  setHighestVaultAddress,
  setHighestApyVault,
  setIsFromModal,
  stopPropagation,
  darkMode,
  filteredFarmList,
  chainId,
  setToken,
  setId,
  groupOfVaults,
  connected,
  currencyRate,
}) => {
  let chainUrl, matchingFarm
  const vaultAddress = matchVault.vault.vaultAddress
  const vaultName = matchVault.vault.tokenNames
  if (connected) {
    chainUrl =
      chainId === 42161
        ? ARBITRUM
        : chainId === 8453
          ? BASE
          : chainId === 324
            ? ZKSYNC
            : chainId === 137
              ? POLYGON
              : ETHEREUM
  } else if (!connected) {
    chainUrl = BASE
  }
  const id = matchVault.vault.id || matchVault.vault.pool.id
  const token = matchVault.vault
  const platformName = token.subLabel
    ? token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
    : token.platform[0] && token.platform[0]

  filteredFarmList.forEach(farm => {
    const farmAddress = farm.token.vaultAddress
    if (farmAddress.toLowerCase() === vaultAddress.toLowerCase()) {
      matchingFarm = farm
    }
  })

  return (
    <VaultBox
      $borderbottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
      onClick={() => {
        setShowVaultModal(false)
        setHighestApyVault(matchVault)
        setHighestVaultAddress(vaultAddress)
        setIsFromModal(true)
        setId(id.toString())
        setToken(groupOfVaults[id.toString()])
      }}
      $hoverbgcolor={darkMode ? '#1F242F' : '#e9f0f7'}
    >
      <Content $alignitems="start">
        <InfoText $fontsize="10px" $fontweight="500" $fontcolor="#5fCf76">
          {matchingFarm
            ? `${currencySym}${formatNumber(matchingFarm.balance * currencyRate)}`
            : '-'}
        </InfoText>
        <BadgeToken>
          <BadgeIcon>
            <img src={chainUrl} alt="" />
          </BadgeIcon>
          <Token
            $fontcolor={darkMode ? '#ffffff' : '#414141'}
            href={`${window.location.origin}/${networkName}/${vaultAddress}`}
            onClick={stopPropagation}
          >
            {`${vaultName.join(', ')} (${platformName})`}
          </Token>
        </BadgeToken>
      </Content>
      <ApyDownIcon>
        <Content $alignitems="end">
          <InfoText $fontsize="10px" $fontweight="700" $fontcolor="#5fCf76">
            {`${matchVault.vaultApy}% Live APY`}
          </InfoText>
          <InfoText $fontsize="10px" $fontweight="500" $fontcolor="#6988ff">
            {`$${formatNumber(matchVault.vaultApy / 100)}/yr per $1 allocated`}
          </InfoText>
        </Content>
      </ApyDownIcon>
    </VaultBox>
  )
}

export default VaultList
