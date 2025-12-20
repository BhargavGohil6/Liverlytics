import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {colors,font} from '../../theme/index';
import responsive from '../../theme/responsive';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';




const ToggleItem = ({ icon, title, subtitle, value, onToggle }) => (
  <View style={styles.toggleItem}>
    <Icon name={icon} size={responsive.fontSize(24)} color={colors.gray666} />
    <View style={styles.toggleContent}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Text style={styles.toggleSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.gray200, true: colors.emerald }}
      thumbColor={value ? colors.primary : colors.white}
    />
  </View>
);

const ConsentItem = ({ color, title, description }) => (
  <View style={styles.consentItem}>
    <View style={[styles.consentDot, { backgroundColor: color }]} />
    <View style={styles.consentContent}>
      <Text style={styles.consentTitle}>{title}</Text>
      <Text style={styles.consentDescription}>{description}</Text>
    </View>
  </View>
);

const HealthAccessScreen = () => {
  const navigation = useNavigation();
  const [toggles, setToggles] = useState({
    steps: true,
    restingHeartRate: true,
    activeHeartRate: true,
    sleepDuration: true,
    calories: false,
  });

  const handleToggle = key => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} >
        

        {/* Main Title */}
        <Text style={styles.mainTitle}>Allow Health Data Access</Text>
        <Text style={styles.description}>
          We use your health data to personalize your trends and alerts. Access is read-only and never modifies your data.
        </Text>

        {/* Why Sync Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="information-circle-outline" size={responsive.fontSize(20)} color={colors.gray666} />
            <Text style={styles.sectionTitle}>Why Sync Exercise Data?</Text>
          </View>

          <View style={styles.benefitsList}>
            {[
              'Auto-sync daily steps',
              'Fetch resting heart rate',
              'Read sleep duration',
              'Improve AI safety checks',
              'Reduce manual entries',
            ].map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <Icon name="checkmark" size={responsive.fontSize(18)} color={colors.primary} />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.note}>
            Note: Liverlytics only reads your data — it never writes or modifies anything.
          </Text>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="shield-checkmark-outline" size={responsive.fontSize(20)} color={colors.gray666} />
            <Text style={styles.sectionTitle}>Data Liverlytics Will Read (Read-Only)</Text>
          </View>

          {/* Toggle Items */}
          <View style={styles.toggleList}>
            <ToggleItem
              icon="footsteps"
              title="Steps (movement)"
              subtitle="Daily step count"
              value={toggles.steps}
              onToggle={() => handleToggle('steps')}
            />
            <ToggleItem
              icon="heart-outline"
              title="Resting Heart Rate"
              subtitle="Lowest daily bpm"
              value={toggles.restingHeartRate}
              onToggle={() => handleToggle('restingHeartRate')}
            />
            <ToggleItem
              icon="pulse"
              title="Active Heart Rate"
              subtitle="Workout avg bpm"
              value={toggles.activeHeartRate}
              onToggle={() => handleToggle('activeHeartRate')}
            />
            <ToggleItem
              icon="bed-outline"
              title="Sleep Duration"
              subtitle="Total sleep time"
              value={toggles.sleepDuration}
              onToggle={() => handleToggle('sleepDuration')}
            />
            <ToggleItem
              icon="flame-outline"
              title="Calories / Active Energy"
              subtitle="Optional"
              value={toggles.calories}
              onToggle={() => handleToggle('calories')}
            />
          </View>

          <Text style={styles.optionalNote}>
            Blood pressure & SpO₂ syncing are optional depending on the user's device.
          </Text>
        </View>

        {/* Supported Wearables */}
      
        {/* Required Consents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="assignment" size={responsive.fontSize(20)} color={colors.gray666} />
            <Text style={styles.sectionTitle}>Required Consents</Text>
          </View>

          <View style={styles.consentsList}>
            <ConsentItem
              color={colors.primary}
              title="Health Data Access (Read-only)"
              description="Used only to read data from HealthKit/Health Connect"
            />
            <ConsentItem
              color={colors.primary}
              title="Local-first storage"
              description="Data stays on device unless you enable backup/sync"
            />
            <ConsentItem
              color={colors.primary}
              title="AI Processing Consent"
              description="On-device by default, cloud only if you opt in"
            />
          </View>
        </View>

        {/* Manual Tracking Option */}
        <View style={styles.manualSection}>
          <View style={styles.manualHeader}>
            <MaterialIcon name="edit" size={responsive.fontSize(20)} color={colors.gray666} />
            <Text style={styles.manualTitle}>Prefer Manual Tracking?</Text>
          </View>
          <View style={styles.manualButtons}>
            <TouchableOpacity style={styles.manualButton}>
              <Text style={styles.manualButtonText}>Enter Steps Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip Sync For Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.manualNote}>
            Either option enables the Continue button.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('HealthSyncErrorScreen')}>
          <Icon name="link" size={responsive.fontSize(18)} color={colors.white} />
          <Text style={styles.primaryButtonText}>Enable Health Sync</Text>
        </TouchableOpacity>
       
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: wp('100%'),
    // width: responsive.width(320),
    flex: 1,
    backgroundColor: colors.gray100,
    marginHorizontal: responsive.margin(16),
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: responsive.padding(4),
  },
  headerTitle: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.darkGray,
  },
  placeholder: {
    width: responsive.width(36),
  },
  progressContainer: {
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(16),
    backgroundColor: colors.white,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(8),
  },
  logo: {
    width: responsive.width(32),
    height: responsive.height(32),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsive.margin(8),
  },
  brandName: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
  },
  stepText: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  mainTitle: {
    fontSize: font.h5,
    fontWeight: '700',
    color: colors.darkGray,
    paddingHorizontal: responsive.padding(16),
    marginTop: responsive.margin(16),
    marginBottom: responsive.margin(8),
  },
  description: {
    fontSize: font.base,
    color: colors.gray666,
    lineHeight: responsive.height(20),
    paddingHorizontal: responsive.padding(16),
    marginBottom: responsive.margin(16),
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: responsive.margin(16),
    marginBottom: responsive.margin(16),
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  sectionTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginLeft: responsive.margin(8),
  },
  benefitsList: {
    marginTop: responsive.margin(8),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
  },
  benefitText: {
    fontSize: font.base,
    color: colors.darkGray,
    marginLeft: responsive.margin(10),
  },
  note: {
    fontSize: font.sm,
    color: colors.gray999,
    marginTop: responsive.margin(12),
    fontStyle: 'italic',
  },
  toggleList: {
    marginTop: responsive.margin(8),
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsive.padding(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayEFEF,
  },
  toggleContent: {
    flex: 1,
    marginLeft: responsive.margin(12),
  },
  toggleTitle: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(2),
  },
  toggleSubtitle: {
    fontSize: font.sm,
    color: colors.gray999,
  },
  optionalNote: {
    fontSize: font.sm,
    color: colors.gray666,
    marginTop: responsive.margin(12),
  },
  wearablesList: {
    marginTop: responsive.margin(8),
  },
  wearableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsive.padding(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayEFEF,
  },
  wearableInfo: {
    flex: 1,
    marginLeft: responsive.margin(12),
  },
  wearableName: {
    fontSize: font.base,
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: responsive.margin(2),
  },
  wearableVia: {
    fontSize: font.sm,
    color: colors.gray999,
  },
  consentsList: {
    marginTop: responsive.margin(8),
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsive.margin(12),
  },
  consentDot: {
    width: responsive.width(8),
    height: responsive.height(8),
    borderRadius: responsive.borderRadius(4),
    marginTop: responsive.margin(6),
    marginRight: responsive.margin(10),
  },
  consentContent: {
    flex: 1,
  },
  consentTitle: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(2),
  },
  consentDescription: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  manualSection: {
    backgroundColor: colors.white,
    marginHorizontal: responsive.margin(16),
    marginBottom: responsive.margin(16),
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  manualTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginLeft: responsive.margin(8),
  },
  manualButtons: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(8),
  },
  manualButton: {
    flex: 1,
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  skipButton: {
    flex: 1,
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.gray666,
  },
  manualNote: {
    fontSize: font.xs,
    color: colors.gray999,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: responsive.margin(16),
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(12),
  },
  primaryButtonText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.white,
    marginLeft: responsive.margin(8),
  },
  secondaryButton: {
    backgroundColor: colors.white,
    marginHorizontal: responsive.margin(16),
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: responsive.margin(12),
  },
  secondaryButtonText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
  },
  footerNote: {
    fontSize: font.xs,
    color: colors.gray999,
    textAlign: 'center',
    paddingHorizontal: responsive.padding(16),
    marginBottom: responsive.margin(20),
    lineHeight: responsive.height(16),
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingVertical: responsive.padding(10),
    paddingBottom: responsive.padding(20),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: font.xs,
    color: colors.gray999,
    marginTop: responsive.margin(4),
  },
});

export default HealthAccessScreen;