import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPizzas, setFilters } from '../../store/slices/pizzaSlice';
import { Search, Filter, Star, Clock, ChefHat, ShoppingCart } from 'lucide-react';
import Loader from '../../components/Loader';

// Helper to safely get the price regardless of Map/Object
const getPrice = (prices) => {
  if (!prices) return 'N/A';

  if (prices instanceof Map) {
    return prices.get('small') || prices.get('medium') || prices.get('large') || 'N/A';
  }

  if (typeof prices === 'object') {
    return prices.small || prices.medium || prices.large || 'N/A';
  }

  return 'N/A';
};

// Prettify category names for display
const formatCategory = (category) => {
  if (!category) return '';
  const map = {
    'veg': 'Vegetarian',
    'non-veg': 'Non-Vegetarian'
  };
  return map[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: pizzas, isLoading, filters } = useSelector((state) => state.pizzas);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category }));
  };

  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm }));
  };

  // Get unique categories directly from pizza list
  const categories = Array.from(new Set(pizzas.map((p) => p.category)));

  const filteredPizzas = pizzas.filter((pizza) => {
    if (filters.category && pizza.category !== filters.category) return false;
    if (filters.search && !pizza.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return <Loader text="Loading your dashboard..." />;
  }

  // No pizzas in DB at all
  if (pizzas.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No pizzas available 🍽️</h2>
        <p className="text-gray-600 max-w-md mb-6">
          It looks like there are no pizzas in the system yet.
          {user?.role === 'admin'
            ? ' You can add pizzas from the admin panel to start selling.'
            : ' Please check back later to see our delicious menu.'}
        </p>
        {user?.role === 'admin' && (
          <Link
            to="/admin/add-pizza"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Add Your First Pizza
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user?.name}! 🍕
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Ready to create your perfect pizza or explore our delicious varieties?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              to="/custom"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <ChefHat className="h-5 w-5 mr-2" />
              Build Custom Pizza
            </Link>
            <Link
              to="/orders"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              My Orders
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pizzas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !filters.category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                    filters.category === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {formatCategory(category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pizza Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPizzas.map((pizza) => (
            <div key={pizza._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={pizza.image || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'}
                  alt={pizza.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                    {formatCategory(pizza.category)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{pizza.name}</h3>
                  <span className="text-lg font-bold text-blue-600 ml-2">
                    ₹{getPrice(pizza.prices)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pizza.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.5</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>25-30 min</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/pizzas/${pizza._id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to="/custom"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No pizzas match filter */}
        {filteredPizzas.length === 0 && pizzas.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pizzas found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
