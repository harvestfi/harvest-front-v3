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
  PreviewBox,
  RoutingHint,
  InputWithChip,
  TokenChip,
  TokenMonogram,
  TokenIcon,
  CTAWrap,
} from '../CLVault/style'

const num = v => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
const fmt = (n, d = 4) => {
  if (!n || n === 0) return '0'
  return n.toLocaleString(undefined, { maximumFractionDigits: d })
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

  const { underlying, vaultAddress, userPosition, id, tvlUsd, position } = data
  const fTokenName = id ? `f${id}` : 'shares'
  const availableShares = userPosition?.vaultShares || 0

  const [shares, setShares] = useState('')
  const [pending, setPending] = useState(false)
  const [estUnderlying, setEstUnderlying] = useState(null)
  const [costExpanded, setCostExpanded] = useState(false)

  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const pillBg = darkMode ? bgColorButton : '#fff'
  const previewBg = darkMode ? bgColorButton : '#F0F4FF'

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
    return { shares: s, underlying: estUnderlying }
  }, [shares, estUnderlying])

  const withdrawFraction =
    num(shares) > 0 && availableShares > 0 ? num(shares) / availableShares : 0
  const tvlFraction = tvlUsd > 0 && userPosition?.usdValue > 0 ? userPosition.usdValue / tvlUsd : 0
  const largeWithdraw = withdrawFraction > 0.25 || tvlFraction > 0.1

  const hasInput = num(shares) > 0 && num(shares) <= availableShares

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

  return (
    <div>
      <RoutingHint $muted={fontColor3} style={{ marginBottom: 12 }}>
        Revert shares back to {underlying.symbol}. The vault unwinds leverage before sending funds.
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
          Shares {fTokenName}
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

      <PreviewBox $bg={previewBg}>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
          <span>{underlying.symbol} received</span>
          <b>
            {preview && preview.underlying != null
              ? `~ ${fmt(preview.underlying, 4)} ${underlying.symbol}`
              : 'n/a'}
          </b>
        </Row>
        <Row
          $muted={fontColor3}
          $fontcolor={fontColor1}
          $pad="4px 0"
          style={{ cursor: 'pointer' }}
          onClick={() => setCostExpanded(v => !v)}
        >
          <span>Cost breakdown {costExpanded ? '▾' : '▸'}</span>
          <b>~ n/a bps</b>
        </Row>
        {costExpanded && (
          <Row
            $muted={fontColor3}
            $fontcolor={fontColor1}
            $pad="4px 0 4px 12px"
            style={{ fontSize: 12 }}
          >
            <span>Unwind + swap overhead (median from on-chain interactions)</span>
          </Row>
        )}
        {position && (
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
            <span>Vault LTV after withdraw</span>
            <b>~ {(position.ltv * 100).toFixed(1)}%</b>
          </Row>
        )}
      </PreviewBox>

      <SettingRow $muted={fontColor3}>
        <HelpTip
          id="loop-withdraw-out"
          darkMode={darkMode}
          tip="Estimated underlying received after unwinding leverage."
        >
          Est. {underlying.symbol} out
        </HelpTip>
        <b style={{ color: fontColor1, fontWeight: 600 }}>
          {preview && preview.underlying != null
            ? `${fmt(preview.underlying, 4)} ${underlying.symbol}`
            : 'n/a'}
        </b>
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
          {!connected
            ? 'Connect Wallet to Get Started'
            : pending
              ? 'Confirming...'
              : !hasInput
                ? num(shares) > availableShares
                  ? 'Insufficient shares'
                  : 'Enter an amount'
                : 'Revert'}
        </Button>
      </CTAWrap>
    </div>
  )
}

export default LoopWithdraw
