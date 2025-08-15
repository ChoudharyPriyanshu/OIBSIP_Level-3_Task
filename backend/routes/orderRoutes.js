const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { placeOrder, verifyPayment, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

// User order routes
router.post('/custom', protect, placeOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getUserOrders);

// Admin order routes
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
