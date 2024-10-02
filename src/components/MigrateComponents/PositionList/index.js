import React from 'react'
import { VaultBox, Content, InfoText, BadgeIcon, Token, ApyDownIcon, BadgeToken } from './style'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import { formatNumber } from '../../../utilities/formats'

const PositionList = ({
  matchVault,
  currencySym,
  networkName,
  setShowPositionModal,
  positionVaultAddress,
  setPositionVaultAddress,
  setHighestPosition,
  setIsFromModal,
  stopPropagation,
}) => {
  const vaultAddress = matchVault.token.poolVault
    ? matchVault.token.tokenAddress
    : matchVault.token.vaultAddress
  const vaultName = matchVault.token.tokenNames

  const isCurrentPosition = positionVaultAddress === vaultAddress

  return (
    <VaultBox
      borderBottom="1px solid #ECECEC"
      onClick={() => {
        if (!isCurrentPosition) {
          setShowPositionModal(false)
          setHighestPosition(matchVault)
          setPositionVaultAddress(vaultAddress)
          setIsFromModal(true)
        }
      }}
      bgColor={isCurrentPosition ? '#f2f5ff' : ''}
      cursorType={isCurrentPosition ? 'not-allowed' : 'pointer'}
    >
      <Content alignItems="start">
        <InfoText fontSize="10px" fontWeight="500" color="#5fCf76">
          {`${currencySym}${formatNumber(matchVault.balance)}`}
        </InfoText>
        <BadgeToken>
          <BadgeIcon>
            <img src={matchVault.chain ? matchVault.chain : ETHEREUM} alt="" />
          </BadgeIcon>
          <Token
            href={`${window.location.origin}/${networkName}/${vaultAddress}`}
            onClick={stopPropagation}
          >
            {vaultName.join(', ')}
          </Token>
        </BadgeToken>
      </Content>
      <ApyDownIcon>
        <Content alignItems="end">
          <InfoText fontSize="10px" fontWeight="700" color="#5fCf76">
            {`${matchVault.apy}% Live APY`}
          </InfoText>
          <InfoText fontSize="10px" fontWeight="500" color="#6988ff">
            {`${currencySym}${formatNumber(matchVault.apy / 100)}/yr per $1 allocated`}
          </InfoText>
        </Content>
      </ApyDownIcon>
    </VaultBox>
  )
}

export default PositionList
