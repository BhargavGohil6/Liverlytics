import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../screens/auth/slices/authSlice';
import onboardingReducer from '../screens/OnboardingSteps/slices/onboardingSlice';
import dashboardReducer from '../screens/dashboard/slices/DashboardSlices';
import vitalsReducer from '../screens/vitals/slices/vitalsSlice';
import dietReducer from '../screens/diet/slices/dietSlice';
import reportReducer from '../screens/reports/slices/reportSlice';
import meldReducer from '../screens/meld-calculator/slices/meldSlice';
import exerciseReducer from '../screens/exercises/slices/exerciseSlice';
import profileReducer from '../screens/profile/slices/profileSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  dashboard: dashboardReducer,
  vitals: vitalsReducer,
  diet: dietReducer,
  reports: reportReducer,
  meld: meldReducer,
  exercise: exerciseReducer,
    profile: profileReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
