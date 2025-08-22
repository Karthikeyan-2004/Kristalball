import React from 'react';

const NetMovementModal = ({ isOpen, onClose, netMovementData }) => {
  if (!isOpen) return null;

  const {
    purchases = [],
    transfersIn = [],
    transfersOut = [],
    totalPurchases = 0,
    totalTransfersIn = 0,
    totalTransfersOut = 0,
    netMovement = 0
  } = netMovementData || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Net Movement Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="net-movement-summary">
            <div className="summary-card positive">
              <h3>Purchases</h3>
              <p className="summary-value">+{totalPurchases}</p>
            </div>
            <div className="summary-card positive">
              <h3>Transfers In</h3>
              <p className="summary-value">+{totalTransfersIn}</p>
            </div>
            <div className="summary-card negative">
              <h3>Transfers Out</h3>
              <p className="summary-value">-{totalTransfersOut}</p>
            </div>
            <div className={`summary-card ${netMovement >= 0 ? 'positive' : 'negative'}`}>
              <h3>Net Movement</h3>
              <p className="summary-value">{netMovement >= 0 ? '+' : ''}{netMovement}</p>
            </div>
          </div>

          <div className="detailed-breakdown">
            <div className="breakdown-section">
              <h3>Recent Purchases ({purchases.length})</h3>
              <div className="breakdown-list">
                {purchases.length > 0 ? (
                  purchases.map((purchase, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="item-info">
                        <span className="item-name">{purchase.assetName}</span>
                        <span className="item-details">{purchase.quantity} units - {purchase.date}</span>
                      </div>
                      <span className="item-value positive">+{purchase.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent purchases</p>
                )}
              </div>
            </div>

            <div className="breakdown-section">
              <h3>Recent Transfers In ({transfersIn.length})</h3>
              <div className="breakdown-list">
                {transfersIn.length > 0 ? (
                  transfersIn.map((transfer, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="item-info">
                        <span className="item-name">{transfer.assetName}</span>
                        <span className="item-details">From {transfer.fromBase} - {transfer.date}</span>
                      </div>
                      <span className="item-value positive">+{transfer.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent transfers in</p>
                )}
              </div>
            </div>

            <div className="breakdown-section">
              <h3>Recent Transfers Out ({transfersOut.length})</h3>
              <div className="breakdown-list">
                {transfersOut.length > 0 ? (
                  transfersOut.map((transfer, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="item-info">
                        <span className="item-name">{transfer.assetName}</span>
                        <span className="item-details">To {transfer.toBase} - {transfer.date}</span>
                      </div>
                      <span className="item-value negative">-{transfer.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent transfers out</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            Close
          </button>
          <button className="modal-btn primary">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetMovementModal;
