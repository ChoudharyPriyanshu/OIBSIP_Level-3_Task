import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCurrentOrder } from '../../store/slices/orderSlice';
import { CheckCircle, Package, Clock, Truck } from 'lucide-react';

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state) => state.orders);

  useEffect(() => {
    // Clear the current order after showing success
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your order. We're preparing your delicious custom pizza!
          </p>

          {currentOrder && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              {currentOrder.customPizza && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base:</span>
                    <span>{currentOrder.customPizza.base?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sauce:</span>
                    <span>{currentOrder.customPizza.sauce?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cheese:</span>
                    <span>{currentOrder.customPizza.cheese?.name}</span>
                  </div>
                  {currentOrder.customPizza.veggies?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Veggies:</span>
                      <span>{currentOrder.customPizza.veggies.map(v => v.name).join(', ')}</span>
                    </div>
                  )}
                  {currentOrder.customPizza.meat?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meat:</span>
                      <span>{currentOrder.customPizza.meat.map(m => m.name).join(', ')}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{currentOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Estimated Timeline */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">Estimated Timeline</h3>
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col items-center">
                <Package className="h-6 w-6 text-blue-600 mb-1" />
                <span className="font-medium">Received</span>
                <span className="text-blue-600">Now</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-6 w-6 text-blue-600 mb-1" />
                <span className="font-medium">In Kitchen</span>
                <span className="text-blue-600">15 mins</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-6 w-6 text-blue-600 mb-1" />
                <span className="font-medium">Out for Delivery</span>
                <span className="text-blue-600">30 mins</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/orders"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block"
            >
              Track Your Order
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/custom"
                className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors text-center"
              >
                Order Another Pizza
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-center"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;