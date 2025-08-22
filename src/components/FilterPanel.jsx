import React from 'react';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const bases = [
    'All Bases',
    'Base Alpha',
    'Base Beta', 
    'Base Gamma',
    'Base Delta',
    'Base Echo'
  ];

  const equipmentTypes = [
    'All Equipment',
    'Vehicles',
    'Weapons',
    'Ammunition',
    'Communication Equipment',
    'Medical Supplies',
    'Protective Gear'
  ];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          Clear All
        </button>
      </div>
      
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="dateFrom">Date From</label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dateTo">Date To</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="base">Base</label>
          <select
            id="base"
            name="base"
            value={filters.base || 'All Bases'}
            onChange={(e) => onFilterChange('base', e.target.value)}
          >
            {bases.map((base) => (
              <option key={base} value={base}>
                {base}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="equipmentType">Equipment Type</label>
          <select
            id="equipmentType"
            name="equipmentType"
            value={filters.equipmentType || 'All Equipment'}
            onChange={(e) => onFilterChange('equipmentType', e.target.value)}
          >
            {equipmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
