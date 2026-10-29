// Võ Quốc An - ce190460
import React, { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ToastAlert from '../components/common/ToastAlert';

export default function NewsManagement({ currentUser, showHistoryOnly = false }) {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter & Search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState(showHistoryOnly ? 'history' : 'all'); // 'all' | 'history'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedNews, setSelectedNews] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    content: '',
    newsSource: 'FU Newsroom',
    categoryId: '',
    createdBy: '',
    status: 1,
    tags: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load data from Backend API
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const catList = await categoryService.getAll();
      setCategories(catList);

      let articles;
      if (activeTab === 'history' && currentUser?.id) {
        articles = await newsService.getHistory(currentUser.id);
      } else {
        articles = await newsService.getAll();
      }
      setNewsList(articles);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper to get category name by ID
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === Number(catId));
    return cat ? cat.name : 'Unknown';
  };

  // Filtered displayed list based on search and filters
  const displayedNews = useMemo(() => {
    return newsService.search(newsList, searchKeyword, categoryFilter, statusFilter);
  }, [newsList, searchKeyword, categoryFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    setModalMode('create');
    setSelectedNews(null);
    setFormData({
      title: '',
      headline: '',
      content: '',
      newsSource: 'FU Newsroom',
      categoryId: defaultCatId,
      createdBy: currentUser?.username || 'Admin',
      status: 1,
      tags: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedNews(item);
    setFormData({
      title: item.title,
      headline: item.headline || item.title,
      content: item.content,
      newsSource: item.newsSource || 'FU Newsroom',
      categoryId: item.categoryId,
      createdBy: item.createdBy,
      status: item.status,
      tags: item.tags || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'News title cannot be empty.';
    }
    if (!formData.content.trim()) {
      errors.content = 'News content cannot be empty.';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Please select a category.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Create or Edit Form via Backend API
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        const created = await newsService.create({
          ...formData,
          createdBy: currentUser?.username || formData.createdBy || 'Admin',
          createdById: currentUser?.id
        });
        setNewsList(prev => [created, ...prev]);
        showToast(`Article "${created.title}" published successfully!`, 'success');
      } else {
        const updated = await newsService.update(selectedNews.id, {
          ...formData,
          createdById: currentUser?.id
        });
        setNewsList(prev => prev.map(n => n.id === updated.id ? updated : n));
        showToast(`Article "${updated.title}" updated successfully!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (item) => {
    setNewsToDelete(item);
    setIsDeleteOpen(true);
  };

  // Confirm Delete via Backend API
  const handleConfirmDelete = async () => {
    if (!newsToDelete) return;
    try {
      await newsService.delete(newsToDelete.id);
      setNewsList(prev => prev.filter(n => n.id !== newsToDelete.id));
      showToast(`Article "${newsToDelete.title}" deleted successfully!`, 'success');
      setIsDeleteOpen(false);
      setNewsToDelete(null);
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
            <h3 className="card-title-clean">
              {activeTab === 'history' ? 'My News History' : 'News Articles Management'}
            </h3>
            <p className="text-muted small m-0">Create, publish, edit, and organize news articles with tags</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('all')}
              >
                All Articles
              </button>
              <button
                type="button"
                className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('history')}
              >
                My History
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleOpenCreate}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add News</span>
            </button>
          </div>
        </div>

        <div className="p-3">
          {/* Filters and Search Bar */}
          <div className="row g-2 mb-3">
            <div className="col-12 col-md-5">
              <div className="search-input-wrapper w-100">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, tags, content..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="1">Active Only</option>
                <option value="0">Inactive Only</option>
              </select>
            </div>

            <div className="col-12 col-md-2 text-md-end text-muted small d-flex align-items-center justify-content-md-end">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>Showing <strong>{displayedNews.length}</strong> of {newsList.length}</>
              )}
            </div>
          </div>

          {/* Table or Empty State */}
          {displayedNews.length === 0 ? (
            <EmptyState
              icon={searchKeyword || categoryFilter !== 'ALL' || statusFilter !== 'ALL' ? 'bi-search' : 'bi-newspaper'}
              title={
                searchKeyword || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'No matching articles'
                  : activeTab === 'history'
                  ? 'You have not created any articles yet'
                  : 'No news articles available'
              }
              description="Try adjusting your search criteria or add a new news article."
              actionLabel="Add Article"
              onAction={handleOpenCreate}
            />
          ) : (
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Title & Content Preview</th>
                    <th style={{ width: '150px' }}>Category</th>
                    <th style={{ width: '130px' }}>Author</th>
                    <th style={{ width: '160px' }}>Tags</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ width: '100px' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedNews.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted fw-bold">#{item.id}</td>
                      <td>
                        <div className="fw-semibold text-dark mb-1">{item.title}</div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '420px' }}>
                          {item.content}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-primary border border-primary-subtle px-2 py-1">
                          {item.categoryName || getCategoryName(item.categoryId)}
                        </span>
                      </td>
                      <td className="small text-muted">
                        <i className="bi bi-person me-1"></i>
                        {item.createdBy || 'Admin'}
                      </td>
                      <td>
                        {item.tags ? (
                          <div className="d-flex flex-wrap gap-1">
                            {item.tags.split(',').map((t, i) => (
                              <span key={i} className="badge bg-secondary-subtle text-secondary small py-1 px-1">
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
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
                            title="Edit Article"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger btn-action"
                            title="Delete Article"
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
        title={modalMode === 'create' ? 'Create New News Article' : `Edit News Article #${selectedNews?.id}`}
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
              {modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Article Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. FPT University signs partnership with global AI lab"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
              autoFocus
            />
            {formErrors.title && (
              <div className="invalid-feedback">{formErrors.title}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Headline / Summary</label>
            <input
              type="text"
              className="form-control"
              placeholder="Short headline summary"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">
                Category <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${formErrors.categoryId ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={(e) => {
                  setFormData({ ...formData, categoryId: e.target.value });
                  if (formErrors.categoryId) setFormErrors({ ...formErrors, categoryId: null });
                }}
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.status === 0 ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <div className="invalid-feedback">{formErrors.categoryId}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">News Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              >
                <option value={1}>Active (Visible to public)</option>
                <option value={0}>Inactive (Hidden/Draft)</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Tags (Comma separated)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-tags"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AI, Technology, Research, Campus"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="form-text small">Tags will be automatically linked and persisted in the database.</div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">News Source</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. FU Newsroom, Academic Office"
              value={formData.newsSource}
              onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Article Content <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${formErrors.content ? 'is-invalid' : ''}`}
              rows="5"
              placeholder="Full text body of the news article..."
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (formErrors.content) setFormErrors({ ...formErrors, content: null });
              }}
            />
            {formErrors.content && (
              <div className="invalid-feedback">{formErrors.content}</div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete News Article"
        message="Are you sure you want to permanently delete this news article?"
        itemName={newsToDelete ? `"${newsToDelete.title}" (ID: #${newsToDelete.id})` : ''}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setNewsToDelete(null);
        }}
      />
    </div>
  );
}
