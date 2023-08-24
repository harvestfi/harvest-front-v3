import { useMediaQuery } from 'react-responsive'
import React, { useState } from 'react'
import CheckIcon from '../../../../assets/images/logos/beginners/success-check.svg'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import { Buttons, ImgBtn, NewLabel, Section, FTokenInfo } from './style'

const UnstakeResult = ({ finalStep, setFinalStep, inputAmount, setInputAmount, tokenSymbol }) => {
  const [showDesc, setShowDesc] = useState(true)

  const onClose = () => {
    setInputAmount(0)
    setFinalStep(false)
  }
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <Section show={finalStep}>
      <NewLabel
        color="#101828"
        size={isMobile ? '14px' : '16px'}
        weight="600"
        height={isMobile ? '21px' : '28px'}
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
          <NewLabel weight="500">Unstaked</NewLabel>
          <NewLabel weight="600">
            {inputAmount}&nbsp;f{tokenSymbol}
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
              Unstaking Complete!
            </NewLabel>
            <NewLabel
              color="#027A48"
              size={isMobile ? '10px' : '14px'}
              height={isMobile ? '15px' : '20px'}
              weight="400"
              marginBottom="5px"
            >
              You have successfully unstaked {inputAmount} f{tokenSymbol}.
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
    </Section>
  )
}
export default UnstakeResult
