import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzaById } from '../../store/slices/pizzaSlice';
import { Star, Clock, ChefHat, ArrowLeft } from 'lucide-react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPizza: pizza, isLoading } = useSelector((state) => state.pizzas);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPizzaById(id));
    }
  }, [dispatch, id]);

  const handleOrderNow = () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    
    // For now, navigate to custom pizza builder
    // In a full implementation, you might add this pizza to cart
    navigate('/custom');
  };

  if (isLoading) {
    return <Loader text="Loading pizza details..." />;
  }

  if (!pizza) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pizza not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={pizza.image || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'}
                alt={pizza.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full capitalize mb-2">
                  {pizza.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{pizza.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.8 (124 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>25-30 mins</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{pizza.description}</p>
              </div>

              {pizza.ingredients && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {pizza.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">₹{pizza.price}</span>
                    <span className="text-gray-600 ml-2">for regular size</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <ChefHat className="h-4 w-4 inline mr-1" />
                    Handcrafted with love
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleOrderNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Order Now
                  </button>
                  <button
                    onClick={() => navigate('/custom')}
                    className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutritional Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">320</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">12g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">28g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">14g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;