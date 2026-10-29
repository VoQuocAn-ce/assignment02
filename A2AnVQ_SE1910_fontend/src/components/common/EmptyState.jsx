// Võ Quốc An - ce190460
import React from 'react';
export default function EmptyState({
  icon = 'bi-inbox',
  title = 'No records found',
  description = 'There are no items matching your criteria.',
  actionLabel,
  onAction
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h6 className="empty-state-title">{title}</h6>
      <p className="small mb-3">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
