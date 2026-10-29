// Võ Quốc An - ce190460
import React, { useState, useEffect, useMemo } from 'react';
import { userService } from '../services/userService';
import { ROLE } from '../services/mockData';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ToastAlert from '../components/common/ToastAlert';

export default function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: ROLE.STAFF,
    status: 1,
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load accounts from Backend API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Filtered displayed list based on search and filters
  const displayedUsers = useMemo(() => {
    return userService.search(users, searchKeyword, roleFilter, statusFilter);
  }, [users, searchKeyword, roleFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: ROLE.STAFF,
      status: 1,
      password: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName || user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username / Account Name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Invalid email format (e.g. user@fu.edu.vn).';
      }
    }
    if (modalMode === 'create' && !formData.password.trim()) {
      errors.password = 'Password is required for new accounts.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form via Backend API
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        const created = await userService.create(formData);
        setUsers(prev => [...prev, created]);
        showToast(`User account "${created.username}" created successfully!`, 'success');
      } else {
        const updated = await userService.update(selectedUser.id, formData);
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        showToast(`User account "${updated.username}" updated successfully!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  // Confirm Delete via Backend API
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await userService.delete(userToDelete.id, currentUser?.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      showToast(`User account "${userToDelete.username}" deleted successfully!`, 'success');
      setIsDeleteOpen(false);
      setUserToDelete(null);
    } catch (err) {
      showToast(err.message, 'danger');
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="custom-card">
        <div className="card-header-clean">
          <div>
            <h3 className="card-title-clean">Account Management</h3>
            <p className="text-muted small m-0">Admin role control: Manage Staff and Administrator credentials</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add Account</span>
          </button>
        </div>

        <div className="p-3">
          {/* Filters and Search Bar */}
          <div className="row g-2 mb-3">
            <div className="col-12 col-md-6">
              <div className="search-input-wrapper w-100">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search accounts by username, full name, or email..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchKeyword('')}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value={ROLE.ADMIN}>Administrators (Role: 1)</option>
                <option value={ROLE.STAFF}>Staff Members (Role: 2)</option>
              </select>
            </div>

            <div className="col-6 col-md-3 text-md-end text-muted small d-flex align-items-center justify-content-md-end">
              {loading ? (
                <span>Loading accounts...</span>
              ) : (
                <>Showing <strong>{displayedUsers.length}</strong> of {users.length} accounts</>
              )}
            </div>
          </div>

          {/* Table or Empty State */}
          {displayedUsers.length === 0 ? (
            <EmptyState
              icon={searchKeyword || roleFilter !== 'ALL' ? 'bi-search' : 'bi-people'}
              title={searchKeyword || roleFilter !== 'ALL' ? 'No users matched' : 'No user accounts'}
              description="No user account matches your criteria."
              actionLabel="Add New Account"
              onAction={handleOpenCreate}
            />
          ) : (
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Username / Name</th>
                    <th>Email Address</th>
                    <th style={{ width: '130px' }}>Role</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ width: '100px' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted fw-bold">#{item.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-circle-sm">
                            {(item.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{item.fullName || item.username}</div>
                            <div className="text-muted small">@{item.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted small">
                        <i className="bi bi-envelope me-1"></i>
                        {item.email}
                      </td>
                      <td>
                        <span className={item.role === ROLE.ADMIN ? 'badge-admin' : 'badge-staff'}>
                          <i className={`bi bi-${item.role === ROLE.ADMIN ? 'shield-lock-fill' : 'person-badge'}`}></i>
                          {item.role === ROLE.ADMIN ? 'Admin (1)' : 'Staff (2)'}
                        </span>
                      </td>
                      <td>
                        <span className={item.status === 1 ? 'badge-active' : 'badge-inactive'}>
                          <i className={`bi bi-${item.status === 1 ? 'check-circle-fill' : 'dash-circle'}`}></i>
                          {item.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary btn-action"
                            title="Edit Account"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger btn-action"
                            title="Delete Account"
                            disabled={currentUser && currentUser.id === item.id}
                            onClick={() => handleOpenDelete(item)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Popup Dialog */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Create New System Account' : `Edit Account #${selectedUser?.id}`}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary px-4"
              onClick={handleSubmitForm}
            >
              {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Account Name / Username <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
              placeholder="e.g. staff_nguyen"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (formErrors.username) setFormErrors({ ...formErrors, username: null });
              }}
              autoFocus
            />
            {formErrors.username && (
              <div className="invalid-feedback">{formErrors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Nguyen Van An"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. annv@fu.edu.vn"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: null });
              }}
            />
            {formErrors.email && (
              <div className="invalid-feedback">{formErrors.email}</div>
            )}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">System Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
              >
                <option value={ROLE.STAFF}>Staff (Role: 2)</option>
                <option value={ROLE.ADMIN}>Administrator (Role: 1)</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Password {modalMode === 'create' ? <span className="text-danger">*</span> : '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
              placeholder={modalMode === 'create' ? 'Enter password' : 'Enter new password'}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (formErrors.password) setFormErrors({ ...formErrors, password: null });
              }}
            />
            {formErrors.password && (
              <div className="invalid-feedback">{formErrors.password}</div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Account"
        message="Are you sure you want to delete this account? The account can only be deleted if it has not created any news articles."
        itemName={userToDelete ? `${userToDelete.fullName || userToDelete.username} (@${userToDelete.username})` : ''}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
