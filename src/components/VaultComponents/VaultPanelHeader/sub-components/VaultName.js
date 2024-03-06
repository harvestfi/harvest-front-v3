import React from 'react'
import { IFARM_TOKEN_SYMBOL } from '../../../../constants'
import { tokens } from '../../../../data'
import { TokenDescriptionContainer, TokenNameContainer } from '../style'

const VaultName = ({ token, tokenSymbol, useIFARM }) => {
  return (
    <TokenDescriptionContainer>
      <TokenNameContainer>
        {useIFARM
          ? tokens[IFARM_TOKEN_SYMBOL].tokenNames.join(', ')
          : token.tokenNames.join(', ') || tokenSymbol}
      </TokenNameContainer>
      {useIFARM
        ? tokens[IFARM_TOKEN_SYMBOL].subLabel
          ? `${tokens[IFARM_TOKEN_SYMBOL].platform[0]} - ${tokens[IFARM_TOKEN_SYMBOL].subLabel}`
          : tokens[IFARM_TOKEN_SYMBOL].platform[0]
        : token.subLabel
        ? token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
        : token.platform[0] && token.platform[0]}
    </TokenDescriptionContainer>
  )
}

export default VaultName
