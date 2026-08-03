import React, { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatViemPluginErrorMessage } from '../../services/viem'
import { getTokenPricesByAddresses } from '../../utilities/apiCalls'
import { clPreviewRedeemSingle, clWithdrawBoth, clWithdrawSingle } from './clActions'
import { resolveTokenUsdPrice } from './clData'
import Button from '../Button'
import CLTokenIcon from './CLTokenIcon'
import {
  FieldTitle,
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
  InlineSpinner,
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

  const { token0, token1, vaultAddress, position, price } = data
  const pos = position || { vaultShares: 0, underlying0: 0, underlying1: 0, usdValue: 0 }
  const tokenSelectBg = darkMode ? bgColorButton : '#fff'
  const inputBg = darkMode ? bgColorButton : '#F0F4FF'
  const previewBg = darkMode ? bgColorButton : '#F0F4FF'
  const slipInactiveBg = darkMode ? bgColorButton : '#F0F4FF'

  const tokenIcon = tk => <CLTokenIcon token={tk} size="18px" cardBg={bgColorNew} />

  const [shares, setShares] = useState('')
  const [output, setOutput] = useState('token0')
  const [slippage, setSlippage] = useState(0.5)
  const [pending, setPending] = useState(false)
  const [estOut, setEstOut] = useState(null)
  const [quoting, setQuoting] = useState(false)
  const [spotByAddress, setSpotByAddress] = useState({})

  const availableShares = pos.vaultShares
  const outputToken = output === 'token0' ? token0 : output === 'token1' ? token1 : null

  useEffect(() => {
    const addresses = [token0, token1].map(t => t.address).filter(Boolean)
    if (addresses.length === 0) return undefined

    let active = true
    getTokenPricesByAddresses(addresses, 'base')
      .then(prices => {
        if (active) setSpotByAddress(prices)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [token0.address, token1.address])

  useEffect(() => {
    const s = num(shares)
    if (!s || !outputToken?.wrapper) {
      setEstOut(null)
      setQuoting(false)
      return undefined
    }
    let active = true
    setQuoting(true)
    const handle = setTimeout(async () => {
      const quote = await clPreviewRedeemSingle({ token: outputToken, shares: s })
      if (active) {
        setEstOut(quote)
        setQuoting(false)
      }
    }, 350)
    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [shares, output, outputToken?.wrapper])

  const preview = useMemo(() => {
    const s = num(shares)
    if (!s || pos.vaultShares <= 0) return null

    const frac = s / pos.vaultShares
    const exp0 = pos.underlying0 * frac
    const exp1 = pos.underlying1 * frac
    const p0 = resolveTokenUsdPrice(token0, {
      spotByAddress,
      price,
      tokens: [token0, token1],
      tokenIndex: 0,
    })
    const p1 = resolveTokenUsdPrice(token1, {
      spotByAddress,
      price,
      tokens: [token0, token1],
      tokenIndex: 1,
    })
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
    let amount = estOut?.amount
    if (amount == null) {
      amount = Number.isFinite(tkPrice) && tkPrice > 0 ? totalUsd / tkPrice : null
    }
    return {
      route: `CLWrapper(${tk.symbol})`,
      swapBps: estOut?.costBps ?? null,
      out: [{ token: tk, amount, usd: totalUsd }],
    }
  }, [shares, output, pos, token0, token1, estOut, spotByAddress, price])

  const hasInput = num(shares) > 0

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
              {o.amount != null ? (
                <b>~ {fmt(o.amount, 4)}</b>
              ) : quoting ? (
                <InlineSpinner $color={fontColor3} aria-label="Loading" />
              ) : (
                <b>—</b>
              )}
            </Row>
          ))
        ) : (
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
            <span>Expected output</span>
            <b>~ 0.0000</b>
          </Row>
        )}
        {preview && (preview.swapBps != null || quoting) && (
          <Row $muted={fontColor3} $fontcolor={fontColor1} $pad="4px 0">
            <span>Internal swap cost</span>
            {preview.swapBps != null ? (
              <b>~ {fmt(preview.swapBps, 1)} bps</b>
            ) : (
              <InlineSpinner $color={fontColor3} aria-label="Loading" />
            )}
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
