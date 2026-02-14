import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import responsive from '../../../theme/responsive'; 
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { uploadLabReport } from '../slices/reportSlice';
import { pick, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS } from 'react-native-permissions';

const UploadLabReportScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch: any = useDispatch();
  
  const { loading, error, uploadComplete } = useSelector((state: any) => state.reports);
  
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const requestFilePermissions = async () => {
    if (Platform.OS === 'android') {
      // For Android 13 (API 33) and above, use READ_MEDIA permissions
      if (Platform.Version >= 33) {
        const permissionResult = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        
        if (permissionResult !== 'granted') {
          const requestResult = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
          return requestResult === 'granted';
        }
        return true;
      } else {
        // For older Android versions
        const permissionResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        
        if (!permissionResult) {
          const requestResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'File Access Permission',
              message: 'This app needs access to your files to upload lab reports.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return requestResult === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }
    } else {
      // iOS permission handling - Photo library permission is handled by the document picker
      // No explicit permission request needed for document picker on iOS
      return true;
    }
  };
  
  useEffect(() => {
    if (uploadComplete) {
      navigation.navigate('LabParametersScreen');
    }
  }, [uploadComplete, navigation]);

  const handleFileSelection = async () => {
    // Request permissions before file selection (mainly for Android)
    const hasPermission = await requestFilePermissions();
    
    if (!hasPermission) {
      Alert.alert('Permission Required', 'File access permission is required to upload lab reports. Please enable it in app settings.');
      return;
    }
    
    try {
      const res = await pick({
        type: ["*/*"],
      });
      
      if (res && res.length > 0) {
        setSelectedFile(res[0]);
        setFileName(res[0].name || '');
      }
      
      console.log('File selected:', res[0]);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        console.log('User cancelled the document picker');
        return;
      }
      
      // Handle permission errors
      if (err instanceof Error && err.message?.includes('permission')) {
        Alert.alert('Permission Error', 'Please allow file access permission in Settings to upload lab reports.');
        return;
      }
      
      console.log('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }
    
    dispatch(uploadLabReport({
      fileuri: selectedFile.uri,
      filename: selectedFile.name,
      filetype: selectedFile.type,
    }));
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
            <Text style={styles.headerTitle}>Upload Lab Report</Text>
            <Text style={styles.headerSubtitle}>
              AI will extract lab values for MELD calculation
            </Text>
          </View>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>Upload PDF, Image, or CSV</Text>
          <Text style={styles.uploadSubtitle}>Supported: PDF, JPG, PNG, CSV</Text>
          
          {fileName ? (
            <View style={styles.selectedFileContainer}>
              <Icon name="insert-drive-file" size={responsive.fontSize(24)} color="#333" />
              <Text style={styles.selectedFileName} numberOfLines={1} ellipsizeMode="middle">
                {fileName}
              </Text>
              <TouchableOpacity style={styles.changeFileButton} onPress={handleFileSelection}>
                <Text style={styles.changeFileButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelection}>
                <Icon name="picture-as-pdf" size={responsive.fontSize(20)} color="#333" />
                <Text style={styles.uploadButtonText}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelection}>
                <Icon name="image" size={responsive.fontSize(20)} color="#333" />
                <Text style={styles.uploadButtonText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelection}>
                <Icon name="table-chart" size={responsive.fontSize(20)} color="#333" />
                <Text style={styles.uploadButtonText}>CSV</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading && (
            <Text style={styles.extractingText}>○ Extracting lab values...</Text>
          )}
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[styles.continueButton, (!selectedFile || loading) && styles.disabledButton]}
          onPress={handleUpload}
          disabled={!selectedFile || loading}
        >
          <Text style={styles.continueButtonText}>{loading ? 'Processing...' : 'Continue'}</Text>
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
  uploadSection: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
  },
  uploadTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#000',
  },
  uploadSubtitle: {
    fontSize: responsive.fontSize(12),
    color: '#999',
    marginTop: responsive.margin(4),
  },
  uploadButtons: {
    flexDirection: 'row',
    marginTop: responsive.margin(16),
    gap: responsive.margin(12),
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: responsive.borderRadius(8),
    backgroundColor: '#FAFAFA',
  },
  uploadButtonText: {
    fontSize: responsive.fontSize(14),
    marginLeft: responsive.margin(8),
    color: '#333',
  },
  extractingText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    marginTop: responsive.margin(16),
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: responsive.borderRadius(8),
    backgroundColor: '#FAFAFA',
    marginBottom: responsive.margin(12),
  },
  selectedFileName: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#333',
    marginLeft: responsive.margin(8),
  },
  changeFileButton: {
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    backgroundColor: '#52ab3c',
    borderRadius: responsive.borderRadius(4),
  },
  changeFileButtonText: {
    fontSize: responsive.fontSize(12),
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: responsive.fontSize(12),
    color: '#d32f2f',
    marginTop: responsive.margin(8),
    textAlign: 'center',
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default UploadLabReportScreen;