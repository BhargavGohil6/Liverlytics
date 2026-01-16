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
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addMeldCalculator } from './slices/meldSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { MeldCalculatorPayload } from './slices/meldSlice';
import responsive from '../../theme/responsive';

const MELDDataEntryScreen = () => {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: meldLoading, error: meldError } = useSelector((state: RootState) => state.meld);
  
  const [bilirubin, setBilirubin] = useState('');
  const [inr, setInr] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sodium, setSodium] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [ast, setAst] = useState('');
  const [alt, setAlt] = useState('');
  const [plateletCount, setPlateletCount] = useState('');
  const [hemoglobin, setHemoglobin] = useState('');
  const [wbc, setWbc] = useState('');
  const [potassium, setPotassium] = useState('');
  const [ammonia, setAmmonia] = useState('');
  const [sex, setSex] = useState(user?.gender_custom || 'Male');
  const [dialysis, setDialysis] = useState('No');
  const [notes, setNotes] = useState('');
  
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 768;

  const handleSaveAndRecalculate = () => {
    // Validate required fields
    if (!bilirubin || !inr || !creatinine) {
      Alert.alert('Validation Error', 'Please enter required fields: Bilirubin, INR, and Creatinine');
      return;
    }

    // Prepare the payload for the API call
    const meldData = {
      serum_creatinine: parseFloat(creatinine),
      serum_sodium: parseFloat(sodium) || 135,
      total_bilirubin: parseFloat(bilirubin),
      inr: parseFloat(inr),
      albumin: parseFloat(albumin) || 4.0,
      sex_at_birth: sex,
      on_dialysis: dialysis === 'Yes' ? 1 : 0,
      notes: notes || 'Manual entry',
      ast: parseFloat(ast) || undefined,
      alt: parseFloat(alt) || undefined,
      platelet_count: parseFloat(plateletCount) || undefined,
      hemoglobin: parseFloat(hemoglobin) || undefined,
      wbc: parseFloat(wbc) || undefined,
      potassium: parseFloat(potassium) || undefined,
      ammonia: parseFloat(ammonia) || undefined,
    };

    // Dispatch the API call
    dispatch(addMeldCalculator(meldData))
      .unwrap()
      .then((result: MeldCalculatorPayload) => {
        console.log('MELD calculation successful:', result);
        Alert.alert('Success', 'MELD calculation completed successfully');
      })
      .catch((error: any) => {
        console.error('MELD calculation failed:', error);
        Alert.alert('Error', 'Failed to calculate MELD score: ' + error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>MELD Data Entry</Text>
          <Text style={styles.subtitle}>Calculate and update your MELD-Na & MELD 3.0 scores</Text>

          {/* Entry Method */}
          <View style={isSmallScreen ? styles.methodColumn : styles.methodCard}>
            <TouchableOpacity style={styles.methodButton}>
              <Icon name="create-outline" size={responsive.fontSize(20)} color="#1f2937" />
              <Text style={styles.methodText}>Manual Entry</Text>
              <Text style={styles.methodSubtext}>Enter Lab Values Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodButton}>
              <Icon name="cloud-upload-outline" size={responsive.fontSize(20)} color="#1f2937" />
              <Text style={styles.methodText}>Upload Report</Text>
              <Text style={styles.methodSubtext}>Upload Lab Report (AI Extraction)</Text>
            </TouchableOpacity>
          </View>

          {/* Lab Values */}
          <View style={styles.formCard}>
            {/* Total Bilirubin and INR Row */}
            <View style={isSmallScreen ? styles.formColumn : styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Total Bilirubin</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                    <Icon name="help-circle-outline" size={responsive.fontSize(18)} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 0-1-50</Text>
              </View>

              {!isSmallScreen && (
                <View style={styles.formItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>INR</Text>
                    <TouchableOpacity>
                      <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                      <Icon name="help-circle-outline" size={responsive.fontSize(18)} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.range}>Range: 0-0-8</Text>
                </View>
              )}
            </View>
            
            {/* INR Field for Small Screens */}
            {isSmallScreen && (
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>INR</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                    <Icon name="help-circle-outline" size={responsive.fontSize(18)} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 0-0-8</Text>
              </View>
            )}

            {/* Creatinine and Sodium Row */}
            <View style={isSmallScreen ? styles.formColumn : styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Creatinine</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                    <Icon name="help-circle-outline" size={responsive.fontSize(18)} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 0-1-15</Text>
              </View>

              {!isSmallScreen && (
                <View style={styles.formItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Sodium</Text>
                    <TouchableOpacity>
                      <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                      <Icon name="help-circle-outline" size={responsive.fontSize(18)} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.range}>Range: 120-170</Text>
                </View>
              )}
            </View>
            
            {/* Sodium Field for Small Screens */}
            {isSmallScreen && (
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Sodium</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                    <Icon name="help-circle-outline" size={responsive.fontSize(18)} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.range}>Range: 120-170</Text>
              </View>
            )}

            {/* Albumin and Sex Row */}
            <View style={isSmallScreen ? styles.formColumn : styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Albumin</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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

              {!isSmallScreen && (
                <View style={styles.formItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Sex</Text>
                    <TouchableOpacity>
                      <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sexButtons}>
                    <View
                      style={[styles.sexButton, sex === 'Female' && styles.sexButtonActive, styles.disabledButton]}
                      pointerEvents="none"
                    >
                      <Text style={[styles.sexText, sex === 'Female' && styles.sexTextActive]}>
                        Female
                      </Text>
                    </View>
                    <View
                      style={[styles.sexButton, sex === 'Male' && styles.sexButtonActive, styles.disabledButton]}
                      pointerEvents="none"
                    >
                      <Text style={[styles.sexText, sex === 'Male' && styles.sexTextActive]}>
                        Male
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            
            {/* Sex Selection for Small Screens */}
            {isSmallScreen && (
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Sex</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.sexButtons}>
                  <View
                    style={[styles.sexButton, sex === 'Female' && styles.sexButtonActive, styles.disabledButton]}
                    pointerEvents="none"
                  >
                    <Text style={[styles.sexText, sex === 'Female' && styles.sexTextActive]}>
                      Female
                    </Text>
                  </View>
                  <View
                    style={[styles.sexButton, sex === 'Male' && styles.sexButtonActive, styles.disabledButton]}
                    pointerEvents="none"
                  >
                    <Text style={[styles.sexText, sex === 'Male' && styles.sexTextActive]}>
                      Male
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* AST and ALT Row */}
            <View style={isSmallScreen ? styles.formColumn : styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>AST</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={ast}
                    onChangeText={setAst}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>U/L</Text>
                </View>
                <Text style={styles.range}>Range: 10-40</Text>
              </View>

              {!isSmallScreen && (
                <View style={styles.formItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>ALT</Text>
                    <TouchableOpacity>
                      <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={alt}
                      onChangeText={setAlt}
                      placeholder="—"
                      keyboardType="decimal-pad"
                    />
                    <Text style={styles.unit}>U/L</Text>
                  </View>
                  <Text style={styles.range}>Range: 7-40</Text>
                </View>
              )}
            </View>

            {/* ALT Field for Small Screens */}
            {isSmallScreen && (
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>ALT</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={alt}
                    onChangeText={setAlt}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>U/L</Text>
                </View>
                <Text style={styles.range}>Range: 7-40</Text>
              </View>
            )}

            {/* Platelet Count and Hemoglobin Row */}
            <View style={isSmallScreen ? styles.formColumn : styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Platelet Count</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={plateletCount}
                    onChangeText={setPlateletCount}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>platelets/µL</Text>
                </View>
                <Text style={styles.range}>Range: 150000-450000</Text>
              </View>

              {!isSmallScreen && (
                <View style={styles.formItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Hemoglobin</Text>
                    <TouchableOpacity>
                      <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={hemoglobin}
                      onChangeText={setHemoglobin}
                      placeholder="—"
                      keyboardType="decimal-pad"
                    />
                    <Text style={styles.unit}>g/dL</Text>
                  </View>
                  <Text style={styles.range}>Range: 12-17</Text>
                </View>
              )}
            </View>

            {/* Hemoglobin Field for Small Screens */}
            {isSmallScreen && (
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Hemoglobin</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={hemoglobin}
                    onChangeText={setHemoglobin}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>g/dL</Text>
                </View>
                <Text style={styles.range}>Range: 12-17</Text>
              </View>
            )}

            {/* WBC and Potassium Row */}
            <View style={isSmallScreen ? styles.formColumn : styles.formRow}>
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>WBC</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={wbc}
                    onChangeText={setWbc}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>cells/µL</Text>
                </View>
                <Text style={styles.range}>Range: 4000-11000</Text>
              </View>

              {!isSmallScreen && (
                <View style={styles.formItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Potassium</Text>
                    <TouchableOpacity>
                      <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={potassium}
                      onChangeText={setPotassium}
                      placeholder="—"
                      keyboardType="decimal-pad"
                    />
                    <Text style={styles.unit}>mEq/L</Text>
                  </View>
                  <Text style={styles.range}>Range: 3.5-5.1</Text>
                </View>
              )}
            </View>

            {/* Potassium Field for Small Screens */}
            {isSmallScreen && (
              <View style={styles.formItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Potassium</Text>
                  <TouchableOpacity>
                    <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={potassium}
                    onChangeText={setPotassium}
                    placeholder="—"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>mEq/L</Text>
                </View>
                <Text style={styles.range}>Range: 3.5-5.1</Text>
              </View>
            )}

            {/* Ammonia */}
            <View style={styles.formItem}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Ammonia</Text>
                <TouchableOpacity>
                  <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={ammonia}
                  onChangeText={setAmmonia}
                  placeholder="—"
                  keyboardType="decimal-pad"
                />
                <Text style={styles.unit}>umol/L</Text>
              </View>
              <Text style={styles.range}>Range: 11-35</Text>
            </View>

            {/* Dialysis Toggle */}
            <View style={styles.dialysisRow}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>On Dialysis?</Text>
                <TouchableOpacity>
                  <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
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
                  <Icon name="information-circle-outline" size={responsive.fontSize(18)} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add context for this lab set"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Results Preview */}
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>MELD Results</Text>
            <View style={isSmallScreen ? styles.resultColumn : styles.resultRow}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>MELD-Na</Text>
                <Text style={styles.resultValue}>—</Text>
                <Text style={styles.resultHint}>Updated when all fields valid</Text>
              </View>
              {!isSmallScreen && <View style={styles.resultDivider} />}
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>MELD 3.0</Text>
                <Text style={styles.resultValue}>—</Text>
                <Text style={styles.resultHint}>Uses bilirubin, INR, creatinine, albumin, sex</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={isSmallScreen ? styles.actionsColumn : styles.actions}>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveAndRecalculate}
              disabled={meldLoading}
            >
              <Text style={styles.saveText}>
                {meldLoading ? 'Saving...' : 'Save & Recalculate'}
              </Text>
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
    padding: responsive.padding(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    padding: responsive.padding(16),
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: responsive.margin(4),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: '#6b7280',
    marginBottom: responsive.margin(24),
  },
  methodCard: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  methodColumn: {
    flexDirection: 'column',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  methodText: {
    fontSize: responsive.fontSize(15),
    fontWeight: '600',
    color: '#1f2937',
    marginTop: responsive.margin(8),
  },
  methodSubtext: {
    fontSize: responsive.fontSize(12),
    color: '#6b7280',
    textAlign: 'center',
    marginTop: responsive.margin(4),
  },
  formCard: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formRow: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  formColumn: {
    flexDirection: 'column',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  formItem: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(8),
  },
  label: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(12),
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    paddingVertical: responsive.padding(10),
    fontSize: responsive.fontSize(15),
    color: '#1f2937',
  },
  unit: {
    fontSize: responsive.fontSize(13),
    color: '#6b7280',
    marginLeft: responsive.width(8),
  },
  range: {
    fontSize: responsive.fontSize(11),
    color: '#9ca3af',
    marginTop: responsive.margin(4),
  },
  sexButtons: {
    flexDirection: 'row',
    gap: responsive.width(8),
  },
  sexButton: {
    flex: 1,
    paddingVertical: responsive.padding(10),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  disabledButton: {
    opacity: 0.6,
  },
  sexButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  sexText: {
    fontSize: responsive.fontSize(14),
    color: '#374151',
  },
  sexTextActive: {
    color: '#fff',
  },
  dialysisRow: {
    marginBottom: responsive.margin(16),
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: responsive.width(8),
    marginTop: responsive.margin(8),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: responsive.padding(10),
    borderRadius: responsive.borderRadius(8),
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
    fontSize: responsive.fontSize(14),
    color: '#374151',
  },
  toggleTextActive: {
    color: '#fff',
  },
  helperText: {
    fontSize: responsive.fontSize(12),
    color: '#6b7280',
    marginTop: responsive.margin(6),
  },
  notesSection: {
    marginTop: responsive.margin(8),
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(12),
    fontSize: responsive.fontSize(14),
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    marginTop: responsive.margin(8),
    minHeight: responsive.height(80),
    textAlignVertical: 'top',
  },
  resultsCard: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: responsive.margin(16),
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  resultItem: {
    flex: 1,
  },
  resultLabel: {
    fontSize: responsive.fontSize(14),
    color: '#6b7280',
    marginBottom: responsive.margin(8),
  },
  resultValue: {
    fontSize: responsive.fontSize(28),
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: responsive.margin(8),
  },
  resultHint: {
    fontSize: responsive.fontSize(11),
    color: '#9ca3af',
    lineHeight: responsive.height(16),
  },
  resultDivider: {
    width: responsive.width(1),
    height: responsive.height(60),
    backgroundColor: '#e5e7eb',
    marginHorizontal: responsive.width(16),
  },
  actions: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  actionsColumn: {
    flexDirection: 'column',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  clearButton: {
    flex: 1,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  clearText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    backgroundColor: '#52a64a',
  },
  saveText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#fff',
  },
  insightsCard: {
    backgroundColor: '#0F7A6B',
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
  },
  insightsTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#fff',
    marginBottom: responsive.margin(12),
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: responsive.margin(8),
  },
  insightBullet: {
    fontSize: responsive.fontSize(16),
    color: '#fff',
    marginRight: responsive.width(8),
  },
  insightText: {
    fontSize: responsive.fontSize(14),
    color: '#fff',
    flex: 1,
    lineHeight: responsive.height(20),
  },
  disclaimer: {
    fontSize: responsive.fontSize(12),
    color: '#d1fae5',
    marginTop: responsive.margin(8),
    fontStyle: 'italic',
  },
});

export default MELDDataEntryScreen;