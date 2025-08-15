const Order = require('../models/Order');
const { reduceInventory } = require('./inventoryController');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc   Place a custom pizza order
// @access User
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { base, sauce, cheese, veggies = [], meat = [], shippingAddress, paymentMethod } = req.body;

    if (!base || !sauce || !cheese) {
      return res.status(400).json({ message: 'Base, sauce, and cheese are required' });
    }
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const calculatedPrice = 300 + veggies.length * 20 + meat.length * 40;
    const usedItems = [
      { item: base, quantity: 1 },
      { item: sauce, quantity: 1 },
      { item: cheese, quantity: 1 },
      ...veggies.map(v => ({ item: v, quantity: 1 })),
      ...meat.map(m => ({ item: m, quantity: 1 })),
    ];

    // Build common orderData for frontend usage
    const orderData = {
      base,
      sauce,
      cheese,
      veggies,
      meat,
      shippingAddress,
      calculatedPrice
    };

    if (paymentMethod.toLowerCase() === 'razorpay') {
      const options = {
        amount: calculatedPrice * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };

      const razorpayOrder = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        razorpayOrder,
        orderData,       // <-- Always sending this now
        amount: calculatedPrice,
        currency: "INR"
      });
    } else {
      const order = new Order({
        user: userId,
        orderItems: [
          {
            customPizza: { base, sauce, cheese, veggies, meat },
            name: 'Custom Pizza',
            quantity: 1,
            price: calculatedPrice
          }
        ],
        shippingAddress,
        paymentMethod,
        totalAmount: calculatedPrice,
        paymentStatus: 'pending',
        orderStatus: 'processing'
      });

      await order.save();
      await reduceInventory(usedItems);

      return res.status(201).json({
        success: true,
        razorpayOrder: null,
        orderData,        // <-- Keeps frontend consistent
        order,            // Real saved order
        amount: calculatedPrice,
        currency: "INR"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// @desc   Verify Razorpay Payment
// @access Public
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Save order after successful payment
    const usedItems = [
      { item: orderData.base, quantity: 1 },
      { item: orderData.sauce, quantity: 1 },
      { item: orderData.cheese, quantity: 1 },
      ...orderData.veggies.map(v => ({ item: v, quantity: 1 })),
      ...orderData.meat.map(m => ({ item: m, quantity: 1 })),
    ];

    const order = new Order({
      user: req.user._id,
      orderItems: [
        {
          customPizza: {
            base: orderData.base,
            sauce: orderData.sauce,
            cheese: orderData.cheese,
            veggies: orderData.veggies,
            meat: orderData.meat
          },
          name: 'Custom Pizza',
          quantity: 1,
          price: orderData.calculatedPrice
        }
      ],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'razorpay',
      totalAmount: orderData.calculatedPrice,
      paymentStatus: 'paid',
      orderStatus: 'processing'
    });

    await order.save();
    await reduceInventory(usedItems);

    res.status(200).json({ success: true, message: "Payment verified & order placed", order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// @desc   Get all orders of a user
// @access User
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc   Get all orders (admin)
// @access Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc   Update order status (admin)
// @access Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['processing', 'dispatched', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    await order.save();

    // Emit socket event for live updates
    if (req.app.get('io')) {
      req.app.get('io').to(order.user.toString()).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.orderStatus
      });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = {
  placeOrder,
  verifyPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
