import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import useApi from '../hooks/useApi';
import { authService } from '../services/authService';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { callApi, loading } = useApi();

  const [email, setEmail] = useState(location.state?.email || '');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    setMessage(`We've sent a verification email to ${email}. Please check your inbox and click the verification link.`);
    setMessageType('info');
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    try {
      await callApi(authService.sendVerificationEmail, email);
      setMessage('Verification email sent successfully! Please check your inbox.');
      setMessageType('success');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.');
      setMessageType('error');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Mail className="w-5 h-5 text-blue-500" />;
    }
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We need to verify your email address to complete your registration
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Message Display */}
          <div className={`rounded-md border p-4 flex items-start space-x-3 ${getMessageStyles()}`}>
            {getMessageIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>

          {/* Email Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email sent to:</p>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={resendCooldown > 0 || loading}
              className={`w-full btn-primary text-lg py-3 cursor-pointer shadow-md hover:shadow-lg 
    flex items-center justify-center space-x-2
    ${resendCooldown > 0 || loading ? "opacity-50 cursor-not-allowed" : ""}
  `}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Verification Email"}
                </>
              )}
            </button>


            <button
              onClick={handleBackToLogin}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Login
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResendEmail}
                disabled={resendCooldown > 0 || loading}
                className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
              >
                resend verification email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;