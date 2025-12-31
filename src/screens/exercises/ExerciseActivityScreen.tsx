// src/screens/ExerciseActivityScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ExerciseActivityScreen = ({ navigation }) => {
  const [syncing, setSyncing] = useState(false);
  const [steps, setSteps] = useState('4500');
  const [rhr, setRhr] = useState('62');
  const [sleep, setSleep] = useState('420');

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      navigation.navigate('ExerciseSaved');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Exercise & Activity</Text>
          <Text style={styles.subtitle}>
            Log steps, resting HR and sleep. Sync or enter manually.
          </Text>

          {/* Health Sync Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health Sync</Text>
            <View style={styles.syncRow}>
              <Icon name="heart-outline" size={24} color="#1f2937" />
              <Text style={styles.syncText}>Sync from HealthKit / Health Connect</Text>
            </View>
            
            {syncing ? (
              <View style={styles.syncingContainer}>
                <Icon name="sync-outline" size={20} color="#52ab3c" />
                <Text style={styles.syncingText}>Syncing health data...</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
                <Text style={styles.syncButtonText}>Sync from Health</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Steps Input */}
          <View style={styles.card}>
            <View style={styles.inputHeader}>
              <Icon name="footsteps-outline" size={20} color="#1f2937" />
              <Text style={styles.inputLabel}>Steps</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={steps}
                onChangeText={setSteps}
                placeholder="e.g., 4500"
                keyboardType="numeric"
              />
              <Icon name="create-outline" size={20} color="#9ca3af" />
            </View>
            <Text style={styles.inputHint}>Prefilled when synced; editable anytime.</Text>
          </View>

          {/* Resting Heart Rate Input */}
          <View style={styles.card}>
            <View style={styles.inputHeader}>
              <Icon name="heart-outline" size={20} color="#1f2937" />
              <Text style={styles.inputLabel}>Resting Heart Rate (bpm)</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={rhr}
                onChangeText={setRhr}
                placeholder="e.g., 62"
                keyboardType="numeric"
              />
              <Icon name="create-outline" size={20} color="#9ca3af" />
            </View>
            <Text style={styles.inputHint}>Prefilled when synced; editable anytime.</Text>
          </View>

          {/* Sleep Input */}
          <View style={styles.card}>
            <View style={styles.inputHeader}>
              <Icon name="moon-outline" size={20} color="#1f2937" />
              <Text style={styles.inputLabel}>Sleep (minutes)</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={sleep}
                onChangeText={setSleep}
                placeholder="e.g., 420"
                keyboardType="numeric"
              />
              <Icon name="create-outline" size={20} color="#9ca3af" />
            </View>
            <Text style={styles.inputHint}>Prefilled when synced; editable anytime.</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('ExerciseSaved')}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
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
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  syncButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  syncButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  syncingText: {
    fontSize: 14,
    color: '#52ab3c',
    marginLeft: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  inputHint: {
    fontSize: 13,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#52ab3c',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ExerciseActivityScreen;