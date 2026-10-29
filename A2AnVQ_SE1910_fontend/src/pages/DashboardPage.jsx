// Võ Quốc An - ce190460
import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { newsService } from '../services/newsService';
import { userService } from '../services/userService';
import { ROLE } from '../services/mockData';

export default function DashboardPage({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [cats, newsList, userList] = await Promise.all([
        categoryService.getAll().catch(() => []),
        newsService.getAll().catch(() => []),
        userService.getAll().catch(() => [])
      ]);
      setCategories(cats || []);
      setNews(newsList || []);
      setUsers(userList || []);
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 1).length;

  const totalNews = news.length;
  const activeNews = news.filter(n => n.status === 1).length;
  const draftNews = totalNews - activeNews;

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === ROLE.ADMIN).length;
  const staffUsers = totalUsers - adminUsers;

  // Category distribution
  const categoryStats = categories.map(cat => ({
    ...cat,
    count: news.filter(n => Number(n.categoryId) === cat.id).length
  }));

  const recentNews = news.slice(0, 5);

  const getCategoryName = (id) => {
    const found = categories.find(c => c.id === Number(id));
    return found ? found.name : 'Unknown';
  };

  return (
    <div>
      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-blue">
              <i className="bi bi-folder2-open"></i>
            </div>
            <div>
              <div className="stat-value">{loading ? '...' : totalCategories}</div>
              <p className="stat-label">Categories ({activeCategories} Active)</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-green">
              <i className="bi bi-newspaper"></i>
            </div>
            <div>
              <div className="stat-value">{loading ? '...' : totalNews}</div>
              <p className="stat-label">News Articles ({activeNews} Published)</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-purple">
              <i className="bi bi-people"></i>
            </div>
            <div>
              <div className="stat-value">{loading ? '...' : totalUsers}</div>
              <p className="stat-label">Accounts ({staffUsers} Staff, {adminUsers} Admin)</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-orange">
              <i className="bi bi-file-earmark-diff"></i>
            </div>
            <div>
              <div className="stat-value">{loading ? '...' : draftNews}</div>
              <p className="stat-label">Draft / Inactive News</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Recent News */}
        <div className="col-12 col-lg-8">
          <div className="custom-card">
            <div className="card-header-clean">
              <div>
                <h4 className="card-title-clean">Recently Published News</h4>
                <p className="text-muted small m-0">Live data loaded from Spring Boot REST API</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => onNavigate('news')}
              >
                View All
              </button>
            </div>
            <div className="p-3">
              {recentNews.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  No news articles published yet.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentNews.map(item => (
                    <div key={item.id} className="list-group-item px-0 py-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="badge bg-light text-primary border border-primary-subtle small">
                          {item.categoryName || getCategoryName(item.categoryId)}
                        </span>
                        <span className="text-muted small">{item.createdAt || 'Recent'}</span>
                      </div>
                      <h6 className="fw-bold mb-1 text-dark">{item.title}</h6>
                      <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: '600px' }}>
                        {item.content}
                      </p>
                      <div className="d-flex align-items-center gap-3 text-muted small">
                        <span><i className="bi bi-person me-1"></i>{item.createdBy || 'Staff'}</span>
                        {item.tags && (
                          <span><i className="bi bi-tags me-1"></i>{item.tags}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution */}
        <div className="col-12 col-lg-4">
          <div className="custom-card mb-4">
            <div className="card-header-clean">
              <h4 className="card-title-clean">Category Coverage</h4>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => onNavigate('categories')}
              >
                Manage
              </button>
            </div>
            <div className="p-3">
              {categoryStats.length === 0 ? (
                <div className="text-center py-4 text-muted small">No categories registered yet.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {categoryStats.map(cat => (
                    <div key={cat.id}>
                      <div className="d-flex justify-content-between align-items-center small mb-1">
                        <span className="fw-semibold text-dark">{cat.name}</span>
                        <span className="badge bg-light text-secondary border">
                          {cat.count} articles
                        </span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{
                            width: `${totalNews > 0 ? (cat.count / totalNews) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
