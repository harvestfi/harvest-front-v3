import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { BsArrowDown } from 'react-icons/bs'
import { useThemeContext } from '../../../providers/useThemeContext'
import { FTokenInfo, NewLabel, IconCard, ImgBtn } from './style'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import AnimatedDots from '../../AnimatedDots'
import { formatNetworkName } from '../../../utilities/formats'
import PositionList from '../PositionList'

const PositionModal = ({
  showPositionModal,
  setShowPositionModal,
  networkName,
  setPositionVaultAddress,
  filteredFarmList,
  chainId,
  isMobile,
  currencySym,
  setHighestPosition,
  setIsFromModal,
  stopPropagation,
}) => {
  const [countFarm, setCountFarm] = useState(0)
  const [networkMatchList, setNetworkMatchList] = useState()
  const { darkMode, inputFontColor, fontColor } = useThemeContext()

  useEffect(() => {
    const matchListAry = []
    if (filteredFarmList.length > 0) {
      filteredFarmList.forEach(vault => {
        const findingChain = vault.token.poolVault ? vault.token.data.chain : vault.token.chain
        if (Number(findingChain) === chainId) {
          matchListAry.push(vault)
        }
      })
    }

    if (matchListAry.length > 0) {
      setCountFarm(matchListAry.length)
      setNetworkMatchList(matchListAry)
    }
  }, [chainId, filteredFarmList, countFarm])

  return (
    <Modal
      show={showPositionModal}
      // onHide={onClose}
      dialogClassName="migrate-modal-notification"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="migrate-position-modal-header">
        <FTokenInfo>
          <div className="modal-header-part">
            <NewLabel margin="auto 16px auto 0px">
              <IconCard bgColor="#6988ff">
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel align="left" marginRight="12px">
              <NewLabel
                color="#6988FF"
                size={isMobile ? '18px' : '18px'}
                height={isMobile ? '28px' : '28px'}
                weight="600"
                marginBottom="4px"
              >
                Choose Position
              </NewLabel>
              <NewLabel
                color={fontColor}
                size={isMobile ? '14px' : '14px'}
                height={isMobile ? '20px' : '20px'}
                weight="400"
                marginBottom="5px"
              >
                Pick existing position to migrate
              </NewLabel>
            </NewLabel>
          </div>
          <NewLabel>
            <NewLabel
              display="flex"
              marginBottom={isMobile ? '18px' : '18px'}
              width="fit-content"
              cursorType="pointer"
              weight="600"
              size={isMobile ? '14px' : '14px'}
              height={isMobile ? '20px ' : '20px'}
              darkMode={darkMode}
              color={inputFontColor}
              align="center"
              onClick={() => {
                setShowPositionModal(false)
              }}
            >
              <ImgBtn src={CloseIcon} alt="" />
            </NewLabel>
          </NewLabel>
        </FTokenInfo>
      </Modal.Header>
      <Modal.Body className="migrate-position-modal-body">
        {countFarm === 0 ? (
          <NewLabel
            color={fontColor}
            size={isMobile ? '12px' : '12px'}
            height={isMobile ? '20px' : '20px'}
            weight="400"
            padding="15px"
            borderBottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
            display="flex"
            justifyContent="center"
          >
            Loading Position List
            <AnimatedDots />
          </NewLabel>
        ) : (
          <>
            <NewLabel
              color={fontColor}
              size={isMobile ? '12px' : '12px'}
              height={isMobile ? '20px' : '20px'}
              weight="400"
              padding="15px"
              borderBottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
            >
              {`${countFarm} Opportunities found on ${formatNetworkName(networkName)}`}
            </NewLabel>
            {networkMatchList.map((item, i) => {
              return (
                <PositionList
                  key={i}
                  matchVault={item}
                  currencySym={currencySym}
                  networkName={networkName}
                  setShowPositionModal={setShowPositionModal}
                  setPositionVaultAddress={setPositionVaultAddress}
                  setHighestPosition={setHighestPosition}
                  setIsFromModal={setIsFromModal}
                  stopPropagation={stopPropagation}
                  darkMode={darkMode}
                />
              )
            })}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default PositionModal
