// src/screens/DietFluidsScreen.tsx
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

const DietFluidsScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [sodium, setSodium] = useState('');
  const [fluid, setFluid] = useState('');

  const entries = [
    { name: 'Chicken Soup', sodium: 650, fluid: 240, time: '12:40 PM' },
    { name: 'Electrolyte Water', sodium: 120, fluid: 500, time: '10:05 AM' },
    { name: 'Oatmeal', sodium: 350, fluid: 240, time: '8:15 AM' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Diet & Fluids</Text>
          <Text style={styles.subtitle}>Track today's sodium and fluid intake</Text>

          {/* Today's Totals */}
          <View style={styles.totalsCard}>
            <Text style={styles.totalsTitle}>Today's Totals</Text>
            <View style={styles.totalsRow}>
              <View style={styles.totalItem}>
                <Text style={styles.totalLabel}>Total Sodium Today</Text>
                <Text style={styles.totalValue}>1,120 mg</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalLabel}>Total Fluid Today</Text>
                <Text style={styles.totalValue}>980 mL</Text>
              </View>
            </View>
            <Text style={styles.timestamp}>As of now</Text>
          </View>

          {/* Add Entry */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add Entry</Text>
            
            <Text style={styles.inputLabel}>Item Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="e.g., Chicken soup"
              />
              <Icon name="create-outline" size={20} color="#9ca3af" />
            </View>

            <Text style={styles.inputLabel}>Sodium (mg)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={sodium}
                onChangeText={setSodium}
                placeholder="e.g., 650"
                keyboardType="numeric"
              />
              <Icon name="calculator-outline" size={20} color="#9ca3af" />
            </View>

            <Text style={styles.inputLabel}>Fluid (mL)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fluid}
                onChangeText={setFluid}
                placeholder="e.g., 240"
                keyboardType="numeric"
              />
              <Icon name="water-outline" size={20} color="#9ca3af" />
            </View>

            <View style={styles.timestampRow}>
              <Icon name="time-outline" size={20} color="#6b7280" />
              <Text style={styles.timestampText}>Now</Text>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </View>

            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Entries */}
          <View style={styles.entriesSection}>
            <View style={styles.entriesHeader}>
              <Text style={styles.entriesTitle}>Today's Entries</Text>
              <Text style={styles.deleteHint}>Tap trash to delete</Text>
            </View>

            {entries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryContent}>
                  <Text style={styles.entryName}>{entry.name}</Text>
                  <Text style={styles.entryDetails}>
                    Sodium: {entry.sodium} mg • Fluid: {entry.fluid} mL
                  </Text>
                  <Text style={styles.entryTime}>• {entry.time}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton}>
                  <Icon name="trash-outline" size={20} color="#ef4444" />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Tip: Higher sodium increases fluid retention. Track daily intake to manage cirrhosis symptoms.
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
  totalsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  totalsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  totalItem: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  timestampText: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#52a64a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  entriesSection: {
    marginBottom: 16,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  deleteHint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryContent: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  entryDetails: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  entryTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 4,
  },
  tipCard: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
});

export default DietFluidsScreen;