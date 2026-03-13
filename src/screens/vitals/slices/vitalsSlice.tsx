import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api/index';
import Toast from 'react-native-toast-message';

// Types
export interface VitalsData {
  heart_rate?: string | number;
  resting_heart_rate?: string | number;
  weight?: string | number;
  glucose?: string | number;
  blood_pressure_systolic?: string | number;
  blood_pressure_diastolic?: string | number;
  spo2?: string | number;
  sleep?: string | number;
  sleep_hours?: number;
  sleep_minutes?: number;
  user?: string;
  date?: string;
  vital_id?: string;
  // Keep these for backward compatibility if needed by other components
  blood_pressure?: string | number;
  steps?: string | number;
  spO2?: string | number; 
  weight_unit?: string;
}

export interface VitalRecord {
  name?: string;
  heart_rate?: number;
  resting_heart_rate?: number;
  weight?: number;
  weight_unit?: string;
  blood_pressure?: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  sleep?: number;
  sleep_hours?: number;
  sleep_minutes?: number;
  steps?: number;
  glucose?: number;
  spo2?: number;
  date?: string;
  report_upload?: string | null;
  user?: string;
  creation?: string;
  owner?: string;
}

export interface VitalsApiResponse {
  status: string;
  count?: number;
  date?: string;
  data: VitalRecord[] | VitalRecord;
}

