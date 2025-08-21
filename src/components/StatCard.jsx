import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  );
};

export default StatCard;
