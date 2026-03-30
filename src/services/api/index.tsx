// src/api/apiClient.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { store } from '../../redux/store';
import { logout } from '../../screens/auth/slices/authSlice';

import { BASE_URL } from './url';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 360000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Hardcoded default token for initial authentication
const DEFAULT_API_KEY = '72b96de8ae8c469';
const DEFAULT_API_SECRET = '96b6b5699febb74';

// Request Interceptor - Add Frappe Style Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const state = store.getState();
    const { apiKey, apiSecret, token } = state.auth;

    // Use user-specific token if available, otherwise use default tokens
    if (token && config.headers) {
      config.headers.Authorization = token;
    } else if (apiKey && apiSecret && config.headers) {
      config.headers.Authorization = `token ${apiKey}:${apiSecret}`;
    } else if (config.headers) {
      // Use default tokens for initial authentication
      config.headers.Authorization = `token ${DEFAULT_API_KEY}:${DEFAULT_API_SECRET}`;
    }

    if (__DEV__) {
      console.log(`API → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log(`Token Attached: ${config.headers?.Authorization || 'None'}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle 401 (Session Expired)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Frappe mein 401 ya 403 aata hai jab session expire ho
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Session expire → user ko logout kar do
      console.warn('Session expired or invalid token');
      store.dispatch(logout());

      // Optional: Auto navigate to login (if you use navigation ref)
      // NavigationService.navigate('Login');

      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Other errors
    const message = (error.response?.data as any)?.message 
      || (error.response?.data as any)?._server_messages 
      || error.message 
      || 'Network Error';

    // Frappe ka _server_messages JSON string mein aata hai, parse karo
    let cleanMessage = message;
    if (typeof message === 'string') {
      try {
        const parsed = JSON.parse(message);
        if (Array.isArray(parsed)) {
          cleanMessage = parsed.map(m => JSON.parse(m).message).join(', ');
        }
      } catch {}
    }

    console.error('API Error:', cleanMessage);
    return Promise.reject(new Error(cleanMessage));
  }
);

export default api;