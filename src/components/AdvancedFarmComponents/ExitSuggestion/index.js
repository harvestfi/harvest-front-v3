import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { find, get } from 'lodash'
import {
  DECIMAL_PRECISION,
  EXIT_SUGGESTION_VAULTS,
  chainList,
  directDetailUrl,
} from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useVaults } from '../../../providers/Vault'
import { displayAPY } from '../../../utilities/formats'
import { getTotalApy } from '../../../utilities/parsers'
import AnimatedDots from '../../AnimatedDots'
import TokenLogo from '../../TokenLogo'
import {
  SuggestionBox,
  Caption,
  SuggestionCard,
  Logos,
  Info,
  NameRow,
  Name,
  ApyPill,
  StrategyLabel,
  OpenTag,
} from './style'

const sameAddress = (a, b) =>
  typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase()

const logoPath = path => (path.startsWith('./') ? path.slice(1) : path)

export const useExitSuggestion = token => {
  const { allVaultsData } = useVaults()
  const vaultAddress = get(token, 'vaultAddress')
  const config =
    typeof vaultAddress === 'string' ? EXIT_SUGGESTION_VAULTS[vaultAddress.toLowerCase()] : null

  return useMemo(() => {
    if (!config) return null

    const vault = find(allVaultsData, item => sameAddress(item.vaultAddress, config.vaultAddress))
    const network = vault && find(chainList, chain => chain.chainId === Number(vault.chain))

    if (!vault || !network || vault.inactive || vault.testInactive) return null

    return {
      label: config.label,
      vault,
      url: `${directDetailUrl}${network.name.toLowerCase()}/${vault.vaultAddress}`,
    }
  }, [config, allVaultsData])
}

const ExitSuggestion = ({ suggestion }) => {
  const { label, vault, url } = suggestion
  const { search } = useLocation()
  const { loadingVaults } = useVaults()
  const { allPools } = usePools()
  const { fontColor2, fontColor3 } = useThemeContext()

  const vaultPool = find(allPools, pool => pool.collateralAddress === vault.vaultAddress)
  const totalApy = getTotalApy(vaultPool, vault)
  const showApy = vault.dataFetched && !vault.hideTotalApy && totalApy !== null
  const tokenNames = get(vault, 'tokenNames', [])

  return (
    <SuggestionBox>
      <Caption $fontcolor={fontColor3}>Other users also explored</Caption>
      <SuggestionCard to={`${url}${search}`} $focuscolor={fontColor2}>
        <Logos>
          {get(vault, 'logoUrl', []).map((logo, i) => (
            <TokenLogo
              key={i}
              className="suggestion-logo"
              src={logoPath(logo)}
              symbol={tokenNames[i]}
              size={28}
            />
          ))}
        </Logos>
        <Info>
          <NameRow>
            <Name>{tokenNames.join(' - ')}</Name>
            {loadingVaults ? (
              <ApyPill>
                <AnimatedDots />
              </ApyPill>
            ) : showApy ? (
              <ApyPill>{displayAPY(totalApy, DECIMAL_PRECISION, 10)} APY</ApyPill>
            ) : null}
          </NameRow>
          <StrategyLabel>{label}</StrategyLabel>
        </Info>
        <OpenTag>
          <span className="open-label">Open</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M5.4 3.5 8.9 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </OpenTag>
      </SuggestionCard>
    </SuggestionBox>
  )
}

export default ExitSuggestion
