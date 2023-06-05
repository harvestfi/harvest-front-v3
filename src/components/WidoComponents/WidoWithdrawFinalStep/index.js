import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { get, isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { approve, getTokenAllowance, quote } from 'wido'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import CheckIcon from '../../../assets/images/logos/wido/check-approve.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import SettingIcon from '../../../assets/images/logos/wido/setting.svg'
import Swap1WithIcon from '../../../assets/images/logos/wido/swap2.svg'
import WithdrawIcon from '../../../assets/images/logos/wido/withdraw-icon.svg'
import {
  WIDO_BALANCES_DECIMALS,
  IFARM_TOKEN_SYMBOL,
  WIDO_EXTEND_DECIMALS,
} from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { fromWei, mainWeb3, maxUint256, safeWeb3 } from '../../../services/web3'
import { formatNumberWido, isSafeApp } from '../../../utils'
import WidoSwapToken from '../WidoSwapToken'
import { addresses } from '../../../data'
import {
  Buttons,
  CloseBtn,
  CloseButton,
  ExecuteButton,
  NewLabel,
  SelectTokenWido,
  IconArrowDown,
} from './style'
import { useActions } from '../../../providers/Actions'
import { useVaults } from '../../../providers/Vault'

const WidoWithdrawFinalStep = ({
  finalStep,
  setFinalStep,
  setWithdrawWido,
  setSelectTokenWith,
  symbol,
  tokenSymbol,
  useIFARM,
  setClickedTokenId,
  pickedToken,
  setPickedToken,
  token,
  unstakeBalance,
  setUnstakeBalance,
  slippagePercentage,
  fAssetPool,
  quoteValue,
  multipleAssets,
  setPendingAction,
}) => {
  const [approveValue, setApproveValue] = React.useState(0)
  const { account, getWalletBalances } = useWallet()
  const { fetchUserPoolStats, userStats } = usePools()
  const { vaultsData, farmingBalances, getFarmingBalances } = useVaults()
  const { handleWithdraw } = useActions()
  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  const fromToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
  const chainId = token.chain || token.data.chain
  const pricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)

  const walletBalancesToCheck = multipleAssets || [tokenSymbol]
  const selectedAsset = !token.isSingleAssetWithdrawalAllowed ? -1 : 0

  const [amountsToExecute, setAmountsToExecute] = useState([])

  const amountsToExecuteInWei = amountsToExecute.map(amt => {
    if (isEmpty(amt)) {
      return null
    }

    return amt
  })

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(unstakeBalance).isEqualTo(0) &&
      finalStep
    ) {
      setAmountsToExecute([unstakeBalance.toString()])
      const tokenAllowance = async () => {
        if (pickedToken.default) {
          setApproveValue(2)
        } else {
          const { allowance } = await getTokenAllowance({
            chainId,
            fromToken,
            toToken: pickedToken.address,
            accountAddress: account, // User
          })
          if (!new BigNumber(allowance).gte(unstakeBalance)) {
            setApproveValue(0)
          } else {
            setApproveValue(2)
          }
        }
      }

      tokenAllowance()
    }
  }, [pickedToken, account, chainId, fromToken, unstakeBalance, finalStep, token, useIFARM])

  useEffect(() => {
    const getQuoteResult = async () => {
      try {
        let fromInfoTemp, toInfoTemp
        if (pickedToken.default) {
          fromInfoTemp = `${formatNumberWido(
            fromWei(unstakeBalance, pickedToken.decimals),
            WIDO_EXTEND_DECIMALS,
          )}`
          toInfoTemp = `${formatNumberWido(
            new BigNumber(fromWei(unstakeBalance, pickedToken.decimals)).multipliedBy(
              fromWei(pricePerFullShare, pickedToken.decimals),
            ),
            WIDO_EXTEND_DECIMALS,
          )}`
          const price =
            pickedToken.usdPrice !== '0.0'
              ? formatNumberWido(
                  new BigNumber(fromWei(unstakeBalance, pickedToken.decimals))
                    .multipliedBy(fromWei(pricePerFullShare, pickedToken.decimals))
                    .multipliedBy(pickedToken.usdPrice),
                  WIDO_BALANCES_DECIMALS,
                )
              : 0

          fromInfoTemp += ` ($${price})`
          toInfoTemp += ` ($${price})`
        } else {
          fromInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(
                quoteValue.fromTokenAmount,
                token.decimals || token.data.lpTokenData.decimals,
              ),
              WIDO_EXTEND_DECIMALS,
            ) +
              (quoteValue.fromTokenUsdPrice === null
                ? ''
                : ` ($${formatNumberWido(
                    fromWei(
                      quoteValue.fromTokenAmount * quoteValue.fromTokenUsdPrice,
                      token.decimals || token.data.lpTokenData.decimals,
                    ),
                    WIDO_BALANCES_DECIMALS,
                  )})`)
          toInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(quoteValue.toTokenAmount, pickedToken.decimals),
              WIDO_EXTEND_DECIMALS,
            ) +
              (quoteValue.toTokenUsdPrice === null
                ? ''
                : ` ($${formatNumberWido(
                    fromWei(
                      quoteValue.toTokenAmount * quoteValue.toTokenUsdPrice,
                      pickedToken.decimals,
                    ),
                    WIDO_BALANCES_DECIMALS,
                  )})`)
        }
        setFromInfo(fromInfoTemp)
        setToInfo(toInfoTemp)
      } catch (e) {
        toast.error('Failed to get quote!')
      }
    }

    getQuoteResult()
  }, [pickedToken, token, quoteValue, pricePerFullShare, unstakeBalance, useIFARM])

  const approveZap = async amnt => {
    const { data, to } = await approve({
      chainId,
      fromToken,
      toToken: pickedToken.address,
      amount: amnt,
    })
    if (isSafeApp()) {
      const safeWeb = await safeWeb3()
      await safeWeb.eth.sendTransaction({
        from: account,
        data,
        to,
      })
    } else {
      await mainWeb3.eth.sendTransaction({
        from: account,
        data,
        to,
      })
    }
  }

  const onClickApprove = async () => {
    if (approveValue === 2) {
      toast.error('You already approved!')
      return
    }
    setApproveValue(1)
    if (pickedToken === undefined) {
      toast.error('Please select other token!')
      return
    }
    try {
      const { spender, allowance } = await getTokenAllowance({
        chainId,
        fromToken,
        toToken: pickedToken.address,
        accountAddress: account, // User
      })

      console.debug('Allowance Spender: ', spender)

      if (!new BigNumber(allowance).gte(unstakeBalance)) {
        const amountToApprove = maxUint256()
        await approveZap(amountToApprove) // Approve for Zap
      }
      setApproveValue(2)
    } catch (err) {
      toast.error('Failed to approve!')
      setApproveValue(0)
    }
  }

  const [executeValue, setExecuteValue] = React.useState(0)
  const onClickExecute = async () => {
    if (approveValue !== 2) {
      toast.error('Please approve first!')
      return
    }
    setExecuteValue(1)
    const user = account
    const amount = unstakeBalance
    try {
      if (pickedToken.default) {
        await handleWithdraw(
          account,
          useIFARM ? IFARM_TOKEN_SYMBOL : tokenSymbol,
          amountsToExecuteInWei[0],
          vaultsData,
          setPendingAction,
          multipleAssets,
          selectedAsset,
          async () => {
            setAmountsToExecute(['', ''])
            const updatedStats = await fetchUserPoolStats([fAssetPool], account, userStats)
            await getWalletBalances(walletBalancesToCheck)
            await getFarmingBalances([tokenSymbol], farmingBalances, updatedStats)
            setExecuteValue(2)
          },
          async () => {
            setExecuteValue(0)
          },
        )
      } else {
        const fromChainId = chainId
        const toChainId = chainId
        const toToken = pickedToken.address
        let safeWeb
        if (isSafeApp()) {
          safeWeb = await safeWeb3()
        }
        const quoteResult = await quote(
          {
            fromChainId, // Chain Id of from token
            fromToken, // Token address of from token
            toChainId, // Chain Id of to token
            toToken, // Token address of to token
            amount, // Token amount of from token
            slippagePercentage, // Acceptable max slippage for the swap
            user, // Address of user placing the order.
          },
          isSafeApp() ? safeWeb.currentProvider : mainWeb3.currentProvider,
        )

        if (isSafeApp()) {
          await safeWeb.eth.sendTransaction({
            from: quoteResult.from,
            data: quoteResult.data,
            to: quoteResult.to,
            value: quoteResult.value,
          })
        } else {
          await mainWeb3.eth.sendTransaction({
            from: quoteResult.from,
            data: quoteResult.data,
            to: quoteResult.to,
            value: quoteResult.value,
          })
        }
        await fetchUserPoolStats([fAssetPool], account, userStats)
        setExecuteValue(2)
      }
    } catch (err) {
      toast.error('Failed to execute!')
      setExecuteValue(0)
    }
  }

  const initState = () => {
    setExecuteValue(0)
    setApproveValue(0)
  }

  const onClickClose = () => {
    initState()
    setClickedTokenId(-1)
    setPickedToken({ symbol: 'Destination token' })
    setFinalStep(false)
    setWithdrawWido(false)
    setSelectTokenWith(false)
    setUnstakeBalance('0')
  }

  const { borderColor, backColor, filterColor } = useThemeContext()

  return (
    <SelectTokenWido show={finalStep} backColor={backColor} borderColor={borderColor}>
      <NewLabel
        display="flex"
        justifyContent="space-between"
        marginBottom="15px"
        weight="500"
        size="14px"
        height="18px"
        color="#1F2937"
        align="center"
      >
        <CloseBtn
          src={BackIcon}
          width={18}
          height={18}
          alt=""
          onClick={() => {
            initState()
            setFinalStep(false)
          }}
          filterColor={filterColor}
        />
        Final Step
        <CloseBtn src={SettingIcon} width={18} height={18} alt="" onClick={() => {}} />
      </NewLabel>

      <NewLabel marginBottom="20px">
        <WidoSwapToken
          img={Swap1WithIcon}
          name={fromInfo}
          value={useIFARM ? symbol : `f${tokenSymbol}`}
        />
        <NewLabel display="flex" justifyContent="center" marginBottom="10px">
          <IconArrowDown
            filterColor={filterColor}
            src={ArrowDownIcon}
            width={25}
            height={25}
            alt=""
          />
        </NewLabel>
        <WidoSwapToken img={pickedToken.logoURI} name={toInfo} value={pickedToken.symbol} />
      </NewLabel>

      <NewLabel size="16px" height="21px" weight={600}>
        {pickedToken.default && !useIFARM ? null : (
          <Buttons
            show={approveValue}
            onClick={() => {
              onClickApprove()
            }}
          >
            {approveValue === 2 ? (
              <>
                {useIFARM ? symbol : tokenSymbol} withdrawal approved
                <img src={CheckIcon} alt="" />
              </>
            ) : (
              <>
                Approve {useIFARM ? symbol : tokenSymbol} withdrawal
                {approveValue === 1 ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <img src={ChevronRightIcon} alt="" />
                )}
              </>
            )}
          </Buttons>
        )}
        <ExecuteButton
          approve={approveValue}
          execute={executeValue}
          onClick={() => {
            onClickExecute()
          }}
        >
          {executeValue === 1 ? (
            <>
              Withdraw
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            </>
          ) : (
            <>
              {executeValue === 0 ? 'Withdraw' : 'Withdraw Complete!'}
              <img src={WithdrawIcon} alt="" />
            </>
          )}
        </ExecuteButton>

        <CloseButton
          show={executeValue}
          onClick={() => {
            onClickClose()
          }}
        >
          <span>Close this Pop-up</span>
        </CloseButton>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoWithdrawFinalStep
