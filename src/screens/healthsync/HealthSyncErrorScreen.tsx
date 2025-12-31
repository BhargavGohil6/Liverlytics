import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const scaleSize = size => (width / BASE_WIDTH) * size;
const verticalScaleSize = size => (height / BASE_HEIGHT) * size;
const responsiveFontSize = size => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};

const responsive = {
  width: size => scaleSize(size),
  height: size => verticalScaleSize(size),
  fontSize: size => responsiveFontSize(size),
  margin: size => scaleSize(size),
  padding: size => scaleSize(size),
  borderRadius: size => scaleSize(size),
};

const HealthSyncErrorScreen = () => {

    const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <MaterialCommunityIcon name="leaf" size={responsive.fontSize(28)} color="#FFF" />
            </View>
            <Text style={styles.brandName}>Liverlytics</Text>
          </View>
        </View> */}

        {/* Title Section */}
        <View style={styles.titleSection}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color="#333" />
            {/* <Text style={styles.backText}>Back</Text> */}
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Health Sync Not Enabled</Text>
          <Text style={styles.subtitle}>
            We need your permission to sync steps, sleep, and heart rate.
          </Text>
        </View>

        {/* Error Card */}
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Icon name="warning" size={responsive.fontSize(20)} color="#FFF" />
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

          <View style={[styles.tag, styles.warningTag]}>
            <Text style={styles.tagText}>Wearable not syncing</Text>
          </View>

          <View style={styles.errorContent}>
            <Text style={styles.errorSectionTitle}>iOS / Apple HealthKit:</Text>
            <Text style={styles.errorText}>
              Liverlytics does not have access to your Health data.
            </Text>

            <Text style={styles.errorText} style={[styles.errorText, styles.marginTop]}>
              To sync steps, heart rate, and sleep, please enable Health permissions.
            </Text>

            <Text style={[styles.errorSectionTitle, styles.marginTop]}>
              Android / Health Connect:
            </Text>
            <Text style={styles.errorText}>
              Health Connect permissions were denied.
            </Text>

            <Text style={[styles.errorText, styles.marginTop]}>
              Steps, heart rate, and sleep cannot be synced until permissions are granted.
            </Text>

            <Text style={[styles.errorSectionTitle, styles.marginTop]}>
              If a smartwatch is selected but not syncing:
            </Text>
            <Text style={styles.errorText}>
              We couldn't connect with your wearable. Please ensure the watch is paired with HealthKit/Health Connect.
            </Text>
          </View>
        </View>

        {/* How to Fix Section */}
        <View style={styles.fixSection}>
          <View style={styles.fixHeader}>
            <MaterialIcon name="build" size={responsive.fontSize(20)} color="#333" />
            <Text style={styles.fixTitle}>How to Fix</Text>
          </View>

          {/* iOS Instructions */}
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Icon name="logo-apple" size={responsive.fontSize(22)} color="#333" />
              <Text style={styles.instructionTitle}>iOS (Apple Health)</Text>
            </View>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>Open the Apple Health app</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>
                  Go to: Settings → Apps → Liverlytics
                </Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>
                  Enable: Steps; Heart Rate (active + resting); Sleep; Weight (optional)
                </Text>
              </View>
            </View>
          </View>

          {/* Android Instructions */}
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Icon name="logo-android" size={responsive.fontSize(22)} color="#333" />
              <Text style={styles.instructionTitle}>Android (Health Connect)</Text>
            </View>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>Open the Health Connect app</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>Go to: Permissions</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>
                  Allow Liverlytics to read: Steps; Heart Rate; Sleep; Weight (optional)
                </Text>
              </View>
            </View>
          </View>

          {/* Wearables Instructions */}
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Icon name="watch-outline" size={responsive.fontSize(22)} color="#333" />
              <Text style={styles.instructionTitle}>Wearables (if selected)</Text>
            </View>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>Ensure device is paired correctly</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>
                  Sync device to HealthKit/Health Connect
                </Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.stepText}>
                  Ensure permissions are enabled for the watch app
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.retryButton} onPress={()=>navigation.navigate('SyncCompleteScreen')}>
          <Icon name="refresh" size={responsive.fontSize(20)} color="#FFF" />
          <Text style={styles.retryButtonText}>Retry Health Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.manualButton}>
          <Text style={styles.manualButtonText}>Use Manual Tracking Instead</Text>
        </TouchableOpacity>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Liverlytics only reads health data; it never writes or modifies anything.
          </Text>
          <Text style={styles.footerText}>
            Your data stays on your device unless you enable sync/export.
          </Text>
        </View>

        {/* Trouble Link */}
        <TouchableOpacity style={styles.troubleLink}>
          <Text style={styles.troubleLinkText}>
            Still Having Trouble Connecting Your Smartwatch?
          </Text>
        </TouchableOpacity>

      
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(16),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: responsive.width(40),
    height: responsive.height(40),
    borderRadius: responsive.borderRadius(10),
    backgroundColor: '#52ab3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsive.margin(10),
  },
  brandName: {
    fontSize: responsive.fontSize(22),
    fontWeight: '700',
    color: '#333',
  },
  titleSection: {
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(20),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  backText: {
    fontSize: responsive.fontSize(16),
    color: '#333',
    marginLeft: responsive.margin(8),
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: '#333',
    marginBottom: responsive.margin(8),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    lineHeight: responsive.height(20),
  },
  errorCard: {
    backgroundColor: '#E57373',
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(20),
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  errorTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
    color: '#FFF',
    marginLeft: responsive.margin(8),
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsive.width(8),
    marginBottom: responsive.margin(12),
  },
  tag: {
    backgroundColor: '#FFF',
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    borderRadius: responsive.borderRadius(16),
  },
  warningTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: responsive.margin(16),
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
    color: '#D32F2F',
  },
  errorContent: {
    marginTop: responsive.margin(8),
  },
  errorSectionTitle: {
    fontSize: responsive.fontSize(14),
    fontWeight: '700',
    color: '#FFF',
    marginBottom: responsive.margin(4),
  },
  errorText: {
    fontSize: responsive.fontSize(13),
    color: '#FFF',
    lineHeight: responsive.height(18),
  },
  marginTop: {
    marginTop: responsive.margin(12),
  },
  fixSection: {
    marginTop: responsive.margin(20),
    paddingHorizontal: responsive.padding(16),
  },
  fixHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  fixTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
    color: '#333',
    marginLeft: responsive.margin(8),
  },
  instructionCard: {
    backgroundColor: '#FFF',
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  instructionTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#333',
    marginLeft: responsive.margin(10),
  },
  stepsList: {
    paddingLeft: responsive.padding(8),
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsive.margin(10),
  },
  bulletDot: {
    width: responsive.width(6),
    height: responsive.height(6),
    borderRadius: responsive.borderRadius(3),
    backgroundColor: '#666',
    marginTop: responsive.margin(6),
    marginRight: responsive.margin(10),
  },
  stepText: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#333',
    lineHeight: responsive.height(20),
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52ab3c',
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(24),
    paddingVertical: responsive.padding(16),
    borderRadius: responsive.borderRadius(10),
    shadowColor: '#52ab3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#FFF',
    marginLeft: responsive.margin(8),
  },
  manualButton: {
    backgroundColor: '#FFF',
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(12),
    paddingVertical: responsive.padding(16),
    borderRadius: responsive.borderRadius(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  manualButtonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#333',
  },
  footerInfo: {
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(24),
    paddingHorizontal: responsive.padding(16),
  },
  footerText: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    textAlign: 'center',
    lineHeight: responsive.height(18),
    marginBottom: responsive.margin(4),
  },
  troubleLink: {
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(20),
    marginBottom: responsive.margin(32),
    alignItems: 'center',
  },
  troubleLinkText: {
    fontSize: responsive.fontSize(14),
    color: '#333',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: responsive.padding(12),
    paddingBottom: responsive.padding(24),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: responsive.fontSize(11),
    color: '#999',
    marginTop: responsive.margin(4),
  },
});

export default HealthSyncErrorScreen;