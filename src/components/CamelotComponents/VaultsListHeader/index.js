import React from 'react'
import { HeaderContainer } from './style'
import QuickFilter from '../QuickFilter'

const VaultListHeader = ({ ...props }) => (
  <HeaderContainer>
    <QuickFilter {...props} />
  </HeaderContainer>
)

export default VaultListHeader
