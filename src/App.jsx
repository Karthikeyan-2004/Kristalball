import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import PurchasePage from './pages/PurchasePage';
import TransferPage from './pages/TransferPage';
import AssignmentsPage from './pages/AssignmentsPage';
import LoadingSpinner from './components/LoadingSpinner';

// Main App Component (wrapped with auth)
const AppContent = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setIsPageLoading(true);
      
      // Simulate page loading time
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsPageLoading(false);
      }, 300);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <p className="loading-text">Checking authentication...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    if (isPageLoading) {
      return (
        <div className="page-loading-container">
          <LoadingSpinner size="large" />
          <p className="loading-text">Loading page...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'purchases':
        return <PurchasePage />;
      case 'transfers':
        return <TransferPage />;
      case 'assignments':
        return <AssignmentsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
        user={user}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

// Root App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;