import React, { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatViemPluginErrorMessage } from '../../services/viem'
import { loopDeposit, loopPreviewDepositShares } from './loopActions'
import Button from '../Button'
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
} from './style'
import { fmtBps } from './loopHelpers'
import {
  projectLtvAfterDeposit,
  computeEntryCostBps,
} from './loopLtvSim'

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1]
const num = v => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
const fmt = (n, d = 4) => {
  if (!n || n === 0) return '0'
  return n.toLocaleString(undefined, { maximumFractionDigits: d })
}
const fmtUsd = n => {
  if (!n || n === 0) return '$0'
  if (n >= 1000) return `$${Math.round(n).toLocaleString()}`
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
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

  const {
    underlying,
    vaultAddress,
    walletBalance,
    apy,
    id,
    sharePrice,
    underlyingUsdPrice,
    position,
    fees = {},
  } = data
  const fTokenName = id ? `f${id}` : 'shares'
  const perShareUsd =
    Number(underlyingUsdPrice) > 0 && Number(sharePrice) > 0
      ? Number(underlyingUsdPrice) * Number(sharePrice)
      : 0

  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [checked, setChecked] = useState(false)
  const [pending, setPending] = useState(false)
  const [estShares, setEstShares] = useState(null)

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

  const preview = useMemo(() => {
    const a = num(amount)
    if (!a) return null
    const tokenUsd = Number(underlying.priceUsd)
    let shares = estShares
    let usd = estShares != null && perShareUsd > 0 ? estShares * perShareUsd : null
    if (usd == null && Number.isFinite(tokenUsd) && tokenUsd > 0) {
      usd = a * tokenUsd
      shares = perShareUsd > 0 ? usd / perShareUsd : null
    }
    const valueToken =
      shares != null && sharePrice > 0 ? shares * sharePrice : a
    return { shares, valueUsd: usd, valueToken, inputAmount: a }
  }, [amount, estShares, perShareUsd, underlying, sharePrice])

  const entryCostBps = useMemo(() => {
    if (!preview) return fees.entryCostBps30d
    const live = computeEntryCostBps(preview.inputAmount, preview.valueToken)
    return live ?? fees.entryCostBps30d
  }, [preview, fees.entryCostBps30d])

  const wethAfterCost = useMemo(() => {
    if (!preview) return null
    const cost = (entryCostBps || 0) / 10000
    return preview.inputAmount * (1 - cost)
  }, [preview, entryCostBps])

  const projectedLtv = useMemo(() => {
    if (!position || !preview) return null
    return projectLtvAfterDeposit(position, preview.inputAmount, entryCostBps || 0)
  }, [position, preview, entryCostBps])

  const inputUsd = useMemo(() => {
    const a = num(amount)
    const p = Number(underlying.priceUsd)
    if (!a || !Number.isFinite(p) || p <= 0) return null
    return a * p
  }, [amount, underlying.priceUsd])

  const hasInput = num(amount) > 0
  const yearlyYieldToken =
    preview && preview.valueToken != null ? preview.valueToken * (apy.total / 100) : null
  const yearlyYieldUsd =
    preview && preview.valueUsd != null ? preview.valueUsd * (apy.total / 100) : null

  const handleSupply = async () => {
    if (!connected || !hasInput || !checked || pending) return
    setPending(true)
    try {
      await loopDeposit({ vaultAddress, underlying, amount: num(amount), account, viem })
      toast.success('Deposit completed')
      setAmount('')
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
          onClick={() => setAmount(String(walletBalance))}
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
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        {inputUsd != null && <InputUsd $muted={fontColor3}>{fmtUsd(inputUsd)}</InputUsd>}
        <TokenChip $bg={pillBg} $border={inputBorderColor} $fontcolor={fontColor1}>
          {tokenIcon(underlying)}
          {underlying.symbol}
        </TokenChip>
      </InputWithChip>

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
                {preview && preview.shares != null ? `~ ${fmt(preview.shares, 4)}` : 'n/a'}
              </OutputValue>
              {preview?.valueUsd != null && (
                <OutputSub $muted={fontColor3}>{fmtUsd(preview.valueUsd)}</OutputSub>
              )}
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
                  ? `~ ${fmt(yearlyYieldToken, 4)} ${underlying.symbol}`
                  : 'n/a'}
              </OutputValue>
              {yearlyYieldUsd != null && (
                <OutputSub $muted={fontColor3}>{fmtUsd(yearlyYieldUsd)}</OutputSub>
              )}
            </OutputCard>
          </OutputGrid>

          <DetailsBox $bg={cardBg}>
            <DetailsTitle $muted={fontColor3}>Details</DetailsTitle>
            <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
              <span>{underlying.symbol}-equivalent value (after entry cost)</span>
              <b>
                {wethAfterCost != null
                  ? `~ ${fmt(wethAfterCost, 4)} ${underlying.symbol}`
                  : 'n/a'}
              </b>
            </Row>
            <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
              <span>Entry cost (median 30d)</span>
              <b>{fmtBps(entryCostBps)}</b>
            </Row>
            {position && projectedLtv != null && (
              <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
                <span>Vault LTV after your entry</span>
                <b>
                  {(projectedLtv * 100).toFixed(2)}%{' '}
                  <span style={{ fontWeight: 500 }}>(was {(position.ltv * 100).toFixed(2)}%)</span>
                </b>
              </Row>
            )}
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

      <CTAWrap $disabled={!connected || !hasInput || !checked || pending}>
        <Button
          $fontcolor="wido-deposit"
          $width="100%"
          $btncolor={btnColor}
          $btnhovercolor={btnHoverColor}
          $btnactivecolor={btnActiveColor}
          $disabled={!connected || !hasInput || !checked || pending}
          disabled={!connected || !hasInput || !checked || pending}
          onClick={handleSupply}
        >
          {ctaLabel()}
        </Button>
      </CTAWrap>
    </div>
  )
}

export default LoopDeposit
