// routes/authRoutes.js
// mjti ppru nqev vilq
const express = require('express');
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', resetPassword);

module.exports = router;
