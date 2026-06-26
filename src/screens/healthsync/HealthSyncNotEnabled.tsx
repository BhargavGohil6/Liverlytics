import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HealthSyncNotEnabled() {
     const navigation = useNavigation();
     const goBack = () => {
       navigation.goBack();
     };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="activity" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
      </View> */}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button & Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-left" size={20} color="#1F2937" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Health Sync Not Enabled</Text>
            <Text style={styles.subtitle}>
              We need your permission to sync steps, sleep, and heart rate.
            </Text>
          </View>
        </View>

        {/* Error Card */}
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Icon name="alert-triangle" size={20} color="#FFFFFF" />
            <Text style={styles.errorTitle}>Sync Permissions Denied</Text>
          </View>

          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>iOS / Apple HealthKit</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Android / Health Connect</Text>
            </View>
          </View>

          <View style={styles.tagSingle}>
            <Text style={styles.tagText}>Wearable not syncing</Text>
          </View>

          <View style={styles.errorContent}>
            <Text style={styles.errorSection}>iOS / Apple HealthKit:</Text>
            <Text style={styles.errorText}>
              Liverlytics does not have access to your Health data.
            </Text>

            <Text style={styles.errorText}>
              To sync steps, heart rate, and sleep, please enable Health permissions.
            </Text>

            <Text style={styles.errorSection}>Android / Health Connect:</Text>
            <Text style={styles.errorText}>
              Health Connect permissions were denied.
            </Text>

            <Text style={styles.errorText}>
              Steps, heart rate, and sleep cannot be synced until permissions are granted.
            </Text>

            <Text style={styles.errorSection}>If a smartwatch is selected but not syncing:</Text>
            <Text style={styles.errorText}>
              We couldn't connect with your wearable. Please ensure the watch is paired with HealthKit/Health Connect.
            </Text>
          </View>
        </View>

        {/* How to Fix Section */}
        <View style={styles.fixSection}>
          <View style={styles.fixHeader}>
            <Icon name="list" size={20} color="#1F2937" />
            <Text style={styles.fixTitle}>How to Fix</Text>
          </View>

          {/* iOS Instructions */}
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <MaterialIcon name="apple" size={20} color="#1F2937" />
              <Text style={styles.instructionTitle}>iOS (Apple Health)</Text>
            </View>
            <View style={styles.stepList}>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>Open the Apple Health app</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>
                  Go to: Settings → Apps → Liverlytics
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>
                  Enable: Steps; Heart Rate (active or resting); Sleep; Weight (optional)
                </Text>
              </View>
            </View>
          </View>

          {/* Android Instructions */}
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <MaterialIcon name="android" size={20} color="#1F2937" />
              <Text style={styles.instructionTitle}>Android (Health Connect)</Text>
            </View>
            <View style={styles.stepList}>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>Open the Health Connect app</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>Go to: Permissions</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>
                  Allow Liverlytics to read: Steps; Heart Rate; Sleep; Weight (optional)
                </Text>
              </View>
            </View>
          </View>

          {/* Wearables Instructions */}
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Icon name="watch" size={20} color="#1F2937" />
              <Text style={styles.instructionTitle}>Wearables (if selected)</Text>
            </View>
            <View style={styles.stepList}>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>
                  Ensure device is paired correctly
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>
                  Sync device to HealthKit/Health Connect
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.bullet} />
                <Text style={styles.stepText}>
                  Ensure permissions are enabled for the watch app
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.retryButton}>
            <Icon name="refresh-cw" size={18} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry Health Sync</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.manualButton}>
            <Text style={styles.manualButtonText}>Use Manual Tracking Instead</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Notes */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Liverlytics only reads health data; it never writes or modifies anything.
          </Text>
          <Text style={styles.footerText}>
            Your data stays on your device unless you enable sync/export.
          </Text>
          <TouchableOpacity style={styles.troubleLink}>
            <Text style={styles.troubleText}>
              Still Having Trouble Connecting Your Smartwatch?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bar-chart-2" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bell" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="user" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
    fontWeight: '500',
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  errorCard: {
    marginHorizontal: 16,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagSingle: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  errorContent: {
    marginTop: 4,
  },
  errorSection: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 8,
  },
  fixSection: {
    paddingHorizontal: 16,
  },
  fixHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fixTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  instructionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  stepList: {
    marginLeft: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B7280',
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  manualButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  troubleLink: {
    marginTop: 8,
  },
  troubleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
});