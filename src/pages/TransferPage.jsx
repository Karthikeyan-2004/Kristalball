import React, { useState } from 'react';

const TransferPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [newTransfer, setNewTransfer] = useState({
    assetName: '',
    quantity: '',
    fromBase: '',
    toBase: '',
    transferDate: '',
    reason: '',
  });

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
    // Add logic to handle transfer submission
    console.log('New transfer:', newTransfer);
    // Reset form
    setNewTransfer({
      assetName: '',
      quantity: '',
      fromBase: '',
      toBase: '',
      transferDate: '',
      reason: '',
    });
  };

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
          <h2>Recent Transfers</h2>
          <div className="transfer-history">
            {transfers.length === 0 ? (
              <p className="no-data">No transfers recorded yet.</p>
            ) : (
              <div className="transfer-list">
                {/* Transfer history will be displayed here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
