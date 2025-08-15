import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Public/Home';
import PizzaDetails from './pages/Public/PizzaDetails';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// User Pages
import Dashboard from './pages/User/Dashboard';
import CustomPizzaBuilder from './pages/User/CustomPizzaBuilder';
import Checkout from './pages/User/Checkout';
import Orders from './pages/User/Orders';
import OrderSuccess from './pages/User/OrderSuccess';
import Profile from './pages/User/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminInventory from './pages/Admin/Inventory';
import AdminPizzas from './pages/Admin/Pizzas';
import AdminOrders from './pages/Admin/Orders';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="pizzas/:id" element={<PizzaDetails />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email/:token" element={<VerifyEmail />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Legacy auth routes for backward compatibility */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/register" element={<AuthLayout />}>
            <Route index element={<Register />} />
          </Route>
          <Route path="/verify-email/:token" element={<AuthLayout />}>
            <Route index element={<VerifyEmail />} />
          </Route>
          <Route path="/forgot-password" element={<AuthLayout />}>
            <Route index element={<ForgotPassword />} />
          </Route>
          <Route path="/reset-password/:token" element={<AuthLayout />}>
            <Route index element={<ResetPassword />} />
          </Route>

          {/* Protected User Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="custom" element={
              <ProtectedRoute>
                <CustomPizzaBuilder />
              </ProtectedRoute>
            } />
            <Route path="checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="orders/success" element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="pizzas" element={<AdminPizzas />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                <a
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;