import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ currentPage, setCurrentPage, user }) => {
  const { logout, getRoleDisplayName } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'base_commander', 'logistics_officer'] },
    { id: 'purchases', label: 'Purchases', icon: '🛒', roles: ['admin', 'logistics_officer'] },
    { id: 'transfers', label: 'Transfers', icon: '📦', roles: ['admin', 'base_commander'] },
    { id: 'assignments', label: 'Assignments', icon: '👥', roles: ['admin', 'base_commander'] },
  ];

  // Filter navigation items based on user role
  const getVisibleNavItems = () => {
    if (!user) return [];
    return navItems.filter(item => item.roles.includes(user.role));
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          🛡️ Military Asset Management
        </div>
        
        <ul className="nav-list">
          {getVisibleNavItems().map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* User Menu */}
        <div className="user-menu">
          <button 
            className="user-menu-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{getRoleDisplayName()}</span>
            </div>
            <span className="dropdown-arrow">{showUserMenu ? '▲' : '▼'}</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-details">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                  <span className="role-badge">{getRoleDisplayName()}</span>
                  {user?.assignedBase && user.assignedBase !== 'All Bases' && (
                    <span className="base-badge">{user.assignedBase}</span>
                  )}
                </div>
              </div>
              
              <div className="user-dropdown-actions">
                <button className="dropdown-action" onClick={() => setShowUserMenu(false)}>
                  👤 Profile
                </button>
                <button className="dropdown-action" onClick={() => setShowUserMenu(false)}>
                  ⚙️ Settings
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-action logout-action" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="user-menu-overlay" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
