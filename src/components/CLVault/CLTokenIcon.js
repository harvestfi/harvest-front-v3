import React, { useEffect, useState } from 'react'
import { TokenIcon, TokenMonogram } from './style'

const CLTokenIcon = ({ token, size = '20px', cardBg }) => {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [token.logo])

  if (!token.logo || failed) {
    return (
      <TokenMonogram $color={token.color} $cardbg={cardBg} $size={size}>
        {(token.symbol || '?').slice(0, 1)}
      </TokenMonogram>
    )
  }

  return (
    <TokenIcon src={token.logo} alt={token.symbol} $size={size} onError={() => setFailed(true)} />
  )
}

export default CLTokenIcon
