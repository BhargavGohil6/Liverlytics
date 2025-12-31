import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';

// Types
export interface MedicalData {
  [key: string]: {
    value: string;
    unit: string;
    normal_range?: string | null;
  };
}

export interface MedicalAnalysis {
  status: string;
  medical_data: MedicalData;
  note: string;
}

export interface LabReportResponse {
  status: string;
  extracted_text: string;
  cleaned_text: string;
  filename: string;
  character_count: number;
  word_count: number;
  note: string;
  medical_analysis: MedicalAnalysis;
  debug: {
    filename: string;
    file_size: number;
    file_extension: string;
    processing_method: string;
    raw_extracted_length: number;
    cleaned_text_length: number;
    raw_text_preview: string;
    cleaned_text_preview: string;
    is_empty: boolean;
  };
}

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

export interface LabReportState {
  labData: LabReportResponse | null;
  meldData: MeldCalculatorResponse | null;
  loading: boolean;
  meldLoading: boolean;
  error: string | null;
  meldError: string | null;
  uploadComplete: boolean;
}

// API call for file upload
export const uploadLabReport = createAsyncThunk<
  { message: LabReportResponse },
  { fileuri: string; filename: string; filetype: string },
  { rejectValue: string }
>('reports/uploadLabReport', async (filedata, { rejectWithValue }) => {
  try {
    console.log('Uploading lab report:', filedata);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('filename', filedata.filename);
    formData.append('filedata', {
      uri: filedata.fileuri,
      type: filedata.filetype,
      name: filedata.filename,
    } as any);

    // Make the API call
    const response = await api.post('/cirrhosis_custom.cirrhosis_vital_img.quick_text_extraction', formData);

    console.log('Upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('Upload Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Upload failed';

    return rejectWithValue(msg);
  }
});

// API call for MELD calculator
export const addMeldCalculator = createAsyncThunk<
  MeldCalculatorPayload,
  MeldCalculatorData,
  { rejectValue: string }
>('reports/addMeldCalculator', async (data, { rejectWithValue }) => {
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

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    labData: null,
    meldData: null,
    loading: false,
    meldLoading: false,
    error: null,
    meldError: null,
    uploadComplete: false,
  } as LabReportState,

  reducers: {
    resetLabReport: (state) => {
      state.labData = null;
      state.loading = false;
      state.error = null;
      state.uploadComplete = false;
    },
    setUploadComplete: (state) => {
      state.uploadComplete = true;
    },
    resetMeldData: (state) => {
      state.meldData = null;
      state.meldLoading = false;
      state.meldError = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(uploadLabReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLabReport.fulfilled, (state, action: PayloadAction<{ message: LabReportResponse }>) => {
        state.loading = false;
        state.labData = action.payload.message;
        state.uploadComplete = true;
      })
      .addCase(uploadLabReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Upload failed';
      })
      // MELD Calculator reducers
      .addCase(addMeldCalculator.pending, (state) => {
        state.meldLoading = true;
        state.meldError = null;
      })
      .addCase(addMeldCalculator.fulfilled, (state, action: PayloadAction<MeldCalculatorPayload>) => {
        state.meldLoading = false;
        state.meldData = action.payload.message;
      })
      .addCase(addMeldCalculator.rejected, (state, action) => {
        state.meldLoading = false;
        state.meldError = action.payload || 'MELD calculation failed';
      });
  },
});

export const { resetLabReport, setUploadComplete, resetMeldData } = reportSlice.actions;
export default reportSlice.reducer;