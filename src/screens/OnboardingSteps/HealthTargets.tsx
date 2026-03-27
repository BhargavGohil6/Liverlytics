import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardTypeOptions } from 'react-native';
import responsive from '../../theme/responsive';
import { Navyblue, BlueishGray, CoolGray } from '../../theme/color';
import CommonTextInput from '../../components/CommonTextInput';
import CommonDropdown from '../../components/CommonDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { updateDailyTargets } from './slices/onboardingSlice';



const HealthTargets = () => {
  const dispatch = useDispatch();
  const dailyTargets = useSelector((state: any) => state.onboarding.dailyTargets);

  // Initialize with empty strings for UI, only show values if user has entered something
  const [sodium, setSodium] = useState('');
  const [protein, setProtein] = useState('');
  const [fluid, setFluid] = useState('');
  const [weightGain, setWeightGain] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');

  // Update state when Redux values change (for back/forward navigation)
  useEffect(() => {
    if (dailyTargets?.daily_sodium_limit && dailyTargets.daily_sodium_limit !== 1800.0) {
      setSodium(dailyTargets.daily_sodium_limit.toString());
    }
    if (dailyTargets?.daily_protein_limit && dailyTargets.daily_protein_limit !== 60.0) {
      setProtein(dailyTargets.daily_protein_limit.toString());
    }
    if (dailyTargets?.daily_fluid_limit && dailyTargets.daily_fluid_limit !== 1500.0) {
      setFluid(dailyTargets.daily_fluid_limit.toString());
    }
    if (dailyTargets?.weight_gain_alert_threshold && dailyTargets.weight_gain_alert_threshold !== 1.5) {
      setWeightGain(dailyTargets.weight_gain_alert_threshold.toString());
    }
    if (dailyTargets?.resting_hr_alert_threshold && dailyTargets.resting_hr_alert_threshold !== 80.0) {
      setRestingHR(dailyTargets.resting_hr_alert_threshold.toString());
    }
  }, [dailyTargets]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* <Text style={styles.heading}>Set Your Daily Health Targets</Text> */}
      <Text style={styles.description}>
        These help personalize alerts and insights. All fields are optional and
        can be changed anytime.
      </Text>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Sodium Limit</Text>
        <View style={styles.singleInputContainer}>
          <CommonTextInput 
            placeholder="e.g., 2000" 
            onChangeText={(text) => {
              setSodium(text);
              dispatch(updateDailyTargets({ daily_sodium_limit: parseFloat(text) || 0 }));
            }} 
            value={sodium} 
            style={styles.inputtext} 
            keyboardType="numeric"
            suffixText="mg"
          />
        </View>
        <Text style={styles.subtitle}>Typical target: 1500–2000 mg/day for fluid control</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Protein Intake</Text>
        <View style={styles.singleInputContainer}>
          <CommonTextInput 
            placeholder="e.g., 60" 
            onChangeText={(text) => {
              setProtein(text);
              dispatch(updateDailyTargets({ daily_protein_limit: parseFloat(text) || 0 }));
            }} 
            value={protein} 
            style={styles.inputtext} 
            keyboardType="numeric"
            suffixText="g"
          />
        </View>
        <Text style={styles.subtitle}>Recommended daily protein intake in grams</Text>
      </View>
       <View style={styles.container}>
        <Text style={styles.title}>Daily Fluid Limit</Text>
        <View style={styles.singleInputContainer}>
          <CommonTextInput 
            placeholder="e.g., 1500" 
            value={fluid} 
            onChangeText={(text) => {
              setFluid(text);
              dispatch(updateDailyTargets({ daily_fluid_limit: parseFloat(text) || 0 }));
            }} 
            style={styles.inputtext} 
            keyboardType="numeric"
            suffixText="mL"
          />
        </View>
        <Text style={styles.subtitle}>Typical target: 1500–2000 mg/day for fluid control</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Weight-Gain Alert Threshold</Text>
        <View style={styles.inputContainer}>
          <CommonTextInput 
            placeholder="e.g., 2" 
            value={weightGain} 
            onChangeText={(text) => {
              setWeightGain(text);
              dispatch(updateDailyTargets({ weight_gain_alert_threshold: parseFloat(text) || 0 }));
            }} 
            style={styles.weightInput} 
            keyboardType="numeric"
          />
          <CommonDropdown
            label=""
            placeholder="Unit"
            options={[{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }]}
            onValueChange={(value) => setWeightUnit(value)}
            value={weightUnit}
            style={styles.unitDropdown}
          />
        </View>
        <Text style={styles.subtitle}>Alert if weight increases by this amount within 24–48 hours</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Resting Heart Rate Alert</Text>
        <View style={styles.singleInputContainer}>
          <CommonTextInput
            placeholder="e.g., 80"
            keyboardType="numeric"
            value={restingHR}
            onChangeText={(text) => {
              setRestingHR(text);
              dispatch(updateDailyTargets({ resting_hr_alert_threshold: parseFloat(text) || 0 }));
            }}
            style={styles.inputtext}
            suffixText="bpm"
          />
        </View>
        <Text style={styles.subtitle}>Alert if resting HR exceeds this value</Text>
      </View>
      <Text style={styles.subtitle}>All fields are optional — you can skip and set these later.</Text>
    </ScrollView>
  );
};

export default HealthTargets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: responsive.borderRadius(10),
    // justifyContent: 'space-between',
    marginVertical: responsive.margin(10),
    width: responsive.width(330),
  
  },
  heading: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    // marginBottom: 20,
    color: Navyblue,
  },
  description: {
    fontSize: responsive.fontSize(13),
    width: responsive.width(300),
    color: BlueishGray,
    alignItems: 'center',
    alignSelf:'center'
  },
  title: {
    fontSize: responsive.fontSize(15),
    color: Navyblue,
    fontWeight: '600',
    // width: responsive.width(210),
  },
  inputtext:{
    height:responsive.height(45),
    marginTop:responsive.margin(10),
    // maxWidth: '90%',
  },
  subtitle:{
    fontSize:responsive.fontSize(12),
    color:CoolGray,
  },
  scrollContainer:{
    marginHorizontal: responsive.margin(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: '70%',
  },
  singleInputContainer: {
    alignItems: 'flex-start',
  },
  weightInput: {
    flex: 1,
    height:responsive.height(45),
    marginTop:responsive.margin(10),
    marginRight: responsive.margin(10),
    maxWidth: '90%',
  },
  unitDropdown: {
    width: responsive.width(80),
    height: responsive.height(45),
    marginTop: responsive.margin(10),
  }
});
