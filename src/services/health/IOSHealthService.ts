import appleHealthKit, { HealthValue } from 'react-native-health';
import {HealthData, PermissionResult} from './types';

const IOSHealthService = {
  async requestPermissions(): Promise<PermissionResult> {
    try {
      const permissions = {
        permissions: {
          read: [
            appleHealthKit.Constants.Permissions.StepCount,
            appleHealthKit.Constants.Permissions.SleepAnalysis,
            appleHealthKit.Constants.Permissions.HeartRate,
            appleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            appleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            appleHealthKit.Constants.Permissions.BloodPressureSystolic,
            appleHealthKit.Constants.Permissions.BloodPressureDiastolic,
          ],
          write: [], // We only need read permissions
        },
      };

      return new Promise((resolve, reject) => {
        appleHealthKit.initHealthKit(permissions, (error: string) => {
          if (error) {
            console.error('Error initializing HealthKit:', error);
            resolve({ granted: false });
          } else {
            resolve({ granted: true });
          }
        });
      });
    } catch (error) {
      console.error('Error requesting iOS health permissions:', error);
      return { granted: false };
    }
  },

  async getHealthData(): Promise<HealthData> {
    try {
      // Check if HealthKit is available
      const isAvailable = await new Promise<boolean>((resolve) => {
        appleHealthKit.isAvailable((error: Object, result: boolean) => {
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
          appleHealthKit.getDailyStepCountSamples({
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
          appleHealthKit.getSleepSamples({
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
          appleHealthKit.getHeartRateSamples({
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
          appleHealthKit.getActiveEnergyBurned({
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
          appleHealthKit.getDistanceWalkingRunning({
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
          appleHealthKit.getBloodPressureSamples({
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