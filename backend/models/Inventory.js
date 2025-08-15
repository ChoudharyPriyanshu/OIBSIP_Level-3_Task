const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
    required: true,
  },
  name: { // changed from "item"
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  threshold: {
    type: Number,
    required: true,
    default: 10,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);
