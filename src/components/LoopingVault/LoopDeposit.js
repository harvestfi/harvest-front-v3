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
  PreviewBox,
  RoutingHint,
  InputUsd,
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CTAWrap,
} from '../CLVault/style'

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
  const [costExpanded, setCostExpanded] = useState(false)

  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const pillBg = darkMode ? bgColorButton : '#fff'
  const previewBg = darkMode ? bgColorButton : '#F0F4FF'
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
    return { shares, valueUsd: usd, valueToken: a }
  }, [amount, estShares, perShareUsd, underlying])

  const inputUsd = useMemo(() => {
    const a = num(amount)
    const p = Number(underlying.priceUsd)
    if (!a || !Number.isFinite(p) || p <= 0) return null
    return a * p
  }, [amount, underlying.priceUsd])

  const hasInput = num(amount) > 0
  const yearlyYield =
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

      <PreviewBox $bg={previewBg}>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
          <span>Est. shares received</span>
          <b>
            {preview && preview.shares != null ? `${fmt(preview.shares, 4)} ${fTokenName}` : 'n/a'}
          </b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
          <span>{underlying.symbol}-equivalent value</span>
          <b>
            {preview
              ? preview.valueToken != null
                ? `~ ${fmt(preview.valueToken, 4)} ${underlying.symbol}`
                : 'n/a'
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
            <span>Swap + fold overhead (median from on-chain interactions)</span>
          </Row>
        )}
        {position && (
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
            <span>Vault LTV after deposit</span>
            <b>~ {(position.ltv * 100).toFixed(1)}%</b>
          </Row>
        )}
      </PreviewBox>

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

      <SettingRow $muted={fontColor3}>
        <HelpTip
          id="loop-yearly-yield"
          darkMode={darkMode}
          tip="Estimated yearly yield at live APY."
        >
          Est. Yearly Yield
        </HelpTip>
        <b style={{ color: fontColor1, fontWeight: 600 }}>
          {yearlyYield != null ? fmtUsd(yearlyYield) : 'n/a'}
        </b>
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
          {!connected
            ? 'Connect Wallet to Get Started'
            : pending
              ? 'Confirming...'
              : !hasInput
                ? 'Enter an amount'
                : 'Supply'}
        </Button>
      </CTAWrap>
    </div>
  )
}

export default LoopDeposit
