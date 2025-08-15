// seeder/customOptionsSeeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Inventory = require('../models/Inventory');

dotenv.config();

const customPizzaOptions = [
  // Bases
  {
    category: 'base',
    name: 'Thin Crust',
    description: 'Crispy and light thin crust base.',
    price: 50,
    quantity: 100,
    threshold: 10,
  },
  {
    category: 'base',
    name: 'Thick Crust',
    description: 'Soft and fluffy thick crust base.',
    price: 60,
    quantity: 80,
    threshold: 10,
  },
  {
    category: 'base',
    name: 'Cheese Burst',
    description: 'Filled with molten cheese for extra indulgence.',
    price: 90,
    quantity: 60,
    threshold: 10,
  },

  // Sauces
  {
    category: 'sauce',
    name: 'Tomato Basil',
    description: 'Classic tangy tomato sauce with fresh basil.',
    price: 20,
    quantity: 200,
    threshold: 15,
  },
  {
    category: 'sauce',
    name: 'Pesto',
    description: 'Rich basil pesto sauce with parmesan.',
    price: 25,
    quantity: 150,
    threshold: 15,
  },

  // Cheese
  {
    category: 'cheese',
    name: 'Mozzarella',
    description: 'Creamy and stretchy mozzarella cheese.',
    price: 40,
    quantity: 120,
    threshold: 15,
  },
  {
    category: 'cheese',
    name: 'Cheddar',
    description: 'Sharp and tangy cheddar cheese.',
    price: 45,
    quantity: 100,
    threshold: 15,
  },

  // Veggies
  {
    category: 'veggie',
    name: 'Bell Peppers',
    description: 'Fresh and colorful bell peppers.',
    price: 15,
    quantity: 200,
    threshold: 20,
  },
  {
    category: 'veggie',
    name: 'Olives',
    description: 'Juicy black olives.',
    price: 20,
    quantity: 150,
    threshold: 20,
  },

  // Meat
  {
    category: 'meat',
    name: 'Pepperoni',
    description: 'Classic pepperoni slices.',
    price: 50,
    quantity: 100,
    threshold: 20,
  },
  {
    category: 'meat',
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken chunks.',
    price: 55,
    quantity: 90,
    threshold: 20,
  },
];

const seedCustomOptions = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected');

    await Inventory.deleteMany();
    console.log('🗑 Cleared old inventory');

    await Inventory.insertMany(customPizzaOptions);
    console.log('🍕 Custom pizza options seeded successfully');

    process.exit();
  } catch (err) {
    console.error('❌ Error seeding custom options:', err);
    process.exit(1);
  }
};

seedCustomOptions();
