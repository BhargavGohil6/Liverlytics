// src/screens/profile/ChangePasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonTextInput from '../../components/CommonTextInput';
import CommonButton from '../../components/CommonButton';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../screens/auth/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store';

const ChangePasswordScreen = ({ navigation }: { navigation: any }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);


  const validateForm = () => {
    if (!oldPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your current password',
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

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New password must be at least 6 characters',
      });
      return false;
    }

    if (newPassword === oldPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New password must be different from current password',
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New passwords do not match',
      });
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await dispatch(
        changePassword({
          old_password: oldPassword,
          new_password: newPassword,
          reenter_new_password: confirmPassword
        })
      ).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password changed successfully',
      });
      
      // Clear form and go back
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.goBack();
      
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Failed to change password',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="lock-closed" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Update Your Password</Text>
            <Text style={styles.cardSubtitle}>
              Enter your current password and choose a new one to secure your account.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <CommonTextInput
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <CommonTextInput
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />
                <Text style={styles.helperText}>
                  Must be at least 6 characters long
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <CommonTextInput
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <View style={styles.securityInfo}>
              <Icon name="shield-checkmark-outline" size={20} color="#10b981" />
              <Text style={styles.securityText}>
                Your password is encrypted and securely stored
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <CommonButton
              title={loading ? "Updating..." : "Update Password"}
              onPress={handleChangePassword}
              disabled={loading}
              style={styles.updateButton}
            />
          </View>

          <Text style={styles.notice}>
            Make sure to choose a strong password that you haven't used before.{'\n'}
            Consider using a mix of letters, numbers, and symbols.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#52a64a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  updateButton: {
    flex: 1,
  },
  notice: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ChangePasswordScreen;