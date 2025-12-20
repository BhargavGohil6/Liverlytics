// src/api/apiClient.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { store } from '../store/store';
import { logout, setCredentials } from '../store/slices/authSlice';

const BASE_URL = 'https://cirrhosis.mukesoft.com/api/';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor - Add Frappe Style Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const state = store.getState();
    const { apiKey, apiSecret } = state.auth;

    // Agar dono hain toh header set karo
    if (apiKey && apiSecret && config.headers) {
      config.headers.Authorization = `token ${apiKey}:${apiSecret}`;
    }

    if (__DEV__) {
      console.log(`API → ${config.method?.toUpperCase()} ${config.url}`);
      if (apiKey) console.log(`Token Attached: token ${apiKey}:***`);
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