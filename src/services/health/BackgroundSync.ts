import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../redux/store';
import { getHealthData } from './HealthService';
import { addExercise } from '../../screens/exercises/slices/exerciseSlice';

const LAST_SYNC_KEY = '@last_health_sync_time';
export const HEALTH_SYNC_PERMISSION_KEY = '@health_sync_permitted';

export const performHealthSync = async () => {
  try {
    // 1. Check if the user has explicitly given permission previously
    const isPermittedStr = await AsyncStorage.getItem(HEALTH_SYNC_PERMISSION_KEY);
    if (isPermittedStr !== 'true') {
      console.log('[performHealthSync] Health sync skipped - User has not granted permission manually yet.');
      return;
    }

    // 2. We need the user's email from the store to assign the data
    // Assuming Redux store is hydrated or accessible
    const state = store.getState();
    const userEmail = state?.auth?.user?.email;
    if (!userEmail) {
      console.log('[performHealthSync] Sync skipped - no user email found.');
      return;
    }

    // 3. Directly get health data (getHealthData checks SDK status without requesting UI permissions)
    const healthData = await getHealthData();

    let h = '', m = '';
    if (healthData.sleepHours > 0) {
      h = Math.floor(healthData.sleepHours).toString();
      m = Math.round((healthData.sleepHours - parseInt(h)) * 60).toString();
    }

    const hasData = healthData.steps > 0 || 
                   healthData.heartRate > 0 || 
                   healthData.calories > 0 || 
                   healthData.sleepHours > 0 || 
                   (healthData.systolic && healthData.diastolic);

    if (hasData) {
      const exerciseData = {
        resting_hr: healthData.heartRate > 0 ? healthData.heartRate.toString() : '',
        active_hr: '', 
        oxygen_saturation: '',
        calories_burned: healthData.calories > 0 ? healthData.calories.toString() : '',
        blood_pressure: (healthData.systolic && healthData.diastolic) ? `${healthData.systolic}/${healthData.diastolic}` : '',
        sleep_hours: h,
        sleep_minutes: m,
        steps: healthData.steps > 0 ? healthData.steps.toString() : '',
        user: userEmail,
        sync_data: 'auto',
      };

      // Dispatch directly to the store
      await store.dispatch(addExercise(exerciseData));
      console.log('[performHealthSync] Background health data synced and saved automatically.');

      // Update last sync time
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }
  } catch (error) {
    console.error('[performHealthSync] Error auto-syncing health data:', error);
  }
};
