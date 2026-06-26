import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonTextInput from '../../components/CommonTextInput';
import CommonButton from '../../components/CommonButton';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordWithOtp } from './slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import responsive from '../../theme/responsive';

const ResetPasswordWithOtpScreen = ({ navigation, route }: any) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    if (!otp.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the OTP',
      });
      return false;
    }

    if (otp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'OTP must be 6 digits',
      });
      return false;
    }

    if (!newPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a new password',
      });
      return false;
    }

    if (!confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please confirm your new password',
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(resetPasswordWithOtp({
        email: email || '',
        otp: otp.trim(),
        new_password: newPassword,
      })).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'Password Reset Successful',
        text2: 'Your password has been reset successfully',
      });

      // Navigate back to login screen
      navigation.navigate('Login');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err || 'Failed to reset password',
      });
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
            <Text style={styles.headerTitle}>Reset Password</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="key-outline" size={60} color="#52ab3c" />
            </View>

            <Text style={styles.title}>Enter OTP & New Password</Text>
            <Text style={styles.subtitle}>
              Enter the OTP sent to your email and set a new password
            </Text>

            {email && (
              <View style={styles.emailDisplay}>
                <Icon name="mail-outline" size={18} color="#6b7280" />
                <Text style={styles.emailText}>{email}</Text>
              </View>
            )}

            <View style={styles.form}>
              <CommonTextInput
                label="OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                suffixText=""
              />

              <CommonTextInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <CommonTextInput
                label="Confirm Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <CommonButton
                title={loading ? 'Resetting Password...' : 'Reset Password'}
                fontSize={18}
                onPress={handleResetPassword}
                disabled={loading}
              />

              <TouchableOpacity
                style={styles.resendContainer}
                onPress={() => {
                  // Navigate back to forgot password to resend OTP
                  navigation.goBack();
                }}
              >
                <Text style={styles.resendText}>
                  Didn't receive OTP?{' '}
                  <Text style={styles.resendLink}>Resend</Text>
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
  },
  emailText: {
    fontSize: responsive.fontSize(14),
    color: '#374151',
    fontWeight: '500',
  },
  form: {
    gap: responsive.height(20),
  },
  passwordRequirements: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: responsive.padding(10),
    borderRadius: 6,
    gap: responsive.width(8),
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  requirementText: {
    fontSize: responsive.fontSize(13),
    color: '#166534',
    flex: 1,
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
});

export default ResetPasswordWithOtpScreen;
