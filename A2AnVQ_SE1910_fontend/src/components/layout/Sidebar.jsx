// Võ Quốc An - ce190460
import React from 'react';
import logoSvg from '../../assets/logo.svg';
import { ROLE } from '../../services/mockData';

export default function Sidebar({ activeTab, onSelectTab, currentUser, onLogout }) {
  const isAdmin = currentUser?.role === ROLE.ADMIN;
  const isStaff = currentUser?.role === ROLE.STAFF;

  // Role-based navigation items according to assignment instructions
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', show: true },
    { key: 'users', label: 'Account Management', icon: 'bi-people-fill', show: isAdmin },
    { key: 'categories', label: 'Categories', icon: 'bi-folder-fill', show: isStaff },
    { key: 'news', label: 'News Articles', icon: 'bi-newspaper', show: isStaff },
    { key: 'history', label: 'My News History', icon: 'bi-clock-history', show: isStaff },
    { key: 'settings', label: isStaff ? 'My Profile' : 'Settings', icon: 'bi-person-badge-fill', show: true }
  ];

  const visibleItems = menuItems.filter(item => item.show);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logoSvg} alt="FU News Logo" className="sidebar-logo" />
        <div>
          <h2 className="sidebar-title">FU News</h2>
          <p className="sidebar-subtitle">
            {isAdmin ? 'Admin Console' : 'Staff Workspace'}
          </p>
        </div>
      </div>

      <ul className="sidebar-menu">
        {visibleItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <li key={item.key} className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.key)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="small text-secondary mb-2" style={{ fontSize: '0.75rem' }}>
          Role: <strong className="text-light">{isAdmin ? 'Administrator (1)' : 'Staff (2)'}</strong>
        </div>
        <button
          type="button"
          className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onLogout}
        >
          <i className="bi bi-power"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
