import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';

// Note: Install react-native-vector-icons or use expo icons
// npm install react-native-vector-icons
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect, useIsFocused, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addVitals, updateVitals, VitalsData, clearVitalsState, resetVitalsSuccess, fetchTodaysVitalsForUser, fetchTodayVitalsById, VitalsApiResponse, VitalRecord } from './slices/vitalsSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { colors, font } from '../../theme/index';
import responsive from '../../theme/responsive';

interface UserData {
  email?: string;
  full_name?: string;
}

export default function AddVitalsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch: AppDispatch = useDispatch();
  const isFocused = useIsFocused();
  
  // Get user data from auth state
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Get vitals state
  const vitalsState = useSelector((state: RootState) => state.vitals);
  const { loading, success, todayData } = vitalsState as { loading: boolean; success: boolean; todayData: VitalsApiResponse | null };
  
  // Debug log to see vitals state changes
  useEffect(() => {
    console.log('Vitals State Updated:', vitalsState);
  }, [vitalsState]);
  
  // Debug log to see success state changes
  useEffect(() => {
    console.log('Success state changed:', success);
  }, [success]);
  
  const [heartRate, setHeartRate] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [glucose, setGlucose] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepMinutes, setSleepMinutes] = useState('');
  const [spo2, setSpo2] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [vitalId, setVitalId] = useState<string | null>(null);

  // Handle form submission
  const handleSaveVitals = () => {
    // Validate required fields
    if (!heartRate && !restingHR && !glucose && !sleepMinutes && !spo2 && !weight && !systolic && !diastolic) {
      Alert.alert('Empty Vitals', 'Please enter at least one vital reading');
      return;
    }

    // Prepare data for submission
    const vitalsData: VitalsData = {
      heart_rate: heartRate ? parseFloat(heartRate) : undefined,
      resting_heart_rate: restingHR ? parseFloat(restingHR) : undefined,
      glucose: glucose ? parseFloat(glucose) : undefined,
      sleep_hours: sleepHours ? parseInt(sleepHours, 10) : undefined,
      sleep_minutes: sleepMinutes ? parseInt(sleepMinutes, 10) : undefined,
      spo2: spo2 ? parseFloat(spo2) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      blood_pressure_systolic: systolic ? parseInt(systolic, 10) : undefined,
      blood_pressure_diastolic: diastolic ? parseInt(diastolic, 10) : undefined,
      user: user?.email || '',
    };

    // Clear form immediately before dispatching
    setHeartRate('');
    setRestingHR('');
    setGlucose('');
    setSleepHours('');
    setSleepMinutes('');
    setSpo2('');
    setWeight('');
    setSystolic('');
    setDiastolic('');
    setVitalId(null);

    // Dispatch the action to save vitals
    if (vitalId) {
      // Update existing vital record
      dispatch(updateVitals({...vitalsData, vital_id: vitalId}));
    } else {
      // Add new vital record
      dispatch(addVitals(vitalsData));
    }
  };

  // Navigate to success screen when submission is successful
  useEffect(() => {
    if (success && isFocused) {
      console.log('Success state detected, navigating to success screen');
      // Navigate to success screen
      navigation.navigate('VitalsSavedSuccessScreen');
      
      // Reset success state after navigation
      dispatch(resetVitalsSuccess());
    }
  }, [success, navigation, isFocused, dispatch]);

  // Handle component focus (when navigating back from success screen)
  useFocusEffect(
    React.useCallback(() => {
      console.log('AddVitalsScreen focused, resetting success state');
      // Clear any previous success state when screen comes into focus
      dispatch(resetVitalsSuccess());
      
      // Fetch today's vitals for the current user
      // dispatch(fetchTodaysVitalsForUser() as any);
    }, [dispatch])
  );

  // Clear success state when leaving the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(resetVitalsSuccess());
    });
    
    return unsubscribe;
  }, [navigation, dispatch]);
  
  // Check route params on mount to determine if we're updating or adding
  useEffect(() => {
    // Check if we're updating an existing vital record
    const vitalIdFromParams = route.params?.vitalId;
    if (vitalIdFromParams) {
      setVitalId(vitalIdFromParams);
      // Fetch the specific vital record to update
      dispatch(fetchTodayVitalsById(vitalIdFromParams));
    } else {
      // We're adding a new vital, so clear any existing form data
      setHeartRate('');
      setRestingHR('');
      setGlucose('');
      setSleepHours('');
      setSleepMinutes('');
      setSpo2('');
      setWeight('');
      setSystolic('');
      setDiastolic('');
      setVitalId(null);
    }
  }, [route.params, user?.email, dispatch]);
  
  // Populate form fields when todayData is available and we're updating (not adding new)
  useEffect(() => {
    // Check if component is still mounted
    let isMounted = true;
    
    // Only populate if we have a vitalId (meaning we're updating an existing record)
    if (vitalId && todayData && todayData.data && isMounted) {
      console.log('Updating existing vital, populating form fields');
      console.log('Today Data:', todayData);
      console.log('Current User:', user);
      console.log('Vital ID:', vitalId);
      
      // Check if todayData.data is an array (multiple records)
      if (Array.isArray(todayData.data)) {
        console.log('Multiple records found:', todayData.data);
        // Find the record that matches the vitalId we're updating
        const recordToUpdate = todayData.data.find(record => record.name === vitalId);
        
        if (recordToUpdate && isMounted) {
          console.log('Record to update found:', recordToUpdate);
          populateFormFields(recordToUpdate);
        } else {
          console.log('No record found for vitalId:', vitalId);
        }
      } else {
        // Single record
        console.log('Single record found:', todayData.data);
        if (isMounted && (todayData.data as VitalRecord).name === vitalId) {
          populateFormFields(todayData.data as VitalRecord);
        }
      }
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [todayData, user, vitalId]);
  
  const populateFormFields = (record: VitalRecord) => {
    console.log('Populating form fields with record:', record);
    // Store the vital_id if it exists
    if (record.name) {
      setVitalId(record.name);
      console.log('Setting vitalId:', record.name);
    }
    
    // Map API response fields to form fields
    if (record.heart_rate !== undefined && record.heart_rate !== null) {
      const heartRateValue = record.heart_rate.toString();
      setHeartRate(heartRateValue);
      console.log('Setting heartRate:', heartRateValue);
    }
    if (record.weight !== undefined && record.weight !== null) {
      const weightValue = record.weight.toString();
      setWeight(weightValue);
      console.log('Setting weight:', weightValue);
    }
    // Note: API uses 'sleep' but form uses 'sleepMinutes'
    if (record.sleep !== undefined && record.sleep !== null) {
      const sleepValue = record.sleep.toString();
      setSleepMinutes(sleepValue);
      console.log('Setting sleepMinutes:', sleepValue);
    }
    // Handle sleep_hours and sleep_minutes if available
    if (record.sleep_hours !== undefined && record.sleep_hours !== null) {
      const sleepHoursValue = record.sleep_hours.toString();
      setSleepHours(sleepHoursValue);
      console.log('Setting sleepHours:', sleepHoursValue);
    }
    if (record.sleep_minutes !== undefined && record.sleep_minutes !== null) {
      const sleepMinutesValue = record.sleep_minutes.toString();
      setSleepMinutes(sleepMinutesValue);
      console.log('Setting sleepMinutes:', sleepMinutesValue);
    }
    if (record.glucose !== undefined && record.glucose !== null) {
      const glucoseValue = record.glucose.toString();
      setGlucose(glucoseValue);
      console.log('Setting glucose:', glucoseValue);
    }
    // Note: API uses 'spo2' but form uses 'spo2'
    if (record.spo2 !== undefined && record.spo2 !== null) {
      const spo2Value = record.spo2.toString();
      setSpo2(spo2Value);
      console.log('Setting spo2:', spo2Value);
    }
    
    // Parse blood pressure if available
    if (record.blood_pressure_systolic !== undefined && record.blood_pressure_systolic !== null) {
      setSystolic(record.blood_pressure_systolic.toString());
    }
    if (record.blood_pressure_diastolic !== undefined && record.blood_pressure_diastolic !== null) {
      setDiastolic(record.blood_pressure_diastolic.toString());
    }

    if (!record.blood_pressure_systolic && record.blood_pressure) {
      const bpParts = record.blood_pressure.split('/');
      if (bpParts.length === 2) {
        setSystolic(bpParts[0]);
        setDiastolic(bpParts[1]);
        console.log('Setting BP:', bpParts[0], '/', bpParts[1]);
      } else {
        // If it's a single number, we'll put it in systolic for now
        setSystolic(record.blood_pressure);
        console.log('Setting systolic BP:', record.blood_pressure);
      }
    }
    
    // Also populate resting heart rate if available
    if (record.resting_heart_rate !== undefined && record.resting_heart_rate !== null) {
      const restingHRValue = record.resting_heart_rate.toString();
      setRestingHR(restingHRValue);
      console.log('Setting restingHR:', restingHRValue);
    }
    
    // Handle weight unit if available in the record
    if (record.weight_unit) {
      setWeightUnit(record.weight_unit);
      console.log('Setting weightUnit:', record.weight_unit);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate('Dashboard')}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="trending-up" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellIcon}>
            <Icon name="bell" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Add Vitals</Text>
          <Text style={styles.subtitle}>
            Enter today's readings or update wearable data.
          </Text>
        </View>

        {/* Heart Rate */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Heart Rate</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={heartRate}
              onChangeText={setHeartRate}
            />
            <Text style={styles.unit}>bpm</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="info" size={16} color="#666" />
            <Text style={styles.infoText}>
              Resting HR auto-imported when available.
            </Text>
          </View>
        </View>

        {/* Resting Heart Rate */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Resting Heart Rate</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={restingHR}
              onChangeText={setRestingHR}
            />
            <Text style={styles.unit}>bpm</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="watch" size={16} color="#666" />
            <Text style={styles.infoText}>
              Tracked via wearable when connected.
            </Text>
          </View>
        </View>

        {/* Glucose */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Glucose</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={glucose}
              onChangeText={setGlucose}
            />
            <Text style={styles.unit}>mg/dL</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="smartphone" size={16} color="#666" />
            <Text style={styles.infoText}>
              Imported from glucometer when available.
            </Text>
          </View>
        </View>

        {/* Sleep Duration */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Sleep Duration</Text>
          <View style={styles.sleepContainer}>
            <View style={styles.sleepInputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Hours"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={sleepHours}
                onChangeText={setSleepHours}
              />
              <Text style={styles.unit}>hr</Text>
            </View>
            <View style={styles.sleepInputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Minutes"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={sleepMinutes}
                onChangeText={setSleepMinutes}
              />
              <Text style={styles.unit}>min</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="moon" size={16} color="#666" />
            <Text style={styles.infoText}>
              Total sleep duration from last night.
            </Text>
          </View>
        </View>

        {/* SpO2 */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>SpO₂</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={spo2}
              onChangeText={setSpo2}
            />
            <Text style={styles.unit}>%</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="activity" size={16} color="#666" />
            <Text style={styles.infoText}>
              Optional but helpful for flagging low oxygen.
            </Text>
          </View>
        </View>

        {/* Weight */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TouchableOpacity 
              style={styles.unitSelector}
              onPress={() => setShowUnitPicker(!showUnitPicker)}
            >
              <Text style={styles.unitSelectorText}>
                select{'\n'}option
              </Text>
              <Icon name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          {showUnitPicker && (
            <View style={styles.unitPicker}>
              <TouchableOpacity 
                style={[styles.unitOption, weightUnit === 'kg' && styles.unitOptionActive]}
                onPress={() => {
                  setWeightUnit('kg');
                  setShowUnitPicker(false);
                }}
              >
                <Text style={[styles.unitOptionText, weightUnit === 'kg' && styles.unitOptionTextActive]}>
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.unitOption, weightUnit === 'lb' && styles.unitOptionActive]}
                onPress={() => {
                  setWeightUnit('lb');
                  setShowUnitPicker(false);
                }}
              >
                <Text style={[styles.unitOptionText, weightUnit === 'lb' && styles.unitOptionTextActive]}>
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Icon name="droplet" size={16} color="#666" />
            <Text style={styles.infoText}>
              Tracks rapid fluid retention changes.
            </Text>
          </View>
        </View>

        {/* Blood Pressure */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Blood Pressure (Optional)</Text>
          <View style={styles.bpContainer}>
            <View style={styles.bpInput}>
              <TextInput
                style={styles.bpTextInput}
                placeholder="Systolic"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={systolic}
                onChangeText={setSystolic}
              />
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
            <View style={styles.bpInput}>
              <TextInput
                style={styles.bpTextInput}
                placeholder="Diastolic"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={diastolic}
                onChangeText={setDiastolic}
              />
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="heart" size={16} color="#666" />
            <Text style={styles.infoText}>
              Optional if you track BP.
            </Text>
          </View>
        </View>

        {/* AI Trend Check Info */}
        {/* <View style={styles.aiInfoCard}>
          <Text style={styles.aiInfoTitle}>AI Trend Check (On-Device)</Text>
          <Text style={styles.aiInfoText}>
            Your entries will be analyzed for unusual changes.{'\n'}
            Cloud-based analytics only used if you opted in.
          </Text>
        </View> */}

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={handleSaveVitals}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Vitals</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    zIndex: -1,
  },
  logo: {
    width: responsive.width(32),
    height: responsive.height(32),
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.margin(8),
  },
  logoText: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(12),
  },
  todayButton: {
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(6),
  },
  todayText: {
    fontSize: font.base,
    color: colors.darkGray,
    fontWeight: '500',
  },
  bellIcon: {
    padding: responsive.padding(4),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: responsive.padding(16),
  },
  titleSection: {
    paddingTop: responsive.padding(24),
    paddingBottom: responsive.padding(20),
  },
  title: {
    fontSize: font.h3,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(8),
  },
  subtitle: {
    fontSize: font.base,
    color: colors.gray666,
    lineHeight: responsive.height(20),
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(12),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(12),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(14),
    marginBottom: responsive.margin(12),
  },
  input: {
    flex: 1,
    fontSize: font.lg,
    color: colors.darkGray,
  },
  unit: {
    fontSize: font.base,
    color: colors.gray666,
    marginLeft: responsive.margin(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsive.width(8),
  },
  infoText: {
    flex: 1,
    fontSize: font.sm,
    color: colors.gray666,
    lineHeight: responsive.height(18),
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(4),
    paddingLeft: responsive.padding(12),
    borderLeftWidth: 1,
    borderLeftColor: colors.gray200,
  },
  unitSelectorText: {
    fontSize: font.sm,
    color: colors.gray666,
    textAlign: 'center',
    lineHeight: responsive.height(14),
  },
  unitPicker: {
    flexDirection: 'row',
    backgroundColor: colors.grayEFEF,
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(4),
    marginBottom: responsive.margin(12),
  },
  unitOption: {
    flex: 1,
    paddingVertical: responsive.padding(8),
    alignItems: 'center',
    borderRadius: responsive.borderRadius(6),
  },
  unitOptionActive: {
    backgroundColor: colors.white,
  },
  unitOptionText: {
    fontSize: font.base,
    color: colors.gray666,
    fontWeight: '500',
  },
  unitOptionTextActive: {
    color: colors.darkGray,
    fontWeight: '600',
  },
  bpContainer: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(12),
  },
  bpInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(14),
  },
  bpTextInput: {
    flex: 1,
    fontSize: font.lg,
    color: colors.darkGray,
  },
  bpUnit: {
    fontSize: font.sm,
    color: colors.gray666,
    marginLeft: responsive.margin(8),
  },
  sleepContainer: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(12),
  },
  sleepInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(14),
  },
  aiInfoCard: {
    backgroundColor: colors.darkGreen,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
    marginBottom: responsive.margin(20),
  },
  aiInfoTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.white,
    marginBottom: responsive.margin(8),
  },
  aiInfoText: {
    fontSize: font.sm,
    color: colors.mintMist,
    lineHeight: responsive.height(19),
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(12),
    paddingVertical: responsive.padding(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.white,
  },
  disabledButton: {
    backgroundColor: colors.gray666,
  },
});