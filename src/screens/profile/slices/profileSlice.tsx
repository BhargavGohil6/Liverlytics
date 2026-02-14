import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';

// Define the user profile interface based on API response
export interface UserProfile {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  enabled: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  consent_status: string;
  country_code: string;
  gender_custom: string;
  language: string;
  time_zone: string;
  send_welcome_email: number;
  unsubscribed: number;
  mute_sounds: number;
  desk_theme: string;
  search_bar: number;
  notifications: number;
  list_sidebar: number;
  bulk_actions: number;
  view_switcher: number;
  form_sidebar: number;
  timeline: number;
  dashboard: number;
  new_password: string;
  logout_all_sessions: number;
  document_follow_notify: number;
  document_follow_frequency: string;
  follow_created_documents: number;
  follow_commented_documents: number;
  follow_liked_documents: number;
  follow_assigned_documents: number;
  follow_shared_documents: number;
  thread_notify: number;
  send_me_a_copy: number;
  allowed_in_mentions: number;
  simultaneous_sessions: number;
  last_ip: string;
  login_after: number;
  user_type: string;
  last_active: string;
  login_before: number;
  bypass_restrict_ip_check_if_2fa_enabled: number;
  last_login: string;
  onboarding_status: string;
  doctype: string;
  
  // New profile fields
  bio: string;
  medical_condition: string;
  emergency_contact: string;
  blood_type: string;
  allergies: string;
  medications: string;
  profile_picture: string | null;
  
  social_logins: any[];
  roles: any[];
  user_emails: any[];
  defaults: any[];
  block_modules: any[];
}

export interface GetUserProfileResponse {
  message: {
    status: string;
    user: UserProfile;
  };
}

export interface GetUserProfilePayload {
  user: string;
}

// API call to fetch user profile
export const getUserProfile = createAsyncThunk<
  GetUserProfileResponse,
  GetUserProfilePayload,
  { rejectValue: string }
>('profile/getUserProfile', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.get(`/cirrhosis_custom.cirrhosis_auth.get_profile?user=${payload.user}`);
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch user profile';

    return rejectWithValue(msg);
  }
});

// API call to update user profile - handles name fields via the specific API endpoint
export const updateUserProfile = createAsyncThunk<
  any,
  Partial<UserProfile>,
  { rejectValue: string }
>('profile/updateUserProfile', async (profileData, { rejectWithValue }) => {
  try {
    // Using the specific update profile endpoint as per API requirement for name fields
    const response = await api.post('/cirrhosis_custom.cirrhosis_auth.update_profile', {
      full_name: profileData.full_name,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to update user profile';

    return rejectWithValue(msg);
  }
});

// Additional API call to update other profile fields if separate endpoint exists
// export const updateOtherProfileFields = createAsyncThunk<
//   any,
//   Partial<UserProfile>,
//   { rejectValue: string }
// >('profile/updateOtherProfileFields', async (profileData, { rejectWithValue }) => {
//   try {
//     // This would use another endpoint if available for other profile fields
//     const response = await api.post('/cirrhosis_custom.cirrhosis_auth.update_other_profile_fields', {
//       email: profileData.email,
//       gender_custom: profileData.gender_custom,
//       bio: profileData.bio,
//       medical_condition: profileData.medical_condition,
//       emergency_contact: profileData.emergency_contact,
//       blood_type: profileData.blood_type,
//       allergies: profileData.allergies,
//       medications: profileData.medications,
//       profile_picture: profileData.profile_picture,
//       notifications: profileData.notifications,
//     });
//     return response.data;
//   } catch (error: any) {
//     const msg =
//       error.response?.data?.message?.message ||
//       error.response?.data?.message ||
//       error.message ||
//       'Failed to update profile fields';
//
//     return rejectWithValue(msg);
//   }
// });

interface ProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.userProfile = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<GetUserProfileResponse>) => {
        state.loading = false;
        state.userProfile = action.payload.message.user;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the profile with the response data
        if (state.userProfile) {
          Object.assign(state.userProfile, action.payload);
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

export const { resetProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;