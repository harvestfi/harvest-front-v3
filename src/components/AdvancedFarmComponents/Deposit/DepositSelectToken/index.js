import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Modal from 'react-bootstrap/Modal'
import { BsArrowDown } from 'react-icons/bs'
import { useWallet } from '../../../../providers/Wallet'
import {
  SelectTokenWido,
  // CloseBtn,
  FilterInput,
  NewLabel,
  Search,
  NotConnectedWallet,
  ImgBtn,
  FTokenInfo,
  IconCard,
} from './style'
import SelectTokenList from '../SelectTokenList'
import CloseIcon from '../../../../assets/images/logos/beginners/close.svg'
import SearchIcon from '../../../../assets/images/logos/beginners/search.svg'
import InfoIcon from '../../../../assets/images/logos/beginners/info-circle.svg'

const DepositSelectToken = ({
  selectToken,
  setSelectToken,
  setPickedToken,
  setBalance,
  // supTokenList,
  soonToSupList,
  supTokenNoBalanceList,
  balanceList,
  defaultToken,
  setPartHeight,
}) => {
  const { connected } = useWallet()
  const [filterWord, setFilterWord] = useState('')
  const [showDesc, setShowDesc] = useState(true)

  const onFilter = async e => {
    setFilterWord(e.target.value)
  }

  useEffect(() => {
    if (selectToken) {
      setPartHeight(350) // Set fixed height for select token part
    }
  }, [selectToken, setPartHeight])

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
          <>
            <NewLabel margin="auto 0px">
              <IconCard>
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel align="left" marginRight="12px">
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
                Convert your crypto into interest-bearing fToken
              </NewLabel>
            </NewLabel>
          </>
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
                setSelectToken(false)
                setPartHeight(null)
              }}
            >
              <ImgBtn src={CloseIcon} alt="" />
            </NewLabel>
          </NewLabel>
        </FTokenInfo>
        <NewLabel width="100%" marginTop="18px" position="relative">
          <Search src={SearchIcon} />
          <FilterInput
            value={filterWord}
            placeholder="Search for ticker or full name"
            onChange={onFilter}
          />
        </NewLabel>
      </Modal.Header>
      <Modal.Body className="token-select-modal-body">
        <SelectTokenWido>
          <NewLabel heightDiv="100%" divScroll="scroll" padding={isMobile ? '9px 12px 0' : '0px'}>
            {connected ? (
              <SelectTokenList
                balanceList={balanceList}
                supTokenNoBalanceList={supTokenNoBalanceList}
                defaultToken={defaultToken}
                soonToSupList={soonToSupList}
                setPickedToken={setPickedToken}
                setBalance={setBalance}
                setSelectToken={setSelectToken}
                setPartHeight={setPartHeight}
                filterWord={filterWord}
              />
            ) : (
              <NotConnectedWallet isShow={showDesc ? 'true' : 'false'}>
                <NewLabel marginRight="12px" display="flex">
                  <div>
                    <img width={isMobile ? '15px' : '21px'} src={InfoIcon} alt="" />
                  </div>
                  <NewLabel marginLeft={isMobile ? '9px' : '12px'}>
                    <NewLabel
                      color="#344054"
                      size={isMobile ? '10px' : '14px'}
                      height={isMobile ? '15px' : '20px'}
                      weight="600"
                      marginBottom="4px"
                    >
                      Wallet not connected.
                    </NewLabel>
                    <NewLabel
                      color="#475467"
                      size={isMobile ? '10px' : '14px'}
                      height={isMobile ? '15px' : '20px'}
                      weight="400"
                    >
                      Please connect wallet to see the list of available tokens to deposit.
                    </NewLabel>
                  </NewLabel>
                </NewLabel>
                <div>
                  <ImgBtn
                    src={CloseIcon}
                    alt=""
                    onClick={() => {
                      setShowDesc(false)
                    }}
                  />
                </div>
              </NotConnectedWallet>
            )}
          </NewLabel>
        </SelectTokenWido>
      </Modal.Body>
    </Modal>
  )
}
export default DepositSelectToken
