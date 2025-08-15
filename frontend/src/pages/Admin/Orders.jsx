import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { Package, Clock, Truck, CheckCircle, X } from 'lucide-react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders: orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const statusOptions = [
    { value: 'processing', label: 'Received', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'dispatched', label: 'In Kitchen', color: 'bg-blue-100 text-blue-800' },
    { value: 'delivered', label: 'Sent to Delivery', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'dispatched':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      if (updateOrderStatus.fulfilled.match(result)) {
        toast.success(`Order status updated to ${getStatusConfig(newStatus).label}`);
      }
    } catch (error) {
      toast.error('Failed to update order status');
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

  if (isLoading) {
    return <Loader text="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage customer orders and update status</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.map((status) => {
          const count = orders.filter(order => order.status === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${status.color}`}>
                  {getStatusIcon(status.value)}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{status.label}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
          <p className="text-gray-600">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Guest'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.customPizza ? (
                          <div>
                            <div className="font-medium">Custom Pizza</div>
                            <div className="text-xs text-gray-500">
                              Base: {order.customPizza.base?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              Sauce: {order.customPizza.sauce?.name || 'N/A'}
                            </div>
                          </div>
                        ) : (
                          <div>Standard Pizza</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {order.paymentMethod === 'razorpay' ? 'Online' : 'COD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusConfig(order.status).color
                      }`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusConfig(order.status).label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y max-h-64 overflow-y-auto">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${getStatusConfig(order.status).color}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order._id.slice(-8)} - {getStatusConfig(order.status).label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.name} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;