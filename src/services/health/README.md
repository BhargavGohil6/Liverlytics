# Health Data Integration

This folder contains the health data integration services for iOS (Apple HealthKit) and Android (Health Connect).

## Architecture

- **types.ts**: Defines the common interfaces for health data
- **IOSHealthService.ts**: Handles iOS-specific HealthKit integration
- **AndroidHealthService.ts**: Handles Android-specific Health Connect integration
- **HealthService.ts**: Main entry point that routes to platform-specific implementations

## Usage

### Requesting Permissions

```typescript
import { requestHealthPermissions } from './services/health/HealthService';

const requestPermissions = async () => {
  const result = await requestHealthPermissions();
  if (result.granted) {
    console.log('Health permissions granted');
  } else {
    console.log('Health permissions denied');
  }
};
```

### Getting Health Data

```typescript
import { getHealthData } from './services/health/HealthService';

const fetchHealthData = async () => {
  try {
    const healthData = await getHealthData();
    console.log('Health Data:', healthData);
    
    // Use the data in your UI
    setSteps(healthData.steps);
    setSleepHours(healthData.sleepHours);
    setHeartRate(healthData.heartRate);
    setCalories(healthData.calories);
    setDistance(healthData.distance);
    if (healthData.systolic !== undefined) {
      setSystolic(healthData.systolic);
    }
    if (healthData.diastolic !== undefined) {
      setDiastolic(healthData.diastolic);
    }
  } catch (error) {
    console.error('Error fetching health data:', error);
  }
};
```

### Example Integration in a Screen Component

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getHealthData, requestHealthPermissions } from '../services/health/HealthService';

const HealthDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const loadHealthData = async () => {
    setLoading(true);
    try {
      // First, request permissions
      const permissionResult = await requestHealthPermissions();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Health data access is required to show your stats.');
        return;
      }
      
      // Then fetch the data
      const data = await getHealthData();
      setHealthData(data);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadHealthData();
  }, []);
  
  if (loading) {
    return (
      <View>
        <Text>Loading health data...</Text>
      </View>
    );
  }
  
  return (
    <View>
      <Text>Steps: {healthData?.steps || 0}</Text>
      <Text>Sleep Hours: {healthData?.sleepHours || 0}</Text>
      <Text>Heart Rate: {healthData?.heartRate || 0}</Text>
      <Text>Calories: {healthData?.calories || 0}</Text>
      <Text>Distance: {healthData?.distance || 0}</Text>
      {healthData?.systolic && <Text>Systolic BP: {healthData.systolic}</Text>}
      {healthData?.diastolic && <Text>Diastolic BP: {healthData.diastolic}</Text>}
      <Button title="Refresh Data" onPress={loadHealthData} />
    </View>
  );
};

export default HealthDashboard;
```

## Installation Instructions

### iOS (Apple HealthKit)
1. Install the dependency: `npm install react-native-health`
2. Add HealthKit capability in Xcode:
   - Open ios/Liverlytics.xcworkspace in Xcode
   - Select project → Signing & Capabilities → Add Capability → HealthKit
   - Enable required read/write permissions
3. Update Info.plist with required permissions (already done)

### Android (Health Connect)
1. Install the dependency: `npm install react-native-health-connect`
2. Add permissions to AndroidManifest.xml (already done)
3. For React Native CLI projects, additional setup in MainActivity.kt may be required