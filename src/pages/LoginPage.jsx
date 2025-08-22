import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Clear error when component mounts or form data changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.email || !formData.password) {
        return;
      }

      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Login successful - redirect will be handled by App.jsx
        console.log('Login successful:', result.user);
      }
    } catch (error) {
      console.error('Login form error:', error);
    }
  };

  // Demo credentials for easy testing
  const demoCredentials = [
    { role: 'Admin', email: 'admin@military.gov', password: 'Admin@123' },
    { role: 'Base Commander (Alpha)', email: 'karthi@military.gov', password: 'Password@123' },
    { role: 'Base Commander (Beta)', email: 'imman@military.gov', password: 'Password@123' },
    { role: 'Logistics Officer', email: 'kavya@military.gov', password: 'Password@123' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
    clearError();
  };

  // Don't render login if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="military-emblem">🛡️</div>
            <h1>Military Asset Management</h1>
            <p>Secure Access Portal</p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h3>Demo Credentials</h3>
          <div className="demo-buttons">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                type="button"
                className="demo-button"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
              >
                {cred.role}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className="checkbox-custom"></span>
              Remember me
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                Signing In...
              </>
            ) : (
              <>
                🔐 Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Secure military network access</p>
          <div className="security-badges">
            <span className="security-badge">🔒 SSL Encrypted</span>
            <span className="security-badge">🛡️ Military Grade Security</span>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="login-background">
        <div className="pattern"></div>
      </div>
    </div>
  );
};

export default LoginPage;
