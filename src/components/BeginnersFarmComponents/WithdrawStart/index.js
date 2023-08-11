import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { get, isEmpty } from 'lodash'
import { getTokenAllowance, approve } from 'wido'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import { Spinner } from 'react-bootstrap'
import BackIcon from '../../../assets/images/logos/beginners/arrow-left.svg'
import HelpIcon from '../../../assets/images/logos/beginners/help-circle.svg'
import AlertIcon from '../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../assets/images/logos/beginners/alert-close.svg'
import { WIDO_BALANCES_DECIMALS, WIDO_EXTEND_DECIMALS } from '../../../constants'
import { useWallet } from '../../../providers/Wallet'
import { useActions } from '../../../providers/Actions'
import { fromWei, maxUint256, getWeb3 } from '../../../services/web3'
import { formatNumberWido } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { Buttons, ImgBtn, NewLabel, SelectTokenWido, FTokenWrong } from './style'
import { usePools } from '../../../providers/Pools'
import { useVaults } from '../../../providers/Vault'

const WithdrawStart = ({
  withdrawStart,
  setWithdrawStart,
  pickedToken,
  finalStep,
  // setFinalStep,
  token,
  unstakeBalance,
  balanceList,
  tokenSymbol,
  fAssetPool,
  multipleAssets,
}) => {
  const { account, web3, getWalletBalances } = useWallet()
  const { handleWithdraw } = useActions()
  const { fetchUserPoolStats, userStats } = usePools()
  const { vaultsData, getFarmingBalances, farmingBalances } = useVaults()

  const [, setPendingAction] = useState(null)

  const pricePerFullShare = get(token, `pricePerFullShare`, 0)

  const walletBalancesToCheck = multipleAssets || [tokenSymbol]
  const selectedAsset = !token.isSingleAssetWithdrawalAllowed ? -1 : 0

  const [amountsToExecute, setAmountsToExecute] = useState([])

  const amountsToExecuteInWei = amountsToExecute.map(amt => {
    if (isEmpty(amt)) {
      return null
    }

    return amt
  })

  const [fromInfoAmount, setFromInfoAmount] = useState('')
  const [fromInfoUsdAmount, setFromInfoUsdAmount] = useState('')

  useEffect(() => {
    if (
      account &&
      pickedToken.symbol !== 'Select Token' &&
      !new BigNumber(unstakeBalance).isEqualTo(0) &&
      withdrawStart
    ) {
      setAmountsToExecute([unstakeBalance.toString()])
      const getQuoteResult = async () => {
        setFromInfoAmount('')
        const amount = unstakeBalance
        try {
          let fromInfoValue = '',
            fromInfoUsdValue = ''
          fromInfoValue = `${formatNumberWido(
            fromWei(amount, pickedToken.decimals),
            WIDO_EXTEND_DECIMALS,
          )}`
          fromInfoUsdValue = formatNumberWido(
            new BigNumber(fromWei(amount, pickedToken.decimals))
              .multipliedBy(fromWei(pricePerFullShare, pickedToken.decimals))
              .multipliedBy(token.usdPrice),
            WIDO_BALANCES_DECIMALS,
          )
          setFromInfoAmount(fromInfoValue)
          setFromInfoUsdAmount(fromInfoUsdValue)
        } catch (e) {
          toast.error('Failed to get quote!')
        }
      }
      getQuoteResult()
    }
  }, [
    account,
    pickedToken,
    unstakeBalance,
    withdrawStart,
    balanceList,
    token,
    pricePerFullShare,
    web3,
  ])

  const [withdrawFailed, setWithdrawFailed] = useState(false)
  const [startSpinner, setStartSpinner] = useState(false) // State of Spinner for 'Finalize Deposit' button

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const chainId = token.chain || token.data.chain
  const fromToken = token.vaultAddress || token.tokenAddress

  const approveZap = async amnt => {
    const { data, to } = await approve({
      chainId,
      fromToken,
      toToken: pickedToken.address,
      amount: amnt,
    })
    const mainWeb = await getWeb3(chainId, account, web3)

    await mainWeb.eth.sendTransaction({
      from: account,
      data,
      to,
    })
  }

  const startWithdraw = async () => {
    setStartSpinner(true)
    let approveSuccessed = false
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
      approveSuccessed = true
    } catch (err) {
      setStartSpinner(false)
      setWithdrawFailed(true)
      return
    }

    if (approveSuccessed) {
      try {
        await handleWithdraw(
          account,
          tokenSymbol,
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
            setWithdrawFailed(false)
            setStartSpinner(false)
            // setFinalStep(true)
          },
          async () => {
            setWithdrawFailed(true)
            setStartSpinner(false)
          },
        )
      } catch (err) {
        setWithdrawFailed(true)
        setStartSpinner(false)
      }
    }
  }
  return (
    <SelectTokenWido show={withdrawStart && !finalStep}>
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
          setWithdrawStart(false)
        }}
      >
        <ImgBtn src={BackIcon} alt="" />
        Back
      </NewLabel>

      <NewLabel
        color="#101828"
        size={isMobile ? '16px' : '18px'}
        weight="600"
        height={isMobile ? '24px' : '28px'}
        marginBottom={isMobile ? '5px' : '10px'}
      >
        Summary
      </NewLabel>

      <NewLabel
        size={isMobile ? '12px' : '14px'}
        height={isMobile ? '21px' : '24px'}
        color="#344054"
      >
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel weight="500">Withdrawing</NewLabel>
          <NewLabel weight="600">
            {fromInfoAmount !== '' ? fromInfoAmount : <AnimatedDots />}&nbsp;{`f${tokenSymbol}`}
          </NewLabel>
        </NewLabel>
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel className="beginners" weight="500" items="center" display="flex">
            Est. USD Value
            <img className="help-icon" src={HelpIcon} alt="" data-tip data-for="est-help" />
            <ReactTooltip
              id="est-help"
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
                Combined value of deposit and accrued yield.
              </NewLabel>
            </ReactTooltip>
          </NewLabel>
          <NewLabel weight="600">
            ${fromInfoUsdAmount !== '' ? fromInfoUsdAmount : <AnimatedDots />}
          </NewLabel>
        </NewLabel>
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel className="beginners" weight="500" items="center" display="flex">
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
                You will receive no less {tokenSymbol} than the displayed amount.
              </NewLabel>
            </ReactTooltip>
          </NewLabel>
          <NewLabel weight="600">
            {formatNumberWido(
              new BigNumber(fromWei(unstakeBalance, pickedToken.decimals)).multipliedBy(
                fromWei(pricePerFullShare, pickedToken.decimals),
              ),
              WIDO_EXTEND_DECIMALS,
            )}
            {tokenSymbol}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <FTokenWrong isShow={withdrawFailed ? 'true' : 'false'}>
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
              setWithdrawFailed(false)
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
            startWithdraw()
          }}
        >
          {!startSpinner ? (
            'Finalize Withdraw'
          ) : (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          )}
        </Buttons>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WithdrawStart
