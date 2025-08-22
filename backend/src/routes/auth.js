const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/authController');

const { protect, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', auditLog('user_login'), login);
router.get('/logout', logout);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.put('/updateprofile', auditLog('profile_update'), updateProfile);
router.put('/updatepassword', auditLog('password_update'), updatePassword);

// Admin only routes
router.use(authorize('admin')); // All routes after this are admin only

router.post('/register', auditLog('user_registration'), register);
router.get('/users', getUsers);
router.put('/users/:id', auditLog('user_management'), updateUser);
router.delete('/users/:id', auditLog('user_management'), deleteUser);

module.exports = router;
