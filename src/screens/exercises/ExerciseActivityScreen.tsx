// src/screens/ExerciseActivityScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonTextInput from '../../components/CommonTextInput';
import CommonLoader from '../../components/CommonLoader';
import responsive from '../../theme/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { addExercise } from './slices/exerciseSlice';
import { RootState } from '../../redux/store';
import { AppDispatch } from '../../redux/store';
import { requestHealthPermissions, getHealthData } from '../../services/health/HealthService';

const ExerciseActivityScreen = ({ navigation }: { navigation: any }) => {
  const [syncing, setSyncing] = useState(false);
  const [steps, setSteps] = useState('');
  const [rhr, setRhr] = useState('');
  const [ahr, setAhr] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [calories, setCalories] = useState('');
  const [bp, setBp] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepMinutes, setSleepMinutes] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: exerciseLoading } = useSelector((state: RootState) => state.exercise);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Request health permissions
      const permissionResult = await requestHealthPermissions();
      
      if (permissionResult.granted) {
        // Fetch health data
        const healthData = await getHealthData();
        
        // Populate the form fields with fetched data
        if (healthData.steps > 0) {
          setSteps(healthData.steps.toString());
        }
        if (healthData.heartRate > 0) {
          setRhr(healthData.heartRate.toString());
        }
        if (healthData.calories > 0) {
          setCalories(healthData.calories.toString());
        }
        if (healthData.sleepHours > 0) {
          // Split sleep hours into hours and minutes
          const hours = Math.floor(healthData.sleepHours);
          const minutes = Math.round((healthData.sleepHours - hours) * 60);
          setSleepHours(hours.toString());
          setSleepMinutes(minutes.toString());
        }
        if (healthData.distance > 0) {
          // You might want to use distance as a proxy for active heart rate or other metrics
          // For now, we'll leave ahr empty as it's typically user-entered
        }
        if (healthData.systolic && healthData.diastolic) {
          setBp(`${healthData.systolic}/${healthData.diastolic}`);
        }
        
        // Show success message
        Alert.alert(
          'Success', 
          'Health data synced successfully! Your exercise metrics have been updated.',
          [{ text: 'OK' }]
        );
      } else {
        // Show error message
        Alert.alert(
          'Permission Denied',
          'Health data access was denied. Please enable permissions in your device settings to sync health data.',
          [
            { text: 'OK', style: 'cancel' },
            { 
              text: 'Retry', 
              onPress: handleSync 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error syncing health data:', error);
      Alert.alert(
        'Sync Error',
        'Failed to sync health data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Exercise & Activity</Text>
            <Text style={styles.subtitle}>
              Log exercise metrics including heart rate, oxygen, calories, and blood pressure.
            </Text>

            {/* Health Sync Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Health Sync</Text>
              <View style={styles.syncRow}>
                <Icon name="heart-outline" size={24} color="#1f2937" />
                <Text style={styles.syncText}>Sync from HealthKit / Health Connect</Text>
              </View>
              
              {syncing ? (
                <View style={styles.syncingContainer}>
                  <ActivityIndicator size="small" color="#52ab3c" />
                  <Text style={styles.syncingText}>Syncing health data...</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
                  <View style={styles.syncButtonContent}>
                    <Icon name="sync-outline" size={20} color="#374151" />
                    <Text style={styles.syncButtonText}>Sync from Health</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Steps Input */}
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="footsteps-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Steps</Text>
              </View>
              <View style={styles.inputContainerWithoutBorder}>
                <CommonTextInput
                  value={steps}
                  onChangeText={setSteps}
                  placeholder="e.g., 4500"
                  keyboardType="numeric"
                  suffixText="steps"
                  style={styles.commonInputStyle}
                  borderColor="transparent"
                  radius={8}
                  padding={12}
                />
              </View>
              <Text style={styles.inputHint}>Prefilled when synced; editable anytime.</Text>
            </View>

            {/* Resting Heart Rate Input */}
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="heart-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Resting Heart Rate (bpm)</Text>
              </View>
              <View style={styles.inputContainerWithoutBorder}>
                <CommonTextInput
                  value={rhr}
                  onChangeText={setRhr}
                  placeholder="e.g., 62"
                  keyboardType="numeric"
                  suffixText="bpm"
                  style={styles.commonInputStyle}
                  borderColor="transparent"
                  radius={8}
                  padding={12}
                />
              </View>
              <Text style={styles.inputHint}>Prefilled when synced; editable anytime.</Text>
            </View>

            {/* Active Heart Rate Input */}
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="fitness-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Active Heart Rate (bpm)</Text>
              </View>
              <View style={styles.inputContainerWithoutBorder}>
                <CommonTextInput
                  value={ahr}
                  onChangeText={setAhr}
                  placeholder="e.g., 120"
                  keyboardType="numeric"
                  suffixText="bpm"
                  style={styles.commonInputStyle}
                  borderColor="transparent"
                  radius={8}
                  padding={12}
                />
              </View>
              <Text style={styles.inputHint}>Enter your active heart rate during exercise.</Text>
            </View>

            {/* Oxygen Saturation Input */}
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="water-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Oxygen Saturation (%)</Text>
              </View>
              <View style={styles.inputContainerWithoutBorder}>
                <CommonTextInput
                  value={oxygen}
                  onChangeText={setOxygen}
                  placeholder="e.g., 98"
                  keyboardType="numeric"
                  suffixText="%"
                  style={styles.commonInputStyle}
                  borderColor="transparent"
                  radius={8}
                  padding={12}
                />
              </View>
              <Text style={styles.inputHint}>Blood oxygen level during activity.</Text>
            </View>

            {/* Calories Burned Input */}
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="flame-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Calories Burned</Text>
              </View>
              <View style={styles.inputContainerWithoutBorder}>
                <CommonTextInput
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="e.g., 350"
                  keyboardType="numeric"
                  suffixText="kcal"
                  style={styles.commonInputStyle}
                  borderColor="transparent"
                  radius={8}
                  padding={12}
                />
              </View>
              <Text style={styles.inputHint}>Total calories burned during exercise.</Text>
            </View>

            {/* Blood Pressure Input */}
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="pulse-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Blood Pressure</Text>
              </View>
              <View style={styles.inputContainerWithoutBorder}>
                <CommonTextInput
                  value={bp}
                  onChangeText={setBp}
                  placeholder="e.g., 120/80"
                  keyboardType="default"
                  style={styles.commonInputStyle}
                  borderColor="transparent"
                  radius={8}
                  padding={12}
                />
              </View>
              <Text style={styles.inputHint}>Enter systolic/diastolic (e.g., 120/80).</Text>
            </View>

            {/* Sleep Input */}
            {/* <View style={styles.card}>
              <View style={styles.inputHeader}>
                <Icon name="moon-outline" size={20} color="#1f2937" />
                <Text style={styles.inputLabel}>Sleep Duration</Text>
              </View>
              <View style={styles.sleepRow}>
                <View style={styles.sleepInputContainer}>
                  <CommonTextInput
                    value={sleepHours}
                    onChangeText={setSleepHours}
                    placeholder="0"
                    keyboardType="numeric"
                    suffixText="hrs"
                    style={styles.commonInputStyle}
                    borderColor="transparent"
                    radius={8}
                  />
                </View>
                <View style={styles.sleepInputContainer}>
                  <CommonTextInput
                    value={sleepMinutes}
                    onChangeText={setSleepMinutes}
                    placeholder="0"
                    keyboardType="numeric"
                    suffixText="min"
                    style={styles.commonInputStyle}
                    borderColor="transparent"
                    radius={8}
                  />
                </View>
              </View>
              <Text style={styles.inputHint}>Prefilled when synced; editable anytime.</Text>
            </View> */}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={() => {
                  // Prepare the exercise data to send
                  const exerciseData = {
                    resting_hr: rhr,
                    active_hr: ahr,
                    oxygen_saturation: oxygen,
                    calories_burned: calories,
                    blood_pressure: bp,
                    sleep_hours: sleepHours,
                    sleep_minutes: sleepMinutes,
                    steps: steps,
                    user: user?.email || '', // Fallback to default email
                  };
                  
                  // Dispatch the addExercise action
                  dispatch(addExercise(exerciseData))
                    .then((result) => {
                      if (result.meta.requestStatus === 'fulfilled') {
                        // Navigate to saved screen on success
                        setTimeout(() => {
                          navigation.navigate('Dashboard');
                        }, 1000);
                      }
                    });
                }}
                disabled={exerciseLoading}
              >
                <Text style={styles.saveText}>{exerciseLoading ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <CommonLoader visible={exerciseLoading} message="Saving Exercise Data..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: responsive.padding(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    padding: responsive.padding(16),
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: responsive.margin(4),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: '#6b7280',
    marginBottom: responsive.margin(24),
  },
  card: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: responsive.margin(12),
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  syncText: {
    fontSize: responsive.fontSize(14),
    color: '#374151',
    marginLeft: responsive.margin(12),
  },
  syncButton: {
    backgroundColor: '#fff',
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(16),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  syncButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: responsive.fontSize(15),
    fontWeight: '600',
    color: '#374151',
    marginLeft: responsive.margin(8),
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsive.padding(12),
  },
  syncingText: {
    fontSize: responsive.fontSize(14),
    color: '#52ab3c',
    marginLeft: responsive.margin(8),
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  inputLabel: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: responsive.margin(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(12),
    marginBottom: responsive.margin(8),
  },
  input: {
    flex: 1,
    paddingVertical: responsive.padding(12),
    fontSize: responsive.fontSize(15),
    color: '#1f2937',
  },
  inputContainerWithoutBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: responsive.borderRadius(8),
    // paddingHorizontal: responsive.padding(10),
    marginBottom: responsive.margin(8),
    
  },
  sleepRow: {
    flexDirection: 'row',
    gap: responsive.margin(12),
    marginBottom: responsive.margin(8),
  },
  sleepInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: responsive.borderRadius(8),
  },
  commonInputStyle: {
     flex: 1,
    // paddingVertical: responsive.padding(12),
    fontSize: responsive.fontSize(15),
    color: '#1f2937',
    top: 6,
  },
  inputHint: {
    fontSize: responsive.fontSize(13),
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: responsive.margin(12),
    marginTop: responsive.margin(8),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    backgroundColor: '#52ab3c',
  },
  saveText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#fff',
  },
});

export default ExerciseActivityScreen;