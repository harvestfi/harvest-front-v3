import React, { useState, useEffect } from 'react'
import { quote, getTokenAllowance, approve } from 'wido'
import { get, isEmpty } from 'lodash'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { toWei, fromWei, maxUint256, getWeb3 } from '../../../services/web3'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { usePools } from '../../../providers/Pools'
import { formatNumberWido } from '../../../utils'
import { WIDO_BALANCES_DECIMALS, WIDO_EXTENDED_DECIMALS } from '../../../constants'
import {
  SelectTokenWido,
  CloseBtn,
  NewLabel,
  Buttons,
  CloseButton,
  ExecuteButton,
  IconArrowDown,
} from './style'
import WidoSwapToken from '../WidoSwapToken'
import BackIcon from '../../../assets/images/logos/wido/back.svg'
import Swap2Icon from '../../../assets/images/logos/wido/swap2.svg'
import ArrowDownIcon from '../../../assets/images/logos/wido/arrowdown.svg'
import CheckIcon from '../../../assets/images/logos/wido/check-approve.svg'
import ChevronRightIcon from '../../../assets/images/logos/wido/chevron-right.svg'
import DepositIcon from '../../../assets/images/logos/wido/deposit-icon.svg'
import IFARMIcon from '../../../assets/images/logos/wido/ifarm.svg'
import { useActions } from '../../../providers/Actions'
import { useContracts } from '../../../providers/Contracts'
import { useVaults } from '../../../providers/Vault'

const { tokens } = require('../../../data')

