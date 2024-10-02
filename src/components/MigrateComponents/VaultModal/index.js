import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { BsArrowDown } from 'react-icons/bs'
import { FTokenInfo, NewLabel, IconCard, ImgBtn } from '../PositionModal/style'
import { useThemeContext } from '../../../providers/useThemeContext'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import AnimatedDots from '../../AnimatedDots'
import { formatNetworkName } from '../../../utilities/formats'
import VaultList from '../VaultList'
import { getMatchedVaultList } from '../../../utilities/parsers'

const VaultModal = ({
  showVaultModal,
  setShowVaultModal,
  networkName,
  setHighestApyVault,
  setHighestVaultAddress,
  filteredFarmList,
  chainId,
  isMobile,
  currencySym,
  setIsFromModal,
  stopPropagation,
  groupOfVaults,
  vaultsData,
  pools,
}) => {
  const { darkMode, inputFontColor, fontColor } = useThemeContext()
  const [countFarm, setCountFarm] = useState(0)
  const [mathchVaultList, setMatchVaultList] = useState()

  useEffect(() => {
    let matchingList = []
    if (chainId) {
      matchingList = getMatchedVaultList(groupOfVaults, chainId, vaultsData, pools)
    }
    setMatchVaultList(matchingList)
    setCountFarm(matchingList.length)
  }, [chainId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      show={showVaultModal}
      // onHide={onClose}
      dialogClassName="migrate-modal-notification"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="migrate-position-modal-header">
        <FTokenInfo>
          <div className="modal-header-part">
            <NewLabel margin="auto 16px auto 0px">
              <IconCard bgColor="linear-gradient(90deg, #ffd6a6 0%, #a1b5ff 48.9%, #73df88 100%)">
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel align="left" marginRight="12px">
              <NewLabel
                color={darkMode ? '#ffffff' : '#262525'}
                size={isMobile ? '18px' : '18px'}
                height={isMobile ? '28px' : '28px'}
                weight="600"
                marginBottom="4px"
              >
                Choose new Strategy
              </NewLabel>
              <NewLabel
                color={fontColor}
                size={isMobile ? '14px' : '14px'}
                height={isMobile ? '20px' : '20px'}
                weight="400"
                marginBottom="5px"
              >
                Pick a destination strategy
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
                setShowVaultModal(false)
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
            {mathchVaultList.map((item, i) => {
              return (
                <VaultList
                  key={i}
                  matchVault={item}
                  currencySym={currencySym}
                  networkName={networkName}
                  setShowVaultModal={setShowVaultModal}
                  setHighestVaultAddress={setHighestVaultAddress}
                  setHighestApyVault={setHighestApyVault}
                  setIsFromModal={setIsFromModal}
                  stopPropagation={stopPropagation}
                  darkMode={darkMode}
                  filteredFarmList={filteredFarmList}
                />
              )
            })}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default VaultModal
