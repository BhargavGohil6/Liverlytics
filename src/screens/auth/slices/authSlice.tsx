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
  loading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
  login: boolean | null;
}

const API_URL =
  'https://cirrhosis.mukesoft.com/api/method/cirrhosis_custom.cirrhosis_auth.login';

// Login Thunk
export const loginUser = createAsyncThunk<
  any,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, credentials, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
      },
    });

    const data = response.data;
    const msg = data.message;
    console.log(data);
    // EncryptedStorage me SID save karo
    if (msg?.sid) {
      loin: true;
      await EncryptedStorage.setItem('user_sid', msg.sid);
    }

    // Onboarding flag default
    await EncryptedStorage.setItem('onboarding_completed', 'false');

    return data;
  } catch (error: any) {
    console.log(error);
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
    const response = await axios.post(
      'https://cirrhosis.mukesoft.com/api/method/cirrhosis_custom.cirrhosis_auth.register',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
        },
      },
    );

    const data = response.data;
    console.log('Register Response:', data);

    const msg = data.message;

    // Registration successful → sid milta hai → store kar do (same as login)
    if (msg?.sid) {
      loin: true; 
      await EncryptedStorage.setItem('user_sid', msg.sid);
      await EncryptedStorage.setItem('onboarding_completed', 'false');
    }

    return data;
  } catch (error: any) {
    console.log('Register Error:', error.response?.data || error);

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

        state.user = {
          email: msg.user,
          full_name: action.payload.full_name || 'User',
        };

        state.sid = msg.sid;
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

        state.user = {
          email: msg.user || msg.email, // ya jo bhi backend bhejta ho
          full_name: action.payload.full_name || 'User',
        };
        state.sid = msg.sid;
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
