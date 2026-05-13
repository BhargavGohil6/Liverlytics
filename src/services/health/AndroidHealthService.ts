import {
  initialize,
  getSdkStatus,
  SdkAvailabilityStatus,
  requestPermission,
  readRecords,
  aggregateRecord,
} from 'react-native-health-connect';
import { HealthData, PermissionResult } from './types';

const AndroidHealthService = {
  async initializeHealthConnect(): Promise<boolean> {
    try {
      const isInitialized = await initialize();
      console.log('Health Connect initialized:', isInitialized);
      return isInitialized;
    } catch (error) {
      console.error('Error initializing Health Connect:', error);
      return false;
    }
  },

  async requestPermissions(): Promise<PermissionResult> {
    try {
      const isInitialized = await this.initializeHealthConnect();
      if (!isInitialized) {
        return { granted: false, unavailable: true };
      }

      const status = await getSdkStatus();
      if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        return { granted: false, unavailable: true };
      }

      const permissions = [
        { accessType: 'read' as const, recordType: 'Steps' as const },
        { accessType: 'read' as const, recordType: 'SleepSession' as const },
        { accessType: 'read' as const, recordType: 'HeartRate' as const },
        { accessType: 'read' as const, recordType: 'ActiveCaloriesBurned' as const },
        { accessType: 'read' as const, recordType: 'TotalCaloriesBurned' as const },
        { accessType: 'read' as const, recordType: 'BloodPressure' as const },
        { accessType: 'read' as const, recordType: 'Weight' as const },
      ];

      const grantedPermissions = await requestPermission(permissions);
      console.log('Granted permissions:', grantedPermissions);

      // We don't strictly require TotalCaloriesBurned to be granted, it's a fallback.
      const requiredPermissions = ['Steps', 'SleepSession', 'HeartRate', 'TargetCalories', 'BloodPressure'];
      // Just check if the core ones exist to allow sync flow. Wait, let's keep it simple.
      const hasCorePermissions = grantedPermissions.some(p => 'recordType' in p && p.recordType === 'Steps');
      
      return { granted: hasCorePermissions };
    } catch (error) {
      console.error('Error requesting Android health permissions:', error);
      return { granted: false };
    }
  },

  async getHealthData(): Promise<HealthData> {
    try {
      // Ensure Health Connect client is initialized before fetching data
      const isInitialized = await this.initializeHealthConnect();
      if (!isInitialized) {
        return this.getDefaultHealthData();
      }

      const status = await getSdkStatus();
      if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        return this.getDefaultHealthData();
      }

      const nowDate = new Date();
      const now = nowDate.toISOString();

      // Use LOCAL midnight so we get all data from 00:00 of the user's current day!
      // Health Connect returns UTC, so setting local midnight and getting ISO will correctly query starting exactly from their day's start.
      const localSodDate = new Date();
      localSodDate.setHours(0, 0, 0, 0); 
      const localMidnight = localSodDate.toISOString();

      const past24h = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const past7days = new Date(nowDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch steps (today local)
      let steps = 0;
      try {
        const stepsResult = await aggregateRecord({
          recordType: 'Steps' as const,
          timeRangeFilter: { operator: 'between', startTime: localMidnight, endTime: now },
        });
        steps = stepsResult.COUNT_TOTAL || 0;
      } catch (error) {
        console.warn('Error fetching steps:', error);
      }

      // Fetch sleep - Use readRecords and past24h since sleep usually starts previous day
      let sleepHours = 0;
      try {
        const sleepRecords = await readRecords('SleepSession' as const, {
          timeRangeFilter: { operator: 'between', startTime: past24h, endTime: now },
        });
        if (sleepRecords?.records?.length) {
          for (const record of sleepRecords.records) {
             const start = new Date(record.startTime).getTime();
             const end = new Date(record.endTime).getTime();
             sleepHours += (end - start) / (1000 * 60 * 60);
          }
        } else {
            // Fallback to aggregate if empty
            const sleepResult = await aggregateRecord({
              recordType: 'SleepSession' as const,
              timeRangeFilter: { operator: 'between', startTime: past24h, endTime: now },
            });
            const sleepDurationMs = sleepResult.SLEEP_DURATION_TOTAL || 0;
            sleepHours = sleepDurationMs / (1000 * 60 * 60);
        }
      } catch (error) {
        console.warn('Error fetching sleep data:', error);
      }

      // Fetch heart rate (past 24 hours)
      let heartRate = 0;
      try {
        console.log('--- Fetching HeartRate ---');
        console.log(`startTime: ${past24h}, endTime: ${now}`);
        const heartRateResult = await aggregateRecord({
          recordType: 'HeartRate' as const,
          timeRangeFilter: { operator: 'between', startTime: past24h, endTime: now },
        });
        console.log('HeartRate Result:', JSON.stringify(heartRateResult, null, 2));
        heartRate = heartRateResult.BPM_AVG || 0;
      } catch (error) {
        console.log('HeartRate Error details:', error);
      }

      // Fetch calories (try TotalCalories first, fallback to ActiveCalories)
      let calories = 0;
      try {
        try {
          console.log('--- Fetching TotalCaloriesBurned ---');
          const totalCaloriesResult = await aggregateRecord({
            recordType: 'TotalCaloriesBurned' as const,
            timeRangeFilter: { operator: 'between', startTime: localMidnight, endTime: now },
          });
          console.log('TotalCaloriesBurned Result:', JSON.stringify(totalCaloriesResult, null, 2));
          calories = totalCaloriesResult.ENERGY_TOTAL?.inCalories || 0;
        } catch (totalErr) {
          console.log('TotalCaloriesBurned error or empty, fallback to ActiveCaloriesBurned by error:', totalErr);
          const activeCaloriesResult = await aggregateRecord({
            recordType: 'ActiveCaloriesBurned' as const,
            timeRangeFilter: { operator: 'between', startTime: localMidnight, endTime: now },
          });
          console.log('ActiveCaloriesBurned Result:', JSON.stringify(activeCaloriesResult, null, 2));
          calories = activeCaloriesResult.ACTIVE_CALORIES_TOTAL?.inCalories || 0;
        }
      } catch (error) {
        console.log('Calories Error details:', error);
      }

      // Fetch distance
      let distance = 0;

      // Fetch blood pressure
      let systolic, diastolic;
      try {
        console.log('--- Fetching BloodPressure ---');
        const bpResult = await readRecords('BloodPressure' as const, {
          timeRangeFilter: { operator: 'between', startTime: past7days, endTime: now },
        });
        console.log(`BloodPressure Records Found: ${bpResult?.records?.length || 0}`);
        
        if (bpResult?.records?.length) {
          const latestBP = bpResult.records[bpResult.records.length - 1];
          console.log('Latest BP Record:', JSON.stringify(latestBP, null, 2));
          const bpRecord: any = latestBP;
          // Note: The type says `.value`, but runtime JSON returns `.inMillimetersOfMercury`
          systolic = bpRecord.systolic?.inMillimetersOfMercury || bpRecord.systolic?.value || 0;
          diastolic = bpRecord.diastolic?.inMillimetersOfMercury || bpRecord.diastolic?.value || 0;
        }
      } catch (error) {
        console.log('BloodPressure Error details:', error);
      }

      return {
        steps: Math.round(steps),
        sleepHours: Math.max(0, Number(sleepHours.toFixed(2))),
        heartRate: Math.round(heartRate),
        calories: Math.round(calories),
        distance: Math.round(distance),
        ...(systolic !== undefined && systolic > 0 && { systolic: Math.round(systolic) }),
        ...(diastolic !== undefined && diastolic > 0 && { diastolic: Math.round(diastolic) }),
      };
    } catch (error) {
      console.error('Error fetching Android health data:', error);
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

export default AndroidHealthService;