export interface VitalsState {
  data: VitalsData | null;
  todayData: VitalsApiResponse | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: VitalsState = {
  data: null,
  todayData: null,
  loading: false,
  error: null,
  success: false,
};

// Fetch Today's Vitals for All Users
export const fetchTodayVitals = createAsyncThunk<
  VitalsApiResponse,
  void,
  { rejectValue: string }
>('vitals/fetchTodayVitals', async (_, { rejectWithValue }) => {
  try {
    // Make API call to fetch today's vitals
    const response = await api.get(
      '/cirrhosis_custom.cirrhosis_vital.get_today_vital'
    );
    console.log('Fetch Today Vitals Response:', response.data);
    return response.data.message || response.data;
  } catch (error: any) {
    console.log('Fetch Today Vitals Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch vitals';

    return rejectWithValue(msg);
  }
});

// Fetch Today's Vitals by ID
export const fetchTodayVitalsById = createAsyncThunk<
  VitalsApiResponse,
  string,
  { rejectValue: string }
>('vitals/fetchTodayVitalsById', async (vitalId, { rejectWithValue }) => {
  try {
    // Make API call to fetch today's vitals by ID
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.get_today_vital',
      { vital_id: vitalId }
    );
    
    return response.data.message || response.data;
  } catch (error: any) {
    console.log('Fetch Today Vitals By ID Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch vitals';

    return rejectWithValue(msg);
  }
});

// Fetch Today's Vitals for Current User
export const fetchTodaysVitalsForUser = createAsyncThunk<
  VitalsApiResponse,
  void,
  { rejectValue: string }
>('vitals/fetchTodaysVitalsForUser', async (_, { rejectWithValue, getState }) => {
  try {
    // Get the current user from the auth state
    const state: any = getState();
    const user = state?.auth?.user?.email;
    
    if (!user) {
      return rejectWithValue('User not authenticated');
    }
    
    // Make API call to fetch today's vitals for the current user
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.get_today_vital',
      { user: user }
    );
    
    console.log('Fetch Todays Vitals For User Response:', response.data);
    return response.data.message || response.data;
  } catch (error: any) {
    console.log('Fetch Todays Vitals For User Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch vitals for user';

    return rejectWithValue(msg);
  }
});

// Fetch All Vitals for Current User
export const fetchAllVitalsForUser = createAsyncThunk<
  VitalsApiResponse,
  string,
  { rejectValue: string }
>('vitals/fetchAllVitalsForUser', async (userEmail, { rejectWithValue }) => {
  try {
    // Make API call to fetch all vitals for the specified user
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.get_vital',
      { user: userEmail }
    );
    
    console.log('Fetch All Vitals For User Response:', response.data);
    return response.data.message || response.data;
  } catch (error: any) {
    console.log('Fetch All Vitals For User Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch all vitals for user';

    return rejectWithValue(msg);
  }
});

// Fetch Vitals with Date Range Filter
export const fetchVitalsWithDateFilter = createAsyncThunk<
  VitalsApiResponse,
  { user: string; date_from?: string; date_to?: string },
  { rejectValue: string }
>('vitals/fetchVitalsWithDateFilter', async (params, { rejectWithValue }) => {
  try {
    // Make API call to fetch vitals with date filtering
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.get_vital',
      params
    );
    
    console.log('Fetch Vitals With Date Filter Response:', response.data);
    return response.data.message || response.data;
  } catch (error: any) {
    console.log('Fetch Vitals With Date Filter Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch vitals with date filter';

    return rejectWithValue(msg);
  }
});

// Add Vitals Thunk
export const addVitals = createAsyncThunk<
  any,
  VitalsData,
  { rejectValue: string }
>('vitals/addVitals', async (vitalsData, { rejectWithValue }) => {
  try {
    // Prepare the data for submission
    const payload: any = {};
    
    // Map the data to match API requirements
    if (vitalsData.heart_rate !== undefined) payload.heart_rate = vitalsData.heart_rate;
    if (vitalsData.resting_heart_rate !== undefined) payload.resting_heart_rate = vitalsData.resting_heart_rate;
    if (vitalsData.weight !== undefined) payload.weight = vitalsData.weight;
    if (vitalsData.glucose !== undefined) payload.glucose = vitalsData.glucose;
    if (vitalsData.blood_pressure_systolic !== undefined) payload.blood_pressure_systolic = vitalsData.blood_pressure_systolic;
    if (vitalsData.blood_pressure_diastolic !== undefined) payload.blood_pressure_diastolic = vitalsData.blood_pressure_diastolic;
    if (vitalsData.spo2 !== undefined) payload.spo2 = vitalsData.spo2;
    if (vitalsData.sleep !== undefined) payload.sleep = vitalsData.sleep;
    if (vitalsData.sleep_hours !== undefined) payload.sleep_hours = vitalsData.sleep_hours;
    if (vitalsData.sleep_minutes !== undefined) payload.sleep_minutes = vitalsData.sleep_minutes;
    if (vitalsData.user !== undefined) payload.user = vitalsData.user;
    
    // Handle date
    if (vitalsData.date !== undefined) {
      payload.date = vitalsData.date;
    } else {
      payload.date = new Date().toISOString().split('T')[0];
    }

    // Handle backward compatibility / alternative names
    if (payload.resting_heart_rate === undefined && vitalsData.resting_heart_rate !== undefined) {
      payload.resting_heart_rate = vitalsData.resting_heart_rate;
    }
    if (payload.sleep === undefined && vitalsData.sleep_minutes !== undefined) {
      payload.sleep = vitalsData.sleep_minutes;
    }
    if (payload.spo2 === undefined && vitalsData.spO2 !== undefined) {
      payload.spo2 = vitalsData.spO2;
    }
    if (payload.blood_pressure_systolic === undefined && (vitalsData as any).systolic !== undefined) {
      payload.blood_pressure_systolic = (vitalsData as any).systolic;
    }
    if (payload.blood_pressure_diastolic === undefined && (vitalsData as any).diastolic !== undefined) {
      payload.blood_pressure_diastolic = (vitalsData as any).diastolic;
    }

    console.log('Sending vitals data:', payload);

    // Make API call using the existing api client which handles authentication
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.add_vital',
      payload
    );
    const data = response.data;
    const msg = data.message;
    console.log('Vitals API Response:', data);

    // Check if the response indicates failure
    if (data.status === 'fail' || (msg && msg.status === 'fail')) {
      const errorMsg = (msg && msg.message) || data.message || 'Failed to add vitals';
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
        visibilityTime: 3000,
      });
      
      return rejectWithValue(errorMsg);
    }

    // Show success message
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Vitals added successfully!',
      visibilityTime: 2000,
    });

    return data.message || data;
  } catch (error: any) {
    console.log('Vitals API Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to add vitals';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });

    return rejectWithValue(msg);
  }
});

// Update Vitals Thunk
export const updateVitals = createAsyncThunk<
  any,
  VitalsData & { vital_id: string },
  { rejectValue: string }
