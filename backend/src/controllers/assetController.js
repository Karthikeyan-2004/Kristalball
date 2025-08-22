const Asset = require('../models/Asset');
const { logger } = require('../config/database');

// @desc    Get all assets (filtered by user's allowed bases)
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    
    // Build filter object
    let filter = { currentBase: { $in: req.allowedBases } };
    
    if (category && category !== 'All Equipment') {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { assetId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const assets = await Asset.find(filter)
      .populate('createdBy updatedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Asset.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: assets.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      assets
    });

  } catch (error) {
    logger.error('Get assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assets'
    });
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
exports.getAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('createdBy updatedBy', 'name email role')
      .populate('history.performedBy', 'name email role');

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check if user has access to this asset's base
    if (!req.allowedBases.includes(asset.currentBase)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this asset'
      });
    }

    res.status(200).json({
      success: true,
      asset
    });

  } catch (error) {
    logger.error('Get asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset'
    });
  }
};

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private (Admin, Base Commander)
exports.createAsset = async (req, res) => {
  try {
    // Add created by user
    req.body.createdBy = req.user.id;
    
    // Validate base access
    if (!req.allowedBases.includes(req.body.currentBase)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot create assets for this base'
      });
    }

    const asset = await Asset.create(req.body);

    // Add creation history entry
    asset.addHistoryEntry('created', req.user.id, 'Asset created in system');
    await asset.save();

    logger.info(`Asset created: ${asset.assetId} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      asset
    });

  } catch (error) {
    logger.error('Create asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating asset',
      error: error.message
    });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private (Admin, Base Commander)
exports.updateAsset = async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check base access
    if (!req.allowedBases.includes(asset.currentBase)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this asset'
      });
    }

    // Update asset
    req.body.updatedBy = req.user.id;
    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Add update history entry
    asset.addHistoryEntry('updated', req.user.id, 'Asset information updated');
    await asset.save();

    logger.info(`Asset updated: ${asset.assetId} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      asset
    });

  } catch (error) {
    logger.error('Update asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating asset',
      error: error.message
    });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private (Admin only)
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    await asset.remove();

    logger.info(`Asset deleted: ${asset.assetId} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });

  } catch (error) {
    logger.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset'
    });
  }
};

// @desc    Transfer asset between bases
// @route   PUT /api/assets/:id/transfer
// @access  Private (Admin, Logistics Officer)
exports.transferAsset = async (req, res) => {
  try {
    const { newBase, reason } = req.body;
    
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check if user can access current base
    if (!req.allowedBases.includes(asset.currentBase) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this asset'
      });
    }

    // Perform transfer
    asset.transferTo(newBase, req.user.id, reason);
    await asset.save();

    logger.info(`Asset transferred: ${asset.assetId} from ${asset.currentBase} to ${newBase} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Asset transferred successfully',
      asset
    });

  } catch (error) {
    logger.error('Transfer asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Error transferring asset',
      error: error.message
    });
  }
};

// @desc    Assign asset to personnel
// @route   PUT /api/assets/:id/assign
// @access  Private (Admin, Base Commander)
exports.assignAsset = async (req, res) => {
  try {
    const { personnelName, personnelRank, purpose } = req.body;
    
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check base access
    if (!req.allowedBases.includes(asset.currentBase)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this asset'
      });
    }

    // Check if asset is available
    if (asset.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Asset is not available for assignment'
      });
    }

    // Perform assignment
    asset.assignTo(personnelName, personnelRank, purpose, req.user.id);
    await asset.save();

    logger.info(`Asset assigned: ${asset.assetId} to ${personnelName} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Asset assigned successfully',
      asset
    });

  } catch (error) {
    logger.error('Assign asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Error assigning asset',
      error: error.message
    });
  }
};

// @desc    Return asset from personnel
// @route   PUT /api/assets/:id/return
// @access  Private (Admin, Base Commander)
exports.returnAsset = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check base access
    if (!req.allowedBases.includes(asset.currentBase)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this asset'
      });
    }

    // Check if asset is assigned
    if (asset.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Asset is not currently assigned'
      });
    }

    // Perform return
    asset.returnAsset(req.user.id, reason);
    await asset.save();

    logger.info(`Asset returned: ${asset.assetId} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Asset returned successfully',
      asset
    });

  } catch (error) {
    logger.error('Return asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Error returning asset',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/assets/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Asset.getDashboardStats(req.allowedBases);
    
    // Add additional stats
    const totalTransfersIn = await Asset.countDocuments({
      currentBase: { $in: req.allowedBases },
      'history.action': 'transferred',
      'history.toBase': { $in: req.allowedBases },
      'history.date': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const totalTransfersOut = await Asset.countDocuments({
      'history.action': 'transferred',
      'history.fromBase': { $in: req.allowedBases },
      'history.date': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const result = stats[0] || {
      totalAssets: 0,
      totalValue: 0,
      availableAssets: 0,
      assignedAssets: 0,
      maintenanceAssets: 0
    };

    result.transfersIn = totalTransfersIn;
    result.transfersOut = totalTransfersOut;
    result.netMovement = totalTransfersIn - totalTransfersOut;

    res.status(200).json({
      success: true,
      stats: result
    });

  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};
