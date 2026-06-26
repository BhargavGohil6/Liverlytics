import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import CommonTextInput from '../../components/CommonTextInput';
import CommonButton from '../../components/CommonButton';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { verifyRegistrationOtp, resendRegistrationOtp } from './slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import responsive from '../../theme/responsive';

const VerifyRegistrationOtpScreen = ({ navigation, route }: any) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

  
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the OTP',
      });
      return;
    }

    if (otp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'OTP must be 6 digits',
      });
      return;
    }


    try {
      await dispatch(verifyRegistrationOtp({
        email: email || '',
        otp: otp.trim(),
      })).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'Verification Successful',
        text2: 'Your account has been verified successfully',
      });

      // Navigate to onboarding
      navigation.navigate('OnboardingSteps');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err || 'Failed to verify OTP',
      });
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email is missing. Please go back and try again.',
      });
      return;
    }

    try {
      setResendLoading(true);
      await dispatch(resendRegistrationOtp({ email })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A new verification code has been sent to your email.',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: err || 'Unable to resend OTP. Please try again.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Email</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="mail-unread-outline" size={60} color="#52ab3c" />
            </View>

            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We have sent a 6-digit verification code to your email
            </Text>


            {email && (
              <View style={styles.emailDisplay}>
                <Icon name="mail-outline" size={18} color="#6b7280" />
                <Text style={styles.emailText}>{email}</Text>
              </View>
            )}

            <View style={styles.form}>
              <TouchableOpacity 
                style={styles.otpContainer} 
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
              >
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      otp.length === index && styles.otpBoxActive,
                      otp.length > index && styles.otpBoxFilled,
                    ]}
                  >
                    <Text style={styles.otpText}>
                      {otp[index] || ''}
                    </Text>
                  </View>
                ))}
                <TextInput
                  ref={inputRef}
                  style={styles.hiddenInput}
                  value={otp}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/[^0-9]/g, '');
                    if (cleanText.length <= 6) {
                      setOtp(cleanText);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus={true}
                />
              </TouchableOpacity>




              <CommonButton
                title={loading ? 'Verifying...' : 'Verify OTP'}
                fontSize={18}
                onPress={handleVerifyOtp}
                disabled={loading}
                style={styles.submitButton}
              />

              <TouchableOpacity
                style={styles.resendContainer}
                onPress={handleResendOtp}
                disabled={resendLoading}
              >
                <Text style={styles.resendText}>
                  Didn't receive code?{' '}
                  <Text style={styles.resendLink}>
                    {resendLoading ? 'Resending...' : 'Resend'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: responsive.padding(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.height(30),
    marginTop: responsive.height(10),
  },
  backButton: {
    padding: responsive.padding(8),
    marginRight: responsive.width(10),
  },
  headerTitle: {
    fontSize: responsive.fontSize(20),
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: responsive.height(20),
    width: responsive.width(100),
    height: responsive.height(100),
    borderRadius: 50,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: responsive.height(10),
  },
  subtitle: {
    fontSize: responsive.fontSize(15),
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: responsive.height(20),
    lineHeight: 22,
  },
  emailDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: responsive.padding(12),
    borderRadius: 8,
    marginBottom: responsive.height(20),
    gap: responsive.width(10),
    justifyContent: 'center',
  },
  emailText: {
    fontSize: responsive.fontSize(14),
    color: '#374151',
    fontWeight: '500',
  },
  form: {
    gap: responsive.height(20),
  },
  submitButton: {
    marginTop: responsive.margin(10),
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: responsive.height(10),
  },
  resendText: {
    fontSize: responsive.fontSize(14),
    color: '#6b7280',
  },
  resendLink: {
    color: '#52ab3c',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: responsive.width(20),
    marginVertical: responsive.height(20),
  },
  otpBox: {
    width: responsive.width(45),
    height: responsive.width(45),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },

  otpBoxActive: {
    borderColor: '#52ab3c',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#52ab3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  otpBoxFilled: {
    borderColor: '#52ab3c',
    backgroundColor: '#fff',
  },
  otpText: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: '#1f2937',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
});


export default VerifyRegistrationOtpScreen;
