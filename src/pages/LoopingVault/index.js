import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { PiQuestion } from 'react-icons/pi'
import { Tooltip } from 'react-tooltip'
import { useThemeContext } from '../../providers/useThemeContext'
import Safe from '../../assets/images/logos/beginners/safe.svg'
import BarChart from '../../assets/images/logos/beginners/bar-chart-01.svg'
import HistoryIcon from '../../assets/images/logos/beginners/history.svg'
import BaseChainIcon from '../../assets/images/chains/base.svg'
import TickIcon from '../../assets/images/logos/tick-icon.svg'
import TickCross from '../../assets/images/logos/tick-cross.svg'

/* ============================================================================
 * COMPONENTS REUSE MAP
 * ============================================================================
 * Re-using the EXACT styled-components and JSX patterns from the classic
 * AdvancedFarm vault page. Only CL-specific visuals (range bar, composition
 * bar, two-input form, smart-routing UI, mock chart frame) live in ./style.
 *
 * From ../AdvancedFarm/style.js — page shell:
 *   DetailView, Inner, TopInner, TopPart, FlexTopDiv, BigDiv      page chrome
 *   TopButton, BackBtnRect, BackText                              back button
 *   FlexDiv                                                       generic flex
 *   TopLogo, TopDesc                                              header title
 *   GuideSection, GuidePart                                       APY/TVL chips
 *   TabRow, MainTagPanel, MainTag                                 main tabs
 *   NetDetail, NetDetailItem, NetDetailTitle,
 *     NetDetailContent, NetDetailImg                              right of tabs
 *   MainSection (59%) + RestContent (39%)                         2-col split
 *   BoxCover                                                      Details top row
 *   (ManagePanelsRow lives in CLVault/style.js — local replacement of
 *    AdvancedFarm's ManageBoxWrapper, with mobile gap kept non-zero)
 *   FirstPartSection, RestInternal                                tab content
 *   HalfContent                                                   form box
 *
 * From ../AdvancedFarm/style.js — Manage tab panels (re-used):
 *   MyBalance + NewLabel + FlexDiv + EarningsBadge                top trio
 *   HalfInfo                                                      chart wrapper
 *   SwitchTabTag                                                  Supply/Revert
 *
 * From ../AdvancedFarm/style.js — Details tab (re-used):
 *   BoxCover + ValueBox + BoxTitle + BoxValue                     4 top boxes
 *   HalfInfo                                                      chart card,
 *                                                                 mechanics card,
 *                                                                 source-of-yield
 *   LastHarvestInfo                                               Info, Fees
 *   MyBalance                                                     APY Breakdown
 *   Tip + TipTop + IconPart + CrossDiv                            green Tip box
 *
 * From ../../components/AdvancedFarmComponents/SourceOfYield/style.js:
 *   DescInfo                                                      source text
 *   InfoLabel                                                     address pill
 *
 * NewLabel prop reference (from ../AdvancedFarm/style.js):
 *   $weight, $size, $height, $fontcolor, $backcolor,
 *   $padding, $marginbottom, $margintop, $marginleft, $marginright,
 *   $border, $borderbottom, $borderradius,
 *   $display, $items, $self, $align, $justifycontent, $width
 *
 * Deviation from spec (intentional UX choice):
 *   - Deposit form is single-asset-first. Quick (single asset, CLWrapper
 *     auto-swap to optimal ratio) is the default entry flow because most
 *     users only hold one of the two assets. Two-sided deposit (the
 *     spec-exact dual-input with smart routing) is an opt-in advanced
 *     option, surfaced via a subtle link under the CTA instead of an
 *     equal-weight toggle. Spec wording: "two amount fields, both
 *     available at all times, no mode picker" — we deviate here on
 *     purpose to keep the primary surface simple. State machine still
 *     tracks the two modes and the underlying contract routing
 *     (CLWrapper for single-asset, CLVault.deposit for both) is
 *     unchanged.
 *
 * Tab content shape (matching classic page):
 *   activeMainTag === 0 (Manage):  InternalSection > full-width
 *                                  ManagePanelsRow (3 stats panels) +
 *                                  MainSection (USD/Underlying chart only) +
 *                                  RestContent (Supply/Revert form). Manage
 *                                  is intentionally lean so the deposit form
 *                                  takes focus.
 *   activeMainTag === 1 (Details): InternalSection > full-width BoxCover
 *                                  (4 ValueBox) + MainSection (Share Price
 *                                  chart + Active Range + Position
 *                                  Composition + mechanics + Source of
 *                                  Yield) + RestContent (RestInternal >
 *                                  LastHarvestInfo Info + MyBalance APY
 *                                  Breakdown + LastHarvestInfo Fees +
 *                                  LastHarvestInfo Range parameters
 *                                  collapsible).
 *   activeMainTag === 2 (History): placeholder HalfInfo card.
 * ========================================================================== */

import {
  DetailView,
  Inner,
  TopInner,
  TopPart,
  TopButton,
  BackBtnRect,
  BackText,
  TopLogo,
  TopDesc,
  FlexDiv,
  FlexTopDiv,
  BigDiv,
  GuideSection,
  GuidePart,
  TabRow,
  MainTagPanel,
  MainTag,
  MainSection,
  RestContent,
  HalfContent,
  MyBalance,
  BoxCover,
  ValueBox,
  BoxTitle,
  BoxValue,
  NewLabel,
  EarningsBadge,
  FirstPartSection,
  RestInternal,
  InternalSection,
  HalfInfo,
  LastHarvestInfo,
  Tip,
  TipTop,
  IconPart,
  CrossDiv,
  SwitchTabTag,
  NetDetail,
  NetDetailItem,
  NetDetailTitle,
  NetDetailContent,
  NetDetailImg,
} from '../AdvancedFarm/style'
import { DescInfo, InfoLabel } from '../../components/AdvancedFarmComponents/SourceOfYield/style'
import {
  Badge,
  Footnote,
  FieldLabel,
  FieldBox,
  Input,
  TokenPill,
  Hint,
  Preview,
  RouteNote,
  Cta,
  Slippage,
  ChartFrame,
  AxisYLeft,
  AxisYRight,
  AxisX,
  RangeBtnRow,
  RangeBtn,
  ManagePanelsRow,
  TopDescOverride,
} from './style'

const VAULT = {
  protocol: 'Aave V3',
  pair: { token0: 'cbETH', token1: 'WETH' },
  collateralSymbol: 'cbETH',
  debtSymbol: 'WETH',
  // Structure line shown under the headline.
  structure: 'Leveraged cbETH/WETH carry on Aave V3, ~12.5×',
  feeTier: 'E-mode',
  apy: '8.74%',
  tvl: '$1.83M',
  lastRebalance: '6 hours ago',
  // Live position state.
  position: {
    collateralAmount: '742.18 cbETH',
    collateralUsd: '$2,189,400',
    debtAmount: '687.94 WETH',
    debtUsd: '$2,015,650',
    netUsd: '$173,750',
    currentLtv: 0.921, // 92.1%
    targetLtv: 0.93, // 93% (typical e-mode cbETH/WETH)
    liquidationLtv: 0.95, // 95%
    healthFactor: 1.043,
    healthFactorTarget: 1.06,
    leverage: 12.6, // ~12.6× equity exposure
    eMode: true,
    fold: true,
  },
  // Mock user position so the withdraw flow has something to display.
  userSlice: { shares: '2.4567', token0: '0.00', token1: '7.2284' },
  walletBalances: { token0: '1.4382', token1: '12.7615' },
  // Looping doesn't have a 50/50 optimal — deposit is single-asset. The two-sided
  // form (hidden behind SHOW_TWO_SIDED_TOGGLE) still expects this field, so we
  // hand it 100% / 0% so the legacy balance() helper is a no-op friendly.
  optimalRatio: { token0: 1, token1: 0 },
  params: {
    targetLtv: '93.0%',
    rebalanceCooldown: '1 hour',
    rebalanceTriggerHF: '1.025',
    deLeverageHF: '1.015',
    slippageBps: '50 bps',
    swapVenue: 'Aerodrome (cbETH/WETH 1-tick)',
    maxSwapPct: '8% of net equity per cycle',
  },
  costs: {
    entryFee: '0%',
    exitFee: '0%',
    profitShare: '10%',
    // Rolling median, real interactions over the last 30d.
    typicalEntryBps: '~34 bps',
    typicalExitBps: '~38 bps',
    typicalEntryUsd: '~$0.74 / $1k supplied',
    typicalExitUsd: '~$0.86 / $1k withdrawn',
  },
  details: {
    operatingSince: 'Feb 03 2025',
    operatingDays: 96,
    sharePrice: '1.01207',
    apy: { live: '8.74%', d7: '8.42%', d30: '7.91%', d180: 'n/a', d365: 'n/a', lifetime: '8.10%' },
  },
  // For the deposit/withdraw "position after" preview line.
  vaultUsd: 1830000,
}

