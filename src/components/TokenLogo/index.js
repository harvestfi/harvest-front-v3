import React, { useEffect, useMemo, useState } from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import { LogoFallback } from './style'

const TokenLogo = ({ src, fallbackSrc, symbol, size = 26, className, marginRight }) => {
  const { darkMode } = useThemeContext()
  const sources = useMemo(
    () =>
      [src, fallbackSrc].filter((source, index, all) => source && all.indexOf(source) === index),
    [src, fallbackSrc],
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setAttempt(0)
  }, [sources])

  const source = sources[attempt]

  if (!source) {
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
      key={source}
      className={className}
      src={source}
      onError={() => setAttempt(current => current + 1)}
      width={size}
      height={size}
      alt=""
    />
  )
}

export default TokenLogo
