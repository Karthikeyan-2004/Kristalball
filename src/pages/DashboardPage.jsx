import React, { useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import NetMovementModal from '../components/NetMovementModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const DashboardPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    base: 'All Bases',
    equipmentType: 'All Equipment'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredStats, setFilteredStats] = useState(null);

  // Base data for different bases
  const allBaseData = {
    'All Bases': [
      { title: "Opening Balance", value: "1,250" },
      { title: "Closing Balance", value: "1,100" },
      { title: "Assigned Assets", value: "300" },
      { title: "Expended Assets", value: "100" },
      { title: "Transfers In", value: "50" },
      { title: "Transfers Out", value: "200" },
      { title: "New Purchases", value: "0" },
    ],
    'Base Alpha': [
      { title: "Opening Balance", value: "350" },
      { title: "Closing Balance", value: "320" },
      { title: "Assigned Assets", value: "80" },
      { title: "Expended Assets", value: "25" },
      { title: "Transfers In", value: "15" },
      { title: "Transfers Out", value: "60" },
      { title: "New Purchases", value: "0" },
    ],
    'Base Beta': [
      { title: "Opening Balance", value: "280" },
      { title: "Closing Balance", value: "250" },
      { title: "Assigned Assets", value: "70" },
      { title: "Expended Assets", value: "20" },
      { title: "Transfers In", value: "10" },
      { title: "Transfers Out", value: "50" },
      { title: "New Purchases", value: "0" },
    ],
    'Base Gamma': [
      { title: "Opening Balance", value: "220" },
      { title: "Closing Balance", value: "200" },
      { title: "Assigned Assets", value: "60" },
      { title: "Expended Assets", value: "15" },
      { title: "Transfers In", value: "8" },
      { title: "Transfers Out", value: "35" },
      { title: "New Purchases", value: "0" },
    ]
  };

  const stats = filteredStats || allBaseData[filters.base] || allBaseData['All Bases'];

  // Mock data for Net Movement Modal
  const netMovementData = {
    purchases: [
      { assetName: 'M4 Carbine', quantity: 25, date: '2025-08-20', vendor: 'Defense Corp' },
      { assetName: 'Night Vision Goggles', quantity: 15, date: '2025-08-19', vendor: 'Tech Solutions' },
      { assetName: 'Medical Kits', quantity: 50, date: '2025-08-18', vendor: 'Med Supply Co' }
    ],
    transfersIn: [
      { assetName: 'Humvee', quantity: 2, fromBase: 'Base Alpha', date: '2025-08-21' },
      { assetName: 'Radio Equipment', quantity: 10, fromBase: 'Base Beta', date: '2025-08-20' }
    ],
    transfersOut: [
      { assetName: 'Ammunition', quantity: 500, toBase: 'Base Gamma', date: '2025-08-21' },
      { assetName: 'Body Armor', quantity: 30, toBase: 'Base Delta', date: '2025-08-20' },
      { assetName: 'Tactical Gear', quantity: 25, toBase: 'Base Echo', date: '2025-08-19' }
    ],
    totalPurchases: 90,
    totalTransfersIn: 12,
    totalTransfersOut: 555,
    netMovement: -453
  };

  const handleFilterChange = (filterName, value) => {
    setLoading(true);
    
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    
    // Simulate API call for filtering
    setTimeout(() => {
      // Apply filters and update data
      const newFilters = { ...filters, [filterName]: value };
      applyFilters(newFilters);
      setLoading(false);
    }, 500);
  };

  const applyFilters = (currentFilters) => {
    let baseData = allBaseData[currentFilters.base] || allBaseData['All Bases'];
    
    // Apply date filtering (simulate effect)
    if (currentFilters.dateFrom || currentFilters.dateTo) {
      // Simulate reduced numbers when date range is applied
      baseData = baseData.map(stat => ({
        ...stat,
        value: Math.floor(parseInt(stat.value.replace(',', '')) * 0.7).toLocaleString()
      }));
    }
    
    // Apply equipment type filtering
    if (currentFilters.equipmentType !== 'All Equipment') {
      // Simulate reduced numbers when specific equipment is selected
      baseData = baseData.map(stat => ({
        ...stat,
        value: Math.floor(parseInt(stat.value.replace(',', '')) * 0.5).toLocaleString()
      }));
    }
    
    setFilteredStats(baseData);
  };

  const handleClearFilters = () => {
    setLoading(true);
    setFilters({
      dateFrom: '',
      dateTo: '',
      base: 'All Bases',
      equipmentType: 'All Equipment'
    });
    
    setTimeout(() => {
      setFilteredStats(null);
      setLoading(false);
    }, 300);
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Military Asset Management Dashboard</h1>
        {(filters.base !== 'All Bases' || filters.dateFrom || filters.dateTo || filters.equipmentType !== 'All Equipment') && (
          <div className="active-filters-indicator">
            <span className="filter-badge">Filters Active</span>
            {filters.base !== 'All Bases' && (
              <span className="filter-badge">{filters.base}</span>
            )}
            {filters.equipmentType !== 'All Equipment' && (
              <span className="filter-badge">{filters.equipmentType}</span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="filter-badge">Date Range</span>
            )}
          </div>
        )}
      </header>

      <FilterPanel 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <LoadingSpinner size="large" message="Loading dashboard data..." />
      ) : (
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
      )}
      
      <footer className="page-footer">
        <p>Military Management System</p>
      </footer>

      <NetMovementModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        netMovementData={netMovementData}
      />
    </div>
  );
};

export default DashboardPage;