const TokenCircle = ({ children, bg, fc, border, overlap, size = 69 }) => {
  const borderWidth = size <= 24 ? 1 : 3
  const fontSize = size <= 24 ? Math.round(size * 0.46) : 18
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        border: `${borderWidth}px solid ${border}`,
        color: fc,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        marginRight: overlap ? -Math.round(size * 0.29) : 0,
        zIndex: overlap ? 1 : 2,
        flexShrink: 0,
        boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
      }}
    >
      {children}
    </div>
  )
}

/* Mini token icon used inside TokenPill (input fields). Colors and glyphs
   match the big header TokenLogo, just shrunk to fit the pill height. */
const tokenIcon = (symbol, border) => {
  const map = {
    cbETH: { bg: '#1652f0', fc: '#fff', glyph: 'cb' },
    WETH: { bg: '#627eea', fc: '#fff', glyph: 'Ξ' },
  }
  const t = map[symbol] || { bg: '#94a3b8', fc: '#fff', glyph: symbol.slice(0, 2) }
  return (
    <TokenCircle bg={t.bg} fc={t.fc} border={border} size={20}>
      {t.glyph}
    </TokenCircle>
  )
}

const TAB_DEFS = [
  { name: 'Manage', img: Safe },
  { name: 'Details', img: BarChart },
  { name: 'History', img: HistoryIcon },
]

const TIME_RANGES = ['Custom', '1D', '1W', '1M', 'ALL', 'LAST']

const Question = ({ id, content, dark }) => (
  <>
    <PiQuestion
      className="question"
      data-tip
      id={id}
      style={{ cursor: 'pointer', flexShrink: 0, fontSize: 14, marginLeft: 4 }}
    />
    <Tooltip
      id={id}
      anchorSelect={`#${id}`}
      backgroundColor={dark ? 'white' : '#101828'}
      borderColor={dark ? 'white' : 'black'}
      textColor={dark ? 'black' : 'white'}
      style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.4 }}
    >
      {content}
    </Tooltip>
  </>
)

