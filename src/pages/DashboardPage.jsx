import React from 'react';
import StatCard from '../components/StatCard.jsx';

const DashboardPage = () => {
  const stats = [
    { title: "Opening Balance", value: "1,250" },
    { title: "Closing Balance", value: "1,100" },
    { title: "Assigned Assets", value: "300" },
    { title: "Expended Assets", value: "100" },
    { title: "Transfers In", value: "50" },
    { title: "Transfers Out", value: "200" },
    { title: "New Purchases", value: "0" },
  ];

  const handleViewDetails = () => {
    // Add logic for viewing details
    console.log('View details clicked');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Military Asset Management Dashboard</h1>
      </header>
      
      <main className="dashboard-grid">
        {stats.slice(0, 2).map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} />
        ))}
        
        <div className="card-special">
          <h3 className="card-title">Net Movement</h3>
          <p className="card-value">-150</p>
          <button className="details-button" onClick={handleViewDetails}>
            View Details
          </button>
        </div>
        
        {stats.slice(2).map((stat, index) => (
          <StatCard key={index + 2} title={stat.title} value={stat.value} />
        ))}
      </main>
      
      <footer className="page-footer">
        <p>Military Management System</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
