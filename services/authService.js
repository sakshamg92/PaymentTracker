import axios from 'axios';
// const API_URL = 'http://10.0.2.2:5000/api/auth/';
const API_URL = 'https://resourcemanagement-backend.onrender.com/api/auth';

export const signup = async userData => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const login = async userData => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const forgotPassword = async email => {
  const response = await axios.post(`${API_URL}/forgot-password`, {email});
  return response.data;
};
