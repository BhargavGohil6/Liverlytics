import { Platform } from 'react-native';
import IOSHealthService from './IOSHealthService';
import AndroidHealthService from './AndroidHealthService';
import { HealthData } from './types';

export async function getHealthData(): Promise<HealthData> {
  if (Platform.OS === 'ios') {
    try {
      return await IOSHealthService.getHealthData();
    } catch (error) {
      console.error('Error getting iOS health data:', error);
      return {
        steps: 0,
        sleepHours: 0,
        heartRate: 0,
        calories: 0,
        distance: 0,
      };
    }
  } else if (Platform.OS === 'android') {
    try {
      return await AndroidHealthService.getHealthData();
    } catch (error) {
      console.error('Error getting Android health data:', error);
      return {
        steps: 0,
        sleepHours: 0,
        heartRate: 0,
        calories: 0,
        distance: 0,
      };
    }
  } else {
    // Return default values for unsupported platforms
    return {
      steps: 0,
      sleepHours: 0,
      heartRate: 0,
      calories: 0,
      distance: 0,
    };
  }
}

export async function requestHealthPermissions() {
  console.log('Requesting health permissions for platform:', Platform.OS);
  
  if (Platform.OS === 'ios') {
    try {
      console.log('Requesting iOS health permissions');
      const result = await IOSHealthService.requestPermissions();
      console.log('iOS permissions result:', result);
      return result;
    } catch (error) {
      console.error('Error requesting iOS health permissions:', error);
      return { granted: false, unavailable: true };
    }
  } else if (Platform.OS === 'android') {
    try {
      console.log('Requesting Android health permissions');
      const result = await AndroidHealthService.requestPermissions();
      console.log('Android permissions result:', result);
      return result;
    } catch (error) {
      console.error('Error requesting Android health permissions:', error);
      return { granted: false, unavailable: true };
    }
  } else {
    console.log('Unsupported platform for health permissions');
    return { granted: false, unavailable: true };
  }
}

export type { HealthData };