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
  saved_document?: {
    file: string;
    date: string;
    user: string;
    source: string;
    accurate: number;
    document_name: string;
  };
}

export interface UserDocument {
  name: string;
  file: string;
  date: string;
  user: string;
  source: string;
  accurate: number;
}

export interface UserDocumentsResponse {
  message: {
    status: string;
    user: string;
    count: number;
    documents: UserDocument[];
  };
}

// Types for fetching AI Lab Reports
export interface ParameterData {
  value: string;
  normal_range: string;
  flag: string;
  difference: number;
  difference_formatted: string;
  previous_value: string;
}

// Interface for MELD metadata object (second item in data array)
export interface MELDMetadata {
  MELD_NA_count?: number;
  MELD_3_count?: number;
  MELD_TIMESTAMP?: string;
}

export interface AILabReportItem {
  name: string;
  gender: string;
  parameters: {
    [key: string]: ParameterData;
  };
  on_dialysis: string;
  notes: string | null;
  date: string;
  creation: string;
  modified: string;
  user: string;
  ai_lab_report_document: string;
  ai_uploded_lab_report: {
    name: string;
    file: string;
    date: string;
    user: string;
    source: string;
    accurate: number;
  };
}

// Union type for data array items
export type AILabReportDataItem = AILabReportItem | MELDMetadata;

export interface AILabReportApiResponse {
  message: {
    status: string;
    count: number;
    user: string;
    meld_na_count?: number;
    meld_3_count?: number;
    meld_timestamp?: string;
    data: AILabReportDataItem[];
  };
}

// Types for fetching latest two AI Lab Reports for comparison
export interface LatestTwoAILabReportItem {
  name: string;
  gender: string;
  parameters: {
    [key: string]: {
      value: string;
      normal_range: string;
      flag: string;
    };
  };
  on_dialysis: string;
  notes: string | null;
  date: string;
  creation: string;
  modified: string;
  user: string;
  ai_lab_report_document: string | null;
}

export interface LatestTwoAILabReportApiResponse {
  message: {
    status: string;
    count: number;
    to_date: string;
    from_date: string;
    user: string;
    data: LatestTwoAILabReportItem[];
  };
}

// Types for AI Lab Report
export interface AILabReportData {
  bilirubin: string;
  creatinine: string;
  sodium: string;
  albumin: string;
  ast: string;
  alt: string;
  platelet_count: string;
  hemoglobin: string;
  wbc: string;
  potassium: string;
  ammonia: string;
  inr: string;
  user: string;
  ai_uploded_lab_report?: {
    file: string;
    date: string;
    user: string;
    source: string;
    accurate: number;
    document_name: string;
  };
}

export interface AILabReportResponse {
  message: {
    status: string;
    message: string;
    ai_lab_report_id: string;
    data: {
      bilirubin: string;
      creatinine: string;
      sodium: string;
      albumin: string;
      ast: string;
      alt: string;
      platelet_count: string;
      hemoglobin: string;
      wbc: string;
      potassium: string;
      ammonia: string;
      inr: string;
      user: string;
      creation: string;
      modified: string;
    }
  }
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
  userDocuments: UserDocument[];
  aiLabReports: (AILabReportItem | MELDMetadata)[];
  latestTwoAILabReports: LatestTwoAILabReportItem[];
  latestTwoAILabReportsLoading: boolean;
  latestTwoAILabReportsError: string | null;
  meldNaCount?: number;
  meld3Count?: number;
  meldTimestamp?: string;
  downloadReportLoading: boolean;
  downloadReportError: string | null;
  savedDocument: {
    file: string;
    date: string;
    user: string;
    source: string;
    accurate: number;
    document_name: string;
  } | null;
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

