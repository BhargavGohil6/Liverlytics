import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateBasicDetails } from './slices/onboardingSlice';
import CommonTextInput from '../../components/CommonTextInput';
import CommonDropdown from '../../components/CommonDropdown';
import CountryPickerComponent from '../../components/CountryPicker';
import responsive from '../../theme/responsive';
import { Navyblue, BlueishGray } from '../../theme/color';

const BasicDetailsScreen = () => {
  const dispatch = useDispatch();
  const { basicDetails } = useSelector((state: any) => state.onboarding);
  const { user } = useSelector((state: any) => state.auth);
  useEffect(() => {
    // Pre-fill details from auth user only once when component mounts
    // Only if the fields are empty
    const updates: any = {};
    console.log('basicDetails',basicDetails)
    if (!basicDetails.full_name && user?.full_name) {
      updates.fullName = user.full_name;
    }
    if (!basicDetails.gender && user?.gender_custom) {
      updates.gender = user.gender_custom;
    }
    if (!basicDetails.age && user?.age) {
      updates.age = user.age.toString();
    }
    if (!basicDetails.country && user?.country_code) {
      updates.country = user.country_code;
    }
    if (!basicDetails.weight && user?.weight) {
      updates.weight = user.weight.toString();
    }
    
    if (Object.keys(updates).length > 0) {
      dispatch(updateBasicDetails(updates));
    }
  }, [user, dispatch]);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Text style={styles.description}>
        These basics help personalize your targets and alerts. You can edit them anytime.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic details</Text>

        <View style={styles.inputGap}>
          <CommonTextInput
            label="Full name"
            placeholder="Enter your full name"
            value={basicDetails.fullName}
            onChangeText={(text) => dispatch(updateBasicDetails({ fullName: text }))}
          />
        </View>

        <View style={[styles.row, styles.inputGap]}>
          <View style={styles.halfInputContainer}>
            <CommonDropdown
              label="Gender"
              placeholder="Select"
              value={basicDetails.gender}
              options={genderOptions}
              onValueChange={(value) => dispatch(updateBasicDetails({ gender: value }))}
              style={styles.dropdownStyle}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <CommonTextInput
              label="Age"
              placeholder="Years"
              value={basicDetails.age}
              keyboardType="numeric"
              onChangeText={(text) => dispatch(updateBasicDetails({ age: text }))}
            />
          </View>
        </View>

        <View style={styles.inputGap}>
          <CountryPickerComponent
            label="Country"
            placeholder="Select your country"
            value={basicDetails.country}
            onValueChange={(value) => dispatch(updateBasicDetails({ country: value }))}
          />
        </View>

        <View style={styles.inputGap}>
          <CommonTextInput
            label="Current weight"
            placeholder="e.g., 72"
            value={basicDetails.weight}
            keyboardType="numeric"
            onChangeText={(text) => dispatch(updateBasicDetails({ weight: text }))}
            suffixText="kg"
          />
        </View>
      </View>

      <Text style={styles.footerText}>
        You can update these details later from your Profile screen.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsive.padding(20),
    paddingBottom: responsive.height(30),
    width: '100%',
    alignItems: 'center',
  },
  description: {
    fontSize: responsive.fontSize(15),
    color: BlueishGray,
    textAlign: 'center',
    marginBottom: responsive.height(25),
    lineHeight: responsive.height(22),
    paddingHorizontal: responsive.padding(10),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(20),
    borderWidth: 1,
    borderColor: '#E8EDF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    width: '100%',
  },
  cardTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
    color: Navyblue,
    marginBottom: responsive.height(20),
  },
  inputGap: {
    marginBottom: responsive.height(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputContainer: {
    width: '48%',
  },
  dropdownStyle: {
    // Override any internal dropdown spacing if needed
  },
  footerText: {
    fontSize: responsive.fontSize(13),
    color: '#718096',
    textAlign: 'center',
    marginTop: responsive.height(20),
    lineHeight: responsive.height(20),
  },
});

export default BasicDetailsScreen;
