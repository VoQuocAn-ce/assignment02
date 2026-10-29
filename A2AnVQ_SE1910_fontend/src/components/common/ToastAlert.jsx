// Võ Quốc An - ce190460
import React, { useEffect } from 'react';
export default function ToastAlert({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '24px',
        zIndex: 9999,
        minWidth: '280px',
        maxWidth: '420px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      className={`alert alert-${isSuccess ? 'success' : 'danger'} alert-dismissible fade show d-flex align-items-center gap-2 mb-0 py-2 px-3 rounded-3`}
      role="alert"
    >
      <i className={`bi bi-${isSuccess ? 'check-circle-fill' : 'exclamation-circle-fill'} fs-5`}></i>
      <div className="flex-grow-1 small fw-medium">{message}</div>
      <button
        type="button"
        className="btn-close"
        style={{ padding: '0.75rem' }}
        aria-label="Close"
        onClick={onClose}
      />
    </div>
  );
}
