// src/store/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  email: string;
  full_name: string;
}

export interface AuthState {
  user: User | null;
  sid: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  loading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
  login: boolean | null;
}

// Using the shared API client instead of direct axios call
import api from '../../../services/api';

const API_URL =
  '/cirrhosis_custom.cirrhosis_auth.login';

// Login Thunk
export const loginUser = createAsyncThunk<
  any,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    console.log('Attempting login with URL:', API_URL);
    console.log('Credentials:', { email: credentials.email, password: '[REDACTED]' });
    
    // Using the shared API client which handles authentication automatically
    const response = await api.post(API_URL, credentials);
    
    const data = response.data;
    const msg = data.message;
    console.log('Login Response:', data);
    
    // Store user session data
    if (msg?.sid) {
      await EncryptedStorage.setItem('user_sid', msg.sid);
    }

    // Set onboarding flag to false by default (will be updated after onboarding)
    await EncryptedStorage.setItem('onboarding_completed', 'false');

    return data;
  } catch (error: any) {
    console.log('Login Error:', error);
    console.log('Error response:', error.response);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Login failed';

    return rejectWithValue(msg);
  }
});

export const registerUser = createAsyncThunk<
  any,
  { email: string; full_name: string; password: string },
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    console.log('Attempting registration with credentials:', { 
      email: credentials.email, 
      full_name: credentials.full_name, 
      password: '[REDACTED]' 
    });
    
    const response = await api.post('/cirrhosis_custom.cirrhosis_auth.register', credentials);

    const data = response.data;
    console.log('Register Response:', data);

    const msg = data.message;

    // Registration successful → sid milta hai → store kar do (same as login)
    if (msg?.sid) {
      await EncryptedStorage.setItem('user_sid', msg.sid);
      await EncryptedStorage.setItem('onboarding_completed', 'false');
    }

    return data;
  } catch (error: any) {
    console.log('Register Error:', error.response?.data || error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Registration failed';

    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: null,
    sid: null,
    apiKey: null,
    apiSecret: null,
    loading: false,
    error: null,
    onboardingCompleted: false,
     login: false,
  } as AuthState,

  reducers: {
    logout: state => {
      state.user = null;
      state.sid = null;
      state.error = null;
      EncryptedStorage.removeItem('user_sid');
    },

    setOnboardingCompleted: state => {
      state.onboardingCompleted = true;
      EncryptedStorage.setItem('onboarding_completed', 'true');
    },

    hydrateFromStorage: (
      state,
      action: PayloadAction<{ sid: string; onboarding: boolean }>,
    ) => {
      state.sid = action.payload.sid;
      state.apiKey = '72b96de8ae8c469';
      state.apiSecret = action.payload.sid;
      state.onboardingCompleted = action.payload.onboarding;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const msg = action.payload.message;

        // Check if the response indicates failure
        if (msg?.status === 'fail') {
          state.error = msg.message || 'Login failed';
          return;
        }

        // Extract user information from response
        const userData = msg?.user_data || {};
        
        state.user = {
          email: userData.email || msg.user || '',
          full_name: userData.full_name || userData.first_name || 'User',
        };

        state.sid = msg.sid;
        // Use the default API key and session ID as the secret
        state.apiKey = '72b96de8ae8c469';
        state.apiSecret = msg.sid;
        state.login = true;  
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const msg = action.payload.message;

        // Check if the response indicates failure
        if (msg?.status === 'fail') {
          state.error = msg.message || 'Registration failed';
          return;
        }

        state.user = {
          email: msg.user || msg.email, // ya jo bhi backend bhejta ho
          full_name: action.payload.full_name || 'User',
        };
        state.sid = msg.sid;
        // Use the default API key and session ID as the secret
        state.apiKey = '72b96de8ae8c469';
        state.apiSecret = msg.sid;
        state.login = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, setOnboardingCompleted, hydrateFromStorage } =
  authSlice.actions;

export default authSlice.reducer;
