import AppleHealthKit, { HealthValue, HealthKitPermissions } from 'react-native-health';
import { HealthData, PermissionResult } from './types';
import { NativeModules, Platform } from 'react-native';

const IOSHealthService = {
  async requestPermissions(): Promise<PermissionResult> {
    try {
      console.log('=== Starting HealthKit permission request ===');
      console.log('Platform:', Platform.OS);
      console.log('AppleHealthKit imported:', !!AppleHealthKit);
      console.log('AppleHealthKit type:', typeof AppleHealthKit);
      console.log('AppleHealthKit keys:', Object.keys(AppleHealthKit || {}));
      
      // Check if we have access to the native module
      const healthModule = NativeModules.AppleHealthKit || NativeModules.RNAppleHealthKit;
      console.log('NativeModules.AppleHealthKit available:', !!healthModule);
      
      if (!healthModule) {
        console.error('❌ Native HealthKit module not found in NativeModules');
        console.log('Available NativeModules with "Health":', 
          Object.keys(NativeModules).filter(k => k.toLowerCase().includes('health'))
        );
        return { granted: false, unavailable: true };
      }

      console.log('✅ Found native HealthKit module, initializing...');

      const permissions: HealthKitPermissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
            AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
          ],
          write: [],
        },
      };

      console.log('Requesting permissions for:', permissions.permissions.read);

      return new Promise((resolve) => {
        // Call initHealthKit on the native module directly
        healthModule.initHealthKit(permissions, (error: string) => {
          if (error) {
            console.error('❌ Error initializing HealthKit:', error);
            resolve({ granted: false });
          } else {
            console.log('✅ HealthKit permissions granted successfully!');
            resolve({ granted: true });
          }
        });
      });
    } catch (error) {
      console.error('❌ Error requesting iOS health permissions:', error);
      return { granted: false };
    }
  },

  async getHealthData(): Promise<HealthData> {
    try {
      // Check if HealthKit is available
      const isAvailable = await new Promise<boolean>((resolve) => {
        AppleHealthKit.isAvailable((error: Object, result: boolean) => {
          if (error) {
            console.error('Error checking HealthKit availability:', error);
            resolve(false);
          } else {
            resolve(result);
          }
        });
      });

      if (!isAvailable) {
        return this.getDefaultHealthData();
      }

      // Fetch steps
      let steps = 0;
      try {
        const stepsResult = await new Promise<HealthValue[]>((resolve, reject) => {
          AppleHealthKit.getDailyStepCountSamples({
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date().toISOString(),
          }, (error: string, result: HealthValue[]) => {
            if (error) {
              console.warn('Error fetching steps:', error);
              resolve([]);
            } else {
              resolve(result);
            }
          });
        });

        steps = stepsResult?.[0]?.value || 0;
      } catch (error) {
        console.warn('Error getting steps:', error);
      }

      // Fetch sleep data (convert to hours)
      let sleepHours = 0;
      try {
        const sleepResult = await new Promise<HealthValue[]>((resolve, reject) => {
          AppleHealthKit.getSleepSamples({
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date().toISOString(),
          }, (error: string, result: HealthValue[]) => {
            if (error) {
              console.warn('Error fetching sleep data:', error);
              resolve([]);
            } else {
              resolve(result);
            }
          });
        });

        if (sleepResult && sleepResult.length > 0) {
          const totalSleepMs = sleepResult.reduce((acc: number, sleep: HealthValue) => {
            if (sleep.startDate && sleep.endDate) {
              const start = new Date(sleep.startDate).getTime();
              const end = new Date(sleep.endDate).getTime();
              return acc + (end - start);
            }
            return acc;
          }, 0);
          sleepHours = Math.round(totalSleepMs / (1000 * 60 * 60)); // Convert ms to hours
        }
      } catch (error) {
        console.warn('Error getting sleep data:', error);
      }

      // Fetch heart rate
      let heartRate = 0;
      try {
        const heartRateResult = await new Promise<HealthValue[]>((resolve, reject) => {
          AppleHealthKit.getHeartRateSamples({
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
            endDate: new Date().toISOString(),
          }, (error: string, result: HealthValue[]) => {
            if (error) {
              console.warn('Error fetching heart rate:', error);
              resolve([]);
            } else {
              resolve(result);
            }
          });
        });

        if (heartRateResult?.length) {
          const avgHeartRate = heartRateResult.reduce((sum: number, hr: HealthValue) => sum + (hr.value || 0), 0) / heartRateResult.length;
          heartRate = Math.round(avgHeartRate);
        }
      } catch (error) {
        console.warn('Error getting heart rate:', error);
      }

      // Fetch calories
      let calories = 0;
      try {
        const caloriesResult = await new Promise<HealthValue[]>((resolve, reject) => {
          AppleHealthKit.getActiveEnergyBurned({
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date().toISOString(),
          }, (error: string, result: HealthValue[]) => {
            if (error) {
              console.warn('Error fetching calories:', error);
              resolve([]);
            } else {
              resolve(result);
            }
          });
        });

        calories = caloriesResult?.[0]?.value || 0;
      } catch (error) {
        console.warn('Error getting calories:', error);
      }

      // Fetch distance
      let distance = 0;
      try {
        const distanceResult = await new Promise<HealthValue>((resolve, reject) => {
          AppleHealthKit.getDistanceWalkingRunning({
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date().toISOString(),
          }, (error: string, result: HealthValue) => {
            if (error) {
              console.warn('Error fetching distance:', error);
              resolve({ value: 0, startDate: '', endDate: '' });
            } else {
              resolve(result);
            }
          });
        });

        distance = distanceResult?.value || 0;
      } catch (error) {
        console.warn('Error getting distance:', error);
      }

      // Fetch blood pressure
      let systolic, diastolic;
      try {
        const bpResult = await new Promise<any[]>((resolve, reject) => {
          AppleHealthKit.getBloodPressureSamples({
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
            endDate: new Date().toISOString(),
          }, (error: string, result: any[]) => {
            if (error) {
              console.warn('Error fetching blood pressure:', error);
              resolve([]);
            } else {
              resolve(result);
            }
          });
        });

        if (bpResult?.length) {
          const latestBP = bpResult[bpResult.length - 1];
          systolic = latestBP.bloodPressureSystolicValue || 0;
          diastolic = latestBP.bloodPressureDiastolicValue || 0;
        }
      } catch (error) {
        console.warn('Error getting blood pressure:', error);
      }

      return {
        steps: Math.round(steps),
        sleepHours: Math.round(sleepHours),
        heartRate: Math.round(heartRate),
        calories: Math.round(calories),
        distance: Math.round(distance),
        ...(systolic !== undefined && { systolic: Math.round(systolic) }),
        ...(diastolic !== undefined && { diastolic: Math.round(diastolic) }),
      };
    } catch (error) {
      console.error('Error fetching iOS health data:', error);
      return this.getDefaultHealthData();
    }
  },

  getDefaultHealthData(): HealthData {
    return {
      steps: 0,
      sleepHours: 0,
      heartRate: 0,
      calories: 0,
      distance: 0,
    };
  },
};

export default IOSHealthService;