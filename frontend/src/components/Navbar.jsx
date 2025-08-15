import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Pizza, User, ShoppingCart, LogOut, Shield, Menu, X } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Pizza className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PizzaHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/custom"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Build Pizza
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Orders
                </Link>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3 ml-4">
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="h-4 w-4 mr-1" />
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/custom"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Build Pizza
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;