import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';

// Types for MELD Calculator
export interface MeldCalculatorData {
  serum_creatinine: number;
  serum_sodium: number;
  total_bilirubin: number;
  inr: number;
  albumin: number;
  sex_at_birth: string;
  ammonia?: number;
  on_dialysis: number;
  hemoglobin?: number;
  platelet_count?: number;
  notes?: string;
  user: string;
  ast?: number;
  alt?: number;
  wbc?: number;
  potassium?: number;
}

export interface MeldScores {
  meld_na: number;
  meld_3: number;
  primary: string;
}

export interface MeldHistoryEntry {
  name: string;
  serum_creatinine: string;
  serum_sodium: string;
  total_bilirubin: string;
  inr: string;
  albumin: string;
  sex_at_birth: string;
  user: string;
  date: string;
  platelet_count: string | null;
  hemoglobin: string | null;
  wbc: string | null;
  potassium: string | null;
  ammonia: string | null;
  on_dialysis: string;
  notes: string | null;
  creation: string;
  modified: string;
  meld_scores: MeldScores;
}

export interface MeldHistoryResponse {
  status: string;
  count: number;
  user: string;
  data: MeldHistoryEntry[];
  ai_insights: {
    status: string;
    summary: string;
    ai_insights: string[];
  };
}

export interface MeldCalculatorResponse {
  status: string;
  message: string;
  meld_id: string;
  data: {
    serum_creatinine: number;
    serum_sodium: number;
    total_bilirubin: number;
    inr: number;
    albumin: number;
    sex_at_birth: string;
    user: string;
    date: string | null;
    platelet_count: number | null;
    hemoglobin: number | null;
    wbc: number | null;
    potassium: number | null;
    ammonia: number | null;
    on_dialysis: string;
    notes: string;
    creation: string;
    modified: string;
  };
}

export interface MeldCalculatorPayload {
  message: MeldCalculatorResponse;
}

export interface MeldHistoryPayload {
  message: MeldHistoryResponse;
}

export interface MeldState {
  meldData: MeldCalculatorResponse | null;
  meldHistory: MeldHistoryResponse | null;
  loading: boolean;
  error: string | null;
  historyLoading: boolean;
  historyError: string | null;
}

// Async thunk for fetching MELD history
export const fetchMeldHistory = createAsyncThunk<
  MeldHistoryPayload,
  void,
  { rejectValue: string, state: { auth: { user: { email: string } | null } } }
>('meld/fetchMeldHistory', async (_, { rejectWithValue, getState }) => {
  try {
    console.log('Fetching MELD history');
    
    const state = getState();
    const userEmail = state.auth.user?.email;
    
    if (!userEmail) {
      return rejectWithValue('User email not available');
    }
    
    console.log('Making API call with user email:', userEmail);
    
    // Make the API call to fetch MELD history
    const response = await api.get('/cirrhosis_custom.cirrhosis_meld_calculator.get_meld', {
      params: {
        user: userEmail
      }
    });
    
    console.log('MELD history response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('MELD history Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch MELD history';

    return rejectWithValue(msg);
  }
});

// API call for MELD calculator
export const addMeldCalculator = createAsyncThunk<
  MeldCalculatorPayload,
  Omit<MeldCalculatorData, 'user'>,
  { rejectValue: string, state: { auth: { user: { email: string } | null } } }
>('meld/addMeldCalculator', async (data, { rejectWithValue, getState }) => {
  try {
    console.log('Adding MELD calculator data:', data);
    
    const state = getState();
    const userEmail = state.auth.user?.email;
    
    if (!userEmail) {
      return rejectWithValue('User email not available');
    }
    
    // Add the user email to the data
    const payload = {
      ...data,
      user: userEmail,
    };

    // Make the API call
    const response = await api.post('/cirrhosis_custom.cirrhosis_meld_calculator.add_meld', payload);

    console.log('MELD calculator response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('MELD calculator Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'MELD calculation failed';

    return rejectWithValue(msg);
  }
});

const meldSlice = createSlice({
  name: 'meld',
  initialState: {
    meldData: null,
    meldHistory: null,
    loading: false,
    error: null,
    historyLoading: false,
    historyError: null,
  } as MeldState,

  reducers: {
    resetMeldData: (state) => {
      state.meldData = null;
      state.loading = false;
      state.error = null;
    },
    resetMeldHistory: (state) => {
      state.meldHistory = null;
      state.historyLoading = false;
      state.historyError = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // MELD Calculator Reducers
      .addCase(addMeldCalculator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMeldCalculator.fulfilled, (state, action: PayloadAction<MeldCalculatorPayload>) => {
        state.loading = false;
        state.meldData = action.payload.message;
      })
      .addCase(addMeldCalculator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'MELD calculation failed';
      })
      // MELD History Reducers
      .addCase(fetchMeldHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchMeldHistory.fulfilled, (state, action: PayloadAction<MeldHistoryPayload>) => {
        state.historyLoading = false;
        state.meldHistory = action.payload.message;
      })
      .addCase(fetchMeldHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload || 'Failed to fetch MELD history';
      });
  },
});

export const { resetMeldData, resetMeldHistory } = meldSlice.actions;

// Selectors
export const selectMeldHistory = (state: { meld: MeldState }) => state.meld.meldHistory;
export const selectMeldHistoryLoading = (state: { meld: MeldState }) => state.meld.historyLoading;
export const selectMeldHistoryError = (state: { meld: MeldState }) => state.meld.historyError;

export default meldSlice.reducer;