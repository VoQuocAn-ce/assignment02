// Võ Quốc An - ce190460
import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import LoginPage from './pages/LoginPage';
import PublicNewsPage from './pages/PublicNewsPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import CategoryManagement from './pages/CategoryManagement';
import NewsManagement from './pages/NewsManagement';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';
import { ROLE } from './services/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [publicMode, setPublicMode] = useState(false);

  // Check persisted auth session on load
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      // Admin defaults to user management or dashboard, Staff defaults to news or dashboard
      if (savedUser.role === ROLE.ADMIN) {
        setActiveTab('users');
      } else {
        setActiveTab('news');
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPublicMode(false);
    if (user.role === ROLE.ADMIN) {
      setActiveTab('users');
    } else {
      setActiveTab('news');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
    setPublicMode(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (isLoadingAuth) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading FUNews System...</span>
        </div>
      </div>
    );
  }

  // If user is viewing public news without login
  if (!currentUser && publicMode) {
    return <PublicNewsPage onGoToLogin={() => setPublicMode(false)} />;
  }

  // If user is not authenticated, show LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBrowsePublic={() => setPublicMode(true)}
      />
    );
  }

  // Render AdminLayout with active content
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
      {activeTab === 'categories' && <CategoryManagement />}
      {activeTab === 'news' && <NewsManagement currentUser={currentUser} showHistoryOnly={false} />}
      {activeTab === 'history' && <NewsManagement currentUser={currentUser} showHistoryOnly={true} />}
      {activeTab === 'users' && <UserManagement currentUser={currentUser} />}
      {activeTab === 'settings' && (
        <SettingsPage
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </AdminLayout>
  );
}
