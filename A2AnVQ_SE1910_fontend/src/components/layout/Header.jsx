// Võ Quốc An - ce190460
import React from 'react';
import { ROLE } from '../../services/mockData';
export default function Header({ pageTitle, currentUser, onLogout }) {
  const isAdmin = currentUser?.role === ROLE.ADMIN;

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <div className="user-badge">
          <div className="avatar-circle">
            {(currentUser?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="d-none d-sm-block text-start">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold small text-dark">
                {currentUser?.fullName || currentUser?.username}
              </span>
              <span className={isAdmin ? 'badge-admin' : 'badge-staff'}>
                {isAdmin ? 'Admin' : 'Staff'}
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {currentUser?.email || 'admin@fu.edu.vn'}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
          onClick={onLogout}
          title="Sign out of system"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="d-none d-md-inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
