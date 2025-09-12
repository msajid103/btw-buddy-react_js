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
};