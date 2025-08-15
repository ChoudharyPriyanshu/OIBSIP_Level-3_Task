const mongoose = require('mongoose');

const customPizzaSchema = new mongoose.Schema({
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  veggies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
    },
  ],
  meat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
    },
  ],
});

const orderItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
  },
  customPizza: customPizzaSchema, // optional
  name: { type: String, required: true },
  variant: { type: String }, // e.g., small/medium/large
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true, // e.g., 'Razorpay', 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ['processing', 'dispatched', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
