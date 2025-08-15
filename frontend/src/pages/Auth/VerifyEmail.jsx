import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../../store/slices/authSlice';
import { CheckCircle, XCircle } from 'lucide-react';
import Loader from '../../components/Loader';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const result = await dispatch(verifyEmail(token));
        if (verifyEmail.fulfilled.match(result)) {
          setStatus('success');
         setMessage(result.payload.message || 'Email verified successfully!');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed');
      }
    };

    if (token) {
      handleVerification();
    } else {
      setStatus('error');
      setMessage('Invalid verification token');
    }
  }, [dispatch, token]);

  if (status === 'loading') {
    return <Loader text="Verifying your email..." />;
  }

  return (
    <div className="text-center">
      {status === 'success' ? (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
          >
            Continue to Login
          </Link>
        </>
      ) : (
        <>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link
              to="/register"
              className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
            >
              Register Again
            </Link>
            <Link
              to="/login"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;