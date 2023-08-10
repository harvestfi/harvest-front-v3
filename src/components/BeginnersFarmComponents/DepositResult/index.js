import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import React, { useState } from 'react'
import HelpIcon from '../../../assets/images/logos/beginners/help-circle.svg'
import CheckIcon from '../../../assets/images/logos/beginners/success-check.svg'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import { WIDO_EXTEND_DECIMALS } from '../../../constants'
import { fromWei, toWei } from '../../../services/web3'
import { formatNumberWido } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { Buttons, ImgBtn, NewLabel, SelectTokenWido, FTokenInfo } from './style'

const DepositResult = ({
  pickedToken,
  finalStep,
  setFinalStep,
  setSelectToken,
  setDeposit,
  inputAmount,
  token,
  tokenSymbol,
  quoteValue,
  setQuoteValue,
}) => {
  const amount = toWei(inputAmount, pickedToken.decimals)

  const pricePerFullShare = get(token, `pricePerFullShare`, 0)

  const [showDesc, setShowDesc] = useState(true)

  const onClose = () => {
    setQuoteValue(null)
    setFinalStep(false)
    setSelectToken(false)
    setDeposit(false)
  }

  return (
    <SelectTokenWido show={finalStep}>
      <NewLabel color="#101828" size="18px" weight="600" height="28px" marginBottom="10px">
        Summary
      </NewLabel>

      <NewLabel size="14px" height="24px" color="#344054">
        <NewLabel display="flex" justifyContent="space-between" padding="10px 0">
          <NewLabel weight="500">Deposited</NewLabel>
          <NewLabel weight="600">
            {inputAmount}&nbsp;{pickedToken.symbol}
          </NewLabel>
        </NewLabel>
        <NewLabel display="flex" justifyContent="space-between" padding="10px 0">
          <NewLabel className="beginners" weight="500">
            Received
            <img className="help-icon" src={HelpIcon} alt="" data-tip data-for="min-help" />
          </NewLabel>
          <NewLabel weight="600">
            {pickedToken.default ? (
              formatNumberWido(
                new BigNumber(amount).dividedBy(pricePerFullShare).toFixed(),
                WIDO_EXTEND_DECIMALS,
              )
            ) : quoteValue ? (
              <>
                {formatNumberWido(
                  fromWei(
                    quoteValue.toTokenAmount,
                    token.decimals || token.data.lpTokenData.decimals,
                  ),
                  WIDO_EXTEND_DECIMALS,
                )}
              </>
            ) : (
              <AnimatedDots />
            )}
            &nbsp;{`f${tokenSymbol}`}
          </NewLabel>
        </NewLabel>
      </NewLabel>

      <FTokenInfo isShow={showDesc ? 'true' : 'false'}>
        <NewLabel marginRight="12px" display="flex">
          <div>
            <img src={CheckIcon} alt="" />
          </div>
          <NewLabel marginLeft="12px">
            <NewLabel color="#027A48" size="14px" height="20px" weight="600" marginBottom="4px">
              Deposit Complete!
            </NewLabel>
            <NewLabel color="#027A48" size="14px" height="20px" weight="400" marginBottom="5px">
              You are now earning yield on your deposit.
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

      <NewLabel size="16px" height="21px" weight={500} color="#1F2937" marginTop="25px">
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
export default DepositResult
