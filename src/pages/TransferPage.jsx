import React, { useState } from 'react';
import DataTable from '../components/DataTable';

const TransferPage = () => {
  const [transfers, setTransfers] = useState([
    {
      id: 1,
      assetName: 'Humvee',
      quantity: 2,
      fromBase: 'Base Alpha',
      toBase: 'Base Beta',
      transferDate: '2025-08-21',
      reason: 'Operational Requirements',
      status: 'Completed',
      authorizedBy: 'Col. Johnson'
    },
    {
      id: 2,
      assetName: 'Radio Equipment',
      quantity: 10,
      fromBase: 'Base Beta',
      toBase: 'Base Gamma',
      transferDate: '2025-08-20',
      reason: 'Equipment Redistribution',
      status: 'In Transit',
      authorizedBy: 'Maj. Smith'
    },
    {
      id: 3,
      assetName: 'Ammunition',
      quantity: 500,
      fromBase: 'Base Gamma',
      toBase: 'Base Delta',
      transferDate: '2025-08-19',
      reason: 'Supply Replenishment',
      status: 'Pending',
      authorizedBy: 'Lt. Col. Davis'
    }
  ]);
  const [newTransfer, setNewTransfer] = useState({
    assetName: '',
    quantity: '',
    fromBase: '',
    toBase: '',
    transferDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const bases = [
    'Base Alpha',
    'Base Beta',
    'Base Gamma',
    'Base Delta',
    'Base Echo',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransfer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransferRecord = {
        id: transfers.length + 1,
        ...newTransfer,
        quantity: parseInt(newTransfer.quantity),
        status: 'Pending',
        authorizedBy: 'Current User' // In real app, this would come from auth context
      };
      
      setTransfers(prev => [newTransferRecord, ...prev]);
      setNewTransfer({
        assetName: '',
        quantity: '',
        fromBase: '',
        toBase: '',
        transferDate: '',
        reason: '',
      });
      setLoading(false);
    }, 1000);
  };

  const transferColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => `#${value}`
    },
    {
      key: 'assetName',
      label: 'Asset Name'
    },
    {
      key: 'quantity',
      label: 'Quantity'
    },
    {
      key: 'fromBase',
      label: 'From Base'
    },
    {
      key: 'toBase',
      label: 'To Base'
    },
    {
      key: 'transferDate',
      label: 'Transfer Date'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase().replace(' ', '-')}`}>
          {value}
        </span>
      )
    },
    {
      key: 'authorizedBy',
      label: 'Authorized By'
    }
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Asset Transfers</h1>
        <p className="page-subtitle">Facilitate the transfer of assets between different military bases</p>
      </header>

      <div className="transfer-content">
        <div className="transfer-form-section">
          <h2>Initiate New Transfer</h2>
          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="assetName">Asset Name</label>
                <input
                  type="text"
                  id="assetName"
                  name="assetName"
                  value={newTransfer.assetName}
                  onChange={handleInputChange}
                  placeholder="Enter asset name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={newTransfer.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fromBase">From Base</label>
                <select
                  id="fromBase"
                  name="fromBase"
                  value={newTransfer.fromBase}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select source base</option>
                  {bases.map((base) => (
                    <option key={base} value={base}>{base}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="toBase">To Base</label>
                <select
                  id="toBase"
                  name="toBase"
                  value={newTransfer.toBase}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select destination base</option>
                  {bases.map((base) => (
                    <option key={base} value={base}>{base}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="transferDate">Transfer Date</label>
                <input
                  type="date"
                  id="transferDate"
                  name="transferDate"
                  value={newTransfer.transferDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="reason">Transfer Reason</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={newTransfer.reason}
                  onChange={handleInputChange}
                  placeholder="Enter reason for transfer"
                  rows="3"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="submit-button">
              Initiate Transfer
            </button>
          </form>
        </div>

        <div className="transfer-history-section">
          <h2>Transfer History</h2>
          <DataTable 
            data={transfers}
            columns={transferColumns}
            itemsPerPage={5}
            searchable={true}
            sortable={true}
            loading={loading}
            emptyMessage="No transfers recorded yet."
          />
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
