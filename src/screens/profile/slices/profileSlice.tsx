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
  date_of_birth?: string;
  address?: string;
  mobile_no?: string;
  
  social_logins: any[];
  roles: any[];
  user_emails: any[];
  defaults: any[];
  block_modules: any[];
  
  // AI consent profile from API
  ai_consent_profile?: 'use_ai_recommended' | 'use_ai_with_cloud' | 'do_not_use_ai';
}

export interface GetUserProfileResponse {
  message: {
    status: string;
    user: UserProfile;
  };
}

// Define the health targets interface based on API response
export interface DailyHealthTarget {
  name: string;
  date: string;
  daily_sodium_limit: string;
  daily_fluid_limit: string;
  weight_gain_alert_threshold: string;
  daily_protein_limit: string;
  sleep_goal: string;
  resting_hr_alert_threshold: string;
  creation: string;
  user: string;
  owner: string;
}

export interface DailyHealthTargetsResponse {
  message: {
    status: string;
    count: number;
    date: string;
    user: string;
    data: DailyHealthTarget[];
  };
}

export interface GetDailyHealthTargetsPayload {
  user: string;
}

// API call to fetch daily health targets
export const getDailyHealthTargets = createAsyncThunk<
  DailyHealthTargetsResponse,
  GetDailyHealthTargetsPayload,
  { rejectValue: string }
>('profile/getDailyHealthTargets', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/cirrhosis_custom.cirrhosis_daily_health_targets.get_all_daily_health_targets', {
      user: payload.user,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch daily health targets';

    return rejectWithValue(msg);
  }
});

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

// API call to update user profile - handles all profile fields via the specific API endpoint
export const updateUserProfile = createAsyncThunk<
  any,
  Partial<UserProfile>,
  { rejectValue: string }