    // Make the API call - setting headers to undefined allows axios to set the correct Content-Type for multipart/form-data
    const response = await api.post('/cirrhosis_custom.cirrhosis_vital_img.quick_text_extraction', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

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

// API call for AI Lab Report
export const addAILabReport = createAsyncThunk<
  AILabReportResponse,
  AILabReportData,
  { rejectValue: string }
>('reports/addAILabReport', async (data, { rejectWithValue }) => {
  try {
    console.log('Adding AI Lab Report data:', data);

    // Make the API call
    const response = await api.post('/cirrhosis_custom.cirrhosis_ai_lab_report.add_ai_lab_report', data);

    console.log('AI Lab Report response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('AI Lab Report Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'AI Lab Report creation failed';

    return rejectWithValue(msg);
  }
});

// Async thunk to fetch AI Lab Reports
export const fetchAILabReports = createAsyncThunk<
  AILabReportApiResponse,
  { user: string; ai_lab_report_document?: string },
  { rejectValue: string }
>('reports/fetchAILabReports', async ({ user, ai_lab_report_document }, { rejectWithValue }) => {
  try {
    const requestBody: any = { user: user };
    
    // Add document name if provided
    if (ai_lab_report_document) {
      requestBody.ai_lab_report_document = ai_lab_report_document;
    }
    
    const response = await api.post('/cirrhosis_custom.cirrhosis_ai_lab_report.get_ai_lab_report', requestBody);
    console.log('AI Lab Reports response:', response.data)
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch AI lab reports';

    return rejectWithValue(msg);
  }
});

export const fetchLatestTwoAILabReports = createAsyncThunk<
  LatestTwoAILabReportApiResponse,
  { user: string; ai_lab_report_document?: string },
  { rejectValue: string }
>('reports/fetchLatestTwoAILabReports', async ({ user, ai_lab_report_document }, { rejectWithValue }) => {
  try {
    const requestBody: any = { user: user };
    
    // Add document name if provided
    if (ai_lab_report_document) {
      requestBody.ai_lab_report_document = ai_lab_report_document;
    }
    
    const response = await api.post('/cirrhosis_custom.cirrhosis_ai_lab_report.get_latest_two_ai_report', requestBody);
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch latest two AI lab reports';

    return rejectWithValue(msg);
  }
});

// API call to fetch user documents
export const fetchUserDocuments = createAsyncThunk<
  UserDocumentsResponse,
  void,
  { rejectValue: string }
>('reports/fetchUserDocuments', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cirrhosis_custom.cirrhosis_vital_img.get_user_documents');
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch reports';

    return rejectWithValue(msg);
  }
});

// API call for downloading health report
export const downloadHealthReport = createAsyncThunk<
  any,
  { user: string; days: string },
  { rejectValue: string }
>('reports/downloadHealthReport', async (payload, { rejectWithValue }) => {
  try {
    console.log('Downloading health report...', payload);

    // Make the API call
    const response = await api.post(
      '/cirrhosis_custom.cirrhosis_download_report.download_health_report_pdf',
      payload
    );

    console.log('Download health report response:', response.data);
    
    // Extract file_url from response and prepend base URL
    if (response.data?.message?.file_url) {
      const fullUrl = `https://cirrhosis.mukesoft.com${response.data.message.file_url}`;
      console.log('Full download URL:', fullUrl);
      
      // Return the full URL for downloading
      return {
        ...response.data,
        downloadUrl: fullUrl
      };
    }
    
    return response.data;
  } catch (error: any) {
    console.log('Download Health Report Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to download health report';

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
    userDocuments: [],
    aiLabReports: [],
    latestTwoAILabReports: [],
    latestTwoAILabReportsLoading: false,
    latestTwoAILabReportsError: null,
    downloadReportLoading: false,
    downloadReportError: null,
    savedDocument: null,
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
        // Store the saved_document from the response
        if (action.payload.message.saved_document) {
          state.savedDocument = action.payload.message.saved_document;
        }
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
      })
      // AI Lab Report reducers
      .addCase(addAILabReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAILabReport.fulfilled, (state, action: PayloadAction<AILabReportResponse>) => {
        state.loading = false;
        state.labData = { 
          ...state.labData, 
          status: action.payload.message.status,
          medical_analysis: {
            status: action.payload.message.status,
            medical_data: {
              bilirubin: { value: action.payload.message.data.bilirubin, unit: '', normal_range: null },
              creatinine: { value: action.payload.message.data.creatinine, unit: '', normal_range: null },
              sodium: { value: action.payload.message.data.sodium, unit: '', normal_range: null },
              albumin: { value: action.payload.message.data.albumin, unit: '', normal_range: null },
              ast: { value: action.payload.message.data.ast, unit: '', normal_range: null },
              alt: { value: action.payload.message.data.alt, unit: '', normal_range: null },
              platelet_count: { value: action.payload.message.data.platelet_count, unit: '', normal_range: null },
              hemoglobin: { value: action.payload.message.data.hemoglobin, unit: '', normal_range: null },
              wbc: { value: action.payload.message.data.wbc, unit: '', normal_range: null },
              potassium: { value: action.payload.message.data.potassium, unit: '', normal_range: null },
              ammonia: { value: action.payload.message.data.ammonia, unit: '', normal_range: null },
              inr: { value: action.payload.message.data.inr, unit: '', normal_range: null },
            },
            note: '',
          },
          extracted_text: '',
          cleaned_text: '',
          filename: '',
          character_count: 0,
          word_count: 0,
          note: '',
          debug: {
            filename: '',
            file_size: 0,
            file_extension: '',
            processing_method: '',
            raw_extracted_length: 0,
            cleaned_text_length: 0,
            raw_text_preview: '',
            cleaned_text_preview: '',
            is_empty: false,
          }
        };
      })
      .addCase(addAILabReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'AI Lab Report creation failed';
      })
      // Fetch User Documents reducers
      .addCase(fetchUserDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDocuments.fulfilled, (state, action: PayloadAction<UserDocumentsResponse>) => {
        state.loading = false;
        state.userDocuments = action.payload.message.documents;
      })
      .addCase(fetchUserDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reports';
      })
      // Fetch AI Lab Reports reducers
      .addCase(fetchAILabReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAILabReports.fulfilled, (state, action: PayloadAction<AILabReportApiResponse>) => {
        state.loading = false;
        state.aiLabReports = action.payload.message.data;
        // Extract MELD values from the second object in data array if available
        if (action.payload.message.data.length > 1) {
          const meldMetadata = action.payload.message.data[1] as MELDMetadata;
          if (meldMetadata.MELD_NA_count !== undefined) {
            state.meldNaCount = meldMetadata.MELD_NA_count;
          }
          if (meldMetadata.MELD_3_count !== undefined) {
            state.meld3Count = meldMetadata.MELD_3_count;
          }
          if (meldMetadata.MELD_TIMESTAMP !== undefined) {
            state.meldTimestamp = meldMetadata.MELD_TIMESTAMP;
          }
        } else {
          // Fallback to top-level message fields if MELD metadata object is not present
          state.meldNaCount = action.payload.message.meld_na_count;
          state.meld3Count = action.payload.message.meld_3_count;
          state.meldTimestamp = action.payload.message.meld_timestamp;
        }
      })
      .addCase(fetchAILabReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch AI lab reports';
      })
      // Fetch Latest Two AI Lab Reports reducers
      .addCase(fetchLatestTwoAILabReports.pending, (state) => {
        state.latestTwoAILabReportsLoading = true;
        state.latestTwoAILabReportsError = null;
      })
      .addCase(fetchLatestTwoAILabReports.fulfilled, (state, action: PayloadAction<LatestTwoAILabReportApiResponse>) => {
        state.latestTwoAILabReportsLoading = false;
        state.latestTwoAILabReports = action.payload.message.data;
      })
      .addCase(fetchLatestTwoAILabReports.rejected, (state, action) => {
        state.latestTwoAILabReportsLoading = false;
        state.latestTwoAILabReportsError = action.payload || 'Failed to fetch latest two AI lab reports';
      })
      // Download Health Report reducers
      .addCase(downloadHealthReport.pending, (state) => {
        state.downloadReportLoading = true;
        state.downloadReportError = null;
      })
      .addCase(downloadHealthReport.fulfilled, (state, action) => {
        state.downloadReportLoading = false;
        // Response is logged in the thunk, no need to store it
      })
      .addCase(downloadHealthReport.rejected, (state, action) => {
        state.downloadReportLoading = false;
        state.downloadReportError = action.payload || 'Failed to download health report';
      });
  },
});

export const { resetLabReport, setUploadComplete, resetMeldData } = reportSlice.actions;
export default reportSlice.reducer;