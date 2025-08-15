// server.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
// const morgan = require('morgan');
const cookieParser = require('cookie-parser');


// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
// app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users',userRoutes );

   

// Health check
app.get('/', (req, res) => {
  res.send('Pizza Delivery API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
