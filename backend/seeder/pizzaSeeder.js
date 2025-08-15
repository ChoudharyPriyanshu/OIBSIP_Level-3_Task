const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const Pizza = require('../models/Pizza');

// Load .env from backend root folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pizzas = [
  {
    name: "Margherita",
    description: "Classic delight with 100% real mozzarella cheese",
    image: "https://cdn.pixabay.com/photo/2023/05/28/14/13/ai-generated-8023787_1280.jpg",
    variants: ["small", "medium", "large"],
    prices: { small: 200, medium: 350, large: 500 },
    category: "veg"
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded with pepperoni and cheese",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg",
    variants: ["small", "medium", "large"],
    prices: { small: 250, medium: 400, large: 600 },
    category: "non-veg"
  },
  {
    name: "Veggie Supreme",
    description: "Onions, capsicum, mushrooms, tomatoes, and corn",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg",
    variants: ["small", "medium", "large"],
    prices: { small: 230, medium: 380, large: 550 },
    category: "veg"
  },
  {
    name: "BBQ Chicken",
    description: "Grilled chicken, BBQ sauce, onions, and mozzarella",
    image: "https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg",
    variants: ["small", "medium", "large"],
    prices: { small: 280, medium: 450, large: 650 },
    category: "non-veg"
  },
  {
    name: "Paneer Tikka",
    description: "Spicy paneer cubes with onions and capsicum",
    image: "https://images.pexels.com/photos/11974635/pexels-photo-11974635.jpeg",
    variants: ["small", "medium", "large"],
    prices: { small: 240, medium: 390, large: 560 },
    category: "veg"
  },
  {
    name: "Four Cheese",
    description: "Mozzarella, cheddar, parmesan, and blue cheese",
    image: "https://images.pexels.com/photos/15478006/pexels-photo-15478006.jpeg",
    variants: ["small", "medium", "large"],
    prices: { small: 300, medium: 480, large: 700 },
    category: "veg"
  },
  {
    name: "Hawaiian",
    description: "Pineapple, ham, and mozzarella on tomato sauce",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Supreme_pizza.jpg",
    variants: ["small", "medium", "large"],
    prices: { small: 260, medium: 420, large: 600 },
    category: "non-veg"
  },
  {
    name: "Mexican Green Wave",
    description: "Mexican herbs, capsicum, onions, tomatoes, and jalapeños",
    image: "https://images.pexels.com/photos/28196218/pexels-photo-28196218.jpeg",
    variants: ["small", "medium", "large"],
    prices: { small: 240, medium: 390, large: 570 },
    category: "veg"
  }
];

const importData = async () => {
  try {
    await connectDB();
    await Pizza.deleteMany();
    await Pizza.insertMany(pizzas);
    console.log('✅ Pizza Data Imported with images!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing pizza data:', error);
    process.exit(1);
  }
};

importData();
