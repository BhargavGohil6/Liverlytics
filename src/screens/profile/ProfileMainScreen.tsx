
// src/screens/ProfileMainScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  Activity, 
  Plus, 
  TestTube, 
  Utensils, 
  FileText, 
  Flag, 
  Heart, 
  Scale, 
  Droplet, 
  TrendingUp,
  Pill,
  Sparkles,
  Home,
  BarChart3,
  Bell,
  User,
  History,
  ChevronRight,
  SpaceIcon
} from 'lucide-react-native';

const ProfileMainScreen = ({ navigation }) => {
  const [aiProcessing, setAiProcessing] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        {/* Title */}
        {/* <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View> */}

        <View style={styles.content}>
          {/* Your Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Your Details</Text>
                <Text style={styles.sectionSubtitle}>
                  Manage your personal and medical profile.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfileScreen')}
              >
                <Icon name="create-outline" size={16} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>CC</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Jordan Smith</Text>
                <Text style={styles.profileDetails}>Age 57 • Male</Text>
                <Text style={styles.profileDetails}>Medical ID: 241-8193-CC</Text>
              </View>
              <TouchableOpacity>
                <Icon name="create-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Health & Permissions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health & Permissions</Text>
            <Text style={styles.sectionSubtitle}>Control what data the app can access.</Text>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Health Data Access</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>Status: Connected</Text>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Wearable Sync</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>Health Connect, Smartwatch</Text>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <View style={styles.menuItem}>
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

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Notifications & Reminders</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>Manage push alerts and reminder schedules</Text>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Alert Thresholds</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>Sodium, weight, heart rate, MELD delta</Text>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Your Targets */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Targets</Text>
            <Text style={styles.sectionSubtitle}>
              Goals used for alerts and daily guidance.
            </Text>

            {[
              { label: 'Daily Sodium Target', value: '2,000 mg per day' },
              { label: 'Daily Fluid Limit', value: '1,800 mL per day' },
              { label: 'Weight Gain Alert Threshold', value: '+2.0 kg in 48 hours' },
              { label: 'Resting HR Alert Threshold', value: '≥ 90 bpm sustained' },
              { label: 'Sleep Goal', value: '7.5 hours per night' },
            ].map((item, index) => (
              <View key={index} style={styles.targetItem}>
                <View style={styles.targetInfo}>
                  <Text style={styles.targetLabel}>{item.label}</Text>
                  <Text style={styles.targetValue}>{item.value}</Text>
                </View>
                <Icon name="create-outline" size={20} color="#9ca3af" />
              </View>
            ))}
          </View>

          {/* App & Medical Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App & Medical Information</Text>
            <Text style={styles.sectionSubtitle}>
              Learn how this companion supports your care.
            </Text>

            {[
              { label: 'Medical Disclaimer', subtitle: 'This app does not replace professional care.' },
              { label: 'Privacy Policy', subtitle: 'How your data is collected and stored.' },
              { label: 'Terms & Conditions', subtitle: 'Legal terms for using Cirrhosis Companion.' },
              { label: 'Data Usage & Security', subtitle: 'Encryption, retention, and access controls.' },
              { label: 'AI Transparency Statement', subtitle: 'What AI analyzes on-device and how it is used.' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Manage Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Account</Text>
            <Text style={styles.sectionSubtitle}>Security, backups, and account actions.</Text>

            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate('ResetPassword')}
            >
              <Icon name="key-outline" size={20} color="#374151" />
              <Text style={styles.accountLabel}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountItem}>
              <Icon name="cloud-upload-outline" size={20} color="#374151" />
              <Text style={styles.accountLabel}>Backup & Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountItem}>
              <Icon name="trash-outline" size={20} color="#374151" />
              <Text style={styles.accountLabel}>Clear Local Data</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Cirrhosis Companion v1.0.0{'\n'}
            Text size adapts to your system accessibility settings.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('ReportsMainScreen')}>
          <BarChart3 size={24} color="#999" />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('RemindersAlertsScreen')}>
          <Bell size={24} color="#999" />
          <Text style={styles.navText}>Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('ProfileMainScreen')}>
          <User size={24} color="#52ab3c" />
          <Text style={[styles.navText, styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#52ab3c',
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
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  menuValue: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'right',
    maxWidth: 200,
  },
  menuLeft: {
    flex: 1,
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