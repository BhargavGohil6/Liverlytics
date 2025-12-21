import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api/index';
import Toast from 'react-native-toast-message';

// Types
export interface VitalsData {
  heart_rate?: string | number;
  weight?: string | number;
  blood_pressure?: string | number;
  sleep?: string | number;
  steps?: string | number;
  spO2?: string | number;
  user?: string;
  date?: string;
  // Deprecated fields - kept for backward compatibility
  resting_heart_rate?: number;
  sleep_minutes?: number;
  spo2?: number;
  weight_unit?: string;
  systolic?: number;
  diastolic?: number;
}

export interface VitalRecord {
  name?: string;
  heart_rate?: number;
  weight?: number;
  blood_pressure?: string;
  sleep?: number;
  steps?: number;
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
    if (vitalsData.weight !== undefined) payload.weight = vitalsData.weight;
    if (vitalsData.blood_pressure !== undefined) payload.blood_pressure = vitalsData.blood_pressure;
    if (vitalsData.sleep !== undefined) payload.sleep = vitalsData.sleep;
    if (vitalsData.steps !== undefined) payload.steps = vitalsData.steps;
    if (vitalsData.spO2 !== undefined) payload.SpO2 = vitalsData.spO2;
    if (vitalsData.user !== undefined) payload.user = vitalsData.user;
    if (vitalsData.date !== undefined) payload.date = vitalsData.date;
    
    // Handle deprecated fields for backward compatibility
    if (payload.heart_rate === undefined && vitalsData.resting_heart_rate !== undefined) {
      payload.heart_rate = vitalsData.resting_heart_rate;
    }
    if (payload.sleep === undefined && vitalsData.sleep_minutes !== undefined) {
      payload.sleep = vitalsData.sleep_minutes;
    }
    if (payload.SpO2 === undefined && vitalsData.spo2 !== undefined) {
      payload.SpO2 = vitalsData.spo2;
    }
    if (payload.date === undefined) {
      payload.date = new Date().toISOString().split('T')[0]; // Today's date if not provided
    }

    console.log('Sending vitals data:', payload);

    // Make API call using the existing api client which handles authentication
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.add_vital',
      payload
    );
    const data = response.data;
    console.log('Vitals API Response:', data);

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
    if (vitalsData.weight !== undefined) payload.weight = vitalsData.weight;
    if (vitalsData.blood_pressure !== undefined) payload.blood_pressure = vitalsData.blood_pressure;
    if (vitalsData.sleep !== undefined) payload.sleep = vitalsData.sleep;
    if (vitalsData.steps !== undefined) payload.steps = vitalsData.steps;
    if (vitalsData.spO2 !== undefined) payload.SpO2 = vitalsData.spO2;
    if (vitalsData.user !== undefined) payload.user = vitalsData.user;
    if (vitalsData.date !== undefined) payload.date = vitalsData.date;
    
    // Handle deprecated fields for backward compatibility
    if (payload.heart_rate === undefined && vitalsData.resting_heart_rate !== undefined) {
      payload.heart_rate = vitalsData.resting_heart_rate;
    }
    if (payload.sleep === undefined && vitalsData.sleep_minutes !== undefined) {
      payload.sleep = vitalsData.sleep_minutes;
    }
    if (payload.SpO2 === undefined && vitalsData.spo2 !== undefined) {
      payload.SpO2 = vitalsData.spo2;
    }

    console.log('Updating vitals data:', payload);

    // Make API call using the existing api client which handles authentication
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_vital.update_vital',
      payload
    );
    const data = response.data;
    console.log('Update Vitals API Response:', data);

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
      });
  },
});

export const { clearVitalsState, setVitalsData, setTodayVitalsData } = vitalsSlice.actions;
export default vitalsSlice.reducer;