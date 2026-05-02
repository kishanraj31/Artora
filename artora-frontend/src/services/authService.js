// authService — login and register API calls
import api from '../utils/api';
import { saveAuth } from '../utils/auth';

export const register = async (name, email, password, role) => {
  try {
    const response = await api.post('/auth/register', { name, email, password, role });
    saveAuth(response.data.token, response.data.user);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    saveAuth(response.data.token, response.data.user);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
