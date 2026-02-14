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
  };
  submitting: boolean;
  submitError: string | null;
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
  },
  submitting: false,
  submitError: null,
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

    const { privacyAccepted, termsAccepted, medicalAccepted, aiConsentOption, healthAccess, basicDetails } = state.onboarding;

    const payload = {
      user_email: userEmail, // YE HAI WO CORRECT EMAIL JO LOGIN KIYA HAI
      full_name: basicDetails.fullName || state.auth?.user?.full_name,
      gender: basicDetails.gender,
      age: basicDetails.age,
      country: basicDetails.country,
      user_weight: basicDetails.weight,
      all_conditions: {
        i_agree_to_the_privacy_policy: privacyAccepted ? 1 : 0,
        i_agree_to_the_terms_of_use: termsAccepted ? 1 : 0,
        i_acknowledge_the_medical_disclaimer: medicalAccepted ? 1 : 0,
      },
      health_access: healthAccess,
      ai_assistant: {
        selected_option:
          aiConsentOption === 'on_device'
            ? 'use_ai_on_device'
            : aiConsentOption === 'cloud_support'
            ? 'use_ai_with_cloud'
            : 'do_not_use_ai',
      },
      daily_targets: {
        daily_sodium_limit: 1800.0,
        daily_fluid_limit: 1500.0,
        weight_gain_alert_threshold: 1.5,
        resting_hr_alert_threshold: 80.0,
      },
    };

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
      return response.data;
    } catch (error: any) {
      console.error('Submit failed:', error.response?.data || error);
      return rejectWithValue(error.response?.data || 'Network error');
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
      })
      .addCase(submitAllConsents.fulfilled, (state) => {
        state.submitting = false;
        state.onboardingCompleted = true;
        EncryptedStorage.setItem('onboarding_completed', 'true');
        Toast.show({ type: 'success', text1: 'All Set!', text2: 'Welcome to the app!' });
      })
      .addCase(submitAllConsents.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
        Toast.show({ type: 'error', text1: 'Failed', text2: 'Please try again' });
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
  completeOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;