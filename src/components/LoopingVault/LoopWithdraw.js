import React, { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatViemPluginErrorMessage } from '../../services/viem'
import { loopWithdraw, loopPreviewWithdrawUnderlying } from './loopActions'
import Button from '../Button'
import {
  FieldTitle,
  BalanceInfo,
  Row,
  SettingRow,
  SettingLabel,
  SlipOption,
  SlipPills,
  RoutingHint,
  InputWithChip,
  TokenChip,
  TokenMonogram,
  TokenIcon,
  InputUsd,
  CTAWrap,
} from '../CLVault/style'
import {
  SectionLabel,
  OutputCard,
  OutputTitle,
  OutputValue,
  OutputSub,
  DetailsBox,
  DetailsTitle,
} from './style'
import { fmtBps } from './loopHelpers'
import {
  projectLtvAfterWithdraw,
  computeExitCostBps,
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

const LoopWithdraw = ({ data, connected, onRefresh }) => {
  const { account, viem, getWalletBalances } = useWallet()
  const {
    darkMode,
    bgColorNew,
    fontColor,
    fontColor1,
    fontColor2,
    fontColor3,
    btnColor,
    btnHoverColor,
    btnActiveColor,
    inputBorderColor,
    bgColorButton,
  } = useThemeContext()

  const {
    underlying,
    vaultAddress,
    userPosition,
    id,
    tvlUsd,
    position,
    sharePrice,
    underlyingUsdPrice,
    fees = {},
  } = data
  const fTokenName = id ? `f${id}` : 'shares'
  const availableShares = userPosition?.vaultShares || 0
  const perShareUsd =
    Number(underlyingUsdPrice) > 0 && Number(sharePrice) > 0
      ? Number(underlyingUsdPrice) * Number(sharePrice)
      : 0

  const [shares, setShares] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [pending, setPending] = useState(false)
  const [estUnderlying, setEstUnderlying] = useState(null)

  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const pillBg = darkMode ? bgColorButton : '#fff'
  const cardBg = darkMode ? bgColorButton : '#F0F4FF'
  const slipInactiveBg = darkMode ? bgColorButton : '#F0F4FF'

  const tokenIcon = tk =>
    tk.logo ? (
      <TokenIcon src={tk.logo} alt={tk.symbol} $size="20px" />
    ) : (
      <TokenMonogram $color={tk.color} $cardbg={bgColorNew} $size="20px">
        {tk.symbol.slice(0, 1)}
      </TokenMonogram>
    )

  useEffect(() => {
    const s = num(shares)
    if (!s || !vaultAddress) {
      setEstUnderlying(null)
      return undefined
    }
    let active = true
    const handle = setTimeout(async () => {
      const out = await loopPreviewWithdrawUnderlying({ vaultAddress, shares: s })
      if (active) setEstUnderlying(out)
    }, 350)
    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [shares, vaultAddress])

  const preview = useMemo(() => {
    const s = num(shares)
    if (!s) return null
    const sharesUsd = perShareUsd > 0 ? s * perShareUsd : null
    return { shares: s, underlying: estUnderlying, sharesUsd }
  }, [shares, estUnderlying, perShareUsd])

  const exitCostBps = useMemo(() => {
    if (!preview || preview.underlying == null) return fees.exitCostBps30d
    const sharesValue =
      preview.sharesUsd != null && preview.sharesUsd > 0
        ? preview.sharesUsd / (Number(underlyingUsdPrice) || 1)
        : preview.shares * (sharePrice || 1)
    const live = computeExitCostBps(sharesValue, preview.underlying)
    return live ?? fees.exitCostBps30d
  }, [preview, fees.exitCostBps30d, underlyingUsdPrice, sharePrice])

  const exitCostToken = useMemo(() => {
    if (!preview || preview.underlying == null || exitCostBps == null) return null
    return preview.underlying * (exitCostBps / 10000)
  }, [preview, exitCostBps])

  const projectedLtv = useMemo(() => {
    if (!position || !preview?.underlying) return null
    return projectLtvAfterWithdraw(position, preview.underlying, exitCostBps || 0)
  }, [position, preview, exitCostBps])

  const inputUsd = useMemo(() => {
    const s = num(shares)
    if (!s || !(perShareUsd > 0)) return null
    return s * perShareUsd
  }, [shares, perShareUsd])

  const withdrawFraction =
    num(shares) > 0 && availableShares > 0 ? num(shares) / availableShares : 0
  const tvlFraction = tvlUsd > 0 && userPosition?.usdValue > 0 ? userPosition.usdValue / tvlUsd : 0
  const largeWithdraw = withdrawFraction > 0.25 || tvlFraction > 0.1

  const hasInput = num(shares) > 0 && num(shares) <= availableShares
  const hasPreview = num(shares) > 0

  const handleWithdraw = async () => {
    if (!connected || !hasInput || pending) return
    setPending(true)
    try {
      await loopWithdraw({ vaultAddress, shares: num(shares), account, viem })
      toast.success('Withdraw completed')
      setShares('')
      if (onRefresh) await onRefresh().catch(() => {})
      if (getWalletBalances) await getWalletBalances([], false, true).catch(() => {})
    } catch (err) {
      toast.error(formatViemPluginErrorMessage(err))
    } finally {
      setPending(false)
    }
  }

  const ctaLabel = () => {
    if (!connected) return 'Connect Wallet to Withdraw'
    if (pending) return 'Confirming...'
    if (!hasInput) {
      return num(shares) > availableShares ? 'Insufficient shares' : 'Enter an amount'
    }
    return 'Revert'
  }

  return (
    <div>
      <RoutingHint $muted={fontColor3} style={{ marginBottom: 12 }}>
        Single-asset withdrawal. The vault unwinds the loop and returns {underlying.symbol}.
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
          Shares to withdraw
        </FieldTitle>
        <BalanceInfo
          $fontcolor={fontColor}
          onClick={() => setShares(String(availableShares))}
          style={{ marginTop: 0 }}
        >
          Balance:<span>{fmt(availableShares, 4)}</span>
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
          value={shares}
          onChange={e => setShares(e.target.value)}
        />
        {inputUsd != null && <InputUsd $muted={fontColor3}>{fmtUsd(inputUsd)}</InputUsd>}
        <TokenChip $bg={pillBg} $border={inputBorderColor} $fontcolor={fontColor1}>
          {fTokenName}
        </TokenChip>
      </InputWithChip>

      {largeWithdraw && (
        <div
          style={{
            margin: '10px 0',
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(240, 68, 56, 0.1)',
            color: '#e0382b',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Large withdraw: exiting a significant share of the vault may increase unwind cost and
          temporarily move vault LTV. Consider splitting into smaller withdrawals.
        </div>
      )}

      {hasPreview && (
        <>
          <SectionLabel $fontcolor={fontColor2}>Receive</SectionLabel>
          <OutputCard $bg={cardBg} style={{ marginBottom: 12 }}>
            <OutputValue $fontcolor={fontColor1}>
              {preview && preview.underlying != null
                ? `~ ${fmt(preview.underlying, 4)}`
                : 'n/a'}
            </OutputValue>
            {preview?.underlying != null && underlyingUsdPrice > 0 && (
              <OutputSub $muted={fontColor3}>
                {fmtUsd(preview.underlying * Number(underlyingUsdPrice))}
              </OutputSub>
            )}
            <OutputSub $muted={fontColor3}>
              <TokenChip
                $bg={pillBg}
                $border={inputBorderColor}
                $fontcolor={fontColor1}
                style={{ display: 'inline-flex', marginTop: 4 }}
              >
                {tokenIcon(underlying)}
                {underlying.symbol}
              </TokenChip>
            </OutputSub>
          </OutputCard>

          <DetailsBox $bg={cardBg}>
            <DetailsTitle $muted={fontColor3}>Details</DetailsTitle>
            <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
              <span>Exit cost (median 30d)</span>
              <b>
                {fmtBps(exitCostBps)}
                {exitCostToken != null && (
                  <span style={{ fontWeight: 500 }}>
                    {' '}
                    (~ {fmt(exitCostToken, 4)} {underlying.symbol})
                  </span>
                )}
              </b>
            </Row>
            {position && projectedLtv != null && (
              <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
                <span>Vault LTV after your withdraw</span>
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
          id="loop-withdraw-slippage"
          darkMode={darkMode}
          tip="Maximum price movement allowed during the unwind and swap."
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

      <CTAWrap $disabled={!connected || !hasInput || pending}>
        <Button
          $fontcolor="wido-deposit"
          $width="100%"
          $btncolor={btnColor}
          $btnhovercolor={btnHoverColor}
          $btnactivecolor={btnActiveColor}
          $disabled={!connected || !hasInput || pending}
          disabled={!connected || !hasInput || pending}
          onClick={handleWithdraw}
        >
          {ctaLabel()}
        </Button>
      </CTAWrap>
    </div>
  )
}

export default LoopWithdraw
