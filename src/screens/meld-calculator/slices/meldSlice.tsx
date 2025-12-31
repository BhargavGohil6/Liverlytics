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
  user?: string;
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

export interface MeldState {
  meldData: MeldCalculatorResponse | null;
  loading: boolean;
  error: string | null;
}

// API call for MELD calculator
export const addMeldCalculator = createAsyncThunk<
  MeldCalculatorPayload,
  MeldCalculatorData,
  { rejectValue: string }
>('meld/addMeldCalculator', async (data, { rejectWithValue }) => {
  try {
    console.log('Adding MELD calculator data:', data);

    // Make the API call
    const response = await api.post('/cirrhosis_custom.cirrhosis_meld_calculator.add_meld', data);

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
    loading: false,
    error: null,
  } as MeldState,

  reducers: {
    resetMeldData: (state) => {
      state.meldData = null;
      state.loading = false;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetMeldData } = meldSlice.actions;
export default meldSlice.reducer;