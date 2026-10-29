// Võ Quốc An - ce190460
import React, { useState } from 'react';
import logoSvg from '../assets/logo.svg';
import { authService } from '../services/authService';

export default function LoginPage({ onLoginSuccess, onBrowsePublic }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Email or username is required.';
    }
    if (!password.trim()) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authService.login(username, password);
      setIsSubmitting(false);

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setAuthError(result.message);
      }
    } catch (err) {
      setIsSubmitting(false);
      setAuthError(err.message || 'Authentication failed. Please verify server connection.');
    }
  };

  // Quick fill helper for grading convenience
  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrors({});
    setAuthError('');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="text-center mb-4">
          <img src={logoSvg} alt="FU News Logo" className="login-logo" />
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
            FU News Management
          </h2>
          <p className="text-muted small">Sign in with Email & Password or Username</p>
        </div>

        {authError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-3" role="alert">
            <i className="bi bi-exclamation-octagon-fill fs-5"></i>
            <div>{authError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email / Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="e.g. admin@fu.edu.vn or Admin"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
                autoFocus
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating with Backend...</span>
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link text-decoration-none small text-primary p-0"
            onClick={onBrowsePublic}
          >
            <i className="bi bi-newspaper me-1"></i>
            Browse Public News (No login required)
          </button>
        </div>

        <div className="mt-4 pt-3 border-top text-center">
          <p className="text-muted small mb-2">Quick Test Accounts (MS SQL Server DB):</p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleQuickFill('admin@fu.edu.vn', 'Admin')}
            >
              Admin: <strong>admin@fu.edu.vn</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleQuickFill('anv@fu.edu.vn', '123456')}
            >
              Staff: <strong>anv@fu.edu.vn</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
