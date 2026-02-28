// src/screens/profile/HealthDataAccessScreen.tsx
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

type HealthDataAccessScreenProps = {
  navigation: any;
};

const HealthDataAccessScreen: React.FC<HealthDataAccessScreenProps> = ({ navigation }) => {
  // State for various health data permissions
  const [healthConnect, setHealthConnect] = useState(true);
  const [appleHealth, setAppleHealth] = useState(false);
  const [googleFit, setGoogleFit] = useState(false);
  const [wearables, setWearables] = useState(true);
  const [labResults, setLabResults] = useState(true);
  const [medicationTracking, setMedicationTracking] = useState(true);
  const [symptomTracking, setSymptomTracking] = useState(true);
  const [nutritionData, setNutritionData] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Data Access</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Control which health data sources the app can access. Your data stays secure and private.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connected Sources</Text>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="body-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Health Connect</Text>
                  <Text style={styles.permissionSubtext}>Android health platform</Text>
                </View>
              </View>
              <Switch
                value={healthConnect}
                onValueChange={setHealthConnect}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={healthConnect ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="heart-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Apple Health</Text>
                  <Text style={styles.permissionSubtext}>iOS health platform</Text>
                </View>
              </View>
              <Switch
                value={appleHealth}
                onValueChange={setAppleHealth}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={appleHealth ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="logo-google" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Google Fit</Text>
                  <Text style={styles.permissionSubtext}>Fitness and activity data</Text>
                </View>
              </View>
              <Switch
                value={googleFit}
                onValueChange={setGoogleFit}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={googleFit ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Data Types</Text>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="watch-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Wearable Data</Text>
                  <Text style={styles.permissionSubtext}>Heart rate, steps, sleep</Text>
                </View>
              </View>
              <Switch
                value={wearables}
                onValueChange={setWearables}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={wearables ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="pulse-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Lab Results</Text>
                  <Text style={styles.permissionSubtext}>Blood work, imaging results</Text>
                </View>
              </View>
              <Switch
                value={labResults}
                onValueChange={setLabResults}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={labResults ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="medkit-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Medication Tracking</Text>
                  <Text style={styles.permissionSubtext}>Prescriptions and intake</Text>
                </View>
              </View>
              <Switch
                value={medicationTracking}
                onValueChange={setMedicationTracking}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={medicationTracking ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="thermometer-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Symptom Tracking</Text>
                  <Text style={styles.permissionSubtext}>Symptoms and conditions</Text>
                </View>
              </View>
              <Switch
                value={symptomTracking}
                onValueChange={setSymptomTracking}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={symptomTracking ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Icon name="nutrition-outline" size={24} color="#52ab3c" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Nutrition Data</Text>
                  <Text style={styles.permissionSubtext}>Food intake and nutrients</Text>
                </View>
              </View>
              <Switch
                value={nutritionData}
                onValueChange={setNutritionData}
                trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                thumbColor={nutritionData ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={24} color="#3b82f6" />
            <Text style={styles.infoText}>
              Changes to permissions may require app restart to take effect. 
              Your health data is encrypted and stored securely on your device.
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

export default HealthDataAccessScreen;