import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPizzas, setFilters } from '../../store/slices/pizzaSlice';
import { ChefHat, Clock, Star, ArrowRight } from 'lucide-react';
import Loader from '../../components/Loader';

const Home = () => {
  const dispatch = useDispatch();
  const { list: pizzas, isLoading, filters } = useSelector((state) => state.pizzas);

  useEffect(() => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category }));
  };

  // Safely filter pizzas to avoid crashes
  const filteredPizzas = Array.isArray(pizzas)
    ? pizzas.filter((pizza) => {
        if (filters.category && pizza.category !== filters.category) return false;
        return true;
      })
    : [];

  if (isLoading) {
    return <Loader text="Loading delicious pizzas..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Delicious Pizzas
              <span className="text-yellow-400"> Delivered</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Craft your perfect pizza or choose from our signature varieties. 
              Fresh ingredients, authentic recipes, delivered hot to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/custom"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
              >
                <ChefHat className="h-5 w-5 mr-2" />
                Build Custom Pizza
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
              >
                Browse Menu
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PizzaHub?</h2>
            <p className="text-lg text-gray-600">Experience the best pizza delivery service in town</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the finest, freshest ingredients in every pizza we make.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Hot pizzas delivered to your door in 30 minutes or less, guaranteed.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Quality</h3>
              <p className="text-gray-600">Consistently rated 5 stars by our customers for taste and service.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Pizzas Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Pizzas</h2>
            <p className="text-lg text-gray-600">Discover our most popular pizza creations</p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => handleCategoryFilter('')}
              className={`px-6 py-2 rounded-full transition-colors ${
                !filters.category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {['vegetarian', 'non-vegetarian'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-6 py-2 rounded-full capitalize transition-colors ${
                  filters.category === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Pizza Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.slice(0, 6).map((pizza) => (
              <div key={pizza._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={pizza.image || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'}
                    alt={pizza.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{pizza.name}</h3>
                    <span className="text-lg font-bold text-blue-600">₹{pizza.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{pizza.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                      {pizza.category}
                    </span>
                    <Link
                      to={`/pizzas/${pizza._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              View All Pizzas
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
