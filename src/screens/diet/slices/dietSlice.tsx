import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api/index';
import Toast from 'react-native-toast-message';

// Types
export interface DietEntry {
  name?: string;
  item_name: string;
  sodium: string;
  fluid_ml: string;
  creation?: string;
  user?: string;
}

export interface DailyLimits {
  daily_sodium_limit: number;
  daily_fluid_limit: number;
}

export interface OverallTotals {
  sodium: number;
  fluid_ml: number;
}

export interface DietApiResponse {
  status: string;
  message?: string;
  diet_and_fluids_id?: string;
  count?: number;
  daily_limits?: DailyLimits;
  overall_totals?: OverallTotals;
  data: DietEntry[] | DietEntry;
}

export interface DietState {
  data: DietEntry[] | null;
  daily_limits: DailyLimits | null;
  overall_totals: OverallTotals | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: DietState = {
  data: null,
  daily_limits: null,
  overall_totals: null,
  loading: false,
  error: null,
  success: false,
};

// Fetch Diet Entry by ID
export const fetchDietEntryById = createAsyncThunk<
  DietApiResponse,
  string,
  { rejectValue: string }
>('diet/fetchDietEntryById', async (dietId, { getState, rejectWithValue }) => {
  try {
    const state: any = getState();
    const userEmail = state.auth?.user?.email;
    
    if (!userEmail) {
      return rejectWithValue('User email not found in auth state');
    }
    
    const payload = {
      diet_and_fluids_id: dietId,
      user: userEmail,
    };
    
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_diet_fluids.get_diet',
      payload
    );
    console.log(response.data, 'Diet Entry Fetched Successfully');
    return response.data.message || response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch diet entry';
    return rejectWithValue(msg);
  }
});

// Fetch Today's Diet
export const fetchTodayDiet = createAsyncThunk<
  DietApiResponse,
  void,
  { rejectValue: string }
>('diet/fetchTodayDiet', async (_, { getState, rejectWithValue }) => {
  try {
    const state: any = getState();
    const userEmail = state.auth?.user?.email;
    
    if (!userEmail) {
      return rejectWithValue('User email not found in auth state');
    }
    
    const payload = {
      user: userEmail,
    };
    
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_diet_fluids.get_today_diet',
      payload
    );
    return response.data.message || response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch today\'s diet';
    return rejectWithValue(msg);
  }
});

// Fetch All Diet Entries
export const fetchDietEntries = createAsyncThunk<
  DietApiResponse,
  void,
  { rejectValue: string }
>('diet/fetchDietEntries', async (_, { getState, rejectWithValue }) => {
  try {
    const state: any = getState();
    const userEmail = state.auth?.user?.email;
    
    if (!userEmail) {
      return rejectWithValue('User email not found in auth state');
    }
    
    const payload = {
      user: userEmail,
    };
    
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_diet_fluids.get_diet',
      payload
    );
    return response.data.message || response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch diet entries';
    return rejectWithValue(msg);
  }
});

// Add Diet Entry
export const addDietEntry = createAsyncThunk<
  DietApiResponse,
  Omit<DietEntry, 'name' | 'creation'>,
  { rejectValue: string }
>('diet/addDietEntry', async (dietData, { rejectWithValue }) => {
  try {
    const payload = {
      item_name: dietData.item_name,
      sodium: dietData.sodium,
      fluid_ml: dietData.fluid_ml,
      user: dietData.user,
    };

    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_diet_fluids.add_diet',
      payload
    );
    
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Diet entry added successfully!',
      visibilityTime: 2000,
    });

    return response.data.message || response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to add diet entry';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });

    return rejectWithValue(msg);
  }
});

// Update Diet Entry
export const updateDietEntry = createAsyncThunk<
  DietApiResponse,
  DietEntry & { diet_and_fluids_id: string },
  { rejectValue: string }
