// src/store/onboardingSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';

interface OnboardingState {
  privacyAccepted: boolean;
  termsAccepted: boolean;
  medicalAccepted: boolean;
  onboardingCompleted: boolean;
  aiConsentOption: 'on_device' | 'cloud_support' | 'no_ai' | null;
  healthAccess: {
    steps: number;
    heart_rate: number;
    sleep: number;
    weight: number;
    blood_pressure: number;
    spo2: number;
  };
  basicDetails: {
    fullName: string;
    gender: string;
    age: string;
    country: string;
    weight: string;
    weightUnit: string;
  };
  dailyTargets: {
    daily_sodium_limit: number;
    daily_fluid_limit: number;
    daily_protein_limit: number;
    weight_gain_alert_threshold: number;
    resting_hr_alert_threshold: number;
  };
  submitting: boolean;
  submitError: string | null;
  apiResponseMessage: string | null;
  apiResponseStatus: 'success' | 'fail' | 'error' | null;
}

const initialState: OnboardingState = {
  privacyAccepted: false,
  termsAccepted: false,
  medicalAccepted: false,
  onboardingCompleted: false,
  aiConsentOption: null,
  healthAccess: {
    steps: 1,
    heart_rate: 1,
    sleep: 1,
    weight: 1,
    blood_pressure: 1,
    spo2: 1,
  },
  basicDetails: {
    fullName: '',
    gender: '',
    age: '',
    country: '',
    weight: '',
    weightUnit: 'kg',
  },
  dailyTargets: {
    daily_sodium_limit: 0,
    daily_fluid_limit: 0,
    daily_protein_limit: 0,
    weight_gain_alert_threshold: 0,
    resting_hr_alert_threshold: 0,
  },
  submitting: false,
  submitError: null,
  apiResponseMessage: null,
  apiResponseStatus: null,
};

