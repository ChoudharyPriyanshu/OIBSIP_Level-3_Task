import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { fetchAllOrders } from '../../store/slices/orderSlice';
import { fetchAllUsers } from '../../store/slices/usersSlice';
import { fetchPizzas } from '../../store/slices/pizzaSlice';
import { Users, Package, Pizza, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: inventory, isLoading: inventoryLoading } = useSelector((state) => state.inventory);
  const { allOrders, isLoading: ordersLoading } = useSelector((state) => state.orders);
  const { list: users, isLoading: usersLoading } = useSelector((state) => state.users);
  const { list: pizzas, isLoading: pizzasLoading } = useSelector((state) => state.pizzas);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
    dispatch(fetchPizzas());
  }, [dispatch]);

  // Calculate stats
  const totalUsers = users.length;
  const totalPizzas = pizzas.length;
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const lowStockItems = inventory.filter(item => item.quantity < (item.threshold || 10));
  
  const recentOrders = allOrders.slice(0, 5);
  const processingOrders = allOrders.filter(order => order.status === 'processing').length;

  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      loading: usersLoading,
    },
    {
      title: 'Total Pizzas',
      value: totalPizzas,
      icon: Pizza,
      color: 'bg-green-500',
      loading: pizzasLoading,
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      loading: ordersLoading,
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      loading: ordersLoading,
    },
  ];

  if (inventoryLoading && ordersLoading && usersLoading && pizzasLoading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your pizza business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  {stat.loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
          </div>
          <p className="text-yellow-700 mt-1">
            {lowStockItems.length} items are running low on stock. 
            <a href="/admin/inventory" className="text-yellow-800 font-medium ml-1 hover:underline">
              View Inventory →
            </a>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowStockItems.slice(0, 5).map((item) => (
              <span key={item._id} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                {item.name} ({item.quantity} left)
              </span>
            ))}
            {lowStockItems.length > 5 && (
              <span className="text-yellow-700 text-xs">
                +{lowStockItems.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <a 
                href="/admin/orders" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all →
              </a>
            </div>
          </div>
          <div className="divide-y">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders yet
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || 'Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.totalAmount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Processing Orders</span>
              <span className="font-semibold text-yellow-600">{processingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Low Stock Items</span>
              <span className="font-semibold text-red-600">{lowStockItems.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Inventory Items</span>
              <span className="font-semibold text-blue-600">{inventory.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold text-green-600">
                ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;