const LoopingVault = () => {
  const {
    darkMode,
    bgColorNew,
    bgColorBox,
    bgColorChart,
    fontColor,
    fontColor1,
    fontColor2,
    fontColor3,
    fontColor4,
    fontColor6,
    fontColor8,
    borderColorBox,
    hoverColor,
    hoverColorNew,
    activeColorNew,
  } = useThemeContext()

  const navigate = useNavigate()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  // Two-sided deposit (Pro mode) is currently hidden from the UI — flip to
  // true to surface the "Switch to two-sided deposit" / "Back to single-asset"
  // link below the CTA. All Pro-mode state, validation, route logic, and form
  // JSX remain in the file so flipping this flag re-enables the feature
  // without any other change.
  const SHOW_TWO_SIDED_TOGGLE = false

  const [activeMainTag, setActiveMainTag] = useState(0)
  const [activeDepoTab, setActiveDepoTab] = useState(0)
  const [depMode, setDepMode] = useState('quick') // 'quick' (single-asset via CLWrapper) | 'pro' (dual-input, spec)
  // Looping vault is a single-asset entry — the user always deposits the
  // debt asset (WETH) and withdraws the debt asset. No token picker.
  const [quickToken] = useState('t1')
  // Helper for the form: resolved entry/exit symbol.
  const entrySymbol = VAULT.debtSymbol
  const [quickAmount, setQuickAmount] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [chartRange, setChartRange] = useState('LAST')
  const [detailRange, setDetailRange] = useState('1Y')
  const [showTip, setShowTip] = useState(true)

  const [dep0, setDep0] = useState('')
  const [dep1, setDep1] = useState('')

  const [shares, setShares] = useState('')
  // Withdraw always returns the debt asset (WETH) — no picker.

  const [slip, setSlip] = useState(0.5)

  const depRoute = useMemo(() => {
    const a0 = parseFloat(dep0) > 0
    const a1 = parseFloat(dep1) > 0
    if (a0 && a1)
      return { label: 'Routed via LoopVault.deposit (collateral + debt asset)', kind: 'both' }
    if (a0)
      return {
        label: `Routed via LoopWrapper(${VAULT.pair.token0}): zaps into collateral`,
        kind: 't0',
      }
    if (a1)
      return {
        label: `Routed via LoopWrapper(${VAULT.pair.token1}): zaps into collateral`,
        kind: 't1',
      }
    return null
  }, [dep0, dep1])

  const quickRoute = useMemo(() => {
    if (!parseFloat(quickAmount)) return null
    const sym = quickToken === 't0' ? VAULT.pair.token0 : VAULT.pair.token1
    return { label: `Routed via LoopWrapper(${sym}): zaps into collateral`, kind: quickToken, sym }
  }, [quickAmount, quickToken])

  // Maximize-at-optimal-ratio. Given the user's wallet balances, picks the largest deposit
  // pair that respects VAULT.optimalRatio without exceeding either balance. Uses up the
  // smaller side fully and leaves the difference on the larger side.
  const balance = () => {
    const b0 = parseFloat(VAULT.walletBalances.token0)
    const b1 = parseFloat(VAULT.walletBalances.token1)
    const r0 = VAULT.optimalRatio.token0
    const r1 = VAULT.optimalRatio.token1
    const max = Math.min(b0 / r0, b1 / r1)
    setDep0((max * r0).toFixed(4))
    setDep1((max * r1).toFixed(4))
  }

  const supplyDisabled = (depMode === 'quick' ? !quickRoute : !depRoute) || !agreed
  const withdrawDisabled = !parseFloat(shares)

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  /*
   * Reusable helpers — all use NewLabel + FlexDiv from AdvancedFarm/style,
   * matching the "section title + key/value rows" pattern of the classic page.
   */
  const sectionTitle = text => (
    <NewLabel
      $size="14px"
      $weight="600"
      $height="24px"
      $fontcolor={fontColor4}
      $padding="10px 15px"
      $borderbottom={`1px solid ${borderColorBox}`}
    >
      {text}
    </NewLabel>
  )

  const kvRow = (label, value, key) => (
    <FlexDiv key={key} $justifycontent="space-between" $padding="10px 15px">
      <NewLabel $size="14px" $weight="500" $height="24px" $fontcolor={fontColor3}>
        {label}
      </NewLabel>
      <NewLabel $size="14px" $weight="600" $height="24px" $fontcolor={fontColor1}>
        {value}
      </NewLabel>
    </FlexDiv>
  )

  /* CL-specific top-3 panel for Manage. Mirrors the classic Lifetime Yield
     panel structure exactly: MyBalance > NewLabel header (with PiQuestion) >
     FlexDiv value rows. */
  const managePanel = ({ title, tooltipId, tooltipContent, badge, rows }) => (
    <MyBalance
      $backcolor={bgColorBox}
      $bordercolor={borderColorBox}
      $marginbottom="0"
      $height="auto"
      style={{ minHeight: 130 }}
    >
      <NewLabel
        $display="flex"
        $justifycontent="space-between"
        $size="12px"
        $weight="600"
        $height="20px"
        $fontcolor={fontColor4}
        $padding="10px 15px"
        $borderbottom={`1px solid ${borderColorBox}`}
      >
        <FlexDiv>
          {title}
          {badge && <EarningsBadge>{badge}</EarningsBadge>}
          <Question id={tooltipId} dark={darkMode} content={tooltipContent} />
        </FlexDiv>
      </NewLabel>
      {rows.map(([label, value, token], i) => (
        <FlexDiv
          key={i}
          $justifycontent="space-between"
          $padding="5px 15px"
          style={{ alignItems: 'flex-start' }}
        >
          <NewLabel $size="12px" $weight="500" $height="24px" $fontcolor={fontColor3}>
            {label}
          </NewLabel>
          <FlexDiv style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <NewLabel $size="12px" $weight="600" $height="24px" $fontcolor={fontColor1}>
              {value}
            </NewLabel>
            {token && (
              <NewLabel $size="10px" $weight="500" $height="14px" $fontcolor={fontColor3}>
                {token}
              </NewLabel>
            )}
          </FlexDiv>
        </FlexDiv>
      ))}
    </MyBalance>
  )

  /* Mock balance/share-price chart. Classic uses FarmDetailChart which needs
     live API data; this is a static placeholder with the same chrome. */
  const balanceChart = (
    <HalfInfo
      $padding={isMobile ? '12px' : '20px'}
      $marginbottom="20px"
      $backcolor={bgColorBox}
      $bordercolor={borderColorBox}
    >
      <FlexDiv
        $justifycontent="space-between"
        style={{ alignItems: 'flex-start', gap: 16, marginBottom: 14 }}
      >
        <FlexDiv style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <NewLabel $size="14px" $weight="700" $height="20px" $fontcolor="#5dcf46">
            USD Balance
          </NewLabel>
          <NewLabel $size="12px" $weight="500" $height="18px" $fontcolor={fontColor3}>
            {today} | <span style={{ color: fontColor1, fontWeight: 700 }}>$0.00</span>
          </NewLabel>
        </FlexDiv>
        <FlexDiv style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <NewLabel $size="14px" $weight="700" $height="20px" $fontcolor="#7d68d3">
            Underlying Balance
          </NewLabel>
          <NewLabel $size="12px" $weight="700" $height="18px" $fontcolor={fontColor1}>
            0
          </NewLabel>
        </FlexDiv>
      </FlexDiv>
      <ChartFrame $bg={bgColorBox}>
        <AxisYLeft $muted={fontColor3}>
          <span>$1.08</span>
          <span>$0.88</span>
          <span>$0.49</span>
          <span>$0.30</span>
        </AxisYLeft>
        <AxisYRight $muted={fontColor3}>
          <span>0.00023</span>
          <span>0.00022</span>
          <span>0.00021</span>
          <span>0.00020</span>
        </AxisYRight>
        <AxisX $muted={fontColor3}>
          <span>5/14</span>
          <span>9/23</span>
          <span>2/5</span>
          <span>6/17</span>
          <span>10/26</span>
          <span>5/10</span>
        </AxisX>
        <svg
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            left: 38,
            right: 38,
            top: 12,
            bottom: 28,
            width: 'calc(100% - 76px)',
            height: 'calc(100% - 40px)',
            pointerEvents: 'none',
          }}
        >
          <polyline
            points="0,82 8,78 16,84 24,72 32,76 40,66 48,72 56,58 64,64 72,52 80,60 88,46 96,54 104,42 112,48 120,36 128,44 136,30 144,38 152,26 160,32 168,20 176,28 184,18 192,24 200,14"
            fill="none"
            stroke="#5dcf46"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            points="0,86 8,84 16,90 24,82 32,86 40,76 48,80 56,72 64,76 72,68 80,72 88,60 96,66 104,56 112,62 120,50 128,56 136,42 144,48 152,38 160,44 160,32 176,38 184,30 192,36 200,26"
            fill="none"
            stroke="#7d68d3"
            strokeWidth="1.4"
            strokeDasharray="3,2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </ChartFrame>
      <RangeBtnRow>
        {TIME_RANGES.map(r => (
          <RangeBtn
            key={r}
            type="button"
            $active={chartRange === r}
            $muted={fontColor3}
            $fc={fontColor1}
            onClick={() => setChartRange(r)}
          >
            {r}
          </RangeBtn>
        ))}
      </RangeBtnRow>
    </HalfInfo>
  )

  /* ---------------- Looping-specific helpers ---------------- */

  // Mock spot prices. Real impl reads from oracle / API.
  const usdPrice = { cbETH: 2950, WETH: 2930 }
  const usdValueOf = (sym, amt) => {
    const n = parseFloat(amt) || 0
    return n * (usdPrice[sym] || 0)
  }
  const collateralUsd = 2189400
  const debtUsd = 2015650
  const projectedLtvAfterDeposit = depUsd => (debtUsd / (collateralUsd + depUsd)) * 100
  // Share price denominated in WETH; USD uses the same WETH spot so the only
  // spread between "shares in" and "WETH out" is the exit cost.
  const sharePriceNum = parseFloat(VAULT.details.sharePrice)
  const sharePriceUsd = sharePriceNum * usdPrice.WETH
  const withdrawalUsd = parseFloat(shares) * sharePriceUsd
  const largeWithdraw = withdrawalUsd > VAULT.vaultUsd * 0.05

  // Deposit math (single-asset WETH in). WETH-equivalent value is the gross
  // input minus the median entry cost; shares = net value / share price;
  // yearly yield = net value * APY.
  const entryCostRate = parseFloat(VAULT.costs.typicalEntryBps.replace(/[^\d.]/g, '')) / 10000
  const grossWeth = parseFloat(quickAmount) || 0
  const netWethEquiv = grossWeth * (1 - entryCostRate)
  const sharesReceived = sharePriceNum > 0 ? netWethEquiv / sharePriceNum : 0
  const apyRate = parseFloat(VAULT.apy) / 100 // "8.74%" -> 0.0874
  const yearlyYieldWeth = netWethEquiv * apyRate

  // Withdraw math. WETH out = shares * share price, minus the median exit cost.
  const exitCostRate = parseFloat(VAULT.costs.typicalExitBps.replace(/[^\d.]/g, '')) / 10000
  const sharesIn = parseFloat(shares) || 0
  const grossWethOut = sharesIn * sharePriceNum
  const receiveWeth = grossWethOut * (1 - exitCostRate)
  const exitCostWeth = grossWethOut * exitCostRate

  // Compact USD label sitting inside a FieldBox between the Input and the
  // TokenPill. Empty / zero amounts render nothing.
  const fmtUsd = n =>
    n >= 1000
      ? `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const InFieldUsd = ({ usd }) =>
    usd > 0 ? (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: fontColor3,
          marginRight: 8,
          whiteSpace: 'nowrap',
        }}
      >
        {fmtUsd(usd)}
      </span>
    ) : null

  /* ---------------- Looping-specific panels ---------------- */

  // Pill used inside the Position header for E-mode / Fold badges.
  const Pill = ({ children, $color = '#7d68d3' }) => (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        padding: '3px 8px',
        borderRadius: 4,
        background: bgColorBox,
        border: `1px solid ${borderColorBox}`,
        color: $color,
      }}
    >
      {children}
    </span>
  )

  // Renders a horizontal gauge with a "warn" zone, an optional "danger" zone
  // at the right edge, and up to three markers (current / target / liquidation).
  // Used for both LTV and Health Factor.
  // Horizontal gauge. `zones` is a list of { from, to, color } colored bands
  // (percent of the track); `markers` are vertical ticks that poke above/below.
  const gauge = ({ leftLabel, rightLabel, zones = [], markers }) => (
    <div style={{ margin: '0 15px 6px' }}>
      <div style={{ position: 'relative', height: 14 }}>
        {/* rounded, clipped track holding the colored zones */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: bgColorChart,
            border: `1px solid ${borderColorBox}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {zones.map((z, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${z.from}%`,
                right: `${100 - z.to}%`,
                background: z.color,
              }}
            />
          ))}
        </div>
        {markers.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: -6,
              bottom: -6,
              left: `${m.pct}%`,
              width: m.kind === 'liq' ? 2 : 3,
              background: m.color,
              transform: 'translateX(-50%)',
              borderRadius: 2,
              zIndex: 1,
            }}
            title={`${m.label}: ${m.valueLabel}`}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          fontWeight: 600,
          color: fontColor3,
          margin: '4px 0 0',
        }}
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )

  const hfPos = VAULT.position.healthFactor
  const hfTarget = VAULT.position.healthFactorTarget
  const hfTrigger = parseFloat(VAULT.params.rebalanceTriggerHF)
  const hfDeleverage = parseFloat(VAULT.params.deLeverageHF)
  // HF bar scale: 1.00 (liquidation) -> 1.20 (safe).
  const hfPct = v => Math.max(0, Math.min(100, ((v - 1.0) / 0.2) * 100))

  const ltvCur = VAULT.position.currentLtv * 100
  const ltvTarget = VAULT.position.targetLtv * 100
  const ltvLiq = VAULT.position.liquidationLtv * 100
  // LTV bar scale: 80% -> 95%.
  const ltvPct = v => Math.max(0, Math.min(100, ((v - 80) / 15) * 100))

  const positionPanel = (
    <HalfInfo $backcolor={bgColorBox} $bordercolor={borderColorBox} $marginbottom="20px">
      <FlexDiv
        $padding="10px 15px"
        style={{
          borderBottom: `1px solid ${borderColorBox}`,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
        }}
      >
        <FlexDiv style={{ alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <NewLabel $size="14px" $weight="600" $height="20px" $fontcolor={fontColor4}>
            Position
          </NewLabel>
          {VAULT.position.eMode && <Pill $color="#137a3a">E-mode</Pill>}
          {VAULT.position.fold && <Pill $color="#7d68d3">Fold</Pill>}
          <Pill $color={fontColor3}>{VAULT.position.leverage.toFixed(1)}× leverage</Pill>
        </FlexDiv>
        <NewLabel $size="12px" $weight="500" $height="18px" $fontcolor={fontColor3}>
          Looped collateral on {VAULT.protocol}. Net equity grows from the carry between staking
          yield and borrow APR.
        </NewLabel>
      </FlexDiv>

      {kvRow(
        `Collateral (${VAULT.collateralSymbol})`,
        `${VAULT.position.collateralAmount} (${VAULT.position.collateralUsd})`,
        'col',
      )}
      {kvRow(
        `Debt (${VAULT.debtSymbol})`,
        `${VAULT.position.debtAmount} (${VAULT.position.debtUsd})`,
        'debt',
      )}
      {kvRow('Net equity', VAULT.position.netUsd, 'net')}

      <div style={{ height: 10 }} />
      <FlexDiv $justifycontent="space-between" $padding="0 15px 4px">
        <NewLabel $size="12px" $weight="600" $height="18px" $fontcolor={fontColor4}>
          LTV (loan-to-value)
        </NewLabel>
        <NewLabel $size="12px" $weight="700" $height="18px" $fontcolor={fontColor1}>
          {ltvCur.toFixed(1)}%
        </NewLabel>
      </FlexDiv>
      {gauge({
        leftLabel: '80%',
        rightLabel: '95%',
        zones: [
          { from: ltvPct(ltvTarget), to: ltvPct(ltvLiq), color: 'rgba(249, 115, 22, 0.30)' },
          { from: ltvPct(ltvLiq), to: 100, color: 'rgba(214, 52, 47, 0.38)' },
        ],
        markers: [
          {
            pct: ltvPct(ltvCur),
            color: fontColor1,
            kind: 'cur',
            label: 'Current',
            valueLabel: `${ltvCur.toFixed(2)}%`,
          },
          {
            pct: ltvPct(ltvTarget),
            color: '#137a3a',
            kind: 'tgt',
            label: 'Target',
            valueLabel: `${ltvTarget.toFixed(2)}%`,
          },
          {
            pct: ltvPct(ltvLiq),
            color: '#d6342f',
            kind: 'liq',
            label: 'Liquidation',
            valueLabel: `${ltvLiq.toFixed(2)}%`,
          },
        ],
      })}
      {kvRow('Target LTV', `${ltvTarget.toFixed(1)}%`, 'tltv')}
      {kvRow('Liquidation LTV', `${ltvLiq.toFixed(1)}%`, 'lltv')}
      <div style={{ height: 8 }} />
    </HalfInfo>
  )

  const healthFactorPanel = (
    <HalfInfo $backcolor={bgColorBox} $bordercolor={borderColorBox} $marginbottom="25px">
      <FlexDiv
        $padding="10px 15px"
        style={{
          borderBottom: `1px solid ${borderColorBox}`,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
        }}
      >
        <FlexDiv style={{ alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <NewLabel $size="14px" $weight="600" $height="20px" $fontcolor={fontColor4}>
            Health Factor
          </NewLabel>
          <Badge $ok={hfPos > hfTrigger}>HF {hfPos.toFixed(3)}</Badge>
        </FlexDiv>
        <NewLabel $size="12px" $weight="500" $height="18px" $fontcolor={fontColor3}>
          Liquidation at HF 1.000. Vault deleverages when HF dips below the trigger.
        </NewLabel>
      </FlexDiv>

      <div style={{ paddingTop: 18 }} />
      {gauge({
        leftLabel: '1.00 (liquidation)',
        rightLabel: '1.20',
        // Near liquidation (left, up to forced deleverage) = orange; the safe
        // zone above forced deleverage runs green to the right edge.
        zones: [
          { from: 0, to: hfPct(hfDeleverage), color: 'rgba(249, 115, 22, 0.38)' },
          { from: hfPct(hfDeleverage), to: 100, color: 'rgba(93, 207, 70, 0.30)' },
        ],
        markers: [
          {
            pct: hfPct(hfPos),
            color: fontColor1,
            kind: 'cur',
            label: 'Current HF',
            valueLabel: hfPos.toFixed(3),
          },
          {
            pct: hfPct(hfTarget),
            color: '#137a3a',
            kind: 'tgt',
            label: 'Target HF',
            valueLabel: hfTarget.toFixed(3),
          },
          {
            pct: hfPct(hfTrigger),
            color: '#f59e0b',
            kind: 'trg',
            label: 'Rebalance trigger',
            valueLabel: hfTrigger.toFixed(3),
          },
          {
            pct: hfPct(hfDeleverage),
            color: '#d6342f',
            kind: 'liq',
            label: 'Forced deleverage',
            valueLabel: hfDeleverage.toFixed(3),
          },
        ],
      })}
      <div style={{ height: 8 }} />
      {kvRow('Current HF', hfPos.toFixed(3), 'chf')}
      {kvRow('Target HF', hfTarget.toFixed(3), 'thf')}
      {kvRow('Rebalance trigger', `< ${hfTrigger.toFixed(3)}`, 'rt')}
      {kvRow('Forced deleverage', `< ${hfDeleverage.toFixed(3)}`, 'dl')}
      <Footnote $muted={fontColor3}>Last rebalance: {VAULT.lastRebalance}.</Footnote>
    </HalfInfo>
  )

  const mechanicsPanel = (
    <HalfInfo $marginbottom="25px" $backcolor={bgColorBox} $bordercolor={borderColorBox}>
      {sectionTitle('How this vault works')}
      <NewLabel
        $padding="14px 15px 6px"
        $size="13.5px"
        $weight="400"
        $height="22px"
        $fontcolor={fontColor3}
      >
        Incoming {VAULT.debtSymbol} is routed into {VAULT.collateralSymbol} and supplied as
        collateral to {VAULT.protocol} in E-mode. The vault borrows {VAULT.debtSymbol}, re-supplies
        it as more {VAULT.collateralSymbol}, and folds the loop until the target LTV is reached. The
        carry between staking yield and borrow APR compounds into share price. No claim or re-supply
        action is required.
      </NewLabel>
      <NewLabel
        $padding="0 15px 12px"
        $size="13.5px"
        $weight="400"
        $height="22px"
        $fontcolor={fontColor3}
      >
        When the health factor approaches the rebalance trigger, the vault deleverages by selling
        collateral, repaying debt, and reverting to target LTV. Swaps are TWAP-gated and capped to
        limit price impact.
      </NewLabel>
      {kvRow('Target LTV', VAULT.params.targetLtv, 'mtl')}
      {kvRow('Rebalance trigger (HF)', VAULT.params.rebalanceTriggerHF, 'mrt')}
      {kvRow('Slippage cap', VAULT.params.slippageBps, 'msc')}
      <div style={{ height: 8 }} />
    </HalfInfo>
  )

  return (
    <DetailView $backcolor={bgColorNew} $fontcolor={fontColor1}>
      <TopInner $darkmode={darkMode}>
        <TopPart>
          <FlexTopDiv>
            <TopButton className="back-btn">
              <BackBtnRect $fontcolor={fontColor} onClick={() => navigate('/')}>
                <BiLeftArrowAlt fontSize={16} />
                <BackText $fontcolor={fontColor}>Back</BackText>
              </BackBtnRect>
            </TopButton>

            <FlexDiv className="farm-symbol">
              <TopLogo>
                <TokenCircle bg="#1652f0" fc="#fff" border={bgColorBox} overlap>
                  cb
                </TokenCircle>
                <TokenCircle bg="#627eea" fc="#fff" border={bgColorBox}>
                  Ξ
                </TokenCircle>
              </TopLogo>
              <TopDescOverride>
                <TopDesc
                  $weight={600}
                  $fontcolor2={fontColor2}
                  $size="25px"
                  $height="82px"
                  $marginbottom="10px"
                >
                  {VAULT.pair.token0}/{VAULT.pair.token1}
                  <span
                    id="loop-badge-target-tip"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: bgColorBox,
                      border: `1px solid ${borderColorBox}`,
                      color: '#7d68d3',
                      marginLeft: 10,
                      verticalAlign: 'middle',
                      cursor: 'help',
                    }}
                  >
                    {VAULT.position.leverage.toFixed(1)}× LOOP
                  </span>
                  <Tooltip
                    anchorSelect="#loop-badge-target-tip"
                    backgroundColor={darkMode ? 'white' : '#101828'}
                    borderColor={darkMode ? 'white' : 'black'}
                    textColor={darkMode ? 'black' : 'white'}
                    style={{ maxWidth: 280, fontSize: 12, lineHeight: 1.45, fontWeight: 500 }}
                  >
                    Target loop multiple for this vault. The live leverage moves with price and is
                    shown under the Details tab → Position panel.
                  </Tooltip>
                </TopDesc>
              </TopDescOverride>
            </FlexDiv>

            <GuideSection>
              <GuidePart $backcolor={bgColorBox} $fontcolor4={fontColor4}>
                {VAULT.apy} APY
              </GuidePart>
              <GuidePart $backcolor={bgColorBox} $fontcolor4={fontColor4}>
                {VAULT.tvl} TVL
              </GuidePart>
            </GuideSection>

            <TabRow>
              <MainTagPanel>
                {TAB_DEFS.map((tag, i) => (
                  <MainTag
                    key={tag.name}
                    $threetabs
                    $active={activeMainTag === i ? 'true' : 'false'}
                    $backcolor={bgColorNew}
                    $fontcolor3={fontColor3}
                    $fontcolor4={fontColor4}
                    $mode={darkMode ? 'dark' : 'light'}
                    onClick={() => setActiveMainTag(i)}
                  >
                    <img src={tag.img} alt="" />
                    <p>{tag.name}</p>
                  </MainTag>
                ))}
              </MainTagPanel>
              <NetDetail>
                <NetDetailItem>
                  <NetDetailContent $fontcolor={fontColor}>
                    Leveraged Loop - {VAULT.protocol}
                  </NetDetailContent>
                </NetDetailItem>
                <NetDetailItem>
                  <NetDetailTitle $fontcolor={fontColor}>Network</NetDetailTitle>
                  <NetDetailImg $fontcolor={fontColor}>
                    <img src={BaseChainIcon} alt="Base" />
                  </NetDetailImg>
                </NetDetailItem>
              </NetDetail>
            </TabRow>
          </FlexTopDiv>
        </TopPart>
      </TopInner>

      <Inner $backcolor={bgColorNew}>
        <BigDiv>
          {/* MANAGE TAB */}
          {activeMainTag === 0 && (
            <InternalSection>
              {/* Top row: 3 stats panels — full width, sibling of MainSection */}
              <ManagePanelsRow>
                {managePanel({
                  title: 'Lifetime Yield',
                  tooltipId: 'cl-tooltip-lifetime',
                  tooltipContent:
                    'Your lifetime yield in this vault, expressed in USD and underlying token.',
                  badge: 'Beta',
                  rows: [
                    ['in USD', '$0'],
                    ['Underlying', '0', VAULT.debtSymbol],
                  ],
                })}
                {managePanel({
                  title: 'Total Balance',
                  tooltipId: 'cl-tooltip-balance',
                  tooltipContent: 'Your share of the vault, in USD and as fTokens.',
                  rows: [
                    ['in USD', '$0.00'],
                    ['fToken', '0', `fcl-loop-${VAULT.collateralSymbol}`],
                  ],
                })}
                {managePanel({
                  title: 'Yield Estimates',
                  tooltipId: 'cl-tooltip-estimates',
                  tooltipContent: 'Daily and monthly yield projections, based on current APY.',
                  rows: [
                    ['Daily', '$0'],
                    ['Monthly', '$0.00'],
                  ],
                })}
              </ManagePanelsRow>

              <MainSection $height="100%">
                {/* Performance chart — placed first per design (USD/Underlying balance).
                    Active Range and Position Composition cards live on the Details tab
                    (this column is intentionally lighter on Manage so the right-rail
                    Supply/Revert form takes focus). */}
                {balanceChart}
              </MainSection>

              <RestContent>
                <HalfContent
                  $backcolor={bgColorBox}
                  $bordercolor={borderColorBox}
                  $borderradius="12px"
                  style={{ padding: 20 }}
                >
                  <NewLabel
                    $size="16px"
                    $height="24px"
                    $weight="600"
                    $fontcolor={fontColor1}
                    style={{
                      background: bgColorChart,
                      border: `1.3px solid ${borderColorBox}`,
                      borderRadius: 8,
                      padding: 4,
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <SwitchTabTag
                      onClick={() => setActiveDepoTab(0)}
                      $fontcolor={activeDepoTab === 0 ? fontColor4 : fontColor3}
                      $backcolor={activeDepoTab === 0 ? activeColorNew : ''}
                      $boxshadow={
                        activeDepoTab === 0
                          ? '0 1px 3px rgba(16, 24, 40, 0.18), 0 1px 2px rgba(16, 24, 40, 0.10)'
                          : 'none'
                      }
                      style={{
                        fontWeight: activeDepoTab === 0 ? 700 : 500,
                        opacity: activeDepoTab === 0 ? 1 : 0.7,
                      }}
                    >
                      <p>↓ Supply</p>
                    </SwitchTabTag>
                    <SwitchTabTag
                      onClick={() => setActiveDepoTab(1)}
                      $fontcolor={activeDepoTab === 1 ? fontColor4 : fontColor3}
                      $backcolor={activeDepoTab === 1 ? activeColorNew : ''}
                      $boxshadow={
                        activeDepoTab === 1
                          ? '0 1px 3px rgba(16, 24, 40, 0.18), 0 1px 2px rgba(16, 24, 40, 0.10)'
                          : 'none'
                      }
                      style={{
                        fontWeight: activeDepoTab === 1 ? 700 : 500,
                        opacity: activeDepoTab === 1 ? 1 : 0.7,
                      }}
                    >
                      <p>↑ Revert</p>
                    </SwitchTabTag>
                  </NewLabel>

                  {activeDepoTab === 0 ? (
                    <>
                      <NewLabel
                        $size="13px"
                        $weight="500"
                        $height="20px"
                        $fontcolor={fontColor3}
                        $marginbottom="14px"
                      >
                        {depMode === 'quick'
                          ? `Single-asset entry. ${entrySymbol} is zapped into collateral and folded by the vault to the target leverage.`
                          : 'Two-sided deposit (advanced). Fill both tokens at the optimal ratio for a no-swap deposit, or fill one for the single-asset path. Smart routing picks the optimal contract entry point.'}
                      </NewLabel>

                      {depMode === 'quick' ? (
                        <>
                          <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                            <span>Amount {entrySymbol}</span>
                            <span
                              className="bal"
                              onClick={() => setQuickAmount(VAULT.walletBalances.token1)}
                              title="Click to use full balance"
                            >
                              Balance: {VAULT.walletBalances.token1}
                            </span>
                          </FieldLabel>
                          <FieldBox $bg={bgColorChart} $border={borderColorBox}>
                            <Input
                              $fc={fontColor1}
                              $muted={fontColor8}
                              placeholder="0.0"
                              inputMode="decimal"
                              value={quickAmount}
                              onChange={e => setQuickAmount(e.target.value)}
                            />
                            <InFieldUsd usd={usdValueOf(entrySymbol, quickAmount)} />
                            <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
                              {tokenIcon(entrySymbol, bgColorBox)}
                              {entrySymbol}
                            </TokenPill>
                          </FieldBox>
                        </>
                      ) : (
                        <>
                          <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                            <span>Amount {VAULT.pair.token0}</span>
                            <span
                              className="bal"
                              onClick={() => setDep0(VAULT.walletBalances.token0)}
                              title="Click to use full balance"
                            >
                              Balance: {VAULT.walletBalances.token0}
                            </span>
                          </FieldLabel>
                          <FieldBox $bg={bgColorChart} $border={borderColorBox}>
                            <Input
                              $fc={fontColor1}
                              $muted={fontColor8}
                              placeholder="0.0"
                              inputMode="decimal"
                              value={dep0}
                              onChange={e => setDep0(e.target.value)}
                            />
                            <InFieldUsd usd={usdValueOf(VAULT.pair.token0, dep0)} />
                            <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
                              {tokenIcon(VAULT.pair.token0, bgColorBox)}
                              {VAULT.pair.token0}
                            </TokenPill>
                          </FieldBox>

                          <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                            <span>Amount {VAULT.pair.token1}</span>
                            <span
                              className="bal"
                              onClick={() => setDep1(VAULT.walletBalances.token1)}
                              title="Click to use full balance"
                            >
                              Balance: {VAULT.walletBalances.token1}
                            </span>
                          </FieldLabel>
                          <FieldBox $bg={bgColorChart} $border={borderColorBox}>
                            <Input
                              $fc={fontColor1}
                              $muted={fontColor8}
                              placeholder="0.0"
                              inputMode="decimal"
                              value={dep1}
                              onChange={e => setDep1(e.target.value)}
                            />
                            <InFieldUsd usd={usdValueOf(VAULT.pair.token1, dep1)} />
                            <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
                              {tokenIcon(VAULT.pair.token1, bgColorBox)}
                              {VAULT.pair.token1}
                            </TokenPill>
                          </FieldBox>

                          <Hint
                            $muted={fontColor3}
                            $border={borderColorBox}
                            $fc={fontColor1}
                            $hover={hoverColorNew}
                          >
                            <span>
                              Optimal ratio at current price:{' '}
                              {Math.round(VAULT.optimalRatio.token0 * 100)}/
                              {Math.round(VAULT.optimalRatio.token1 * 100)}
                            </span>
                            <button type="button" onClick={balance}>
                              Balance
                            </button>
                          </Hint>

                          {depRoute && (
                            <>
                              <RouteNote $muted={fontColor3}>{depRoute.label}</RouteNote>
                              <Preview
                                $bg={bgColorChart}
                                $border={borderColorBox}
                                $fc={fontColor1}
                                $muted={fontColor3}
                              >
                                <div>
                                  <span className="muted">Expected shares</span>
                                  <span className="val">
                                    ~ 0.0000 fcl-loop-{VAULT.collateralSymbol}
                                  </span>
                                </div>
                                <div>
                                  <span className="muted">
                                    Value (in{' '}
                                    {depRoute.kind === 't1' ? VAULT.pair.token1 : VAULT.pair.token0}
                                    )
                                  </span>
                                  <span className="val">~ 0.0000</span>
                                </div>
                                {depRoute.kind === 'both' ? (
                                  <div>
                                    <span className="muted">Leftover refund</span>
                                    <span className="val">
                                      ~ 0.000 of {VAULT.pair.token0} (non-optimal ratio)
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="muted">Internal swap cost</span>
                                    <span className="val">~ 22 bps</span>
                                  </div>
                                )}
                              </Preview>
                            </>
                          )}
                        </>
                      )}

                      {/* OUTPUT — what the entry returns */}
                      <RouteNote $muted={fontColor3}>Output</RouteNote>
                      <FlexDiv
                        $justifycontent="space-between"
                        style={{ marginBottom: 8, alignItems: 'flex-start' }}
                      >
                        <NewLabel
                          $size="13px"
                          $weight="500"
                          $height="20px"
                          $fontcolor={fontColor3}
                          $display="flex"
                          $items="center"
                        >
                          Est. Received
                          <Question
                            id="cl-tooltip-received"
                            dark={darkMode}
                            content="Approximate fcl-loop shares minted at the current share price, net of entry cost."
                          />
                        </NewLabel>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 1,
                          }}
                        >
                          <NewLabel
                            $size="13px"
                            $weight="600"
                            $height="20px"
                            $fontcolor={fontColor1}
                          >
                            {grossWeth > 0 ? `~ ${sharesReceived.toFixed(4)}` : 'n/a'}
                          </NewLabel>
                          {grossWeth > 0 && (
                            <>
                              <NewLabel
                                $size="12px"
                                $weight="600"
                                $height="16px"
                                $fontcolor={fontColor3}
                              >
                                {fmtUsd(usdValueOf(VAULT.debtSymbol, netWethEquiv))}
                              </NewLabel>
                              <NewLabel
                                $size="10px"
                                $weight="500"
                                $height="13px"
                                $fontcolor={fontColor3}
                              >
                                fcl-loop-{VAULT.collateralSymbol}
                              </NewLabel>
                            </>
                          )}
                        </div>
                      </FlexDiv>
                      <FlexDiv
                        $justifycontent="space-between"
                        style={{ marginBottom: 14, alignItems: 'flex-start' }}
                      >
                        <NewLabel
                          $size="13px"
                          $weight="500"
                          $height="20px"
                          $fontcolor={fontColor3}
                          $display="flex"
                          $items="center"
                        >
                          Est. Yearly Yield
                          <Question
                            id="cl-tooltip-yearly"
                            dark={darkMode}
                            content={`Net ${VAULT.debtSymbol}-equivalent value times the live APY (${VAULT.apy}).`}
                          />
                        </NewLabel>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 1,
                          }}
                        >
                          <NewLabel
                            $size="13px"
                            $weight="600"
                            $height="20px"
                            $fontcolor={fontColor1}
                          >
                            {grossWeth > 0
                              ? `~ ${yearlyYieldWeth.toFixed(4)} ${VAULT.debtSymbol}`
                              : 'n/a'}
                          </NewLabel>
                          {grossWeth > 0 && (
                            <NewLabel
                              $size="12px"
                              $weight="600"
                              $height="16px"
                              $fontcolor={fontColor3}
                            >
                              {fmtUsd(usdValueOf(VAULT.debtSymbol, yearlyYieldWeth))}
                            </NewLabel>
                          )}
                        </div>
                      </FlexDiv>

                      {/* COST AND DETAILS */}
                      <RouteNote $muted={fontColor3}>Details</RouteNote>
                      {grossWeth > 0 && (
                        <Preview
                          $bg={bgColorChart}
                          $border={borderColorBox}
                          $fc={fontColor1}
                          $muted={fontColor3}
                        >
                          <div>
                            <span className="muted">
                              {VAULT.debtSymbol}-equivalent value (after entry cost)
                            </span>
                            <span className="val">
                              ~ {netWethEquiv.toFixed(4)} {VAULT.debtSymbol}
                            </span>
                          </div>
                          <div>
                            <span className="muted">Entry cost (median 30d)</span>
                            <span className="val">{VAULT.costs.typicalEntryBps}</span>
                          </div>
                          <div>
                            <span className="muted">Vault LTV after your entry</span>
                            <span className="val">
                              {projectedLtvAfterDeposit(
                                usdValueOf(entrySymbol, quickAmount),
                              ).toFixed(2)}
                              % (was {ltvCur.toFixed(2)}%)
                            </span>
                          </div>
                        </Preview>
                      )}
                      <Slippage
                        $muted={fontColor3}
                        $border={borderColorBox}
                        $bg={bgColorChart}
                        $fc={fontColor1}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          Max slippage
                          <Question
                            id="cl-tooltip-slippage-supply"
                            dark={darkMode}
                            content="Maximum price movement tolerated between quote and execution. Passed to the contract as the _minOut floor — the transaction reverts if you'd receive less than that."
                          />
                        </span>
                        <div>
                          {[0.1, 0.5, 1.0].map(s => (
                            <button
                              key={s}
                              type="button"
                              className={slip === s ? 'active' : ''}
                              onClick={() => setSlip(s)}
                            >
                              {s}%
                            </button>
                          ))}
                        </div>
                      </Slippage>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '12px 14px',
                          background: bgColorChart,
                          border: `1px solid ${borderColorBox}`,
                          borderRadius: 10,
                          fontSize: 12,
                          lineHeight: 1.45,
                          color: fontColor3,
                          marginBottom: 14,
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={e => setAgreed(e.target.checked)}
                          style={{ marginTop: 3, accentColor: '#5dcf46' }}
                        />
                        <span>
                          I confirm that I have read and understand the product, have read the{' '}
                          <a
                            href="https://docs.harvest.finance/legal/risk-disclosures"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#1da64a', fontWeight: 700 }}
                          >
                            Risk Disclosures
                          </a>
                          , and agree to the{' '}
                          <a
                            href="https://docs.harvest.finance/legal/terms-and-conditions"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#1da64a', fontWeight: 700 }}
                          >
                            Terms and Conditions
                          </a>
                          .
                        </span>
                      </label>

                      <Cta type="button" disabled={supplyDisabled}>
                        {!(depMode === 'quick' ? quickRoute : depRoute)
                          ? 'Enter an amount'
                          : !agreed
                            ? 'Agree to terms above'
                            : 'Connect Wallet to Get Started'}
                      </Cta>

                      {/* Opt-in to two-sided deposit. Quick (single asset) is the default
                              entry flow; two-sided is the spec-exact path, kept as an advanced
                              option for users who already hold both assets. Currently hidden
                              via SHOW_TWO_SIDED_TOGGLE — flip the flag at the top of the
                              component to bring this link back. */}
                      {SHOW_TWO_SIDED_TOGGLE && (
                        <NewLabel
                          $size="12px"
                          $weight="500"
                          $height="18px"
                          $fontcolor={fontColor3}
                          $padding="10px 0 0"
                          style={{ textAlign: 'center' }}
                        >
                          {depMode === 'quick' ? (
                            <>
                              Already hold both assets?{' '}
                              <a
                                href="#"
                                onClick={e => {
                                  e.preventDefault()
                                  setDepMode('pro')
                                }}
                                style={{ color: '#1da64a', fontWeight: 700 }}
                              >
                                Switch to two-sided deposit
                              </a>
                            </>
                          ) : (
                            <a
                              href="#"
                              onClick={e => {
                                e.preventDefault()
                                setDepMode('quick')
                              }}
                              style={{ color: '#1da64a', fontWeight: 700 }}
                            >
                              ← Back to single-asset entry
                            </a>
                          )}
                        </NewLabel>
                      )}
                    </>
                  ) : (
                    <>
                      <NewLabel
                        $size="13px"
                        $weight="500"
                        $height="20px"
                        $fontcolor={fontColor3}
                        $marginbottom="14px"
                      >
                        Single-asset withdrawal. The vault unwinds the loop and returns{' '}
                        {VAULT.debtSymbol}.
                      </NewLabel>

                      <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                        <span>Shares to withdraw</span>
                        <span
                          className="bal"
                          onClick={() => setShares(VAULT.userSlice.shares)}
                          title="Click to use full balance"
                        >
                          Balance: {VAULT.userSlice.shares}
                        </span>
                      </FieldLabel>
                      <FieldBox $bg={bgColorChart} $border={borderColorBox}>
                        <Input
                          $fc={fontColor1}
                          $muted={fontColor8}
                          placeholder="0.0"
                          inputMode="decimal"
                          value={shares}
                          onChange={e => setShares(e.target.value)}
                        />
                        <InFieldUsd usd={parseFloat(shares) * sharePriceUsd} />
                        <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <TokenCircle
                              bg="#1652f0"
                              fc="#fff"
                              border={bgColorBox}
                              size={20}
                              overlap
                            >
                              cb
                            </TokenCircle>
                            <TokenCircle bg="#627eea" fc="#fff" border={bgColorBox} size={20}>
                              Ξ
                            </TokenCircle>
                          </span>
                          fcl-loop-{VAULT.collateralSymbol}
                        </TokenPill>
                      </FieldBox>

                      <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                        <span>Receive</span>
                      </FieldLabel>
                      <FieldBox $bg={bgColorChart} $border={borderColorBox}>
                        <NewLabel
                          $size="13px"
                          $weight="600"
                          $height="20px"
                          $fontcolor={fontColor1}
                          style={{ flex: 1 }}
                        >
                          {sharesIn > 0 ? `~ ${receiveWeth.toFixed(4)}` : '0.0'}
                        </NewLabel>
                        <InFieldUsd usd={usdValueOf(entrySymbol, receiveWeth)} />
                        <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
                          {tokenIcon(entrySymbol, bgColorBox)}
                          {entrySymbol}
                        </TokenPill>
                      </FieldBox>

                      <RouteNote $muted={fontColor3}>Details</RouteNote>
                      <Preview
                        $bg={bgColorChart}
                        $border={borderColorBox}
                        $fc={fontColor1}
                        $muted={fontColor3}
                      >
                        <div>
                          <span className="muted">Exit cost (median 30d)</span>
                          <span className="val">
                            {VAULT.costs.typicalExitBps} (~ {exitCostWeth.toFixed(4)} {entrySymbol})
                          </span>
                        </div>
                      </Preview>

                      {largeWithdraw && (
                        <div
                          style={{
                            display: 'flex',
                            gap: 10,
                            padding: '10px 12px',
                            marginBottom: 12,
                            borderRadius: 8,
                            background: 'rgba(214, 52, 47, 0.08)',
                            border: '1px solid rgba(214, 52, 47, 0.35)',
                            color: '#a8201f',
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ fontWeight: 700, flexShrink: 0 }}>!</span>
                          <span>
                            <strong>Large withdrawal warning.</strong> This withdrawal is ~
                            {((withdrawalUsd / VAULT.vaultUsd) * 100).toFixed(1)}% of vault TVL. The
                            vault will need to deleverage to fulfil it, which may trigger
                            above-typical slippage and push the post-withdrawal LTV close to the
                            rebalance trigger. Consider splitting the withdrawal across multiple
                            transactions.
                          </span>
                        </div>
                      )}

                      <Slippage
                        $muted={fontColor3}
                        $border={borderColorBox}
                        $bg={bgColorChart}
                        $fc={fontColor1}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          Max slippage
                          <Question
                            id="cl-tooltip-slippage-withdraw"
                            dark={darkMode}
                            content="Maximum price movement tolerated between quote and execution. Passed to the contract as the _minOut floor — the withdrawal reverts if less than that comes out."
                          />
                        </span>
                        <div>
                          {[0.1, 0.5, 1.0].map(s => (
                            <button
                              key={s}
                              type="button"
                              className={slip === s ? 'active' : ''}
                              onClick={() => setSlip(s)}
                            >
                              {s}%
                            </button>
                          ))}
                        </div>
                      </Slippage>

                      <Cta type="button" disabled={withdrawDisabled}>
                        {withdrawDisabled ? 'Enter share amount' : 'Connect Wallet to Withdraw'}
                      </Cta>
                    </>
                  )}
                </HalfContent>
              </RestContent>
            </InternalSection>
          )}

          {/* DETAILS TAB */}
          {activeMainTag === 1 && (
            <InternalSection>
              {/* 4 top boxes — full row, sibling of MainSection */}
              <BoxCover $bordercolor={borderColorBox} style={{ width: '100%' }}>
                {[
                  { title: 'Live APY', value: VAULT.apy, className: 'balance-box' },
                  {
                    title: 'Live Leverage',
                    value: `${VAULT.position.leverage.toFixed(1)}×`,
                    className: 'daily-apy-box',
                  },
                  { title: 'TVL', value: VAULT.tvl },
                  {
                    title: 'Last Rebalance',
                    value: VAULT.lastRebalance,
                    className: 'daily-yield-box',
                  },
                ].map((box, i) => (
                  <ValueBox
                    key={i}
                    $width="24%"
                    className={box.className}
                    $backcolor={bgColorBox}
                    $bordercolor={borderColorBox}
                  >
                    <BoxTitle $fontcolor3={fontColor3}>{box.title}</BoxTitle>
                    <BoxValue $fontcolor1={fontColor1}>{box.value}</BoxValue>
                  </ValueBox>
                ))}
              </BoxCover>

              <MainSection $height="fit-content">
                {/* Share Price chart placeholder */}
                <HalfInfo
                  $padding={isMobile ? '12px' : '20px'}
                  $marginbottom="25px"
                  $backcolor={bgColorBox}
                  $bordercolor={borderColorBox}
                >
                  <FlexDiv $justifycontent="space-between" style={{ marginBottom: 12 }}>
                    <FlexDiv style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                      <NewLabel $size="14px" $weight="700" $height="20px" $fontcolor={fontColor1}>
                        Share Price
                      </NewLabel>
                      <NewLabel $size="12px" $weight="500" $height="18px" $fontcolor={fontColor3}>
                        {today} |{' '}
                        <span style={{ color: fontColor1, fontWeight: 700 }}>
                          {VAULT.details.sharePrice}
                        </span>
                      </NewLabel>
                    </FlexDiv>
                  </FlexDiv>
                  <ChartFrame $bg={bgColorBox}>
                    <AxisYLeft $muted={fontColor3}>
                      <span>1.012</span>
                      <span>1.008</span>
                      <span>1.004</span>
                      <span>1.000</span>
                    </AxisYLeft>
                    <AxisX $muted={fontColor3}>
                      <span>3/14</span>
                      <span>4/4</span>
                      <span>4/24</span>
                      <span>5/10</span>
                    </AxisX>
                    <svg
                      viewBox="0 0 200 100"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        left: 38,
                        right: 8,
                        top: 12,
                        bottom: 28,
                        width: 'calc(100% - 46px)',
                        height: 'calc(100% - 40px)',
                        pointerEvents: 'none',
                      }}
                    >
                      <polyline
                        points="0,88 4,84 8,86 12,82 16,84 20,80 24,82 28,78 32,80 36,76 40,78 44,73 48,75 52,70 56,72 60,67 64,69 68,64 72,66 76,61 80,63 84,58 88,60 92,55 96,57 100,52 104,54 108,49 112,51 116,46 120,48 124,43 128,45 132,40 136,42 140,37 144,39 148,34 152,36 156,31 160,33 164,28 168,30 172,25 176,27 180,22 184,24 188,19 192,21 196,16 200,18"
                        fill="none"
                        stroke="#5dcf46"
                        strokeWidth="1"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>
                  </ChartFrame>
                  <RangeBtnRow>
                    {['Custom', '1W', '1M', '1Y', 'ALL'].map(r => (
                      <RangeBtn
                        key={r}
                        type="button"
                        $active={detailRange === r}
                        $muted={fontColor3}
                        $fc={fontColor1}
                        onClick={() => setDetailRange(r)}
                      >
                        {r}
                      </RangeBtn>
                    ))}
                  </RangeBtnRow>
                </HalfInfo>

                {positionPanel}
                {healthFactorPanel}
                {mechanicsPanel}

                {/* Source of Yield — clone using the same wrapper as classic */}
                <HalfInfo $marginbottom="0" $backcolor={bgColorBox} $bordercolor={borderColorBox}>
                  {sectionTitle('Source of Yield')}
                  <DescInfo $fontcolor6={fontColor6} $fontcolor3={fontColor3}>
                    <p>
                      The vault supplies <strong>{VAULT.collateralSymbol}</strong> as collateral on{' '}
                      <strong>{VAULT.protocol}</strong> in <strong>E-mode</strong>, then borrows{' '}
                      <strong>{VAULT.debtSymbol}</strong> and folds the loop. The carry between{' '}
                      <strong>{VAULT.collateralSymbol} staking yield</strong> and the{' '}
                      <strong>{VAULT.debtSymbol} borrow APR</strong> compounds into share price each
                      block. The fold magnifies the spread by the leverage multiple; the same
                      multiple is applied to liquidation risk, which is bounded by the rebalance
                      trigger and the slippage cap.
                    </p>
                  </DescInfo>
                  <FlexDiv
                    className="address"
                    $padding="0 15px 20px"
                    style={{ flexWrap: 'wrap', gap: 8 }}
                  >
                    {['Vault Address', 'Strategy Address', 'Aave Market'].map(label => (
                      <InfoLabel
                        key={label}
                        $display="flex"
                        href="#"
                        onClick={e => e.preventDefault()}
                        $bgcolor={bgColorBox}
                        $hovercolor={hoverColor || hoverColorNew}
                        $bordercolor={borderColorBox}
                        $padding="9px 17px"
                        style={{ flex: '1 1 140px', minWidth: 0, justifyContent: 'center' }}
                      >
                        <NewLabel
                          $size="12px"
                          $weight="600"
                          $height="16px"
                          $self="center"
                          $fontcolor={fontColor1}
                        >
                          {label}
                        </NewLabel>
                      </InfoLabel>
                    ))}
                  </FlexDiv>
                </HalfInfo>
              </MainSection>

              <RestContent>
                <RestInternal>
                  {/* Info card */}
                  <LastHarvestInfo $backcolor={bgColorBox} $bordercolor={borderColorBox}>
                    {sectionTitle('Info')}
                    {kvRow(
                      'Operating since',
                      `${VAULT.details.operatingSince} (${VAULT.details.operatingDays} days)`,
                      'op',
                    )}
                    {kvRow('SharePrice', VAULT.details.sharePrice, 'sp')}
                    {sectionTitle('APY: Live & Historical Average')}
                    {kvRow('Live', VAULT.details.apy.live, 'apy-l')}
                    {kvRow('7d', VAULT.details.apy.d7, 'apy-7')}
                    {kvRow('30d', VAULT.details.apy.d30, 'apy-30')}
                    {kvRow('180d', VAULT.details.apy.d180, 'apy-180')}
                    {kvRow('365d', VAULT.details.apy.d365, 'apy-365')}
                    {kvRow('Lifetime', VAULT.details.apy.lifetime, 'apy-lt')}
                  </LastHarvestInfo>

                  {/* APY Breakdown — same MyBalance + Tip structure as classic */}
                  <MyBalance
                    $marginbottom="25px"
                    $backcolor={bgColorBox}
                    $bordercolor={borderColorBox}
                  >
                    {sectionTitle('APY Breakdown')}
                    {kvRow(`${VAULT.collateralSymbol} staking yield`, '~ 3.05%', 'apy-st')}
                    {kvRow(`${VAULT.debtSymbol} borrow APR`, '~ -2.38%', 'apy-bo')}
                    {kvRow(
                      `Net spread × ${VAULT.position.leverage.toFixed(1)}× leverage`,
                      '~ 8.74%',
                      'apy-net',
                    )}
                    <Tip $display={showTip ? 'block' : 'none'}>
                      <TipTop>
                        <IconPart>
                          <img src={TickIcon} alt="tip" style={{ marginRight: 5 }} />
                          <NewLabel $size="14px" $weight="600" $height="20px" $fontcolor="#027A48">
                            Tip
                          </NewLabel>
                        </IconPart>
                        <CrossDiv onClick={() => setShowTip(false)}>
                          <img src={TickCross} alt="close" />
                        </CrossDiv>
                      </TipTop>
                      <NewLabel $size="14px" $height="20px" $weight="400" $fontcolor="#027A48">
                        For a quick guide on tracking yield sources in your Portfolio, check our
                        5-minute article{' '}
                        <a
                          href="https://docs.harvest.finance/general-info/yield-sources-on-harvest-how-to-get-and-track-them"
                          target="_blank"
                          rel="noreferrer noopener"
                          style={{ fontWeight: 600, color: '#027A48' }}
                        >
                          Yield Sources on Harvest – How to Track Them.
                        </a>
                      </NewLabel>
                    </Tip>
                  </MyBalance>

                  {/* Fees card — same shape as CL Vault, plus a "Typical interaction
                        cost" row sourced from rolling 30d on-chain medians. */}
                  <LastHarvestInfo $backcolor={bgColorBox} $bordercolor={borderColorBox}>
                    {sectionTitle('Fees')}
                    {kvRow(
                      'Entry / Exit fee',
                      `${VAULT.costs.entryFee} / ${VAULT.costs.exitFee}`,
                      'fe',
                    )}
                    {kvRow('Profit share', VAULT.costs.profitShare, 'ps')}
                    {kvRow(
                      <FlexDiv style={{ alignItems: 'center', gap: 6 }}>
                        <span>Typical interaction cost</span>
                        <Question
                          id="loop-tooltip-interaction-cost"
                          dark={darkMode}
                          content="Rolling 30-day median of real on-chain entry / exit costs in basis points (Aave fees + internal swap slippage + gas). Updates as new interactions come in."
                        />
                      </FlexDiv>,
                      `${VAULT.costs.typicalEntryBps} entry / ${VAULT.costs.typicalExitBps} exit`,
                      'tic',
                    )}
                    <FlexDiv $justifycontent="space-between" $padding="10px 15px">
                      <NewLabel $size="13px" $weight="300" $height="normal" $fontcolor={fontColor3}>
                        Per-rebalance swap slippage is borne by the vault and shows up as small
                        share-price jitter, not as a per-user fee.
                      </NewLabel>
                    </FlexDiv>
                  </LastHarvestInfo>
                </RestInternal>
              </RestContent>
            </InternalSection>
          )}

          {/* HISTORY TAB */}
          {activeMainTag === 2 && (
            <FirstPartSection>
              <HalfInfo
                $backcolor={bgColorBox}
                $bordercolor={borderColorBox}
                $marginbottom="25px"
                $padding="40px"
              >
                <NewLabel $size="16px" $height="24px" $weight="600" $fontcolor={fontColor1}>
                  History
                </NewLabel>
                <NewLabel
                  $size="13px"
                  $weight="500"
                  $height="20px"
                  $fontcolor={fontColor3}
                  $margintop="8px"
                >
                  Per-rebalance log, harvested rewards, and historical share-price jitter will
                  appear here once a wallet is connected.
                </NewLabel>
              </HalfInfo>
            </FirstPartSection>
          )}
        </BigDiv>
      </Inner>
    </DetailView>
  )
}

export default LoopingVault
