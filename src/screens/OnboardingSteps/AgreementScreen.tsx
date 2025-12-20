import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import responsive from "../../theme/responsive";
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import CustomCheckbox from '../../components/CommonCheckbox';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
import {acceptMedical, acceptPrivacy, acceptTerms, completeOnboarding} from './slices/onboardingSlice';
import Toast from 'react-native-toast-message';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';




const AgreementScreen = () => {
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [medicalChecked, setMedicalChecked] = useState(false);

  const navigation = useNavigation();

 const dispatch = useDispatch();
const { privacyAccepted, termsAccepted, medicalAccepted } = useSelector(
  (state: RootState) => state.onboarding
);

const allAccepted = privacyAccepted && termsAccepted && medicalAccepted;

const handleNext = () => {
    if (allAccepted) {
      dispatch(completeOnboarding()); 
      navigation.navigate('NextScreenName'); 
    } else {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Agreement',
        text2: 'Please accept all terms, privacy policy, and medical disclaimer to continue.',
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

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
    backgroundColor: '#f9f9f9',
    borderRadius: responsive.width(12),
    padding: responsive.padding(20),
    marginBottom: responsive.height(15),
    borderWidth: 1,
    borderColor: '#eee',
    // width: wp('80%'),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.height(5),
  },
  icon: {
    marginRight: responsive.width(10),
  },
  cardTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    marginTop: responsive.height(5),
    // width:'90%',
  },
  cardLink: {
    fontSize: responsive.fontSize(14),
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: responsive.height(10),
  },
  checkboxContainer: {
    marginTop: responsive.height(10),
  },
  scrollContainer: {
    flex: 1,
    width: responsive.width(320),
    marginHorizontal: responsive.margin(20),
  },
});


