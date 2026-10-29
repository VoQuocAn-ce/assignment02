// Võ Quốc An - ce190460
import React, { useEffect } from 'react';
export default function Modal({ isOpen, title, onClose, children, footer, maxWidth = '560px' }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-dialog-custom" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-custom">
          <h5 className="m-0 fw-bold">{title}</h5>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={onClose}
          />
        </div>
        <div className="modal-body-custom">
          {children}
        </div>
        {footer && (
          <div className="modal-footer-custom">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
