import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { ButtonLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(resetPassword({ 
        token, 
        newPassword: formData.newPassword 
      }));
      
      if (resetPassword.fulfilled.match(result)) {
        setIsSuccess(true);
        toast.success('Password reset successful!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your password has been successfully reset. You will be redirected to login shortly.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-600 mt-2">Enter your new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <ButtonLoader /> : 'Reset Password'}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;