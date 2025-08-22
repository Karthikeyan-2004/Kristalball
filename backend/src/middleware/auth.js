const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../config/database');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      // Add user to request
      req.user = user;
      next();

    } catch (error) {
      logger.error('Token verification failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check specific permission
exports.checkPermission = (operation) => {
  return (req, res, next) => {
    const targetBase = req.params.base || req.body.currentBase || req.query.base;
    
    if (!req.user.hasPermission(operation, targetBase)) {
      logger.warn(`Permission denied for user ${req.user.email} for operation ${operation}`);
      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${operation.replace('_', ' ')}`
      });
    }
    next();
  };
};

// Base access control - ensure user can only access their assigned base data
exports.baseAccessControl = (req, res, next) => {
  const allowedBases = req.user.getAllowedBases();
  
  // Add allowed bases to request for use in controllers
  req.allowedBases = allowedBases;
  
  // Check if user is trying to access data from unauthorized base
  const requestedBase = req.params.base || req.body.currentBase || req.query.base;
  
  if (requestedBase && !allowedBases.includes(requestedBase) && req.user.role !== 'admin') {
    logger.warn(`Base access denied for user ${req.user.email} to base ${requestedBase}`);
    return res.status(403).json({
      success: false,
      message: `You don't have access to ${requestedBase} data`
    });
  }
  
  next();
};

// Rate limiting for sensitive operations
exports.sensitiveOperationLimiter = (req, res, next) => {
  // This would typically use Redis or memory store
  // For now, we'll just log the attempt
  logger.info(`Sensitive operation attempted by user ${req.user.email}: ${req.method} ${req.originalUrl}`);
  next();
};

// Audit logging middleware
exports.auditLog = (operation) => {
  return (req, res, next) => {
    // Log the operation for audit purposes
    const logData = {
      operation,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Add user info if authenticated
    if (req.user) {
      logData.user = req.user.email;
      logData.userRole = req.user.role;
    }
    
    logger.info(`Audit Log - ${operation}`, logData);
    next();
  };
};
