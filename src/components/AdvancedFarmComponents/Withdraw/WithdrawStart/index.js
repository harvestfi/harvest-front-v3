import BigNumber from 'bignumber.js'
import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useMediaQuery } from 'react-responsive'
import { isNaN } from 'lodash'
import { BsArrowUp } from 'react-icons/bs'
import { CiSettings } from 'react-icons/ci'
import { PiQuestion } from 'react-icons/pi'
import { IoIosArrowUp } from 'react-icons/io'
import { Tooltip } from 'react-tooltip'
import { Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AutopilotVaults from '../../../../assets/images/logos/advancedfarm/btc-eth-usdc.svg'
import AlertIcon from '../../../../assets/images/logos/beginners/alert-triangle.svg'
import AlertCloseIcon from '../../../../assets/images/logos/beginners/alert-close.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import ProgressOne from '../../../../assets/images/logos/advancedfarm/progress-step1.png'
import ProgressTwo from '../../../../assets/images/logos/advancedfarm/progress-step2.png'
import ProgressThree from '../../../../assets/images/logos/advancedfarm/progress-step3.png'
import ProgressFour from '../../../../assets/images/logos/advancedfarm/progress-step4.png'
import ProgressFive from '../../../../assets/images/logos/advancedfarm/progress-step5.png'
import { useActions } from '../../../../providers/Actions'
import { useVaults } from '../../../../providers/Vault'
import { useWallet } from '../../../../providers/Wallet'
import { usePools } from '../../../../providers/Pools'
import { usePortals } from '../../../../providers/Portals'
import { useRate } from '../../../../providers/Rate'
import { useThemeContext } from '../../../../providers/useThemeContext'
import { getViem, fromWei } from '../../../../services/viem'
import { formatNumberWido, showTokenBalance } from '../../../../utilities/formats'
import AnimatedDots from '../../../AnimatedDots'
import { getMatchedVaultList } from '../../../../utilities/parsers'
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
  BigLogoImg,
  VaultContainer,
  HighestVault,
  ImagePart,
  NamePart,
  ImageName,
} from './style'

