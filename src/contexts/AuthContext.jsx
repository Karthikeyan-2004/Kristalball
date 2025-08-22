import React, { createContext, useContext, useReducer, useEffect } from 'react';

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: parsedUser
          }
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: data.token,
          user: data.user
        }
      });

      return { success: true, user: data.user };

    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (state.token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Get user permissions
  const hasPermission = (operation) => {
    if (!state.user) return false;
    
    const { role, permissions } = state.user;
    
    switch (operation) {
      case 'view_dashboard':
        return permissions?.canViewDashboard || true;
      case 'manage_assets':
        return permissions?.canManageAssets || role === 'admin' || role === 'base_commander';
      case 'manage_purchases':
        return permissions?.canManagePurchases || role === 'admin' || role === 'logistics_officer';
      case 'manage_transfers':
        return permissions?.canManageTransfers || role === 'admin' || role === 'logistics_officer';
      case 'manage_assignments':
        return permissions?.canManageAssignments || role === 'admin' || role === 'base_commander';
      case 'manage_users':
        return permissions?.canManageUsers || role === 'admin';
      default:
        return false;
    }
  };

  // Get user's role display name
  const getRoleDisplayName = () => {
    if (!state.user) return '';
    
    const roleNames = {
      admin: 'Administrator',
      base_commander: 'Base Commander',
      logistics_officer: 'Logistics Officer'
    };
    
    return roleNames[state.user.role] || state.user.role;
  };

  // Check if user can access specific base
  const canAccessBase = (baseName) => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true;
    if (state.user.assignedBase === 'All Bases') return true;
    return state.user.assignedBase === baseName;
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    hasPermission,
    getRoleDisplayName,
    canAccessBase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
