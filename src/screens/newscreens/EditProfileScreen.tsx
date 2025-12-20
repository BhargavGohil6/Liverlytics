// src/screens/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfileScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Update your personal information.</Text>

            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JS</Text>
              </View>
              <TouchableOpacity style={styles.changePhotoButton}>
                <Icon name="camera-outline" size={16} color="#52a64a" />
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="person-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    defaultValue="Jordan Smith"
                    placeholder="Enter full name"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <Icon name="mail-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    defaultValue="jordan.smith@example.com"
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <Icon name="call-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <TextInput
                    style={styles.input}
                    defaultValue="+1 (555) 987-2345"
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <Icon name="male-female-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <TouchableOpacity style={styles.selectInput}>
                    <Text style={styles.selectText}>Male</Text>
                    <Icon name="chevron-down" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputRow}>
                <Icon name="calendar-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TouchableOpacity style={styles.selectInput}>
                    <Text style={styles.selectText}>1968-04-12</Text>
                    <Icon name="chevron-down" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputRow}>
                <Icon name="location-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={styles.input}
                    defaultValue="Add home address"
                    placeholder="Enter address"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferences</Text>
            <Text style={styles.cardSubtitle}>Control alerts and account options.</Text>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Icon name="notifications-outline" size={20} color="#374151" />
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceLabel}>Notifications</Text>
                  <Text style={styles.preferenceSubtext}>
                    Enable reminders and important alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={notifications ? '#52a64a' : '#f3f4f6'}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Account Settings</Text>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="shield-checkmark-outline" size={20} color="#374151" />
                  <Text style={styles.settingText}>Login & Security</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={styles.settingSubtext}>Password and sign-in options</Text>
                  <Icon name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
              <Icon name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.notice}>
            Changes apply to all dashboards and alerts.{'\n'}
            Text size respects your system accessibility settings.
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6b7280',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52a64a',
  },
  inputGroup: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectText: {
    fontSize: 15,
    color: '#1f2937',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  preferenceSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  section: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52a64a',
    gap: 6,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  notice: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default EditProfileScreen;