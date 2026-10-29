// Võ Quốc An - ce190460
import api from './api';

export const newsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getPublicActive: async () => {
    const response = await api.get('/news/public');
    return response.data;
  },

  getHistory: async (accountId) => {
    const response = await api.get(`/news/history/${accountId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (newsData) => {
    const title = (newsData.title || '').trim();
    const content = (newsData.content || '').trim();
    const categoryId = Number(newsData.categoryId);

    if (!title) throw new Error('News title is required.');
    if (!content) throw new Error('News content is required.');
    if (!categoryId) throw new Error('Please select a valid category.');

    const payload = {
      title,
      headline: (newsData.headline || title).trim(),
      content,
      newsSource: (newsData.newsSource || 'FU Newsroom').trim(),
      categoryId,
      createdBy: newsData.createdBy,
      createdById: newsData.createdById,
      status: Number(newsData.status) === 0 ? 0 : 1,
      tags: (newsData.tags || '').trim()
    };

    const response = await api.post('/news', payload);
    return response.data;
  },

  update: async (id, newsData) => {
    const title = (newsData.title || '').trim();
    const content = (newsData.content || '').trim();
    const categoryId = Number(newsData.categoryId);

    if (!title) throw new Error('News title is required.');
    if (!content) throw new Error('News content is required.');
    if (!categoryId) throw new Error('Please select a valid category.');

    const payload = {
      title,
      headline: (newsData.headline || title).trim(),
      content,
      newsSource: (newsData.newsSource || 'FU Newsroom').trim(),
      categoryId,
      createdById: newsData.createdById,
      status: Number(newsData.status) === 0 ? 0 : 1,
      tags: (newsData.tags || '').trim()
    };

    const response = await api.put(`/news/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  search: (list, keyword = '', categoryFilter = 'ALL', statusFilter = 'ALL') => {
    if (!list) return [];
    let result = [...list];

    if (keyword && keyword.trim()) {
      const norm = keyword.trim().toLowerCase();
      result = result.filter(item =>
        (item.title && item.title.toLowerCase().includes(norm)) ||
        (item.content && item.content.toLowerCase().includes(norm)) ||
        (item.tags && item.tags.toLowerCase().includes(norm)) ||
        (item.createdBy && item.createdBy.toLowerCase().includes(norm))
      );
    }

    if (categoryFilter !== 'ALL') {
      const catId = Number(categoryFilter);
      result = result.filter(item => Number(item.categoryId) === catId);
    }

    if (statusFilter !== 'ALL') {
      const stat = Number(statusFilter);
      result = result.filter(item => Number(item.status) === stat);
    }

    return result;
  }
};
