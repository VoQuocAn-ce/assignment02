// Võ Quốc An - ce190460
import React, { useState } from 'react';
import { userService } from '../services/userService';
import ToastAlert from '../components/common/ToastAlert';
import { ROLE } from '../services/mockData';

export default function SettingsPage({ currentUser, onUpdateProfile }) {
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [fullName, setFullName] = useState(currentUser?.fullName || currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdmin = currentUser?.role === ROLE.ADMIN;

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setToast({ message: 'Email address cannot be empty.', type: 'danger' });
      return;
    }

    if (password && password !== confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'danger' });
      return;
    }

    setIsUpdating(true);
    try {
      const payload = {
        username: currentUser.username,
        fullName: fullName.trim() || currentUser.username,
        email: email.trim(),
        role: currentUser.role,
        status: 1
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      const updated = await userService.update(currentUser.id, payload);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setPassword('');
      setConfirmPassword('');
      if (onUpdateProfile) {
        onUpdateProfile({ ...currentUser, ...updated });
      }
    } catch (err) {
      setToast({ message: err.message, type: 'danger' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="row g-4">
        {/* User Profile Overview */}
        <div className="col-12 col-lg-5">
          <div className="custom-card">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-person-circle me-2 text-primary"></i>
                Profile Information
              </h3>
            </div>
            <div className="p-3">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="avatar-circle fs-4" style={{ width: '56px', height: '56px' }}>
                  {(currentUser?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="m-0 fw-bold">{currentUser?.fullName || currentUser?.username}</h5>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className={isAdmin ? 'badge-admin' : 'badge-staff'}>
                      {isAdmin ? 'Administrator' : 'Staff Member'}
                    </span>
                    <span className="text-muted small">@{currentUser?.username}</span>
                  </div>
                </div>
              </div>

              <div className="list-group list-group-flush border-top border-bottom small mb-3">
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Account ID</span>
                  <span className="fw-semibold">#{currentUser?.id}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Email Address</span>
                  <span className="fw-semibold">{currentUser?.email}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">System Role</span>
                  <span className="fw-semibold">{isAdmin ? 'Admin (Role ID: 1)' : 'Staff (Role ID: 2)'}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Database Server</span>
                  <span className="fw-semibold text-success">MS SQL Server (Connected)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="col-12 col-lg-7">
          <div className="custom-card mb-4">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-pencil-square me-2 text-primary"></i>
                Update Profile & Password
              </h3>
            </div>
            <div className="p-3">
              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Username (Read-only)</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={currentUser?.username || ''}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Leave blank to keep unchanged"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg"></i>
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
