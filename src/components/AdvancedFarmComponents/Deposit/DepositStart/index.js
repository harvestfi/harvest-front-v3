import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { isNaN } from 'lodash'
import Modal from 'react-bootstrap/Modal'
import { useMediaQuery } from 'react-responsive'
import { Tooltip } from 'react-tooltip'
import { Spinner } from 'react-bootstrap'
import { BsArrowDown } from 'react-icons/bs'
import { CiSettings } from 'react-icons/ci'
import { IoIosArrowUp } from 'react-icons/io'
import { PiQuestion } from 'react-icons/pi'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import AlertIcon from '../../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../../assets/images/logos/beginners/alert-close.svg'
import ProgressOne from '../../../../assets/images/logos/advancedfarm/progress-step1.png'
import ProgressTwo from '../../../../assets/images/logos/advancedfarm/progress-step2.png'
import ProgressThree from '../../../../assets/images/logos/advancedfarm/progress-step3.png'
import ProgressFour from '../../../../assets/images/logos/advancedfarm/progress-step4.png'
import ProgressFive from '../../../../assets/images/logos/advancedfarm/progress-step5.png'
import AutopilotVaults from '../../../../assets/images/logos/advancedfarm/btc-eth-usdc.svg'
import { useActions } from '../../../../providers/Actions'
import { useContracts } from '../../../../providers/Contracts'
import { useVaults } from '../../../../providers/Vault'
import { useWallet } from '../../../../providers/Wallet'
import { usePools } from '../../../../providers/Pools'
import { useRate } from '../../../../providers/Rate'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { fromWei, toWei, getViem } from '../../../../services/viem'
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
  SlippageBox,
  MiddleLine,
  SlipValue,
  SlippageRow,
  SlippageInput,
  SlippageBtn,
  ProgressLabel,
  ProgressText,
  VaultContainer,
  HighestVault,
  ImageName,
} from './style'
import { usePortals } from '../../../../providers/Portals'
import { showTokenBalance } from '../../../../utilities/formats'

