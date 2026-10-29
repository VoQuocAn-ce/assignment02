// Võ Quốc An - ce190460
import React, { useState, useEffect, useMemo } from 'react';
import { categoryService } from '../services/categoryService';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ToastAlert from '../components/common/ToastAlert';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', status: 1 });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load categories from Backend API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const list = await categoryService.getAll();
      setCategories(list);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Filtered displayed list based on search keyword
  const displayedCategories = useMemo(() => {
    return categoryService.search(categories, searchKeyword);
  }, [categories, searchKeyword]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setFormData({ name: '', description: '', status: 1 });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      status: category.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name cannot be empty.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Create or Edit via Backend API
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        const created = await categoryService.create(formData);
        setCategories(prev => [...prev, created]);
        showToast(`Category "${created.name}" created successfully!`, 'success');
      } else {
        const updated = await categoryService.update(selectedCategory.id, formData);
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
        showToast(`Category "${updated.name}" updated successfully!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  // Confirm Delete via Backend API
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      showToast(`Category "${categoryToDelete.name}" deleted successfully!`, 'success');
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
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
            <h3 className="card-title-clean">Category Management</h3>
            <p className="text-muted small m-0">Organize and manage publication categories via REST API</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Category</span>
          </button>
        </div>

        <div className="p-3">
          {/* Toolbar: Search input */}
          <div className="toolbar-container">
            <div className="search-input-wrapper">
              <i className="bi bi-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search categories by name or description..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchKeyword('')}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>

            <div className="text-muted small">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>Showing <strong>{displayedCategories.length}</strong> of {categories.length} categories</>
              )}
            </div>
          </div>

          {/* Table or Empty State */}
          {displayedCategories.length === 0 ? (
            <EmptyState
              icon={searchKeyword ? 'bi-search' : 'bi-folder-x'}
              title={searchKeyword ? 'No categories matched' : 'No categories yet'}
              description={
                searchKeyword
                  ? `No category matches keyword "${searchKeyword}".`
                  : 'Start by clicking "Add Category" above.'
              }
              actionLabel={searchKeyword ? 'Clear Search' : 'Add First Category'}
              onAction={searchKeyword ? () => setSearchKeyword('') : handleOpenCreate}
            />
          ) : (
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th style={{ width: '130px' }}>Status</th>
                    <th style={{ width: '120px' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCategories.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted fw-bold">#{item.id}</td>
                      <td className="fw-semibold text-dark">{item.name}</td>
                      <td className="text-muted small">{item.description || '—'}</td>
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
                            title="Edit Category"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger btn-action"
                            title="Delete Category"
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

      {/* Create / Edit Popup Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Create New Category' : `Edit Category #${selectedCategory?.id}`}
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
              {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Category Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Science & Discovery"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: null });
              }}
              autoFocus
            />
            {formErrors.name && (
              <div className="invalid-feedback">{formErrors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Brief summary of topics covered in this category"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Publication Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
            >
              <option value={1}>Active (Visible for publishing)</option>
              <option value={0}>Inactive (Hidden)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? Any news articles belonging to this category will prevent deletion."
        itemName={categoryToDelete ? `${categoryToDelete.name} (ID: #${categoryToDelete.id})` : ''}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
}
