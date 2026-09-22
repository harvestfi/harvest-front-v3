import React from 'react'
import { PROMOTED_VAULT_BADGE } from '../../constants'
import { Promoted, PromotedLabel } from './style'

const PromotedBadge = ({ className = '' }) => (
  <Promoted className={className}>
    <PromotedLabel>{PROMOTED_VAULT_BADGE}</PromotedLabel>
  </Promoted>
)

export default PromotedBadge
