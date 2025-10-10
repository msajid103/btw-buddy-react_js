import api from './api';

export const authService = {
  step1validation: async (form1data) => {
    const response = await api.post('/auth/register/step1/validate/', form1data)
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register/complete/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post('/auth/logout', { refreshToken });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  sendVerificationEmail: async (email) => {
    const response = await api.post('/auth/send-verification-email/', { email });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },
  
  verifyOTP: async (userId, otpCode) => {
  const response = await api.post('/auth/verify-otp/', { 
    user_id: userId, 
    otp_code: otpCode 
  });
  return response.data;
},

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
  // Request password reset
async requestPasswordReset(email) {
  try {
    const response = await api.post('/auth/password-reset/', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw new Error(
      error.response?.data?.email?.[0] || 
      error.response?.data?.message || 
      'Failed to send reset email'
    );
  }
},

// Validate reset token
async validateResetToken(uid, token) {
  try {
    const response = await api.get(`/auth/password-reset-validate/${uid}/${token}/`);
    return response.data;
  } catch (error) {
    console.error('Token validation error:', error);
    throw new Error(
      error.response?.data?.message || 
      'Invalid or expired token'
    );
  }
},

// Confirm password reset
async confirmPasswordReset(uid, token, newPassword, confirmPassword) {
  try {
    const response = await api.post('/auth/password-reset-confirm/', {
      uid,
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    throw new Error(
      error.response?.data?.new_password?.[0] || 
      error.response?.data?.non_field_errors?.[0] || 
      error.response?.data?.message || 
      'Failed to reset password'
    );
  }
},
};