
import React from 'react';
import './App.css';

const StatCard = ({ title, value }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  );
};

const App = () => {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Military Asset Management Dashboard</h1>
      </header>
      <main className="dashboard-grid">
        <StatCard title="Opening Balance" value="1,250" />
        <StatCard title="Closing Balance" value="1,100" />
        <div className="card-special">
          <h3 className="card-title">Net Movement</h3>
          <p className="card-value">-150</p>
          <button className="details-button">View Details</button>
        </div>
        <StatCard title="Assigned Assets" value="300" />
        <StatCard title="Expended Assets" value="100" />
        <StatCard title="Transfers In" value="50" />
        <StatCard title="Transfers Out" value="200" />
        <StatCard title="New Purchases" value="0" />
      </main>
      <footer className="footer">
        <p>Military Management system</p>
      </footer>
    </div>
  );
};

export default App;


