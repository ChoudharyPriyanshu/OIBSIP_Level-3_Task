const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

// @route   GET /api/users/profile
// @desc    Get logged-in user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update logged-in user profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Admin
router.get('/', protect, adminOnly, getAllUsers);

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
// @access  Admin
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
