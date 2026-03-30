import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { RootState } from '../../redux/store';
import { updateDailyHealthTargets } from './slices/profileSlice';
import CommonButton from '../../components/CommonButton';
import Toast from 'react-native-toast-message';

const EditHealthTargetsScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dailyHealthTargets, loading, error } = useSelector((state: RootState) => state.profile);

  // State for health targets
  const [sodiumLimit, setSodiumLimit] = useState<string>('');
  const [fluidLimit, setFluidLimit] = useState<string>('');
  const [proteinLimit, setProteinLimit] = useState<string>('');
  const [weightGainThreshold, setWeightGainThreshold] = useState<string>('');
  const [hrThreshold, setHrThreshold] = useState<string>('');
  const [sleepGoal, setSleepGoal] = useState<string>('');

  // Load existing values when component mounts
  useEffect(() => {
    if (dailyHealthTargets && dailyHealthTargets.length > 0) {
      const target = dailyHealthTargets[0];
      setSodiumLimit(target.daily_sodium_limit?.toString() ?? '');
      setFluidLimit(target.daily_fluid_limit?.toString() ?? '');
      setProteinLimit(target.daily_protein_limit?.toString() ?? '');
      setWeightGainThreshold(target.weight_gain_alert_threshold?.toString() ?? '');
      setHrThreshold(target.resting_hr_alert_threshold?.toString() ?? '');
      setSleepGoal(target.sleep_goal?.toString() ?? '');
    }
  }, [dailyHealthTargets]);

  const handleSave = () => {
    if (!user?.email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User email not found',
      });
      return;
    }

    // Validate inputs
    if (!sodiumLimit || !fluidLimit || !proteinLimit || !weightGainThreshold || !hrThreshold || !sleepGoal) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all target values',
      });
      return;
    }

    // Dispatch the update action
    dispatch(updateDailyHealthTargets({
      daily_sodium_limit: parseFloat(sodiumLimit),
      daily_fluid_limit: parseFloat(fluidLimit),
      daily_protein_limit: parseFloat(proteinLimit),
      weight_gain_alert_threshold: parseFloat(weightGainThreshold),
      resting_hr_alert_threshold: parseFloat(hrThreshold),
      sleep_goal: parseFloat(sleepGoal),
      user: user.email,
    }) as unknown as AnyAction);
  };

  // Handle successful update (we'll listen to the store for updates)
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    }
  }, [error]);

  // Listen for successful update to navigate back
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = React.useState<number>(0);
  const [wasUpdating, setWasUpdating] = React.useState<boolean>(false);

  useEffect(() => {
    // Track when we transition from loading to not loading
    if (wasUpdating && !loading && !error) {
      // This means the update was successful
      setLastUpdateTimestamp(Date.now());
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Health targets updated successfully!',
      });
      // Navigate back after a short delay to allow toast to show
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
    setWasUpdating(loading);
  }, [loading, error, navigation, wasUpdating]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Health Targets</Text>
          <View style={{ width: 24 }} /> {/* Spacer for alignment */}
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Daily Health Targets</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daily Sodium Limit (mg)</Text>
            <TextInput
              style={styles.input}
              value={sodiumLimit}
              onChangeText={setSodiumLimit}
              placeholder="Enter sodium limit"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daily Fluid Limit (mL)</Text>
            <TextInput
              style={styles.input}
              value={fluidLimit}
              onChangeText={setFluidLimit}
              placeholder="Enter fluid limit"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daily Protein Limit (g)</Text>
            <TextInput
              style={styles.input}
              value={proteinLimit}
              onChangeText={setProteinLimit}
              placeholder="Enter protein limit"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight Gain Alert (+kg in 48hrs)</Text>
            <TextInput
              style={styles.input}
              value={weightGainThreshold}
              onChangeText={setWeightGainThreshold}
              placeholder="Enter weight gain threshold"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Resting HR Alert (bpm)</Text>
            <TextInput
              style={styles.input}
              value={hrThreshold}
              onChangeText={setHrThreshold}
              placeholder="Enter HR threshold"
              keyboardType="numeric"
            />
          </View>

          {/* <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sleep Goal (hours)</Text>
            <TextInput
              style={styles.input}
              value={sleepGoal}
              onChangeText={setSleepGoal}
              placeholder="Enter sleep goal"
              keyboardType="numeric"
            />
          </View> */}
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <CommonButton
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={loading}
            bgColor="#52ab3c"
          />
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default EditHealthTargetsScreen;