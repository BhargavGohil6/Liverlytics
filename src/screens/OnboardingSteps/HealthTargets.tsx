import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import responsive from '../../theme/responsive';
import { Navyblue, BlueishGray, CoolGray } from '../../theme/color';
import CommonTextInput from '../../components/CommonTextInput';



const HealthTargets = () => {

  const [sodium, setSodium] = useState('');
  const [fluid, setFluid] = useState('');
  const [weightGain, setWeightGain] = useState('');
  const [restingHR, setRestingHR] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>Set Your Daily Health Targets</Text>
      <Text style={styles.description}>
        These help personalize alerts and insights. All fields are optional and
        can be changed anytime.
      </Text>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Sodium Limit</Text>
        <CommonTextInput placeholder="e.g., 2000 mg" onChangeText={setSodium} value={sodium} style={styles.inputtext} />
        <Text style={styles.subtitle}>Typical target: 1500–2000 mg/day for fluid control</Text>
      </View>
       <View style={styles.container}>
        <Text style={styles.title}>Daily Fluid Limit</Text>
        <CommonTextInput placeholder="e.g., 1500 mL" value={fluid} onChangeText={setFluid} style={styles.inputtext} />
        <Text style={styles.subtitle}>Typical target: 1500–2000 mg/day for fluid control</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Weight-Gain Alert Threshold</Text>
        <CommonTextInput placeholder="e.g.,2 " value={weightGain} onChangeText={setWeightGain} style={styles.inputtext} />
        <Text style={styles.subtitle}>Alert if weight increases by this amount within 24–48 hours</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Resting Heart Rate Alert</Text>
        <CommonTextInput
          placeholder="e.g., 80"
          keyboardType="numeric"
          value={restingHR}
          onChangeText={setRestingHR}
          style={styles.inputtext}
          
        />
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
  },
  subtitle:{
    fontSize:responsive.fontSize(12),
    color:CoolGray,
  },
  scrollContainer:{
    marginHorizontal: responsive.margin(20),
  }
});