>('profile/updateUserProfile', async (profileData, { rejectWithValue }) => {
  try {
    // Using the specific update profile endpoint as per API requirement for all fields
    const response = await api.post('/cirrhosis_custom.cirrhosis_auth.update_profile', {
      user: profileData.email, // Include user email to identify the record
      full_name: profileData.full_name,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      date_of_birth: profileData.date_of_birth,
      address: profileData.address,
      mobile_no: profileData.mobile_no,
      gender_custom: profileData.gender_custom,
      country_code: profileData.country_code,
      bio: profileData.bio,
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

// Interface for profile photo upload response
export interface UploadProfilePhotoResponse {
  message: {
    status: string;
    message: string;
    profile_picture?: string;
  };
}

// API call to upload profile photo
export const uploadProfilePhoto = createAsyncThunk<
  UploadProfilePhotoResponse,
  { fileuri: string; filename: string; filetype: string },
  { rejectValue: string }
>('profile/uploadProfilePhoto', async (filedata, { rejectWithValue }) => {
  try {
    console.log('Uploading profile photo:', filedata);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('user', filedata.filename); // Using filename as user identifier
    formData.append('file', {
      uri: filedata.fileuri,
      type: filedata.filetype,
      name: filedata.filename,
    } as any);

    // Make the API call - setting headers to undefined allows axios to set the correct Content-Type for multipart/form-data
    const response = await api.post('/cirrhosis_custom.change_profile.upload_profile_photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Profile photo upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('Upload Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to upload profile photo';

    return rejectWithValue(msg);
  }
});

// Interface for getting profile photo response
export interface GetProfilePhotoResponse {
  message: {
    status: string;
    message?: string;
    profile_photo?: string;
    file_url?: string;
  };
}

// API call to get profile photo
export const getProfilePhoto = createAsyncThunk<
  GetProfilePhotoResponse,
  { user: string },
  { rejectValue: string }
>('profile/getProfilePhoto', async (payload, { rejectWithValue }) => {
  try {
    console.log('Fetching profile photo for user:', payload.user);

    // Make the API call to get profile photo
    const response = await api.get('/cirrhosis_custom.change_profile.get_profile_photo', {
      params: {
        user: payload.user,
      },
    });

    console.log('Profile photo response:', response.data);
    
    // If file_url exists, prepend the base URL
    if (response.data?.message?.file_url) {
      const fullUrl = `https://cirrhosis.mukesoft.com${response.data.message.file_url}`;
      console.log('Full profile photo URL:', fullUrl);
      
      // Update the response with the full URL
      response.data.message.profile_photo = fullUrl;
    }
    
    return response.data;
  } catch (error: any) {
    console.log('Get Profile Photo Error:', error);
    console.log('Error response:', error.response);

    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch profile photo';

    return rejectWithValue(msg);
  }
});

// API call to update daily health targets
export interface UpdateDailyHealthTargetsPayload {
  daily_sodium_limit: string | number;
  daily_fluid_limit: string | number;
  weight_gain_alert_threshold: string | number;
  resting_hr_alert_threshold: string | number;
  daily_protein_limit: string | number;
  sleep_goal: string | number;
  user: string;
}

export interface UpdateDailyHealthTargetsResponse {
  message: {
    status: string;
    message: string;
    daily_health_targets_id: string;
    data: DailyHealthTarget;
  };
}

export const updateDailyHealthTargets = createAsyncThunk<
  UpdateDailyHealthTargetsResponse,
  UpdateDailyHealthTargetsPayload,
  { rejectValue: string }
>('profile/updateDailyHealthTargets', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/cirrhosis_custom.cirrhosis_daily_health_targets.add_daily_health_targets', payload);
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to update daily health targets';

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

// AI Assistant Settings interfaces
export interface AISettings {
  email: string;
  ai_setting: 'use_ai_recommended' | 'use_ai_with_cloud' | 'do_not_use_ai';
  date: string;
}

export interface GetAISettingsResponse {
  message: {
    status: string;
    data?: AISettings;
    option_1?: string;
    option_1_description?: string;
    option_2?: string;
    option_2_description?: string;
    option_3?: string;
    option_3_description?: string;
  };
}

export interface SaveAISettingsPayload {
  email: string;
  ai_setting: 'use_ai_recommended' | 'use_ai_with_cloud' | 'do_not_use_ai';
  date: string;
}

export interface SaveAISettingsResponse {
  message: {
    status: string;
    message?: string;
  };
}

// API call to get AI assistant settings
export const getAISettings = createAsyncThunk<
  GetAISettingsResponse,
  { email: string },
  { rejectValue: string }
>('profile/getAISettings', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.get('/cirrhosis_custom.cirrhosis_ai_assistant_settings.get_ai_assistant_settings', {
      params: {
        email: payload.email,
      },
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch AI settings';

    return rejectWithValue(msg);
  }
});

// API call to save AI assistant settings
export const saveAISettings = createAsyncThunk<
  SaveAISettingsResponse,
  SaveAISettingsPayload,
  { rejectValue: string }
>('profile/saveAISettings', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/cirrhosis_custom.cirrhosis_ai_assistant_settings.store_ai_assistant_settings', payload);
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to save AI settings';

    return rejectWithValue(msg);
  }
});

interface ProfileState {
  userProfile: UserProfile | null;
  dailyHealthTargets: DailyHealthTarget[] | null;
  loading: boolean;
  error: string | null;
  aiSettings: AISettings | null;
  aiSettingsLoading: boolean;
  aiSettingsError: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  dailyHealthTargets: null,
  loading: false,
  error: null,
  aiSettings: null,
  aiSettingsLoading: false,
  aiSettingsError: null,
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
      })
      .addCase(getDailyHealthTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDailyHealthTargets.fulfilled, (state, action: PayloadAction<DailyHealthTargetsResponse>) => {
        state.loading = false;
        state.dailyHealthTargets = action.payload.message.data;
        state.error = null;
      })
      .addCase(getDailyHealthTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch daily health targets';
      })
      .addCase(updateDailyHealthTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDailyHealthTargets.fulfilled, (state, action: PayloadAction<UpdateDailyHealthTargetsResponse>) => {
        state.loading = false;
        // Update the daily health targets with the new data
        if (!state.dailyHealthTargets) {
          state.dailyHealthTargets = [];
        }
        // Replace the existing target or add as the first item if none exists
        if (state.dailyHealthTargets.length > 0) {
          state.dailyHealthTargets[0] = action.payload.message.data;
        } else {
          state.dailyHealthTargets.push(action.payload.message.data);
        }
        state.error = null;
      })
      .addCase(updateDailyHealthTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update daily health targets';
      })
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action: PayloadAction<UploadProfilePhotoResponse>) => {
        state.loading = false;
        state.error = null;
        // Update the profile picture URL in the user profile
        if (state.userProfile && action.payload.message.profile_picture) {
          state.userProfile.profile_picture = action.payload.message.profile_picture;
        }
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload profile photo';
      })
      .addCase(getProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfilePhoto.fulfilled, (state, action: PayloadAction<GetProfilePhotoResponse>) => {
        state.loading = false;
        state.error = null;
        // Update the profile picture URL in the user profile if file_url is present
        if (state.userProfile && action.payload.message?.file_url) {
          const fullUrl = `https://cirrhosis.mukesoft.com${action.payload.message.file_url}`;
          state.userProfile.profile_picture = fullUrl;
        } else if (state.userProfile && action.payload.message?.profile_photo) {
          state.userProfile.profile_picture = action.payload.message.profile_photo;
        }
      })
      .addCase(getProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile photo';
      })
      .addCase(getAISettings.pending, (state) => {
        state.aiSettingsLoading = true;
        state.aiSettingsError = null;
      })
      .addCase(getAISettings.fulfilled, (state, action: PayloadAction<GetAISettingsResponse>) => {
        state.aiSettingsLoading = false;
        state.aiSettingsError = null;
        if (action.payload.message.data) {
          state.aiSettings = action.payload.message.data;
        }
      })
      .addCase(getAISettings.rejected, (state, action) => {
        state.aiSettingsLoading = false;
        state.aiSettingsError = action.payload || 'Failed to fetch AI settings';
      })
      .addCase(saveAISettings.pending, (state) => {
        state.aiSettingsLoading = true;
        state.aiSettingsError = null;
      })
      .addCase(saveAISettings.fulfilled, (state, action: PayloadAction<SaveAISettingsResponse>) => {
        state.aiSettingsLoading = false;
        state.aiSettingsError = null;
        // AI settings will be refreshed by calling getAISettings after save
      })
      .addCase(saveAISettings.rejected, (state, action) => {
        state.aiSettingsLoading = false;
        state.aiSettingsError = action.payload || 'Failed to save AI settings';
      });
  },
});

export const { resetProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;