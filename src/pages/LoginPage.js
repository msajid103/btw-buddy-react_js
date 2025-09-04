import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Smartphone, Shield } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const navigation = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setShow2FA(true);
    }
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    navigation('/dashboard');
    console.log('Login successful with 2FA');
    // Handle successful login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">     

        {/* Logo & Heading */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Log in to your <span className="font-semibold">VAT Buddy</span> account</p>
        </div>

        {!show2FA ? (
          // Login Form
          <form onSubmit={handleLogin} className="card bg-white/80 backdrop-blur-xl border border-gray-200 animate-fade-in">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
              
             
              <button
                type="submit"
                className="w-full btn-primary text-lg py-3 cursor-pointer shadow-md hover:shadow-lg"
                disabled={!email || !password}
                onClick={handleLogin}
              >
                Log In
             
              </button>
            
            </div>
          </form>
        ) : (
          // 2FA Form
          <form onSubmit={handle2FASubmit} className="card bg-white/90 backdrop-blur-xl border border-gray-200 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
              <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
            </div>

            <div className="space-y-6">
              <input
                id="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-widest"
                placeholder="••••••"
                maxLength="6"
                required
              />

              <button
                type="submit"
                className="w-full btn-primary text-lg py-3 shadow-md hover:shadow-lg"
                disabled={twoFactorCode.length !== 6}
              >
                Verify & Login
              </button>

              <button
                type="button"
                onClick={() => setShow2FA(false)}
                className="w-full btn-secondary"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Link */}
        {!show2FA && (
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don’t have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Secured with TLS Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
