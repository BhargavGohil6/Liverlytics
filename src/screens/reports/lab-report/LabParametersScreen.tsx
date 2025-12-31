import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import responsive from '../../../theme/responsive'; 
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const LabParametersScreen = () => {
  const navigation = useNavigation<any>();
  
  const { labData: reduxLabData } = useSelector((state: any) => state.reports);
  
  // Define the proper type for lab data
  type LabData = {
    bilirubin: { value: string; unit: string; flag: string };
    inr: { value: string; unit: string; flag: string };
    creatinine: { value: string; unit: string; flag: string };
    sodium: { value: string; unit: string; flag: string };
    albumin: { value: string; unit: string; flag: string };
    sex: string;
    ast: { value: string; unit: string; flag: string };
    alt: { value: string; unit: string; flag: string };
    platelet: { value: string; unit: string; flag: string };
    hemoglobin: { value: string; unit: string; flag: string };
    wbc: { value: string; unit: string; flag: string };
    potassium: { value: string; unit: string; flag: string };
    ammonia: { value: string; unit: string; flag: string };
    onDialysis: string;
  };
  
  const [labData, setLabData] = useState<LabData>({
    bilirubin: { value: '1.8', unit: '1.8mg/dL', flag: '' },
    inr: { value: '1.3', unit: '1.3 ratio', flag: 'high' },
    creatinine: { value: '1.6', unit: '1.6mg/dL', flag: 'high' },
    sodium: { value: '133', unit: '133mEq/L', flag: 'low' },
    albumin: { value: '3.2', unit: '3.2g/dL', flag: 'low' },
    sex: 'Female',
    ast: { value: '62', unit: 'U/L', flag: 'high' },
    alt: { value: '54', unit: 'U/L', flag: 'high' },
    platelet: { value: '138', unit: '13810^9/L', flag: '' },
    hemoglobin: { value: '11.9', unit: '11.9g/dL', flag: '' },
    wbc: { value: '6.4', unit: '6.410^9/L', flag: '' },
    potassium: { value: '4.0', unit: '4.0mEq/L', flag: '' },
    ammonia: { value: '—', unit: '—µmol/L', flag: '' },
    onDialysis: 'Yes',
  });
  
  useEffect(() => {
    if (reduxLabData && reduxLabData.medical_analysis && reduxLabData.medical_analysis.medical_data) {
      const medicalData = reduxLabData.medical_analysis.medical_data;
      
      // Map API response to our lab data format
      const mappedLabData = {
        bilirubin: {
          value: medicalData['Bilirubin']?.value || '1.8',
          unit: medicalData['Bilirubin']?.unit || 'mg/dL',
          flag: getFlagValue(medicalData['Bilirubin'], medicalData['Bilirubin']?.normal_range),
        },
        inr: {
          value: medicalData['INR']?.value || '1.3',
          unit: medicalData['INR']?.unit || 'ratio',
          flag: getFlagValue(medicalData['INR'], medicalData['INR']?.normal_range),
        },
        creatinine: {
          value: medicalData['Creatinine']?.value || '1.6',
          unit: medicalData['Creatinine']?.unit || 'mg/dL',
          flag: getFlagValue(medicalData['Creatinine'], medicalData['Creatinine']?.normal_range),
        },
        sodium: {
          value: medicalData['Sodium']?.value || '133',
          unit: medicalData['Sodium']?.unit || 'mEq/L',
          flag: getFlagValue(medicalData['Sodium'], medicalData['Sodium']?.normal_range),
        },
        albumin: {
          value: medicalData['Albumin']?.value || '3.2',
          unit: medicalData['Albumin']?.unit || 'g/dL',
          flag: getFlagValue(medicalData['Albumin'], medicalData['Albumin']?.normal_range),
        },
        sex: 'Female', // Default value, can be updated if provided in API
        ast: {
          value: medicalData['AST']?.value || '62',
          unit: medicalData['AST']?.unit || 'U/L',
          flag: getFlagValue(medicalData['AST'], medicalData['AST']?.normal_range),
        },
        alt: {
          value: medicalData['ALT']?.value || '54',
          unit: medicalData['ALT']?.unit || 'U/L',
          flag: getFlagValue(medicalData['ALT'], medicalData['ALT']?.normal_range),
        },
        platelet: {
          value: medicalData['Platelet Count']?.value || '138',
          unit: medicalData['Platelet Count']?.unit || '10^9/L',
          flag: getFlagValue(medicalData['Platelet Count'], medicalData['Platelet Count']?.normal_range),
        },
        hemoglobin: {
          value: medicalData['Hemoglobin']?.value || '11.9',
          unit: medicalData['Hemoglobin']?.unit || 'g/dL',
          flag: getFlagValue(medicalData['Hemoglobin'], medicalData['Hemoglobin']?.normal_range),
        },
        wbc: {
          value: medicalData['WBC Count']?.value || '6.4',
          unit: medicalData['WBC Count']?.unit || '10^9/L',
          flag: getFlagValue(medicalData['WBC Count'], medicalData['WBC Count']?.normal_range),
        },
        potassium: {
          value: medicalData['Potassium']?.value || '4.0',
          unit: medicalData['Potassium']?.unit || 'mEq/L',
          flag: getFlagValue(medicalData['Potassium'], medicalData['Potassium']?.normal_range),
        },
        ammonia: {
          value: medicalData['Ammonia']?.value || '—',
          unit: medicalData['Ammonia']?.unit || 'µmol/L',
          flag: getFlagValue(medicalData['Ammonia'], medicalData['Ammonia']?.normal_range),
        },
        onDialysis: 'Yes', // Default value, can be updated if provided in API
      };
      
      setLabData(mappedLabData);
    }
  }, [reduxLabData]);
  
  // Helper function to determine flag based on normal range
  const getFlagValue = (data: any, normalRange: string | undefined) => {
    if (!data || !normalRange || !data.value) return '';
    
    const value = parseFloat(data.value);
    if (isNaN(value)) return '';
    
    // Parse normal range (e.g., "4,000-11,000")
    const rangeMatch = normalRange.match(/([\d,]+)-([\d,]+)/);
    if (!rangeMatch) return '';
    
    const min = parseFloat(rangeMatch[1].replace(/,/g, ''));
    const max = parseFloat(rangeMatch[2].replace(/,/g, ''));
    
    if (value < min) return 'low';
    if (value > max) return 'high';
    
    return '';
  };

  const renderParameterRow = (label: string, extracted: string, unit: string, flag: string, hasTest: boolean = true) => (
    <View style={styles.parameterRow}>
      <Text style={styles.parameterLabel}>{label}</Text>
      <View style={styles.extractedContainer}>
        <Text style={styles.extractedValue}>
          {extracted}
          {flag && (
            <View style={[styles.flagBadge, flag === 'high' ? styles.highBadge : styles.lowBadge]}>
              <Text style={styles.flagText}>{flag}</Text>
            </View>
          )}
        </Text>
        {hasTest && <Text style={styles.testInfo}>+4 since last{'\n'}test</Text>}
      </View>
      <Text style={styles.unitValue}>{unit}</Text>
    </View>
  );

  // Render parameter row from lab data
  const renderLabDataRow = (label: string, paramKey: keyof LabData) => {
    const paramData = labData[paramKey];
    if (typeof paramData === 'object' && 'value' in paramData && 'unit' in paramData && 'flag' in paramData) {
      return renderParameterRow(label, paramData.value, paramData.unit, paramData.flag);
    }
    return null; // Return null for non-object values like 'sex' and 'onDialysis'
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color="#000" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Lab Parameters</Text>
            <Text style={styles.headerSubtitle}>
              Review and edit extracted values
            </Text>
          </View>
        </View>

        {/* Parameters Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Parameter</Text>
          <Text style={styles.tableHeaderText}>Extracted</Text>
          <Text style={styles.tableHeaderText}>Edit</Text>
        </View>

        {renderLabDataRow('Bilirubin', 'bilirubin')}
        {renderLabDataRow('INR', 'inr')}
        {renderLabDataRow('Creatinine', 'creatinine')}
        {renderLabDataRow('Sodium', 'sodium')}
        {renderLabDataRow('Albumin', 'albumin')}

        {/* Sex Selection */}
        <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Sex</Text>
          <View style={styles.sexButtons}>
            <TouchableOpacity
              style={[styles.sexButton, labData.sex === 'Female' && styles.sexButtonActive]}
              onPress={() => setLabData({ ...labData, sex: 'Female' })}>
              <Text style={[styles.sexButtonText, labData.sex === 'Female' && styles.sexButtonTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sexButton, labData.sex === 'Male' && styles.sexButtonActive]}
              onPress={() => setLabData({ ...labData, sex: 'Male' })}>
              <Text style={[styles.sexButtonText, labData.sex === 'Male' && styles.sexButtonTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderLabDataRow('AST', 'ast')}
        {renderLabDataRow('ALT', 'alt')}
        {renderLabDataRow('Platelet Count', 'platelet')}
        {renderLabDataRow('Hemoglobin', 'hemoglobin')}
        {renderLabDataRow('WBC', 'wbc')}
        {renderLabDataRow('Potassium', 'potassium')}
        {renderLabDataRow('Ammonia', 'ammonia')}

        {/* On Dialysis */}
        <View style={styles.dialysisSection}>
          <View>
            <Text style={styles.dialysisTitle}>On Dialysis?</Text>
            <Text style={styles.dialysisSubtitle}>
              Affects creatinine handling in MELD
            </Text>
          </View>
          <View style={styles.dialysisButtons}>
            <TouchableOpacity
              style={[styles.dialysisButton, labData.onDialysis === 'No' && styles.dialysisButtonInactive]}
              onPress={() => setLabData({ ...labData, onDialysis: 'No' })}>
              <Text style={styles.dialysisButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialysisButton, labData.onDialysis === 'Yes' && styles.dialysisButtonActive]}
              onPress={() => setLabData({ ...labData, onDialysis: 'Yes' })}>
              <Text style={[styles.dialysisButtonText, styles.dialysisButtonTextActive]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add context for this lab set"
            multiline
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('MeldTrendScreen', { labData })}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={responsive.fontSize(20)} color="#fff" />
        </TouchableOpacity>

        <View style={{ height: responsive.height(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  backText: {
    fontSize: responsive.fontSize(16),
    marginLeft: responsive.margin(8),
    color: '#000',
  },
  headerContent: {
    marginTop: responsive.margin(8),
  },
  headerTitle: {
    fontSize: responsive.fontSize(20),
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    marginTop: responsive.margin(4),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: responsive.margin(8),
  },
  tableHeaderText: {
    flex: 1,
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
    color: '#666',
  },
  parameterRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  parameterLabel: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#000',
  },
  extractedContainer: {
    flex: 1,
  },
  extractedValue: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  testInfo: {
    fontSize: responsive.fontSize(10),
    color: '#999',
    marginTop: responsive.margin(2),
  },
  unitValue: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#000',
    textAlign: 'right',
  },
  flagBadge: {
    paddingHorizontal: responsive.padding(6),
    paddingVertical: responsive.padding(2),
    borderRadius: responsive.borderRadius(4),
    marginLeft: responsive.margin(4),
  },
  highBadge: {
    backgroundColor: '#FFF3CD',
  },
  lowBadge: {
    backgroundColor: '#D1ECF1',
  },
  flagText: {
    fontSize: responsive.fontSize(10),
    fontWeight: '600',
  },
  sexButtons: {
    flex: 2,
    flexDirection: 'row',
    gap: responsive.margin(8),
  },
  sexButton: {
    flex: 1,
    padding: responsive.padding(8),
    borderRadius: responsive.borderRadius(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  sexButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  sexButtonText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  sexButtonTextActive: {
    color: '#fff',
  },
  dialysisSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dialysisTitle: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  dialysisSubtitle: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    marginTop: responsive.margin(2),
  },
  dialysisButtons: {
    flexDirection: 'row',
    gap: responsive.margin(8),
  },
  dialysisButton: {
    paddingHorizontal: responsive.padding(20),
    paddingVertical: responsive.padding(8),
    borderRadius: responsive.borderRadius(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  dialysisButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  dialysisButtonInactive: {
    backgroundColor: '#F5F5F5',
  },
  dialysisButtonText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  dialysisButtonTextActive: {
    color: '#fff',
  },
  notesSection: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
  },
  notesLabel: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
    marginBottom: responsive.margin(8),
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(12),
    minHeight: responsive.height(60),
    fontSize: responsive.fontSize(14),
    textAlignVertical: 'top',
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    padding: responsive.padding(14),
    margin: responsive.margin(16),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#fff',
    fontWeight: '600',
    marginRight: responsive.margin(8),
  },
});

export default LabParametersScreen;