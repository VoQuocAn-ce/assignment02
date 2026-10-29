// Võ Quốc An - ce190460
import api from './api';
import { STORAGE_KEYS, saveStorage, ROLE } from './mockData';

export const authService = {
  // Login with email or username and password via Backend REST API
  login: async (usernameOrEmail, password) => {
    const trimmedUser = (usernameOrEmail || '').trim();
    const trimmedPass = (password || '').trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, message: 'Please enter both username/email and password.' };
    }

    try {
      const response = await api.post('/auth/login', {
        username: trimmedUser,
        email: trimmedUser,
        password: trimmedPass
      });

      if (response.data && response.data.success) {
        const userSession = response.data.user;
        saveStorage(STORAGE_KEYS.AUTH, userSession);
        return { success: true, user: userSession };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Login failed.'
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Invalid credentials or server unreachable.'
      };
    }
  },

  // Logout clears current session
  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  // Get current active session
  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  }
};
