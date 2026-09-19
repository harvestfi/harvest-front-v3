import React, { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { PiQuestion, PiCaretDown } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatViemPluginErrorMessage } from '../../services/viem'
import { loopDeposit, loopPreviewDepositShares, loopSimulateDeposit } from './loopActions'
import Button from '../Button'
import InfoIcon from '../../assets/images/logos/beginners/info-circle.svg'
import {
  FieldTitle,
  InputWithChip,
  TokenChip,
  TokenMonogram,
  TokenIcon,
  BalanceInfo,
  SlipOption,
  Row,
  SettingRow,
  SettingLabel,
  SlipPills,
  RoutingHint,
  InputUsd,
  ChipLabel,
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CTAWrap,
} from '../CLVault/style'
import {
  SectionLabel,
  OutputGrid,
  OutputCard,
  OutputTitle,
  OutputValue,
  OutputSub,
  DetailsBox,
  DetailsTitle,
  DetailsBody,
  CapBarHead,
  CapBarLabel,
  CapBarValue,
  CapBarTrack,
  CapBarFill,
} from './style'
import {
  fmtBps,
  capColorForPct,
  fmtTokenAmount as fmt,
  fmtApproxToken,
  fmtUsdAmount as fmtUsd,
  fmtApproxUsd,
  truncateForDisplay,
} from './loopHelpers'
import { computeEntryCostBps } from './loopLtvSim'

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1]
const num = v => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

const HelpTip = ({ id, tip, darkMode, children }) => (
  <SettingLabel>
    {children}
    <PiQuestion className="question" data-tip id={id} />
    <Tooltip
      id={id}
      anchorSelect={`#${id}`}
      backgroundColor={darkMode ? 'white' : '#101828'}
      borderColor={darkMode ? 'white' : 'black'}
      textColor={darkMode ? 'black' : 'white'}
      place="right"
    >
      {tip}
    </Tooltip>
  </SettingLabel>
)

