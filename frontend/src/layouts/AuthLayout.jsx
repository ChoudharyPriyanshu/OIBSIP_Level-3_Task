import React from 'react';
import { Outlet } from 'react-router-dom';
import { Pizza } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-full">
                <Pizza className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">PizzaHub</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <Outlet />
          </div>
        </div>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </div>
  );
};

export default AuthLayout;