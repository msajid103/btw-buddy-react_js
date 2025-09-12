import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import useApi from '../hooks/useApi';
import { authService } from '../services/authService';

const EmailVerificationHandler = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { callApi, loading } = useApi();

  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        await callApi(authService.verifyEmail, token);
        setVerificationStatus('success');
        setMessage('Your email has been verified successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Email verified successfully! You can now log in.' }
          });
        }, 3000);

      } catch (error) {
        setVerificationStatus('error');
        const errorMessage = error.response?.data?.error || 'Email verification failed';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, callApi, navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <>
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Redirecting to login page in 3 seconds...
            </p>
          </>
        );

      case 'error':
        return (
          <>
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </>
        );

      default:
        return null;
    }
  };

  const renderActions = () => {
    if (verificationStatus === 'success') {
      return (
        <button
          onClick={handleGoToLogin}
          className="w-full btn-primary text-lg py-3 cursor-pointer shadow-md hover:shadow-lg 
  flex items-center justify-center space-x-2"
        >
          Continue to Login
        </button>

      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="space-y-3">
          <button
            onClick={handleGoToLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={handleGoToRegister}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Register Again
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {renderContent()}
        </div>

        <div className="mt-8">
          {renderActions()}
        </div>

        {verificationStatus === 'error' && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact support for assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationHandler;