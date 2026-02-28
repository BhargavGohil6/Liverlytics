// src/screens/profile/AlertThresholdsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type AlertThresholdsScreenProps = {
  navigation: any;
};

const AlertThresholdsScreen: React.FC<AlertThresholdsScreenProps> = ({ navigation }) => {
  // State for alert threshold options
  const [sodiumAlert, setSodiumAlert] = useState(true);
  const [weightGainAlert, setWeightGainAlert] = useState(true);
  const [heartRateAlert, setHeartRateAlert] = useState(true);
  const [meldDeltaAlert, setMeldDeltaAlert] = useState(true);
  const [sodiumThreshold, setSodiumThreshold] = useState('2000');
  const [weightThreshold, setWeightThreshold] = useState('2.0');
  const [heartRateThreshold, setHeartRateThreshold] = useState('90');
  const [meldDeltaThreshold, setMeldDeltaThreshold] = useState('2');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alert Thresholds</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Set personalized thresholds for health alerts and notifications.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sodium Monitoring</Text>
            
            <View style={styles.thresholdItem}>
              <View style={styles.thresholdInfo}>
                <Icon name="nutrition-outline" size={24} color="#52ab3c" />
                <View style={styles.thresholdText}>
                  <Text style={styles.thresholdLabel}>Sodium Intake Alert</Text>
                  <Text style={styles.thresholdSubtext}>Daily sodium consumption limit</Text>
                </View>
              </View>
              <View style={styles.toggleAndInput}>
                <Switch
                  value={sodiumAlert}
                  onValueChange={setSodiumAlert}
                  trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                  thumbColor={sodiumAlert ? '#ffffff' : '#ffffff'}
                  ios_backgroundColor="#d1d5db"
                />
                {sodiumAlert && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.thresholdInput}
                      value={sodiumThreshold}
                      onChangeText={setSodiumThreshold}
                      keyboardType="numeric"
                      placeholder="2000"
                    />
                    <Text style={styles.unitText}>mg/day</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weight Monitoring</Text>
            
            <View style={styles.thresholdItem}>
              <View style={styles.thresholdInfo}>
                <Icon name="scale-outline" size={24} color="#52ab3c" />
                <View style={styles.thresholdText}>
                  <Text style={styles.thresholdLabel}>Weight Gain Alert</Text>
                  <Text style={styles.thresholdSubtext}>Rapid weight gain detection</Text>
                </View>
              </View>
              <View style={styles.toggleAndInput}>
                <Switch
                  value={weightGainAlert}
                  onValueChange={setWeightGainAlert}
                  trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                  thumbColor={weightGainAlert ? '#ffffff' : '#ffffff'}
                  ios_backgroundColor="#d1d5db"
                />
                {weightGainAlert && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.thresholdInput}
                      value={weightThreshold}
                      onChangeText={setWeightThreshold}
                      keyboardType="decimal-pad"
                      placeholder="2.0"
                    />
                    <Text style={styles.unitText}>kg in 48h</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vital Sign Monitoring</Text>
            
            <View style={styles.thresholdItem}>
              <View style={styles.thresholdInfo}>
                <Icon name="heart-outline" size={24} color="#ef4444" />
                <View style={styles.thresholdText}>
                  <Text style={styles.thresholdLabel}>Resting Heart Rate Alert</Text>
                  <Text style={styles.thresholdSubtext}>Sustained elevated heart rate</Text>
                </View>
              </View>
              <View style={styles.toggleAndInput}>
                <Switch
                  value={heartRateAlert}
                  onValueChange={setHeartRateAlert}
                  trackColor={{ false: '#d1d5db', true: '#ef4444' }}
                  thumbColor={heartRateAlert ? '#ffffff' : '#ffffff'}
                  ios_backgroundColor="#d1d5db"
                />
                {heartRateAlert && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.thresholdInput}
                      value={heartRateThreshold}
                      onChangeText={setHeartRateThreshold}
                      keyboardType="numeric"
                      placeholder="90"
                    />
                    <Text style={styles.unitText}>bpm</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>MELD Score Monitoring</Text>
            
            <View style={styles.thresholdItem}>
              <View style={styles.thresholdInfo}>
                <Icon name="pulse-outline" size={24} color="#52ab3c" />
                <View style={styles.thresholdText}>
                  <Text style={styles.thresholdLabel}>MELD Delta Alert</Text>
                  <Text style={styles.thresholdSubtext}>Significant change in MELD score</Text>
                </View>
              </View>
              <View style={styles.toggleAndInput}>
                <Switch
                  value={meldDeltaAlert}
                  onValueChange={setMeldDeltaAlert}
                  trackColor={{ false: '#d1d5db', true: '#52ab3c' }}
                  thumbColor={meldDeltaAlert ? '#ffffff' : '#ffffff'}
                  ios_backgroundColor="#d1d5db"
                />
                {meldDeltaAlert && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.thresholdInput}
                      value={meldDeltaThreshold}
                      onChangeText={setMeldDeltaThreshold}
                      keyboardType="numeric"
                      placeholder="2"
                    />
                    <Text style={styles.unitText}>points</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={24} color="#3b82f6" />
            <Text style={styles.infoText}>
              These thresholds are personalized recommendations. Consult with your healthcare provider 
              before adjusting critical health alerts. Values are saved automatically.
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
  thresholdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  thresholdItemLast: {
    borderBottomWidth: 0,
  },
  thresholdInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  thresholdText: {
    flex: 1,
  },
  thresholdLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  thresholdSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  toggleAndInput: {
    alignItems: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  thresholdInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
    width: 70,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  unitText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
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

export default AlertThresholdsScreen;