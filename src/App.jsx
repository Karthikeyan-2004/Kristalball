import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import PurchasePage from './pages/PurchasePage';
import TransferPage from './pages/TransferPage';
import AssignmentsPage from './pages/AssignmentsPage';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
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
      <Navbar currentPage={currentPage} setCurrentPage={handlePageChange} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;