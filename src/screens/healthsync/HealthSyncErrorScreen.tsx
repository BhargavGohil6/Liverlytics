import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { requestHealthPermissions, getHealthData } from '../../services/health/HealthService';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const scaleSize = (size: number) => (width / BASE_WIDTH) * size;
const verticalScaleSize = (size: number) => (height / BASE_HEIGHT) * size;
const responsiveFontSize = (size: number) => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};

const responsive = {
  width: (size: number) => scaleSize(size),
  height: (size: number) => verticalScaleSize(size),
  fontSize: (size: number) => responsiveFontSize(size),
  margin: (size: number) => scaleSize(size),
  padding: (size: number) => scaleSize(size),
  borderRadius: (size: number) => scaleSize(size),
};

const HealthSyncErrorScreen = () => {
    const navigation: any = useNavigation();
    const [loading, setLoading] = useState(false);

    const retryHealthSync = async () => {
      setLoading(true);
      try {
        // Request health permissions again
        const permissionResult = await requestHealthPermissions();
        
        if (permissionResult.granted) {
          // Fetch health data
          const data = await getHealthData();
          
          // Show success message with fetched data
          let successMessage = 'Health sync successful!\n\n';
          if (data.steps > 0) {
            successMessage += `Steps: ${data.steps}\n`;
          }
          if (data.sleepHours > 0) {
            successMessage += `Sleep: ${data.sleepHours} hours\n`;
          }
          if (data.heartRate > 0) {
            successMessage += `Heart Rate: ${data.heartRate} bpm\n`;
          }
          if (data.calories > 0) {
            successMessage += `Calories: ${data.calories}\n`;
          }
          if (data.distance > 0) {
            successMessage += `Distance: ${Math.round(data.distance)} meters\n`;
          }
          if (data.systolic && data.diastolic) {
            successMessage += `Blood Pressure: ${data.systolic}/${data.diastolic} mmHg\n`;
          }
          
          Alert.alert('Success', successMessage);
          navigation.navigate('SyncCompleteScreen');
        } else {
          Alert.alert(
            'Permission Denied',
            'Health sync permissions were denied. Please enable permissions in your device settings.',
            [
              { text: 'Try Again', onPress: retryHealthSync },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      } catch (error) {
        console.error('Error retrying health sync:', error);
        Alert.alert('Error', 'Failed to sync health data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Loading overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Syncing health data...</Text>
          </View>
        )}

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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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

            <Text style={[styles.errorText, styles.marginTop]}>
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
        <TouchableOpacity 
          style={[styles.retryButton, loading && styles.disabledButton]} 
          onPress={retryHealthSync}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Icon name="refresh" size={responsive.fontSize(20)} color="#FFF" />
          )}
          <Text style={styles.retryButtonText}>
            {loading ? 'Syncing...' : 'Retry Health Sync'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.manualButton}
          onPress={() => navigation.navigate('HealthAccess')}
        >
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
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
    padding: responsive.padding(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.margin(20),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: responsive.width(40),
    height: responsive.height(40),
    borderRadius: responsive.borderRadius(20),
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(24),
    fontWeight: 'bold',
    color: '#333',
  },
  titleSection: {
    marginBottom: responsive.margin(20),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
  },
  backText: {
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(16),
    fontWeight: '500',
    color: '#333',
  },
  mainTitle: {
    fontSize: responsive.fontSize(24),
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    marginTop: responsive.margin(10),
    fontSize: responsive.fontSize(16),
    color: '#666',
  },
  errorCard: {
    backgroundColor: '#FFD700',
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(20),
    marginBottom: responsive.margin(20),
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
  },
  errorTitle: {
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: responsive.margin(10),
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(5),
    marginRight: responsive.margin(5),
  },
  tagText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: '#FFF',
  },
  warningTag: {
    backgroundColor: '#FF0000',
  },
  errorContent: {
    marginBottom: responsive.margin(10),
  },
  errorSectionTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    marginTop: responsive.margin(5),
    fontSize: responsive.fontSize(14),
    color: '#333',
  },
  marginTop: {
    marginTop: responsive.margin(10),
  },
  fixSection: {
    marginBottom: responsive.margin(20),
  },
  fixHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
  },
  fixTitle: {
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  instructionCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(20),
    marginBottom: responsive.margin(10),
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
  },
  instructionTitle: {
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  stepsList: {
    marginLeft: responsive.margin(20),
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
  },
  bulletDot: {
    width: responsive.width(6),
    height: responsive.height(6),
    borderRadius: responsive.borderRadius(3),
    backgroundColor: '#333',
    marginRight: responsive.margin(10),
  },
  stepText: {
    fontSize: responsive.fontSize(14),
    color: '#333',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsive.margin(10),
  },
  retryButtonText: {
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(16),
    fontWeight: '500',
    color: '#FFF',
  },
  manualButton: {
    backgroundColor: '#FFD700',
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsive.margin(10),
  },
  manualButtonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '500',
    color: '#333',
  },
  footerInfo: {
    marginBottom: responsive.margin(20),
  },
  footerText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  troubleLink: {
    alignItems: 'center',
  },
  troubleLinkText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: '#007AFF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: responsive.margin(10),
    fontSize: responsive.fontSize(16),
    color: '#FFF',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default HealthSyncErrorScreen;