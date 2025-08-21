import React from 'react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'transfers', label: 'Transfers' },
    { id: 'assignments', label: 'Assignments' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">Asset Management</div>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
