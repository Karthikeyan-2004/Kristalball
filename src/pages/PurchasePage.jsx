import React, { useState } from 'react';

const PurchasePage = () => {
  const [purchases, setPurchases] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    assetName: '',
    quantity: '',
    unitPrice: '',
    vendor: '',
    date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle purchase submission
    console.log('New purchase:', newPurchase);
    // Reset form
    setNewPurchase({
      assetName: '',
      quantity: '',
      unitPrice: '',
      vendor: '',
      date: '',
    });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Asset Purchases</h1>
        <p className="page-subtitle">Record new asset purchases and view historical purchase data</p>
      </header>

      <div className="purchase-content">
        <div className="purchase-form-section">
          <h2>Record New Purchase</h2>
          <form onSubmit={handleSubmit} className="purchase-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="assetName">Asset Name</label>
                <input
                  type="text"
                  id="assetName"
                  name="assetName"
                  value={newPurchase.assetName}
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
                  value={newPurchase.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitPrice">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={newPurchase.unitPrice}
                  onChange={handleInputChange}
                  placeholder="Enter unit price"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vendor">Vendor</label>
                <input
                  type="text"
                  id="vendor"
                  name="vendor"
                  value={newPurchase.vendor}
                  onChange={handleInputChange}
                  placeholder="Enter vendor name"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Purchase Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newPurchase.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="submit-button">
              Record Purchase
            </button>
          </form>
        </div>

        <div className="purchase-history-section">
          <h2>Recent Purchases</h2>
          <div className="purchase-history">
            {purchases.length === 0 ? (
              <p className="no-data">No purchases recorded yet.</p>
            ) : (
              <div className="purchase-list">
                {/* Purchase history will be displayed here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