const LoopDeposit = ({ data, connected, onRefresh }) => {
  const { account, viem, getWalletBalances } = useWallet()
  const {
    darkMode,
    fontColor,
    fontColor1,
    fontColor2,
    fontColor3,
    btnColor,
    btnHoverColor,
    btnActiveColor,
    inputBorderColor,
    bgColorButton,
    bgColorMessage,
    linkColor,
  } = useThemeContext()

  const { underlying, vaultAddress, walletBalance, apy, id, sharePrice, underlyingUsdPrice, cap } =
    data
  const fTokenName = id ? `f${id}` : 'shares'
  const perShareUsd =
    Number(underlyingUsdPrice) > 0 && Number(sharePrice) > 0
      ? Number(underlyingUsdPrice) * Number(sharePrice)
      : 0

  const [amount, setAmount] = useState('')
  const [amountDisplay, setAmountDisplay] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [checked, setChecked] = useState(false)
  const [pending, setPending] = useState(false)
  const [estShares, setEstShares] = useState(null)
  const [simDetails, setSimDetails] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const pillBg = darkMode ? bgColorButton : '#fff'
  const cardBg = darkMode ? bgColorButton : '#F0F4FF'
  const slipInactiveBg = darkMode ? bgColorButton : '#F0F4FF'

  const tokenIcon = tk =>
    tk.logo ? (
      <TokenIcon src={tk.logo} alt={tk.symbol} $size="20px" />
    ) : (
      <TokenMonogram $color={tk.color} $cardbg={pillBg} $size="20px">
        {tk.symbol.slice(0, 1)}
      </TokenMonogram>
    )

  useEffect(() => {
    const a = num(amount)
    if (!a || !vaultAddress) {
      setEstShares(null)
      return undefined
    }
    let active = true
    const handle = setTimeout(async () => {
      const shares = await loopPreviewDepositShares({
        vaultAddress,
        amount: a,
        decimals: underlying.decimals,
      })
      if (active) setEstShares(shares)
    }, 350)
    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [amount, vaultAddress, underlying.decimals])

  useEffect(() => {
    const a = num(amount)
    if (!a || !vaultAddress) {
      setSimDetails(null)
      return undefined
    }
    let active = true
    const handle = setTimeout(async () => {
      const res = await loopSimulateDeposit({ vaultAddress, underlying, amount: a, account })
      if (active) setSimDetails(res)
    }, 350)
    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [amount, vaultAddress, underlying, account])

  const preview = useMemo(() => {
    const a = num(amount)
    if (!a) return null
    const tokenUsd = Number(underlying.priceUsd)
    let shares = estShares != null && estShares > 0 ? estShares : null,
      usd = shares != null && perShareUsd > 0 ? shares * perShareUsd : null
    if (shares == null && Number.isFinite(tokenUsd) && tokenUsd > 0) {
      usd = a * tokenUsd
      shares = perShareUsd > 0 ? usd / perShareUsd : null
    }
    const valueToken = shares != null && sharePrice > 0 ? shares * sharePrice : a
    return { shares, valueUsd: usd, valueToken, inputAmount: a }
  }, [amount, estShares, perShareUsd, underlying, sharePrice])

  const entryCostBps = useMemo(() => {
    if (simDetails?.entryCostBps != null) return simDetails.entryCostBps
    if (!preview) return null
    return computeEntryCostBps(preview.inputAmount, preview.valueToken)
  }, [simDetails, preview])

  const wethAfterCost = useMemo(() => {
    if (simDetails?.wethEquivalent != null) return simDetails.wethEquivalent
    if (!preview) return null
    const cost = (entryCostBps || 0) / 10000
    return preview.inputAmount * (1 - cost)
  }, [simDetails, preview, entryCostBps])

  const inputUsd = useMemo(() => {
    const a = num(amount)
    const p = Number(underlying.priceUsd)
    if (!a || !Number.isFinite(p) || p <= 0) return null
    return a * p
  }, [amount, underlying.priceUsd])

  const hasInput = num(amount) > 0
  const exceedsBalance = hasInput && num(amount) > Number(walletBalance || 0)
  const capFull = Boolean(cap && cap.full)
  const exceedsCap = Boolean(cap && hasInput && num(amount) > cap.remaining)
  const supplyDisabled =
    !connected || !hasInput || !checked || pending || exceedsBalance || capFull || exceedsCap
  const yearlyYieldToken =
    preview && preview.valueToken != null ? preview.valueToken * (apy.total / 100) : null
  const yearlyYieldUsd =
    preview && preview.valueUsd != null ? preview.valueUsd * (apy.total / 100) : null

  const applyAmount = (value, truncate = false) => {
    const full = value == null ? '' : String(value)
    setAmount(full)
    setAmountDisplay(truncate ? truncateForDisplay(full) : full)
  }

  const handleSupply = async () => {
    if (supplyDisabled) return
    const deposited = num(amount)
    setPending(true)
    try {
      await loopDeposit({ vaultAddress, underlying, amount: deposited, account, viem })
      toast.success('Deposit completed')
      applyAmount('')
      if (onRefresh) await onRefresh().catch(() => {})
      if (getWalletBalances) await getWalletBalances([], false, true).catch(() => {})
    } catch (err) {
      toast.error(formatViemPluginErrorMessage(err))
    } finally {
      setPending(false)
    }
  }

  const ctaLabel = () => {
    if (!connected) return 'Connect Wallet to Get Started'
    if (pending) return 'Confirming...'
    if (!hasInput) return 'Enter an amount'
    if (exceedsBalance) return `Insufficient ${underlying.symbol} balance`
    if (capFull) return 'Vault cap reached'
    if (exceedsCap) return 'Exceeds vault cap'
    if (!checked) return 'Agree to terms above'
    return 'Supply'
  }

  return (
    <div>
      <RoutingHint $muted={fontColor3} style={{ marginBottom: 12 }}>
        Single-asset entry. {underlying.symbol} is zapped into collateral and folded by the vault to
        the target leverage.
      </RoutingHint>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 6,
        }}
      >
        <FieldTitle $fontcolor={fontColor2} style={{ margin: 0 }}>
          Amount {underlying.symbol}
        </FieldTitle>
        <BalanceInfo
          $fontcolor={fontColor}
          onClick={() => applyAmount(walletBalance, true)}
          style={{ marginTop: 0 }}
        >
          Balance:<span>{fmt(walletBalance, 4)}</span>
        </BalanceInfo>
      </div>

      <InputWithChip
        $border={inputBorderColor}
        $bg={inputBg}
        $fontcolor={fontColor1}
        $muted={fontColor3}
      >
        <input
          type="number"
          placeholder="0.0"
          value={amountDisplay}
          title={amount !== amountDisplay ? `${amount} ${underlying.symbol}` : undefined}
          onChange={e => applyAmount(e.target.value)}
        />
        {inputUsd != null && <InputUsd $muted={fontColor3}>{fmtUsd(inputUsd)}</InputUsd>}
        <TokenChip $bg={pillBg} $border={inputBorderColor} $fontcolor={fontColor1}>
          {tokenIcon(underlying)}
          <ChipLabel title={underlying.symbol}>{underlying.symbol}</ChipLabel>
        </TokenChip>
      </InputWithChip>

      {exceedsBalance && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: '12px 0',
            padding: '14px 16px',
            borderRadius: 12,
            border: `1px solid ${inputBorderColor}`,
            background: bgColorMessage,
            color: fontColor2,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <img src={InfoIcon} alt="" width="18" height="18" />
          Insufficient {underlying.symbol} balance in your wallet
        </div>
      )}

      {cap && (
        <div style={{ margin: '14px 0' }}>
          <CapBarHead>
            <CapBarLabel $fontcolor={fontColor2}>
              Vault cap
              <PiQuestion className="question" data-tip id="loop-vault-cap" />
              <Tooltip
                id="loop-vault-cap"
                anchorSelect="#loop-vault-cap"
                place="top"
                opacity={1}
                backgroundColor={darkMode ? '#ffffff' : '#101828'}
                textColor={darkMode ? '#101828' : '#ffffff'}
                style={{
                  maxWidth: 320,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  textAlign: 'left',
                  zIndex: 1000,
                }}
              >
                This vault accepts up to {fmt(cap.limit, 2)} {cap.symbol}. Supplied:{' '}
                {fmt(cap.supplied, 6)} {cap.symbol} · room left: {fmt(cap.remaining, 6)}{' '}
                {cap.symbol}. Entries are blocked once the cap is reached; it may be raised over
                time.
              </Tooltip>
            </CapBarLabel>
            <CapBarValue $fontcolor={fontColor1}>
              {fmt(cap.supplied, 2)} / {fmt(cap.limit, 2)} {cap.symbol}
            </CapBarValue>
          </CapBarHead>
          <CapBarTrack>
            <CapBarFill $pct={cap.pct} $color={capColorForPct(cap.pct)} />
          </CapBarTrack>
        </div>
      )}

      {hasInput && (
        <>
          <SectionLabel $fontcolor={fontColor2}>Output</SectionLabel>
          <OutputGrid>
            <OutputCard $bg={cardBg}>
              <OutputTitle $muted={fontColor3}>
                <HelpTip
                  id="loop-est-received"
                  darkMode={darkMode}
                  tip="Estimated vault shares you will receive."
                >
                  Est. Received
                </HelpTip>
              </OutputTitle>
              <OutputValue $fontcolor={fontColor1}>
                {preview?.valueUsd != null ? fmtApproxUsd(preview.valueUsd) : 'n/a'}
              </OutputValue>
              <OutputSub $muted={fontColor3}>{fTokenName}</OutputSub>
            </OutputCard>

            <OutputCard $bg={cardBg}>
              <OutputTitle $muted={fontColor3}>
                <HelpTip
                  id="loop-yearly-yield-out"
                  darkMode={darkMode}
                  tip="Estimated yearly yield at live APY."
                >
                  Est. Yearly Yield
                </HelpTip>
              </OutputTitle>
              <OutputValue $fontcolor={fontColor1}>
                {yearlyYieldToken != null
                  ? fmtApproxToken(yearlyYieldToken, underlying.symbol)
                  : 'n/a'}
              </OutputValue>
              {yearlyYieldUsd != null && (
                <OutputSub $muted={fontColor3}>{fmtUsd(yearlyYieldUsd)}</OutputSub>
              )}
            </OutputCard>
          </OutputGrid>

          <DetailsBox $bg={cardBg}>
            <DetailsTitle
              type="button"
              $muted={fontColor3}
              $open={detailsOpen}
              onClick={() => setDetailsOpen(open => !open)}
              aria-expanded={detailsOpen}
            >
              Details
              <PiCaretDown />
            </DetailsTitle>
            <DetailsBody $open={detailsOpen}>
              <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
                <span>{underlying.symbol}-equivalent value (after entry cost)</span>
                <b>
                  {wethAfterCost != null ? fmtApproxToken(wethAfterCost, underlying.symbol) : 'n/a'}
                </b>
              </Row>
              <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
                <span>Entry cost</span>
                <b>{fmtBps(entryCostBps)}</b>
              </Row>
            </DetailsBody>
          </DetailsBox>
        </>
      )}

      <SettingRow $muted={fontColor3}>
        <HelpTip
          id="loop-max-slippage"
          darkMode={darkMode}
          tip="Maximum price movement allowed during the deposit zap and fold."
        >
          Max slippage
        </HelpTip>
        <SlipPills>
          {SLIPPAGE_OPTIONS.map(s => (
            <SlipOption
              key={s}
              $active={slippage === s}
              $accent={btnColor}
              $border={inputBorderColor}
              $fontcolor={fontColor1}
              $inactivebg={slipInactiveBg}
              onClick={() => setSlippage(s)}
            >
              {s}%
            </SlipOption>
          ))}
        </SlipPills>
      </SettingRow>

      <CheckboxContainer
        $dark={darkMode}
        style={{ background: darkMode ? undefined : bgColorMessage }}
      >
        <CheckboxInput
          type="checkbox"
          id="loop-terms"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        <CheckboxLabel htmlFor="loop-terms" $dark={darkMode}>
          I confirm that I have read and understand the product, have read the{' '}
          <a
            href="https://docs.harvest.finance/legal/risk-disclosures"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: linkColor }}
          >
            Risk Disclosures
          </a>
          , and agree to the{' '}
          <a
            href="https://docs.harvest.finance/legal/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: linkColor }}
          >
            Terms and Conditions
          </a>
          .
        </CheckboxLabel>
      </CheckboxContainer>

      <CTAWrap $disabled={supplyDisabled}>
        <Button
          $fontcolor="wido-deposit"
          $width="100%"
          $btncolor={btnColor}
          $btnhovercolor={btnHoverColor}
          $btnactivecolor={btnActiveColor}
          $disabled={supplyDisabled}
          disabled={supplyDisabled}
          onClick={handleSupply}
        >
          {ctaLabel()}
        </Button>
      </CTAWrap>
    </div>
  )
}

export default LoopDeposit
