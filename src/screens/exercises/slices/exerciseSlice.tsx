import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api/index';
import Toast from 'react-native-toast-message';

// Types
export interface ExerciseData {
  steps?: string;
  resting_hr?: string;
  active_hr?: string;
  oxygen_saturation?: string;
  calories_burned?: string;
  blood_pressure?: string;
  sleep_minutes?: string;
  sleep_hours?: number;
  user?: string;
  date?: string;
  creation?: string;
  modified?: string;
  name?: string;
}

export interface ExerciseApiResponse {
  status: string;
  message: string;
  exercise_id: string;
  data: {
    steps: string;
    resting_hr: string;
    active_hr: string;
    oxygen_saturation: string;
    calories_burned: string;
    blood_pressure: string;
    sleep_minutes: string;
    date: string;
    User: string;
    creation: string;
    modified: string;
  };
}

export interface ExerciseHistoryApiResponse {
  message: {
    status: string;
    count: number;
    data: ExerciseHistoryItem[];
  };
}

export interface ExerciseHistoryItem {
  name: string;
  steps: string;
  resting_hr: string;
  active_hr: string;
  oxygen_saturation: string;
  calories_burned: string;
  blood_pressure: string;
  sleep_minutes: string;
  creation: string;
  modified: string;
  user: string;
}

export interface ExerciseApiRequest {
  resting_hr: string;
  active_hr: string;
  oxygen_saturation: string;
  calories_burned: string;
  blood_pressure: string;
  sleep_minutes: string;
  steps: string;
  user: string;
}

export interface ExerciseState {
  data: ExerciseData | null;
  history: ExerciseHistoryItem[];
  historyLoading: boolean;
  historyError: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: ExerciseState = {
  data: null,
  history: [],
  historyLoading: false,
  historyError: null,
  loading: false,
  error: null,
  success: false,
};

// Add Exercise API call
export const addExercise = createAsyncThunk<
  { message: ExerciseApiResponse },
  ExerciseApiRequest,
  { rejectValue: string }
>('exercise/addExercise', async (exerciseData, { rejectWithValue }) => {
  try {
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_exercise.add_exercise',
      exerciseData
    );
    
    console.log(response.data, 'Exercise Added Successfully');
    
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: response.data.message?.message || 'Exercise record added successfully',
      visibilityTime: 3000,
    });
    
    return response.data;
  } catch (error: any) {
    console.log('Exercise API Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to add exercise data';
    
    // Show error toast
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });
    
    return rejectWithValue(msg);
  }
});

// Get Exercise History API call
export const getExerciseHistory = createAsyncThunk<
  ExerciseHistoryApiResponse,
  { user: string },
  { rejectValue: string }
>('exercise/getExerciseHistory', async (requestData, { rejectWithValue }) => {
  try {
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_exercise.get_exercise',
      requestData
    );
    
    console.log(response.data, 'Exercise History Fetched Successfully');
    
    return response.data;
  } catch (error: any) {
    console.log('Exercise History API Error:', error);
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch exercise history';
    
    // Show error toast
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });
    
    return rejectWithValue(msg);
  }
});

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    clearExerciseData: (state) => {
      state.data = null;
      state.error = null;
      state.success = false;
    },
    resetExerciseState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addExercise.fulfilled, (state, action: PayloadAction<{ message: ExerciseApiResponse }>) => {
        state.loading = false;
        state.data = action.payload.message.data;
        state.success = true;
      })
      .addCase(addExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add exercise data';
        state.success = false;
      })
      // Handle getExerciseHistory
      .addCase(getExerciseHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(getExerciseHistory.fulfilled, (state, action: PayloadAction<ExerciseHistoryApiResponse>) => {
        state.historyLoading = false;
        state.history = action.payload.message.data;
      })
      .addCase(getExerciseHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload || 'Failed to fetch exercise history';
      });
  },
});

export const { clearExerciseData, resetExerciseState } = exerciseSlice.actions;
export default exerciseSlice.reducer;