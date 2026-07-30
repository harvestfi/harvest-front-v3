import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { LogoFallback } from './style'

const TokenLogo = ({ src, symbol, size = 26, className, marginRight }) => {
  const { darkMode } = useThemeContext()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <LogoFallback
        className={className}
        $size={size}
        $marginright={marginRight}
        $bgcolor={darkMode ? '#333741' : '#eaecf0'}
        $fontcolor={darkMode ? '#cecfd2' : '#475467'}
      >
        {(symbol || '?').charAt(0)}
      </LogoFallback>
    )
  }

  return (
    <img
      className={className}
      src={src}
      onError={() => setFailed(true)}
      width={size}
      height={size}
      alt=""
    />
  )
}

export default TokenLogo
