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
  gender_custom?: string;
  age?: string;
  country_code?: string;
  weight?: string;
}

export interface AuthState {
  user: User | null;
  sid: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
  login: boolean | null;
  gender_custom?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  reenter_new_password: string;
}

export interface SendResetOtpPayload {
  email: string;
}

export interface ResetPasswordWithOtpPayload {
  email: string;
  otp: string;
  new_password: string;
}

// Using the shared API client instead of direct axios call
import api from '../../../services/api';

const API_URL =
  '/cirrhosis_custom.cirrhosis_auth.login';

const CHANGE_PASSWORD_URL =
  '/cirrhosis_custom.cirrhosis_auth.change_password';

const SEND_RESET_OTP_URL =
  '/cirrhosis_custom.cirrhosis_auth.send_reset_otp';

const RESET_PASSWORD_WITH_OTP_URL =
  '/cirrhosis_custom.cirrhosis_auth.reset_password_with_otp';

// Login Thunk
export const loginUser = createAsyncThunk<
  any,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
   
    // Using the shared API client which handles authentication automatically
    const response = await api.post(API_URL, credentials);
    
    const data = response.data;
    const msg = data.message;
    console.log('Login Response:', data);
    
    // Check if the response indicates failure - some APIs return 200 even for failures
    if (data.status === 'fail' || (msg && msg.status === 'fail')) {
      const errorMsg = (msg && msg.message) || data.message || 'Login failed';
      return rejectWithValue(errorMsg);
    }
    
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
  { email: string; full_name: string; password: string; country_code?: string; gender_custom?: string },
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

    // Check if the response indicates failure
    if (data.status === 'fail' || (msg && msg.status === 'fail')) {
      const errorMsg = (msg && msg.message) || data.message || 'Registration failed';
      return rejectWithValue(errorMsg);
    }

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
    token: null,
    loading: false,
    error: null,
    onboardingCompleted: false,
     login: false,
    gender_custom: undefined,
  } as AuthState,

  reducers: {
    logout: state => {
      state.user = null;
      state.sid = null;
      state.error = null;
      state.login = false;
      EncryptedStorage.removeItem('user_sid');
    },

    setOnboardingCompleted: state => {
      state.onboardingCompleted = true;
      EncryptedStorage.setItem('onboarding_completed', 'true');
    },

    hydrateFromStorage: (
      state,
      action: PayloadAction<{ sid: string; onboarding: boolean; token?: string }>,
    ) => {
      state.sid = action.payload.sid;
      state.apiKey = '72b96de8ae8c469';
      state.apiSecret = action.payload.sid;
      state.token = action.payload.token || `token 72b96de8ae8c469:${action.payload.sid}`;
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
        const response = action.payload;
        
        // Handle the case where response data is at the top level of the response
        const responseData = response.message || response;
        
        state.user = {
          email: responseData.user || '',
          full_name: responseData.full_name || 'User',
          gender_custom: responseData.gender_custom,
          age: responseData.age?.toString(),
          country_code: responseData.country_code,
          weight: responseData.weight?.toString(),
        };

        state.gender_custom = responseData.gender_custom;
        state.sid = responseData.sid;
        // Extract token from response, fallback to hardcoded if not provided
        state.token = responseData.token || `token ${responseData.api_key || '72b96de8ae8c469'}:${responseData.api_secret || responseData.sid || '96b6b5699febb74'}`;
        // Extract API key and secret from response, fallback to defaults if not provided
        state.apiKey = responseData.api_key || '72b96de8ae8c469';
        state.apiSecret = responseData.api_secret || responseData.sid || '96b6b5699febb74';
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
        const response = action.payload;
        
        // Handle the case where response data is at the top level of the response
        const responseData = response.message || response;
        
        state.user = {
          email: responseData.user || '',
          full_name: responseData.full_name || 'User',
          gender_custom: responseData.gender_custom,
          age: responseData.age?.toString(),
          country_code: responseData.country_code,
          weight: responseData.weight?.toString(),
        };
        state.gender_custom = responseData.gender_custom;
        state.sid = responseData.sid;
        // Extract token from response, fallback to hardcoded if not provided
        state.token = responseData.token || `token ${responseData.api_key || '72b96de8ae8c469'}:${responseData.api_secret || responseData.sid || '96b6b5699febb74'}`;
        // Extract API key and secret from response, fallback to defaults if not provided
        state.apiKey = responseData.api_key || '72b96de8ae8c469';
        state.apiSecret = responseData.api_secret || responseData.sid || '96b6b5699febb74';
        state.login = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(changePassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Password changed successfully - no state changes needed
        // The success message will be handled in the component
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password change failed';
      })
      .addCase(sendResetOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // OTP sent successfully - no state changes needed
      })
      .addCase(sendResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send OTP';
      })
      .addCase(resetPasswordWithOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordWithOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Password reset successfully - no state changes needed
      })
      .addCase(resetPasswordWithOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password reset failed';
      });
  },
});

// Change Password Thunk
export const changePassword = createAsyncThunk<
  any,
  ChangePasswordPayload,
  { rejectValue: string }
>('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    // Using the shared API client which handles authentication automatically
    const response = await api.post(CHANGE_PASSWORD_URL, payload);
    
    const data = response.data;
    const msg = data.message;
    console.log('Change Password Response:', data);
    
    // Check if the response indicates failure
    if (data.status === 'fail' || (msg && msg.status === 'fail')) {
      const errorMsg = (msg && msg.message) || data.message || 'Password change failed';
      return rejectWithValue(errorMsg);
    }
    
    return data;
  } catch (error: any) {
    console.log('Change Password Error:', error);
    console.log('Error response:', error.response);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Password change failed';

    return rejectWithValue(msg);
  }
});

export const { logout, setOnboardingCompleted, hydrateFromStorage } =
  authSlice.actions;

// Send Reset OTP Thunk
export const sendResetOtp = createAsyncThunk<
  any,
  SendResetOtpPayload,
  { rejectValue: string }
>('auth/sendResetOtp', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post(SEND_RESET_OTP_URL, payload);
    
    const data = response.data;
    console.log('Send Reset OTP Response:', data);
    
    // Check if the response indicates failure
    if (data.status === 'fail' || (data.message && data.message.status === 'fail')) {
      const errorMsg = (data.message && data.message.message) || data.message || 'Failed to send OTP';
      return rejectWithValue(errorMsg);
    }
    
    return data;
  } catch (error: any) {
    console.log('Send Reset OTP Error:', error);
    console.log('Error response:', error.response);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to send OTP';

    return rejectWithValue(msg);
  }
});

// Reset Password with OTP Thunk
export const resetPasswordWithOtp = createAsyncThunk<
  any,
  ResetPasswordWithOtpPayload,
  { rejectValue: string }
>('auth/resetPasswordWithOtp', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post(RESET_PASSWORD_WITH_OTP_URL, payload);
    
    const data = response.data;
    console.log('Reset Password with OTP Response:', data);
    
    // Check if the response indicates failure
    if (data.status === 'fail' || (data.message && data.message.status === 'fail')) {
      const errorMsg = (data.message && data.message.message) || data.message || 'Password reset failed';
      return rejectWithValue(errorMsg);
    }
    
    return data;
  } catch (error: any) {
    console.log('Reset Password with OTP Error:', error);
    console.log('Error response:', error.response);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Password reset failed';

    return rejectWithValue(msg);
  }
});

export default authSlice.reducer;
