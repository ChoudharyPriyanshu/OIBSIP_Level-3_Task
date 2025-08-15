import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Package, Pizza, ShoppingBag, BarChart3 } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Pizzas', href: '/admin/pizzas', icon: Pizza },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        <nav className="mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;