import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { useMediaQuery } from 'react-responsive'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import InfoMsg from '../../../assets/images/logos/autopilot/info-msg.svg'
import Button from '../../Button'
import { FTokenInfo, FTokenDiv, BaseSection, NewLabel, ImgBtn, LearnLink } from './style'
import { useThemeContext } from '../../../providers/useThemeContext'

const DisclaimersModal = ({ modalShow, setModalShow }) => {
  const {
    fontColor,
    fontColor1,
    fontColor2,
    inputBorderColor,
    btnColor,
    btnHoverColor,
    btnActiveColor,
  } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  return (
    <Modal
      show={modalShow}
      // onHide={onClose}
      dialogClassName="modal-notification disclaimers-notification"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="deposit-modal-header disclaimers-modal">
        <FTokenInfo>
          <FTokenDiv>
            <NewLabel $margin="auto 0px">
              <img className="info-msg" src={InfoMsg} alt="info-msg" />
            </NewLabel>
            <NewLabel $align="left" $margin="auto">
              <NewLabel
                $fontcolor={fontColor1}
                $size={isMobile ? '18px' : '18px'}
                $height={isMobile ? '28px' : '28px'}
                $weight="600"
              >
                Disclaimers
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
                setModalShow(false)
              }}
            >
              <ImgBtn src={CloseIcon} alt="" />
            </NewLabel>
          </NewLabel>
        </FTokenInfo>
      </Modal.Header>
      <Modal.Body className="deposit-modal-body disclaimers-modal-body">
        <BaseSection>
          <NewLabel
            $size={isMobile ? '14px' : '14px'}
            $height={isMobile ? '24px' : '24px'}
            $padding="0px 24px 15px 24px"
            $fontcolor={fontColor2}
          >
            <NewLabel $height="20px">
              <NewLabel $fontcolor={fontColor2} $weight="500">
                General Disclaimer
              </NewLabel>
              <NewLabel $fontcolor={fontColor}>
                Autopilot is a non-custodial, smart contract-based tool. Harvest does not manage,
                control, or have access to user funds.
              </NewLabel>
            </NewLabel>
          </NewLabel>

          <NewLabel
            $size={isMobile ? '14px' : '14px'}
            $height={isMobile ? '24px' : '24px'}
            $padding="0px 24px 15px 24px"
            $fontcolor={fontColor2}
          >
            <NewLabel $height="20px">
              <NewLabel $fontcolor={fontColor2} $weight="500">
                Allocation mechanics
              </NewLabel>
              <NewLabel $fontcolor={fontColor}>
                All allocation processes are executed automatically via audited and pre-defined
                algorithms of&nbsp;
                <LearnLink
                  href="https://docs.harvest.finance/how-it-works/autopilots#technology-and-audits"
                  target="_blank"
                  rel="noopener noreferrer"
                  $linkcolor={fontColor}
                  $hovercolor={fontColor}
                >
                  IPOR Labs
                </LearnLink>
                .
              </NewLabel>
            </NewLabel>
          </NewLabel>

          <NewLabel
            $size={isMobile ? '14px' : '14px'}
            $height={isMobile ? '24px' : '24px'}
            $padding="0px 24px 15px 24px"
            $fontcolor={fontColor2}
          >
            <NewLabel $height="20px">
              <NewLabel $fontcolor={fontColor2} $weight="500">
                Vault Updates
              </NewLabel>
              <NewLabel $fontcolor={fontColor}>
                Harvest may add or remove sub-level vaults within Autopilot to maintain access to
                top-performing strategies.
              </NewLabel>
            </NewLabel>
          </NewLabel>

          <NewLabel $padding={isMobile ? '24px' : '24px'}>
            <Button
              $fontcolor="disclaimers-btn"
              $width="100%"
              $btncolor={btnColor}
              $btnhovercolor={btnHoverColor}
              $btnactivecolor={btnActiveColor}
              onClick={async () => {
                localStorage.setItem('firstAutopilot', false)
                setModalShow(false)
              }}
            >
              Acknowledge and Proceed
            </Button>
            <Button
              $fontcolor="autopilot-cancel"
              $width="100%"
              $btncolor={fontColor2}
              $bordercolor={inputBorderColor}
              onClick={async () => {
                setModalShow(false)
              }}
            >
              Cancel
            </Button>
          </NewLabel>
        </BaseSection>
      </Modal.Body>
    </Modal>
  )
}
export default DisclaimersModal