>('vitals/updateVitals', async (vitalsData, { rejectWithValue }) => {
  try {
    // Prepare the data for submission
    const payload: any = {};
    
    // Add the vital_id to the payload
    payload.vital_id = vitalsData.vital_id;
    
    // Map the data to match API requirements
    if (vitalsData.heart_rate !== undefined) payload.heart_rate = vitalsData.heart_rate;
    if (vitalsData.resting_heart_rate !== undefined) payload.resting_heart_rate = vitalsData.resting_heart_rate;
    if (vitalsData.weight !== undefined) payload.weight = vitalsData.weight;
    if (vitalsData.glucose !== undefined) payload.glucose = vitalsData.glucose;
    if (vitalsData.blood_pressure_systolic !== undefined) payload.blood_pressure_systolic = vitalsData.blood_pressure_systolic;
    if (vitalsData.blood_pressure_diastolic !== undefined) payload.blood_pressure_diastolic = vitalsData.blood_pressure_diastolic;
    if (vitalsData.spo2 !== undefined) payload.spo2 = vitalsData.spo2;
    if (vitalsData.sleep !== undefined) payload.sleep = vitalsData.sleep;
    if (vitalsData.sleep_hours !== undefined) payload.sleep_hours = vitalsData.sleep_hours;
    if (vitalsData.sleep_minutes !== undefined) payload.sleep_minutes = vitalsData.sleep_minutes;
    if (vitalsData.user !== undefined) payload.user = vitalsData.user;
    if (vitalsData.date !== undefined) payload.date = vitalsData.date;
    
    // Handle backward compatibility / alternative names
    if (payload.sleep === undefined && vitalsData.sleep_minutes !== undefined) {
      payload.sleep = vitalsData.sleep_minutes;
    }
    if (payload.spo2 === undefined && vitalsData.spO2 !== undefined) {
      payload.spo2 = vitalsData.spO2;
    }
    if (payload.blood_pressure_systolic === undefined && (vitalsData as any).systolic !== undefined) {
      payload.blood_pressure_systolic = (vitalsData as any).systolic;
    }
    if (payload.blood_pressure_diastolic === undefined && (vitalsData as any).diastolic !== undefined) {
      payload.blood_pressure_diastolic = (vitalsData as any).diastolic;
    }

    console.log('Updating vitals data:', payload);

    // Make API call using the existing api client which handles authentication
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.update_vital',
      payload
    );
    const data = response.data;
    const msg = data.message;
    console.log('Update Vitals API Response:', data);

    // Check if the response indicates failure
    if (data.status === 'fail' || (msg && msg.status === 'fail')) {
      const errorMsg = (msg && msg.message) || data.message || 'Failed to update vitals';
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
        visibilityTime: 3000,
      });
      
      return rejectWithValue(errorMsg);
    }

    // Show success message
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Vitals updated successfully!',
      visibilityTime: 2000,
    });

    return data.message || data;
  } catch (error: any) {
    console.log('Update Vitals API Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to update vitals';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });

    return rejectWithValue(msg);
  }
});

const vitalsSlice = createSlice({
  name: 'vitals',
  initialState,
  reducers: {
    clearVitalsState: (state) => {
      state.data = null;
      state.todayData = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetVitalsSuccess: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
    setVitalsData: (state, action: PayloadAction<VitalsData>) => {
      state.data = action.payload;
    },
    setTodayVitalsData: (state, action: PayloadAction<VitalsApiResponse>) => {
      state.todayData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayVitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayVitals.fulfilled, (state, action: PayloadAction<VitalsApiResponse>) => {
        state.loading = false;
        state.todayData = action.payload;
      })
      .addCase(fetchTodayVitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vitals';
      })
      .addCase(fetchTodayVitalsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayVitalsById.fulfilled, (state, action: PayloadAction<VitalsApiResponse>) => {
        state.loading = false;
        state.todayData = action.payload;
      })
      .addCase(fetchTodayVitalsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vitals';
      })
      .addCase(addVitals.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addVitals.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(addVitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add vitals';
        state.success = false;
      })
      .addCase(updateVitals.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVitals.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(updateVitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update vitals';
        state.success = false;
      })
      .addCase(fetchTodaysVitalsForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodaysVitalsForUser.fulfilled, (state, action: PayloadAction<VitalsApiResponse>) => {
        state.loading = false;
        state.todayData = action.payload;
      })
      .addCase(fetchTodaysVitalsForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vitals for user';
      })
      .addCase(fetchAllVitalsForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVitalsForUser.fulfilled, (state, action: PayloadAction<VitalsApiResponse>) => {
        state.loading = false;
        state.todayData = action.payload;
      })
      .addCase(fetchAllVitalsForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch all vitals for user';
      })
      .addCase(fetchVitalsWithDateFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVitalsWithDateFilter.fulfilled, (state, action: PayloadAction<VitalsApiResponse>) => {
        state.loading = false;
        state.todayData = action.payload;
      })
      .addCase(fetchVitalsWithDateFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vitals with date filter';
      });
  },
});

export const { clearVitalsState, resetVitalsSuccess, setVitalsData, setTodayVitalsData } = vitalsSlice.actions;
export default vitalsSlice.reducer;