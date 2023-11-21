import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { isEmpty } from 'lodash'
import { getTokenAllowance, approve, quote } from 'wido'
import { useMediaQuery } from 'react-responsive'
import { BsArrowUp } from 'react-icons/bs'
import ReactTooltip from 'react-tooltip'
import { Spinner } from 'react-bootstrap'
import HelpIcon from '../../../../assets/images/logos/beginners/help-circle.svg'
import AlertIcon from '../../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../../assets/images/logos/beginners/alert-close.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ProgressOne from '../../../../assets/images/logos/advancedfarm/progress-step1.png'
import ProgressTwo from '../../../../assets/images/logos/advancedfarm/progress-step2.png'
import ProgressThree from '../../../../assets/images/logos/advancedfarm/progress-step3.png'
import ProgressFour from '../../../../assets/images/logos/advancedfarm/progress-step4.png'
import ProgressFive from '../../../../assets/images/logos/advancedfarm/progress-step5.png'
import { useWallet } from '../../../../providers/Wallet'
import { useActions } from '../../../../providers/Actions'
import { usePools } from '../../../../providers/Pools'
import { useVaults } from '../../../../providers/Vault'
import { maxUint256, getWeb3 } from '../../../../services/web3'
import AnimatedDots from '../../../AnimatedDots'
import { addresses } from '../../../../data'
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

