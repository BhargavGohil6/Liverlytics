// src/screens/MELDDataEntryScreen.tsx
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
import {useNavigation} from '@react-navigation/native';

const MELDDataEntryScreen = () => {
  const navigation = useNavigation();
  const [bilirubin, setBilirubin] = useState('');
  const [inr, setInr] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sodium, setSodium] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [sex, setSex] = useState('Male');
  const [dialysis, setDialysis] = useState('No');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>MELD Data Entry</Text>
          <Text style={styles.subtitle}>Calculate and update your MELD-Na & MELD 3.0 scores</Text>

          {/* Entry Method */}
          <View style={styles.methodCard}>
            <TouchableOpacity style={styles.methodButton}>
              <Icon name="create-outline" size={20} color="#1f2937" />
              <Text style={styles.methodText}>Manual Entry</Text>
              <Text style={styles.methodSubtext}>Enter Lab Values Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodButton}>
              <Icon name="cloud-upload-outline" size={20} color="#1f2937" />
              <Text style={styles.methodText}>Upload Report</Text>
              <Text style={styles.methodSubtext}>Upload Lab Report (AI Extraction)</Text>
            </TouchableOpacity>
          </View>

          {/* Lab Values */}
          <View style={styles.formCard}>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Total Bilirubin</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={bilirubin}
                    onChangeText={setBilirubin}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>mg/dL</Text>
                  <TouchableOpacity>
                    <Icon name="help-circle-outline" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 0-1-50</Text>
              </View>

              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>INR</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={inr}
                    onChangeText={setInr}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>ratio</Text>
                  <TouchableOpacity>
                    <Icon name="help-circle-outline" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 0-0-8</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Creatinine</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={creatinine}
                    onChangeText={setCreatinine}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>mg/dL</Text>
                  <TouchableOpacity>
                    <Icon name="help-circle-outline" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 0-1-15</Text>
              </View>

              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Sodium</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={sodium}
                    onChangeText={setSodium}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>mEq/L</Text>
                  <TouchableOpacity>
                    <Icon name="help-circle-outline" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 120-170</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Albumin</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={albumin}
                    onChangeText={setAlbumin}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>g/dL</Text>
                </View>
                <Text style={styles.range}>Range: 1.0-6.0</Text>
              </View>

              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Sex</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.sexButtons}>
                  <TouchableOpacity
                    style={[styles.sexButton, sex === 'Female' && styles.sexButtonActive]}
                    onPress={() => setSex('Female')}
                  >
                    <Text style={[styles.sexText, sex === 'Female' && styles.sexTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sexButton, sex === 'Male' && styles.sexButtonActive]}
                    onPress={() => setSex('Male')}
                  >
                    <Text style={[styles.sexText, sex === 'Male' && styles.sexTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Dialysis Toggle */}
            <View style={styles.dialysisRow}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>On Dialysis?</Text>
                <TouchableOpacity>
                  <Icon name="information-circle-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.toggleButtons}>
                <TouchableOpacity
                  style={[styles.toggleButton, dialysis === 'No' && styles.toggleButtonActive]}
                  onPress={() => setDialysis('No')}
                >
                  <Text style={[styles.toggleText, dialysis === 'No' && styles.toggleTextActive]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, dialysis === 'Yes' && styles.toggleButtonActive]}
                  onPress={() => setDialysis('Yes')}
                >
                  <Text style={[styles.toggleText, dialysis === 'Yes' && styles.toggleTextActive]}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Affects calculation handling in MELD
              </Text>
            </View>

            {/* Notes */}
            <View style={styles.notesSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Notes (optional)</Text>
                <TouchableOpacity>
                  <Icon name="information-circle-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.notesInput}
                placeholder="Add context for this lab set"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Results Preview */}
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>MELD Results</Text>
            <View style={styles.resultRow}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>MELD-Na</Text>
                <Text style={styles.resultValue}>—</Text>
                <Text style={styles.resultHint}>Updated when all fields valid</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>MELD 3.0</Text>
                <Text style={styles.resultValue}>—</Text>
                <Text style={styles.resultHint}>Uses bilirubin, INR, creatinine, albumin, sex</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveText}>Save & Recalculate</Text>
            </TouchableOpacity>
          </View>

          {/* AI Insights */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>AI Insights (Informational Only)</Text>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Sodium slightly lower than last reading.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                AST/ALT ratio elevated compared to prior report.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Mild rise in creatinine compared to last 3 tests.
              </Text>
            </View>
            <Text style={styles.disclaimer}>
              These statements are informational and not a diagnosis.
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
  methodCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  methodText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  methodSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formItem: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
  },
  unit: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
  },
  range: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  sexButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sexButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  sexButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  sexText: {
    fontSize: 14,
    color: '#374151',
  },
  sexTextActive: {
    color: '#fff',
  },
  dialysisRow: {
    marginBottom: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  toggleButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  toggleText: {
    fontSize: 14,
    color: '#374151',
  },
  toggleTextActive: {
    color: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
  },
  notesSection: {
    marginTop: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resultsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultItem: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  resultHint: {
    fontSize: 11,
    color: '#9ca3af',
    lineHeight: 16,
  },
  resultDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#52a64a',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  insightsCard: {
    backgroundColor: '#0F7A6B',
    padding: 16,
    borderRadius: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  insightBullet: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#d1fae5',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default MELDDataEntryScreen;