const WidoDepositFinalStep = ({
  finalStep,
  setFinalStep,
  setDepositWido,
  setSelectTokenWido,
  inputAmount,
  setInputAmount,
  setUsdValue,
  setBalance,
  setClickedTokenId,
  pickedToken,
  setPickedToken,
  slippagePercentage,
  token,
  useIFARM,
  symbol,
  tokenSymbol,
  quoteValue,
  fAssetPool,
  setPendingAction,
  multipleAssets,
}) => {
  const [approveValue, setApproveValue] = useState(0)
  const { account, web3, getWalletBalances, approvedBalances } = useWallet()
  const { fetchUserPoolStats, userStats } = usePools()
  const { vaultsData, farmingBalances, getFarmingBalances } = useVaults()
  const { handleDeposit, handleApproval } = useActions()
  const { contracts } = useContracts()
  const toToken = token.vaultAddress || token.tokenAddress
  const chainId = token.chain || token.data.chain

  const [amount, setAmount] = useState('0')
  const [symbolName, setSymbolName] = useState('')

  const [fromInfo, setFromInfo] = useState('')
  const [toInfo, setToInfo] = useState('')

  const zap = !token.disableAutoSwap

  const isSpecialVault = token.liquidityPoolVault || token.poolVault
  let tokenDecimals
  if (isSpecialVault) {
    tokenDecimals = 18
  } else {
    tokenDecimals = token.decimals || tokens[symbol].decimals
  }

  const pricePerFullShare = get(token, `pricePerFullShare`, 0)

  const [amountsToExecute, setAmountsToExecute] = useState([])

  const amountsToExecuteInWei = amountsToExecute.map(amt => {
    if (isEmpty(amt)) {
      return null
    }

    if (multipleAssets) {
      return toWei(amt, token.decimals, 0)
    }
    return toWei(amt, isSpecialVault ? tokenDecimals : token.decimals)
  })

  const walletBalancesToCheck = multipleAssets || [tokenSymbol]

  const [checkFlag, setCheckFlag] = useState(false)

  useEffect(() => {
    setAmount(toWei(inputAmount, pickedToken.decimals))
    setAmountsToExecute([inputAmount.toString()])
    if (
      account &&
      pickedToken.address !== undefined &&
      !new BigNumber(amount).isEqualTo(0) &&
      finalStep &&
      !checkFlag
    ) {
      const tokenAllowance = async () => {
        let allowanceCheck
        if (pickedToken.default) {
          allowanceCheck = approvedBalances[tokenSymbol]
        } else {
          const { allowance } = await getTokenAllowance({
            chainId,
            fromToken: pickedToken.address,
            toToken,
            accountAddress: account, // User
          })
          allowanceCheck = allowance
        }
        if (!new BigNumber(allowanceCheck).gte(amount)) {
          setApproveValue(0)
        } else {
          setApproveValue(2)
        }
      }
      tokenAllowance()
    }

    if (pickedToken.address) {
      setSymbolName(pickedToken.symbol)
    }
  }, [
    pickedToken,
    inputAmount,
    account,
    chainId,
    amount,
    toToken,
    finalStep,
    approvedBalances,
    tokenSymbol,
    checkFlag,
  ])

  useEffect(() => {
    const getQuoteResult = async () => {
      try {
        let fromInfoTemp = '',
          toInfoTemp = ''
        if (pickedToken.default) {
          fromInfoTemp = `${formatNumberWido(inputAmount, WIDO_EXTEND_DECIMALS)} ($${
            pickedToken.usdPrice !== '0.0'
              ? formatNumberWido(
                  new BigNumber(amount)
                    .multipliedBy(pickedToken.usdPrice)
                    .dividedBy(new BigNumber(10).exponentiatedBy(pickedToken.decimals)),
                  WIDO_BALANCES_DECIMALS,
                )
              : ''
          })`
          toInfoTemp = `${formatNumberWido(
            new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
            WIDO_EXTEND_DECIMALS,
          )} ($${
            pickedToken.usdPrice !== '0.0'
              ? formatNumberWido(
                  new BigNumber(amount)
                    .multipliedBy(pickedToken.usdPrice)
                    .dividedBy(new BigNumber(10).exponentiatedBy(pickedToken.decimals)),
                  WIDO_BALANCES_DECIMALS,
                )
              : ''
          })`
        } else {
          fromInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(quoteValue.fromTokenAmount, pickedToken.decimals),
              WIDO_EXTEND_DECIMALS,
            ) +
              (quoteValue.fromTokenAmountUsdValue === null
                ? ''
                : ` ($${formatNumberWido(
                    quoteValue.fromTokenAmountUsdValue,
                    WIDO_BALANCES_DECIMALS,
                  )})`)
          toInfoTemp =
            quoteValue &&
            formatNumberWido(
              fromWei(quoteValue.toTokenAmount, token.decimals || token.data.lpTokenData.decimals),
              WIDO_EXTEND_DECIMALS,
            ) +
              (quoteValue.toTokenAmountUsdValue === null
                ? ''
                : ` ($${formatNumberWido(
                    quoteValue.toTokenAmountUsdValue,
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
  }, [pickedToken, token, quoteValue, inputAmount, amount, pricePerFullShare])

  const approveZap = async amnt => {
    if (pickedToken.default) {
      await handleApproval(
        account,
        contracts,
        tokenSymbol,
        null,
        null,
        setPendingAction,
        async () => {
          setCheckFlag(true)
          await fetchUserPoolStats([fAssetPool], account, userStats)
          await getWalletBalances([tokenSymbol], false, true)
          setApproveValue(2)
        },
        async () => {
          setApproveValue(0)
        },
      )
    } else {
      const { data, to } = await approve({
        chainId,
        fromToken: pickedToken.address,
        toToken,
        amount: amnt,
      })
      const mainWeb = await getWeb3(chainId, account, web3)
      await mainWeb.eth.sendTransaction({
        from: account,
        data,
        to,
      })
      setApproveValue(2)
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
      let allowanceCheck
      if (pickedToken.default) {
        allowanceCheck = approvedBalances[tokenSymbol]
      } else {
        const { allowance } = await getTokenAllowance({
          chainId,
          fromToken: pickedToken.address,
          toToken,
          accountAddress: account, // User
        })
        allowanceCheck = allowance
      }

      if (!new BigNumber(allowanceCheck).gte(amount)) {
        const amountToApprove = maxUint256()
        await approveZap(amountToApprove) // Approve for Zap
      }
    } catch (err) {
      toast.error('Failed to approve!')
      setApproveValue(0)
    }
  }

  const [executeValue, setExecuteValue] = useState(0)
  const onClickExecute = async () => {
    if (approveValue !== 2) {
      toast.error('Please approve first!')
      return
    }
    setExecuteValue(1)
    if (pickedToken.default) {
      try {
        await handleDeposit(
          token,
          account,
          tokenSymbol,
          amountsToExecuteInWei,
          approvedBalances[tokenSymbol],
          contracts,
          vaultsData[tokenSymbol],
          setPendingAction,
          false,
          fAssetPool,
          multipleAssets,
          zap,
          async () => {
            setCheckFlag(true)
            await getWalletBalances(walletBalancesToCheck)
            const updatedStats = await fetchUserPoolStats([fAssetPool], account, userStats)
            await getFarmingBalances([tokenSymbol], farmingBalances, updatedStats)
            setAmountsToExecute(['', ''])
            await fetchUserPoolStats([fAssetPool], account, userStats)
            setExecuteValue(2)
          },
          async () => {
            setCheckFlag(true)
            await getWalletBalances(walletBalancesToCheck, false, true)
          },
          async () => {
            setExecuteValue(0)
          },
        )
      } catch (err) {
        toast.error('Failed to deposit: ', err)
        setExecuteValue(0)
      }
    } else {
      const user = account
      try {
        const fromChainId = chainId
        const fromToken = pickedToken.address
        const toChainId = chainId
        const mainWeb = await getWeb3(chainId, account, web3)
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
          mainWeb.currentProvider,
        )

        await mainWeb.eth.sendTransaction({
          from: quoteResult.from,
          data: quoteResult.data,
          to: quoteResult.to,
          value: quoteResult.value,
        })

        await fetchUserPoolStats([fAssetPool], account, userStats)
        setExecuteValue(2)
      } catch (err) {
        toast.error('Failed to execute: ', err)
        setExecuteValue(0)
      }
    }
  }

  const initState = () => {
    setExecuteValue(0)
    setApproveValue(0)
  }

  const onClickClose = () => {
    setCheckFlag(false)
    initState()
    setBalance(0)
    setUsdValue(0)
    setInputAmount(0)
    setClickedTokenId(-1)
    setPickedToken({ symbol: 'Select Token' })
    setFinalStep(false)
    setDepositWido(false)
    setSelectTokenWido(false)
  }

  const { borderColor, backColor, filterColor } = useThemeContext()

  return (
    <SelectTokenWido show={finalStep} backColor={backColor} borderColor={borderColor}>
      <NewLabel display="flex" justifyContent="space-between" marginBottom="20px">
        <CloseBtn
          src={BackIcon}
          alt=""
          onClick={() => {
            setCheckFlag(false)
            initState()
            setFinalStep(false)
          }}
          filterColor={filterColor}
        />
        <NewLabel display="flex" weight="700" size="16px" height="21px">
          Final Step
        </NewLabel>
        <div />
      </NewLabel>

      <NewLabel marginBottom="20px">
        <WidoSwapToken img={pickedToken.logoURI} name={fromInfo} value={pickedToken.symbol} />
        <NewLabel display="flex" justifyContent="center" marginTop="15px" marginBottom="15px">
          <IconArrowDown
            filterColor={filterColor}
            src={ArrowDownIcon}
            width={25}
            height={25}
            alt=""
          />
        </NewLabel>
        <WidoSwapToken
          img={useIFARM ? IFARMIcon : Swap2Icon}
          name={toInfo}
          value={useIFARM ? symbol : `f${tokenSymbol}`}
        />
      </NewLabel>

      <NewLabel size="16px" height="21px" weight={500}>
        <Buttons
          show={approveValue}
          disabled={approveValue === 2}
          onClick={() => {
            onClickApprove()
          }}
        >
          {approveValue === 2 ? (
            <>
              {symbolName} deposits are approved
              <img src={CheckIcon} alt="" />
            </>
          ) : (
            <>
              Approve {symbolName} deposits
              {approveValue === 1 ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <img src={ChevronRightIcon} alt="" />
              )}
            </>
          )}
        </Buttons>
        <ExecuteButton
          approve={approveValue}
          execute={executeValue}
          onClick={() => {
            onClickExecute()
          }}
        >
          {executeValue === 1 ? (
            <>
              Deposit
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            </>
          ) : executeValue === 2 ? (
            <>
              Conversion Complete
              <img src={CheckIcon} alt="" />
            </>
          ) : (
            <>
              Deposit
              <img src={DepositIcon} alt="" />
            </>
          )}
        </ExecuteButton>

        <CloseButton
          show={executeValue}
          onClick={() => {
            onClickClose()
          }}
        >
          Go back to finalize deposit
        </CloseButton>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WidoDepositFinalStep
