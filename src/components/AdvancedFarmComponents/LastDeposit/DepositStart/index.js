import BigNumber from 'bignumber.js'
import { get, isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'react-responsive'
import { quote, getTokenAllowance, approve } from 'wido'
import ReactTooltip from 'react-tooltip'
import { Spinner } from 'react-bootstrap'
import BackIcon from '../../../../assets/images/logos/beginners/arrow-left.svg'
import HelpIcon from '../../../../assets/images/logos/beginners/help-circle.svg'
import FaceSmileIcon from '../../../../assets/images/logos/beginners/face-smile.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import AlertIcon from '../../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../../assets/images/logos/beginners/alert-close.svg'
import {
  IFARM_TOKEN_SYMBOL,
  WIDO_BALANCES_DECIMALS,
  WIDO_EXTEND_DECIMALS,
  BEGINNERS_BALANCES_DECIMALS,
} from '../../../../constants'
import { useWallet } from '../../../../providers/Wallet'
import { useActions } from '../../../../providers/Actions'
import { useContracts } from '../../../../providers/Contracts'
import { usePools } from '../../../../providers/Pools'
import { fromWei, toWei, maxUint256, getWeb3 } from '../../../../services/web3'
import { formatNumberWido } from '../../../../utils'
import AnimatedDots from '../../../AnimatedDots'
import {
  Buttons,
  ImgBtn,
  NewLabel,
  SelectTokenWido,
  FTokenInfo,
  IconCard,
  GotItBtn,
  FTokenWrong,
} from './style'
import { addresses } from '../../../../data'
import { useVaults } from '../../../../providers/Vault'

const DepositStart = ({
  pickedToken,
  deposit,
  setDeposit,
  finalStep,
  setFinalStep,
  inputAmount,
  token,
  balanceList,
  tokenSymbol,
  useIFARM,
  setQuoteValue,
  fAssetPool,
  multipleAssets,
}) => {
  const { account, web3, approvedBalances, getWalletBalances } = useWallet()
  const { vaultsData, getFarmingBalances, farmingBalances } = useVaults()
  const { handleDeposit, handleApproval } = useActions()
  const { contracts } = useContracts()
  const { fetchUserPoolStats, userStats } = usePools()

  const slippagePercentage = 0.005 // Default slippage Percent
  const chainId = token.chain || token.data.chain

  const amount = toWei(inputAmount, pickedToken.decimals)
  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')
  const [minReceiveAmountString, setMinReceiveAmountString] = useState('')

  const pricePerFullShare = useIFARM
    ? get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
    : get(token, `pricePerFullShare`, 0)

  const [amountsToExecute, setAmountsToExecute] = useState([])

  const amountsToExecuteInWei = amountsToExecute.map(amt => {
    if (isEmpty(amt)) {
      return null
    }

    if (multipleAssets) {
      return toWei(amt, token.decimals, 0)
    }
    return toWei(amt, token.decimals)
  })

  const zap = !token.disableAutoSwap
  const walletBalancesToCheck = multipleAssets || [tokenSymbol]

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(amount).isEqualTo(0) &&
      deposit &&
      balanceList.length !== 0
    ) {
      const getQuoteResult = async () => {
        setFromInfoAmount('')
        setFromInfoUsdAmount('')
        setQuoteValue(null)
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = '',
            minReceiveAmount = ''
          if (pickedToken.default) {
            fromInfoValue = `${formatNumberWido(inputAmount, WIDO_EXTEND_DECIMALS)}`
            fromInfoUsdValue =
              pickedToken.usdPrice !== '0.0'
                ? formatNumberWido(
                    new BigNumber(amount)
                      .multipliedBy(pickedToken.usdPrice)
                      .dividedBy(new BigNumber(10).exponentiatedBy(pickedToken.decimals)),
                    WIDO_BALANCES_DECIMALS,
                  )
                : '0'

            minReceiveAmount = formatNumberWido(
              new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
              WIDO_EXTEND_DECIMALS,
            )
          } else {
            const fromChainId = chainId
            const fromToken = pickedToken.address
            const toToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress
            const toChainId = chainId
            const user = account
            const mainWeb = await getWeb3(chainId, account, web3)
            let curToken = balanceList.filter(itoken => itoken.symbol === pickedToken.symbol)

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
            setQuoteValue(quoteResult)
            curToken = curToken[0]
            fromInfoValue = formatNumberWido(
              fromWei(quoteResult.fromTokenAmount, curToken.decimals),
              WIDO_EXTEND_DECIMALS,
            )
            fromInfoUsdValue =
              quoteResult.fromTokenAmount === null
                ? '0'
                : formatNumberWido(
                    fromWei(quoteResult.fromTokenAmount, curToken.decimals) *
                      quoteResult.fromTokenUsdPrice,
                    BEGINNERS_BALANCES_DECIMALS,
                  )
            minReceiveAmount = formatNumberWido(
              fromWei(
                quoteResult.minToTokenAmount,
                token.decimals || token.data.lpTokenData.decimals,
              ),
              WIDO_EXTEND_DECIMALS,
            )
          }
          setMinReceiveAmountString(minReceiveAmount)
          setFromInfoAmount(fromInfoValue)
          if (Number(fromInfoUsdValue) < 0.01) {
            setFromInfoUsdAmount('<$0.01')
          } else {
            setFromInfoUsdAmount(`$${fromInfoUsdValue}`)
          }
        } catch (e) {
          toast.error('Failed to get quote!')
        }
      }

      getQuoteResult()
    }
  }, [
    account,
    amount,
    chainId,
    pickedToken,
    token,
    deposit,
    balanceList,
    setQuoteValue,
    useIFARM,
    web3,
    inputAmount,
    pricePerFullShare,
  ])

  const [showDesc, setShowDesc] = useState(true)

  const toToken = token.vaultAddress || token.tokenAddress

  const [startSpinner, setStartSpinner] = useState(false) // State of Spinner for 'Finalize Deposit' button

  const [depositFailed, setDepositFailed] = useState(false)
  const [, setPendingAction] = useState(null)

  const [buttonName, setButtonName] = useState('Finalize Deposit')

  const onDeposit = async () => {
    if (pickedToken.default) {
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
          await getWalletBalances(walletBalancesToCheck)
          const updatedStats = await fetchUserPoolStats([fAssetPool], account, userStats)
          await getFarmingBalances([tokenSymbol], farmingBalances, updatedStats)
          setAmountsToExecute(['', ''])
          await fetchUserPoolStats([fAssetPool], account, userStats)
        },
        async () => {
          await getWalletBalances(walletBalancesToCheck, false, true)
        },
        async () => {},
      )
    } else {
      const user = account
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
    }
  }

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
          await fetchUserPoolStats([fAssetPool], account, userStats)
          await getWalletBalances([tokenSymbol], false, true)
        },
        async () => {},
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
    }
  }

  const startDeposit = async () => {
    setStartSpinner(true)
    setButtonName('(1/2) Approve Token Spending in Wallet')
    let stepFlag = false,
      isSuccess = false
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
      stepFlag = true // Finish approve successfully
    } catch (err) {
      setStartSpinner(false)
      setDepositFailed(true)
      setButtonName('Finalize Deposit')
      return
    }

    if (stepFlag) {
      try {
        setButtonName('(2/2) Confirm Deposit in Wallet')
        await onDeposit()
        isSuccess = true
      } catch (err) {
        setDepositFailed(true)
        setStartSpinner(false)
        setButtonName('Finalize Deposit')
        return
      }
    }
    // End Approve and Deposit successfully
    setStartSpinner(false)
    setDepositFailed(false)
    setButtonName('Finalize Deposit')
    if (isSuccess) {
      setFinalStep(true)
    }
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  return (
    <SelectTokenWido show={deposit && !finalStep}>
      <NewLabel
        display="flex"
        marginBottom={isMobile ? '0px' : '16px'}
        padding="10px 0"
        width="fit-content"
        cursorType="pointer"
        weight="600"
        size={isMobile ? '12px' : '14px'}
        height={isMobile ? '17px' : '20px'}
        color="#EDAE50"
        align="center"
        onClick={() => {
          setDeposit(false)
        }}
      >
        <ImgBtn src={BackIcon} alt="" />
        Back
      </NewLabel>

      <NewLabel
        color="#101828"
        size={isMobile ? '14px' : '16px'}
        weight="600"
        height={isMobile ? '21px' : '24px'}
        marginBottom={isMobile ? '5px' : '10px'}
      >
        Summary
      </NewLabel>

      <NewLabel
        size={isMobile ? '10px' : '14px'}
        height={isMobile ? '18px' : '24px'}
        color="#344054"
      >
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel weight="500">Depositing</NewLabel>
          <NewLabel weight="600" textAlign="right">
            {fromInfoAmount !== '' ? fromInfoAmount : <AnimatedDots />}
            {(fromInfoAmount + pickedToken.symbol).length > 20 ? <br /> : ' '} {pickedToken.symbol}
          </NewLabel>
        </NewLabel>
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel weight="500">Est. USD Value</NewLabel>
          <NewLabel weight="600" textAlign="right">
            {fromInfoUsdAmount !== '' ? fromInfoUsdAmount : <AnimatedDots />}
          </NewLabel>
        </NewLabel>
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel className="beginners" weight="500">
            Min. Received
            <img className="help-icon" src={HelpIcon} alt="" data-tip data-for="min-help" />
            <ReactTooltip
              id="min-help"
              backgroundColor="white"
              borderColor="white"
              textColor="#344054"
              place="right"
            >
              <NewLabel
                size={isMobile ? '10px' : '12px'}
                height={isMobile ? '15px' : '18px'}
                weight="600"
                color="#344054"
              >
                {useIFARM
                  ? `You will receive no less i${tokenSymbol} than the displayed amount.`
                  : `You will receive no less f${tokenSymbol} than the displayed amount.`}
              </NewLabel>
            </ReactTooltip>
          </NewLabel>
          <NewLabel weight="600" textAlign="right">
            {minReceiveAmountString !== '' ? minReceiveAmountString : <AnimatedDots />}
            {(minReceiveAmountString + tokenSymbol).length > 20 ? <br /> : ' '}{' '}
            {useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <FTokenInfo isShow={showDesc ? 'true' : 'false'}>
        <NewLabel marginRight="12px">
          <IconCard>
            <img src={FaceSmileIcon} alt="" />
          </IconCard>
        </NewLabel>
        <NewLabel marginRight="12px">
          <NewLabel
            color="#344054"
            size={isMobile ? '12px' : '14px'}
            height={isMobile ? '17px' : '20px'}
            weight="600"
            marginBottom="4px"
          >
            What is {useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`}?
          </NewLabel>
          <NewLabel
            color="#475467"
            size={isMobile ? '12px' : '14px'}
            height={isMobile ? '17px' : '20px'}
            weight="400"
            marginBottom="5px"
          >
            It is a proof-of-deposit token, which entitles you to deposit and any accrued yield.
          </NewLabel>
          <GotItBtn
            onClick={() => {
              setShowDesc(false)
            }}
          >
            Got it
          </GotItBtn>
        </NewLabel>
        <NewLabel>
          <ImgBtn
            src={CloseIcon}
            alt=""
            onClick={() => {
              setShowDesc(false)
            }}
          />
        </NewLabel>
      </FTokenInfo>

      <FTokenWrong isShow={depositFailed ? 'true' : 'false'}>
        <NewLabel marginRight="12px" display="flex">
          <div>
            <img src={AlertIcon} alt="" />
          </div>
          <NewLabel marginLeft="12px">
            <NewLabel
              color="#B54708"
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '17px' : '20px'}
              weight="600"
              marginBottom="4px"
            >
              Whoops, something went wrong.
            </NewLabel>
            <NewLabel
              color="#B54708"
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '17px' : '20px'}
              weight="400"
              marginBottom="5px"
            >
              Please try to repeat the transaction in your wallet.
            </NewLabel>
          </NewLabel>
        </NewLabel>
        <NewLabel>
          <ImgBtn
            src={AlertCloseIcon}
            alt=""
            onClick={() => {
              setDepositFailed(false)
            }}
          />
        </NewLabel>
      </FTokenWrong>

      <NewLabel
        size={isMobile ? '12px' : '16px'}
        height={isMobile ? '21px' : '24px'}
        weight={600}
        color="#1F2937"
        marginTop="25px"
      >
        <Buttons
          onClick={() => {
            startDeposit()
          }}
        >
          {buttonName}&nbsp;
          {!startSpinner ? (
            <></>
          ) : (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          )}
        </Buttons>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default DepositStart
