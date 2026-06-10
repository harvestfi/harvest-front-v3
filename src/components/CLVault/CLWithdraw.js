import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatViemPluginErrorMessage } from '../../services/viem'
import { clWithdrawBoth, clWithdrawSingle } from './clActions'
import Button from '../Button'
import {
  FieldTitle,
  TokenMonogram,
  TokenIcon,
  BalanceInfo,
  OutputSelect,
  OutputOption,
  SlipOption,
  Row,
  SettingRow,
  SettingLabel,
  SlipPills,
  PreviewBox,
  RoutingHint,
  InputWithChip,
  TokenChip,
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

const WithdrawModule = ({ data, connected, onRefresh }) => {
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

  const { token0, token1, vaultAddress, position } = data
  const pos = position || { vaultShares: 0, underlying0: 0, underlying1: 0, usdValue: 0 }
  const tokenSelectBg = darkMode ? bgColorButton : '#fff'
  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const previewBg = darkMode ? bgColorButton : '#F0F4FF'
  const slipInactiveBg = darkMode ? bgColorButton : '#F0F4FF'

  const tokenIcon = tk =>
    tk.logo ? (
      <TokenIcon src={tk.logo} alt={tk.symbol} $size="18px" />
    ) : (
      <TokenMonogram $color={tk.color} $cardbg={bgColorNew} $size="18px">
        {tk.symbol.slice(0, 1)}
      </TokenMonogram>
    )

  const [shares, setShares] = useState('')
  const [output, setOutput] = useState('token0')
  const [slippage, setSlippage] = useState(0.5)
  const [pending, setPending] = useState(false)

  const availableShares = pos.vaultShares

  const preview = useMemo(() => {
    const s = num(shares)
    if (!s || pos.vaultShares <= 0) return null

    const frac = s / pos.vaultShares
    const exp0 = pos.underlying0 * frac
    const exp1 = pos.underlying1 * frac
    const p0 = Number(token0.priceUsd)
    const p1 = Number(token1.priceUsd)
    const usd0 = Number.isFinite(p0) && p0 > 0 ? exp0 * p0 : null
    const usd1 = Number.isFinite(p1) && p1 > 0 ? exp1 * p1 : null
    const totalUsd = pos.usdValue ? pos.usdValue * frac : (usd0 || 0) + (usd1 || 0)

    if (output === 'both') {
      return {
        route: 'CLVault.withdraw',
        swapBps: null,
        out: [
          { token: token0, amount: exp0, usd: usd0 },
          { token: token1, amount: exp1, usd: usd1 },
        ],
      }
    }
    const tk = output === 'token0' ? token0 : token1
    const tkPrice = output === 'token0' ? p0 : p1
    const amount = Number.isFinite(tkPrice) && tkPrice > 0 ? totalUsd / tkPrice : exp0 + exp1
    return {
      route: `CLWrapper(${tk.symbol})`,
      swapBps: 14,
      out: [{ token: tk, amount, usd: totalUsd }],
    }
  }, [shares, output, pos, token0, token1])

  const hasInput = num(shares) > 0
  const outputToken = output === 'token0' ? token0 : output === 'token1' ? token1 : null

  const handleRevert = async () => {
    if (!connected || !hasInput || pending) return
    setPending(true)
    try {
      if (output === 'both') {
        await clWithdrawBoth({ vaultAddress, shares: num(shares), account, viem, slippage })
      } else {
        const token = output === 'token0' ? token0 : token1
        await clWithdrawSingle({
          vaultAddress,
          token,
          shares: num(shares),
          account,
          viem,
          slippage,
        })
      }

      toast.success('Withdrawal completed')
      setShares('')
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
        <TokenChip $bg={tokenSelectBg} $border={inputBorderColor} $fontcolor={fontColor1}>
          Shares
        </TokenChip>
      </InputWithChip>

      {preview && outputToken && (
        <RoutingHint $muted={fontColor3}>Routed via {preview.route}: single asset</RoutingHint>
      )}

      <FieldTitle $fontcolor={fontColor2} style={{ marginTop: 16, marginBottom: 8 }}>
        Receive as
      </FieldTitle>
      <OutputSelect>
        <OutputOption
          $active={output === 'token0'}
          $accent={btnColor}
          $border={inputBorderColor}
          $fontcolor={fontColor1}
          $bg={tokenSelectBg}
          onClick={() => setOutput('token0')}
        >
          {tokenIcon(token0)}
          {token0.symbol}
        </OutputOption>
        <OutputOption
          $active={output === 'token1'}
          $accent={btnColor}
          $border={inputBorderColor}
          $fontcolor={fontColor1}
          $bg={tokenSelectBg}
          onClick={() => setOutput('token1')}
        >
          {tokenIcon(token1)}
          {token1.symbol}
        </OutputOption>
        <OutputOption
          $active={output === 'both'}
          $accent={btnColor}
          $border={inputBorderColor}
          $fontcolor={fontColor1}
          $bg={tokenSelectBg}
          onClick={() => setOutput('both')}
        >
          Both
        </OutputOption>
      </OutputSelect>

      <PreviewBox $bg={previewBg}>
        {preview ? (
          preview.out.map(o => (
            <Row key={o.token.symbol} $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
              <span>Expected {o.token.symbol}</span>
              <b>~ {fmt(o.amount, 4)}</b>
            </Row>
          ))
        ) : (
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
            <span>Expected output</span>
            <b>~ 0.0000</b>
          </Row>
        )}
        {preview && preview.swapBps != null && (
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
            <span>Internal swap cost</span>
            <b>~ {preview.swapBps} bps</b>
          </Row>
        )}
      </PreviewBox>

      <SettingRow $muted={fontColor3}>
        <HelpTip
          id="cl-withdraw-slippage"
          darkMode={darkMode}
          tip="Maximum price movement allowed during the withdrawal swap."
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
          onClick={handleRevert}
        >
          {!connected
            ? 'Connect Wallet to Get Started'
            : pending
              ? 'Confirming...'
              : !hasInput
                ? 'Enter shares'
                : 'Revert'}
        </Button>
      </CTAWrap>
    </div>
  )
}

export default WithdrawModule