>('diet/updateDietEntry', async (dietData, { rejectWithValue }) => {
  try {
    const payload = {
      diet_and_fluids_id: dietData.diet_and_fluids_id,
      item_name: dietData.item_name,
      fluid_ml: dietData.fluid_ml,
      user: dietData.user,
    };

    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_diet_fluids.update_diet',
      payload
    );
    
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Diet entry updated successfully!',
      visibilityTime: 2000,
    });
    console.log(response.data, 'Diet Entry Updated Successfully');
    return response.data.message || response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to update diet entry';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });

    return rejectWithValue(msg);
  }
});

// Delete Diet Entry
export const deleteDietEntry = createAsyncThunk<
  DietApiResponse,
  string,
  { rejectValue: string }
>('diet/deleteDietEntry', async (dietId, { rejectWithValue }) => {
  try {
    const payload = {
      diet_and_fluids_id: dietId,
    };

    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_diet_fluids.delete_diet',
      payload
    );
    
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Diet entry deleted successfully!',
      visibilityTime: 2000,
    });

    return response.data.message || response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to delete diet entry';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      visibilityTime: 3000,
    });

    return rejectWithValue(msg);
  }
});

const dietSlice = createSlice({
  name: 'diet',
  initialState,
  reducers: {
    clearDietState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Diet Entry by ID
      .addCase(fetchDietEntryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDietEntryById.fulfilled, (state, action: PayloadAction<DietApiResponse>) => {
        state.loading = false;
        // Set data to an array containing the single fetched entry
        state.data = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
      })
      .addCase(fetchDietEntryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch diet entry';
      })
      // Fetch All Diet Entries
      .addCase(fetchDietEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDietEntries.fulfilled, (state, action: PayloadAction<DietApiResponse>) => {
        state.loading = false;
        state.data = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
      })
      .addCase(fetchDietEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch diet entries';
      })
      // Add Diet Entry
      .addCase(addDietEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addDietEntry.fulfilled, (state, action: PayloadAction<DietApiResponse>) => {
        state.loading = false;
        state.success = true;
        // Add the new entry to the data array
        if (state.data) {
          const newData = Array.isArray(action.payload.data) ? action.payload.data[0] : action.payload.data;
          if (newData) {
            state.data = [...state.data, newData];
          }
        } else {
          const newData = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
          state.data = newData;
        }
      })
      .addCase(addDietEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add diet entry';
        state.success = false;
      })
      // Update Diet Entry
      .addCase(updateDietEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDietEntry.fulfilled, (state, action: PayloadAction<DietApiResponse>) => {
        state.loading = false;
        state.success = true;
        // Update the entry in the data array
        if (state.data) {
          const updatedData = Array.isArray(action.payload.data) ? action.payload.data[0] : action.payload.data;
          if (updatedData && updatedData.name) {
            state.data = state.data.map(item => 
              item.name === updatedData.name ? updatedData : item
            );
          }
        }
      })
      .addCase(updateDietEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update diet entry';
        state.success = false;
      })
      // Fetch Today's Diet
      .addCase(fetchTodayDiet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayDiet.fulfilled, (state, action: PayloadAction<DietApiResponse>) => {
        state.loading = false;
        state.data = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
        state.daily_limits = action.payload.daily_limits || null;
        state.overall_totals = action.payload.overall_totals || null;
      })
      .addCase(fetchTodayDiet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch today\'s diet';
      })
      // Delete Diet Entry
      .addCase(deleteDietEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteDietEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove the deleted entry from the data array
        if (state.data && action.meta.arg) {
          // action.meta.arg contains the dietId that was passed to deleteDietEntry
          const deletedId = action.meta.arg;
          state.data = state.data.filter(item => item.name !== deletedId);
        }
      })
      .addCase(deleteDietEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete diet entry';
        state.success = false;
      });
  },
});

export const { clearDietState } = dietSlice.actions;
export default dietSlice.reducer;