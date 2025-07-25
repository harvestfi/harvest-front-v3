import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Modal from 'react-bootstrap/Modal'
import { BsArrowDown } from 'react-icons/bs'
import { useWallet } from '../../../../providers/Wallet'
import {
  SelectTokenWido,
  FilterInput,
  NewLabel,
  Search,
  NotConnectedWallet,
  ImgBtn,
  FTokenInfo,
  FTokenDiv,
  IconCard,
} from './style'
import SelectTokenList from '../SelectTokenList'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import SearchIcon from '../../../../assets/images/logos/beginners/search.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'
import { useThemeContext } from '../../../../providers/useThemeContext'

const WithdrawSelectToken = ({
  selectToken,
  setSelectToken,
  setPickedToken,
  supTokenNoBalanceList,
  balanceList,
  defaultToken,
  soonToSupList,
  supportedVault,
  hasPortalsError,
}) => {
  const {
    darkMode,
    bgColor,
    borderColor,
    fontColor,
    fontColor1,
    fontColor2,
    modalInputColor,
    inputBorderColor,
    inputFontColor,
  } = useThemeContext()
  const { connected } = useWallet()
  const [filterWord, setFilterWord] = useState('')
  const [showDesc, setShowDesc] = useState(true)

  const onFilter = async e => {
    setFilterWord(e.target.value)
  }

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <Modal
      show={selectToken}
      // onHide={onClose}
      dialogClassName="modal-notification"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="token-select-modal-header">
        <FTokenInfo>
          <FTokenDiv>
            <NewLabel $margin="auto 0px">
              <IconCard>
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel $align="left" $marginright="12px">
              <NewLabel
                $fontcolor="#5dcf46"
                $size={isMobile ? '18px' : '18px'}
                $height={isMobile ? '28px' : '28px'}
                $weight="600"
                $marginbottom="4px"
              >
                Select Output Token
              </NewLabel>
              <NewLabel
                $fontcolor={fontColor1}
                $size={isMobile ? '14px' : '14px'}
                $height={isMobile ? '20px' : '20px'}
                $weight="400"
                $marginbottom="5px"
              >
                Revert your fTokens into selected output token.
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
              $darkmode={darkMode}
              $fontcolor="#667085"
              $align="center"
              onClick={() => {
                setSelectToken(false)
              }}
            >
              <ImgBtn src={CloseIcon} alt="" />
            </NewLabel>
          </NewLabel>
        </FTokenInfo>
        <NewLabel $darkmode={darkMode} $width="100%" $margintop="18px" $position="relative">
          <Search src={SearchIcon} />
          <FilterInput
            value={filterWord}
            placeholder="Find tokens by name or address"
            onChange={onFilter}
            $inputbordercolor={inputBorderColor}
            $modalinputcolor={modalInputColor}
            $fontcolor={inputFontColor}
          />
        </NewLabel>
      </Modal.Header>
      <Modal.Body className="token-select-modal-body">
        <SelectTokenWido>
          <NewLabel $heightdiv="100%" $divscroll="scroll" $padding={connected ? '0px' : '25px'}>
            {connected ? (
              <SelectTokenList
                balanceList={balanceList}
                supTokenNoBalanceList={supTokenNoBalanceList}
                defaultToken={defaultToken}
                soonToSupList={soonToSupList}
                setPickedToken={setPickedToken}
                setSelectToken={setSelectToken}
                filterWord={filterWord}
                supportedVault={supportedVault}
                hasPortalsError={hasPortalsError}
              />
            ) : (
              <NotConnectedWallet
                $isshow={showDesc ? 'true' : 'false'}
                $bgcolor={bgColor}
                $bordercolor={borderColor}
              >
                <NewLabel $darkmode={darkMode} $marginright="12px" $display="flex">
                  <div>
                    <img width={isMobile ? '21px' : '21px'} src={InfoIcon} alt="" />
                  </div>
                  <NewLabel $marginleft={isMobile ? '12px' : '12px'}>
                    <NewLabel
                      $fontcolor={fontColor2}
                      $size={isMobile ? '14px' : '14px'}
                      $height={isMobile ? '20px' : '20px'}
                      $weight="600"
                      $marginbottom="4px"
                    >
                      Wallet not connected.
                    </NewLabel>
                    <NewLabel
                      $fontcolor={fontColor}
                      $size={isMobile ? '14px' : '14px'}
                      $height={isMobile ? '20px' : '20px'}
                      $weight="400"
                    >
                      Please connect wallet to see the list of available tokens to convert.
                    </NewLabel>
                  </NewLabel>
                </NewLabel>
                <NewLabel $darkmode={darkMode}>
                  <ImgBtn
                    src={CloseIcon}
                    alt=""
                    onClick={() => {
                      setShowDesc(false)
                    }}
                  />
                </NewLabel>
              </NotConnectedWallet>
            )}
          </NewLabel>
        </SelectTokenWido>
      </Modal.Body>
    </Modal>
  )
}
export default WithdrawSelectToken
