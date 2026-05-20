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
 *                                  MainSection (USD/Underlying chart first,
 *                                  then Active Range + Composition) +
 *                                  RestContent (Supply/Revert form).
 *   activeMainTag === 1 (Details): InternalSection > full-width BoxCover
 *                                  (4 ValueBox) + MainSection (chart +
 *                                  mechanics + Source of Yield) + RestContent
 *                                  (RestInternal > LastHarvestInfo Info +
 *                                  MyBalance APY Breakdown + LastHarvestInfo
 *                                  Fees + LastHarvestInfo Range parameters
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
import {
  DescInfo,
  InfoLabel,
} from '../../components/AdvancedFarmComponents/SourceOfYield/style'
import {
  Badge,
  RangeBarOuter,
  RangeBarInner,
  RangeMarker,
  RangeLabels,
  RangeNumbers,
  Footnote,
  CompositionRow,
  CompositionBar,
  CompositionFill,
  Caret,
  FieldLabel,
  FieldBox,
  Input,
  TokenPill,
  Hint,
  Preview,
  RouteNote,
  OutputGroup,
  OutputOpt,
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
  protocol: 'Aerodrome',
  pair: { token0: 'cbETH', token1: 'WETH' },
  feeTier: '1-tick',
  apy: '26.46%',
  tvl: '$24.99K',
  range: { lower: 0.94, upper: 1.078, current: 1.012 },
  rangeUnit: 'cbETH/ETH',
  inRange: true,
  lastRebalance: '2 days ago',
  composition: {
    token0Pct: 62,
    token1Pct: 38,
    token0Amount: '12.40',
    token1Amount: '8.91',
  },
  userSlice: { shares: '0.00', token0: '0.00', token1: '0.00' },
  // Mock wallet balances for the deposit form (click "Balance: X" to MAX into the input).
  walletBalances: { token0: '1.4382', token1: '12.7615' },
  params: {
    targetWidth: '14.0%',
    currentWidth: '13.5%',
    rebalanceCooldown: '1 hour',
    deviationTrigger: '5.0%',
    twapWindow: '30 minutes',
    maxSwap: '15% of TVL',
    slippageBps: '50 bps',
  },
  costs: {
    entryFee: '0%',
    exitFee: '0%',
    profitShare: '10%',
    balanced: '~12 bps',
    singleAsset: '~28 bps',
  },
  optimalRatio: { token0: 0.62, token1: 0.38 },
  details: {
    operatingSince: 'Mar 14 2025',
    operatingDays: 57,
    sharePrice: '1.00428',
    apy: { live: '26.46%', d7: '24.91%', d30: '22.40%', d180: 'n/a', d365: 'n/a', lifetime: '23.85%' },
  },
}

const TokenCircle = ({ children, bg, fc, border, overlap }) => (
  <div
    style={{
      width: 69,
      height: 69,
      borderRadius: '50%',
      background: bg,
      border: `3px solid ${border}`,
      color: fc,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 18,
      marginRight: overlap ? -20 : 0,
      zIndex: overlap ? 1 : 2,
      flexShrink: 0,
      boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
    }}
  >
    {children}
  </div>
)

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

const CLVault = () => {
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
  const [quickToken, setQuickToken] = useState('t0')
  const [quickAmount, setQuickAmount] = useState('')
  const [paramsOpen, setParamsOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [chartRange, setChartRange] = useState('LAST')
  const [detailRange, setDetailRange] = useState('1Y')
  const [showTip, setShowTip] = useState(true)

  const [dep0, setDep0] = useState('')
  const [dep1, setDep1] = useState('')

  const [shares, setShares] = useState('')
  const [output, setOutput] = useState('both')

  const [slip, setSlip] = useState(0.5)

  const rangeMarkerPct = useMemo(() => {
    const { lower, upper, current } = VAULT.range
    const pct = ((current - lower) / (upper - lower)) * 100
    return Math.max(0, Math.min(100, pct))
  }, [])

  const depRoute = useMemo(() => {
    const a0 = parseFloat(dep0) > 0
    const a1 = parseFloat(dep1) > 0
    if (a0 && a1) return { label: 'Routed via CLVault.deposit (both assets)', kind: 'both' }
    if (a0) return { label: `Routed via CLWrapper(${VAULT.pair.token0}): single asset`, kind: 't0' }
    if (a1) return { label: `Routed via CLWrapper(${VAULT.pair.token1}): single asset`, kind: 't1' }
    return null
  }, [dep0, dep1])

  const quickRoute = useMemo(() => {
    if (!parseFloat(quickAmount)) return null
    const sym = quickToken === 't0' ? VAULT.pair.token0 : VAULT.pair.token1
    return { label: `Routed via CLWrapper(${sym}): single asset`, kind: quickToken, sym }
  }, [quickAmount, quickToken])

  const wRoute = useMemo(() => {
    if (output === 'both')
      return `Routed via CLVault.withdraw: receive ${VAULT.pair.token0} + ${VAULT.pair.token1}`
    if (output === 't0') return `Routed via CLWrapper(${VAULT.pair.token0}): receive ${VAULT.pair.token0} only`
    return `Routed via CLWrapper(${VAULT.pair.token1}): receive ${VAULT.pair.token1} only`
  }, [output])

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

  const supplyDisabled =
    (depMode === 'quick' ? !quickRoute : !depRoute) || !agreed
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
        <FlexDiv key={i} $justifycontent="space-between" $padding="5px 15px" style={{ alignItems: 'flex-start' }}>
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
      <FlexDiv $justifycontent="space-between" style={{ alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
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
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: bgColorBox,
                      border: `1px solid ${borderColorBox}`,
                      color: fontColor3,
                      marginLeft: 10,
                      verticalAlign: 'middle',
                    }}
                  >
                    CL
                  </span>
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
                    Concentrated Liquidity - {VAULT.protocol} | T-1
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
                    ['Underlying', '0', 'SHARES'],
                  ],
                })}
                {managePanel({
                  title: 'Total Balance',
                  tooltipId: 'cl-tooltip-balance',
                  tooltipContent: 'Your share of the vault, in USD and as fTokens.',
                  rows: [
                    ['in USD', '$0.00'],
                    ['fToken', '0', `fcl_${VAULT.pair.token0}_${VAULT.pair.token1}`],
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
                {/* Performance chart — placed first per design (USD/Underlying balance) */}
                    {balanceChart}

                    {/* Active Range — CL-specific card, classic chrome */}
                    <HalfInfo
                      $backcolor={bgColorBox}
                      $bordercolor={borderColorBox}
                      $marginbottom="20px"
                    >
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
                            Active Range
                          </NewLabel>
                          <Badge $ok={VAULT.inRange}>
                            {VAULT.inRange ? 'in range' : 'out of range'}
                          </Badge>
                        </FlexDiv>
                        <NewLabel $size="12px" $weight="500" $height="18px" $fontcolor={fontColor3}>
                          Position is concentrated within these price bounds.
                        </NewLabel>
                      </FlexDiv>
                      <div style={{ paddingTop: 18 }} />
                      <RangeBarOuter $bg={bgColorChart}>
                        <RangeBarInner $leftPct={0} $rightPct={100} />
                        <RangeMarker $pct={rangeMarkerPct} $color={fontColor1} $bg={bgColorBox} />
                      </RangeBarOuter>
                      <RangeLabels $muted={fontColor3}>
                        <span>{VAULT.range.lower.toFixed(3)}</span>
                        <span>{VAULT.range.upper.toFixed(3)}</span>
                      </RangeLabels>
                      <RangeNumbers $fc={fontColor1} $muted={fontColor3}>
                        <strong>
                          {VAULT.range.lower.toFixed(3)} – {VAULT.range.upper.toFixed(3)}{' '}
                          {VAULT.rangeUnit}
                        </strong>
                        <span className="muted">currently</span>
                        <strong>{VAULT.range.current.toFixed(3)}</strong>
                      </RangeNumbers>
                      <Footnote $muted={fontColor3}>
                        Last rebalance: {VAULT.lastRebalance}.
                      </Footnote>
                    </HalfInfo>

                    {/* Position Composition — CL-specific card, classic chrome */}
                    <HalfInfo
                      $backcolor={bgColorBox}
                      $bordercolor={borderColorBox}
                      $marginbottom="25px"
                    >
                      {sectionTitle('Position Composition')}
                      <CompositionRow $fc={fontColor1}>
                        <span>{VAULT.composition.token0Pct}% {VAULT.pair.token0}</span>
                        <span>{VAULT.composition.token1Pct}% {VAULT.pair.token1}</span>
                      </CompositionRow>
                      <CompositionBar $border={borderColorBox}>
                        <CompositionFill $pct={VAULT.composition.token0Pct} $color="#7d68d3" />
                        <CompositionFill $pct={VAULT.composition.token1Pct} $color="#1e5fd3" />
                      </CompositionBar>
                      {kvRow(`Vault holdings (${VAULT.pair.token0})`, VAULT.composition.token0Amount, 'h0')}
                      {kvRow(`Vault holdings (${VAULT.pair.token1})`, VAULT.composition.token1Amount, 'h1')}
                      {kvRow('Your slice (shares)', VAULT.userSlice.shares, 'us')}
                      {kvRow(
                        `Your slice (${VAULT.pair.token0} / ${VAULT.pair.token1})`,
                        `${VAULT.userSlice.token0} / ${VAULT.userSlice.token1}`,
                        'ut',
                      )}
                      <div style={{ height: 8 }} />
                    </HalfInfo>
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
                          style={{ fontWeight: activeDepoTab === 0 ? 700 : 500, opacity: activeDepoTab === 0 ? 1 : 0.7 }}
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
                          style={{ fontWeight: activeDepoTab === 1 ? 700 : 500, opacity: activeDepoTab === 1 ? 1 : 0.7 }}
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
                              ? 'Single-asset deposit. The token is auto-swapped on-chain to match the position’s ratio.'
                              : 'Two-sided deposit (advanced). Fill both tokens at the optimal ratio for a no-swap deposit, or fill one for the single-asset path. Smart routing picks the optimal contract entry point.'}
                          </NewLabel>

                          {depMode === 'quick' ? (
                            <>
                              <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                                <span>Enter with</span>
                              </FieldLabel>
                              <OutputGroup>
                                <OutputOpt
                                  $active={quickToken === 't0'}
                                  $bg={bgColorChart}
                                  $border={borderColorBox}
                                  $fc={fontColor1}
                                  onClick={() => setQuickToken('t0')}
                                  type="button"
                                >
                                  {VAULT.pair.token0}
                                </OutputOpt>
                                <OutputOpt
                                  $active={quickToken === 't1'}
                                  $bg={bgColorChart}
                                  $border={borderColorBox}
                                  $fc={fontColor1}
                                  onClick={() => setQuickToken('t1')}
                                  type="button"
                                >
                                  {VAULT.pair.token1}
                                </OutputOpt>
                              </OutputGroup>

                              <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                                <span>
                                  Amount{' '}
                                  {quickToken === 't0' ? VAULT.pair.token0 : VAULT.pair.token1}
                                </span>
                                <span
                                  className="bal"
                                  onClick={() =>
                                    setQuickAmount(
                                      quickToken === 't0'
                                        ? VAULT.walletBalances.token0
                                        : VAULT.walletBalances.token1,
                                    )
                                  }
                                  title="Click to use full balance"
                                >
                                  Balance:{' '}
                                  {quickToken === 't0'
                                    ? VAULT.walletBalances.token0
                                    : VAULT.walletBalances.token1}
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
                                <TokenPill
                                  $bg={bgColorBox}
                                  $border={borderColorBox}
                                  $fc={fontColor1}
                                >
                                  {quickToken === 't0' ? VAULT.pair.token0 : VAULT.pair.token1}
                                </TokenPill>
                              </FieldBox>

                              {quickRoute && (
                                <>
                                  <RouteNote $muted={fontColor3}>{quickRoute.label}</RouteNote>
                                  <Preview
                                    $bg={bgColorChart}
                                    $border={borderColorBox}
                                    $fc={fontColor1}
                                    $muted={fontColor3}
                                  >
                                    <div>
                                      <span className="muted">Expected shares</span>
                                      <span className="val">
                                        ~ 0.0000 fcl-{VAULT.pair.token0}-{VAULT.pair.token1}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="muted">Value (in {quickRoute.sym})</span>
                                      <span className="val">~ 0.0000</span>
                                    </div>
                                    <div>
                                      <span className="muted">Internal swap cost</span>
                                      <span className="val">~ 22 bps</span>
                                    </div>
                                  </Preview>
                                </>
                              )}
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
                            <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
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
                            <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
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
                                    ~ 0.0000 fcl-{VAULT.pair.token0}-{VAULT.pair.token1}
                                  </span>
                                </div>
                                <div>
                                  <span className="muted">
                                    Value (in{' '}
                                    {depRoute.kind === 't1' ? VAULT.pair.token1 : VAULT.pair.token0})
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

                          <Slippage
                            $muted={fontColor3}
                            $border={borderColorBox}
                            $bg={bgColorChart}
                            $fc={fontColor1}
                          >
                            <span>Slippage tolerance (_minOut)</span>
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

                          <FlexDiv $justifycontent="space-between" style={{ marginBottom: 8 }}>
                            <NewLabel $size="13px" $weight="500" $height="20px" $fontcolor={fontColor3} $display="flex" $items="center">
                              Est. Yearly Yield
                              <Question
                                id="cl-tooltip-yearly"
                                dark={darkMode}
                                content="Estimated yield over a year, based on current APY."
                              />
                            </NewLabel>
                            <NewLabel $size="13px" $weight="600" $height="20px" $fontcolor={fontColor1}>
                              n/a
                            </NewLabel>
                          </FlexDiv>
                          <FlexDiv $justifycontent="space-between" style={{ marginBottom: 14 }}>
                            <NewLabel $size="13px" $weight="500" $height="20px" $fontcolor={fontColor3} $display="flex" $items="center">
                              Est. Received
                              <Question
                                id="cl-tooltip-received"
                                dark={darkMode}
                                content="Approximate fTokens you'd receive at the current share price."
                              />
                            </NewLabel>
                            <NewLabel $size="13px" $weight="600" $height="20px" $fontcolor={fontColor1}>
                              n/a
                            </NewLabel>
                          </FlexDiv>

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
                                  ← Back to single-asset deposit
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
                            Withdraw your shares back to {VAULT.pair.token0} or {VAULT.pair.token1}.
                          </NewLabel>

                          <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                            <span>Shares to withdraw</span>
                            <span className="bal">Balance: {VAULT.userSlice.shares}</span>
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
                            <TokenPill $bg={bgColorBox} $border={borderColorBox} $fc={fontColor1}>
                              fcl-{VAULT.pair.token0}-{VAULT.pair.token1}
                            </TokenPill>
                          </FieldBox>

                          <FieldLabel $fc={fontColor1} $muted={fontColor3}>
                            <span>Receive</span>
                          </FieldLabel>
                          <OutputGroup>
                            <OutputOpt
                              $active={output === 't0'}
                              $bg={bgColorChart}
                              $border={borderColorBox}
                              $fc={fontColor1}
                              onClick={() => setOutput('t0')}
                            >
                              {VAULT.pair.token0} only
                            </OutputOpt>
                            <OutputOpt
                              $active={output === 't1'}
                              $bg={bgColorChart}
                              $border={borderColorBox}
                              $fc={fontColor1}
                              onClick={() => setOutput('t1')}
                            >
                              {VAULT.pair.token1} only
                            </OutputOpt>
                            <OutputOpt
                              $active={output === 'both'}
                              $bg={bgColorChart}
                              $border={borderColorBox}
                              $fc={fontColor1}
                              onClick={() => setOutput('both')}
                            >
                              Both
                            </OutputOpt>
                          </OutputGroup>

                          <RouteNote $muted={fontColor3}>{wRoute}</RouteNote>
                          <Preview
                            $bg={bgColorChart}
                            $border={borderColorBox}
                            $fc={fontColor1}
                            $muted={fontColor3}
                          >
                            {output === 'both' ? (
                              <>
                                <div>
                                  <span className="muted">Predicted output ({VAULT.pair.token0})</span>
                                  <span className="val">~ 0.0000</span>
                                </div>
                                <div>
                                  <span className="muted">Predicted output ({VAULT.pair.token1})</span>
                                  <span className="val">~ 0.0000</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <span className="muted">
                                    Predicted output (
                                    {output === 't0' ? VAULT.pair.token0 : VAULT.pair.token1})
                                  </span>
                                  <span className="val">~ 0.0000</span>
                                </div>
                                <div>
                                  <span className="muted">Internal swap cost</span>
                                  <span className="val">~ 22 bps</span>
                                </div>
                              </>
                            )}
                          </Preview>

                          <Slippage
                            $muted={fontColor3}
                            $border={borderColorBox}
                            $bg={bgColorChart}
                            $fc={fontColor1}
                          >
                            <span>
                              Slippage tolerance (
                              {output === 'both' ? 'amount0OutMin / amount1OutMin' : '_minOut'})
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
                  { title: 'Daily APY', value: '0.072%', className: 'daily-apy-box' },
                  { title: 'TVL', value: VAULT.tvl },
                  { title: 'Last Rebalance', value: VAULT.lastRebalance, className: 'daily-yield-box' },
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
                          {today} | <span style={{ color: fontColor1, fontWeight: 700 }}>{VAULT.details.sharePrice}</span>
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
                          points="0,90 8,84 16,88 24,76 32,82 40,72 48,78 56,66 64,72 72,60 80,68 88,54 96,62 104,50 112,58 120,46 128,52 136,40 144,46 152,36 160,42 168,30 176,36 184,28 192,32 200,22"
                          fill="none"
                          stroke="#5dcf46"
                          strokeWidth="1.5"
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

                  {/* How this vault works — CL-specific mechanics card */}
                  <HalfInfo
                    $marginbottom="25px"
                    $backcolor={bgColorBox}
                    $bordercolor={borderColorBox}
                  >
                    {sectionTitle('How this vault works')}
                    <NewLabel $padding="14px 15px 6px" $size="13.5px" $weight="400" $height="22px" $fontcolor={fontColor3}>
                      Deposits are placed into a concentrated liquidity position sitting tightly
                      around the current price. Trading fees and AERO emissions auto-compound back
                      into the same range. No claim or restake action is required.
                    </NewLabel>
                    <NewLabel $padding="0 15px 12px" $size="13.5px" $weight="400" $height="22px" $fontcolor={fontColor3}>
                      When price drifts beyond the deviation trigger, the vault re-centers the range
                      around the new spot. Rebalances are TWAP-gated, so a single block of price
                      manipulation cannot trick the contract into swapping at a bad price.
                    </NewLabel>
                    {kvRow('Fee tier', VAULT.feeTier, 'ft')}
                    {kvRow('Rebalance cooldown', VAULT.params.rebalanceCooldown, 'rc')}
                    <div style={{ height: 8 }} />
                  </HalfInfo>

                  {/* Source of Yield — clone using the same wrapper as classic */}
                  <HalfInfo
                    $marginbottom="0"
                    $backcolor={bgColorBox}
                    $bordercolor={borderColorBox}
                  >
                    {sectionTitle('Source of Yield')}
                    <DescInfo $fontcolor6={fontColor6} $fontcolor3={fontColor3}>
                      <p>
                        The vault deploys{' '}
                        <strong>
                          {VAULT.pair.token0} / {VAULT.pair.token1}
                        </strong>{' '}
                        into a <strong>concentrated liquidity</strong> position on{' '}
                        <strong>{VAULT.protocol}</strong>, earning swap fees and{' '}
                        <strong>AERO emissions</strong>. The position is auto-re-centered when price
                        drifts beyond the deviation trigger; rebalances are TWAP-gated. Earned
                        rewards auto-compound back into the same range.
                      </p>
                    </DescInfo>
                    <FlexDiv
                      className="address"
                      $padding="0 15px 20px"
                      style={{ flexWrap: 'wrap', gap: 8 }}
                    >
                      {['Vault Address', 'Strategy Address', 'Pool Address', 'Add Liquidity'].map(
                        label => (
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
                        ),
                      )}
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
                      {kvRow('Trading fees', '~ 18.20%', 'apy-tf')}
                      {kvRow('AERO emissions (auto-compounded)', '~ 8.26%', 'apy-ae')}
                      {kvRow('Net (auto-compounded)', '~ 26.46%', 'apy-net')}
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

                    {/* Fees card */}
                    <LastHarvestInfo $backcolor={bgColorBox} $bordercolor={borderColorBox}>
                      {sectionTitle('Fees')}
                      {kvRow('Entry / Exit fee', `${VAULT.costs.entryFee} / ${VAULT.costs.exitFee}`, 'fe')}
                      {kvRow('Profit share', VAULT.costs.profitShare, 'ps')}
                      {kvRow('Typical interaction (both assets)', VAULT.costs.balanced, 'tb')}
                      {kvRow('Typical interaction (single asset)', VAULT.costs.singleAsset, 'ts')}
                      <FlexDiv $justifycontent="space-between" $padding="10px 15px">
                        <NewLabel $size="13px" $weight="300" $height="normal" $fontcolor={fontColor3}>
                          Per-rebalance swap slippage is borne by the vault and shows up as small
                          share-price jitter, not as a per-user fee.
                        </NewLabel>
                        <NewLabel $display="flex" $self="center">
                          <Question
                            id="cl-tooltip-jitter"
                            dark={darkMode}
                            content="The vault pays its own swap costs during rebalances; this shows up as small share-price movement, not a fee on your deposit."
                          />
                        </NewLabel>
                      </FlexDiv>
                    </LastHarvestInfo>

                    {/* Range parameters — CL-specific collapsible card */}
                    <LastHarvestInfo $backcolor={bgColorBox} $bordercolor={borderColorBox}>
                      <FlexDiv
                        onClick={() => setParamsOpen(o => !o)}
                        $justifycontent="space-between"
                        $padding="10px 15px"
                        style={{
                          borderBottom: paramsOpen ? `1px solid ${borderColorBox}` : 'none',
                          cursor: 'pointer',
                          alignItems: 'center',
                        }}
                      >
                        <NewLabel $size="14px" $weight="600" $height="24px" $fontcolor={fontColor4}>
                          Range parameters
                        </NewLabel>
                        <Caret $muted={fontColor3} $open={paramsOpen}>
                          ▼
                        </Caret>
                      </FlexDiv>
                      {paramsOpen && (
                        <>
                          {kvRow('Target width', VAULT.params.targetWidth, 'tw')}
                          {kvRow('Current width', VAULT.params.currentWidth, 'cw')}
                          {kvRow('Rebalance cooldown', VAULT.params.rebalanceCooldown, 'rc2')}
                          {kvRow('Deviation trigger', VAULT.params.deviationTrigger, 'dt')}
                          {kvRow('TWAP window', VAULT.params.twapWindow, 'tw2')}
                          {kvRow('Max swap per rebalance', VAULT.params.maxSwap, 'ms')}
                          {kvRow('Internal slippage cap', VAULT.params.slippageBps, 'is')}
                        </>
                      )}
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

export default CLVault
