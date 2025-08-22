const express = require('express');
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  transferAsset,
  assignAsset,
  returnAsset,
  getDashboardStats
} = require('../controllers/assetController');

const { 
  protect, 
  authorize, 
  checkPermission, 
  baseAccessControl, 
  auditLog 
} = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(baseAccessControl); // Apply base access control to all routes

// Dashboard stats (accessible to all authenticated users)
router.get('/dashboard/stats', getDashboardStats);

// Asset CRUD operations
router
  .route('/')
  .get(checkPermission('view_dashboard'), getAssets)
  .post(
    checkPermission('manage_assets'),
    authorize('admin', 'base_commander'),
    auditLog('asset_creation'),
    createAsset
  );

router
  .route('/:id')
  .get(checkPermission('view_dashboard'), getAsset)
  .put(
    checkPermission('manage_assets'),
    authorize('admin', 'base_commander'),
    auditLog('asset_update'),
    updateAsset
  )
  .delete(
    authorize('admin'),
    auditLog('asset_deletion'),
    deleteAsset
  );

// Asset operations
router.put(
  '/:id/transfer',
  checkPermission('manage_transfers'),
  authorize('admin', 'logistics_officer'),
  auditLog('asset_transfer'),
  transferAsset
);

router.put(
  '/:id/assign',
  checkPermission('manage_assignments'),
  authorize('admin', 'base_commander'),
  auditLog('asset_assignment'),
  assignAsset
);

router.put(
  '/:id/return',
  checkPermission('manage_assignments'),
  authorize('admin', 'base_commander'),
  auditLog('asset_return'),
  returnAsset
);

module.exports = router;
