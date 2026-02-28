// src/screens/profile/NotificationRemindersScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  fetchReminderSettings,
  saveReminderSettings,
  resetSaveSuccess,
} from './slices/reminderSlice';

type NotificationRemindersScreenProps = {
  navigation: any;
};

const NotificationRemindersScreen: React.FC<NotificationRemindersScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { settings, loading, saving, saveSuccess, error } = useSelector((state: RootState) => state.reminder);

  // Local state for notification and reminder options
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [healthCheckReminders, setHealthCheckReminders] = useState(true);
  const [hydrationReminders, setHydrationReminders] = useState(false);
  const [exerciseReminders, setExerciseReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(false);
  const [silentHours, setSilentHours] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  // Load reminder settings when component mounts
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchReminderSettings(user.email));
    }
  }, [dispatch, user?.email]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (settings) {
      setMedicationReminders(parseInt(settings.medication_reminders.toString()) === 1);
      setAppointmentReminders(parseInt(settings.appointment_reminders.toString()) === 1);
      setHealthCheckReminders(parseInt(settings.health_check_reminders.toString()) === 1);
      setHydrationReminders(parseInt(settings.hydration_reminders.toString()) === 1);
      setExerciseReminders(parseInt(settings.exercise_reminders.toString()) === 1);
      setMealReminders(parseInt(settings.meal_reminders.toString()) === 1);
      setSilentHours(parseInt(settings.silent_hours.toString()) === 1);
      setCriticalAlerts(parseInt(settings.critical_alerts.toString()) === 1);
    }
  }, [settings]);

  // Handle save success
  useEffect(() => {
    if (saveSuccess) {
      // Navigate back after successful save
      const timer = setTimeout(() => {
        dispatch(resetSaveSuccess());
        navigation.goBack();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess, dispatch, navigation]);

  const handleSaveSettings = () => {
    if (!user?.email) return;

    const reminderSettings = {
      medication_reminders: medicationReminders ? 1 : 0,
      appointment_reminders: appointmentReminders ? 1 : 0,
      health_check_reminders: healthCheckReminders ? 1 : 0,
      hydration_reminders: hydrationReminders ? 1 : 0,
      exercise_reminders: exerciseReminders ? 1 : 0,
      meal_reminders: mealReminders ? 1 : 0,
      silent_hours: silentHours ? 1 : 0,
      critical_alerts: criticalAlerts ? 1 : 0,
    };

    dispatch(saveReminderSettings({
      user: user.email,
      settings: reminderSettings,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications & Reminders</Text>
          <TouchableOpacity 
            onPress={handleSaveSettings} 
            style={styles.saveButton}
            disabled={saving || !user?.email}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {(loading || authLoading) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#52ab3c" />
              <Text style={styles.loadingText}>Loading settings...</Text>
            </View>
          )}

          {!loading && !authLoading && (
            <>
              <Text style={styles.description}>
                Manage push alerts and reminder schedules according to your preferences.
              </Text>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Health Reminders</Text>
                
                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="medkit-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Medication Reminders</Text>
                      <Text style={styles.permissionSubtext}>Timely medication alerts</Text>
                    </View>
                  </View>
                  <Switch
                    value={medicationReminders}
                    onValueChange={setMedicationReminders}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={medicationReminders ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>

                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="calendar-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Appointment Reminders</Text>
                      <Text style={styles.permissionSubtext}>Doctor visits and appointments</Text>
                    </View>
                  </View>
                  <Switch
                    value={appointmentReminders}
                    onValueChange={setAppointmentReminders}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={appointmentReminders ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>

                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="pulse-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Health Check Reminders</Text>
                      <Text style={styles.permissionSubtext}>Regular health assessments</Text>
                    </View>
                  </View>
                  <Switch
                    value={healthCheckReminders}
                    onValueChange={setHealthCheckReminders}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={healthCheckReminders ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>

                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="water-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Hydration Reminders</Text>
                      <Text style={styles.permissionSubtext}>Stay hydrated throughout day</Text>
                    </View>
                  </View>
                  <Switch
                    value={hydrationReminders}
                    onValueChange={setHydrationReminders}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={hydrationReminders ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>

                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="barbell-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Exercise Reminders</Text>
                      <Text style={styles.permissionSubtext}>Daily movement prompts</Text>
                    </View>
                  </View>
                  <Switch
                    value={exerciseReminders}
                    onValueChange={setExerciseReminders}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={exerciseReminders ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>

                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="restaurant-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Meal Reminders</Text>
                      <Text style={styles.permissionSubtext}>Nutritious eating schedules</Text>
                    </View>
                  </View>
                  <Switch
                    value={mealReminders}
                    onValueChange={setMealReminders}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={mealReminders ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Notification Settings</Text>
                
                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="notifications-off-outline" size={24} color="#52ab3c" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Silent Hours</Text>
                      <Text style={styles.permissionSubtext}>Schedule quiet periods</Text>
                    </View>
                  </View>
                  <Switch
                    value={silentHours}
                    onValueChange={setSilentHours}
                    trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                    thumbColor={silentHours ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>

                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Icon name="alert-circle-outline" size={24} color="#ef4444" />
                    <View style={styles.permissionText}>
                      <Text style={styles.permissionLabel}>Critical Alerts</Text>
                      <Text style={styles.permissionSubtext}>Important health warnings</Text>
                    </View>
                  </View>
                  <Switch
                    value={criticalAlerts}
                    onValueChange={setCriticalAlerts}
                    trackColor={{ false: '#d1d5db', true: '#ef4444' }}
                    thumbColor={criticalAlerts ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#d1d5db"
                  />
                </View>
              </View>

              <View style={styles.infoCard}>
                <Icon name="information-circle-outline" size={24} color="#3b82f6" />
                <Text style={styles.infoText}>
                  Critical alerts will always be delivered regardless of silent hours. 
                  Adjust these settings based on your daily routine and health needs.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#52ab3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  permissionItemLast: {
    borderBottomWidth: 0,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  permissionText: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  permissionSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    flex: 1,
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
});

export default NotificationRemindersScreen;