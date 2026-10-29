// Võ Quốc An - ce190460
import React, { useState, useEffect, useMemo } from 'react';
import logoSvg from '../assets/logo.svg';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';

export default function PublicNewsPage({ onGoToLogin }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    setLoading(true);
    try {
      const [newsData, catData] = await Promise.all([
        newsService.getPublicActive().catch(() => []),
        categoryService.getActive().catch(() => [])
      ]);
      setArticles(newsData || []);
      setCategories(catData || []);
    } catch (err) {
      console.error('Error fetching public news:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(a =>
        (a.title && a.title.toLowerCase().includes(kw)) ||
        (a.content && a.content.toLowerCase().includes(kw)) ||
        (a.tags && a.tags.toLowerCase().includes(kw))
      );
    }
    if (selectedCategory !== 'ALL') {
      const catId = Number(selectedCategory);
      result = result.filter(a => Number(a.categoryId) === catId);
    }
    return result;
  }, [articles, searchKeyword, selectedCategory]);

  return (
    <div className="bg-light min-vh-100">
      {/* Public Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm sticky-top">
        <div className="container">
          <div className="d-flex align-items-center gap-2">
            <img src={logoSvg} alt="FU News" width="36" height="36" />
            <span className="navbar-brand fw-bold m-0" style={{ fontSize: '1.25rem' }}>
              FU News Portal
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 small d-none d-md-inline-block">
              <i className="bi bi-broadcast me-1"></i> Public Access (Active News)
            </span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2"
              onClick={onGoToLogin}
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Staff / Admin Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="container py-4">
        {/* Search & Category Filter */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6">
                <div className="search-input-wrapper w-100">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search articles by keywords, topics, tags..."
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

              <div className="col-8 col-md-4">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="ALL">All Topics & Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-4 col-md-2 text-end text-muted small">
                {filteredArticles.length} articles
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading articles...</span>
            </div>
            <p className="text-muted small mt-2">Loading published news from server...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <i className="bi bi-newspaper fs-1 text-muted"></i>
            <h5 className="mt-3">No active articles found</h5>
            <p className="text-muted small">No articles match your current filter or keyword search.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredArticles.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                        {item.categoryName || 'General'}
                      </span>
                      <small className="text-muted">{item.createdAt || 'Recent'}</small>
                    </div>

                    <h5 className="card-title fw-bold text-dark mb-2">
                      {item.title}
                    </h5>

                    {item.headline && (
                      <p className="text-muted small fst-italic mb-2">
                        {item.headline}
                      </p>
                    )}

                    <p className="card-text text-secondary small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.content}
                    </p>

                    {item.tags && (
                      <div className="d-flex flex-wrap gap-1 my-3">
                        {item.tags.split(',').map((t, i) => (
                          <span key={i} className="badge bg-light text-secondary border small">
                            #{t.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
                      <span><i className="bi bi-person me-1"></i>{item.createdBy || 'FU News'}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-semibold"
                        onClick={() => setSelectedArticle(item)}
                      >
                        Read Full Article <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <span className="badge bg-primary-subtle text-primary mb-1">
                    {selectedArticle.categoryName}
                  </span>
                  <h4 className="modal-title fw-bold text-dark">{selectedArticle.title}</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedArticle(null)}
                ></button>
              </div>
              <div className="modal-body py-4">
                {selectedArticle.headline && (
                  <p className="lead fs-6 text-muted border-start border-3 border-primary ps-3 mb-4">
                    {selectedArticle.headline}
                  </p>
                )}
                <div className="text-secondary mb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                  {selectedArticle.content}
                </div>
                <div className="d-flex flex-wrap align-items-center justify-content-between border-top pt-3 small text-muted">
                  <div>
                    <strong>Source:</strong> {selectedArticle.newsSource || 'FU Newsroom'} &nbsp;|&nbsp;
                    <strong>Author:</strong> {selectedArticle.createdBy || 'Staff'}
                  </div>
                  <div>
                    <strong>Published:</strong> {selectedArticle.createdAt}
                  </div>
                </div>
                {selectedArticle.tags && (
                  <div className="mt-3">
                    <strong>Tags: </strong>
                    {selectedArticle.tags.split(',').map((t, idx) => (
                      <span key={idx} className="badge bg-secondary-subtle text-secondary me-1">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedArticle(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
