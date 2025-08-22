import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

const PurchasePage = () => {
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      assetName: 'M4 Carbine',
      quantity: 25,
      unitPrice: 1200,
      vendor: 'Defense Corp',
      date: '2025-08-20',
      totalCost: 30000,
      status: 'Completed'
    },
    {
      id: 2,
      assetName: 'Night Vision Goggles',
      quantity: 15,
      unitPrice: 800,
      vendor: 'Tech Solutions',
      date: '2025-08-19',
      totalCost: 12000,
      status: 'Pending'
    },
    {
      id: 3,
      assetName: 'Medical Kits',
      quantity: 50,
      unitPrice: 150,
      vendor: 'Med Supply Co',
      date: '2025-08-18',
      totalCost: 7500,
      status: 'Completed'
    },
    {
      id: 4,
      assetName: 'Communication Radio',
      quantity: 10,
      unitPrice: 500,
      vendor: 'Radio Tech',
      date: '2025-08-17',
      totalCost: 5000,
      status: 'Completed'
    },
    {
      id: 5,
      assetName: 'Body Armor',
      quantity: 30,
      unitPrice: 400,
      vendor: 'Protection Gear Inc',
      date: '2025-08-16',
      totalCost: 12000,
      status: 'In Transit'
    }
  ]);
  const [newPurchase, setNewPurchase] = useState({
    assetName: '',
    quantity: '',
    unitPrice: '',
    vendor: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPurchaseRecord = {
        id: purchases.length + 1,
        ...newPurchase,
        quantity: parseInt(newPurchase.quantity),
        unitPrice: parseFloat(newPurchase.unitPrice),
        totalCost: parseInt(newPurchase.quantity) * parseFloat(newPurchase.unitPrice),
        status: 'Pending'
      };
      
      setPurchases(prev => [newPurchaseRecord, ...prev]);
      setNewPurchase({
        assetName: '',
        quantity: '',
        unitPrice: '',
        vendor: '',
        date: '',
      });
      setLoading(false);
    }, 1000);
  };

  const purchaseColumns = [
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
      key: 'unitPrice',
      label: 'Unit Price',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'totalCost',
      label: 'Total Cost',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'vendor',
      label: 'Vendor'
    },
    {
      key: 'date',
      label: 'Date'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase().replace(' ', '-')}`}>
          {value}
        </span>
      )
    }
  ];

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
          <h2>Purchase History</h2>
          <DataTable 
            data={purchases}
            columns={purchaseColumns}
            itemsPerPage={5}
            searchable={true}
            sortable={true}
            loading={false}
            emptyMessage="No purchases recorded yet."
          />
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
