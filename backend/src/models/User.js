const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'base_commander', 'logistics_officer'],
      message: 'Role must be admin, base_commander, or logistics_officer'
    },
    required: [true, 'Please specify a role']
  },
  assignedBase: {
    type: String,
    enum: {
      values: ['Base Alpha', 'Base Beta', 'Base Gamma', 'Base Delta', 'Base Echo', 'All Bases'],
      message: 'Invalid base assignment'
    },
    required: function() {
      return this.role === 'base_commander';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  permissions: {
    canViewDashboard: {
      type: Boolean,
      default: true
    },
    canManageAssets: {
      type: Boolean,
      default: function() {
        return this.role === 'admin' || this.role === 'base_commander';
      }
    },
    canManagePurchases: {
      type: Boolean,
      default: function() {
        return this.role === 'admin' || this.role === 'logistics_officer';
      }
    },
    canManageTransfers: {
      type: Boolean,
      default: function() {
        return this.role === 'admin' || this.role === 'logistics_officer';
      }
    },
    canManageAssignments: {
      type: Boolean,
      default: function() {
        return this.role === 'admin' || this.role === 'base_commander';
      }
    },
    canViewAllBases: {
      type: Boolean,
      default: function() {
        return this.role === 'admin';
      }
    },
    canManageUsers: {
      type: Boolean,
      default: function() {
        return this.role === 'admin';
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ assignedBase: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has permission for specific operation
userSchema.methods.hasPermission = function(operation, targetBase = null) {
  if (!this.isActive) return false;
  
  switch (operation) {
    case 'view_dashboard':
      return this.permissions.canViewDashboard;
    
    case 'manage_assets':
      if (this.role === 'admin') return true;
      if (this.role === 'base_commander') {
        return !targetBase || this.assignedBase === targetBase || this.assignedBase === 'All Bases';
      }
      return false;
    
    case 'manage_purchases':
      return this.permissions.canManagePurchases;
    
    case 'manage_transfers':
      return this.permissions.canManageTransfers;
    
    case 'manage_assignments':
      if (this.role === 'admin') return true;
      if (this.role === 'base_commander') {
        return !targetBase || this.assignedBase === targetBase || this.assignedBase === 'All Bases';
      }
      return false;
    
    case 'view_all_bases':
      return this.permissions.canViewAllBases;
    
    case 'manage_users':
      return this.permissions.canManageUsers;
    
    default:
      return false;
  }
};

// Method to get allowed bases for user
userSchema.methods.getAllowedBases = function() {
  if (this.role === 'admin' || this.assignedBase === 'All Bases') {
    return ['Base Alpha', 'Base Beta', 'Base Gamma', 'Base Delta', 'Base Echo'];
  }
  return [this.assignedBase];
};

// Static method to get role hierarchy
userSchema.statics.getRoleHierarchy = function() {
  return {
    admin: 3,
    base_commander: 2,
    logistics_officer: 1
  };
};

// Method to check if user can manage another user
userSchema.methods.canManageUser = function(targetUser) {
  if (this.role === 'admin') return true;
  
  const hierarchy = this.constructor.getRoleHierarchy();
  return hierarchy[this.role] > hierarchy[targetUser.role];
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
