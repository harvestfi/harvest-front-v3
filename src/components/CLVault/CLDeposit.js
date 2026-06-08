import React, { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatViemPluginErrorMessage } from '../../services/viem'
import { clDepositSingle, clPreviewDepositShares } from './clActions'
import Button from '../Button'
import {
  FieldTitle,
  PillRow,
  TokenPill,
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
} from './style'

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1]
const num = v => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

const fmt = (n, d = 4) => {
  if (!n || n === 0) return '0'
  if (n < 10 ** -d) {
    const sigFigs = Math.max(d, Math.ceil(-Math.log10(n)) + 2)
    return n.toLocaleString(undefined, { maximumFractionDigits: Math.min(sigFigs, 10) })
  }
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

const DepositModule = ({ data, connected, onRefresh }) => {
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

  const { token0, token1, underlyingUsdPrice, sharePrice, walletBalances, apy, id } = data
  const tokens = [token0, token1]
  const fTokenName = id ? `f${id}` : 'shares'

  const perShareUsd =
    Number(underlyingUsdPrice) > 0 && Number(sharePrice) > 0
      ? Number(underlyingUsdPrice) * Number(sharePrice)
      : 0

  const [singleIdx, setSingleIdx] = useState(0)
  const [singleAmount, setSingleAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [checked, setChecked] = useState(false)
  const [pending, setPending] = useState(false)

  const single = tokens[singleIdx]
  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const pillBg = darkMode ? bgColorButton : '#fff'
  const previewBg = darkMode ? bgColorButton : '#F0F4FF'
  const slipInactiveBg = darkMode ? bgColorButton : '#F0F4FF'

  const tokenIcon = (tk, size = '20px') =>
    tk.logo ? (
      <TokenIcon src={tk.logo} alt={tk.symbol} $size={size} />
    ) : (
      <TokenMonogram $color={tk.color} $cardbg={pillBg} $size={size}>
        {tk.symbol.slice(0, 1)}
      </TokenMonogram>
    )

  const [estShares, setEstShares] = useState(null)

  useEffect(() => {
    const a = num(singleAmount)
    if (!a || !single?.wrapper) {
      setEstShares(null)
      return undefined
    }
    let active = true
    const handle = setTimeout(async () => {
      const shares = await clPreviewDepositShares({ token: single, amount: a })
      if (active) setEstShares(shares)
    }, 350)
    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [singleAmount, singleIdx])

  const preview = useMemo(() => {
    const a = num(singleAmount)
    if (!a) return null
    const tokenUsd = Number(single.priceUsd)
    let shares = estShares,
      usd = estShares != null && perShareUsd > 0 ? estShares * perShareUsd : null
    if (usd == null && Number.isFinite(tokenUsd) && tokenUsd > 0) {
      usd = a * tokenUsd
      shares = perShareUsd > 0 ? usd / perShareUsd : null
    }
    return {
      route: `CLWrapper(${single.symbol})`,
      shares,
      valueUsd: usd,
      valueToken: a,
      swapBps: 14,
    }
  }, [singleAmount, singleIdx, estShares, perShareUsd, single])

  const inputUsd = useMemo(() => {
    const a = num(singleAmount)
    const p = Number(single.priceUsd)
    if (!a || !Number.isFinite(p) || p <= 0) return null
    return a * p
  }, [singleAmount, single])

  const hasInput = num(singleAmount) > 0
  const yearlyYield =
    preview && preview.valueUsd != null ? preview.valueUsd * (apy.total / 100) : null

  const handleSupply = async () => {
    if (!connected || !hasInput || !checked || pending) return

    setPending(true)
    try {
      await clDepositSingle({ token: single, amount: num(singleAmount), account, viem, slippage })

      toast.success('Deposit completed')
      setSingleAmount('')
      if (onRefresh) {
        try {
          await onRefresh()
        } catch (e) {
          /* non-fatal */
        }
      }
      if (getWalletBalances) {
        try {
          await getWalletBalances([], false, true)
        } catch (e) {
          /* non-fatal */
        }
      }
    } catch (err) {
      toast.error(formatViemPluginErrorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <PillRow>
        {tokens.map((tk, idx) => (
          <TokenPill
            key={tk.symbol}
            $active={idx === singleIdx}
            $bg={pillBg}
            $activebg={darkMode ? bgColorButton : '#fff'}
            $border={inputBorderColor}
            $fontcolor={fontColor1}
            onClick={() => setSingleIdx(idx)}
          >
            {tokenIcon(tk)}
            {tk.symbol}
          </TokenPill>
        ))}
      </PillRow>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 6,
        }}
      >
        <FieldTitle $fontcolor={fontColor2} style={{ margin: 0 }}>
          Amount {single.symbol}
        </FieldTitle>
        <BalanceInfo
          $fontcolor={fontColor}
          onClick={() => setSingleAmount(String(walletBalances[`token${singleIdx}`]))}
          style={{ marginTop: 0 }}
        >
          Balance:<span>{fmt(walletBalances[`token${singleIdx}`], 4)}</span>
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
          value={singleAmount}
          onChange={e => setSingleAmount(e.target.value)}
        />
        {inputUsd != null && <InputUsd $muted={fontColor3}>{fmtUsd(inputUsd)}</InputUsd>}
        <TokenChip $bg={pillBg} $border={inputBorderColor} $fontcolor={fontColor1}>
          {tokenIcon(single)}
          {single.symbol}
        </TokenChip>
      </InputWithChip>

      <RoutingHint $muted={fontColor3}>
        Routed via CLWrapper({single.symbol}): single asset
      </RoutingHint>

      <PreviewBox $bg={previewBg}>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
          <span>Expected shares</span>
          <b>
            {preview && preview.shares != null
              ? `~ ${fmt(preview.shares, 4)} ${fTokenName}`
              : '~ 0.0000'}
          </b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
          <span>Value (in {single.symbol})</span>
          <b>{preview ? `~ ${fmt(preview.valueToken, 4)}` : '~ 0.0000'}</b>
        </Row>
        <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
          <span>Internal swap cost</span>
          <b>~ {preview ? preview.swapBps : 14} bps</b>
        </Row>
      </PreviewBox>

      <SettingRow $muted={fontColor3}>
        <HelpTip
          id="cl-max-slippage"
          darkMode={darkMode}
          tip="Maximum price movement allowed during the deposit swap."
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
          id="cl-yearly-yield"
          darkMode={darkMode}
          tip="Calculated using live APY and the estimated deposit value."
        >
          Est. Yearly Yield
        </HelpTip>
        <b style={{ color: fontColor1, fontWeight: 600 }}>
          {yearlyYield != null ? `$${fmt(yearlyYield, 2)}` : 'n/a'}
        </b>
      </SettingRow>

      <SettingRow $muted={fontColor3}>
        <HelpTip
          id="cl-est-received"
          darkMode={darkMode}
          tip="The estimated number of vault shares you will receive."
        >
          Est. Received
        </HelpTip>
        <b style={{ color: fontColor1, fontWeight: 600 }}>
          {preview && preview.shares != null ? `${fmt(preview.shares, 2)} ${fTokenName}` : 'n/a'}
        </b>
      </SettingRow>

      <CheckboxContainer
        $dark={darkMode}
        style={{ background: darkMode ? undefined : bgColorMessage }}
      >
        <CheckboxInput
          type="checkbox"
          id="cl-terms"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        <CheckboxLabel htmlFor="cl-terms" $dark={darkMode}>
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

export default DepositModule
