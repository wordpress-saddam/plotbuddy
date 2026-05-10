import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// IMPORTANT: Replace with your local machine's IP address for physical device testing
// Example: http://192.168.1.15:5001/api
// const BASE_URL = 'http://localhost:5001/api';
const BASE_URL = 'http://192.168.74.100:5001/api';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('plotbuddy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
