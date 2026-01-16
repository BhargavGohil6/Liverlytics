import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Toast from 'react-native-toast-message';

// Types
export interface VitalData {
  name?: string;
  heart_rate?: number;
  weight?: number;
  blood_pressure?: string;
  sleep?: number;
  steps?: number;
  spo2?: number;
  glucose?: number;
  date?: string;
  user?: string;
  is_today?: boolean;
}

export interface MeldData {
  name?: string;
  serum_creatinine?: string;
  serum_sodium?: string;
  total_bilirubin?: string;
  inr?: string;
  albumin?: string;
  sex_at_birth?: string;
  creation?: string;
  user?: string;
  is_today?: boolean;
}

export interface DietData {
  name?: string;
  item_name?: string;
  sodium?: string;
  fluid_ml?: string;
  creation?: string;
  user?: string;
  is_today?: boolean;
}

export interface ExerciseData {
  name?: string;
  steps?: string;
  resting_hr?: string;
  sleep_minutes?: string;
  exercise_name?: string;
  user?: string;
  creation?: string;
  date?: string;
  is_today?: boolean;
}

export interface MedicationTiming {
  time?: string;
  taken?: number;
  taken_time?: string | null;
  date?: string;
}

export interface MedicationData {
  name?: string;
  name1?: string;
  dose?: number;
  with_food?: number;
  user?: string;
  creation?: string;
  modified?: string;
  timings_count?: number;
  timings?: MedicationTiming[];
  is_today?: boolean;
}

export interface DashboardData {
  status?: string;
  date?: string;
  email?: string;
  vital?: VitalData;
  meld?: MeldData;
  diet?: DietData;
  exercise?: ExerciseData;
  medications?: MedicationData;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const API_URL = 'https://cirrhosis.mukesoft.com/api/method/cirrhosis_custom.cirrhosis_dashboard.get_dashboard';

// Fetch Dashboard Data Thunk
export const fetchDashboardData = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>('dashboard/fetchData', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      API_URL,
      { email: payload.email },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
        },
      }
    );

    const data = response.data;
    console.log('Dashboard API Response:', data);

    // Check if response has message object
    if (data.message) {
      Toast.show({
        type: 'success',
        text1: 'Dashboard Loaded',
        text2: 'Your health data has been updated',
        visibilityTime: 2000,
      });
      return data.message;
    }

    return data;
  } catch (error: any) {
    console.log('Dashboard API Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch dashboard data';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });

    return rejectWithValue(msg);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    loading: false,
    error: null,
  } as DashboardState,

  reducers: {
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      });
  },
});

export const { clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;