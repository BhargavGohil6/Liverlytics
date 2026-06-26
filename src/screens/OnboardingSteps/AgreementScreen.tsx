import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import responsive from "../../theme/responsive";
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import CustomCheckbox from '../../components/CommonCheckbox';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../redux/store";
import {acceptMedical, acceptPrivacy, acceptTerms, completeOnboarding} from './slices/onboardingSlice';
import Toast from 'react-native-toast-message';

const AgreementScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { privacyAccepted, termsAccepted, medicalAccepted } = useSelector(
    (state: RootState) => state.onboarding
  );

  return (
    <ScrollView
      contentContainerStyle={agreementStyles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={agreementStyles.scrollContainer}
    >
      {/* Privacy Policy Card */}
      <View style={agreementStyles.card}>
        <View style={agreementStyles.cardHeader}>
          <Icon
            name="shield"
            size={responsive.fontSize(24)}
            color="#4CAF50"
            style={agreementStyles.icon}
          />
          <Text style={agreementStyles.cardTitle}>Privacy Policy</Text>
        </View>
        <Text style={agreementStyles.cardText}>
          We protect your data and only use it to provide core features like
          trends and alerts.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={agreementStyles.cardLink}>View Full Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Terms of Use Card */}
      <View style={agreementStyles.card}>
        <View style={agreementStyles.cardHeader}>
          <Icon
            name="file-text"
            size={responsive.fontSize(24)}
            color="#4CAF50"
            style={agreementStyles.icon}
          />
          <Text style={agreementStyles.cardTitle}>Terms of Use</Text>
        </View>
        <Text style={agreementStyles.cardText}>
          By using this app, you agree to our rules regarding use, content, and
          account management.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('TermsofUse')}>
        <Text style={agreementStyles.cardLink}>View Full Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Medical Disclaimer Card */}
      <View style={agreementStyles.card}>
        <View style={agreementStyles.cardHeader}>
          <Icon1
            name="stethoscope"
            size={responsive.fontSize(24)}
            color="#4CAF50"
            style={agreementStyles.icon}
          />
          <Text style={agreementStyles.cardTitle}>Medical Disclaimer</Text>
        </View>
        <Text style={agreementStyles.cardText}>
          Information in the app is for guidance only and is not a substitute
          for professional medical advice.
        </Text>
      </View>

      {/* Checkboxes */}
      <View style={agreementStyles.checkboxContainer}>
        <CustomCheckbox
          label="I agree to the Privacy Policy"
          checked={privacyAccepted}
          onPress={() => dispatch(acceptPrivacy())}
          
        />
        <CustomCheckbox
          label="I agree to the Terms of Use"
          checked={termsAccepted}
          onPress={() => dispatch(acceptTerms())}
        />
        <CustomCheckbox
          label="I acknowledge the Medical Disclaimer"
          checked={medicalAccepted}
          onPress={() => dispatch(acceptMedical())}
        />
      </View>

      <View style={{ height: responsive.height(30) }} />
    </ScrollView>
  );
};

export default AgreementScreen;

const agreementStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: responsive.height(20),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(20),
    marginBottom: responsive.height(15),
    borderWidth: 1,
    borderColor: '#E8EDF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.height(10),
  },
  icon: {
    marginRight: responsive.width(10),
  },
  cardTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
    color: '#0F2740',
  },
  cardText: {
    fontSize: responsive.fontSize(14),
    color: '#4A5568',
    lineHeight: responsive.height(20),
  },
  cardLink: {
    fontSize: responsive.fontSize(14),
    color: '#52ab3c',
    fontWeight: '600',
    marginTop: responsive.height(12),
  },
  checkboxContainer: {
    marginTop: responsive.height(5),
    paddingHorizontal: responsive.padding(5),
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: responsive.padding(20),
  },
});
