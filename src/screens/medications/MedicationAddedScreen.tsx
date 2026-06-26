// src/screens/MedicationAddedScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MedicationAddedScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
       

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          {/* <Text style={styles.title}>Medications</Text> */}
        </View>

        {/* Success Card */}
        <View style={styles.successCard}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="checkmark-outline" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.successTitle}>Medication Added Successfully</Text>

          <View style={styles.medInfo}>
            <Text style={styles.medName}>Spironolactone</Text>
            <Text style={styles.medDose}>25 mg</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>With Food</Text>
            </View>

            <View style={styles.timesRow}>
              <View style={styles.timeChip}>
                <Icon name="time-outline" size={14} color="#6b7280" />
                <Text style={styles.timeText}>08:00</Text>
              </View>
              <View style={styles.timeChip}>
                <Icon name="time-outline" size={14} color="#6b7280" />
                <Text style={styles.timeText}>20:00</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('MedicationsListScreen')}
          >
            <Text style={styles.backButtonText}>Back to Medications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
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
    backgroundColor: '#52ab3c',
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
  successCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#52ab3c',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  medInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  medName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  medDose: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  timesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 4,
  },
  backButton: {
    backgroundColor: '#52ab3c',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MedicationAddedScreen;