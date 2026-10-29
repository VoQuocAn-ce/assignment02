// Võ Quốc An - ce190460
import React from 'react';
import Modal from './Modal';
export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      maxWidth="460px"
      footer={
        <>
          <button 
            type="button" 
            className="btn btn-secondary px-3" 
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button 
            type="button" 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} px-3`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="d-flex gap-3 align-items-start">
        <div className="text-danger fs-2" style={{ lineHeight: 1 }}>
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div>
          <p className="mb-2 text-secondary">{message}</p>
          {itemName && (
            <div className="p-2 bg-light rounded border text-dark fw-semibold small">
              {itemName}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
