import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../store/slices/authSlice';
import { PageLoader } from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;