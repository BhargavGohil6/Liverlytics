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
import { sendResetOtp } from './slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import responsive from '../../theme/responsive';

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address',
      });
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      return false;
    }

    return true;
  };

  const handleSendOtp = async () => {
    if (!validateEmail()) {
      return;
    }

    try {
      await dispatch(sendResetOtp({ email: email.trim() })).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please check your email for the OTP',
      });

      // Navigate to reset password screen with email
      navigation.navigate('ResetPasswordWithOtp', { email: email.trim() });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err || 'Failed to send OTP',
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
            <Text style={styles.headerTitle}>Forgot Password</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="lock-closed-outline" size={60} color="#52ab3c" />
            </View>

            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you an OTP to reset your password
            </Text>

            <View style={styles.form}>
              <CommonTextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                suffixText=""
              />

              <View style={styles.infoBox}>
                <Icon name="information-circle-outline" size={20} color="#6b7280" />
                <Text style={styles.infoText}>
                  Make sure to enter the email address associated with your account
                </Text>
              </View>

              <CommonButton
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                fontSize={18}
                onPress={handleSendOtp}
                disabled={loading}
              />
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
    marginBottom: responsive.height(30),
    lineHeight: 22,
  },
  form: {
    gap: responsive.height(20),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    padding: responsive.padding(12),
    borderRadius: 8,
    gap: responsive.width(10),
  },
  infoText: {
    flex: 1,
    fontSize: responsive.fontSize(13),
    color: '#6b7280',
    lineHeight: 18,
  },
});

export default ForgotPasswordScreen;
