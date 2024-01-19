import BigNumber from 'bignumber.js'
import { isEmpty, get } from 'lodash'
import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useMediaQuery } from 'react-responsive'
// import { quote, getTokenAllowance, approve } from 'wido'
import ReactTooltip from 'react-tooltip'
import { Spinner } from 'react-bootstrap'
import { BsArrowDown } from 'react-icons/bs'
import HelpIcon from '../../../../assets/images/logos/beginners/help-circle.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import AlertIcon from '../../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../../assets/images/logos/beginners/alert-close.svg'
import ProgressOne from '../../../../assets/images/logos/advancedfarm/progress-step1.png'
import ProgressTwo from '../../../../assets/images/logos/advancedfarm/progress-step2.png'
import ProgressThree from '../../../../assets/images/logos/advancedfarm/progress-step3.png'
import ProgressFour from '../../../../assets/images/logos/advancedfarm/progress-step4.png'
import ProgressFive from '../../../../assets/images/logos/advancedfarm/progress-step5.png'
import { useWallet } from '../../../../providers/Wallet'
import { useActions } from '../../../../providers/Actions'
import { useContracts } from '../../../../providers/Contracts'
import { usePools } from '../../../../providers/Pools'
import { fromWei, toWei, getWeb3 } from '../../../../services/web3'
import { formatNumberWido } from '../../../../utils'
import { WIDO_EXTEND_DECIMALS } from '../../../../constants'
import AnimatedDots from '../../../AnimatedDots'
import {
  Buttons,
  FTokenInfo,
  FTokenDiv,
  IconCard,
  ImgBtn,
  NewLabel,
  SelectTokenWido,
  FTokenWrong,
  AnimateDotDiv,
} from './style'
import { useVaults } from '../../../../providers/Vault'
import { usePortals } from '../../../../providers/Portals'