const WithdrawStart = ({
  groupOfVaults,
  unstakeInputValue,
  withdrawStart,
  setWithdrawStart,
  defaultToken,
  pickedToken,
  setPickedToken,
  token,
  unstakeBalance,
  tokenSymbol,
  vaultPool,
  setRevertFromInfoAmount,
  revertFromInfoAmount,
  revertFromInfoUsdAmount,
  revertMinReceivedAmount,
  revertMinReceivedUsdAmount,
  setUnstakeInputValue,
  setRevertSuccess,
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
  const { account, viem, getWalletBalances } = useWallet()
  const { fetchUserPoolStats, userStats, pools } = usePools()
  const navigate = useNavigate()
  const [slippagePercentage, setSlippagePercentage] = useState(null)
  const [slippageSetting, setSlippageSetting] = useState(false)
  const [customSlippage, setCustomSlippage] = useState(null)
  const [slippageBtnLabel, setSlippageBtnLabel] = useState('Save')
  const [progressStep, setProgressStep] = useState(0)
  const [buttonName, setButtonName] = useState('Approve Token')
  const [withdrawFailed, setWithdrawFailed] = useState(false)
  const [slippageFailed, setSlippageFailed] = useState(false)
  const [startSpinner, setStartSpinner] = useState(false) // State of Spinner for 'Finalize Deposit' button
  const [revertedAmount, setRevertedAmount] = useState('')
  const [revertedAmountUsd, setRevertedAmountUsd] = useState('')
  const { handleWithdraw, handleIPORWithdraw } = useActions()
  const { vaultsData } = useVaults()
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [highestApyLogo, setHighestApyLogo] = useState([])
  const [tokenNames, setTokenNames] = useState([])
  const [platformNames, setPlatformNames] = useState([])
  const [topApyVault, setTopApyVault] = useState()
  const [fromTokenAddress, setFromTokenAddress] = useState()
  const [toVaultAddress, setToVaultAddress] = useState()
  const [matchVaultList, setMatchVaultList] = useState([])

  const isFetchingRef = useRef(false)

  const curChain = token.poolVault ? token.data.chain : token.chain
  const tokenName = token.isIPORVault ? tokenSymbol : `f${tokenSymbol}`

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  const { getPortalsApproval, portalsApprove, getPortals, getPortalsSupportBatch } = usePortals()

  let pickedDefaultToken
  if (pickedToken.symbol !== 'Select' && defaultToken) {
    pickedDefaultToken = pickedToken.address.toLowerCase() === defaultToken.address.toLowerCase()
  }
  const SlippageValues = [null, 0.1, 0.5, 1, 5]
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

  const chainId = token.chain || token.data.chain
  const fromToken = token.vaultAddress || token.tokenAddress

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const approveZap = async amnt => {
    const { approve } = await portalsApprove(chainId, account, fromToken, amnt.toString())
    const mainViem = await getViem(chainId, account, viem)

    await mainViem.sendTransaction({
      account,
      to: approve.to,
      data: approve.data,
      value: approve.value ? BigInt(approve.value) : undefined,
    })
  }

  const startWithdraw = async () => {
    const tokenSym = token.isIPORVault ? token.id : tokenSymbol
    if (progressStep === 0) {
      setStartSpinner(true)
      setProgressStep(1)
      setButtonName('Pending Approval in Wallet')
      setWithdrawFailed(false)
      if (pickedDefaultToken) {
        setProgressStep(2)
        setButtonName('Confirm Transaction')
        setStartSpinner(false)
      } else {
        try {
          const approval = await getPortalsApproval(chainId, account, fromToken)
          console.debug('Allowance Spender: ', approval.spender)

          const allowanceCheck = approval ? approval.allowance : 0

          if (
            !new BigNumber(allowanceCheck.toString()).gte(new BigNumber(unstakeBalance.toString()))
          ) {
            await approveZap(unstakeBalance) // Approve for Zap
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
      }
    } else if (progressStep === 2) {
      let isSuccess = true
      if (pickedDefaultToken) {
        setProgressStep(3)
        setButtonName('Pending Confirmation in Wallet')
        setStartSpinner(true)
        isSuccess = token.isIPORVault
          ? await handleIPORWithdraw(account, token, unstakeBalance, async () => {})
          : await handleWithdraw(
              account,
              tokenSym,
              unstakeBalance,
              vaultsData,
              null,
              false,
              null,
              async () => {},
              async () => {
                setWithdrawFailed(true)
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
          const amount = unstakeBalance
          const toToken = pickedToken.address
          const mainViem = await getViem(chainId, account, viem)
          const portalData = await getPortals({
            chainId,
            sender: account,
            tokenIn: fromToken,
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
                pickedToken.decimals || 18,
                pickedToken.decimals || 18,
              )
            : ''
          const receiveUsdString = portalData ? portalData.context?.outputAmountUsd : ''
          setRevertedAmount(receiveString)
          setRevertedAmountUsd(formatNumberWido(receiveUsdString))
        } catch (err) {
          setWithdrawFailed(true)
          setStartSpinner(false)
          setProgressStep(0)
          setButtonName('Approve Token')
          isSuccess = false
          return
        }
      }
      // End Approve and Withdraw successfully
      if (isSuccess) {
        await getWalletBalances([tokenSym], false, true)
        token.isIPORVault
          ? await fetchUserPoolStats([token.id], account, userStats)
          : await fetchUserPoolStats([vaultPool], account, userStats)

        setStartSpinner(false)
        setWithdrawFailed(false)
        setProgressStep(4)
        setButtonName('Success! Close this window.')
        await getWalletBalances([token.id], false, true)
      }
    } else if (progressStep === 4) {
      setRevertSuccess(true)
      setUnstakeInputValue('0')
      setRevertFromInfoAmount('0')
      setPickedToken({ symbol: 'Select' })
      setProgressStep(0)
      setWithdrawStart(false)
      setWithdrawFailed(false)
      setButtonName('Approve Token')
    }
  }

  const closeWithdraw = async () => {
    setProgressStep(0)
    setWithdrawStart(false)
    setWithdrawFailed(false)
    setButtonName('Approve Token')
    setStartSpinner(false)
    if (progressStep === 4) {
      setRevertSuccess(true)
      setUnstakeInputValue('0')
      setRevertFromInfoAmount('0')
      setPickedToken({ symbol: 'Select' })
    }
  }

  useEffect(() => {
    let activedList = []
    if (chainId) {
      const matched = getMatchedVaultList(groupOfVaults, chainId, pools)
      if (matched.length > 0) {
        activedList = matched.filter(
          el => el.vaultApy !== 0 && el.vaultTvl > 500 && el.vault?.tokenNames.length === 1,
        )
      }
    }

    const fetchSupportedMatches = async () => {
      if (isFetchingRef.current) {
        return
      }
      isFetchingRef.current = true
      const filteredMatchList = []

      if (activedList.length > 0) {
        activedList.sort((a, b) => b.vaultApy - a.vaultApy)
        const newArray = activedList.slice(0, 10)

        const validItems = newArray.filter(
          item =>
            item.vaultApy !== 0 &&
            item.vault.vaultAddress.toLowerCase() !== '0x47e3daf382c4603450905fb68766db8308315407',
        )

        if (validItems.length > 0) {
          const tokenAddresses = validItems.map(item => {
            const mToken = item.vault
            return mToken.vaultAddress || mToken.tokenAddress
          })

          try {
            const supportResults = await getPortalsSupportBatch(chainId, tokenAddresses)

            validItems.forEach((item, index) => {
              const supportResult = supportResults[index]
              if (
                supportResult &&
                supportResult.status === 200 &&
                supportResult.data.totalItems !== 0
              ) {
                filteredMatchList.push(item)
              }
            })
          } catch (error) {
            console.log('Error in fetching Portals supported batch:', error)
          }
        }
      }

      if (filteredMatchList.length > 0) {
        setMatchVaultList(filteredMatchList)
      }

      isFetchingRef.current = false
    }

    fetchSupportedMatches()
  }, [chainId, pools, setMatchVaultList, token])

  useEffect(() => {
    if (
      matchVaultList.length > 0 &&
      token.vaultAddress.toLowerCase() !== matchVaultList[0].vault.vaultAddress.toLowerCase()
    ) {
      setHighestApyLogo(matchVaultList[0].vault.logoUrl)
      setTokenNames(matchVaultList[0].vault.tokenNames)
      setPlatformNames(matchVaultList[0].vault.platform)
      setTopApyVault(matchVaultList[0].vaultApy)
      setFromTokenAddress(token.vaultAddress.toLowerCase())
      setToVaultAddress(matchVaultList[0].vault.vaultAddress.toLowerCase())
    } else if (
      matchVaultList.length > 0 &&
      token.vaultAddress.toLowerCase() === matchVaultList[0].vault.vaultAddress.toLowerCase()
    ) {
      setHighestApyLogo(matchVaultList[1].vault.logoUrl)
      setTokenNames(matchVaultList[1].vault.tokenNames)
      setPlatformNames(matchVaultList[1].vault.platform)
      setTopApyVault(matchVaultList[1].vaultApy)
      setFromTokenAddress(token.vaultAddress.toLowerCase())
      setToVaultAddress(matchVaultList[1].vault.vaultAddress.toLowerCase())
    }
  }, [matchVaultList, token])

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
            <NewLabel $margin="auto 0px">
              <IconCard>
                <BsArrowUp />
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
                Revert your fTokens into selected token
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
                closeWithdraw()
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
            $padding="15px 24px"
            $fontcolor={fontColor2}
          >
            <NewLabel
              $display="flex"
              $justifycontent="space-between"
              $padding={isMobile ? '10px 0' : '10px 0'}
            >
              <NewLabel $weight="500">{progressStep === 4 ? 'Reverted' : 'Reverting'}</NewLabel>
              <NewLabel $display="flex" $flexflow="column" $weight="600" $textalign="right">
                <>
                  {revertFromInfoAmount === '-' || revertFromInfoAmount === 'NaN' ? (
                    unstakeInputValue
                  ) : revertFromInfoAmount !== '' ? (
                    revertFromInfoAmount
                  ) : (
                    <AnimateDotDiv>
                      <AnimatedDots />
                    </AnimateDotDiv>
                  )}
                </>
                <NewLabel $display="flex" $flexflow="column" $weight="600" $textalign="right">
                  <span>{tokenName}</span>
                  <span>
                    {revertFromInfoUsdAmount !== '' ? (
                      <>≈{revertFromInfoUsdAmount}</>
                    ) : (
                      <AnimatedDots />
                    )}
                  </span>
                </NewLabel>
              </NewLabel>
            </NewLabel>
            <NewLabel
              $display="flex"
              $justifycontent="space-between"
              $padding={isMobile ? '10px 0' : '10px 0'}
            >
              <NewLabel
                className="beginners"
                $weight="500"
                $items="center"
                $display="flex"
                $alignself="flex-start"
              >
                {progressStep === 4 ? 'Received' : 'Est. Received'}
                {progressStep !== 4 && (
                  <>
                    <PiQuestion className="question" data-tip id="min-help" />
                    <Tooltip
                      anchorSelect="#min-help"
                      id="min-help"
                      backgroundColor={darkMode ? 'white' : '#101828'}
                      borderColor={darkMode ? 'white' : 'black'}
                      textColor={darkMode ? 'black' : 'white'}
                      place="right"
                    >
                      <NewLabel
                        $size={isMobile ? '12px' : '12px'}
                        $height={isMobile ? '18px' : '18px'}
                        $weight="600"
                      >
                        The estimated number of tokens you will receive in your wallet. The default
                        slippage is set as &lsquo;Auto&lsquo;.
                      </NewLabel>
                    </Tooltip>
                  </>
                )}
              </NewLabel>
              <NewLabel $display="flex" $flexflow="column" $weight="600" $textalign="right">
                <>
                  <>
                    <div data-tip id="modal-fToken-receive-revert">
                      {!pickedDefaultToken && progressStep === 4 ? (
                        revertedAmount !== '' ? (
                          showTokenBalance(revertedAmount)
                        ) : (
                          <AnimateDotDiv>
                            <AnimatedDots />
                          </AnimateDotDiv>
                        )
                      ) : revertMinReceivedAmount !== '' ? (
                        showTokenBalance(revertMinReceivedAmount)
                      ) : (
                        <AnimateDotDiv>
                          <AnimatedDots />
                        </AnimateDotDiv>
                      )}
                    </div>
                    <Tooltip
                      id="modal-fToken-receive-revert"
                      anchorSelect="#modal-fToken-receive-revert"
                      backgroundColor={darkMode ? 'white' : '#101828'}
                      borderColor={darkMode ? 'white' : 'black'}
                      textColor={darkMode ? 'black' : 'white'}
                      place="top"
                    >
                      <NewLabel
                        $size={isMobile ? '10px' : '10px'}
                        $height={isMobile ? '14px' : '14px'}
                        $weight="500"
                      >
                        {!pickedDefaultToken && progressStep === 4 ? (
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
                      </NewLabel>
                    </Tooltip>
                  </>
                  <span>{pickedToken.symbol}</span>
                </>
                <span>
                  {!pickedDefaultToken && progressStep === 4 ? (
                    revertedAmountUsd === 'NaN' || revertedAmountUsd === '' ? (
                      '-'
                    ) : revertedAmountUsd !== '' ? (
                      `≈${currencySym}${(Number(revertedAmountUsd) * Number(currencyRate)).toFixed(
                        2,
                      )}`
                    ) : (
                      <AnimatedDots />
                    )
                  ) : revertMinReceivedUsdAmount === 'NaN' || revertMinReceivedUsdAmount === '-' ? (
                    '-'
                  ) : revertMinReceivedUsdAmount !== '' ? (
                    `≈${revertMinReceivedUsdAmount}`
                  ) : (
                    <AnimatedDots />
                  )}
                </span>
              </NewLabel>
            </NewLabel>
          </NewLabel>

          <FTokenWrong $isshow={withdrawFailed ? 'true' : 'false'}>
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
                  setWithdrawFailed(false)
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
          {curChain !== '8453' && curChain !== '324' && (
            <NewLabel>
              <NewLabel
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
                $size={isMobile ? '14px' : '14px'}
                $height={isMobile ? '20px' : '28px'}
                $weight="600"
                $padding="20px 24px 0px 24px"
              >
                Other users also like
              </NewLabel>
              <NewLabel
                $fontcolor={darkMode ? '#ffffff' : '#15202b'}
                $size={isMobile ? '14px' : '10px'}
                $height={isMobile ? '20px' : '20px'}
                $weight="400"
                $padding="0px 24px"
              >
                Click on the new opportunity below to open a Migrate tool.
              </NewLabel>
              <VaultContainer>
                <HighestVault
                  className="highest-vault"
                  onClick={e => {
                    const url = `/migrate?from=${fromTokenAddress}&to=${toVaultAddress}&chain=${chainId}`
                    // token.vaultAddress.toLowerCase() !==
                    // highestApyVault.vault.vaultAddress.toLowerCase()
                    //   ? `/migrate?from=${token.vaultAddress.toLowerCase()}&to=${highestApyVault.vault.vaultAddress.toLowerCase()}&chain=${chainId}`
                    //   : `/migrate?from=${token.vaultAddress.toLowerCase()}&to=${secHighApyVault.vault.vaultAddress.toLowerCase()}&chain=${chainId}`
                    if (e.ctrlKey) {
                      window.open(url, '_blank')
                    } else {
                      navigate(url)
                    }
                  }}
                >
                  <ImageName>
                    <ImagePart>
                      {highestApyLogo.length === 0 ? (
                        <AnimatedDots />
                      ) : (
                        highestApyLogo.map((el, i) => {
                          return (
                            <BigLogoImg
                              key={i}
                              className="logo-img"
                              $zindex={10 - i}
                              src={`.${el}`}
                              alt={tokenNames[i]}
                            />
                          )
                        })
                      )}
                    </ImagePart>
                    <NamePart>
                      <NewLabel
                        $fontcolor="#15202b"
                        $size={isMobile ? '14px' : '14px'}
                        $height={isMobile ? '20px' : '20px'}
                        $weight="600"
                        $padding="0px 10px"
                      >
                        {tokenNames.length === 0 ? <AnimatedDots /> : tokenNames.join(' - ')}
                      </NewLabel>
                      <NewLabel
                        $fontcolor="#15202b"
                        $size={isMobile ? '14px' : '10px'}
                        $height={isMobile ? '20px' : '20px'}
                        $weight="400"
                        $padding="0px 10px"
                      >
                        {platformNames.length === 0 ? <AnimatedDots /> : platformNames.join(', ')}
                      </NewLabel>
                    </NamePart>
                  </ImageName>
                  <ImageName className="top-apy">
                    {topApyVault ? `${topApyVault}% APY` : <AnimatedDots />}
                  </ImageName>
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
export default WithdrawStart
