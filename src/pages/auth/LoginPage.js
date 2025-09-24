import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, Mail, Loader2, Shield } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import TwoFactorAuthForm from '../../components/auth/TwoFactorAuthForm';
import Modal from '../../components/common/Modal';
import logo from '../../assets/logo.png';
import { authService } from '../../services/authService'; // Add this import
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Add these new states:
  const [pendingUserId, setPendingUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email && password) {
        const response = await login(email, password);

        // Check if response indicates 2FA is required
        if (response?.data?.requires_2fa) {
          setPendingUserId(response.data.user_id);
          setUserEmail(response.data.email);
          setShowModal(true);
        } else if (response?.data?.user?.is_2fa_enabled) {
          // Fallback check if response structure is different
          setPendingUserId(response.data.user.id);
          setUserEmail(response.data.user.email);
          setShowModal(true);
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      setError("Invalid email or password");
      // alert("Login failed!", error);
    }
  };

  // Updated handle2FASubmit function:
  const handle2FASubmit = async (e) => {
    e.preventDefault();

    if (twoFactorCode.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await authService.verifyOTP(pendingUserId, twoFactorCode);

      // Store tokens
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);

      // Close modal and redirect
      setShowModal(false);
      // Use navigation instead of window.location.href
       window.location.href = "/";

    } catch (error) {
      alert("Invalid OTP code. Please try again.");
      setTwoFactorCode(''); // Clear the input
    } finally {
      setOtpLoading(false);
    }
  };

  // Rest of your component remains the same until the Modal part:
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo & Heading */}
        <div className="text-center mb-10">
          <img
            src={logo}
            alt="VAT Buddy Logo"
            className="w-[6rem] h-[6rem] object-contain item-center mx-auto mb-4"
          />
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Log in to your <span className="font-semibold">BTW Buddy</span> account</p>
        </div>

        <form onSubmit={handleLogin} className="card bg-white/80 backdrop-blur-xl border border-gray-200 animate-fade-in">
          <div className="space-y-6">
            {error && (
              <div className="flex justify-center items-center text-red-600 text-lg mt-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
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
                  onFocus={() => setError("")}
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
                  onFocus={() => setError("")}
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
              className="w-full btn-primary text-lg py-3 cursor-pointer shadow-md hover:shadow-lg 
             flex items-center justify-center space-x-2"
              disabled={!email || !password || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "Log In"
              )}
            </button>

          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Secured with TLS Encryption</span>
        </div>
      </div>

      {/* Updated Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Two Factor Authentication"
        size="lg"
      >
        <TwoFactorAuthForm
          onSubmit={handle2FASubmit}
          twoFactorCode={twoFactorCode}
          setTwoFactorCode={setTwoFactorCode}
          onClose={() => setShowModal(false)}
          loading={otpLoading} // Pass loading state
          email={userEmail} // Pass email for display
        />
      </Modal>
    </div>
  );
};

export default LoginPage;