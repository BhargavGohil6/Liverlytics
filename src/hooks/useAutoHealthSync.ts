import { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { performHealthSync } from '../services/health/BackgroundSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SYNC_KEY = '@last_health_sync_time';
const SYNC_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours
// const SYNC_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export const useAutoHealthSync = () => {
  useEffect(() => {
    // 1. Configure BackgroundFetch
    BackgroundFetch.configure({
      minimumFetchInterval: 120, // 2 hours
      forceAlarmManager: true, // Try to bypass Android JobScheduler 15m limit
      stopOnTerminate: false, // Keep running after app is closed
      startOnBoot: true,     // Start tracking again after device reboot
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    }, async (taskId) => {
      console.log('[BackgroundFetch] task start: ', taskId);
      await performHealthSync();
      BackgroundFetch.finish(taskId);
    }, (taskId) => {
      console.log('[BackgroundFetch] TIMEOUT: ', taskId);
      BackgroundFetch.finish(taskId);
    });

    // 2. Perform a check when the app initially launches/mounts to see if it missed an interval
    const checkAndSyncOnLaunch = async () => {
      try {
        const lastSyncStr = await AsyncStorage.getItem(LAST_SYNC_KEY);
        const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;
        const now = Date.now();
        
        // If 2 minutes (120000 ms) have passed since last sync, run it immediately on Mount
        if (now - lastSync > SYNC_INTERVAL_MS) {
          await performHealthSync();
        }
      } catch (e) {
        console.error('Error checking last sync time:', e);
      }
    };

    checkAndSyncOnLaunch();

    // 3. Regular foreground interval to ensure 2-minute cadence while app is actively used
    const intervalId = setInterval(() => {
      performHealthSync();
    }, SYNC_INTERVAL_MS);

    return () => clearInterval(intervalId);

  }, []);
};
