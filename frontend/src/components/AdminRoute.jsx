import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />}
    </ProtectedRoute>
  );
};

export default AdminRoute;