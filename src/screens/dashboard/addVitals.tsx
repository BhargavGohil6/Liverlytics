import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Note: Install react-native-vector-icons or use expo icons
// npm install react-native-vector-icons
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {colors, font} from '../../theme/index';
import responsive from '../../theme/responsive';

export default function AddVitalsScreen() {
  const navigation = useNavigation();
  const [heartRate, setHeartRate] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [steps, setSteps] = useState('');
  const [sleepMinutes, setSleepMinutes] = useState('');
  const [spo2, setSpo2] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="trending-up" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellIcon}>
            <Icon name="bell" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Add Vitals</Text>
          <Text style={styles.subtitle}>
            Enter today's readings or update wearable data.
          </Text>
        </View>

        {/* Heart Rate */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Heart Rate</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={heartRate}
              onChangeText={setHeartRate}
            />
            <Text style={styles.unit}>bpm</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="info" size={16} color="#666" />
            <Text style={styles.infoText}>
              Resting HR auto-imported when available.
            </Text>
          </View>
        </View>

        {/* Resting Heart Rate */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Resting Heart Rate</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={restingHR}
              onChangeText={setRestingHR}
            />
            <Text style={styles.unit}>bpm</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="watch" size={16} color="#666" />
            <Text style={styles.infoText}>
              Tracked via wearable when connected.
            </Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Steps</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={steps}
              onChangeText={setSteps}
            />
            <Text style={styles.unit}>steps</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="smartphone" size={16} color="#666" />
            <Text style={styles.infoText}>
              Imported from smartwatch when available.
            </Text>
          </View>
        </View>

        {/* Sleep Minutes */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Sleep Minutes</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={sleepMinutes}
              onChangeText={setSleepMinutes}
            />
            <Text style={styles.unit}>min</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="moon" size={16} color="#666" />
            <Text style={styles.infoText}>
              Total sleep duration from last night.
            </Text>
          </View>
        </View>

        {/* SpO2 */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>SpO₂</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={spo2}
              onChangeText={setSpo2}
            />
            <Text style={styles.unit}>%</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="activity" size={16} color="#666" />
            <Text style={styles.infoText}>
              Optional but helpful for flagging low oxygen.
            </Text>
          </View>
        </View>

        {/* Weight */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to enter"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TouchableOpacity 
              style={styles.unitSelector}
              onPress={() => setShowUnitPicker(!showUnitPicker)}
            >
              <Text style={styles.unitSelectorText}>
                select{'\n'}option
              </Text>
              <Icon name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          {showUnitPicker && (
            <View style={styles.unitPicker}>
              <TouchableOpacity 
                style={[styles.unitOption, weightUnit === 'kg' && styles.unitOptionActive]}
                onPress={() => {
                  setWeightUnit('kg');
                  setShowUnitPicker(false);
                }}
              >
                <Text style={[styles.unitOptionText, weightUnit === 'kg' && styles.unitOptionTextActive]}>
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.unitOption, weightUnit === 'lb' && styles.unitOptionActive]}
                onPress={() => {
                  setWeightUnit('lb');
                  setShowUnitPicker(false);
                }}
              >
                <Text style={[styles.unitOptionText, weightUnit === 'lb' && styles.unitOptionTextActive]}>
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Icon name="droplet" size={16} color="#666" />
            <Text style={styles.infoText}>
              Tracks rapid fluid retention changes.
            </Text>
          </View>
        </View>

        {/* Blood Pressure */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Blood Pressure (Optional)</Text>
          <View style={styles.bpContainer}>
            <View style={styles.bpInput}>
              <TextInput
                style={styles.bpTextInput}
                placeholder="Systolic"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={systolic}
                onChangeText={setSystolic}
              />
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
            <View style={styles.bpInput}>
              <TextInput
                style={styles.bpTextInput}
                placeholder="Diastolic"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={diastolic}
                onChangeText={setDiastolic}
              />
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="heart" size={16} color="#666" />
            <Text style={styles.infoText}>
              Optional if you track BP.
            </Text>
          </View>
        </View>

        {/* AI Trend Check Info */}
        <View style={styles.aiInfoCard}>
          <Text style={styles.aiInfoTitle}>AI Trend Check (On-Device)</Text>
          <Text style={styles.aiInfoText}>
            Your entries will be analyzed for unusual changes.{'\n'}
            Cloud-based analytics only used if you opted in.
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={()=>navigation.navigate('VitalsSavedSuccessScreen')}>
          <Text style={styles.saveButtonText}>Save Vitals</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
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
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    zIndex: -1,
  },
  logo: {
    width: responsive.width(32),
    height: responsive.height(32),
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.margin(8),
  },
  logoText: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(12),
  },
  todayButton: {
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(6),
  },
  todayText: {
    fontSize: font.base,
    color: colors.darkGray,
    fontWeight: '500',
  },
  bellIcon: {
    padding: responsive.padding(4),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: responsive.padding(16),
  },
  titleSection: {
    paddingTop: responsive.padding(24),
    paddingBottom: responsive.padding(20),
  },
  title: {
    fontSize: font.h3,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(8),
  },
  subtitle: {
    fontSize: font.base,
    color: colors.gray666,
    lineHeight: responsive.height(20),
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(12),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(12),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(14),
    marginBottom: responsive.margin(12),
  },
  input: {
    flex: 1,
    fontSize: font.lg,
    color: colors.darkGray,
  },
  unit: {
    fontSize: font.base,
    color: colors.gray666,
    marginLeft: responsive.margin(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsive.width(8),
  },
  infoText: {
    flex: 1,
    fontSize: font.sm,
    color: colors.gray666,
    lineHeight: responsive.height(18),
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(4),
    paddingLeft: responsive.padding(12),
    borderLeftWidth: 1,
    borderLeftColor: colors.gray200,
  },
  unitSelectorText: {
    fontSize: font.sm,
    color: colors.gray666,
    textAlign: 'center',
    lineHeight: responsive.height(14),
  },
  unitPicker: {
    flexDirection: 'row',
    backgroundColor: colors.grayEFEF,
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(4),
    marginBottom: responsive.margin(12),
  },
  unitOption: {
    flex: 1,
    paddingVertical: responsive.padding(8),
    alignItems: 'center',
    borderRadius: responsive.borderRadius(6),
  },
  unitOptionActive: {
    backgroundColor: colors.white,
  },
  unitOptionText: {
    fontSize: font.base,
    color: colors.gray666,
    fontWeight: '500',
  },
  unitOptionTextActive: {
    color: colors.darkGray,
    fontWeight: '600',
  },
  bpContainer: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(12),
  },
  bpInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(14),
  },
  bpTextInput: {
    flex: 1,
    fontSize: font.lg,
    color: colors.darkGray,
  },
  bpUnit: {
    fontSize: font.sm,
    color: colors.gray666,
    marginLeft: responsive.margin(8),
  },
  aiInfoCard: {
    backgroundColor: colors.darkGreen,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
    marginBottom: responsive.margin(20),
  },
  aiInfoTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.white,
    marginBottom: responsive.margin(8),
  },
  aiInfoText: {
    fontSize: font.sm,
    color: colors.mintMist,
    lineHeight: responsive.height(19),
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(12),
    paddingVertical: responsive.padding(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.white,
  },
});