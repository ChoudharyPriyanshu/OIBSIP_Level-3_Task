// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  addInventoryItem,
  updateInventory,
  getInventoryByCategory,
  getAllInventory,
} = require('../controllers/inventoryController');
const { adminOnly } = require('../middlewares/authMiddleware');

// @route   POST /api/inventory
// @desc    Add new inventory item
// @access  Admin
router.post('/', adminOnly, addInventoryItem);

// @route   PUT /api/inventory/:id
// @desc    Update inventory quantity
// @access  Admin
router.put('/:id', adminOnly, updateInventory);

// @route   GET /api/inventory/category/:category
// @desc    Get items by category (base, sauce, cheese, etc.)
// @access  Public
router.get('/category/:category', getInventoryByCategory);

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Admin
router.get('/', adminOnly, getAllInventory);

module.exports = router;
