const Pizza = require('../models/Pizza');

// @desc Get all pizzas
// @route GET /api/pizzas
// @access Public
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    // Return the array directly in 'data'
    res.json({ success: true, data: pizzas || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pizzas', error: error.message });
  }
};

// @desc Get single pizza by ID
// @route GET /api/pizzas/:id
// @access Public
const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pizza', error: error.message });
  }
};

// @desc Create new pizza
// @route POST /api/pizzas
// @access Admin
const createPizza = async (req, res) => {
  const { name, description, image, variants, prices, category } = req.body;

  try {
    const pizza = new Pizza({
      name,
      description,
      image,
      variants,
      prices,
      category
    });

    const createdPizza = await pizza.save();
    res.status(201).json({ success: true, message: 'Pizza created successfully', data: createdPizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create pizza', error: error.message });
  }
};

// @desc Update pizza
// @route PUT /api/pizzas/:id
// @access Admin
const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    Object.assign(pizza, req.body);
    const updatedPizza = await pizza.save();
    res.json({ success: true, message: 'Pizza updated successfully', data: updatedPizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update pizza', error: error.message });
  }
};

// @desc Delete pizza
// @route DELETE /api/pizzas/:id
// @access Admin
const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    await pizza.deleteOne();
    res.json({ success: true, message: 'Pizza deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete pizza', error: error.message });
  }
};

module.exports = {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
};
