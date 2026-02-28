
// src/screens/ProfileMainScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../auth/slices/authSlice';
import { getUserProfile, getDailyHealthTargets } from './slices/profileSlice';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileSection from '../../components/profile/ProfileSection';

type ProfileMainScreenProps = {
  navigation: any;
};

const ProfileMainScreen: React.FC<ProfileMainScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [aiProcessing, setAiProcessing] = React.useState(true);
  
  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const { userProfile, dailyHealthTargets, loading, error } = useSelector((state: RootState) => state.profile);
  
  // Fetch user profile and daily health targets on component mount
  useEffect(() => {
    if (user?.email) {
      dispatch(getUserProfile({ user: user.email }) as any);
      dispatch(getDailyHealthTargets({ user: user.email }) as any);
    }
  }, [dispatch, user?.email]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading profile: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              if (user?.email) {
                dispatch(getUserProfile({ user: user.email }) as any);
              }
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get profile data or use defaults
  const fullName = userProfile?.full_name || 'User Name';
  const email = userProfile?.email || user?.email || '';
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Profile Header */}
          <ProfileHeader
            fullName={fullName}
            email={email}
            onEditPress={() => navigation.navigate('EditProfileScreen')}
          />

          {/* Health & Permissions Section */}
          <ProfileSection
            title="Health & Permissions"
            subtitle="Control what data the app can access."
          >
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('HealthDataAccessScreen')}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuLabel}>Health Data Access</Text>
                <Text style={styles.menuSubtext}>Status: Connected</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('WearableSyncScreen')}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuLabel}>Wearable Sync</Text>
                <Text style={styles.menuSubtext}>Health Connect, Smartwatch</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Text style={styles.menuLabel}>AI Processing Consent</Text>
                <Text style={styles.menuSubtext}>On-device, cloud processing opt-in</Text>
              </View>
              <Switch
                value={aiProcessing}
                onValueChange={setAiProcessing}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={aiProcessing ? '#52ab3c' : '#f3f4f6'}
              />
            </View>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('NotificationRemindersScreen')}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuLabel}>Notifications & Reminders</Text>
                <Text style={styles.menuSubtext}>Manage push alerts and reminder schedules</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {/* <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('AlertThresholdsScreen')}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuLabel}>Alert Thresholds</Text>
                <Text style={styles.menuSubtext}>Sodium, weight, heart rate, MELD delta</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity> */}
          </ProfileSection>

          {/* Your Targets Section */}
          <ProfileSection
            title="Your Targets"
            subtitle="Goals used for alerts and daily guidance."
          >
            {dailyHealthTargets && dailyHealthTargets.length > 0 ? (
              // Display actual health targets from API
              [
                { label: 'Daily Sodium Target', value: `${dailyHealthTargets[0].daily_sodium_limit} mg per day` },
                { label: 'Daily Fluid Limit', value: `${dailyHealthTargets[0].daily_fluid_limit} mL per day` },
                { label: 'Daily Protein Limit', value: `${dailyHealthTargets[0].daily_protein_limit} g per day` },
                { label: 'Weight Gain Alert Threshold', value: `+${dailyHealthTargets[0].weight_gain_alert_threshold} kg in 48 hours` },
                { label: 'Resting HR Alert Threshold', value: `≥ ${dailyHealthTargets[0].resting_hr_alert_threshold} bpm sustained` },
                { label: 'Sleep Goal', value: `${dailyHealthTargets[0].sleep_goal} hours per night` },
              ].map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.targetItem}
                  onPress={() => navigation.navigate('EditHealthTargetsScreen')}
                >
                  <View style={styles.targetInfo}>
                    <Text style={styles.targetLabel}>{item.label}</Text>
                    <Text style={styles.targetValue}>{item.value}</Text>
                  </View>
                  <Icon name="create-outline" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))
            ) : (
              // Show zero values if no targets are available
              [
                { label: 'Daily Sodium Target', value: '0 mg per day' },
                { label: 'Daily Fluid Limit', value: '0 mL per day' },
                { label: 'Daily Protein Limit', value: '0 g per day' },
                { label: 'Weight Gain Alert Threshold', value: '+0 kg in 48 hours' },
                { label: 'Resting HR Alert Threshold', value: '≥ 0 bpm sustained' },
                { label: 'Sleep Goal', value: '0 hours per night' },
              ].map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.targetItem}
                  onPress={() => navigation.navigate('EditHealthTargetsScreen')}
                >
                  <View style={styles.targetInfo}>
                    <Text style={styles.targetLabel}>{item.label}</Text>
                    <Text style={styles.targetValue}>{item.value}</Text>
                  </View>
                  <Icon name="create-outline" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))
            )}
          </ProfileSection>
          
          {/* App & Medical Information Section */}
          <ProfileSection
            title="App & Medical Information"
            subtitle="Learn how this companion supports your care."
          >
            {[
              { 
                label: 'Medical Disclaimer', 
                subtitle: 'This app does not replace professional care.',
                screen: 'MedicalDisclaimerScreen'
              },
              { 
                label: 'Privacy Policy', 
                subtitle: 'How your data is collected and stored.',
                screen: 'PrivacyPolicy'
              },
              { 
                label: 'Terms & Conditions', 
                subtitle: 'Legal terms for using Cirrhosis Companion.',
                screen: 'TermsofUse'
              },
              { 
                label: 'Data Usage & Security', 
                subtitle: 'Encryption, retention, and access controls.',
                screen: 'DataUsageSecurityScreen'
              },
              { 
                label: 'AI Transparency Statement', 
                subtitle: 'What AI analyzes on-device and how it is used.',
                screen: 'AITransparencyScreen'
              },
            ].map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.infoItem}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </ProfileSection>
          
          {/* Manage Account Section */}
          <ProfileSection
            title="Manage Account"
            // subtitle="Security, backups, and account actions."
          >
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Icon name="key-outline" size={20} color="#374151" />
              <Text style={styles.accountLabel}>Change Password</Text>
            </TouchableOpacity>
          
            {/* <TouchableOpacity style={styles.accountItem}>
              <Icon name="cloud-upload-outline" size={20} color="#374151" />
              <Text style={styles.accountLabel}>Backup & Export Data</Text>
            </TouchableOpacity>
           */}
            {/* <TouchableOpacity style={styles.accountItem}>
              <Icon name="trash-outline" size={20} color="#374151" />
              <Text style={styles.accountLabel}>Clear Local Data</Text>
            </TouchableOpacity> */}
          
            <TouchableOpacity 
              style={[styles.accountItem, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <Icon name="log-out-outline" size={20} color="#ef4444" />
              <Text style={[styles.accountLabel, { color: '#ef4444' }]}>Logout</Text>
            </TouchableOpacity>
          </ProfileSection>
        

          {/* Footer */}
          <Text style={styles.footer}>
            Cirrhosis Companion v1.0.0{'\n'}
            Text size adapts to your system accessibility settings.
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
  content: {
    padding: 16,
  },
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#52ab3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuLeft: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  targetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  targetInfo: {
    flex: 1,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  targetValue: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLeft: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  accountLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  footer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#52ab3c',
    fontWeight: '600',
  },
});

export default ProfileMainScreen;