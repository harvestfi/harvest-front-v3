import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import {
  HalfInfo,
  CardTitle,
  Body,
  Intro,
  RouteBox,
  RouteHead,
  RouteHeadLeft,
  Badge,
  RouteTitle,
  RouteText,
  BulletList,
} from './style'

const ROUTE_TINTS = {
  a: {
    light: { back: '#F5F7FF', border: '#DDE3FF', badge: '#E4E9FF', badgeFont: '#3538CD' },
    dark: {
      back: 'rgba(83, 101, 234, 0.12)',
      border: 'rgba(83, 101, 234, 0.35)',
      badge: 'rgba(83, 101, 234, 0.28)',
      badgeFont: '#B6C0FF',
    },
  },
  b: {
    light: { back: '#FFFAF0', border: '#FBE3BC', badge: '#FDF0D6', badgeFont: '#B54708' },
    dark: {
      back: 'rgba(255, 148, 0, 0.12)',
      border: 'rgba(255, 148, 0, 0.32)',
      badge: 'rgba(255, 148, 0, 0.25)',
      badgeFont: '#FFC36B',
    },
  },
}

const RevertExitMechanics = ({ outputSymbol, strategyTokenSymbol }) => {
  const { darkMode, bgColorNew, borderColorBox, fontColor2, fontColor3, fontColor4 } =
    useThemeContext()

  const mode = darkMode ? 'dark' : 'light'
  const routeA = ROUTE_TINTS.a[mode]
  const routeB = ROUTE_TINTS.b[mode]

  return (
    <HalfInfo $marginbottom="20px" $backcolor={bgColorNew} $bordercolor={borderColorBox}>
      <CardTitle $fontcolor={fontColor4} $bordercolor={borderColorBox}>
        Reverting &amp; Exit Mechanics
      </CardTitle>
      <Body>
        <Intro $fontcolor={fontColor3}>
          Reverting settles through one of two routes, selected by the output token in the Revert
          panel.
        </Intro>

        <RouteBox $backcolor={routeA.back} $bordercolor={routeA.border}>
          <RouteHead>
            <RouteHeadLeft>
              <Badge $backcolor={routeA.badge} $fontcolor={routeA.badgeFont}>
                Route A
              </Badge>
              <RouteTitle $fontcolor={fontColor4}>Revert into a market token</RouteTitle>
            </RouteHeadLeft>
            <Badge $backcolor={routeA.badge} $fontcolor={routeA.badgeFont}>
              Two-way
            </Badge>
          </RouteHead>
          <RouteText $fontcolor={fontColor2}>
            fTokens are burned at the current share price and the position is unwound into the
            selected output token, such as <b>{outputSymbol}</b> or any other supported asset other
            than the strategy token.
          </RouteText>
          <BulletList $fontcolor={fontColor3} $markercolor={routeA.badgeFont}>
            <li>
              The amount received is net of the exit fee applied by the strategy operator at the
              strategy level, which covers unwinding the position and the associated network costs.
            </li>
            <li>
              Because the position is unwound through the market, the final amount settles at
              execution and the panel quote is an estimate.
            </li>
          </BulletList>
        </RouteBox>

        <RouteBox $backcolor={routeB.back} $bordercolor={routeB.border}>
          <RouteHead>
            <RouteHeadLeft>
              <Badge $backcolor={routeB.badge} $fontcolor={routeB.badgeFont}>
                Route B
              </Badge>
              <RouteTitle $fontcolor={fontColor4}>
                Revert in kind into the strategy token
              </RouteTitle>
            </RouteHeadLeft>
            <Badge $backcolor={routeB.badge} $fontcolor={routeB.badgeFont}>
              One-way
            </Badge>
          </RouteHead>
          <RouteText $fontcolor={fontColor2}>
            fTokens are exchanged for the equivalent balance of <b>{strategyTokenSymbol}</b>, the
            underlying strategy vault token, at the prevailing share price. No market route is used,
            so the settlement is not exposed to slippage or swap pricing, or subject to exit fees.
          </RouteText>
          <BulletList $fontcolor={fontColor3} $markercolor={routeB.badgeFont}>
            <li>
              The strategy vault token continues to accrue value at the issuer level. An exit fee
              may still apply later, at the strategy operator level, when the token itself is
              redeemed there.
            </li>
            <li>
              Any rewards that Harvest autocompounds within this setup no longer apply to a position
              held outside of it.
            </li>
            <li>
              The strategy token is not an accepted input for this Autocompounder, so this route
              cannot be reversed from within the product. Such positions are managed on the issuer
              platform or on secondary markets.
            </li>
          </BulletList>
        </RouteBox>
      </Body>
    </HalfInfo>
  )
}

export default RevertExitMechanics
