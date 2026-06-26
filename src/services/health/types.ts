export interface HealthData {
  steps: number;
  sleepHours: number;
  heartRate: number;
  calories: number;
  distance: number;
  systolic?: number;
  diastolic?: number;
}

export interface PermissionResult {
  granted: boolean;
  unavailable?: boolean;
  blocked?: boolean;
}