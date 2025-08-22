import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      assetId: 'A001',
      assetName: 'M4A1 Rifle',
      personnelName: 'John Smith',
      personnelRank: 'Sergeant',
      assignmentDate: '2024-01-15',
      purpose: 'Training Exercise',
      status: 'Active'
    },
    {
      id: 2,
      assetId: 'V003',
      assetName: 'Humvee',
      personnelName: 'Sarah Johnson',
      personnelRank: 'Lieutenant',
      assignmentDate: '2024-01-10',
      purpose: 'Patrol Duty',
      status: 'Active'
    }
  ]);
  
  const [expenditures, setExpenditures] = useState([
    {
      id: 1,
      assetId: 'A025',
      assetName: '5.56mm Ammunition',
      quantity: 200,
      expendedDate: '2024-01-20',
      reason: 'Training Exercise',
      authorizedBy: 'Major Brown',
      status: 'Approved'
    },
    {
      id: 2,
      assetId: 'M007',
      assetName: 'Medical Supplies',
      quantity: 50,
      expendedDate: '2024-01-18',
      reason: 'Field Medical Training',
      authorizedBy: 'Captain Davis',
      status: 'Approved'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('assignments');
  const [isLoading, setIsLoading] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    assetId: '',
    personnelName: '',
    personnelRank: '',
    assignmentDate: '',
    purpose: ''
  });

  const [newExpenditure, setNewExpenditure] = useState({
    assetId: '',
    expendedDate: '',
    reason: '',
    quantity: '',
    authorizedBy: ''
  });

  // Demo loading function - removed

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAssignmentRecord = {
        id: assignments.length + 1,
        ...newAssignment,
        assetName: `Asset ${newAssignment.assetId}`,
        status: 'Active'
      };
      
      setAssignments(prev => [...prev, newAssignmentRecord]);
      setNewAssignment({
        assetId: '',
        personnelName: '',
        personnelRank: '',
        assignmentDate: '',
        purpose: ''
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExpenditureSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newExpenditureRecord = {
        id: expenditures.length + 1,
        ...newExpenditure,
        assetName: `Asset ${newExpenditure.assetId}`,
        status: 'Approved'
      };
      
      setExpenditures(prev => [...prev, newExpenditureRecord]);
      setNewExpenditure({
        assetId: '',
        expendedDate: '',
        reason: '',
        quantity: '',
        authorizedBy: ''
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenditureChange = (e) => {
    const { name, value } = e.target;
    setNewExpenditure(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Assignments & Expenditures</h1>
        <p className="page-subtitle">Manage asset assignments to personnel and track asset expenditures</p>
      </header>



      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`tab-button ${activeTab === 'expenditures' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenditures')}
        >
          Expenditures
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <LoadingSpinner size="large" />
          <p className="loading-text">Processing...</p>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="assignments-content">
          <div className="assignment-form-section">
            <h2>Assign Asset to Personnel</h2>
            <form onSubmit={handleAssignmentSubmit} className="assignment-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assetId">Asset ID</label>
                  <input
                    type="text"
                    id="assetId"
                    name="assetId"
                    value={newAssignment.assetId}
                    onChange={handleAssignmentChange}
                    placeholder="Enter asset ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="personnelName">Personnel Name</label>
                  <input
                    type="text"
                    id="personnelName"
                    name="personnelName"
                    value={newAssignment.personnelName}
                    onChange={handleAssignmentChange}
                    placeholder="Enter personnel name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="personnelRank">Personnel Rank</label>
                  <select
                    id="personnelRank"
                    name="personnelRank"
                    value={newAssignment.personnelRank}
                    onChange={handleAssignmentChange}
                    required
                  >
                    <option value="">Select rank</option>
                    <option value="Private">Private</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                    <option value="Major">Major</option>
                    <option value="Colonel">Colonel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="assignmentDate">Assignment Date</label>
                  <input
                    type="date"
                    id="assignmentDate"
                    name="assignmentDate"
                    value={newAssignment.assignmentDate}
                    onChange={handleAssignmentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="purpose">Assignment Purpose</label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={newAssignment.purpose}
                    onChange={handleAssignmentChange}
                    placeholder="Describe the purpose of this assignment"
                    rows="3"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Assign Asset'}
              </button>
            </form>
          </div>

          <div className="assignment-history-section">
            <h2>Assignment History</h2>
            <DataTable
              data={assignments}
              columns={[
                { key: 'assetId', label: 'Asset ID' },
                { key: 'assetName', label: 'Asset Name' },
                { key: 'personnelName', label: 'Personnel' },
                { key: 'personnelRank', label: 'Rank' },
                { key: 'assignmentDate', label: 'Date Assigned' },
                { key: 'purpose', label: 'Purpose' },
                { key: 'status', label: 'Status' }
              ]}
              searchable={true}
              sortable={true}
            />
          </div>
        </div>
      )}

      {/* Expenditures Tab */}
      {activeTab === 'expenditures' && (
        <div className="expenditures-content">
          <div className="expenditure-form-section">
            <h2>Record Asset Expenditure</h2>
            <form onSubmit={handleExpenditureSubmit} className="expenditure-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assetId">Asset ID</label>
                  <input
                    type="text"
                    id="assetId"
                    name="assetId"
                    value={newExpenditure.assetId}
                    onChange={handleExpenditureChange}
                    placeholder="Enter asset ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={newExpenditure.quantity}
                    onChange={handleExpenditureChange}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expendedDate">Expenditure Date</label>
                  <input
                    type="date"
                    id="expendedDate"
                    name="expendedDate"
                    value={newExpenditure.expendedDate}
                    onChange={handleExpenditureChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="authorizedBy">Authorized By</label>
                  <input
                    type="text"
                    id="authorizedBy"
                    name="authorizedBy"
                    value={newExpenditure.authorizedBy}
                    onChange={handleExpenditureChange}
                    placeholder="Enter authorizing officer"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="reason">Expenditure Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={newExpenditure.reason}
                    onChange={handleExpenditureChange}
                    placeholder="Describe the reason for expenditure"
                    rows="3"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Record Expenditure'}
              </button>
            </form>
          </div>

          <div className="expenditure-history-section">
            <h2>Expenditure History</h2>
            <DataTable
              data={expenditures}
              columns={[
                { key: 'assetId', label: 'Asset ID' },
                { key: 'assetName', label: 'Asset Name' },
                { key: 'quantity', label: 'Quantity' },
                { key: 'expendedDate', label: 'Date Expended' },
                { key: 'reason', label: 'Reason' },
                { key: 'authorizedBy', label: 'Authorized By' },
                { key: 'status', label: 'Status' }
              ]}
              searchable={true}
              sortable={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
