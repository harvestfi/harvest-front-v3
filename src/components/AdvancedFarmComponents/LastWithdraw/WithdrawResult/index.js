import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import React, { useState, useEffect } from 'react'
import CheckIcon from '../../../../assets/images/logos/beginners/success-check.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import { WIDO_EXTEND_DECIMALS } from '../../../../constants'
import { fromWei } from '../../../../services/web3'
import { formatNumberWido } from '../../../../utils'
import AnimatedDots from '../../../AnimatedDots'
import { Buttons, ImgBtn, NewLabel, SelectTokenWido, FTokenInfo } from './style'

const WithdrawResult = ({
  pickedToken,
  finalStep,
  setFinalStep,
  setWithdraw,
  unstakeBalance,
  token,
  tokenSymbol,
  quoteValue,
  useIFARM,
}) => {
  const amount = fromWei(unstakeBalance, pickedToken.decimals)

  const pricePerFullShare = get(token, `pricePerFullShare`, 0)

  const [showDesc, setShowDesc] = useState(true)

  const onClose = () => {
    setFinalStep(false)
    setWithdraw(false)
  }
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const [receiveAmount, setReceiveAmount] = useState('')

  useEffect(() => {
    const receiveString = pickedToken.default
      ? formatNumberWido(
          new BigNumber(amount)
            .multipliedBy(fromWei(pricePerFullShare, pickedToken.decimals))
            .toFixed(),
          WIDO_EXTEND_DECIMALS,
        )
      : quoteValue
      ? formatNumberWido(
          fromWei(quoteValue.toTokenAmount, pickedToken.decimals),
          WIDO_EXTEND_DECIMALS,
        )
      : ''
    setReceiveAmount(receiveString)
  }, [amount, quoteValue, pickedToken, pricePerFullShare])

  return (
    <SelectTokenWido show={finalStep}>
      <NewLabel
        color="#101828"
        size={isMobile ? '14px' : '16px'}
        weight="600"
        height={isMobile ? '21px' : '24px'}
        marginBottom={isMobile ? '0px' : '10px'}
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
          <NewLabel weight="500">Withdrawn</NewLabel>
          <NewLabel weight="600" textAlign="right">
            {formatNumberWido(amount, WIDO_EXTEND_DECIMALS)}
            {(amount + tokenSymbol).length > 20 ? <br /> : ' '}
            {useIFARM ? `i${tokenSymbol}` : `f${tokenSymbol}`}
          </NewLabel>
        </NewLabel>
        <NewLabel
          display="flex"
          justifyContent="space-between"
          padding={isMobile ? '5px 0' : '10px 0'}
        >
          <NewLabel className="beginners" weight="500">
            Received
          </NewLabel>
          <NewLabel weight="600" textAlign="right">
            {receiveAmount !== '' ? receiveAmount : <AnimatedDots />}
            {(receiveAmount + pickedToken.symbol).length > 20 ? <br /> : ' '}
            {pickedToken.symbol}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <FTokenInfo isShow={showDesc ? 'true' : 'false'}>
        <NewLabel marginRight={isMobile ? '8px' : '12px'} display="flex">
          <div>
            <img width={isMobile ? 15 : 20} src={CheckIcon} alt="" />
          </div>
          <NewLabel marginLeft={isMobile ? '8px' : '12px'}>
            <NewLabel
              color="#027A48"
              size={isMobile ? '10px' : '14px'}
              height={isMobile ? '15px' : '20px'}
              weight="600"
              marginBottom="4px"
            >
              Withdraw Complete!
            </NewLabel>
            <NewLabel
              color="#027A48"
              size={isMobile ? '10px' : '14px'}
              height={isMobile ? '15px' : '20px'}
              weight="400"
              marginBottom="5px"
            >
              You have received {tokenSymbol} directly to your wallet.
            </NewLabel>
          </NewLabel>
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

      <NewLabel
        size={isMobile ? '12px' : '16px'}
        height={isMobile ? '17px' : '21px'}
        weight={600}
        color="#1F2937"
        marginTop={isMobile ? '18px' : '25px'}
      >
        <Buttons
          onClick={() => {
            onClose()
          }}
        >
          Close
        </Buttons>
      </NewLabel>
    </SelectTokenWido>
  )
}
export default WithdrawResult
