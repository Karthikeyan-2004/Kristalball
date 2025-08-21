import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import PurchasePage from './pages/PurchasePage';
import TransferPage from './pages/TransferPage';
import AssignmentsPage from './pages/AssignmentsPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const renderPage = () => {
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
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;