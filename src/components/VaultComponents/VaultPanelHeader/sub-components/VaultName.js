import React from 'react'
import { TokenNameContainer, TokenDescriptionContainer } from '../style'
import { tokens } from '../../../../data'
import {
  IFARM_TOKEN_SYMBOL,
} from '../../../../constants'

const VaultName = ({ token, tokenSymbol, useIFARM}) => {
  return (
    <TokenDescriptionContainer>
      <TokenNameContainer>
        {useIFARM ? tokens[IFARM_TOKEN_SYMBOL].displayName : token.displayName || tokenSymbol}
      </TokenNameContainer>
      {useIFARM
        ? tokens[IFARM_TOKEN_SYMBOL].subLabel
        : token.subLabel && <small>{token.subLabel}</small>}
    </TokenDescriptionContainer>
  )
}

export default VaultName
