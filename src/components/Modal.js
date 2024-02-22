import React from 'react'
import Modal from 'react-bootstrap/Modal'

const MainModal = ({ title, open, onClose, children, confirmationLabel }) => (
  <Modal
    show={open}
    onHide={onClose}
    dialogClassName="modal-notification welcome-modal-dialog"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="example-custom-modal-styling-title">{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer>
      <button type="button" className="confirm" onClick={onClose}>
        {confirmationLabel}
      </button>
    </Modal.Footer>
  </Modal>
)

export default MainModal
