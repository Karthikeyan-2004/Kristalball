const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: [true, 'Asset ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [200, 'Asset name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Asset category is required'],
    enum: {
      values: ['Vehicles', 'Weapons', 'Ammunition', 'Communication Equipment', 'Medical Supplies', 'Protective Gear', 'Other'],
      message: 'Invalid asset category'
    }
  },
  currentBase: {
    type: String,
    required: [true, 'Current base is required'],
    enum: {
      values: ['Base Alpha', 'Base Beta', 'Base Gamma', 'Base Delta', 'Base Echo'],
      message: 'Invalid base'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'assigned', 'maintenance', 'damaged', 'retired'],
      message: 'Invalid asset status'
    },
    default: 'available'
  },
  condition: {
    type: String,
    enum: {
      values: ['excellent', 'good', 'fair', 'poor'],
      message: 'Invalid condition'
    },
    default: 'good'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 1
  },
  unitValue: {
    type: Number,
    required: [true, 'Unit value is required'],
    min: [0, 'Unit value cannot be negative']
  },
  totalValue: {
    type: Number,
    default: function() {
      return this.quantity * this.unitValue;
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  serialNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  warrantyExpiry: {
    type: Date
  },
  lastMaintenanceDate: {
    type: Date
  },
  nextMaintenanceDate: {
    type: Date
  },
  assignedTo: {
    personnelName: {
      type: String,
      trim: true
    },
    personnelRank: {
      type: String,
      trim: true
    },
    assignmentDate: {
      type: Date
    },
    assignmentPurpose: {
      type: String,
      trim: true
    }
  },
  history: [{
    action: {
      type: String,
      enum: ['created', 'purchased', 'transferred', 'assigned', 'returned', 'maintenance', 'disposed'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    details: {
      type: String,
      maxlength: [500, 'History details cannot exceed 500 characters']
    },
    fromBase: String,
    toBase: String,
    quantity: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
assetSchema.index({ assetId: 1 });
assetSchema.index({ currentBase: 1 });
assetSchema.index({ category: 1 });
assetSchema.index({ status: 1 });
assetSchema.index({ 'assignedTo.personnelName': 1 });
assetSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total value
assetSchema.pre('save', function(next) {
  this.totalValue = this.quantity * this.unitValue;
  next();
});

// Method to add history entry
assetSchema.methods.addHistoryEntry = function(action, performedBy, details = '', additionalData = {}) {
  this.history.push({
    action,
    performedBy,
    details,
    ...additionalData
  });
  this.updatedBy = performedBy;
};

// Method to transfer asset
assetSchema.methods.transferTo = function(newBase, performedBy, details = '') {
  const oldBase = this.currentBase;
  this.currentBase = newBase;
  this.addHistoryEntry('transferred', performedBy, details, {
    fromBase: oldBase,
    toBase: newBase
  });
};

// Method to assign asset
assetSchema.methods.assignTo = function(personnelName, personnelRank, purpose, performedBy) {
  this.assignedTo = {
    personnelName,
    personnelRank,
    assignmentDate: new Date(),
    assignmentPurpose: purpose
  };
  this.status = 'assigned';
  this.addHistoryEntry('assigned', performedBy, `Assigned to ${personnelName} (${personnelRank})`);
};

// Method to return asset
assetSchema.methods.returnAsset = function(performedBy, details = '') {
  const previousAssignment = this.assignedTo;
  this.assignedTo = {
    personnelName: undefined,
    personnelRank: undefined,
    assignmentDate: undefined,
    assignmentPurpose: undefined
  };
  this.status = 'available';
  this.addHistoryEntry('returned', performedBy, details || `Returned from ${previousAssignment.personnelName}`);
};

// Static method to get assets by base (for RBAC)
assetSchema.statics.getAssetsByBase = function(bases, filters = {}) {
  const query = { currentBase: { $in: bases }, ...filters };
  return this.find(query).populate('createdBy updatedBy', 'name email role');
};

// Static method to get dashboard stats
assetSchema.statics.getDashboardStats = function(bases) {
  return this.aggregate([
    { $match: { currentBase: { $in: bases } } },
    {
      $group: {
        _id: null,
        totalAssets: { $sum: '$quantity' },
        totalValue: { $sum: '$totalValue' },
        availableAssets: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, '$quantity', 0] }
        },
        assignedAssets: {
          $sum: { $cond: [{ $eq: ['$status', 'assigned'] }, '$quantity', 0] }
        },
        maintenanceAssets: {
          $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, '$quantity', 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Asset', assetSchema);