// ASYNC THUNK — YEH SAB KUCH EK SAATH SAVE KAREGA
export const submitAllConsents = createAsyncThunk(
  'onboarding/submitAllConsents',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;

    // YE LINE — LOGIN KIYA HUA USER KA EMAIL LE RAHA HAI
    const userEmail =  state.auth?.user?.email;
console.log('userEmail',userEmail);
    if (!userEmail) {
      Toast.show({
        type: 'error',
        text1: 'User not found',
        text2: 'Please login again',
      });
      return rejectWithValue('User email not found in auth state');
    }

    const { privacyAccepted, termsAccepted, medicalAccepted, aiConsentOption, healthAccess, basicDetails, dailyTargets } = state.onboarding;

    const payload = {
      user_email: userEmail, // YE HAI WO CORRECT EMAIL JO LOGIN KIYA HAI
      full_name: basicDetails.fullName || state.auth?.user?.full_name,
      gender: basicDetails.gender,
      age: basicDetails.age,
      country: basicDetails.country,
      user_weight: basicDetails.weight,
      user_weight_unit: basicDetails.weightUnit,
      all_conditions: {
        i_agree_to_the_privacy_policy: privacyAccepted ? 1 : 0,
        i_agree_to_the_terms_of_use: termsAccepted ? 1 : 0,
        i_acknowledge_the_medical_disclaimer: medicalAccepted ? 1 : 0,
      },
      health_access: healthAccess,
      ai_assistant: {
        selected_option:
          aiConsentOption === 'on_device'
            ? 'use_ai_recommended'
            : aiConsentOption === 'cloud_support'
            ? 'use_ai_with_cloud'
            : 'do_not_use_ai',
      },
      daily_targets: {
        daily_sodium_limit: parseFloat(dailyTargets.daily_sodium_limit.toString()) || 0,
        daily_fluid_limit: parseFloat(dailyTargets.daily_fluid_limit.toString()) || 0,
        daily_protein_limit: parseFloat(dailyTargets.daily_protein_limit.toString()) || 0,
        weight_gain_alert_threshold: parseFloat(dailyTargets.weight_gain_alert_threshold.toString()) || 0,
        resting_hr_alert_threshold: parseFloat(dailyTargets.resting_hr_alert_threshold.toString()) || 0,
      },
    };
    console.log('cirrhosis_custom.cirrhosis_single_api.store_user_consents', payload)

    try {
      const response = await axios.post(
        'https://cirrhosis.mukesoft.com/api/method/cirrhosis_custom.cirrhosis_single_api.store_user_consents',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
          },
        }
      );

      console.log('All Consents Saved Successfully →', response.data);
      console.log('Response status:', response.data?.status);
      console.log('Response message:', response.data?.message);
      console.log('Response overall_status:', response.data?.overall_status);
      
      // Frappe/ERPNext API response handling
      const apiData = response.data;
      
      // Check for success in multiple possible formats
      // Frappe often returns status in different fields
      const isSuccess = 
        apiData?.status === 'success' || 
        apiData?.overall_status === 'success' ||
        (apiData?.message && !apiData?.error) ||
        (response.status === 200 && !apiData?.error);
      
      if (isSuccess) {
        console.log('✅ API returned success status');
        return apiData;
      }
      
      // Check for validation errors
      if (apiData?.status === 'fail' || apiData?.overall_status === 'error' || apiData?.error) {
        console.log('❌ API returned error status');
        const errorMessage = apiData?.message?.message || apiData?.message || apiData?.error || 'Failed to store consents. Please check your inputs.';
        return rejectWithValue({
          message: errorMessage,
          status: apiData?.status || 'error',
          overall_status: apiData?.overall_status || 'error'
        });
      }
      
      // If no explicit status, assume success if no error
      console.log('⚠️ No explicit status found, assuming success');
      return apiData;
    } catch (error: any) {
      console.error('Submit failed:', error.response?.data || error);
      
      // If error has API response data with specific message
      if (error.response?.data) {
        const apiError = error.response.data;
        return rejectWithValue({
          message: apiError.message || 'Failed to store consents. Please check your inputs.',
          status: apiError.status || 'error',
          overall_status: apiError.overall_status
        });
      }
      
      return rejectWithValue({
        message: error.message || 'Network error. Please try again.',
        status: 'error'
      });
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    acceptPrivacy: (state) => {
      state.privacyAccepted = !state.privacyAccepted;
    },
    acceptTerms: (state) => {
      state.termsAccepted = !state.termsAccepted;
    },
    acceptMedical: (state) => {
      state.medicalAccepted = !state.medicalAccepted;
    },
    setAIConsentOption: (state, action: PayloadAction<'on_device' | 'cloud_support' | 'no_ai'>) => {
      state.aiConsentOption = action.payload;
    },
    setHealthAccess: (state, action: PayloadAction<OnboardingState['healthAccess']>) => {
      state.healthAccess = action.payload;
    },
    updateBasicDetails: (state, action: PayloadAction<Partial<OnboardingState['basicDetails']>>) => {
      state.basicDetails = { ...state.basicDetails, ...action.payload };
    },
    updateDailyTargets: (state, action: PayloadAction<Partial<OnboardingState['dailyTargets']>>) => {
      state.dailyTargets = { ...state.dailyTargets, ...action.payload };
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
      EncryptedStorage.setItem('onboarding_completed', 'true');
    },
    resetOnboarding: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAllConsents.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
        state.apiResponseMessage = null;
        state.apiResponseStatus = null;
      })
      .addCase(submitAllConsents.fulfilled, (state, action) => {
        state.submitting = false;
        state.onboardingCompleted = true;
        state.apiResponseStatus = action.payload?.status || 'success';
        state.apiResponseMessage = action.payload?.message || 'Consents saved successfully!';
        EncryptedStorage.setItem('onboarding_completed', 'true');
        Toast.show({ 
          type: 'success', 
          text1: 'All Set!', 
          text2: state.apiResponseMessage || undefined
        });
      })
      .addCase(submitAllConsents.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as any;
        state.apiResponseStatus = (action.payload as any)?.status || 'error';
        state.apiResponseMessage = (action.payload as any)?.message || 'Failed to save consents';
        
        // Show detailed error toast with API message
        const errorMessage = (action.payload as any)?.message || 'Please try again';
        Toast.show({ 
          type: 'error', 
          text1: 'Failed', 
          text2: errorMessage,
          visibilityTime: 5000,
          topOffset: 50,
        });
      });
  },
});

export const {
  acceptPrivacy,
  acceptTerms,
  acceptMedical,
  setAIConsentOption,
  setHealthAccess,
  updateBasicDetails,
  updateDailyTargets,
  completeOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;