//frontend/src/services/authService.js
import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  const {user, token} = response.data.data;
  localStorage.setItem('token', token);
  return {user, token};
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { user, token } = response.data.data;
  localStorage.setItem('token', token);
  return { user, token };
};


const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
  
};

const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
  return response.data;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword
};