const DepositStart = ({
  pickedToken,
  deposit,
  setDeposit,
  defaultToken,
  inputAmount,
  setInputAmount,
  token,
  tokenSymbol,
  vaultPool,
  fromInfoAmount,
  fromInfoUsdAmount,
  minReceiveAmountString,
  minReceiveUsdAmount,
  setSelectToken,
  setConvertSuccess,
}) => {
  const {
    darkMode,
    backColor,
    fontColor1,
    fontColor2,
    fontColor3,
    bgColorSlippage,
    borderColor,
    btnHoverColor,
  } = useThemeContext()
  const { account, viem, approvedBalances, getWalletBalances } = useWallet()
  const navigate = useNavigate()
  const { fetchUserPoolStats, userStats } = usePools()
  const { getPortalsApproval, portalsApprove, getPortals } = usePortals()

  let pickedDefaultToken
  if (pickedToken.symbol !== 'Select Token' && defaultToken) {
    pickedDefaultToken = pickedToken.address.toLowerCase() === defaultToken.address.toLowerCase()
  }

  const chainId = token.chain || token.data.chain
  const amount = toWei(inputAmount, pickedToken.decimals)
  const toToken = token.vaultAddress || token.tokenAddress

  const [slippagePercentage, setSlippagePercentage] = useState(null)
  const [customSlippage, setCustomSlippage] = useState(null)
  const [slippageSetting, setSlippageSetting] = useState(false)
  const [slippageBtnLabel, setSlippageBtnLabel] = useState('Save')
  const [progressStep, setProgressStep] = useState(0)
  const [startSpinner, setStartSpinner] = useState(false) // State of Spinner for 'Finalize Deposit' button

  const [depositFailed, setDepositFailed] = useState(false)
  const [slippageFailed, setSlippageFailed] = useState(false)

  const [buttonName, setButtonName] = useState('Approve Token')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [receiveUsd, setReceiveUsd] = useState('')
  const { handleApproval, handleDeposit, handleIPORDeposit } = useActions()
  const { contracts } = useContracts()
  const { vaultsData } = useVaults()

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
    }
  }, [rates])

  const SlippageValues = [null, 0.1, 0.5, 1, 5]
  const tokenName = token.isIPORVault ? tokenSymbol : `f${tokenSymbol}`
  const curChain = token.poolVault ? token.data.chain : token.chain

  const onInputSlippage = e => {
    let inputValue = e.target.value
    if (!isNaN(inputValue)) {
      inputValue = Math.max(0, Math.min(10, inputValue))
      setCustomSlippage(inputValue)
    }
  }

  const onSlippageSave = () => {
    if (!(customSlippage === null || customSlippage === 0)) {
      setSlippagePercentage(customSlippage)

      setSlippageBtnLabel('Saved')
      setTimeout(() => {
        setSlippageBtnLabel('Save')
      }, 2000)
    }
  }

  const onDeposit = async () => {
    const mainViem = await getViem(chainId, account, viem)

    const portalData = await getPortals({
      chainId,
      sender: account,
      tokenIn: pickedToken.address,
      inputAmount: amount,
      tokenOut: toToken,
      slippage: slippagePercentage,
    })

    await mainViem.sendTransaction({
      account,
      to: portalData.tx.to,
      data: portalData.tx.data,
      value: portalData.tx.value ? BigInt(portalData.tx.value) : undefined,
    })

    const receiveString = portalData
      ? fromWei(
          portalData.context?.outputAmount,
          token.isIPORVault
            ? token.vaultDecimals
            : token.decimals || token.data.lpTokenData.decimals,
          token.isIPORVault
            ? token.vaultDecimals
            : token.decimals || token.data.lpTokenData.decimals,
        )
      : ''
    const receiveUsdString = portalData ? portalData.context?.outputAmountUsd : ''
    if (Number(receiveUsdString) === 0) {
      setReceiveUsd(`${currencySym}0`)
    } else if (Number(receiveUsdString) < 0.01) {
      setReceiveUsd(`<${currencySym}0.01`)
    } else {
      setReceiveUsd(
        `≈${currencySym}${(Number(receiveUsdString) * Number(currencyRate)).toFixed(2)}`,
      )
    }
    setReceiveAmount(receiveString)
  }

  const approveZap = async amnt => {
    const { approve } = await portalsApprove(chainId, account, pickedToken.address, amnt.toString())
    const mainViem = await getViem(chainId, account, viem)
    await mainViem.sendTransaction({
      account,
      to: approve.to,
      data: approve.data,
      value: approve.value ? BigInt(approve.value) : undefined,
    })
  }

  const startDeposit = async () => {
    let tokenSym = token.isIPORVault ? token.id : tokenSymbol
    if (progressStep === 0) {
      setStartSpinner(true)
      setProgressStep(1)
      setButtonName('Pending Approval in Wallet')
      if (pickedDefaultToken) {
        const allowanceCheck = approvedBalances[tokenSym]
        if (!new BigNumber(allowanceCheck.toString()).gte(new BigNumber(amount.toString()))) {
          await handleApproval(
            account,
            contracts,
            tokenSym,
            amount,
            toToken,
            null,
            async () => {
              setProgressStep(2)
              setButtonName('Confirm Transaction')
              setStartSpinner(false)
              setReceiveAmount(minReceiveAmountString)
              setReceiveUsd(minReceiveUsdAmount)
            },
            async () => {
              setStartSpinner(false)
              setDepositFailed(true)
              setProgressStep(0)
              setButtonName('Approve Token')
            },
          )
        } else {
          setProgressStep(2)
          setButtonName('Confirm Transaction')
          setStartSpinner(false)
        }
      } else {
        try {
          let allowanceCheck
          if (pickedToken.address === '0x0000000000000000000000000000000000000000') {
            // native token
            allowanceCheck = amount
          } else {
            const approval = await getPortalsApproval(chainId, account, pickedToken.address)

            allowanceCheck = approval ? approval.allowance : 0
          }

          if (!new BigNumber(allowanceCheck.toString()).gte(new BigNumber(amount.toString()))) {
            await approveZap(amount) // Approve for Zap
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
      }
    } else if (progressStep === 2) {
      let isSuccess = true
      if (pickedDefaultToken) {
        setProgressStep(3)
        setButtonName('Pending Confirmation in Wallet')
        setStartSpinner(true)
        isSuccess = token.isIPORVault
          ? await handleIPORDeposit(
              account,
              token,
              amount,
              async () => {},
              () => {
                setDepositFailed(true)
                setStartSpinner(false)
                setProgressStep(0)
                setButtonName('Approve Token')
              },
            )
          : await handleDeposit(
              token,
              account,
              [amount],
              vaultsData[tokenSym],
              false,
              false,
              async () => {},
              async () => {
                setDepositFailed(true)
                setStartSpinner(false)
                setProgressStep(0)
                setButtonName('Approve Token')
              },
            )
      } else {
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
          isSuccess = false
          return
        }
      }
      // End Approve and Deposit successfully
      if (isSuccess) {
        await getWalletBalances([tokenSym], false, true)
        token.isIPORVault
          ? await fetchUserPoolStats([tokenSym], account, userStats)
          : await fetchUserPoolStats([vaultPool], account, userStats)
        setStartSpinner(false)
        setDepositFailed(false)
        setProgressStep(4)
        setButtonName('Success! Close this window.')
      }
    } else if (progressStep === 4) {
      setConvertSuccess(true)
      setSelectToken(false)
      setDeposit(false)
      setProgressStep(0)
      setInputAmount('0')
      setButtonName('Approve Token')
    }
  }

  const closeDeposit = async () => {
    setStartSpinner(false)
    setProgressStep(0)
    setDepositFailed(false)
    setDeposit(false)
    setButtonName('Approve Token')
    if (progressStep === 4) {
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
            <NewLabel $margin="auto 0px">
              <IconCard>
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel $textalign="left" $marginright="12px">
              <NewLabel
                $fontcolor="#5dcf46"
                $size={isMobile ? '18px' : '18px'}
                $height={isMobile ? '28px' : '28px'}
                $weight="600"
                $marginbottom="4px"
              >
                Summary
              </NewLabel>
              <NewLabel
                $fontcolor={fontColor1}
                $size={isMobile ? '14px' : '14px'}
                $height={isMobile ? '20px' : '20px'}
                $weight="400"
                $marginbottom="5px"
              >
                Convert your crypto into interest-bearing fToken
              </NewLabel>
            </NewLabel>
          </FTokenDiv>
          <NewLabel>
            <NewLabel
              $display="flex"
              $marginbottom={isMobile ? '16px' : '16px'}
              $width="fit-content"
              $cursortype="pointer"
              $weight="600"
              $size={isMobile ? '14px' : '14px'}
              $height={isMobile ? '20px' : '20px'}
              $fontcolor="#667085"
              $align="center"
              onClick={() => {
                closeDeposit()
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
            $size={isMobile ? '14px' : '14px'}
            $height={isMobile ? '24px' : '24px'}
            $padding="24px"
            $fontcolor={fontColor2}
          >
            <NewLabel
              $display="flex"
              $justifycontent="space-between"
              $padding={isMobile ? '10px 0' : '10px 0'}
            >
              <NewLabel $weight="500">{progressStep === 4 ? 'Converted' : 'Converting'}</NewLabel>
              <NewLabel $display="flex" $flexflow="column" $weight="600" $textalign="right">
                {fromInfoAmount !== '' ? fromInfoAmount : inputAmount}
                <span>{pickedToken.symbol}</span>
                <span>
                  {fromInfoUsdAmount !== '' ? <>{fromInfoUsdAmount}</> : <AnimatedDots />}
                </span>
              </NewLabel>
            </NewLabel>
            <NewLabel
              $display="flex"
              $justifycontent="space-between"
              $padding={isMobile ? '10px 0' : '10px 0'}
            >
              <NewLabel className="beginners" $weight="500">
                {progressStep === 4 ? 'fTokens Received' : 'Est. fTokens Received'}
                {progressStep !== 4 && (
                  <>
                    <PiQuestion className="question" data-tip id="min-help" />
                    <Tooltip
                      id="min-help"
                      anchorSelect="#min-help"
                      backgroundColor={darkMode ? 'white' : '#101828'}
                      borderColor={darkMode ? 'white' : 'black'}
                      textColor={darkMode ? 'black' : 'white'}
                      place="right"
                    >
                      <NewLabel
                        $size={isMobile ? '10px' : '10px'}
                        $height={isMobile ? '14px' : '14px'}
                        $weight="600"
                      >
                        {`The estimated number of ${tokenName} you will receive in your wallet. The default slippage is set as 'Auto'.`}
                      </NewLabel>
                    </Tooltip>
                  </>
                )}
              </NewLabel>
              <NewLabel $weight="600" $textalign="right" $display="flex" $flexflow="column">
                <>
                  <div data-tip id="modal-fToken-receive-convert">
                    {!pickedDefaultToken && progressStep === 4 ? (
                      receiveAmount !== '' ? (
                        showTokenBalance(receiveAmount)
                      ) : (
                        <AnimateDotDiv>
                          <AnimatedDots />
                        </AnimateDotDiv>
                      )
                    ) : minReceiveAmountString !== '' ? (
                      showTokenBalance(minReceiveAmountString)
                    ) : (
                      <AnimateDotDiv>
                        <AnimatedDots />
                      </AnimateDotDiv>
                    )}
                  </div>
                  <Tooltip
                    id="modal-fToken-receive-convert"
                    anchorSelect="#modal-fToken-receive-convert"
                    backgroundColor={darkMode ? 'white' : '#101828'}
                    borderColor={darkMode ? 'white' : 'black'}
                    textColor={darkMode ? 'black' : 'white'}
                    place="top"
                  >
                    <NewLabel
                      $size={isMobile ? '12px' : '12px'}
                      $height={isMobile ? '18px' : '18px'}
                      $weight="500"
                    >
                      {!pickedDefaultToken && progressStep === 4 ? (
                        receiveAmount !== '' ? (
                          minReceiveAmountString
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
                    </NewLabel>
                  </Tooltip>
                </>
                <NewLabel $display="flex" $flexflow="column" $weight="600" $textalign="right">
                  <span>{tokenName}</span>
                  <span>
                    {!pickedDefaultToken && progressStep === 4 ? (
                      receiveUsd !== '' ? (
                        `${receiveUsd}`
                      ) : (
                        <>{`≈${currencySym}0`}</>
                      )
                    ) : minReceiveUsdAmount === 'NaN' || minReceiveUsdAmount === '-' ? (
                      '-'
                    ) : minReceiveUsdAmount !== '' ? (
                      `${minReceiveUsdAmount}`
                    ) : (
                      <AnimatedDots />
                    )}
                  </span>
                </NewLabel>
              </NewLabel>
            </NewLabel>
          </NewLabel>

          <FTokenWrong $isshow={depositFailed ? 'true' : 'false'}>
            <NewLabel $marginright="12px" $display="flex">
              <div>
                <img src={AlertIcon} alt="" />
              </div>
              <NewLabel $marginleft="12px">
                <NewLabel
                  $fontcolor="#B54708"
                  $size={isMobile ? '14px' : '14px'}
                  $height={isMobile ? '20px' : '20px'}
                  $weight="600"
                  $marginbottom="4px"
                >
                  Whoops, something went wrong.
                </NewLabel>
                <NewLabel
                  $fontcolor="#B54708"
                  $size={isMobile ? '14px' : '14px'}
                  $height={isMobile ? '20px' : '20px'}
                  $weight="400"
                  $marginbottom="5px"
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
          <FTokenWrong $isshow={slippageFailed ? 'true' : 'false'}>
            <NewLabel $marginright="12px" $display="flex">
              <div>
                <img src={AlertIcon} alt="" />
              </div>
              <NewLabel $marginleft="12px">
                <NewLabel
                  $fontcolor="#B54708"
                  $size={isMobile ? '14px' : '14px'}
                  $height={isMobile ? '20px' : '20px'}
                  $weight="600"
                  $marginbottom="4px"
                >
                  Whoops, slippage set too low
                </NewLabel>
                <NewLabel
                  $fontcolor="#B54708"
                  $size={isMobile ? '14px' : '14px'}
                  $height={isMobile ? '20px' : '20px'}
                  $weight="400"
                  $marginbottom="5px"
                >
                  Slippage for this conversion is set too low. Expected slippage is &gt;[number%].
                  If you wish to proceed, set it manually via the gear button below.
                </NewLabel>
              </NewLabel>
            </NewLabel>
            <NewLabel>
              <ImgBtn
                src={AlertCloseIcon}
                alt=""
                onClick={() => {
                  setSlippageFailed(false)
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
          <ProgressLabel $fontcolor2={fontColor2}>
            <ProgressText $width="50%" $padding="0px 0px 0px 30px">
              Approve
              <br />
              Token
            </ProgressText>
            <ProgressText $width="unset" $padding="0px 0px 0px 7px">
              Confirm
              <br />
              Transaction
            </ProgressText>
            <ProgressText $width="50%" $padding="0px 10px 0px 0px">
              Transaction
              <br />
              Successful
            </ProgressText>
          </ProgressLabel>
          {curChain === '8453' && token.platform?.[0] !== 'Autopilot' && (
            <NewLabel>
              <NewLabel
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
                $size={isMobile ? '14px' : '14px'}
                $height={isMobile ? '20px' : '28px'}
                $weight="600"
                $padding="20px 24px 0px 24px"
              >
                Tired of jumping between strategies? Try our Autopilots.
              </NewLabel>
              <VaultContainer>
                <HighestVault
                  className="highest-vault"
                  onClick={e => {
                    const url = `/autopilot`
                    if (e.ctrlKey) {
                      window.open(url, '_blank')
                    } else {
                      navigate(url)
                    }
                  }}
                >
                  <ImageName>
                    <img className="logo-img" src={AutopilotVaults} alt="logo" />
                    <div>
                      <NewLabel
                        $fontcolor="#15202b"
                        $size={isMobile ? '14px' : '14px'}
                        $height={isMobile ? '20px' : '20px'}
                        $weight="600"
                        $padding="0px 10px"
                      >
                        Autopilot
                      </NewLabel>
                      <NewLabel
                        $fontcolor="#15202b"
                        $size={isMobile ? '14px' : '10px'}
                        $height={isMobile ? '20px' : '20px'}
                        $weight="400"
                        $padding="0px 10px"
                      >
                        Harvest
                      </NewLabel>
                    </div>
                  </ImageName>
                  <ImageName className="top-apy">Auto-Allocation</ImageName>
                </HighestVault>
              </VaultContainer>
            </NewLabel>
          )}
          <NewLabel
            $size={isMobile ? '16px' : '16px'}
            $height={isMobile ? '24px' : '24px'}
            $weight={600}
            $fontcolor="#1F2937"
            $padding={slippageSetting ? '25px 24px 10px' : '25px 24px 24px'}
            $display="flex"
          >
            <SlippageBox onClick={() => setSlippageSetting(!slippageSetting)}>
              {slippageSetting ? (
                <IoIosArrowUp color="#6F78AA" fontSize={20} />
              ) : (
                <CiSettings color="#6F78AA" fontSize={20} />
              )}
            </SlippageBox>
            <Buttons
              $hovercolor={btnHoverColor}
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
          <NewLabel
            $size={isMobile ? '12px' : '12px'}
            $height={isMobile ? '24px' : '24px'}
            $fontcolor={fontColor3}
            $padding="10px 24px"
            $display={slippageSetting ? 'flex' : 'none'}
            $flexflow="column"
          >
            <NewLabel $display="flex" $justifycontent="space-between">
              <NewLabel>Slippage Settings</NewLabel>
              <MiddleLine $width={isMobile ? '65%' : '75%'} />
            </NewLabel>
            <NewLabel $padding="10px 0px">
              Current slippage:{' '}
              <span className="auto-slippage">
                {slippagePercentage === null ? 'Auto (0 - 2.5%)' : `${slippagePercentage}%`}
              </span>
            </NewLabel>
            <SlippageRow $bordercolor={borderColor}>
              {SlippageValues.map((percentage, index) => (
                <SlipValue
                  key={index}
                  onClick={() => {
                    setSlippagePercentage(percentage)
                    setCustomSlippage(null)
                  }}
                  $fontcolor={slippagePercentage === percentage ? '#fff' : fontColor2}
                  $bgcolor={slippagePercentage === percentage ? bgColorSlippage : ''}
                  $bordercolor={borderColor}
                  $islastchild={index === SlippageValues.length - 1}
                  $isfirstchild={index === 0}
                >
                  {percentage === null ? 'Auto' : `${percentage}%`}
                </SlipValue>
              ))}
            </SlippageRow>
            <NewLabel
              $display="flex"
              $justifycontent="space-between"
              $padding="15px 0px 5px"
              $gap="10px"
            >
              <NewLabel $fontcolor={fontColor2} $weight="600" $margin="auto">
                or
              </NewLabel>
              <SlippageInput
                $fontcolor2={fontColor2}
                $backcolor={backColor}
                $bordercolor={
                  customSlippage === null || customSlippage === 0 ? borderColor : '#5dcf46'
                }
              >
                <input
                  type="number"
                  value={customSlippage === null ? '' : customSlippage}
                  onChange={onInputSlippage}
                  placeholder="Custom"
                />
                <div className="percentage">%</div>
              </SlippageInput>
              <SlippageBtn
                onClick={onSlippageSave}
                $fontcolor={
                  !darkMode
                    ? '#fff'
                    : customSlippage === null || customSlippage === 0
                      ? '#0C111D'
                      : '#fff'
                }
                $bgcolor={customSlippage === null || customSlippage === 0 ? '#ced3e6' : '#5dcf46'}
                cursor={customSlippage === null || customSlippage === 0 ? 'not-allowed' : 'pointer'}
                $hovercolor={
                  customSlippage === null || customSlippage === 0 ? '#ced3e6' : '#51e932'
                }
                $activecolor={
                  customSlippage === null || customSlippage === 0 ? '#ced3e6' : '#46eb25'
                }
              >
                {slippageBtnLabel}
              </SlippageBtn>
            </NewLabel>
          </NewLabel>
        </SelectTokenWido>
      </Modal.Body>
    </Modal>
  )
}
export default DepositStart
