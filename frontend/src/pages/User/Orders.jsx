import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/slices/orderSlice';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import Loader from '../../components/Loader';

const Orders = () => {
  const dispatch = useDispatch();
  const { myOrders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
    
    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      dispatch(fetchMyOrders());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'dispatched':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Order Received';
      case 'dispatched':
        return 'In Kitchen';
      case 'delivered':
        return 'Sent to Delivery';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && myOrders.length === 0) {
    return <Loader text="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="text-sm text-gray-500">
            Updates every 10 seconds
          </div>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <a
              href="/custom"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Build Your First Pizza
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  {order.customPizza && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Custom Pizza</h4>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Base:</span>{' '}
                          <span className="font-medium">{order.customPizza.base?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sauce:</span>{' '}
                          <span className="font-medium">{order.customPizza.sauce?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cheese:</span>{' '}
                          <span className="font-medium">{order.customPizza.cheese?.name || 'N/A'}</span>
                        </div>
                        {order.customPizza.veggies?.length > 0 && (
                          <div>
                            <span className="text-gray-600">Veggies:</span>{' '}
                            <span className="font-medium">
                              {order.customPizza.veggies.map(v => v.name || v).join(', ')}
                            </span>
                          </div>
                        )}
                        {order.customPizza.meat?.length > 0 && (
                          <div>
                            <span className="text-gray-600">Meat:</span>{' '}
                            <span className="font-medium">
                              {order.customPizza.meat.map(m => m.name || m).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.shippingAddress && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p className="mt-1">📞 {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">
                        {order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        ['processing', 'dispatched', 'delivered'].includes(order.status) 
                          ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      Order Placed
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        ['dispatched', 'delivered'].includes(order.status) 
                          ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      In Kitchen
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      Out for Delivery
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;