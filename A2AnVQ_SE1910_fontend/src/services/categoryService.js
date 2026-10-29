// Võ Quốc An - ce190460
import api from './api';

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/categories/active');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (category) => {
    const name = (category.name || '').trim();
    if (!name) {
      throw new Error('Category name is required.');
    }

    const payload = {
      name,
      description: (category.description || '').trim(),
      status: Number(category.status) === 0 ? 0 : 1
    };

    const response = await api.post('/categories', payload);
    return response.data;
  },

  update: async (id, category) => {
    const name = (category.name || '').trim();
    if (!name) {
      throw new Error('Category name is required.');
    }

    const payload = {
      name,
      description: (category.description || '').trim(),
      status: Number(category.status) === 0 ? 0 : 1
    };

    const response = await api.put(`/categories/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  search: (list, keyword) => {
    if (!keyword || !keyword.trim()) return list;
    const norm = keyword.trim().toLowerCase();
    return list.filter(item => 
      (item.name && item.name.toLowerCase().includes(norm)) ||
      (item.description && item.description.toLowerCase().includes(norm))
    );
  }
};
