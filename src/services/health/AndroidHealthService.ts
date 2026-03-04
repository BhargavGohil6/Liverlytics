import { 
  initialize,
  getSdkStatus, 
  SdkAvailabilityStatus, 
  requestPermission, 
  readRecords, 
  aggregateRecord,
  BloodPressureRecord
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
      // First initialize Health Connect
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
        { accessType: 'read' as const, recordType: 'Distance' as const },
        { accessType: 'read' as const, recordType: 'BloodPressure' as const },
        { accessType: 'read' as const, recordType: 'Weight' as const },
      ];

      console.log('Requesting permissions:', permissions);
      const grantedPermissions = await requestPermission(permissions);
      console.log('Granted permissions:', grantedPermissions);

      const requiredPermissions = ['Steps', 'SleepSession', 'HeartRate', 'ActiveCaloriesBurned', 'Distance', 'BloodPressure'];
      const allGranted = requiredPermissions.every(perm => 
        grantedPermissions.some(p => 'recordType' in p && p.recordType === perm)
      );

      console.log('All permissions granted:', allGranted);
      return { granted: allGranted };
    } catch (error) {
      console.error('Error requesting Android health permissions:', error);
      return { granted: false };
    }
  },

  async getHealthData(): Promise<HealthData> {
    try {
      const status = await getSdkStatus();
      if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        return this.getDefaultHealthData();
      }

      const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      const now = new Date().toISOString();

      // Fetch steps
      let steps = 0;
      try {
        const stepsResult = await aggregateRecord({
          recordType: 'Steps' as const,
          timeRangeFilter: {
            operator: 'between',
            startTime: todayStart,
            endTime: now,
          },
        });
        steps = stepsResult.COUNT_TOTAL || 0;
      } catch (error) {
        console.warn('Error fetching steps:', error);
      }

      // Fetch sleep (convert to hours)
      let sleepHours = 0;
      try {
        const sleepResult = await aggregateRecord({
          recordType: 'SleepSession' as const,
          timeRangeFilter: {
            operator: 'between',
            startTime: todayStart,
            endTime: now,
          },
        });
        const sleepDurationMs = sleepResult.SLEEP_DURATION_TOTAL || 0;
        sleepHours = Math.round(sleepDurationMs / (1000 * 60 * 60)); // Convert ms to hours
      } catch (error) {
        console.warn('Error fetching sleep data:', error);
      }

      // Fetch heart rate
      let heartRate = 0;
      try {
        const heartRateResult = await aggregateRecord({
          recordType: 'HeartRate' as const,
          timeRangeFilter: {
            operator: 'between',
            startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
            endTime: now,
          },
        });
        const avgHeartRate = heartRateResult.BPM_AVG || 0;
        heartRate = Math.round(avgHeartRate);
      } catch (error) {
        console.warn('Error fetching heart rate:', error);
      }

      // Fetch calories
      let calories = 0;
      try {
        const caloriesResult = await aggregateRecord({
          recordType: 'ActiveCaloriesBurned' as const,
          timeRangeFilter: {
            operator: 'between',
            startTime: todayStart,
            endTime: now,
          },
        });
        calories = caloriesResult.ACTIVE_CALORIES_TOTAL?.inCalories || 0;
      } catch (error) {
        console.warn('Error fetching calories:', error);
      }

      // Fetch distance
      let distance = 0;
      try {
        const distanceResult = await aggregateRecord({
          recordType: 'Distance' as const,
          timeRangeFilter: {
            operator: 'between',
            startTime: todayStart,
            endTime: now,
          },
        });
        distance = distanceResult.DISTANCE?.inMeters || 0;
      } catch (error) {
        console.warn('Error fetching distance:', error);
      }

      // Fetch blood pressure
      let systolic, diastolic;
      try {
        const bpResult = await readRecords('BloodPressure' as const, {
          timeRangeFilter: {
            operator: 'between',
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
            endTime: now,
          },
        });
        
        if (bpResult?.records?.length) {
          const latestBP = bpResult.records[bpResult.records.length - 1];
          // Cast to any to access the properties since types may not perfectly align
          const bpRecord: any = latestBP;
          systolic = bpRecord.systolic?.value || 0;
          diastolic = bpRecord.diastolic?.value || 0;
        }
      } catch (error) {
        console.warn('Error fetching blood pressure:', error);
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