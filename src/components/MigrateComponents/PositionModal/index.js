import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { BsArrowDown } from 'react-icons/bs'
import { useThemeContext } from '../../../providers/useThemeContext'
import { FTokenInfo, NewLabel, IconCard, ImgBtn } from './style'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import AnimatedDots from '../../AnimatedDots'
import { formatNetworkName } from '../../../utilities/formats'
import PositionList from '../PositionList'
import { usePortals } from '../../../providers/Portals'

const PositionModal = ({
  showPositionModal,
  setShowPositionModal,
  networkName,
  setPositionVaultAddress,
  filteredFarmList,
  chain,
  isMobile,
  currencySym,
  setHighestPosition,
  setIsFromModal,
  stopPropagation,
  token,
  setId,
  setToken,
  groupOfVaults,
  setCurSupportedVault,
  setNetworkMatchList,
  networkMatchList,
  setNoPosition,
  connected,
  currencyRate,
}) => {
  const [countFarm, setCountFarm] = useState(0)

  const { darkMode, inputFontColor, fontColor } = useThemeContext()

  const { getPortalsSupport } = usePortals()

  useEffect(() => {
    setNetworkMatchList([])
    setNoPosition(false)
  }, [connected])

  useEffect(() => {
    setNetworkMatchList([])
  }, [chain])

  useEffect(() => {
    const matchListAry = []
    if (filteredFarmList.length > 0) {
      filteredFarmList.forEach(vault => {
        const findingChain = vault.token.chain
        if (Number(findingChain) === Number(chain)) {
          matchListAry.push(vault)
        }
        matchListAry.sort((a, b) => b.balance - a.balance)
      })

      if (matchListAry.length > 0) {
        setNoPosition(false)
        setNetworkMatchList(matchListAry)
        setCountFarm(matchListAry.length)
      }

      if (matchListAry.length === 0) {
        setNetworkMatchList([])
        setNoPosition(true)
      }
    }
  }, [chain, filteredFarmList])

  useEffect(() => {
    async function fetchData() {
      if (token) {
        const tokenAddress = token.vaultAddress || token.tokenAddress
        const chainId = token.chain || token.data.chain

        const portalsToken = await getPortalsSupport(chainId, tokenAddress)
        if (portalsToken) {
          if (portalsToken.status === 200) {
            if (portalsToken.data.totalItems === 0) {
              setCurSupportedVault(false)
            } else {
              setCurSupportedVault(true)
            }
          }
        }
      }
    }

    fetchData()
  }, [token])

  const positions = networkMatchList.map((item, i) => {
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
        setId={setId}
        setToken={setToken}
        groupOfVaults={groupOfVaults}
        currencyRate={currencyRate}
      />
    )
  })

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
            <NewLabel $margin="auto 16px auto 0px">
              <IconCard $bgcolor="#5dcf46">
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
                Choose Position
              </NewLabel>
              <NewLabel
                $fontcolor={fontColor}
                $size={isMobile ? '14px' : '14px'}
                $height={isMobile ? '20px' : '20px'}
                $weight="400"
                $marginbottom="5px"
              >
                Displaying positions with any amount of unstaked fTokens.
              </NewLabel>
            </NewLabel>
          </div>
          <NewLabel>
            <NewLabel
              $display="flex"
              $marginbottom={isMobile ? '18px' : '18px'}
              $width="fit-content"
              $cursortype="pointer"
              $weight="600"
              $size={isMobile ? '14px' : '14px'}
              $height={isMobile ? '20px ' : '20px'}
              $darkmode={darkMode}
              $fontcolor={inputFontColor}
              $align="center"
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
            $fontcolor={fontColor}
            $size={isMobile ? '12px' : '12px'}
            $height={isMobile ? '20px' : '20px'}
            $weight="400"
            $padding="15px"
            $borderbottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
            $display="flex"
            $justifycontent="center"
          >
            Loading Position List
            <AnimatedDots />
          </NewLabel>
        ) : (
          <>
            <NewLabel
              $fontcolor={fontColor}
              $size={isMobile ? '12px' : '12px'}
              $height={isMobile ? '20px' : '20px'}
              $weight="400"
              $padding="15px"
              $borderbottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
            >
              {`${countFarm} eligible positions found on ${formatNetworkName(networkName)}`}
            </NewLabel>
            {positions}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default PositionModal
