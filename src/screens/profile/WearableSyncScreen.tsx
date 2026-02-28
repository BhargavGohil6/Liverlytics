// src/screens/profile/WearableSyncScreen.tsx
import React, { useState } from 'react';
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

type WearableSyncScreenProps = {
  navigation: any;
};

const WearableSyncScreen: React.FC<WearableSyncScreenProps> = ({ navigation }) => {
  // State for wearable sync options
  const [healthConnectSync, setHealthConnectSync] = useState(true);
  const [smartwatchSync, setSmartwatchSync] = useState(true);
  const [fitnessTrackerSync, setFitnessTrackerSync] = useState(false);
  const [sleepTracking, setSleepTracking] = useState(true);
  const [heartRateSync, setHeartRateSync] = useState(true);
  const [stepCountSync, setStepCountSync] = useState(true);
  const [automaticSync, setAutomaticSync] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wearable Sync</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Configure how your wearable devices connect and sync data with the app.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connected Devices</Text>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="phone-portrait-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Health Connect</Text>
                  <Text style={styles.permissionSubtext}>Android health platform</Text>
                </View>
              </View>
              <Switch
                value={healthConnectSync}
                onValueChange={setHealthConnectSync}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={healthConnectSync ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="watch-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Smartwatch</Text>
                  <Text style={styles.permissionSubtext}>Apple Watch, Samsung Galaxy, etc.</Text>
                </View>
              </View>
              <Switch
                value={smartwatchSync}
                onValueChange={setSmartwatchSync}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={smartwatchSync ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="fitness-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Fitness Tracker</Text>
                  <Text style={styles.permissionSubtext}>Fitbit, Garmin, etc.</Text>
                </View>
              </View>
              <Switch
                value={fitnessTrackerSync}
                onValueChange={setFitnessTrackerSync}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={fitnessTrackerSync ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sync Options</Text>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="moon-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Sleep Tracking</Text>
                  <Text style={styles.permissionSubtext}>Sleep duration and quality</Text>
                </View>
              </View>
              <Switch
                value={sleepTracking}
                onValueChange={setSleepTracking}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={sleepTracking ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="heart-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Heart Rate</Text>
                  <Text style={styles.permissionSubtext}>Continuous monitoring data</Text>
                </View>
              </View>
              <Switch
                value={heartRateSync}
                onValueChange={setHeartRateSync}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={heartRateSync ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="walk-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Step Count</Text>
                  <Text style={styles.permissionSubtext}>Daily activity metrics</Text>
                </View>
              </View>
              <Switch
                value={stepCountSync}
                onValueChange={setStepCountSync}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={stepCountSync ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="sync-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Automatic Sync</Text>
                  <Text style={styles.permissionSubtext}>Sync data in real-time</Text>
                </View>
              </View>
              <Switch
                value={automaticSync}
                onValueChange={setAutomaticSync}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={automaticSync ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={24} color="#3b82f6" />
            <Text style={styles.infoText}>
              Your wearable data is encrypted and stored securely. 
              Ensure your devices have the latest software for optimal sync performance.
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  permissionItemLast: {
    borderBottomWidth: 0,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  permissionText: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  permissionSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    flex: 1,
    lineHeight: 18,
  },
});

export default WearableSyncScreen;