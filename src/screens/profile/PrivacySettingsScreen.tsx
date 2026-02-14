import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileSection from '../../components/profile/ProfileSection';

type PrivacySettingsScreenProps = {
  navigation: any;
};

const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ navigation }) => {
  const [healthDataAccess, setHealthDataAccess] = useState(true);
  const [locationAccess, setLocationAccess] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [adPersonalization, setAdPersonalization] = useState(false);

  const privacyOptions = [
    {
      title: 'Health Data Access',
      description: 'Allow app to access health data from connected devices',
      value: healthDataAccess,
      onValueChange: setHealthDataAccess,
      icon: 'heart',
    },
    {
      title: 'Location Access',
      description: 'Allow app to access your location for local healthcare services',
      value: locationAccess,
      onValueChange: setLocationAccess,
      icon: 'location',
    },
    {
      title: 'Push Notifications',
      description: 'Receive important health alerts and reminders',
      value: notifications,
      onValueChange: setNotifications,
      icon: 'notifications',
    },
    {
      title: 'Data Sharing',
      description: 'Share anonymized data for research purposes',
      value: dataSharing,
      onValueChange: setDataSharing,
      icon: 'share',
    },
    {
      title: 'Analytics',
      description: 'Help improve app by sending usage analytics',
      value: analytics,
      onValueChange: setAnalytics,
      icon: 'bar-chart',
    },
    {
      title: 'Ad Personalization',
      description: 'Allow personalized advertising based on your usage',
      value: adPersonalization,
      onValueChange: setAdPersonalization,
      icon: 'megaphone',
    },
  ];

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will create a file containing all your personal data. This may take a few minutes.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          onPress: () => {
            // TODO: Implement data export functionality
            console.log('Exporting user data');
            Alert.alert('Success', 'Data export started. You will receive a notification when complete.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion functionality
            console.log('Deleting user account');
            Alert.alert('Success', 'Account deletion request submitted. You will receive an email confirmation.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Settings</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Manage your privacy preferences and control how your data is used.
        </Text>

        <ProfileSection
          title="Data Permissions"
          subtitle="Control what data the app can access"
        >
          {privacyOptions.map((option, index) => (
            <View 
              key={index} 
              style={[styles.optionRow, index === privacyOptions.length - 1 && styles.lastOption]}
            >
              <View style={styles.optionInfo}>
                <View style={styles.optionHeader}>
                  <Icon name={option.icon} size={20} color="#374151" />
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Switch
                value={option.value}
                onValueChange={option.onValueChange}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={option.value ? '#52ab3c' : '#f3f4f6'}
              />
            </View>
          ))}
        </ProfileSection>

        <ProfileSection
          title="Data Management"
          subtitle="Control your personal data"
        >
          <TouchableOpacity style={styles.actionRow} onPress={handleExportData}>
            <View style={styles.actionInfo}>
              <Icon name="download" size={20} color="#374151" />
              <View>
                <Text style={styles.actionTitle}>Export My Data</Text>
                <Text style={styles.actionDescription}>Get a copy of all your personal information</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionRow, styles.lastOption]} 
            onPress={handleDeleteAccount}
          >
            <View style={styles.actionInfo}>
              <Icon name="trash" size={20} color="#ef4444" />
              <View>
                <Text style={[styles.actionTitle, { color: '#ef4444' }]}>Delete Account</Text>
                <Text style={styles.actionDescription}>Permanently delete your account and data</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </ProfileSection>

        <ProfileSection
          title="Privacy Policy"
          subtitle="Learn about our data practices"
        >
          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoTitle}>Privacy Policy</Text>
              <Text style={styles.infoDescription}>How we collect, use, and protect your data</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.infoRow, styles.lastOption]}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoTitle}>Terms of Service</Text>
              <Text style={styles.infoDescription}>Legal terms for using Liverlytics</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </ProfileSection>

        <Text style={styles.footer}>
          Last updated: January 15, 2024{'\n'}
          Version: 1.0.0
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLeft: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  footer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default PrivacySettingsScreen;