const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String, // URL of the pizza image
      required: true
    },
    variants: {
      type: [String], // e.g., ['small', 'medium', 'large']
      required: true
    },
    prices: {
      type: Map,
      of: Number, // e.g., { small: 200, medium: 350, large: 500 }
      required: true
    },
    category: {
      type: String, // e.g., 'veg', 'non-veg'
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', pizzaSchema);
