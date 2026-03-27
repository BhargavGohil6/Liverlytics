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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
// import { addAILabReport } from '../../slices/reportSlice';
import Toast from 'react-native-toast-message';
import { addAILabReport } from '../slices/reportSlice';
const LabParametersScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  
  const { labData: reduxLabData, loading } = useSelector((state: any) => state.reports);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Define the proper type for lab data
  type LabParameter = {
    value: string;
    unit: string;
    flag: string;
  };
  
  type LabData = {
    [key: string]: LabParameter | string;
  };
  
  const [labData, setLabData] = useState<LabData>({
    sex: user?.gender_custom || 'Female',
    onDialysis: 'Yes',
  });

  console.log('Lab Data:', labData)
  
  useEffect(() => {
    if (reduxLabData && reduxLabData.medical_analysis && reduxLabData.medical_analysis.medical_data) {
      const medicalData = reduxLabData.medical_analysis.medical_data;
      
      // Map API response to our lab data format
      const mappedLabData: LabData = {};
      
      // Map all parameters from medical_data
      Object.keys(medicalData).forEach(key => {
        mappedLabData[key] = {
          value: medicalData[key]?.value || '',
          unit: medicalData[key]?.unit || '',
          flag: getFlagValue(medicalData[key], medicalData[key]?.normal_range),
        };
      });
      
      // Set default values for non-parameter fields
      mappedLabData.sex = user?.gender_custom || 'Female'; // Use user's gender from auth
      mappedLabData.onDialysis = 'Yes'; // Default value, can be updated if provided in API
      
      setLabData(mappedLabData);
    } else if (user?.gender_custom && !reduxLabData) {
      // If there's no redux lab data but we have user gender, set it
      setLabData(prev => ({
        ...prev,
        sex: user.gender_custom || prev.sex || 'Female',
      }));
    }
  }, [reduxLabData, user]);
  
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

  const handleUpdateValue = (key: string, newValue: string) => {
    setLabData(prev => {
      const currentParam = prev[key];
      if (typeof currentParam === 'object' && 'value' in currentParam) {
        const medicalData = reduxLabData?.medical_analysis?.medical_data?.[key];
        const normalRange = medicalData?.normal_range;
        
        return {
          ...prev,
          [key]: {
            ...currentParam,
            value: newValue,
            flag: getFlagValue({ value: newValue }, normalRange),
          },
        };
      }
      return prev;
    });
  };

  const renderParameterRow = (label: string, extracted: string, unit: string, flag: string, paramKey: string, hasTest: boolean = false) => (
    <View style={styles.parameterRow}>
      <Text style={styles.parameterLabel}>{label}</Text>
      <View style={styles.extractedContainer}>
        <Text style={styles.extractedValue}>
          {reduxLabData?.medical_analysis?.medical_data?.[paramKey]?.value || extracted}
          {flag && (
            <View style={[styles.flagBadge, flag === 'high' || flag === 'low' ? styles.abnormalBadge : (flag === 'high' ? styles.highBadge : styles.lowBadge)]}>
              <Text style={[styles.flagText, (flag === 'high' || flag === 'low') && styles.abnormalFlagText]}>{flag}</Text>
            </View>
          )}
        </Text>
        {hasTest && <Text style={styles.testInfo}>+4 since last{'\n'}test</Text>}
      </View>
      <View style={styles.unitValueContainer}>
        <View style={styles.unitValueText}>
          <TextInput
            style={styles.unitValueBold}
            value={extracted}
            onChangeText={(text) => handleUpdateValue(paramKey, text)}
            keyboardType="numeric"
          />
          <Text style={styles.unitValueUnit}>{unit}</Text>
        </View>
      </View>
    </View>
  );

  // Render parameter row from lab data
  const renderLabDataRow = (label: string, paramKey: string) => {
    const paramData = labData[paramKey];
    if (paramData && typeof paramData === 'object' && 'value' in paramData && 'unit' in paramData && 'flag' in paramData) {
      const typedParamData = paramData as LabParameter;
      return renderParameterRow(label, typedParamData.value, typedParamData.unit, typedParamData.flag, paramKey);
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

        {Object.keys(labData)
          .filter(key => typeof labData[key] === 'object' && 'value' in labData[key])
          .sort() // Sort parameter names alphabetically for consistent display
          .map((paramKey, index) => {
            const element = renderLabDataRow(paramKey, paramKey);
            return element ? React.cloneElement(element, { key: paramKey }) : null;
          })
          .filter(Boolean)}

        {/* Sex Selection - Pre-filled and disabled based on user profile */}
        {/* <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Sex</Text>
          <View style={styles.sexButtons}>
            <View
              style={[styles.sexButton, labData.sex === 'Female' && styles.sexButtonActive, styles.disabledButton]}
              pointerEvents="none">
              <Text style={[styles.sexButtonText, labData.sex === 'Female' && styles.sexButtonTextActive]}>Female</Text>
            </View>
            <View
              style={[styles.sexButton, labData.sex === 'Male' && styles.sexButtonActive, styles.disabledButton]}
              pointerEvents="none">
              <Text style={[styles.sexButtonText, labData.sex === 'Male' && styles.sexButtonTextActive]}>Male</Text>
            </View>
          </View>
        </View> */}



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
              style={[styles.dialysisButton, labData.onDialysis === 'No' && styles.dialysisButtonActive]}
              onPress={() => setLabData({ ...labData, onDialysis: 'No' })}>
              <Text style={[styles.dialysisButtonText, labData.onDialysis === 'No' && styles.dialysisButtonTextActive]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialysisButton, labData.onDialysis === 'Yes' && styles.dialysisButtonActive]}
              onPress={() => setLabData({ ...labData, onDialysis: 'Yes' })}>
              <Text style={[styles.dialysisButtonText, labData.onDialysis === 'Yes' && styles.dialysisButtonTextActive]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        {/* <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add context for this lab set"
            multiline
          />
        </View> */}

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={async () => {
            // Prepare the data for the API call
            console.log('Submitting AI Lab Report Data:', labData)
            
            // Helper function to safely get parameter value from multiple possible keys
            const getParamValue = (possibleKeys: string[]) => {
              for (const key of possibleKeys) {
                const param = labData[key];
                if (param && typeof param === 'object' && 'value' in param) {
                  const value = (param as LabParameter).value;
                  if (value && value.trim() !== '') {
                    return value;
                  }
                }
              }
              return '0';
            };
            
            // Build the API data object with ALL required MELD parameters
            const aiLabReportData: any = {
              user: user?.email || '',
              
              // Required MELD parameters - must have values
              bilirubin: getParamValue(['Bilirubin', 'Total Bilirubin', 'Direct Bilirubin']),
              creatinine: getParamValue(['Creatinine', 'Serum Creatinine']),
              sodium: getParamValue(['Sodium']),
              albumin: getParamValue(['Albumin', 'Serum Albumin']),
              ast: getParamValue(['AST', 'Aspartate Aminotransferase', 'SGOT']),
              alt: getParamValue(['ALT', 'Alanine Aminotransferase', 'SGPT']),
              platelet_count: getParamValue(['Platelet Count', 'Platelets']),
              hemoglobin: getParamValue(['Hemoglobin', 'Hb']),
              wbc: getParamValue(['WBC', 'White Blood Cells']),
              potassium: getParamValue(['Potassium']),
              ammonia: getParamValue(['Ammonia']),
              inr: getParamValue(['INR', 'Prothrombin Time']),
            };
            
            console.log('Final API Data:', aiLabReportData);
            
            try {
              const resultAction = await dispatch(addAILabReport(aiLabReportData));
              if (addAILabReport.fulfilled.match(resultAction)) {
                // Success - show toast and navigate
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: resultAction.payload.message.message,
                });
                navigation.navigate('MeldTrendScreen', { labData });
              } else {
                // Error - show error toast
                const error = resultAction.payload as string || 'Failed to save AI Lab Report';
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: error,
                });
              }
            } catch (error) {
              console.error('Error submitting AI Lab Report:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred',
              });
            }
          }}
          disabled={loading}
        >
          <Text style={styles.continueButtonText}>{loading ? 'Submitting...' : 'Calculate MELD'}</Text>
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
  unitValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  unitValueText: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: responsive.borderRadius(4),
    padding: responsive.padding(4),
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: responsive.width(70),
  },
  unitValueBold: {
    fontSize: responsive.fontSize(16),
    fontWeight: 'bold',
    color: '#000',
    padding: 0,
    marginRight: responsive.margin(4),
  },
  unitValueUnit: {
    fontSize: responsive.fontSize(14),
    fontWeight: 'normal',
    color: '#000',
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
    fontSize: responsive.fontSize(5),
    fontWeight: '600',
  },
  abnormalBadge: {
    backgroundColor: '#dc3545', // Red background
    paddingHorizontal: responsive.padding(6),
    paddingVertical: responsive.padding(2),
    borderRadius: responsive.borderRadius(4),
    marginLeft: responsive.margin(4),
  },
  abnormalFlagText: {
    color: '#fff', // White text for contrast
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
  disabledButton: {
    opacity: 0.6,
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