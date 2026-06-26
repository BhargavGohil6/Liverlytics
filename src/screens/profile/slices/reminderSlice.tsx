import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';
import Toast from 'react-native-toast-message';

// Types
export interface ReminderSettings {
  medication_reminders: string | number;
  appointment_reminders: string | number;
  health_check_reminders: string | number;
  hydration_reminders: string | number;
  exercise_reminders: string | number;
  meal_reminders: string | number;
  silent_hours: string | number;
  critical_alerts: string | number;
}

export interface ReminderSettingsResponse {
  message: {
    status: string;
    message?: string;
    user: string;
    settings: ReminderSettings;
  };
}

export interface SaveReminderSettingsResponse {
  message: {
    status: string;
    message: string;
  };
}

export interface ReminderState {
  settings: ReminderSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveSuccess: boolean;
}

// Initial state
const initialState: ReminderState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
  saveSuccess: false,
};

// Async thunk to fetch reminder settings
export const fetchReminderSettings = createAsyncThunk<
  ReminderSettingsResponse,
  string, // user email
  { rejectValue: string }
>('reminder/fetchReminderSettings', async (userEmail, { rejectWithValue }) => {
  try {
    const response = await api.post('/cirrhosis_custom.cirrhosis_reminders.get_reminder_settings', {
      user: userEmail,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch reminder settings';
    return rejectWithValue(msg);
  }
});

// Async thunk to save reminder settings
export const saveReminderSettings = createAsyncThunk<
  SaveReminderSettingsResponse,
  { user: string; settings: ReminderSettings },
  { rejectValue: string }
>('reminder/saveReminderSettings', async ({ user, settings }, { rejectWithValue }) => {
  try {
    const response = await api.post('/cirrhosis_custom.cirrhosis_reminders.save_reminder_settings', {
      user,
      ...settings,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to save reminder settings';
    return rejectWithValue(msg);
  }
});

const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    clearReminderState: (state) => {
      state.settings = null;
      state.loading = false;
      state.saving = false;
      state.error = null;
      state.saveSuccess = false;
    },
    resetSaveSuccess: (state) => {
      state.saveSuccess = false;
      state.error = null;
    },
    setReminderSettings: (state, action: PayloadAction<ReminderSettings>) => {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reminder settings
      .addCase(fetchReminderSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminderSettings.fulfilled, (state, action: PayloadAction<ReminderSettingsResponse>) => {
        state.loading = false;
        state.settings = action.payload.message.settings;
      })
      .addCase(fetchReminderSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reminder settings';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action.payload || 'Failed to fetch reminder settings',
        });
      })
      // Save reminder settings
      .addCase(saveReminderSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(saveReminderSettings.fulfilled, (state, action: PayloadAction<SaveReminderSettingsResponse>) => {
        state.saving = false;
        state.saveSuccess = true;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: action.payload.message.message,
        });
      })
      .addCase(saveReminderSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to save reminder settings';
        state.saveSuccess = false;
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action.payload || 'Failed to save reminder settings',
        });
      });
  },
});

export const { clearReminderState, resetSaveSuccess, setReminderSettings } = reminderSlice.actions;
export default reminderSlice.reducer;