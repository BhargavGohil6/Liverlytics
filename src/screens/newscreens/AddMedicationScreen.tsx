
// src/screens/AddMedicationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddMedicationScreen = ({ navigation }) => {
  const [medName, setMedName] = useState('');
  const [dose, setDose] = useState('');
  const [withFood, setWithFood] = useState(true);
  const [times, setTimes] = useState(['08:00', '20:00']);

  const removeTime = (index) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Medications</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add Medication</Text>

            {/* Medication Name */}
            <Text style={styles.label}>Medication Name</Text>
            <TextInput
              style={styles.input}
              value={medName}
              onChangeText={setMedName}
              placeholder="e.g., Spironolactone"
            />

            {/* Dose */}
            <Text style={styles.label}>Dose</Text>
            <TextInput
              style={styles.input}
              value={dose}
              onChangeText={setDose}
              placeholder="e.g., 40mg, 1 tablet, 2 drops"
            />

            {/* Dose Times */}
            <Text style={styles.label}>Dose Times</Text>
            <TouchableOpacity style={styles.addTimeButton}>
              <Icon name="time-outline" size={20} color="#1f2937" />
              <Text style={styles.addTimeText}>Add Time</Text>
            </TouchableOpacity>

            {times.length > 0 && (
              <View style={styles.timesContainer}>
                {times.map((time, index) => (
                  <View key={index} style={styles.timeChip}>
                    <Text style={styles.timeChipText}>{time}</Text>
                    <TouchableOpacity onPress={() => removeTime(index)}>
                      <Icon name="close" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.hint}>
              Tap Add Time to select HH:MM. Times appear as removable chips.
            </Text>

            {/* With Food Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>With Food</Text>
                <Text style={styles.toggleHint}>Recommended for some medications.</Text>
              </View>
              <Switch
                value={withFood}
                onValueChange={setWithFood}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={withFood ? '#52ab3c' : '#f3f4f6'}
              />
            </View>

            <Text style={styles.note}>
              Take this dose with or immediately after food.
            </Text>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.navigate('MedicationAddedScreen')}
            >
              <Icon name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Medication</Text>
            </TouchableOpacity>

            <Text style={styles.autoSchedule}>
              We'll auto-schedule notifications for each selected time.
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  addTimeText: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 8,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  toggleHint: {
    fontSize: 12,
    color: '#6b7280',
  },
  note: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  autoSchedule: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default AddMedicationScreen;
