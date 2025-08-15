// controllers/inventoryController.js
const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/sendEmail');

// @desc    Add new inventory item
// @access  Admin
const addInventoryItem = async (req, res) => {
  try {
    const { category, item, quantity, threshold } = req.body;

    if (!['base', 'sauce', 'cheese', 'veggie', 'meat'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const existing = await Inventory.findOne({ item });
    if (existing) {
      return res.status(400).json({ message: 'Item already exists' });
    }

    const newItem = new Inventory({ category, item, quantity, threshold });
    await newItem.save();

    res.status(201).json({ message: 'Inventory item added', newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding inventory item' });
  }
};

// @desc    Update quantity of an inventory item
// @access  Admin
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Inventory.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await item.save();

    res.status(200).json({ message: 'Inventory updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating inventory' });
  }
};

// @desc    Get inventory by category (base/sauce/cheese/veggie/meat)
// @access  Public (for custom pizza builder)
const getInventoryByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Inventory.find({ category });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

// @desc    Reduce inventory quantities after order placed
// @access  Internal (used during order processing)
const reduceInventory = async (usedItems) => {
  try {
    for (const { item, quantity } of usedItems) {
      const inventoryItem = await Inventory.findOne({ item });
      if (inventoryItem) {
        inventoryItem.quantity -= quantity;
        await inventoryItem.save();

        if (inventoryItem.quantity < inventoryItem.threshold) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `Low Stock Alert: ${inventoryItem.item}`,
            html: `<p>Stock for ${inventoryItem.item} is below threshold. Current: ${inventoryItem.quantity}</p>`,
          });
        }
      }
    }
  } catch (err) {
    console.error('Error reducing inventory:', err.message);
  }
};

// @desc    Get all inventory items
// @access  Admin
const getAllInventory = async (req, res) => {
  try {
    const allItems = await Inventory.find({});
    res.status(200).json(allItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all inventory' });
  }
};

module.exports = {
  addInventoryItem,
  updateInventory,
  getInventoryByCategory,
  reduceInventory,
  getAllInventory,
};
// Register