const WithdrawStart = ({
  withdrawStart,
  setWithdrawStart,
  pickedToken,
  setPickedToken,
  token,
  unstakeBalance,
  tokenSymbol,
  fAssetPool,
  multipleAssets,
  useIFARM,
  // depositedValueUSD,
  revertFromInfoAmount,
  revertFromInfoUsdAmount,
  revertMinReceivedAmount,
  revertedAmount,
  setUnstakeInputValue,
}) => {
  const { account, web3, getWalletBalances } = useWallet()
  const { handleWithdraw } = useActions()
  const { fetchUserPoolStats, userStats } = usePools()
  const { vaultsData, getFarmingBalances, farmingBalances } = useVaults()

  const [, setPendingAction] = useState(null)
  const [amountsToExecute, setAmountsToExecute] = useState([])
  const [progressStep, setProgressStep] = useState(0)
  const [buttonName, setButtonName] = useState('Approve Token')
  const [withdrawFailed, setWithdrawFailed] = useState(false)
  const [startSpinner, setStartSpinner] = useState(false) // State of Spinner for 'Finalize Deposit' button

  const slippagePercentage = 0.005 // Default slippage Percent
  const chainId = token.chain || token.data.chain
  const fromToken = useIFARM ? addresses.iFARM : token.vaultAddress || token.tokenAddress

  const walletBalancesToCheck = multipleAssets || [tokenSymbol]
  const selectedAsset = !token.isSingleAssetWithdrawalAllowed ? -1 : 0

  const amountsToExecuteInWei = amountsToExecute.map(amt => {
    if (isEmpty(amt)) {
      return null
    }

    return amt
  })

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

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
    if (progressStep === 0) {
      setStartSpinner(true)
      setProgressStep(1)
      setButtonName('Pending Approval in Wallet')
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
        setProgressStep(2)
        setButtonName('Confirm Transaction')
        setStartSpinner(false)
      } catch (err) {
        setStartSpinner(false)
        setWithdrawFailed(true)
        setProgressStep(0)
        setButtonName('Approve Token')
      }
    } else if (progressStep === 2) {
      try {
        setProgressStep(3)
        setButtonName('Pending Confirmation in Wallet')
        setStartSpinner(true)
        if (pickedToken.default) {
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
              setButtonName('Finalize Withdraw')
            },
            async () => {
              setWithdrawFailed(true)
              setStartSpinner(false)
              setButtonName('Finalize Withdraw')
            },
          )
        } else {
          const amount = unstakeBalance
          const fromChainId = chainId
          const toChainId = chainId
          const toToken = pickedToken.address
          const mainWeb = await getWeb3(chainId, account, web3)
          const quoteResult = await quote(
            {
              fromChainId, // Chain Id of from token
              fromToken, // Token address of from token
              toChainId, // Chain Id of to token
              toToken, // Token address of to token
              amount, // Token amount of from token
              slippagePercentage, // Acceptable max slippage for the swap
              user: account, // Address of user placing the order.
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
      } catch (err) {
        setWithdrawFailed(true)
        setStartSpinner(false)
        setProgressStep(0)
        setButtonName('Approve Token')
        return
      }
      // End Approve and Deposit successfully
      setStartSpinner(false)
      setWithdrawFailed(false)
      setProgressStep(4)
      setButtonName('Success! Close this window.')
    } else if (progressStep === 4) {
      // setQuoteValue(null)
      // setSelectToken(false)
      setUnstakeInputValue(0)
      setPickedToken({ symbol: 'Select' })
      setProgressStep(0)
      setWithdrawStart(false)
      setWithdrawFailed(false)
    }
  }
  return (
    <Modal
      show={withdrawStart}
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
                <BsArrowUp />
              </IconCard>
            </NewLabel>
            <NewLabel textAlign="left" marginRight="12px">
              <NewLabel
                color="#15B088"
                size={isMobile ? '12px' : '18px'}
                height={isMobile ? '17px' : '28px'}
                weight="600"
                marginBottom="4px"
              >
                Summary
              </NewLabel>
              <NewLabel
                color="#15202B"
                size={isMobile ? '12px' : '14px'}
                height={isMobile ? '17px' : '20px'}
                weight="400"
                marginBottom="5px"
              >
                Revert your fTokens into selected token
              </NewLabel>
            </NewLabel>
          </FTokenDiv>
          <NewLabel>
            <NewLabel
              display="flex"
              marginBottom={isMobile ? '0px' : '16px'}
              width="fit-content"
              cursorType="pointer"
              weight="600"
              size={isMobile ? '12px' : '14px'}
              height={isMobile ? '17px' : '20px'}
              color="#667085"
              align="center"
              onClick={() => {
                setProgressStep(0)
                setWithdrawStart(false)
                setWithdrawFailed(false)
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
            size={isMobile ? '10px' : '14px'}
            height={isMobile ? '18px' : '24px'}
            padding="15px 24px"
            color="#344054"
          >
            <NewLabel
              display="flex"
              justifyContent="space-between"
              padding={isMobile ? '5px 0' : '10px 0'}
            >
              <NewLabel weight="500">{progressStep === 4 ? 'Reverted' : 'Reverting'}</NewLabel>
              <NewLabel display="flex" flexFlow="column" weight="600" textAlign="right">
                <>
                  {revertFromInfoAmount !== '' ? (
                    revertFromInfoAmount
                  ) : (
                    <AnimateDotDiv>
                      <AnimatedDots />
                    </AnimateDotDiv>
                  )}
                </>
                <span>{useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`}</span>
              </NewLabel>
            </NewLabel>
            <NewLabel
              display="flex"
              justifyContent="space-between"
              padding={isMobile ? '5px 0' : '10px 0'}
            >
              <NewLabel
                className="beginners"
                weight="500"
                items="center"
                display="flex"
                alignSelf="flex-start"
              >
                {progressStep === 4 ? 'Received' : 'Min. Received'}
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
                        size={isMobile ? '10px' : '12px'}
                        height={isMobile ? '15px' : '18px'}
                        weight="600"
                        color="#344054"
                      >
                        You will receive no less than displayed amount into your wallet.
                      </NewLabel>
                    </ReactTooltip>
                  </>
                )}
              </NewLabel>
              <NewLabel display="flex" flexFlow="column" weight="600" textAlign="right">
                <>
                  {progressStep === 4 ? (
                    revertedAmount !== '' ? (
                      revertedAmount
                    ) : (
                      <AnimateDotDiv>
                        <AnimatedDots />
                      </AnimateDotDiv>
                    )
                  ) : revertMinReceivedAmount !== '' ? (
                    revertMinReceivedAmount
                  ) : (
                    <AnimateDotDiv>
                      <AnimatedDots />
                    </AnimateDotDiv>
                  )}
                  {(revertMinReceivedAmount + pickedToken.symbol).length > 20 ? <br /> : ' '}
                  {pickedToken.symbol}
                </>
                <span>
                  {/* {depositedValueUSD !== '' ? (
                    `≈ $${depositedValueUSD}`
                  ) : revertFromInfoUsdAmount !== '' ? (
                    revertFromInfoUsdAmount
                  ) : (
                    <AnimatedDots />
                  )} */}
                  {revertFromInfoUsdAmount !== '' ? (
                    `≈ $${revertFromInfoUsdAmount}`
                  ) : (
                    <AnimatedDots />
                  )}
                </span>
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
            size={isMobile ? '12px' : '16px'}
            height={isMobile ? '21px' : '24px'}
            weight={600}
            color="#1F2937"
            padding="24px"
          >
            <Buttons
              onClick={() => {
                startWithdraw()
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
export default WithdrawStart
