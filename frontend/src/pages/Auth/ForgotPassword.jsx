import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError } from '../../store/slices/authSlice';
import { Mail, ArrowLeft } from 'lucide-react';
import { ButtonLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      const result = await dispatch(forgotPassword(email));
      if (forgotPassword.fulfilled.match(result)) {
        setIsSubmitted(true);
        toast.success('Password reset email sent!');
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Didn't receive the email? Check your spam folder or try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full text-blue-600 hover:text-blue-700 font-medium"
          >
            Try different email
          </button>
          <Link
            to="/login"
            className="flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-600 mt-2">
          Enter your email address and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <ButtonLoader /> : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link
          to="/login"
          className="flex items-center justify-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;