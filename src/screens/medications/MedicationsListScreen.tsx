// src/screens/MedicationsListScreen.tsx
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

const MedicationsListScreen = ({ navigation }) => {
  const medications = [
    {
      name: 'Spironolactone',
      dose: '25 mg',
      times: ['08:00', '20:00'],
      adherence: 100,
      withFood: true,
    },
    {
      name: 'Furosemide',
      dose: '40 mg',
      times: ['07:30'],
      adherence: 50,
      withFood: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
       

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Medications</Text>
        </View>

        <View style={styles.content}>
          {/* Current & Ongoing */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Current & Ongoing</Text>

            {medications.map((med, index) => (
              <TouchableOpacity
                key={index}
                style={styles.medCard}
                onPress={() => navigation.navigate('MedicationDetails', { medication: med })}
              >
                <View style={styles.medHeader}>
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medDose}>{med.dose}</Text>
                  </View>
                  {med.withFood && (
                    <View style={styles.withFoodBadge}>
                      <Text style={styles.withFoodText}>With Food</Text>
                    </View>
                  )}
                </View>

                <View style={styles.medTimes}>
                  {med.times.map((time, idx) => (
                    <View key={idx} style={styles.timeChip}>
                      <Icon name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.timeText}>{time}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.adherenceRow}>
                  <View style={styles.adherenceDot} />
                  <Text style={styles.adherenceText}>
                    Adherence today: {med.adherence}%
                  </Text>
                </View>

                <TouchableOpacity style={styles.updateButton}>
                  <Text style={styles.updateButtonText}>Update Checklist</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Medication Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddMedicationScreen')}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
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
  medCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
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
  medTimes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  timeChip: {
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
  adherenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adherenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52ab3c',
    marginRight: 8,
  },
  adherenceText: {
    fontSize: 13,
    color: '#374151',
  },
  updateButton: {
    backgroundColor: '#52ab3c',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default MedicationsListScreen;