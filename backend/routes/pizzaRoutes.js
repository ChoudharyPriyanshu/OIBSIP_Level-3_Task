const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require('../controllers/pizzaController');

// Public routes
router.get('/', getPizzas);
router.get('/:id', getPizzaById);

// Admin routes
router.post('/', protect, adminOnly, createPizza);
router.put('/:id', protect, adminOnly, updatePizza);
router.delete('/:id', protect, adminOnly, deletePizza);

module.exports = router;
