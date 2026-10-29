// Võ Quốc An - ce190460
import api from './api';
import { ROLE } from './mockData';

export const userService = {
  getAll: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const username = (userData.username || '').trim();
    const fullName = (userData.fullName || '').trim() || username;
    const email = (userData.email || '').trim();

    if (!username) throw new Error('Username is required.');
    if (!email) throw new Error('Email is required.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const payload = {
      username,
      fullName,
      email,
      role: Number(userData.role) === ROLE.STAFF ? ROLE.STAFF : ROLE.ADMIN,
      status: Number(userData.status) === 0 ? 0 : 1,
      password: userData.password || '123456'
    };

    const response = await api.post('/accounts', payload);
    return response.data;
  },

  update: async (id, userData) => {
    const fullName = (userData.fullName || '').trim();
    const email = (userData.email || '').trim();
    const username = (userData.username || '').trim();

    if (!email) throw new Error('Email is required.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const payload = {
      username,
      fullName: fullName || username,
      email,
      role: Number(userData.role) === ROLE.STAFF ? ROLE.STAFF : ROLE.ADMIN,
      status: Number(userData.status) === 0 ? 0 : 1,
      password: userData.password
    };

    const response = await api.put(`/accounts/${id}`, payload);
    return response.data;
  },

  delete: async (id, currentUserId) => {
    if (Number(id) === Number(currentUserId)) {
      throw new Error('You cannot delete your own currently logged-in account.');
    }
    const response = await api.delete(`/accounts/${id}`, {
      params: { currentUserId }
    });
    return response.data;
  },

  search: (list, keyword = '', roleFilter = 'ALL', statusFilter = 'ALL') => {
    if (!list) return [];
    let result = [...list];

    if (keyword && keyword.trim()) {
      const norm = keyword.trim().toLowerCase();
      result = result.filter(item =>
        (item.username && item.username.toLowerCase().includes(norm)) ||
        (item.fullName && item.fullName.toLowerCase().includes(norm)) ||
        (item.email && item.email.toLowerCase().includes(norm))
      );
    }

    if (roleFilter !== 'ALL') {
      const r = Number(roleFilter);
      result = result.filter(item => Number(item.role) === r);
    }

    if (statusFilter !== 'ALL') {
      const s = Number(statusFilter);
      result = result.filter(item => Number(item.status) === s);
    }

    return result;
  }
};