const DepositStart = ({
  pickedToken,
  deposit,
  setDeposit,
  inputAmount,
  setInputAmount,
  token,
  tokenSymbol,
  useIFARM,
  fAssetPool,
  multipleAssets,
  fromInfoAmount,
  fromInfoUsdAmount,
  minReceiveAmountString,
  quoteValue,
  setQuoteValue,
  setSelectToken,
  setConvertSuccess,
}) => {
  const { account, web3, approvedBalances, getWalletBalances } = useWallet()
  const { vaultsData, getFarmingBalances, farmingBalances } = useVaults()
  const { handleDeposit, handleApproval } = useActions()
  const { contracts } = useContracts()
  const { fetchUserPoolStats, userStats } = usePools()
  const { getPortalsApproval, portalsApprove, getPortals } = usePortals()

  const slippagePercentage = 2.5 // Default slippage Percent
  const chainId = token.chain || token.data.chain

  const amount = toWei(inputAmount, pickedToken.decimals)

  const [amountsToExecute, setAmountsToExecute] = useState([])
  const [progressStep, setProgressStep] = useState(0)

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

  const toToken = token.vaultAddress || token.tokenAddress
  const pricePerFullShare = get(token, `pricePerFullShare`, 0)

  const [startSpinner, setStartSpinner] = useState(false) // State of Spinner for 'Finalize Deposit' button

  const [depositFailed, setDepositFailed] = useState(false)
  const [, setPendingAction] = useState(null)

  const [buttonName, setButtonName] = useState('Approve Token')
  const [receiveAmount, setReceiveAmount] = useState('')

  useEffect(() => {
    const receiveString = pickedToken.default
      ? formatNumberWido(
          new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
          WIDO_EXTEND_DECIMALS,
        )
      : quoteValue
      ? formatNumberWido(
          fromWei(quoteValue.toTokenAmount, token.decimals || token.data.lpTokenData.decimals),
          WIDO_EXTEND_DECIMALS,
        )
      : ''
    setReceiveAmount(receiveString)
  }, [amount, pickedToken, pricePerFullShare, quoteValue, token])

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
      const mainWeb = await getWeb3(chainId, account, web3)

      const portalData = await getPortals({
        chainId,
        sender: account,
        tokenIn: pickedToken.address,
        inputAmount: amount,
        tokenOut: toToken,
        slippage: slippagePercentage,
      })

      await mainWeb.eth.sendTransaction({
        from: portalData.tx.from,
        data: portalData.tx.data,
        to: portalData.tx.to,
        value: portalData.tx.value,
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
      const { approve } = await portalsApprove(
        chainId,
        account,
        pickedToken.address,
        amnt.toString(),
      )
      const mainWeb = await getWeb3(chainId, account, web3)
      await mainWeb.eth.sendTransaction({
        from: account,
        data: approve.data,
        to: approve.to,
      })
    }
  }

  const startDeposit = async () => {
    if (progressStep === 0) {
      setStartSpinner(true)
      setProgressStep(1)
      setButtonName('Pending Approval in Wallet')
      try {
        let allowanceCheck
        if (pickedToken.default) {
          allowanceCheck = approvedBalances[tokenSymbol]
        } else if (pickedToken.address === '0x0000000000000000000000000000000000000000') {
          // native token
          allowanceCheck = amountsToExecute
        } else {
          const approval = await getPortalsApproval(chainId, account, pickedToken.address)

          allowanceCheck = approval ? approval.allowance : 0
        }

        if (!new BigNumber(allowanceCheck).gte(amount)) {
          const amountToApprove = amount
          await approveZap(amountToApprove) // Approve for Zap
        }
        setProgressStep(2)
        setButtonName('Confirm Transaction')
        setStartSpinner(false)
      } catch (err) {
        setStartSpinner(false)
        setDepositFailed(true)
        setProgressStep(0)
        setButtonName('Approve Token')
      }
    } else if (progressStep === 2) {
      try {
        setProgressStep(3)
        setButtonName('Pending Confirmation in Wallet')
        setStartSpinner(true)
        await onDeposit()
      } catch (err) {
        setDepositFailed(true)
        setStartSpinner(false)
        setProgressStep(0)
        setButtonName('Approve Token')
        return
      }
      // End Approve and Deposit successfully
      setStartSpinner(false)
      setDepositFailed(false)
      setProgressStep(4)
      setButtonName('Success! Close this window.')
    } else if (progressStep === 4) {
      setQuoteValue(null)
      setSelectToken(false)
      setDeposit(false)
      setProgressStep(0)
      setInputAmount(0)
      setConvertSuccess(true)
    }
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  return (
    <Modal
      show={deposit}
      // onHide={onClose}
      dialogClassName="modal-notification"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="deposit-modal-header">
        <FTokenInfo>
          <FTokenDiv>
            <NewLabel margin="auto 0px">
              <IconCard>
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel textAlign="left" marginRight="12px">
              <NewLabel
                color="#15B088"
                size={isMobile ? '18px' : '18px'}
                height={isMobile ? '28px' : '28px'}
                weight="600"
                marginBottom="4px"
              >
                Summary
              </NewLabel>
              <NewLabel
                color="#15202B"
                size={isMobile ? '14px' : '14px'}
                height={isMobile ? '20px' : '20px'}
                weight="400"
                marginBottom="5px"
              >
                Convert your crypto into interest-bearing fToken
              </NewLabel>
            </NewLabel>
          </FTokenDiv>
          <NewLabel>
            <NewLabel
              display="flex"
              marginBottom={isMobile ? '16px' : '16px'}
              width="fit-content"
              cursorType="pointer"
              weight="600"
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px' : '20px'}
              color="#667085"
              align="center"
              onClick={() => {
                setProgressStep(0)
                setDepositFailed(false)
                setDeposit(false)
              }}
            >
              <ImgBtn src={CloseIcon} alt="" />
            </NewLabel>
          </NewLabel>
        </FTokenInfo>
      </Modal.Header>
      <Modal.Body className="deposit-modal-body">
        <SelectTokenWido>
          <NewLabel
            size={isMobile ? '14px' : '14px'}
            height={isMobile ? '24px' : '24px'}
            padding="24px"
            color="#344054"
          >
            <NewLabel
              display="flex"
              justifyContent="space-between"
              padding={isMobile ? '10px 0' : '10px 0'}
            >
              <NewLabel weight="500">{progressStep === 4 ? 'Converted' : 'Converting'}</NewLabel>
              <NewLabel display="flex" flexFlow="column" weight="600" textAlign="right">
                <>
                  {fromInfoAmount !== '' ? fromInfoAmount : ''}
                  {(fromInfoAmount + pickedToken.symbol).length > 20 ? <br /> : ' '}{' '}
                  {pickedToken.symbol}
                </>
                <span>
                  {fromInfoUsdAmount !== '' ? <>≈ {fromInfoUsdAmount}</> : <AnimatedDots />}
                </span>
              </NewLabel>
            </NewLabel>
            <NewLabel
              display="flex"
              justifyContent="space-between"
              padding={isMobile ? '10px 0' : '10px 0'}
            >
              <NewLabel className="beginners" weight="500">
                {progressStep === 4 ? 'fTokens Received' : 'Min. fTokens Received'}
                {progressStep !== 4 && (
                  <>
                    <img className="help-icon" src={HelpIcon} alt="" data-tip data-for="min-help" />
                    <ReactTooltip
                      id="min-help"
                      backgroundColor="white"
                      borderColor="white"
                      textColor="#344054"
                      place="right"
                    >
                      <NewLabel
                        size={isMobile ? '12px' : '12px'}
                        height={isMobile ? '18px' : '18px'}
                        weight="600"
                        color="#344054"
                      >
                        {useIFARM
                          ? `You will receive no less i${tokenSymbol} than the displayed amount.`
                          : `You will receive no less f${tokenSymbol} than the displayed amount.`}
                      </NewLabel>
                    </ReactTooltip>
                  </>
                )}
              </NewLabel>
              <NewLabel weight="600" textAlign="right" display="flex" flexFlow="column">
                {progressStep === 4 ? (
                  receiveAmount !== '' ? (
                    receiveAmount
                  ) : (
                    <AnimateDotDiv>
                      <AnimatedDots />
                    </AnimateDotDiv>
                  )
                ) : minReceiveAmountString !== '' ? (
                  minReceiveAmountString
                ) : (
                  <AnimateDotDiv>
                    <AnimatedDots />
                  </AnimateDotDiv>
                )}
                <span>{useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`}</span>
              </NewLabel>
            </NewLabel>
          </NewLabel>

          <FTokenWrong isShow={depositFailed ? 'true' : 'false'}>
            <NewLabel marginRight="12px" display="flex">
              <div>
                <img src={AlertIcon} alt="" />
              </div>
              <NewLabel marginLeft="12px">
                <NewLabel
                  color="#B54708"
                  size={isMobile ? '14px' : '14px'}
                  height={isMobile ? '20px' : '20px'}
                  weight="600"
                  marginBottom="4px"
                >
                  Whoops, something went wrong.
                </NewLabel>
                <NewLabel
                  color="#B54708"
                  size={isMobile ? '14px' : '14px'}
                  height={isMobile ? '20px' : '20px'}
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
          <NewLabel>
            <img
              className="progressbar-img"
              src={
                progressStep === 0
                  ? ProgressOne
                  : progressStep === 1
                  ? ProgressTwo
                  : progressStep === 2
                  ? ProgressThree
                  : progressStep === 3
                  ? ProgressFour
                  : ProgressFive
              }
              alt="progress bar"
            />
          </NewLabel>
          <NewLabel
            size={isMobile ? '16px' : '16px'}
            height={isMobile ? '24px' : '24px'}
            weight={600}
            color="#1F2937"
            padding="24px"
          >
            <Buttons
              onClick={() => {
                startDeposit()
              }}
            >
              {buttonName}&nbsp;&nbsp;
              {!startSpinner ? (
                <></>
              ) : (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              )}
            </Buttons>
          </NewLabel>
        </SelectTokenWido>
      </Modal.Body>
    </Modal>
  )
}
export default DepositStart
