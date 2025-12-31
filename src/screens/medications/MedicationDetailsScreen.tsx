// src/screens/MedicationDetailsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MedicationDetailsScreen = ({ navigation, route }) => {
  const  medication  = {
    medication: {
      name: 'Spironolactone',
      dose: '25 mg',
      times: ['08:00', '20:00'],
      adherence: 50,
      withFood: true,
    },
  };
//   const { medication } = route.params || {
//     medication: {
//       name: 'Spironolactone',
//       dose: '25 mg',
//       times: ['08:00', '20:00'],
//       adherence: 50,
//       withFood: true,
//     },
//   };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Medications</Text>
        </View>

        <View style={styles.content}>
          {/* Medication Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Medication Details</Text>

            {/* Medication Info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Medication Info</Text>

              <View style={styles.medHeader}>
                <View>
                  <Text style={styles.medName}>{medication.name}</Text>
                  <Text style={styles.medDose}>{medication.dose}</Text>
                </View>
                {medication.withFood && (
                  <View style={styles.withFoodBadge}>
                    <Text style={styles.withFoodText}>With Food</Text>
                  </View>
                )}
              </View>

              <View style={styles.timesRow}>
                {/* {medication.times.map((time, index) => (
                  <View key={index} style={styles.timeItem}>
                    <Icon name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))} */}
                <View style={styles.statusBadge}>
                  <Icon name="checkmark-circle" size={16} color="#52a64a" />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>

            {/* Dose Checklist */}
            <View style={styles.checklistSection}>
              <Text style={styles.checklistTitle}>Dose Checklist (Today)</Text>

              <View style={styles.checklistItem}>
                <View style={styles.checkmarkCircle}>
                  <Icon name="checkmark" size={16} color="#fff" />
                </View>
                <View style={styles.checklistInfo}>
                  <Text style={styles.checklistTime}>08:00</Text>
                  <Text style={styles.checklistStatus}>Taken at 08:05</Text>
                </View>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.pendingCircle}>
                  <Icon name="time-outline" size={16} color="#6b7280" />
                </View>
                <View style={styles.checklistInfo}>
                  <Text style={styles.checklistTime}>20:00</Text>
                  <Text style={styles.checklistStatus}>Pending</Text>
                </View>
              </View>
            </View>

            {/* Today's Adherence */}
            <View style={styles.adherenceSection}>
              <Text style={styles.adherenceTitle}>Today's Adherence</Text>
              <Text style={styles.adherenceValue}>{medication.adherence}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${medication.adherence}%` }]}
                />
              </View>
              <Text style={styles.adherenceFormula}>
                adherence = takenDosesToday / totalScheduledDosesToday
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.updateButton}>
              <Icon name="create-outline" size={20} color="#1f2937" />
              <Text style={styles.updateButtonText}>Update Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => navigation.navigate('RemoveMedication')}
            >
              <Icon name="trash-outline" size={20} color="#fff" />
              <Text style={styles.removeButtonText}>Remove Medication</Text>
            </TouchableOpacity>
          </View>

          {/* Safety & Education */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Safety & Education</Text>

            <View style={styles.warningCard}>
              <Text style={styles.warningText}>
                Avoid frequent or high-dose NSAIDs unless advised by your clinician.
              </Text>
            </View>

            <View style={styles.warningCard}>
              <Text style={styles.warningText}>
                Exceeding daily limits may harm the liver. Consult your physician for safe
                dosing.
              </Text>
            </View>

            <View style={styles.warningCard}>
              <Text style={styles.warningText}>
                Some herbal supplements may interact with liver conditions or medications.
              </Text>
            </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  medDose: {
    fontSize: 14,
    color: '#6b7280',
  },
  withFoodBadge: {
    backgroundColor: '#1f2937',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  withFoodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  statusText: {
    fontSize: 13,
    color: '#16a34a',
    marginLeft: 4,
    fontWeight: '500',
  },
  checklistSection: {
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#52a64a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pendingCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checklistInfo: {
    flex: 1,
  },
  checklistTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  checklistStatus: {
    fontSize: 13,
    color: '#6b7280',
  },
  adherenceSection: {
    marginBottom: 16,
  },
  adherenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  adherenceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#52a64a',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#52a64a',
  },
  adherenceFormula: {
    fontSize: 11,
    color: '#9ca3af',
  },
  updateButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 12,
  },
  updateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  removeButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  warningText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
});

export default MedicationDetailsScreen;

